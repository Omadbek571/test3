"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, FileUp, Loader2, Save, X, Trash2, PlayCircle } from "lucide-react" // PlayCircle ikonkasini qo'shdim
import { AdminLayout } from "@/components/admin/admin-layout"
import axios from "axios"

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
  { value: 'webm', label: 'WEBM' }, // Video formatlarini ko'paytirish mumkin
  { value: 'ogg', label: 'OGG' },  // Video formatlarini ko'paytirish mumkin
  { value: 'mp3', label: 'MP3' },
  { value: 'zip', label: 'ZIP' },
  { value: 'link', label: 'Havola (Link)' },
  { value: 'webp', label: 'WEBP' },
  { value: 'other', label: 'Boshqa' },
];

const VIDEO_FILE_FORMATS = ['mp4', 'webm', 'ogg']; // Video formatlar ro'yxati

const STATUS_OPTIONS = [
  { value: 'active', label: 'Faol' },
  { value: 'inactive', label: 'Nofaol' },
  { value: 'draft', label: 'Qoralama' },
];

interface Subject {
  id: number;
  name: string;
}

interface MaterialData {
  title: string;
  subject: string;
  description: string;
  material_type: string;
  file_format: string;
  file: File | null;
  current_file_url?: string | null;
  link: string;
  status: string;
  is_free: boolean;
  price: string;
}

interface EditMaterialPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMaterialPage({ params }: EditMaterialPageProps) {
  const router = useRouter()
  const resolvedParams = use(params);
  const materialId = resolvedParams.id;

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [formData, setFormData] = useState<MaterialData>({
    title: "",
    subject: "",
    description: "",
    material_type: "",
    file_format: "",
    file: null,
    current_file_url: null,
    link: "",
    status: "active",
    is_free: true,
    price: "0",
  })
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null); // Video preview uchun state

  useEffect(() => {
    if (!materialId) {
        setIsLoadingData(false);
        return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Avtorizatsiya tokeni topilmadi.");
      setIsLoadingData(false);
      router.push("/login");
      return;
    }

    setIsLoadingData(true);
    const fetchSubjects = axios.get("https://testonline.pythonanywhere.com/api/subjects/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchMaterial = axios.get(`https://testonline.pythonanywhere.com/api/admin/materials/${materialId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchSubjects, fetchMaterial])
      .then(([subjectsRes, materialRes]) => {
        if (subjectsRes.data && subjectsRes.data.results && Array.isArray(subjectsRes.data.results)) {
          setSubjects(subjectsRes.data.results);
        } else if (subjectsRes.data && Array.isArray(subjectsRes.data)) {
          setSubjects(subjectsRes.data);
        }

        const materialDataFromApi = materialRes.data;
        setFormData({
          title: materialDataFromApi.title || "",
          subject: String(materialDataFromApi.subject?.id || materialDataFromApi.subject || ""),
          description: materialDataFromApi.description || "",
          material_type: materialDataFromApi.material_type || "",
          file_format: materialDataFromApi.file_format || "",
          file: null,
          current_file_url: materialDataFromApi.file || null,
          link: materialDataFromApi.link || "",
          status: materialDataFromApi.status || "active",
          is_free: materialDataFromApi.is_free != null ? materialDataFromApi.is_free : true,
          price: String(materialDataFromApi.price || "0"),
        });
      })
      .catch(error => {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
        alert("Ma'lumotlarni yuklab bo'lmadi. Sahifaga qaytarilasiz.");
        router.back();
      })
      .finally(() => {
        setIsLoadingData(false);
      });

  }, [materialId, router]);

  // Effekt video preview uchun
  useEffect(() => {
    let objectUrl: string | null = null;

    if (
      formData.file &&
      formData.material_type === 'video' &&
      VIDEO_FILE_FORMATS.includes(formData.file_format) && // file_format ham video bo'lishi kerak
      formData.file.type.startsWith('video/') // Faylning MIME type tekshiruvi
    ) {
      objectUrl = URL.createObjectURL(formData.file);
      setVideoPreviewUrl(objectUrl);
    } else {
      setVideoPreviewUrl(null); // Boshqa hollarda previewni tozalash
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl); // Komponent demontaj qilinganda yoki fayl o'zgarganda object URL'ni tozalash
      }
    };
  }, [formData.file, formData.material_type, formData.file_format]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSelectChange = (name: keyof MaterialData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "file_format") {
        setFormData((prevForm) => ({...prevForm, file: null, link: ""})); // Preview va linkni tozalash
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    }
    if (name === "material_type" && value !== 'video') {
        setVideoPreviewUrl(null); // Agar material turi videodan o'zgarsa, previewni tozalash
    }
  }

  const handleSwitchChange = (name: keyof MaterialData, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "is_free" && checked && { price: "0" }),
    }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFormData((prev) => ({
        ...prev,
        file: selectedFile,
        link: "" // Yangi fayl tanlanganda linkni tozalash
      }));
    }
  }

  const removeFile = (isCurrentFile: boolean = false) => {
    if (isCurrentFile) {
        setFormData(prev => ({ ...prev, current_file_url: null, file: null }));
    } else {
        setFormData(prev => ({ ...prev, file: null }));
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    }
    setVideoPreviewUrl(null); // Fayl o'chirilganda previewni ham tozalash
  }

  const parseApiErrors = (error: any): string => {
    if (error.response && error.response.data) {
        const errorData = error.response.data;
        let messages: string[] = [];
        if (typeof errorData === 'object' && errorData !== null) {
            for (const key in errorData) {
                if (Array.isArray(errorData[key])) {
                    messages.push(`${key}: ${errorData[key].join(', ')}`);
                } else if (typeof errorData[key] === 'string') {
                    messages.push(`${key}: ${errorData[key]}`);
                } else if (typeof errorData[key] === 'object'){
                    messages.push(`${key}: ${JSON.stringify(errorData[key])}`);
                }
            }
        } else if (typeof errorData === 'string') {
            messages.push(errorData);
        }
        if (messages.length > 0) return messages.join("\n");
    }
    return error.message || "Noaniq xatolik";
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Avtorizatsiya tokeni topilmadi.");
      setIsSubmitting(false);
      router.push("/login");
      return;
    }

    // Validatsiya: Agar material turi 'video' bo'lsa va fayl formati videoga mos kelmasa
    if (formData.material_type === 'video' && !VIDEO_FILE_FORMATS.includes(formData.file_format)) {
      alert(`Video material uchun fayl formati (${FILE_FORMATS.find(f => f.value === formData.file_format)?.label || formData.file_format}) noto'g'ri. Iltimos, MP4, WEBM yoki OGG formatlaridan birini tanlang.`);
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = new FormData();
    dataToSubmit.append('title', formData.title);
    dataToSubmit.append('subject', formData.subject);
    if (formData.description) dataToSubmit.append('description', formData.description);
    dataToSubmit.append('material_type', formData.material_type);
    dataToSubmit.append('file_format', formData.file_format);
    dataToSubmit.append('status', formData.status);
    dataToSubmit.append('is_free', String(formData.is_free));

    let priceValue = parseFloat(formData.price);
    if (formData.is_free) {
        priceValue = 0;
    } else if (isNaN(priceValue) || priceValue < 0) {
        alert("Pullik material uchun narx manfiy bo'lishi mumkin emas yoki noto'g'ri kiritilgan.");
        setIsSubmitting(false);
        return;
    }
    dataToSubmit.append('price', priceValue.toFixed(2));

    if (formData.file_format === 'link') {
      if (!formData.link || !formData.link.trim()) {
        alert("Havola formatida material uchun URL manzilini kiriting.");
        setIsSubmitting(false);
        return;
      }
      dataToSubmit.append('link', formData.link);
      if (dataToSubmit.has('file')) dataToSubmit.delete('file');
    } else if (formData.file) {
      dataToSubmit.append('file', formData.file);
      if (dataToSubmit.has('link')) dataToSubmit.delete('link');
    }
    // Fayl majburiyligi validatsiyasi (agar kerak bo'lsa, qaytarish mumkin)
    // else if (!formData.current_file_url && formData.file_format !== 'link') {
    //   alert(`'${FILE_FORMATS.find(f => f.value === formData.file_format)?.label || formData.file_format}' formati uchun fayl yuklang yoki formatni 'Havola (Link)' ga o'zgartiring.`);
    //   setIsSubmitting(false);
    //   return;
    // }

    try {
      const response = await axios.patch(
        `https://testonline.pythonanywhere.com/api/admin/materials/${materialId}/`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Material muvaffaqiyatli tahrirlandi!");
        router.push("/admin/materials");
      }
    } catch (error: any) {
      console.error("Materialni tahrirlashda xatolik:", error.response?.data || error.message);
      const apiErrors = parseApiErrors(error);
      alert(`Materialni tahrirlashda xatolik yuz berdi.\n${apiErrors}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async () => {
    if (!materialId) return;

    const confirmDelete = window.confirm("Ushbu materialni rostdan ham o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.");
    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Avtorizatsiya tokeni topilmadi. O'chirish bekor qilindi.");
      setIsDeleting(false);
      router.push("/login");
      return;
    }

    try {
      const response = await axios.delete(
        `https://testonline.pythonanywhere.com/api/admin/materials/${materialId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        alert("Material muvaffaqiyatli o'chirildi!");
        router.push("/admin/materials");
      } else {
        alert(`Materialni o'chirishda kutilmagan javob: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Materialni o'chirishda xatolik:", error.response?.data || error.message);
      let errorMessage = "Materialni o'chirishda xatolik yuz berdi.";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Material topilmadi yoki allaqachon o'chirilgan.";
        } else if (error.response.status === 403) {
          errorMessage = "Materialni o'chirish uchun ruxsatingiz yo'q.";
        } else {
            const apiErrors = parseApiErrors(error);
            errorMessage += `\n${apiErrors}`;
        }
      } else {
        errorMessage += `\n${error.message || "Server bilan bog'lanishda muammo."}`
      }
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (bytes == null || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };


  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="ml-4 text-lg">Yuklanmoqda...</p>
        </div>
      </AdminLayout>
    );
  }

  // Video manbasini aniqlash
  let currentVideoSrc: string | null = null;
  if (formData.material_type === 'video' && VIDEO_FILE_FORMATS.includes(formData.file_format)) {
    if (videoPreviewUrl) { // Birinchi navbatda yangi yuklangan fayl uchun preview
      currentVideoSrc = videoPreviewUrl;
    } else if (formData.current_file_url) { // Keyin mavjud fayl URL'i
      currentVideoSrc = formData.current_file_url;
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.back()} disabled={isSubmitting || isDeleting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Materialni tahrirlash</h2>
              <p className="text-sm text-gray-600">ID: #{materialId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button form="edit-material-form" type="submit" disabled={isSubmitting || isLoadingData || isDeleting}>
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
            <Button variant="destructive" type="button" onClick={handleDelete} disabled={isSubmitting || isLoadingData || isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  O'chirilmoqda...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  O'chirish
                </>
              )}
            </Button>
          </div>
        </div>

        <form id="edit-material-form" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Material ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Material nomi <span className="text-red-500">*</span></Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required disabled={isSubmitting || isDeleting}/>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Tavsif</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} disabled={isSubmitting || isDeleting}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="subject">Fan <span className="text-red-500">*</span></Label>
                    <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)} name="subject" disabled={isSubmitting || isDeleting}>
                      <SelectTrigger><SelectValue placeholder="Fanni tanlang" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="material_type">Material turi <span className="text-red-500">*</span></Label>
                    <Select value={formData.material_type} onValueChange={(value) => handleSelectChange("material_type", value)} disabled={isSubmitting || isDeleting}>
                      <SelectTrigger><SelectValue placeholder="Turni tanlang" /></SelectTrigger>
                      <SelectContent>
                        {MATERIAL_TYPES.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="file_format">Fayl formati <span className="text-red-500">*</span></Label>
                    <Select value={formData.file_format} onValueChange={(value) => handleSelectChange("file_format", value)} disabled={isSubmitting || isDeleting}>
                      <SelectTrigger><SelectValue placeholder="Formatni tanlang" /></SelectTrigger>
                      <SelectContent>
                        {FILE_FORMATS.map(format => <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} disabled={isSubmitting || isDeleting}>
                      <SelectTrigger><SelectValue placeholder="Statusni tanlang" /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="grid gap-3">
                    <Label htmlFor="is_free" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="is_free" name="is_free" checked={formData.is_free} onCheckedChange={(checked) => handleSwitchChange("is_free", checked)} disabled={isSubmitting || isDeleting}/>
                      Bepul
                    </Label>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="price">Narxi (so'm){!formData.is_free && <span className="text-red-500">*</span>}</Label>
                    <Input id="price" name="price" type="number" value={formData.is_free ? "0" : formData.price} onChange={handleInputChange} disabled={formData.is_free || isSubmitting || isDeleting} min="0" step="0.01" required={!formData.is_free} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- VIDEO PREVIEW QO'SHILDI --- */}
            {currentVideoSrc && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PlayCircle className="mr-2 h-5 w-5 text-blue-600" />
                    Video Ko'rish
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    key={currentVideoSrc} // Muhim: src o'zgarganda videoni qayta yuklash uchun
                    width="100%"
                    controls
                    className="rounded-lg border bg-slate-100"
                    src={currentVideoSrc}
                  >
                    Brauzeringiz video tegini qo'llab-quvvatlamaydi.
                    <a href={currentVideoSrc} target="_blank" rel="noopener noreferrer">Videoni yuklab oling</a>
                  </video>
                </CardContent>
              </Card>
            )}
            {/* --- VIDEO PREVIEW TUGADI --- */}


            {formData.file_format && formData.file_format !== 'link' && (
              <Card>
                <CardHeader><CardTitle>Faylni o'zgartirish</CardTitle></CardHeader>
                <CardContent>
                  {formData.current_file_url && (
                    <div className="mb-4 p-3 border rounded-lg flex items-center justify-between bg-slate-50">
                      <div>
                          <p className="font-medium text-sm text-gray-700">Mavjud fayl:</p>
                          <a href={formData.current_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate block max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
                              {formData.current_file_url.substring(formData.current_file_url.lastIndexOf('/') + 1) || formData.current_file_url}
                          </a>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(true)} disabled={isSubmitting || isDeleting} aria-label="Mavjud faylni olib tashlash">
                          <X className="h-5 w-5 text-red-500 hover:text-red-700" />
                      </Button>
                    </div>
                  )}
                  {!formData.current_file_url && <p className="text-sm text-muted-foreground mb-3">Hozirda fayl yuklanmagan yoki olib tashlangan. Yangisini yuklang.</p>}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <FileUp className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-600">Yangi fayl yuklash uchun bosing yoki sudrab olib keling</p>
                    <Input 
                        id="file-upload" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept={
                            formData.file_format !== 'other' && formData.file_format 
                            ? (VIDEO_FILE_FORMATS.includes(formData.file_format) ? 'video/*' : `.${formData.file_format}`) // Video formatlar uchun umumiy `video/*` ishlatamiz
                            : '*/*'
                        } 
                        disabled={isSubmitting || isDeleting}
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()} disabled={isSubmitting || isDeleting}>Faylni tanlash</Button>
                    {formData.file_format && formData.file_format !== 'other' && (
                        <p className="text-xs text-gray-500 mt-2">
                            {VIDEO_FILE_FORMATS.includes(formData.file_format) 
                                ? `Faqat video fayllar (masalan, ${formData.file_format.toUpperCase()})`
                                : `Faqat <span className="font-semibold">.${formData.file_format}</span> formatidagi fayllar`
                            }
                        </p>
                    )}
                  </div>
                  {formData.file && (
                    <div className="mt-4 p-3 border rounded-lg flex items-center justify-between bg-blue-50">
                       <div>
                          <p className="font-medium text-sm text-gray-700">Tanlangan yangi fayl:</p>
                          <p className="text-sm text-gray-800">{formData.file.name} ({formatFileSize(formData.file.size)})</p>
                       </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(false)} disabled={isSubmitting || isDeleting} aria-label="Tanlangan yangi faylni olib tashlash">
                          <X className="h-5 w-5 text-red-500 hover:text-red-700" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {formData.file_format === 'link' && (
              <Card>
                <CardHeader><CardTitle>Havolani o'zgartirish</CardTitle></CardHeader>
                <CardContent>
                  <Label htmlFor="link">Havola (URL) <span className="text-red-500">*</span></Label>
                  <Input id="link" name="link" type="url" value={formData.link} onChange={handleInputChange} required placeholder="https://example.com/material-link" disabled={isSubmitting || isDeleting}/>
                  <p className="text-xs text-gray-500 mt-1">To'liq URL manzilini kiriting (masalan, https://...).</p>
                </CardContent>
              </Card>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}