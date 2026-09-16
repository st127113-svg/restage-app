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
    <div className="mx-auto flex max-w-[1180px] flex-1 flex-col items-center gap-16 px-8 py-14 sm:px-16 lg:flex-row lg:items-center lg:py-20">
      <div className="flex max-w-[480px] flex-1 flex-col gap-6">
        <h1 className="font-display text-[44px] font-black leading-[1.05] text-ink">
          Upload a room.
          <br />
          Walk out priced.
        </h1>
        <p className="max-w-[42ch] text-lg leading-relaxed text-ink-soft">
          DwellWise renders a redecorated version of your space, then prices
          every piece of it — real suppliers, one plan you can actually buy.
        </p>
        <p className="text-sm text-ink-faint">No design experience needed — just a photo.</p>
      </div>

      <div className="w-full max-w-[540px] flex-1">
        <div className="border-2 border-ink bg-surface">
          <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-2.5">
            <span className="font-display text-xs font-black uppercase tracking-wide text-bg">
              Drop-off counter
            </span>
            <span className="text-xs uppercase tracking-wide text-bg/70">Aisle 01</span>
          </div>

          <div className="flex flex-col gap-5 p-7">
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
                "flex flex-col items-center gap-4 border-[1.5px] border-dashed p-10 text-center transition-colors " +
                (dragging ? "border-ink bg-yellow-soft" : "border-line bg-bg")
              }
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 18a4 4 0 0 1-1-7.87V10a5 5 0 0 1 9.8-1.4A4.5 4.5 0 0 1 17.5 17H17" />
                <path d="M12 12v8" />
                <path d="M9.5 14.5 12 12l2.5 2.5" />
              </svg>
              <div>
                <div className="font-display text-base font-bold text-ink">Drop a photo here</div>
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

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="relative inline-flex w-fit items-center gap-2 self-start bg-yellow py-3 pl-8 pr-6 font-display text-sm font-bold uppercase tracking-wide text-yellow-ink shadow-tag transition-all hover:brightness-95 active:translate-y-[2px] active:shadow-none"
              style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)" }}
            >
              <span className="absolute left-[9px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-bg" />
              Choose a photo
            </button>

            {error && <p className="text-sm text-red">{error}</p>}

            <div className="flex items-center gap-3.5 border border-line bg-bg p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/example-room.png"
                alt="Example of a well-lit, straight-on room photo"
                className="h-11 w-16 shrink-0 object-cover"
              />
              <p className="text-sm text-ink-faint">
                Works best with a well-lit, straight-on shot of the whole
                room, like the example shown.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
