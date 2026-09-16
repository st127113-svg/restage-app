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
    <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[280px]">
      <div className="overflow-hidden border-2 border-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageDataUrl} alt="Uploaded room" className="block w-full object-cover" />
      </div>
      <div className="flex items-center justify-between">
        <span className="truncate text-[13px] text-ink-faint">{fileName}</span>
        <button onClick={onChangePhoto} className="shrink-0 text-[13px] font-medium text-ink underline-offset-4 hover:underline">
          Change photo
        </button>
      </div>
    </div>
  );
}
