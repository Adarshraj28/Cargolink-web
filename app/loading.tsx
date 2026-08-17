export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-offwhite px-4">
      <div className="skeleton h-6 w-56" />
      <div className="w-full max-w-2xl space-y-4">
        <div className="skeleton h-40 w-full" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
