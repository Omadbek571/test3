"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import {
  BarChart,
  BookOpen,
  Building,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  Languages,
  Trophy,
  Wallet,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <div className="container mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/profile/dashboard")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <BarChart className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Dashboard</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/tests/all")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <FileText className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Testlar</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/profile/courses")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Kurslar</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/schedule")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Calendar className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Jadval</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/payments/add")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Wallet className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">To'lov</div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/rating")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Trophy className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Reyting</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/mock-test")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Languages className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Mock Test</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/universities")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Building className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Universitetlar</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/profile/settings")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Clock className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Sozlamalar</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/profile/achievements")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <GraduationCap className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium">Yutuqlar</div>
            </CardContent>
          </Card>

          <Card
            className="border hover:border-red-200 bg-red-50 hover:shadow-md transition-all cursor-pointer"
            onClick={() => logout()}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <LogOut className="h-6 w-6 text-red-500 mb-2" />
              <div className="text-sm font-medium text-red-700">Chiqish</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileStats />
          </div>
          <div className="md:col-span-2">
            <ProfileTabs />
          </div>
        </div>
      </div>
    </div>
  )
}

