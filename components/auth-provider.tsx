// components/auth-provider.tsx (yoki sizning faylingiz joylashuvi)
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"

// Foydalanuvchi tipi (API javobiga moslashtirilgan)
type User = {
  id: number;
  full_name: string;
  email: string;
  role: string; // "admin" yoki "student" (yoki boshqa rollar)
  role_display?: string; // Qo'shimcha, agar kerak bo'lsa
  profile_picture?: string | null;
  // Agar is_superuser kabi maydonlar ham bo'lsa, ularni ham qo'shish mumkin
  is_superuser?: boolean;
} | null

// AuthContext tipi
type AuthContextType = {
  user: User
  token: string | null
  login: (credentials: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Komponent ilk marta yuklanganda tokenni va foydalanuvchi ma'lumotlarini tekshirish
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken) {
      setToken(storedToken)
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser); // localStorage'dagi user ma'lumotini ishlatamiz
        } catch (e) {
          console.error("Error parsing stored user:", e)
          localStorage.removeItem("user") // Yaroqsiz ma'lumotni o'chirish
          localStorage.removeItem("token"); // Tokenni ham o'chirish xavfsizlik uchun
          setToken(null);
        }
      } else {
        // Agar localStorage'da user bo'lmasa, lekin token bo'lsa, profilni API orqali olish
        // (Bu odatda yaxshi praktika, chunki localStorage'dagi user eskirgan bo'lishi mumkin)
        axios.get('https://testonline.pythonanywhere.com/api/profile/', { // Profil endpointingiz
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        .then(response => {
          const fetchedUser = response.data as User; // API javobidagi user strukturasiga mos
          setUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        })
        .catch(() => {
          console.warn("Failed to fetch profile with stored token. Logging out.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        });
      }
    }
    setIsLoading(false)
  }, [])

  // Yo'naltirish logikasi
  useEffect(() => {
    if (isLoading) return // Ma'lumotlar yuklanmaguncha kutish

    if (pathname === "/register") return // Ro'yxatdan o'tish sahifasini o'tkazib yuborish

    if (!user && token) {
      // Bu holat kamdan-kam uchraydi, lekin agar token bo'lib, user hali set qilinmagan bo'lsa
      // (masalan, /profile so'rovi hali tugamagan bo'lsa), kutish mumkin yoki loading ko'rsatish
      // Hozircha hech narsa qilmaymiz, keyingi effect ishga tushishini kutamiz
      return;
    }

    if (!user) {
      // Foydalanuvchi tizimga kirmagan va login sahifasida emas
      if (pathname !== "/" && !pathname.startsWith("/auth")) {
        router.push("/")
      }
    } else {
      // Foydalanuvchi tizimga kirgan
      if (pathname === "/") { // Agar login sahifasida bo'lsa
        if (user.role === "admin") { // API dan kelgan 'role' maydonini ishlatamiz
          router.push("/admin/dashboard")
        } else { // Boshqa barcha rollar uchun (masalan, "student")
          router.push("/profile")
        }
      }

      // Admin sahifalariga kirishni tekshirish
      if (pathname.startsWith("/admin") && user.role !== "admin") {
        // Agar 'admin' rolida bo'lmasa va admin sahifasiga kirmoqchi bo'lsa
        router.push("/profile") // Yoki ruxsat yo'q sahifasiga
      }
    }
  }, [user, token, isLoading, pathname, router])

  // Tizimga kirish funksiyasi
  const login = async (credentials: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://testonline.pythonanywhere.com/api/auth/login/", credentials)

      if (response.data && response.data.token && response.data.user) {
        const newToken = response.data.token
        const userDataFromApi = response.data.user as User // API dan kelgan user ma'lumotlari (bizning User tipimizga mos)

        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(userDataFromApi)) // API dan kelgan user ni to'g'ridan-to'g'ri saqlaymiz

        setToken(newToken)
        setUser(userDataFromApi) // State ni API dan kelgan user bilan yangilaymiz
        setIsLoading(false);
        return true
      } else {
        console.error("Login failed: API response missing 'token' or 'user'. Received:", response.data);
        setIsLoading(false);
        return false
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Login API error - Status:", error.response.status, "Data:", error.response.data);
      } else if (error.request) {
        console.error("Login API error - No response:", error.request);
      } else {
        console.error("Login API error - Setup:", error.message);
      }
      setIsLoading(false);
      return false
    }
  }

  // Tizimdan chiqish funksiyasi
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
