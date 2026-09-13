"use client";

import { ROOM_TYPES, PURPOSE_EXAMPLES, type RoomType } from "@/lib/constants";
import { PhotoPreview } from "./PhotoPreview";
import { Stepper } from "./Stepper";

export function PurposeStep({
  imageDataUrl,
  fileName,
  roomType,
  purpose,
  onChangeRoomType,
  onChangePurpose,
  onChangePhoto,
  onBack,
  onContinue,
}: {
  imageDataUrl: string;
  fileName: string;
  roomType: RoomType;
  purpose: string;
  onChangeRoomType: (r: RoomType) => void;
  onChangePurpose: (p: string) => void;
  onChangePhoto: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={3} />
      </nav>

      <div className="flex flex-1 gap-16 px-16 pb-16 pt-10">
        <PhotoPreview imageDataUrl={imageDataUrl} fileName={fileName} onChangePhoto={onChangePhoto} />

        <div className="flex flex-1 flex-col gap-10">
          <section>
            <h2 className="mb-2 font-display text-2xl">What room is this?</h2>
            <p className="mb-5 text-sm text-ink-soft">
              Restage uses this to keep proportions and fixtures believable.
            </p>
            <div className="flex flex-wrap gap-3">
              {ROOM_TYPES.map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeRoomType(r)}
                  className={
                    "flex h-11 items-center rounded-full border px-5 text-[15px] transition-colors " +
                    (r === roomType
                      ? "border-ink bg-ink text-surface"
                      : "border-line bg-surface text-ink-soft hover:border-ink")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 font-display text-2xl">How do you actually use it?</h2>
            <p className="mb-5 max-w-[52ch] text-sm text-ink-soft">
              A couple of sentences is plenty — this keeps the design fitting how
              you'll live in the space, not just how it looks.
            </p>
            <textarea
              value={purpose}
              onChange={(e) => onChangePurpose(e.target.value)}
              placeholder={PURPOSE_EXAMPLES[roomType]}
              rows={3}
              className="w-full max-w-[560px] rounded-xl border border-line bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
          </section>

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
