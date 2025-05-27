import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AddMaterialLoading() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Skeleton className="h-10 w-24 mr-4" />
            <div>
              <Skeleton className="h-8 w-64 mb-1" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="grid gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="grid gap-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="grid gap-3">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <Skeleton className="h-40 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-48 w-full mb-6" />

                <div className="space-y-4 mt-6">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="space-y-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

