"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react" // <<<--- Ko‘z belgisi uchun ikonkalar

// FormData interfeysi
interface FormData {
  fullName: string
  email: string
  phone: string
  password: string
  region: string
  birthDate: string
  gender: string
  school: string
  grade: string
  agreeToTerms: boolean
}

// Xatoliklar uchun interfeys (validatsiya xatolarini saqlash uchun)
interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  rePassword?: string
  birthDate?: string
  gender?: string
  region?: string
  school?: string
  grade?: string
  agreeToTerms?: string
  server?: string // <<<--- Server xatosi uchun maydon (agar kerak bo‘lmasa olib tashlanadi)
}

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"personal" | "account">("personal")
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false) // <<<--- Parolni ko‘rish holati
  const [showRePassword, setShowRePassword] = useState(false) // <<<--- Tasdiqlash parolini ko‘rish holati

  const fullNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const birthDateRef = useRef<HTMLInputElement>(null)
  const genderRef = useRef<HTMLSelectElement>(null)
  const regionRef = useRef<HTMLSelectElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const rePasswordRef = useRef<HTMLInputElement>(null)
  const schoolRef = useRef<HTMLInputElement>(null)
  const gradeRef = useRef<HTMLSelectElement>(null)
  const agreeToTermsRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Validatsiya funksiyasi
  const validateForm = (onlyFirstTab: boolean = false): FormErrors => {
    const newErrors: FormErrors = {}

    // Ism-familiya validatsiyasi
    const fullName = fullNameRef.current?.value || ""
    if (!fullName) newErrors.fullName = "Ism-familiya majburiy"

    // Email validatsiyasi
    const email = emailRef.current?.value || ""
    if (!email) newErrors.email = "Email majburiy"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email formati noto‘g‘ri"

    // Telefon raqam validatsiyasi
    const phone = phoneRef.current?.value || ""
    if (!phone) newErrors.phone = "Telefon raqam majburiy"
    else if (!/^\+998\d{9}$/.test(phone)) newErrors.phone = "Telefon raqam formati noto‘g‘ri (masalan: +998901234567)"

    // Tug‘ilgan sana validatsiyasi
    const birthDate = birthDateRef.current?.value || ""
    if (!birthDate) newErrors.birthDate = "Tug‘ilgan sana majburiy"

    // Jins validatsiyasi
    const gender = genderRef.current?.value || ""
    if (!gender) newErrors.gender = "Jinsni tanlash majburiy"

    // Hudud validatsiyasi
    const region = regionRef.current?.value || ""
    if (!region) newErrors.region = "Hududni tanlash majburiy"

    // Agar faqat birinchi tabni tekshirish kerak bo‘lsa, bu yerda to‘xtatamiz
    if (onlyFirstTab) return newErrors

    // Parol validatsiyasi
    const password = passwordRef.current?.value || ""
    if (!password) newErrors.password = "Parol majburiy"
    else if (password.length < 8) newErrors.password = "Parol kamida 8 ta belgidan iborat bo‘lishi kerak"

    // Parolni tasdiqlash validatsiyasi
    const rePassword = rePasswordRef.current?.value || ""
    if (!rePassword) newErrors.rePassword = "Parolni tasdiqlash majburiy"
    else if (rePassword !== password) newErrors.rePassword = "Parollar mos kelmadi"

    // Maktab validatsiyasi
    const school = schoolRef.current?.value || ""
    if (!school) newErrors.school = "Maktab nomini kiritish majburiy"

    // Sinf validatsiyasi
    const grade = gradeRef.current?.value || ""
    if (!grade) newErrors.grade = "Sinfni tanlash majburiy"

    // Shartlarga rozilik validatsiyasi
    const agreeToTerms = agreeToTermsRef.current?.checked || false
    if (!agreeToTerms) newErrors.agreeToTerms = "Shartlarga rozilik berish majburiy"

    return newErrors
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Validatsiyani ishga tushirish (barcha maydonlar uchun)
    const formErrors = validateForm()
    setErrors(formErrors)

    // Agar xatolar bo‘lsa, so‘rovni yubormaymiz
    if (Object.keys(formErrors).length > 0) {
      return
    }

    const userRegister: FormData & {} = {
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
      fullName: fullNameRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      birthDate: birthDateRef.current?.value || "",
      gender: genderRef.current?.value || "",
      grade: gradeRef.current?.value || "",
      region: regionRef.current?.value || "",
      school: schoolRef.current?.value || "",
      agreeToTerms: agreeToTermsRef.current?.checked || false,
    }

    console.log("Yuborilayotgan ma'lumot:", userRegister)
    console.log(149, userRegister);
    

    axios
      .post("https://testonline.pythonanywhere.com/api/auth/signup/", userRegister, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(158, res);
        
        if (res.status === 201) {
          router.push("/")
        }
      })
      .catch((err) => {
        console.log(err);
        
        const serverError = err.response?.data?.detail || "Noma'lum xatolik yuz berdi"
        setErrors((prev) => ({ ...prev, server: serverError }))
      })
  }

  const handleNextStep = () => {
    // Birinchi tabdagi maydonlarni tekshirish uchun validateForm ishlatamiz
    const firstTabErrors = validateForm(true) // true parametri faqat birinchi tabni tekshirish uchun
    setErrors(firstTabErrors)

    if (Object.keys(firstTabErrors).length === 0) {
      setActiveTab("account")
    }
  }

  const handleBackStep = () => {
    setActiveTab("personal")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bilimdon Abituriyent</h1>
          <p className="text-gray-600 mt-2">Ro'yxatdan o'tish</p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription>
              Bilimdon Abituriyent platformasida ro'yxatdan o'tish uchun ma'lumotlaringizni kiriting
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "personal" | "account")}>
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="personal">Shaxsiy ma'lumotlar</TabsTrigger>
                  <TabsTrigger value="account">Hisob ma'lumotlari</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="personal" forceMount={true} className={activeTab !== "personal" ? "hidden" : ""}>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Ism-familiya</Label>
                      <Input
                        ref={fullNameRef}
                        id="fullName"
                        name="fullName"
                        placeholder="Ism-familiyangizni kiriting"
                      />
                      {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        ref={emailRef}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email manzilingizni kiriting"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefon raqam</Label>
                      <Input ref={phoneRef} id="phone" name="phone" placeholder="+998 XX XXX XX XX" />
                      {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="birthDate">Tug'ilgan sana</Label>
                      <Input ref={birthDateRef} id="birthDate" name="birthDate" type="date" />
                      {errors.birthDate && <p className="text-red-600 text-sm">{errors.birthDate}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="gender">Jins</Label>
                      <select
                        ref={genderRef}
                        id="gender"
                        name="gender"
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Jinsingizni tanlang</option>
                        <option value="male">Erkak</option>
                        <option value="female">Ayol</option>
                      </select>
                      {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="region">Hudud</Label>
                      <select
                        ref={regionRef}
                        id="region"
                        name="region"
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Hududni tanlang</option>
                        <option value="tashkent">Toshkent shahri</option>
                        <option value="tashkent_region">Toshkent viloyati</option>
                        <option value="andijan">Andijon viloyati</option>
                        <option value="bukhara">Buxoro viloyati</option>
                        <option value="fergana">Farg'ona viloyati</option>
                        <option value="jizzakh">Jizzax viloyati</option>
                        <option value="namangan">Namangan viloyati</option>
                        <option value="navoi">Navoiy viloyati</option>
                        <option value="kashkadarya">Qashqadaryo viloyati</option>
                        <option value="samarkand">Samarqand viloyati</option>
                        <option value="sirdarya">Sirdaryo viloyati</option>
                        <option value="surkhandarya">Surxondaryo viloyati</option>
                        <option value="karakalpakstan">Qoraqalpog'iston Respublikasi</option>
                        <option value="khorezm">Xorazm viloyati</option>
                      </select>
                      {errors.region && <p className="text-red-600 text-sm">{errors.region}</p>}
                    </div>

                    <Button type="button" onClick={handleNextStep} className="mt-2">
                      Keyingi qadam
                    </Button>
                    <div className="text-sm">
                      <Link href="/">Login</Link>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="account" forceMount={true} className={activeTab !== "account" ? "hidden" : ""}>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">Parol</Label>
                      <div className="relative">
                        <Input
                          ref={passwordRef}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"} // <<<--- Parol ko‘rinishi o‘zgaradi
                          placeholder="Parolni kiriting"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="rePassword">Parolni tasdiqlash</Label>
                      <div className="relative">
                        <Input
                          ref={rePasswordRef}
                          id="rePassword"
                          name="rePassword"
                          type={showRePassword ? "text" : "password"} // <<<--- Tasdiqlash paroli ko‘rinishi o‘zgaradi
                          placeholder="Parolni qayta kiriting"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRePassword(!showRePassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.rePassword && <p className="text-red-600 text-sm">{errors.rePassword}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="school">Maktab</Label>
                      <Input ref={schoolRef} id="school" name="school" placeholder="Maktab nomini kiriting" />
                      {errors.school && <p className="text-red-600 text-sm">{errors.school}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="grade">Sinf</Label>
                      <select
                        ref={gradeRef}
                        id="grade"
                        name="grade"
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Sinfni tanlang</option>
                        <option value="9">9-sinf</option>
                        <option value="10">10-sinf</option>
                        <option value="11">11-sinf</option>
                        <option value="graduate">Bitiruvchi</option>
                      </select>
                      {errors.grade && <p className="text-red-600 text-sm">{errors.grade}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        ref={agreeToTermsRef}
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        <span>Men </span>
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          foydalanish shartlari
                        </Link>
                        <span> va </span>
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          maxfiylik siyosati
                        </Link>
                        <span> bilan tanishdim va roziman</span>
                      </Label>
                    </div>
                    {errors.agreeToTerms && <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>}

                    {/* Server xatosi ko‘rsatiladigan joy qo‘shildi */}
                    {errors.server && <p className="text-red-600 text-sm">{errors.server}</p>}

                    <div className="flex gap-2 mt-2">
                      <Button type="button" variant="outline" onClick={handleBackStep}>
                        Orqaga
                      </Button>
                      <Button type="submit" className="flex-1">
                        Ro'yxatdan o'tish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Ro'yxatdan o'tish bilan siz platformamizning barcha imkoniyatlaridan foydalanishingiz mumkin</p>
          <p className="mt-2">
            Savollaringiz bo'lsa,{" "}
            <Link href="/questions" className="text-blue-600 hover:underline">
              yordam markaziga
            </Link>{" "}
            murojaat qiling
          </p>
        </div>
      </div>
    </div>
  )
}