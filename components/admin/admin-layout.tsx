"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart2, BookOpen, FileText, Home, LogOut, Settings, Users, Wallet } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"


export function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { logout } = useAuth()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setEmail(user.email || "")
      setRole(user.role || "")
    }
  }, [])
  
  const oneLetter = role[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4 hidden md:block">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-blue-700">Bilimdon Admin</h1>
            <p className="text-sm text-gray-500">SuperAdmin Panel</p>
          </div>

          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/dashboard")}>
              <Home className="mr-2 h-4 w-4" />
              Bosh sahifa
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/users")}>
              <Users className="mr-2 h-4 w-4" />
              Foydalanuvchilar
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/tests")}>
              <FileText className="mr-2 h-4 w-4" />
              Testlar
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/materials")}>
              <BookOpen className="mr-2 h-4 w-4" />
              Materiallar
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/payments")}>
              <Wallet className="mr-2 h-4 w-4" />
              To'lovlar
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/statistics")}>
              <BarChart2 className="mr-2 h-4 w-4" />
              Statistika
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Sozlamalar
            </Button>
          </nav>

          <div className="absolute bottom-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Chiqish
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.push("/admin/settings")}>
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="font-medium text-blue-700">{oneLetter || 0}</span>
                  </div>
                  <div>
                    {/* //////////////////////////////////////////////////////////// */}
                    <div className="text-sm font-medium">{role || "user"}</div>
                    <div className="text-xs text-gray-500">{email || "email@gmail.com"}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  )
}

