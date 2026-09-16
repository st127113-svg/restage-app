"use client";

import { ROOM_TYPES, PURPOSE_EXAMPLES, type RoomType, type SpaceDetails } from "@/lib/constants";
import { PhotoPreview } from "./PhotoPreview";
import { primaryButton, textLink } from "./buttons";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium text-ink">{label}</div>
      {hint && <div className="mb-2 text-[13px] text-ink-soft">{hint}</div>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full border-[1.5px] border-line bg-surface p-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";

export function RoomDetailsStep({
  imageDataUrl,
  fileName,
  roomType,
  purpose,
  space,
  onChangeRoomType,
  onChangePurpose,
  onChangeSpace,
  onChangePhoto,
  onBack,
  onContinue,
}: {
  imageDataUrl: string;
  fileName: string;
  roomType: RoomType;
  purpose: string;
  space: SpaceDetails;
  onChangeRoomType: (r: RoomType) => void;
  onChangePurpose: (p: string) => void;
  onChangeSpace: (space: SpaceDetails) => void;
  onChangePhoto: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  function setSpace<K extends keyof SpaceDetails>(key: K, value: SpaceDetails[K]) {
    onChangeSpace({ ...space, [key]: value });
  }

  return (
    <div className="mx-auto flex max-w-[1180px] flex-1 flex-col gap-10 px-8 py-10 sm:px-16 lg:flex-row lg:gap-16">
      <PhotoPreview imageDataUrl={imageDataUrl} fileName={fileName} onChangePhoto={onChangePhoto} />

      <div className="flex flex-1 flex-col">
        <section className="flex flex-col gap-8 pb-10">
          <div>
            <h1 className="mb-2 font-display text-[28px] font-black text-ink">What room is this?</h1>
            <p className="text-sm text-ink-soft">DwellWise uses this to keep proportions and fixtures believable.</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {ROOM_TYPES.map((r) => (
              <button
                key={r}
                onClick={() => onChangeRoomType(r)}
                className={
                  "flex h-11 items-center border-2 px-5 text-[15px] font-medium transition-colors " +
                  (r === roomType
                    ? "border-ink bg-ink text-bg"
                    : "border-line bg-surface text-ink-soft hover:border-ink hover:text-ink")
                }
              >
                {r}
              </button>
            ))}
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-bold text-ink">How do you actually use it?</h2>
            <p className="mb-4 max-w-[52ch] text-sm text-ink-soft">
              A couple of sentences is plenty — this keeps the design fitting
              how you&rsquo;ll live in the space, not just how it looks.
            </p>
            <textarea
              value={purpose}
              onChange={(e) => onChangePurpose(e.target.value)}
              placeholder={PURPOSE_EXAMPLES[roomType]}
              rows={3}
              className={`${inputClass} max-w-[560px]`}
            />
          </div>
        </section>

        <div className="flex items-center gap-3 border-t-2 border-line-strong py-6">
          <span className="font-display text-[11px] font-black uppercase tracking-wide text-ink-faint">
            Bay 02
          </span>
          <span className="text-[11px] uppercase tracking-wide text-ink-faint">The space itself</span>
        </div>

        <section className="flex flex-col gap-6 pb-10">
          <p className="max-w-[52ch] text-sm text-ink-soft">
            Optional, but it makes the plan that comes later — dimensions,
            what to buy — a lot more realistic.
          </p>

          <div className="grid max-w-[560px] grid-cols-2 gap-5">
            <Field label="Length (m)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={space.lengthM}
                onChange={(e) => setSpace("lengthM", e.target.value)}
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
                onChange={(e) => setSpace("widthM", e.target.value)}
                placeholder="e.g. 3.5"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex max-w-[560px] flex-col gap-5">
            <Field label="What should stay?" hint="Existing furniture or fixtures to keep.">
              <input
                value={space.keep}
                onChange={(e) => setSpace("keep", e.target.value)}
                placeholder="e.g. the dining table, the rug"
                className={inputClass}
              />
            </Field>
            <Field label="What should go?" hint="Anything you want removed from the room.">
              <input
                value={space.remove}
                onChange={(e) => setSpace("remove", e.target.value)}
                placeholder="e.g. the old bookshelf"
                className={inputClass}
              />
            </Field>
            <Field label="Anything the room needs to fit?" hint="Storage, a desk, a crib — whatever the space has to accommodate.">
              <input
                value={space.needs}
                onChange={(e) => setSpace("needs", e.target.value)}
                placeholder="e.g. space for a home office corner"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <div className="flex items-center gap-5">
          <button onClick={onContinue} className={primaryButton}>
            Continue
          </button>
          <button onClick={onBack} className={textLink}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
