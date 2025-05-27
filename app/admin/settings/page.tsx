"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, Save, Server, Settings, Shield } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useRouter } from "next/navigation"
import { useEffect } from 'react';
import axios from 'axios';


export default function SettingsPage() {
  const router = useRouter()

  const userInfoLoc = localStorage.getItem("user")
  console.log(17, userInfoLoc);

  useEffect(() =>{
    axios.get(`https://testonline.pythonanywhere.com/api/profile/settings/`, {
      headers:{
        "Content-Type":"application/json", 
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((res) =>{
      console.log(30, res);
      
    })
    .catch((err) =>{
      console.log(err);
      
    })
  }, [])
  

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sozlamalar</h2>
            <p className="text-gray-600">Platforma sozlamalari</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="mb-6">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="general">Umumiy</TabsTrigger>
            <TabsTrigger value="security">Xavfsizlik</TabsTrigger>
            <TabsTrigger value="notifications">Bildirishnomalar</TabsTrigger>
            <TabsTrigger value="system">Tizim</TabsTrigger>
            <TabsTrigger value="backup">Zaxira</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-blue-500" />
                  Umumiy sozlamalar
                </CardTitle>
                <CardDescription>Platformaning umumiy sozlamalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Platforma nomi</Label>
                      <Input id="site-name" defaultValue="Bilimdon Abituriyent" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-url">Platforma URL</Label>
                      <Input id="site-url" defaultValue="https://bilimdon.uz" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin email</Label>
                      <Input id="admin-email" defaultValue="admin@bilimdon.uz" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Yordam email</Label>
                      <Input id="support-email" defaultValue="support@bilimdon.uz" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site-description">Platforma tavsifi</Label>
                    <Input id="site-description" defaultValue="Abituriyentlar uchun ta'lim platformasi" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Texnik xizmat rejimi</Label>
                      <div className="text-sm text-gray-500">Platforma texnik xizmat rejimiga o'tkaziladi</div>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>

                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Saqlash
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  Xavfsizlik sozlamalari
                </CardTitle>
                <CardDescription>Platformaning xavfsizlik sozlamalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Ikki faktorli autentifikatsiya</Label>
                      <div className="text-sm text-gray-500">
                        Adminlar uchun ikki faktorli autentifikatsiyani yoqish
                      </div>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="password-policy">Kuchli parol siyosati</Label>
                      <div className="text-sm text-gray-500">Foydalanuvchilar uchun kuchli parol siyosatini yoqish</div>
                    </div>
                    <Switch id="password-policy" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Sessiya vaqti</Label>
                      <div className="text-sm text-gray-500">
                        Faoliyatsiz bo'lgan foydalanuvchilarni avtomatik chiqarish
                      </div>
                    </div>
                    <Switch id="session-timeout" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout-minutes">Sessiya vaqti (daqiqalar)</Label>
                    <Input id="session-timeout-minutes" type="number" defaultValue="30" />
                  </div>

                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Saqlash
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-blue-500" />
                  Bildirishnomalar sozlamalari
                </CardTitle>
                <CardDescription>Platformaning bildirishnomalar sozlamalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email bildirishnomalari</Label>
                      <div className="text-sm text-gray-500">
                        Foydalanuvchilarga email orqali bildirishnomalar yuborish
                      </div>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS bildirishnomalari</Label>
                      <div className="text-sm text-gray-500">
                        Foydalanuvchilarga SMS orqali bildirishnomalar yuborish
                      </div>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push bildirishnomalari</Label>
                      <div className="text-sm text-gray-500">Foydalanuvchilarga push bildirishnomalar yuborish</div>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>

                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Saqlash
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5 text-blue-500" />
                  Tizim sozlamalari
                </CardTitle>
                <CardDescription>Platformaning tizim sozlamalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cache">Keshni yoqish</Label>
                      <div className="text-sm text-gray-500">Tizim ishlashini tezlashtirish uchun keshni yoqish</div>
                    </div>
                    <Switch id="cache" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debug-mode">Debug rejimi</Label>
                      <div className="text-sm text-gray-500">Tizim xatolarini kuzatish uchun debug rejimini yoqish</div>
                    </div>
                    <Switch id="debug-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="log-errors">Xatolarni qayd qilish</Label>
                      <div className="text-sm text-gray-500">Tizim xatolarini log faylga yozib borish</div>
                    </div>
                    <Switch id="log-errors" defaultChecked />
                  </div>

                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Saqlash
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-blue-500" />
                  Zaxira sozlamalari
                </CardTitle>
                <CardDescription>Platformaning zaxira sozlamalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-backup">Avtomatik zaxiralash</Label>
                      <div className="text-sm text-gray-500">Ma'lumotlar bazasini avtomatik zaxiralash</div>
                    </div>
                    <Switch id="auto-backup" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Zaxiralash chastotasi (kunlar)</Label>
                    <Input id="backup-frequency" type="number" defaultValue="7" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Zaxira saqlash muddati (kunlar)</Label>
                    <Input id="backup-retention" type="number" defaultValue="30" />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline">Hozir zaxiralash</Button>
                    <Button variant="outline">Zaxiralarni ko'rish</Button>
                  </div>

                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Saqlash
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

