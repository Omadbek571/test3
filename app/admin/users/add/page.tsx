"use client";

// Kerakli kutubxonalar va komponentlarni import qilish
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, User, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface UserDetailPageProps {
  params: { id: string };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();

  // Input maydonlari uchun state
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  // Xatolik xabarlarini saqlash uchun state
  const [errors, setErrors] = useState<{
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    password?: string;
    role?: string;
    status?: string;
  }>({});

  // Parol ko'rinishini boshqarish uchun state
  const [showPassword, setShowPassword] = useState(false);

  // Holatlar o'zgarishi bilan boshqa holatlarni o'chirish
  const handleActiveStatusChange = (checked: boolean) => {
    setIsActive(checked);
    if (checked) {
      setIsStaff(false);
      setIsSuperuser(false);
    }
  };

  const handleStaffStatusChange = (checked: boolean) => {
    setIsStaff(checked);
    if (checked) {
      setIsActive(false);
      setIsSuperuser(false);
    }
  };

  const handleSuperuserStatusChange = (checked: boolean) => {
    setIsSuperuser(checked);
    if (checked) {
      setIsActive(false);
      setIsStaff(false);
    }
  };

  // Validatsiya funksiyasi
  const validateForm = (): boolean => {
    // Xatoliklarni tozalash
    const newErrors: typeof errors = {};

    // 1. Barcha maydonlar to'ldirilganligini tekshirish
    if (!email) {
      newErrors.email = "Email maydoni to'ldirilishi shart!";
    }
    if (!fullName) {
      newErrors.fullName = "To'liq ism maydoni to'ldirilishi shart!";
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "Telefon maydoni to'ldirilishi shart!";
    }
    if (!password) {
      newErrors.password = "Parol maydoni to'ldirilishi shart!";
    }
    if (!role) {
      newErrors.role = "Rol maydoni tanlanishi shart!";
    }

    // 2. Email formati to'g'riligini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Iltimos, to'g'ri email manzilini kiriting! (Masalan: user@example.com)";
    }

    // 3. Parol uzunligini tekshirish (minimal 8 belgi)
    if (password.length < 8) {
      newErrors.password = "Parol kamida 8 belgidan iborat bo'lishi kerak!";
    }

    // 4. Telefon raqami to'g'riligini tekshirish (+998 bilan boshlanishi va kamida 9 ta raqam)
    const phoneRegex = /^\+998\d{9,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Telefon raqami +998 bilan boshlanishi va undan keyin kamida 9 ta raqam bo'lishi kerak! (Masalan: +998999511523)";
    }

    // 5. Rolning to'g'ri tanlanganligini tekshirish
    if (!["student", "admin"].includes(role)) {
      newErrors.role = "Iltimos, to'g'ri rolni tanlang (Talaba yoki Admin)!";
    }

    // 6. Kamida bitta holat tanlanishi shart
    if (!isActive && !isStaff && !isSuperuser) {
      newErrors.status = "Kamida bitta holat tanlanishi shart (Foydalanuvchi faol, Oddiy admin yoki Asosiy admin)!";
    }

    // 7. Faqat bitta holat tanlanishi mumkin
    const selectedStatuses = [isActive, isStaff, isSuperuser].filter(Boolean).length;
    if (selectedStatuses > 1) {
      newErrors.status = "Faqat bitta holat tanlanishi mumkin (Foydalanuvchi faol, Oddiy admin yoki Asosiy admin)!";
    }

    // Agar biror xatolik bo'lsa, xatoliklarni ko'rsatish va false qaytarish
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Agar barcha validatsiyalar muvaffaqiyatli o'tsa, xatoliklarni tozalash va true qaytarish
    setErrors({});
    return true;
  };

  // Ma'lumotlarni saqlash funksiyasi
  const handleSaveChanges = async () => {
    // Validatsiyani chaqirish
    if (!validateForm()) {
      console.log("Validatsiya xatosi:", errors);
      return; // Agar validatsiya o'tmasa, funksiya to'xtaydi
    }

    const addUserAdmin = {
      email,
      full_name: fullName,
      phone_number: phoneNumber,
      password,
      role,
      is_active: isActive,
      is_staff: isStaff,
      is_superuser: isSuperuser,
    };

    console.log("Yuborilayotgan ma'lumotlar:", addUserAdmin);

    // APIga ma'lumotlarni yuborish
    try {
      const response = await axios.post("https://testonline.pythonanywhere.com/api/admin/users/", addUserAdmin, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Foydalanuvchi qo'shildi:", response.data);
      alert("Foydalanuvchi muvaffaqiyatli saqlandi!");
      router.push("/admin/users");
    } catch (err: any) {
      console.error("API xatolik:", err);
      if (err.response?.data?.email) {
        setErrors({ email: "Bu email allaqachon ro'yxatdan o'tgan!" });
      } else {
        setErrors({ email: "Foydalanuvchini saqlashda xatolik yuz berdi: " + err.message });
      }
    }
  };

  // Foydalanuvchini o'chirish funksiyasi (placeholder)
  const handleDeleteUser = () => {
    console.log("Foydalanuvchi o'chirildi");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Sarlavha va tugmalar qismi */}
        <div className="w-full max-w-3xl mx-auto mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/admin/users")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <div>
                <h2 className="text-2xl font-bold">Foydalanuvchi Qo‘shish</h2>
                <p className="text-gray-600">ID: Add</p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleDeleteUser}>
              O'chirish
            </Button>
          </div>
        </div>

        {/* Forma qismi */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  Shaxsiy ma'lumotlar
                </CardTitle>
                <CardDescription>Foydalanuvchining shaxsiy ma'lumotlari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">To'liq ism</Label>
                      <Input
                        id="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={errors.fullName ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Telefon</Label>
                      <Input
                        id="phone_number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+998999511523"
                        className={errors.phoneNumber ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="password">Parol</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={errors.password ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={`border rounded p-2 w-full focus:ring focus:ring-blue-200 ${
                          errors.role ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                      >
                        <option value="">Rolni tanlang</option>
                        <option value="student">Talaba</option>
                        <option value="admin">Admin</option>
                      </select>
                      {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="active-status">Foydalanuvchi faol holati</Label>
                        <p className="text-sm text-gray-500">Oddiy foydalanuvchi uchun</p>
                      </div>
                      <Switch id="active-status" checked={isActive} onCheckedChange={handleActiveStatusChange} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="staff-status">Oddiy admin holati</Label>
                        <p className="text-sm text-gray-500">Cheklangan huquqlarga ega admin</p>
                      </div>
                      <Switch id="staff-status" checked={isStaff} onCheckedChange={handleStaffStatusChange} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="superuser-status">Asosiy admin holati</Label>
                        <p className="text-sm text-gray-500">To'liq huquqlarga ega admin</p>
                      </div>
                      <Switch id="superuser-status" checked={isSuperuser} onCheckedChange={handleSuperuserStatusChange} />
                    </div>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Saqlash
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}