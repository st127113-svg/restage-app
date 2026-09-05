"use client";

import { useState } from "react";
import { UploadStep } from "@/components/UploadStep";
import { ConfigureStep } from "@/components/ConfigureStep";
import { GeneratingStep } from "@/components/GeneratingStep";
import { ResultStep } from "@/components/ResultStep";
import type { RoomType, Style } from "@/lib/constants";

type Step = "upload" | "configure" | "generating" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("Kitchen");
  const [style, setStyle] = useState<Style>("Scandinavian");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleUpload(dataUrl: string, name: string) {
    setImageDataUrl(dataUrl);
    setFileName(name);
    setStep("configure");
  }

  async function handleGenerate() {
    if (!imageDataUrl) return;
    setError(null);
    setStep("generating");

    const [header, base64] = imageDataUrl.split(",");
    const mimeType = header.match(/data:(.*);base64/)?.[1] ?? "image/jpeg";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType, roomType, style }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Generation failed.");
      }

      setResultImage(`data:${json.mimeType};base64,${json.image}`);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      setStep("configure");
    }
  }

  return (
    <main className="mx-auto max-w-[1440px]">
      {step === "upload" && <UploadStep onUpload={handleUpload} />}

      {step === "configure" && imageDataUrl && (
        <ConfigureStep
          imageDataUrl={imageDataUrl}
          fileName={fileName}
          roomType={roomType}
          style={style}
          onChangeRoomType={setRoomType}
          onChangeStyle={setStyle}
          onChangePhoto={() => setStep("upload")}
          onGenerate={handleGenerate}
          error={error}
        />
      )}

      {step === "generating" && (
        <GeneratingStep
          roomType={roomType}
          style={style}
          onCancel={() => setStep("configure")}
        />
      )}

      {step === "result" && imageDataUrl && resultImage && (
        <ResultStep
          beforeImage={imageDataUrl}
          afterImage={resultImage}
          roomType={roomType}
          style={style}
          onTryAnotherStyle={() => setStep("configure")}
          onStartOver={() => {
            setImageDataUrl(null);
            setResultImage(null);
            setStep("upload");
          }}
        />
      )}
    </main>
  );
}
