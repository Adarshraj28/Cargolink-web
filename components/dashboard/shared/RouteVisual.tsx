export default function RouteVisual({
  from,
  to,
  progress = 0,
}: {
  from: string;
  to: string;
  progress?: number;
}) {
  return (
    <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-forest-950">
      <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <span className="block h-3 w-3 rounded-full border-2 border-sage-300 bg-forest-950" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <span className="block h-3 w-3 rounded-full border-2 border-sand-200 bg-forest-950" />
      </div>
      <svg viewBox="0 0 300 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path
          d="M20 90 C 80 30, 140 150, 200 90 S 270 40, 285 92"
          stroke="rgba(42,111,214,0.4)"
          strokeWidth="2"
          strokeDasharray="5 5"
          fill="none"
        />
        <path
          d="M20 90 C 80 30, 140 150, 200 90 S 270 40, 285 92"
          stroke="#2a6fd6"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray={`${Math.max(progress * 3, 1)} 400`}
        />
        <circle cx={20 + (progress / 100) * 265} cy={90 + Math.sin((progress / 100) * Math.PI) * 40} r="14" fill="rgba(42,111,214,0.25)">
          <animate attributeName="r" values="11;16;11" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <rect
          x={20 + (progress / 100) * 265 - 9}
          y={90 + Math.sin((progress / 100) * Math.PI) * 40 - 6}
          width="18"
          height="10"
          rx="2"
          fill="#dfe7f8"
        />
      </svg>
      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wider text-sage-200/70">
        {from}
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wider text-sage-200/70">
        {to}
      </div>
    </div>
  );
}
