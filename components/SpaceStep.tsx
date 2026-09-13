"use client";

import type { SpaceDetails } from "@/lib/constants";
import { PhotoPreview } from "./PhotoPreview";
import { Stepper } from "./Stepper";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium text-ink">{label}</div>
      {hint && <div className="mb-2 text-[13px] text-ink-soft">{hint}</div>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface p-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";

export function SpaceStep({
  imageDataUrl,
  fileName,
  space,
  onChangeSpace,
  onChangePhoto,
  onBack,
  onContinue,
}: {
  imageDataUrl: string;
  fileName: string;
  space: SpaceDetails;
  onChangeSpace: (space: SpaceDetails) => void;
  onChangePhoto: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  function set<K extends keyof SpaceDetails>(key: K, value: SpaceDetails[K]) {
    onChangeSpace({ ...space, [key]: value });
  }

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={4} />
      </nav>

      <div className="flex flex-1 gap-16 px-16 pb-16 pt-10">
        <PhotoPreview imageDataUrl={imageDataUrl} fileName={fileName} onChangePhoto={onChangePhoto} />

        <div className="flex flex-1 flex-col gap-8">
          <div>
            <h2 className="mb-2 font-display text-2xl">Tell us about the space</h2>
            <p className="max-w-[52ch] text-sm text-ink-soft">
              Optional, but it makes the plan that comes later — dimensions,
              what to buy — a lot more realistic.
            </p>
          </div>

          <div className="grid max-w-[560px] grid-cols-2 gap-5">
            <Field label="Length (m)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={space.lengthM}
                onChange={(e) => set("lengthM", e.target.value)}
                placeholder="e.g. 4.2"
                className={inputClass}
              />
            </Field>
            <Field label="Width (m)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={space.widthM}
                onChange={(e) => set("widthM", e.target.value)}
                placeholder="e.g. 3.5"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex max-w-[560px] flex-col gap-5">
            <Field label="What should stay?" hint="Existing furniture or fixtures to keep.">
              <input
                value={space.keep}
                onChange={(e) => set("keep", e.target.value)}
                placeholder="e.g. the dining table, the rug"
                className={inputClass}
              />
            </Field>
            <Field label="What should go?" hint="Anything you want removed from the room.">
              <input
                value={space.remove}
                onChange={(e) => set("remove", e.target.value)}
                placeholder="e.g. the old bookshelf"
                className={inputClass}
              />
            </Field>
            <Field label="Anything the room needs to fit?" hint="Storage, a desk, a crib — whatever the space has to accommodate.">
              <input
                value={space.needs}
                onChange={(e) => set("needs", e.target.value)}
                placeholder="e.g. space for a home office corner"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
            >
              Continue
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
