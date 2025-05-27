"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Bell, Globe, Save, Shield, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const router = useRouter()

  const handleSave = () => {
    // In a real app, this would save the settings
    alert("Sozlamalar muvaffaqiyatli saqlandi!")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Sozlamalar</h1>
        </div>

        <Tabs defaultValue="account" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="account">Profil</TabsTrigger>
            <TabsTrigger value="security">Xavfsizlik</TabsTrigger>
            <TabsTrigger value="notifications">Bildirishnomalar</TabsTrigger>
            <TabsTrigger value="preferences">Afzalliklar</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  Profil ma'lumotlari
                </CardTitle>
                <CardDescription>Profil ma'lumotlaringizni tahrirlang</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">To'liq ism</Label>
                      <Input id="fullName" defaultValue="Alisher Karimov" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Foydalanuvchi nomi</Label>
                      <Input id="username" defaultValue="abituriyent" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="alisher@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon raqam</Label>
                      <Input id="phone" defaultValue="+998 90 123 45 67" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">O'zingiz haqingizda</Label>
                    <Input
                      id="bio"
                      defaultValue="Men abituriyentman va universitetga kirish uchun tayyorlanmoqdaman."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Saqlash
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  Xavfsizlik sozlamalari
                </CardTitle>
                <CardDescription>Hisobingiz xavfsizligini boshqaring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Joriy parol</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Yangi parol</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Parolni tasdiqlang</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Ikki faktorli autentifikatsiya</Label>
                      <div className="text-sm text-gray-500">Hisobingizga kirishda qo'shimcha xavfsizlik qatlami</div>
                    </div>
                    <Switch id="two-factor" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Sessiya vaqti</Label>
                      <div className="text-sm text-gray-500">Faoliyatsiz bo'lgan holda avtomatik chiqish</div>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Saqlash
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-blue-500" />
                  Bildirishnomalar sozlamalari
                </CardTitle>
                <CardDescription>Qanday bildirishnomalar olishni sozlang</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email bildirishnomalari</Label>
                      <div className="text-sm text-gray-500">Email orqali bildirishnomalar olish</div>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS bildirishnomalari</Label>
                      <div className="text-sm text-gray-500">SMS orqali bildirishnomalar olish</div>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push bildirishnomalari</Label>
                      <div className="text-sm text-gray-500">Brauzer orqali push bildirishnomalar olish</div>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Bildirishnoma turlari</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="test-notifications">Test bildirishnomalari</Label>
                        <div className="text-sm text-gray-500">Yangi testlar va natijalar haqida bildirishnomalar</div>
                      </div>
                      <Switch id="test-notifications" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="course-notifications">Kurs bildirishnomalari</Label>
                        <div className="text-sm text-gray-500">Kurslar va darslar haqida bildirishnomalar</div>
                      </div>
                      <Switch id="course-notifications" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="payment-notifications">To'lov bildirishnomalari</Label>
                        <div className="text-sm text-gray-500">To'lovlar va hisobingiz haqida bildirishnomalar</div>
                      </div>
                      <Switch id="payment-notifications" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reminder-notifications">Eslatma bildirishnomalari</Label>
                        <div className="text-sm text-gray-500">O'qish va jadval haqida eslatmalar</div>
                      </div>
                      <Switch id="reminder-notifications" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Saqlash
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-blue-500" />
                  Afzalliklar
                </CardTitle>
                <CardDescription>Platformani o'zingizga moslashtiring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Til</Label>
                    <Select defaultValue="uz">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Tilni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uz">O'zbek</SelectItem>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Mavzu</Label>
                    <Select defaultValue="light">
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Mavzuni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Yorug'</SelectItem>
                        <SelectItem value="dark">Qorong'i</SelectItem>
                        <SelectItem value="system">Tizim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-play">Avtomatik video ijro</Label>
                      <div className="text-sm text-gray-500">Video darslarni avtomatik ijro etish</div>
                    </div>
                    <Switch id="auto-play" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound-effects">Tovush effektlari</Label>
                      <div className="text-sm text-gray-500">Platformada tovush effektlarini yoqish</div>
                    </div>
                    <Switch id="sound-effects" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">Yuqori kontrast</Label>
                      <div className="text-sm text-gray-500">Platformani yuqori kontrast rejimida ko'rsatish</div>
                    </div>
                    <Switch id="high-contrast" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Saqlash
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

