import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-32 mb-4">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-ping"></div>
            <div className="relative flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg">
              <span className="text-6xl font-bold text-blue-500">404</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sahifa topilmadi</h1>
          <p className="text-gray-600 mb-8">Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" className="flex items-center gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Bosh sahifaga qaytish</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4" />
                <span>Profilga qaytish</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quyidagi sahifalarni ko'rishingiz mumkin:</h2>
          <ul className="space-y-2 text-left mb-6">
            <li>
              <Link href="/profile" className="text-blue-600 hover:underline flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-xs">•</span>
                <span>Profil sahifasi</span>
              </Link>
            </li>
            <li>
              <Link href="/materials" className="text-blue-600 hover:underline flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-xs">•</span>
                <span>O'quv materiallari</span>
              </Link>
            </li>
            <li>
              <Link href="/tests" className="text-blue-600 hover:underline flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-xs">•</span>
                <span>Testlar</span>
              </Link>
            </li>
            <li>
              <Link href="/courses" className="text-blue-600 hover:underline flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-xs">•</span>
                <span>Kurslar</span>
              </Link>
            </li>
          </ul>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Agar sizda savollar bo'lsa,{" "}
          <Link href="/questions" className="text-blue-600 hover:underline">
            yordam markaziga
          </Link>{" "}
          murojaat qiling
        </div>
      </div>
    </div>
  )
}

