"use client";

import { useState } from "react";
import { AisleHeader } from "@/components/AisleHeader";
import { UploadStep } from "@/components/UploadStep";
import { RoomDetailsStep } from "@/components/RoomDetailsStep";
import { DesignBriefStep } from "@/components/DesignBriefStep";
import { GeneratingStep } from "@/components/GeneratingStep";
import { ResultStep } from "@/components/ResultStep";
import { ShoppingListStep } from "@/components/ShoppingListStep";
import { BudgetCheckStep } from "@/components/BudgetCheckStep";
import { PlanStep } from "@/components/PlanStep";
import {
  EMPTY_SPACE_DETAILS,
  type RoomType,
  type Style,
  type SpaceDetails,
} from "@/lib/constants";
import type { SuggestedProduct } from "@/lib/providers";
import { buildPrompt } from "@/lib/prompt";
import {
  CATALOG_BY_ROOM,
  estimateCost,
  type BudgetScope,
  type CatalogItem,
  type AdjustmentResult,
} from "@/lib/planning";

// The 15-stage journey from the customer journey map still drives every
// state transition below; these eight screens just group stages that
// share one department (see components/AisleHeader.tsx) onto one page
// instead of one page per stage.
type Step =
  | "upload" // 1-2
  | "roomDetails" // 3-4
  | "designBrief" // 5-7
  | "generating" // 8
  | "result" // 8-9
  | "shopping" // 10-12
  | "budgetCheck" // 13-14
  | "plan"; // 15

const SCREEN: Record<Step, { department: number; title: string; stages: string; quiet?: boolean }> = {
  upload: { department: 1, title: "Upload", stages: "1–2" },
  roomDetails: { department: 1, title: "Room details", stages: "3–4" },
  designBrief: { department: 2, title: "Design brief", stages: "5–7", quiet: true },
  generating: { department: 2, title: "Generating", stages: "8", quiet: true },
  result: { department: 2, title: "Result", stages: "8–9", quiet: true },
  shopping: { department: 3, title: "Shopping list", stages: "10–12" },
  budgetCheck: { department: 4, title: "Budget check", stages: "13–14" },
  plan: { department: 5, title: "Implementation plan", stages: "15" },
};

export default function Home() {
  const [step, setStep] = useState<Step>("upload");

  // Discover
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("Kitchen");
  const [purpose, setPurpose] = useState("");
  const [space, setSpace] = useState<SpaceDetails>(EMPTY_SPACE_DETAILS);

  // Design
  const [style, setStyle] = useState<Style>("Scandinavian");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetScope, setBudgetScope] = useState<BudgetScope>("Furniture & décor");
  const [freeNote, setFreeNote] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  // Plan
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<CatalogItem[]>([]);
  const [planItems, setPlanItems] = useState<CatalogItem[]>([]);

  const budget = Number(budgetAmount) || 0;

  function resetAll() {
    setImageDataUrl(null);
    setFileName("");
    setRoomType("Kitchen");
    setPurpose("");
    setSpace(EMPTY_SPACE_DETAILS);
    setStyle("Scandinavian");
    setBudgetAmount("");
    setBudgetScope("Furniture & décor");
    setFreeNote("");
    setResultImage(null);
    setSuggestedProducts([]);
    setError(null);
    setRefineError(null);
    setSelected({});
    setSelectedItems([]);
    setPlanItems([]);
    setStep("upload");
  }

  function handleUpload(dataUrl: string, name: string) {
    setImageDataUrl(dataUrl);
    setFileName(name);
    setStep("roomDetails");
  }

  // Calls the n8n webhook directly from the browser instead of proxying
  // through /api/generate. The full round trip (Gemini image gen +
  // furniture ID + the AI Agent matching against Lazada) can take well
  // over a minute, which blew past Vercel's serverless function time
  // limit and came back as Vercel's own HTML error page instead of
  // JSON. The browser has no such limit, so calling n8n directly avoids
  // that entirely. Requires NEXT_PUBLIC_N8N_WEBHOOK_URL to be set (it's
  // exposed to the client on purpose -- it only triggers the workflow,
  // your Lazada credentials stay inside n8n and are never sent back).
  async function callGenerate(
    note: string,
  ): Promise<
    | { ok: true; image: string; suggestedProducts: SuggestedProduct[] }
    | { ok: false; error: string }
  > {
    if (!imageDataUrl) return { ok: false, error: "No photo uploaded." };
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return {
        ok: false,
        error:
          "NEXT_PUBLIC_N8N_WEBHOOK_URL is not set. Add it in Vercel's Environment Variables (and .env.local for local dev), then redeploy.",
      };
    }
    const [header, base64] = imageDataUrl.split(",");
    const mimeType = header.match(/data:(.*);base64/)?.[1] ?? "image/jpeg";
    const prompt = buildPrompt(roomType, style, { purpose, space, freeNote: note });

    let res: Response;
    try {
      res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          roomType,
          style,
          purpose,
          space,
          freeNote: note,
          suggestedPrompt: prompt,
        }),
      });
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? `Could not reach the n8n webhook: ${err.message}`
            : "Could not reach the n8n webhook.",
      };
    }

    // Read as text first -- if n8n errored out (inactive workflow, a
    // node crash, CORS block surfaced as an opaque failure, etc.) the
    // body is often plain text or an HTML error page, not JSON, and
    // res.json() would throw an unhelpful "Unexpected token" error.
    const rawText = await res.text();
    let json: Record<string, unknown> | null = null;
    try {
      json = JSON.parse(rawText);
    } catch {
      return {
        ok: false,
        error: res.ok
          ? `n8n returned a non-JSON response: ${rawText.slice(0, 200)}`
          : `n8n returned ${res.status}: ${rawText.slice(0, 200)}`,
      };
    }

    if (!res.ok) {
      const message =
        (typeof json?.error === "string" && json.error) ||
        (typeof json?.message === "string" && json.message) ||
        `n8n returned ${res.status}.`;
      return { ok: false, error: message };
    }

    const imageBase64Result = json?.imageBase64;
    if (!imageBase64Result || typeof imageBase64Result !== "string") {
      return {
        ok: false,
        error:
          'n8n did not return an "imageBase64" field. Check the workflow\'s Respond to Webhook node.',
      };
    }
    const resultMimeType = typeof json?.mimeType === "string" ? json.mimeType : "image/png";

    const rawProducts = Array.isArray(json?.suggestedProducts) ? json.suggestedProducts : [];
    const suggestedProducts: SuggestedProduct[] = rawProducts
      .filter((p: unknown): p is Record<string, unknown> => !!p && typeof p === "object")
      .map((p: Record<string, unknown>) => ({
        item: typeof p.item === "string" ? p.item : "Item",
        matched: p.matched === true,
        name: typeof p.name === "string" ? p.name : undefined,
        price: typeof p.price === "number" ? p.price : undefined,
        currency: typeof p.currency === "string" ? p.currency : undefined,
        image: typeof p.image === "string" ? p.image : undefined,
        productUrl: typeof p.productUrl === "string" ? p.productUrl : undefined,
        reason: typeof p.reason === "string" ? p.reason : undefined,
      }));

    return {
      ok: true,
      image: `data:${resultMimeType};base64,${imageBase64Result}`,
      suggestedProducts,
    };
  }

  async function handleGenerate() {
    setError(null);
    setStep("generating");
    const result = await callGenerate(freeNote);
    if (result.ok) {
      setResultImage(result.image);
      setSuggestedProducts(result.suggestedProducts);
      setStep("result");
    } else {
      setError(result.error);
      setStep("designBrief");
    }
  }

  async function handleRefine(note: string) {
    setIsRefining(true);
    setRefineError(null);
    const combinedNote = [freeNote, note].filter((s) => s.trim()).join(". ");
    const result = await callGenerate(combinedNote);
    setIsRefining(false);
    if (result.ok) {
      setResultImage(result.image);
      setSuggestedProducts(result.suggestedProducts);
    } else {
      setRefineError(result.error);
    }
  }

  function handleEnterPlanning() {
    const initialSelected: Record<string, boolean> = {};
    for (const item of CATALOG_BY_ROOM[roomType]) initialSelected[item.id] = true;
    setSelected(initialSelected);
    setStep("shopping");
  }

  function handleToggleProduct(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }

  function handleGoToBudgetCheck(items: CatalogItem[]) {
    setSelectedItems(items);
    setStep("budgetCheck");
  }

  function handleAcceptAdjustment(result: AdjustmentResult) {
    setPlanItems(result.items);
    setStep("plan");
  }

  function handleFinishBudgetCheck() {
    setPlanItems(selectedItems);
    setStep("plan");
  }

  const screen = SCREEN[step];

  return (
    <main className="flex min-h-screen flex-col">
      <AisleHeader
        department={screen.department}
        title={screen.title}
        stages={screen.stages}
        quiet={screen.quiet}
        onHome={resetAll}
      />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        {step === "upload" && <UploadStep onUpload={handleUpload} />}

        {step === "roomDetails" && imageDataUrl && (
          <RoomDetailsStep
            imageDataUrl={imageDataUrl}
            fileName={fileName}
            roomType={roomType}
            purpose={purpose}
            space={space}
            onChangeRoomType={setRoomType}
            onChangePurpose={setPurpose}
            onChangeSpace={setSpace}
            onChangePhoto={() => setStep("upload")}
            onBack={() => setStep("upload")}
            onContinue={() => setStep("designBrief")}
          />
        )}

        {step === "designBrief" && imageDataUrl && (
          <DesignBriefStep
            imageDataUrl={imageDataUrl}
            fileName={fileName}
            style={style}
            onChangeStyle={setStyle}
            amount={budgetAmount}
            scope={budgetScope}
            onChangeAmount={setBudgetAmount}
            onChangeScope={setBudgetScope}
            freeNote={freeNote}
            onChangeFreeNote={setFreeNote}
            onChangePhoto={() => setStep("upload")}
            onBack={() => setStep("roomDetails")}
            onGenerate={handleGenerate}
            error={error}
          />
        )}

        {step === "generating" && (
          <GeneratingStep roomType={roomType} style={style} onCancel={() => setStep("designBrief")} />
        )}

        {step === "result" && imageDataUrl && resultImage && (
          <ResultStep
            beforeImage={imageDataUrl}
            afterImage={resultImage}
            roomType={roomType}
            style={style}
            isRefining={isRefining}
            refineError={refineError}
            onRefine={handleRefine}
            onTryAnotherStyle={() => setStep("designBrief")}
            onStartOver={resetAll}
            onContinue={handleEnterPlanning}
          />
        )}

        {step === "shopping" && (
          <ShoppingListStep
            roomType={roomType}
            scope={budgetScope}
            selected={selected}
            suggestedProducts={suggestedProducts}
            onToggle={handleToggleProduct}
            onBack={() => setStep("result")}
            onContinue={handleGoToBudgetCheck}
          />
        )}

        {step === "budgetCheck" && (
          <BudgetCheckStep
            items={selectedItems}
            scope={budgetScope}
            total={estimateCost(selectedItems, budgetScope)}
            budget={budget}
            onBack={() => setStep("shopping")}
            onAccept={handleAcceptAdjustment}
            onContinue={handleFinishBudgetCheck}
          />
        )}

        {step === "plan" && (
          <PlanStep
            roomType={roomType}
            style={style}
            scope={budgetScope}
            items={planItems}
            total={estimateCost(planItems, budgetScope)}
            onStartOver={resetAll}
          />
        )}
      </div>
    </main>
  );
}
