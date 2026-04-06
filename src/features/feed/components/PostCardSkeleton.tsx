import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title / Content */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Grid data */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Skeleton className="h-8 w-1/4 rounded-md" />
        <Skeleton className="h-8 w-1/4 rounded-md" />
      </CardFooter>
    </Card>
  );
}
