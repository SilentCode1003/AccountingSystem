import { Skeleton } from './ui/skeleton'

export const LoadingTable = () => {
  return (
    <div className="flex flex-col gap-4 items-center w-full md:w-[70vw] justify-between">
      <div className="flex w-full justify-between">
        <div className="flex items-end">
          <Skeleton className="w-48 h-8" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-32 h-8" />
        </div>
      </div>
      <Skeleton className=" w-full h-80" />
    </div>
  )
}
