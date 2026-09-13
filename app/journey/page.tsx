import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer journey — Restage",
  description:
    "The full customer journey behind Restage: from an empty room to a priced, shoppable, hireable plan.",
};

type Category = "visualize" | "realize" | "plan";

const CATEGORY: Record<
  Category,
  { label: string; emoji: string; text: string; border: string; badge: string }
> = {
  visualize: {
    label: "Visualize moment",
    emoji: "🎨",
    text: "text-clay",
    border: "border-clay",
    badge: "bg-clay",
  },
  realize: {
    label: "Realize moment",
    emoji: "🛒",
    text: "text-[#57634A]",
    border: "border-[#57634A]",
    badge: "bg-[#57634A]",
  },
  plan: {
    label: "Plan moment",
    emoji: "💰",
    text: "text-[#B8862F]",
    border: "border-[#B8862F]",
    badge: "bg-[#B8862F]",
  },
};

type Stage = {
  index: number;
  title: string;
  userAction: string;
  aiAction: string;
  value: string;
  milestone?: Category;
};

type Phase = {
  number: string;
  title: string;
  description: string;
  stages: Stage[];
};

const MOMENTS: { category: Category; quote: string }[] = [
  {
    category: "visualize",
    quote:
      "\"I can see what my actual room could look like — before I spend anything.\"",
  },
  {
    category: "realize",
    quote: "\"I don't have to search for every product and professional myself.\"",
  },
  {
    category: "plan",
    quote: "\"I know what this will cost, and I can keep it within my budget.\"",
  },
];

const FLOW = ["Design", "Visualize", "Cost", "Adjust", "Shop", "Find Pros", "Implement"];

const PHASES: Phase[] = [
  {
    number: "PHASE 01",
    title: "Discover",
    description:
      "The user arrives with a vague goal and a real, imperfect room. The platform grounds the whole journey in their actual space.",
    stages: [
      {
        index: 1,
        title: "Enter Platform",
        userAction: "Visits the website.",
        aiAction: "Welcomes the user and frames the process.",
        value: "\"I want to improve my room but don't know where to start.\"",
      },
      {
        index: 2,
        title: "Upload Room",
        userAction: "Uploads photos — angles, empty space, existing furniture.",
        aiAction: "Analyzes the real layout and existing items.",
        value: "\"The design is based on my real room, not a generic one.\"",
      },
      {
        index: 3,
        title: "Select Room & Purpose",
        userAction: "Picks room type and describes how it's used.",
        aiAction: "Sets design goals around real usage.",
        value: "\"The design fits how I'll actually live in the space.\"",
      },
      {
        index: 4,
        title: "Space Details",
        userAction: "Adds dimensions, what to keep, remove, and needs.",
        aiAction: "Builds a realistic spatial model.",
        value: "\"The design will actually fit my room.\"",
      },
    ],
  },
  {
    number: "PHASE 02",
    title: "Design",
    description:
      "Taste, budget, and nuance come together into a first concept — one the user can keep reshaping until it's right.",
    stages: [
      {
        index: 5,
        title: "Select Style",
        userAction: "Chooses and combines design styles.",
        aiAction: "Applies the aesthetic direction to the space.",
        value: "\"The design reflects my taste.\"",
      },
      {
        index: 6,
        title: "Enter Budget",
        userAction:
          "Sets total budget and chooses scope (furniture, décor, full renovation).",
        aiAction: "Designs within a realistic financial range.",
        value: "\"I won't be shown something I can't afford.\"",
      },
      {
        index: 7,
        title: "Add Free Prompt",
        userAction: "Writes anything else in their own words.",
        aiAction: "Folds in nuance the presets can't capture.",
        value: "\"I can say what matters to me, my way.\"",
      },
      {
        index: 8,
        title: "AI Generates Design",
        userAction: "Reviews the generated concept.",
        aiAction: "Produces layout, colors, materials, and décor.",
        value: "\"I can see what my room could look like before spending a cent.\"",
        milestone: "visualize",
      },
      {
        index: 9,
        title: "Retry / Modify",
        userAction: "Requests changes — color, style, mood, items.",
        aiAction: "Iterates the design instantly.",
        value: "\"I can fine-tune without starting over.\"",
      },
    ],
  },
  {
    number: "PHASE 03",
    title: "Plan",
    description:
      "The design is translated into something buildable: what to buy, who to hire, and what it will cost.",
    stages: [
      {
        index: 10,
        title: "Identify Furniture, Materials & Services",
        userAction: "Reviews the breakdown of the finished design.",
        aiAction: "Converts the image into a concrete needs list.",
        value: "\"Now I know what I actually need to recreate this room.\"",
      },
      {
        index: 11,
        title: "Find Products & Professionals",
        userAction: "Browses recommended items and providers.",
        aiAction:
          "Matches each item and service to real suppliers, prices, and contacts.",
        value: "\"I don't have to search for everything myself.\"",
        milestone: "realize",
      },
      {
        index: 12,
        title: "Estimate Project Cost",
        userAction: "Reviews the itemized cost breakdown.",
        aiAction: "Prices each item by the right method — per m², per item, per job.",
        value: "\"I know roughly what this will cost before I buy anything.\"",
        milestone: "plan",
      },
    ],
  },
  {
    number: "PHASE 04",
    title: "Optimize",
    description:
      "The plan is checked against reality, and reshaped if the numbers don't line up — without losing the look.",
    stages: [
      {
        index: 13,
        title: "Budget Check",
        userAction: "Sees budget vs. estimated cost, side by side.",
        aiAction: "Flags any gap in plain terms — e.g. \"฿3,000 over budget.\"",
        value: "\"I know exactly where I stand financially.\"",
      },
      {
        index: 14,
        title: "Adjust to Budget",
        userAction: "Chooses \"Adjust to my budget.\"",
        aiAction: "Suggests cheaper swaps that protect the overall look.",
        value: "\"I can get the look I want without overspending.\"",
      },
    ],
  },
  {
    number: "PHASE 05",
    title: "Implement",
    description:
      "The journey ends with something a customer can actually act on — not just admire.",
    stages: [
      {
        index: 15,
        title: "Final Shopping & Implementation Plan",
        userAction: "Receives the finished plan: buy list, materials, hire list, total cost.",
        aiAction: "Compiles every prior step into one actionable checklist.",
        value: "\"I have everything I need to actually make this happen.\"",
      },
    ],
  },
];

const REVENUE = [
  {
    num: "01",
    title: "Affiliate commissions",
    body: "Every recommended product carries a purchase link to a partner store. When a customer buys through it, the platform earns a commission.",
  },
  {
    num: "02",
    title: "Advertising placements",
    body: "Furniture and home-improvement brands pay for promoted placement inside product recommendations.",
  },
  {
    num: "03",
    title: "Premium usage",
    body: "Basic design generation is free. Paid tiers unlock more generations, deeper visualization, detailed planning, and advanced budget optimization.",
  },
];

const GRID_BG =
  "bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[length:48px_48px] bg-[position:-1px_-1px]";

function StageCard({ stage }: { stage: Stage }) {
  const cat = stage.milestone ? CATEGORY[stage.milestone] : null;
  return (
    <div
      className={
        "flex w-[250px] shrink-0 flex-col rounded-md border bg-surface p-5 " +
        (cat ? cat.border : "border-line")
      }
    >
      {cat && (
        <span
          className={
            "mb-3 inline-block w-fit rounded-full px-2.5 py-1 text-[11px] text-surface " +
            cat.badge
          }
        >
          {cat.emoji} {cat.label}
        </span>
      )}
      <div className="mb-2.5 font-display text-xs text-ink-soft">Stage {stage.index}</div>
      <h3 className="mb-4 font-display text-lg leading-tight text-ink">{stage.title}</h3>
      <div className="mb-3">
        <div className="mb-0.5 text-[11px] text-ink-faint">User action</div>
        <div className="text-[13.5px] text-ink">{stage.userAction}</div>
      </div>
      <div className="mb-3">
        <div className="mb-0.5 text-[11px] text-ink-faint">AI action</div>
        <div className="text-[13.5px] text-ink">{stage.aiAction}</div>
      </div>
      <div>
        <div className="mb-0.5 text-[11px] text-ink-faint">Customer value</div>
        <div className="text-[13.5px] italic text-ink-soft">{stage.value}</div>
      </div>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <main className="mx-auto max-w-[1440px]">
      <nav className="flex items-center justify-between px-16 py-8">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          Restage
        </Link>
        <Link
          href="/"
          className="text-sm text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
        >
          ← Back to the app
        </Link>
      </nav>

      {/* HERO */}
      <section className={"border-b border-line px-16 pb-16 pt-6 " + GRID_BG}>
        <div className="mb-4 flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-clay" />
          <span className="max-w-[520px] text-xs uppercase tracking-wider text-ink-soft">
            AI-powered interior design — customer journey
          </span>
        </div>
        <h1 className="max-w-[14ch] font-display text-5xl leading-[1.06] text-ink sm:text-6xl">
          From an empty room to a room you can actually{" "}
          <em className="text-clay not-italic">build</em>.
        </h1>
        <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-ink-soft">
          Great interior design is expensive and hard to access. This platform
          doesn't stop at a pretty AI image — it walks the customer all the way
          from a photo of their room to a priced, shoppable, hireable plan.
        </p>
        <div className="mt-14 flex flex-wrap items-center font-display text-base text-ink-soft sm:text-xl">
          {FLOW.map((step, i) => (
            <span key={step} className="flex items-center">
              <span
                className={"whitespace-nowrap px-1 py-0.5 " + (step === "Adjust" ? "text-clay" : "")}
              >
                {step}
              </span>
              {i < FLOW.length - 1 && <span className="px-1.5 text-ink-faint">→</span>}
            </span>
          ))}
        </div>
      </section>

      {/* VALUE MOMENTS */}
      <section className="grid grid-cols-1 border-b border-line sm:grid-cols-3">
        {MOMENTS.map((m, i) => {
          const cat = CATEGORY[m.category];
          return (
            <div
              key={m.category}
              className={
                "border-line px-16 py-8 " +
                (i < MOMENTS.length - 1 ? "border-b sm:border-b-0 sm:border-r" : "")
              }
            >
              <div className="mb-1.5 text-[13px] text-ink-soft">Key value moment</div>
              <h3 className={"mb-1.5 font-display text-xl " + cat.text}>
                {cat.emoji} {m.category.charAt(0).toUpperCase() + m.category.slice(1)}
              </h3>
              <p className="max-w-[32ch] text-[15px] text-ink-soft">{m.quote}</p>
            </div>
          );
        })}
      </section>

      {/* PHASES */}
      {PHASES.map((phase) => (
        <section key={phase.number} className="border-b border-line px-16 pb-2 pt-12">
          <div className="mb-1 flex flex-wrap items-baseline gap-4">
            <span className="rounded-full border border-ink-soft px-3 py-0.5 font-display text-sm text-ink-soft">
              {phase.number}
            </span>
            <h2 className="font-display text-3xl text-ink">{phase.title}</h2>
          </div>
          <p className="mb-8 max-w-[46ch] text-[15px] text-ink-soft">{phase.description}</p>
          <div className="flex gap-5 overflow-x-auto pb-10">
            {phase.stages.map((stage, i) => (
              <div key={stage.index} className="flex shrink-0 items-center gap-5">
                <StageCard stage={stage} />
                {i < phase.stages.length - 1 && <span className="text-xl text-line">→</span>}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* REVENUE */}
      <section className={"px-16 pb-20 pt-14 " + GRID_BG}>
        <div className="mb-9 max-w-[560px]">
          <div className="mb-2.5 text-[13px] text-ink-soft">Business model</div>
          <h2 className="mb-2.5 font-display text-2xl text-ink sm:text-3xl">
            How this creates revenue
          </h2>
          <p className="text-[15px] text-ink-soft">
            The journey above is what the customer experiences. Underneath it,
            three revenue streams run independently of that experience — none of
            them dependent on the customer thinking about AI cost.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          {REVENUE.map((r) => (
            <div key={r.num} className="bg-bg p-6">
              <div className="mb-3.5 font-display text-2xl text-ink-soft">{r.num}</div>
              <h3 className="mb-2 text-[17px] text-ink">{r.title}</h3>
              <p className="text-sm text-ink-soft">{r.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-[60ch] border-l-2 border-line pl-3.5 text-[13px] text-ink-soft">
          AI generation cost is an internal cost of running the platform — never
          presented to the customer as a fee. What the customer sees is free
          usage, premium plans, or paid features.
        </div>
      </section>

      <footer className="flex flex-wrap justify-between gap-2.5 px-16 py-8 text-[13px] text-ink-soft">
        <div>Room to Reality — AI-powered interior design platform</div>
        <div>Customer journey map · Business & Society project</div>
      </footer>
    </main>
  );
}
