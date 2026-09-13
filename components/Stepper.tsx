// Progress indicator for the 15-stage journey (see the journey map this
// mirrors). 13 individual step-dots don't fit cleanly in a nav bar, so
// this shows the 5 phases instead, with a stage counter underneath.

export const PHASES = [
  { name: "Discover", stages: [1, 2, 3, 4] },
  { name: "Design", stages: [5, 6, 7, 8, 9] },
  { name: "Plan", stages: [10, 11, 12] },
  { name: "Optimize", stages: [13, 14] },
  { name: "Implement", stages: [15] },
] as const;

const TOTAL_STAGES = 15;

function phaseIndexForStage(stage: number): number {
  return PHASES.findIndex((p) => (p.stages as readonly number[]).includes(stage));
}

export function Stepper({ stage }: { stage: number }) {
  const currentPhase = phaseIndexForStage(stage);

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-1.5">
        {PHASES.map((phase, i) => (
          <div key={phase.name} className="flex items-center gap-1.5">
            <div
              className={
                "h-1.5 w-8 rounded-full transition-colors " +
                (i < currentPhase
                  ? "bg-ink"
                  : i === currentPhase
                    ? "bg-clay"
                    : "bg-line")
              }
              title={phase.name}
            />
          </div>
        ))}
      </div>
      <span className="text-[11px] text-ink-faint">
        Stage {stage} of {TOTAL_STAGES} · {PHASES[currentPhase]?.name ?? ""}
      </span>
    </div>
  );
}
