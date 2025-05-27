"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, FileUp, Loader2, Save, X } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"

// APIga mos tanlovlar
const MATERIAL_TYPES = [
  { value: 'book', label: 'Kitob' },
  { value: 'video', label: 'Video' },
  { value: 'guide', label: "Qo'llanma" },
  { value: 'article', label: 'Maqola' },
  { value: 'presentation', label: 'Prezentatsiya' },
  { value: 'test_collection', label: "Test to'plami" },
  { value: 'other', label: 'Boshqa' },
];

const FILE_FORMATS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'pptx', label: 'PPTX' },
  { value: 'mp4', label: 'MP4' },
  { value: 'mp3', label: 'MP3' },
  { value: 'zip', label: 'ZIP' },
  { value: 'link', label: 'Havola (Link)' },
  { value: 'other', label: 'Boshqa' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Faol' },
  { value: 'inactive', label: 'Nofaol' },
  { value: 'draft', label: 'Qoralama' },
];


export default function AddMaterialPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    subject: "", // Fan IDsi saqlanadi
    description: "",
    material_type: "", // 'book', 'video', etc.
    file_format: "",   // 'pdf', 'link', etc.
    file: null,        // Fayl obyekti
    link: "",          // Havola uchun URL
    status: "active",  // 'active', 'inactive', 'draft'
    is_free: true,
    price: "0",
  })

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://testonline.pythonanywhere.com/api/subjects/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let fetchedSubjects = [];
          if (res.data && res.data.results && Array.isArray(res.data.results)) {
            fetchedSubjects = res.data.results;
          } else if (res.data && Array.isArray(res.data)) {
            fetchedSubjects = res.data;
          } else {
            console.warn("Kutilmagan fanlar API javobi:", res.data);
          }
          // Faqat IDsi mavjud va bo'sh bo'lmagan fanlarni saqlaymiz
          setSubjects(fetchedSubjects.filter(s => s.id != null && String(s.id).trim() !== ''));
        })
        .catch((err) => {
          console.error("Fanlarni yuklashda xatolik:", err);
          setSubjects([]);
          alert("Fanlar ro'yxatini yuklab bo'lmadi. Tokeningizni tekshiring yoki server bilan aloqa yo'q.");
        });
    } else {
      console.warn("Token topilmadi, fanlar yuklanmaydi.");
      alert("Avtorizatsiya tokeni topilmadi. Iltimos, tizimga qayta kiring.");
      setSubjects([]);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "file_format") {
        setFormData((prevForm) => ({...prevForm, file: null, link: ""}));
        const fileInput = document.getElementById("file-upload");
        if (fileInput) fileInput.value = "";
    }
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "is_free" && checked && { price: "0" }),
    }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFormData((prev) => ({
        ...prev,
        file: selectedFile,
        link: "" 
      }))
    }
  }

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }))
    const fileInput = document.getElementById("file-upload")
    if (fileInput) {
      fileInput.value = "" 
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Avtorizatsiya tokeni topilmadi. Iltimos, tizimga qayta kiring.")
      setIsSubmitting(false)
      return
    }

    if (!formData.title || !formData.subject || !formData.material_type || !formData.file_format || !formData.status) {
        alert("Barcha majburiy maydonlarni to'ldiring: Nom, Fan, Material turi, Fayl formati, Status.");
        setIsSubmitting(false);
        return;
    }

    const data = new FormData()
    data.append('title', formData.title)
    data.append('subject', formData.subject) 
    if (formData.description) {
      data.append('description', formData.description)
    }
    data.append('material_type', formData.material_type)
    data.append('file_format', formData.file_format)
    data.append('status', formData.status)
    data.append('is_free', formData.is_free)
    
    let priceToSubmit = parseFloat(formData.price);
    if (formData.is_free) {
        priceToSubmit = 0;
    } else if (isNaN(priceToSubmit) || priceToSubmit <= 0) {
        alert("Pullik material uchun narx 0 dan katta va raqam bo'lishi kerak.");
        setIsSubmitting(false);
        return;
    }
    data.append('price', priceToSubmit.toString());


    if (formData.file_format === 'link') {
      if (!formData.link) {
        alert("Havola formatida material uchun URL manzilini kiriting.")
        setIsSubmitting(false)
        return
      }
      data.append('link', formData.link)
    } else if (formData.file) {
      data.append('file', formData.file)
    } else {
        alert("Tanlangan fayl formati uchun fayl yuklang yoki havola kiriting.");
        setIsSubmitting(false);
        return;
    }
    
    try {
      const response = await axios.post(
        "https://testonline.pythonanywhere.com/api/admin/materials/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 201) {
        alert("Material muvaffaqiyatli qo'shildi!")
        router.push("/admin/materials")
      }
    } catch (error) {
      console.error("Material qo'shishda xatolik:", error.response?.data || error.message)
      let errorMessage = "Material qo'shishda xatolik yuz berdi.";
      if (error.response && error.response.data) {
          const errors = error.response.data;
          let messages = [];
          for (const key in errors) {
              if (Array.isArray(errors[key])) {
                  messages.push(`${key}: ${errors[key].join(', ')}`);
              } else {
                  messages.push(`${key}: ${errors[key]}`);
              }
          }
          if (messages.length > 0) {
              errorMessage += "\nServer javobi:\n" + messages.join("\n");
          }
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/materials")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-2xl font-bold mb-1">Yangi material qo'shish</h2>
              <p className="text-gray-600">Platformaga yangi o'quv materialini qo'shing</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Saqlash
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Material ma'lumotlari</CardTitle>
                  <CardDescription>Material haqidagi asosiy ma'lumotlarni kiriting</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Material nomi <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Material nomini kiriting"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="description">Tavsif</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Material haqida qisqacha ma'lumot"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="subject">Fan <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleSelectChange("subject", value)}
                        name="subject"
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Fanni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* XATOLIKNI TUZATISH: value="" bo'lgan SelectItem olib tashlandi */}
                          {subjects.length === 0 && (
                            <p className="p-2 text-sm text-muted-foreground text-center">
                              Fanlar topilmadi
                            </p>
                          )}
                          {subjects.map(subject => (
                            // subject.id null/undefined yoki bo'sh satr emasligini ta'minlaymiz
                             (subject.id != null && String(subject.id).trim() !== '') ? (
                                <SelectItem key={subject.id} value={String(subject.id)}>
                                {subject.name}
                                </SelectItem>
                             ) : null
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="material_type">Material turi <span className="text-red-500">*</span></Label>
                      <Select value={formData.material_type} onValueChange={(value) => handleSelectChange("material_type", value)}>
                        <SelectTrigger id="material_type">
                          <SelectValue placeholder="Turni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {MATERIAL_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="grid gap-3">
                        <Label htmlFor="file_format">Fayl formati <span className="text-red-500">*</span></Label>
                        <Select value={formData.file_format} onValueChange={(value) => handleSelectChange("file_format", value)}>
                            <SelectTrigger id="file_format">
                            <SelectValue placeholder="Formatni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                            {FILE_FORMATS.map(format => (
                                <SelectItem key={format.value} value={format.value}>
                                {format.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                        <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Statusni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                            {STATUS_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                {option.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="grid gap-3">
                        <Label htmlFor="is_free">Bepul</Label>
                        <Switch 
                            id="is_free" 
                            checked={formData.is_free} 
                            onCheckedChange={(checked) => handleSwitchChange("is_free", checked)} 
                        />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="price">Narxi (so'm){!formData.is_free && <span className="text-red-500">*</span>}</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="Narxni kiriting"
                        value={formData.is_free ? "0" : formData.price}
                        onChange={handleInputChange}
                        disabled={formData.is_free}
                        min="0"
                        required={!formData.is_free}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {formData.file_format && formData.file_format !== 'link' && (
                <Card>
                    <CardHeader>
                    <CardTitle>Faylni yuklash</CardTitle>
                    <CardDescription>Material uchun faylni yuklang ({formData.file_format.toUpperCase()})</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="grid gap-6">
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <FileUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-600">Faylni yuklash uchun bosing yoki bu yerga tashlang</p>
                        <p className="text-xs text-gray-500 mb-4">Tanlangan format: {formData.file_format.toUpperCase()} (max: 100MB)</p>
                        <Input 
                            id="file-upload" 
                            type="file" 
                            className="hidden" 
                            onChange={handleFileChange} 
                            accept={`.${formData.file_format}`}
                        />
                        <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                            Faylni tanlash
                        </Button>
                        </div>

                        {formData.file && (
                        <div>
                            <h3 className="font-medium mb-3">Yuklangan fayl</h3>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                                <div className="mr-3 p-2 bg-blue-50 rounded-md">
                                <FileUp className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                <p className="font-medium text-sm">{formData.file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(formData.file.size)}</p>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
                                <X className="h-4 w-4" />
                            </Button>
                            </div>
                        </div>
                        )}
                    </div>
                    </CardContent>
                </Card>
              )}
              {formData.file_format === 'link' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Havola kiritish</CardTitle>
                        <CardDescription>Material uchun URL havolasini kiriting</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            <Label htmlFor="link">Havola (URL) <span className="text-red-500">*</span></Label>
                            <Input
                                id="link"
                                name="link"
                                type="url"
                                placeholder="https://example.com/material-link"
                                value={formData.link}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>
              )}

            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Ko'rinishi (taxminiy)</CardTitle>
                  <CardDescription>Material qanday ko'rinishda bo'ladi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="desktop" className="mb-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="desktop">Desktop</TabsTrigger>
                      <TabsTrigger value="mobile">Mobile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="desktop" className="mt-4">
                      <div className="border rounded-lg p-4">
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          <p className="text-sm text-gray-500">
                            {formData.file ? formData.file.name.substring(0,20)+'...' : formData.link ? "Havola" : "Material fayli"}
                            </p>
                        </div>
                        <h3 className="font-medium mb-1">{formData.title || "Material nomi"}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {formData.description || "Material tavsifi bu yerda ko'rinadi"}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {formData.subject
                              ? (subjects.find(s => String(s.id) === formData.subject)?.name || "Fan")
                              : "Fan"}
                          </span>
                          <span className="font-medium">
                            {formData.is_free ? "Bepul" : `${formData.price} so'm`}
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="mobile" className="mt-4">
                       <div className="border rounded-lg p-3 max-w-[240px] mx-auto">
                        <div className="aspect-[16/9] bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                          <p className="text-xs text-gray-500 px-1 text-center">
                            {formData.file ? formData.file.name.substring(0,15)+'...' : formData.link ? "Havola" : "Material fayli"}
                          </p>
                        </div>
                        <h3 className="font-medium text-sm mb-1 truncate">{formData.title || "Material nomi"}</h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                          {formData.description || "Material tavsifi"}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                             {formData.subject
                              ? (subjects.find(s => String(s.id) === formData.subject)?.name || "Fan")
                              : "Fan"}
                          </span>
                          <span className="font-medium">
                            {formData.is_free ? "Bepul" : `${formData.price} so'm`}
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-4 mt-6">
                    <div>
                      <h3 className="font-medium mb-2">Eslatmalar</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Majburiy maydonlar (<span className="text-red-500">*</span>) to'ldirilishi shart.</li>
                        <li>• Fayl hajmi 100MB dan oshmasligi kerak.</li>
                        <li>• `Link` formatida to'g'ri URL manzil kiriting.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Material statusi</h3>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            formData.status === 'active' ? "bg-green-500" : 
                            formData.status === 'draft' ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm">
                          {STATUS_OPTIONS.find(s => s.value === formData.status)?.label || "Noma'lum"}
                          {formData.status === 'active' && " - foydalanuvchilarga ko'rinadi"}
                          {formData.status === 'inactive' && " - foydalanuvchilarga ko'rinmaydi"}
                          {formData.status === 'draft' && " - qoralama, faqat adminga ko'rinadi"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}