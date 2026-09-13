export function PhotoPreview({
  imageDataUrl,
  fileName,
  onChangePhoto,
}: {
  imageDataUrl: string;
  fileName: string;
  onChangePhoto: () => void;
}) {
  return (
    <div className="flex w-[300px] shrink-0 flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageDataUrl} alt="Uploaded room" className="block w-full object-cover" />
      </div>
      <div className="flex items-center justify-between">
        <span className="truncate text-sm text-ink-faint">{fileName}</span>
        <button onClick={onChangePhoto} className="shrink-0 text-sm text-clay hover:text-ink">
          Change photo
        </button>
      </div>
    </div>
  );
}
