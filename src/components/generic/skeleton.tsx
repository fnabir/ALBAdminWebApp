import { Skeleton } from "@/components/ui/skeleton";

export default function RowSkeleton({repeat = 3, className, skeletonClassName = "h-14"} : {repeat?: number, className?: string, skeletonClassName?: string}) {
  return (
    <div className={className ?? "space-y-2"}>
      {
        Array.from({ length: repeat }).map((_, i) => (
          <Skeleton key={i} className={`w-full ${skeletonClassName}`} />
        ))
      }
    </div>
  );
}