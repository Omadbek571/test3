"use client"

import type React from "react"
import { useState, useEffect } from "react" // useEffect endi kerak emas, agar redirect faqat AuthProvider da bo'lsa
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider" // AuthProvider joylashuviga qarab o'zgartiring

export function LoginForm() {
  const router = useRouter()
  const { login, user, isLoading: authIsLoading } = useAuth(); // AuthProvider'dan login, user va isLoading ni oling
  const [email, setEmail] = useState("user2@gmail.com")
  const [password, setPassword] = useState("user12345")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Form submit bo'layotganini kuzatish uchun


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const success = await login({ // AuthProvider'dagi login funksiyasini chaqiramiz
      email: email,
      password: password,
    })

    if (!success) {
      setError("Login yoki parol noto'g'ri yoki tizimda xatolik yuz berdi.")
    }
    // Muvaffaqiyatli login bo'lsa, redirect AuthProvider ichidagi useEffect orqali amalga oshiriladi.
    setIsSubmitting(false)
  }

  function handleRegisterPage() {
    router.push("/register")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Agar AuthProvider hali yuklanayotgan bo'lsa yoki foydalanuvchi allaqachon mavjud bo'lsa,
  // login formani ko'rsatmaslik mumkin (ixtiyoriy)
  // if (authIsLoading) {
  //   return <div>Yuklanmoqda...</div>; // Yoki biror chiroyli loader
  // }
  // if (user && !authIsLoading) {
  //   // Foydalanuvchi allaqachon tizimda, AuthProvider yo'naltiradi.
  //   // Bu yerda hech narsa ko'rsatmaslik mumkin yoki loading.
  //   return <div>Yo'naltirilmoqda...</div>;
  // }


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Tizimga kirish</CardTitle>
        <CardDescription>Bilimdon Abituriyent platformasiga kirish uchun ma'lumotlaringizni kiriting</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Kirish</TabsTrigger>
            <TabsTrigger value="demo">Demo ma'lumotlar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label> {/* htmlFor "username" edi, "email" ga o'zgartirdim */}
                  <Input
                    id="email"
                    placeholder="Email manzilingizni kiriting" // Placeholder o'zgartirildi
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Parol</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Parolni kiriting"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting || authIsLoading}>
                  {isSubmitting ? "Kirilmoqda..." : "Kirish"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="demo">
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>Quyidagi demo ma'lumotlar orqali tizimga kirishingiz mumkin</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">SuperAdmin sifatida kirish</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Email:</div> {/* Login o'rniga Email */}
                    <div>shohjaxon2006@gmail.com </div>
                    <div className="font-medium">Parol:</div>
                    <div>20062006</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      setEmail("shohjaxon2006@gmail.com");
                      setPassword("20062006");
                    }}
                  >
                    Ma'lumotlarni to'ldirish
                  </Button>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Abituriyent sifatida kirish</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Email:</div> {/* Login o'rniga Email */}
                    <div>user2@gmail.com</div>
                    <div className="font-medium">Parol:</div>
                    <div>user12345</div>
                  </div>
                   <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      setEmail("user2@gmail.com");
                      setPassword("user2006");
                    }}
                  >
                    Ma'lumotlarni to'ldirish
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-500">
          Ro'yxatdan o'tmaganmisiz?{" "}
          <Link href="/register" onClick={handleRegisterPage} className="text-primary font-medium">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}