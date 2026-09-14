"use client";

import { useState } from "react";
import { UploadStep } from "@/components/UploadStep";
import { PurposeStep } from "@/components/PurposeStep";
import { SpaceStep } from "@/components/SpaceStep";
import { StyleStep } from "@/components/StyleStep";
import { BudgetStep } from "@/components/BudgetStep";
import { FreePromptStep } from "@/components/FreePromptStep";
import { GeneratingStep } from "@/components/GeneratingStep";
import { ResultStep } from "@/components/ResultStep";
import { NeedsStep } from "@/components/NeedsStep";
import { ProductsStep } from "@/components/ProductsStep";
import { CostStep } from "@/components/CostStep";
import { BudgetCheckStep } from "@/components/BudgetCheckStep";
import { AdjustStep } from "@/components/AdjustStep";
import { PlanStep } from "@/components/PlanStep";
import {
  EMPTY_SPACE_DETAILS,
  type RoomType,
  type Style,
  type SpaceDetails,
} from "@/lib/constants";
import type { SuggestedProduct } from "@/lib/providers";
import {
  CATALOG_BY_ROOM,
  estimateCost,
  type BudgetScope,
  type CatalogItem,
  type AdjustmentResult,
} from "@/lib/planning";

type Step =
  | "upload"
  | "purpose"
  | "space"
  | "style"
  | "budget"
  | "prompt"
  | "generating"
  | "result"
  | "needs"
  | "products"
  | "cost"
  | "budgetCheck"
  | "adjust"
  | "plan";

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
    setStep("purpose");
  }

  async function callGenerate(
    note: string,
  ): Promise<
    | { ok: true; image: string; suggestedProducts: SuggestedProduct[] }
    | { ok: false; error: string }
  > {
    if (!imageDataUrl) return { ok: false, error: "No photo uploaded." };
    const [header, base64] = imageDataUrl.split(",");
    const mimeType = header.match(/data:(.*);base64/)?.[1] ?? "image/jpeg";

    try {
      const res = await fetch("/api/generate", {
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
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed.");
      return {
        ok: true,
        image: `data:${json.mimeType};base64,${json.image}`,
        suggestedProducts: Array.isArray(json.suggestedProducts) ? json.suggestedProducts : [],
      };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Generation failed." };
    }
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
      setStep("prompt");
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
    setStep("needs");
  }

  function handleToggleProduct(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }

  function handleGoToCost() {
    const items = CATALOG_BY_ROOM[roomType].filter((item) => selected[item.id] ?? true);
    setSelectedItems(items);
    setStep("cost");
  }

  function handleAcceptAdjustment(result: AdjustmentResult) {
    setPlanItems(result.items);
    setStep("plan");
  }

  function handleKeepOriginal() {
    setPlanItems(selectedItems);
    setStep("plan");
  }

  function handleFinishBudgetCheck() {
    setPlanItems(selectedItems);
    setStep("plan");
  }

  return (
    <main className="mx-auto max-w-[1440px]">
      {step === "upload" && <UploadStep onUpload={handleUpload} />}

      {step === "purpose" && imageDataUrl && (
        <PurposeStep
          imageDataUrl={imageDataUrl}
          fileName={fileName}
          roomType={roomType}
          purpose={purpose}
          onChangeRoomType={setRoomType}
          onChangePurpose={setPurpose}
          onChangePhoto={() => setStep("upload")}
          onBack={() => setStep("upload")}
          onContinue={() => setStep("space")}
        />
      )}

      {step === "space" && imageDataUrl && (
        <SpaceStep
          imageDataUrl={imageDataUrl}
          fileName={fileName}
          space={space}
          onChangeSpace={setSpace}
          onChangePhoto={() => setStep("upload")}
          onBack={() => setStep("purpose")}
          onContinue={() => setStep("style")}
        />
      )}

      {step === "style" && imageDataUrl && (
        <StyleStep
          imageDataUrl={imageDataUrl}
          fileName={fileName}
          style={style}
          onChangeStyle={setStyle}
          onChangePhoto={() => setStep("upload")}
          onBack={() => setStep("space")}
          onContinue={() => setStep("budget")}
        />
      )}

      {step === "budget" && imageDataUrl && (
        <BudgetStep
          imageDataUrl={imageDataUrl}
          fileName={fileName}
          amount={budgetAmount}
          scope={budgetScope}
          onChangeAmount={setBudgetAmount}
          onChangeScope={setBudgetScope}
          onChangePhoto={() => setStep("upload")}
          onBack={() => setStep("style")}
          onContinue={() => setStep("prompt")}
        />
      )}

      {step === "prompt" && imageDataUrl && (
        <FreePromptStep
          imageDataUrl={imageDataUrl}
          fileName={fileName}
          freeNote={freeNote}
          onChangeFreeNote={setFreeNote}
          onChangePhoto={() => setStep("upload")}
          onBack={() => setStep("budget")}
          onGenerate={handleGenerate}
          error={error}
        />
      )}

      {step === "generating" && <GeneratingStep roomType={roomType} style={style} onCancel={() => setStep("prompt")} />}

      {step === "result" && imageDataUrl && resultImage && (
        <ResultStep
          beforeImage={imageDataUrl}
          afterImage={resultImage}
          roomType={roomType}
          style={style}
          isRefining={isRefining}
          refineError={refineError}
          onRefine={handleRefine}
          onTryAnotherStyle={() => setStep("style")}
          onStartOver={resetAll}
          onContinue={handleEnterPlanning}
        />
      )}

      {step === "needs" && (
        <NeedsStep roomType={roomType} onBack={() => setStep("result")} onContinue={() => setStep("products")} />
      )}

      {step === "products" && (
        <ProductsStep
          roomType={roomType}
          selected={selected}
          suggestedProducts={suggestedProducts}
          onToggle={handleToggleProduct}
          onBack={() => setStep("needs")}
          onContinue={handleGoToCost}
        />
      )}

      {step === "cost" && (
        <CostStep
          items={selectedItems}
          scope={budgetScope}
          onBack={() => setStep("products")}
          onContinue={() => setStep("budgetCheck")}
        />
      )}

      {step === "budgetCheck" && (
        <BudgetCheckStep
          total={estimateCost(selectedItems, budgetScope)}
          budget={budget}
          onBack={() => setStep("cost")}
          onAdjust={() => setStep("adjust")}
          onContinue={handleFinishBudgetCheck}
        />
      )}

      {step === "adjust" && (
        <AdjustStep
          items={selectedItems}
          scope={budgetScope}
          budget={budget}
          onBack={() => setStep("budgetCheck")}
          onAccept={handleAcceptAdjustment}
          onKeepOriginal={handleKeepOriginal}
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
    </main>
  );
}
