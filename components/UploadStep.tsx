"use client";

import { useRef, useState } from "react";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";

export function UploadStep({
  onUpload,
}: {
  onUpload: (dataUrl: string, fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG or PNG).");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`Image is too large. Max ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string, file.name);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 py-8">
        <div className="font-display text-xl font-semibold">Restage</div>
      </nav>

      <div className="flex flex-1 items-center gap-20 px-16 pb-16">
        <div className="flex max-w-[520px] flex-1 flex-col gap-7">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-clay" />
            <span className="text-xs uppercase tracking-wider text-ink-soft">
              Room redesign, in one upload
            </span>
          </div>
          <h1 className="font-display text-5xl leading-[1.08] text-ink">
            See your room,
            <br />
            reimagined.
          </h1>
          <p className="max-w-[440px] text-lg leading-relaxed text-ink-soft">
            Upload a photo of any room, pick a style, and Restage renders a
            fully decorated version of the same space in under a minute.
          </p>
          <p className="text-sm text-ink-faint">
            No design experience needed — just a photo.
          </p>
        </div>

        <div className="max-w-[560px] flex-1">
          <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-10">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={
                "flex flex-col items-center gap-4 rounded-xl border-[1.5px] border-dashed bg-bg p-10 text-center transition-colors " +
                (dragging ? "border-clay" : "border-line")
              }
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--clay)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 18a4 4 0 0 1-1-7.87V10a5 5 0 0 1 9.8-1.4A4.5 4.5 0 0 1 17.5 17H17" />
                <path d="M12 12v8" />
                <path d="M9.5 14.5 12 12l2.5 2.5" />
              </svg>
              <div>
                <div className="text-base font-medium">Drag a photo here</div>
                <div className="mt-1 text-sm text-ink-faint">
                  or click to browse · JPG or PNG, up to{" "}
                  {MAX_UPLOAD_BYTES / (1024 * 1024)}MB
                </div>
              </div>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center gap-3.5 rounded-lg bg-bg p-4">
              <RoomIcon />
              <p className="text-sm text-ink-faint">
                Works best with a well-lit, straight-on shot of the whole
                room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomIcon() {
  return (
    <svg width="56" height="40" viewBox="0 0 140 100" className="shrink-0 rounded-md">
      <rect width="140" height="100" fill="var(--surface-2)" />
      <polygon points="0,100 140,100 110,70 30,70" fill="oklch(0.9 0.012 75)" />
      <rect x="30" y="18" width="80" height="52" fill="none" stroke="var(--ink-faint)" strokeWidth={1.5} />
      <rect x="52" y="28" width="36" height="24" fill="none" stroke="var(--ink-faint)" strokeWidth={1.2} />
      <line x1="70" y1="28" x2="70" y2="52" stroke="var(--ink-faint)" strokeWidth={1.2} />
    </svg>
  );
}
