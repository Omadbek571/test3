"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, AlertCircle, CheckCircle2, Loader2, UploadCloud, X } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import Image from "next/image"

interface UserProfile {
  id?: number
  email?: string
  full_name?: string | null
  birth_date?: string | null
  phone_number?: string | null
  address?: string | null
  study_place?: string | null
  grade?: string | null
  target_university?: string | null
  target_faculty?: string | null
  about_me?: string | null
  profile_picture?: string | null
  gender?: string | null
  region?: string | null
}

const gradeOptions = [
    { value: "5", label: "5-sinf" }, { value: "6", label: "6-sinf" },
    { value: "7", label: "7-sinf" }, { value: "8", label: "8-sinf" },
    { value: "9", label: "9-sinf" }, { value: "10", label: "10-sinf" },
    { value: "11", label: "11-sinf" }, { value: "academic_lyceum_1", label: "Akademik litsey 1-kurs" },
    { value: "academic_lyceum_2", label: "Akademik litsey 2-kurs" },
    { value: "vocational_college_1", label: "Kasb-hunar kolleji 1-kurs" },
    { value: "vocational_college_2", label: "Kasb-hunar kolleji 2-kurs" },
    { value: "vocational_college_3", label: "Kasb-hunar kolleji 3-kurs" },
    { value: "university_student", label: "Universitet talabasi" },
    { value: "other", label: "Boshqa" },
];

const genderOptions = [
    { value: "male", label: "Erkak" },
    { value: "female", label: "Ayol" },
];

export default function ProfileEditPage() {
  const router = useRouter()
  const [profileData, setProfileData] = useState<UserProfile>({})
  const [initialProfileData, setInitialProfileData] = useState<UserProfile>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<Record<string, string> | string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Avtorizatsiya tokeni topilmadi. Iltimos, qayta login qiling.")
      setIsLoading(false)
      return;
    }

    setIsLoading(true)
    setError(null)
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/me/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data || {}
        setProfileData(data)
        setInitialProfileData(data)
        if (data.profile_picture) {
          setPreviewImage(data.profile_picture)
        }
      })
      .catch((err) => {
        console.log("Profil ma'lumotlarini yuklashda xatolik:", err)
        let errorMsg: string | Record<string, string> = "Profil ma'lumotlarini yuklab bo'lmadi."
        if (err.response?.status === 401) {
          errorMsg = "Sessiya muddati tugagan. Iltimos, qayta login qiling."
        } else if (err.response?.data) {
           errorMsg = typeof err.response.data === 'object' ? err.response.data : { detail: err.response.data }
        }
        setError(errorMsg)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    if (typeof error === 'object' && error && error[name]) {
        setError(prevError => {
            const newError = {...(prevError as Record<string, string>)};
            delete newError[name];
            return Object.keys(newError).length > 0 ? newError : null;
        });
    } else if (typeof error === 'string') {
        setError(null);
    }
  }
  
  const handleSelectChange = (name: keyof UserProfile, value: string | null) => {
    setProfileData(prev => ({ ...prev, [name]: value === "null_placeholder" ? null : value }))
     if (typeof error === 'object' && error && error[name]) {
        setError(prevError => {
            const newError = {...(prevError as Record<string, string>)};
            delete newError[name];
            return Object.keys(newError).length > 0 ? newError : null;
        });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError({profile_picture: "Rasm hajmi 5MB dan oshmasligi kerak."});
        return;
      }
      setSelectedImageFile(file)
      setPreviewImage(URL.createObjectURL(file))
      if (typeof error === 'object' && error?.profile_picture) {
        setError(prevError => {
            const newError = {...(prevError as Record<string, string>)};
            delete newError.profile_picture;
            return Object.keys(newError).length > 0 ? newError : null;
        });
      }
    }
  }

  const handleRemoveImage = () => {
    setSelectedImageFile(null)
    setPreviewImage(null)
    setProfileData(prev => ({...prev, profile_picture: null}))
    if (fileInputRef.current) {
        fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Saqlash uchun avtorizatsiya tokeni mavjud emas.")
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    const payload: Record<string, any> = {}
    let hasChanges = false;

    (Object.keys(profileData) as Array<keyof UserProfile>).forEach(key => {
        if (key !== 'id' && key !== 'email' && key !== 'profile_picture') {
            const currentValue = profileData[key] === "" ? null : profileData[key];
            const initialValue = initialProfileData[key] === "" ? null : initialProfileData[key];
            if (currentValue !== initialValue) {
                payload[key] = currentValue;
                hasChanges = true;
            }
        }
    });
    
    let dataToSend: FormData | Record<string, any>;
    let requestHeaders: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    };

    const imageChanged = selectedImageFile || (profileData.profile_picture === null && initialProfileData.profile_picture !== null);

    if (imageChanged) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value === null ? '' : String(value));
            }
        });
        if (selectedImageFile) {
            formData.append("profile_picture", selectedImageFile);
        } else if (profileData.profile_picture === null && initialProfileData.profile_picture !== null) {
             formData.append("profile_picture", ""); 
        }
        dataToSend = formData;
        hasChanges = true;
    } else {
        if (!hasChanges) {
             setSuccessMessage("Hech qanday o'zgarish kiritilmadi.")
             setIsSaving(false)
             setTimeout(() => setSuccessMessage(null), 2000);
             return;
        }
        dataToSend = payload;
        requestHeaders["Content-Type"] = "application/json";
    }

    axios
      .patch(`https://testonline.pythonanywhere.com/api/profile/me/`, dataToSend, {
        headers: requestHeaders,
      })
      .then((res) => {
        setSuccessMessage("Profil ma'lumotlari muvaffaqiyatli saqlandi!")
        const data = res.data || {}
        setProfileData(data)
        setInitialProfileData(data)
        if (data.profile_picture) {
          setPreviewImage(data.profile_picture)
        } else {
          setPreviewImage(null)
        }
        setSelectedImageFile(null)
        if(fileInputRef.current) fileInputRef.current.value = "";
         setTimeout(() => {
             setSuccessMessage(null);
             // router.push("/profile"); // Agar profil sahifasiga o'tish kerak bo'lsa
         }, 2000);
      })
      .catch((err) => {
        console.log("Profilni saqlashda xatolik:", err.response?.data || err.message)
        if (err.response?.data && typeof err.response.data === 'object') {
          setError(err.response.data);
        } else if (err.response?.data?.detail) {
          setError({ detail: err.response.data.detail });
        } else {
          setError({ detail: "Profil ma'lumotlarini saqlashda noma'lum xatolik." });
        }
      })
      .finally(() => {
        setIsSaving(false)
      })
  }
  
  const getErrorMessage = (field: string) => {
    if (typeof error === 'object' && error && error[field]) {
      return Array.isArray(error[field]) ? (error[field] as string[]).join(', ') : String(error[field]);
    }
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }
  
  if (!isLoading && typeof error === 'string' && !Object.keys(profileData).length) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-red-600">Xatolik!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
           <CardFooter>
             <Button className="w-full" onClick={() => window.location.reload()}>
                Sahifani yangilash
              </Button>
           </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Profil ma'lumotlarini tahrirlash</h1>
        </div>

        {successMessage && (
             <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md flex items-center text-sm"
            >
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0"/>
                {successMessage}
          </motion.div>
        )}
        {typeof error === 'object' && error?.detail && (
             <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center text-sm">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/>
                {String(error.detail)}
          </div>
        )}


        <Card>
          <CardHeader>
            <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
            <CardDescription>Profil ma'lumotlaringizni tahrirlang</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-6 space-y-2">
                  <div className="relative w-28 h-28">
                    {previewImage ? (
                        <Image 
                            src={previewImage} 
                            alt="Profil rasmi" 
                            width={112} 
                            height={112} 
                            className="rounded-full object-cover w-full h-full border-2 border-gray-200" 
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <User className="h-12 w-12 text-gray-400" />
                        </div>
                    )}
                     <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0 bg-white shadow-md hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="h-4 w-4 text-gray-600" />
                    </Button>
                    {previewImage && (
                         <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1 -right-1 rounded-full w-6 h-6 p-0 opacity-80 hover:opacity-100"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                    )}
                  </div>
                  <Input
                      id="profile_picture"
                      name="profile_picture"
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                  />
                  {getErrorMessage('profile_picture') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('profile_picture')}</p>}
                   <p className="text-xs text-gray-500">Rasm hajmi 5MB gacha (JPG, PNG)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name">To'liq ism</Label>
                    <Input id="full_name" name="full_name" value={profileData.full_name || ""} onChange={handleInputChange} />
                    {getErrorMessage('full_name') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('full_name')}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="birth_date">Tug'ilgan sana</Label>
                    <Input id="birth_date" name="birth_date" type="date" value={profileData.birth_date || ""} onChange={handleInputChange} />
                    {getErrorMessage('birth_date') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('birth_date')}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone_number">Telefon raqam</Label>
                    <Input id="phone_number" name="phone_number" value={profileData.phone_number || ""} onChange={handleInputChange} placeholder="+998 XX XXX XX XX" />
                    {getErrorMessage('phone_number') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('phone_number')}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={profileData.email || ""} disabled className="bg-gray-100 cursor-not-allowed" />
                  </div>
                   <div className="space-y-1.5">
                    <Label htmlFor="gender">Jins</Label>
                    <Select name="gender" value={profileData.gender || "null_placeholder"} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Jinsni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null_placeholder" disabled>Jinsni tanlang</SelectItem>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getErrorMessage('gender') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('gender')}</p>}
                  </div>
                   <div className="space-y-1.5">
                    <Label htmlFor="grade">Sinf / Kurs</Label>
                    <Select name="grade" value={profileData.grade || "null_placeholder"} onValueChange={(value) => handleSelectChange("grade", value)}>
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Sinf/Kursni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null_placeholder" disabled>Sinf/Kursni tanlang</SelectItem>
                        {gradeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getErrorMessage('grade') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('grade')}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="address">Manzil</Label>
                    <Input id="address" name="address" value={profileData.address || ""} onChange={handleInputChange} />
                    {getErrorMessage('address') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('address')}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="study_place">O'qish joyi</Label>
                    <Input id="study_place" name="study_place" value={profileData.study_place || ""} onChange={handleInputChange} placeholder="Maktab, litsey yoki kollej nomi" />
                     {getErrorMessage('study_place') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('study_place')}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="target_university">Maqsad qilingan OTM</Label>
                    <Input id="target_university" name="target_university" value={profileData.target_university || ""} onChange={handleInputChange} />
                    {getErrorMessage('target_university') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('target_university')}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="target_faculty">Maqsad qilingan fakultet</Label>
                    <Input id="target_faculty" name="target_faculty" value={profileData.target_faculty || ""} onChange={handleInputChange} />
                    {getErrorMessage('target_faculty') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('target_faculty')}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="about_me">O'zingiz haqingizda</Label>
                    <Textarea id="about_me" name="about_me" value={profileData.about_me || ""} onChange={handleInputChange} rows={3} />
                    {getErrorMessage('about_me') && <p className="text-xs text-red-500 mt-1">{getErrorMessage('about_me')}</p>}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                  <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSaving}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={isSaving || isLoading}>
                    {isSaving ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saqlanmoqda...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Saqlash
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}