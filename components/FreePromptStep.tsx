"use client";

import { PhotoPreview } from "./PhotoPreview";
import { Stepper } from "./Stepper";

export function FreePromptStep({
  imageDataUrl,
  fileName,
  freeNote,
  onChangeFreeNote,
  onChangePhoto,
  onBack,
  onGenerate,
  error,
}: {
  imageDataUrl: string;
  fileName: string;
  freeNote: string;
  onChangeFreeNote: (v: string) => void;
  onChangePhoto: () => void;
  onBack: () => void;
  onGenerate: () => void;
  error: string | null;
}) {
  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={7} />
      </nav>

      <div className="flex flex-1 gap-16 px-16 pb-16 pt-10">
        <PhotoPreview imageDataUrl={imageDataUrl} fileName={fileName} onChangePhoto={onChangePhoto} />

        <div className="flex flex-1 flex-col gap-10">
          <section>
            <h2 className="mb-2 font-display text-2xl">Anything else?</h2>
            <p className="mb-5 max-w-[52ch] text-sm text-ink-soft">
              Say whatever matters to you that the presets couldn&rsquo;t
              capture — a color you love, something you&rsquo;re allergic to,
              a mood word. Totally optional.
            </p>
            <textarea
              value={freeNote}
              onChange={(e) => onChangeFreeNote(e.target.value)}
              placeholder="e.g. lots of natural light, no dark colors, I have a cat"
              rows={4}
              className="w-full max-w-[560px] rounded-xl border border-line bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-4">
            <button
              onClick={onGenerate}
              className="flex h-[52px] w-fit items-center gap-2.5 rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
              </svg>
              Generate my redesign
            </button>
            <button onClick={onBack} className="text-sm text-ink-soft hover:text-ink">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
