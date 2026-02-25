interface SkeletonGridProps {
  amount?: number;
}

export default function SkeletonGrid({ amount = 8 }: SkeletonGridProps) {
  return (
    <div className="movies-grid" aria-hidden="true">
      {Array.from({ length: amount }).map((_, index) => (
        <div className="skeleton-card" key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
