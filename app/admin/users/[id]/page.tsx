"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart2, FileText, Mail, Phone, Save, User, Wallet } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Label } from "@/components/ui/label";
import axios from "axios";

// Komponentning interfeysi
interface UserDetailPageProps {
  params: Promise<{ id: string }>; // params Promise sifatida aniqlanadi
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null); // userId ni state sifatida aniqlaymiz
  const [activeTab, setActiveTab] = useState("profile");
  const [userInfo, setUserInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentsHistoryUser, setPaymentsHistory] = useState<any[]>([]);
  const [statistichis, setStatistichis] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null); // Token uchun state
  // /////////////////////////
  const [test, setTest] = useState([])


  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    study_place: "",
    grade: "",
    target_university: "",
    target_faculty: "",
    about_me: "",
    status: "Faol",
  });

  // params ni hal qilish uchun useEffect ishlatamiz
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params; // params ni await qilamiz
      setUserId(resolvedParams.id); // userId ni state ga o‘rnatamiz
    };

    resolveParams();
  }, [params]);

  // Tokenni olish
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // ///////////////////////////////////////////////////////////////////
  // useEffect(() =>{
  //   axios.get(`https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/test-history/`, {
  //     headers:{
  //       "Content-Type":"application/json", 
  //       Authorization:`Bearer ${localStorage.getItem("token")}`
  //     }
  //   })
  //   .then((res) =>{
  //     console.log(74, res);
      
  //   })
  //   .catch((err) =>{
  //     console.log(err);
      
  //   })
  // }, [])
  
  // ///////////////////////////////////////////////////////////////////


  // Foydalanuvchi ma'lumotlarini API'dan olish
  const fetchUserData = (callback?: (data: any) => void) => {
    if (!token) {
      alert("Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.");
      router.push("/");
      return;
    }

    if (!userId) return; // userId hali aniqlanmagan bo‘lsa, so‘rov yubormaymiz

    setIsLoading(true);
    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserInfo(res.data);
        setFormData({
          full_name: res.data.full_name || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || "",
          address: res.data.address || "",
          study_place: res.data.study_place || "",
          grade: res.data.grade || "",
          target_university: res.data.target_university || "",
          target_faculty: res.data.target_faculty || "",
          about_me: res.data.about_me || "",
          status: res.data.status || "Faol",
        });
        if (callback) callback(res.data);
      })
      .catch((err) => {
        console.log("Foydalanuvchi ma'lumotlarini olishda xatolik:", err);
        if (err.response?.status === 401) {
          alert("Avtorizatsiya xatosi: Token noto‘g‘ri yoki muddati o‘tgan. Iltimos, qayta kiring.");
          localStorage.removeItem("token");
          router.push("/");
        } else {
          alert("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi!");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Foydalanuvchi to'lov tarixini olish
  const fetchPaymentsHistory = () => {
    if (!token || !userId) return;

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/payment-history/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setPaymentsHistory(res.data || []);
        }
      })
      .catch((err) => {
        console.log("To'lov tarixini olishda xatolik:", err);
        if (err.response?.status === 401) {
          alert("Avtorizatsiya xatosi: Token noto‘g‘ri yoki muddati o‘tgan. Iltimos, qayta kiring.");
          localStorage.removeItem("token");
          router.push("/");
        }
      });
  };

  // Foydalanuvchi statistikasini olish
  const fetchStatistics = () => {
    if (!token || !userId) return;

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/statistics/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStatistichis(Array.isArray(res.data) ? res.data : [res.data]);
      })
      .catch((err) => {
        console.log("Statistika olishda xatolik:", err);
        if (err.response?.status === 401) {
          alert("Avtorizatsiya xatosi: Token noto‘g‘ri yoki muddati o‘tgan. Iltimos, qayta kiring.");
          localStorage.removeItem("token");
          router.push("/");
        }
      });
  };

  // Komponent yuklanganda ma'lumotlarni olish
  useEffect(() => {
    if (token && userId) {
      fetchUserData();
      fetchPaymentsHistory();
      fetchStatistics();
    }
  }, [token, userId]);

  // userId hali aniqlanmagan bo‘lsa, loading ko‘rsatamiz
  if (!userId) {
    return <div className="p-6 text-center">Yuklanmoqda...</div>;
  }

  const userData = {
    id: userId,
    name: userInfo.full_name || "",
    phone: userInfo.phone_number || "",
    email: userInfo.email || "",
    registrationDate: new Date().toISOString(),
    status: formData.status || "Faol",
    role: userInfo.role_display || "Student",
    balance: userInfo.balance ?? 0,
    address: userInfo.address || "",
    school: userInfo.study_place || "",
    grade: userInfo.grade || "",
    targetUniversity: userInfo.target_university || "",
    targetFaculty: userInfo.target_faculty || "",
    completedTests: 24,
    averageScore: 78,
    notes: userInfo.about_me || "",
  };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: checked ? "Faol" : "Nofaol",
    }));
  };

  const handleSaveChanges = () => {
    if (isLoading) {
      alert("Ma'lumotlar hali yuklanmoqda, iltimos kuting...");
      return;
    }

    setIsLoading(true);
    const updatedData = {
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      email: formData.email,
      birth_date: userInfo.birth_date || "2025-04-09",
      gender: userInfo.gender || "male",
      region: userInfo.region || "",
      study_place: formData.study_place,
      grade: formData.grade,
      address: formData.address,
      target_university: formData.target_university,
      target_faculty: formData.target_faculty,
      about_me: formData.about_me,
    };

    axios
      .put(
        `https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
          setUserInfo(response.data);
          fetchUserData();
        }
      })
      .catch((error) => {
        console.error("Yangilashda xatolik:", error);
        if (error.response?.status === 401) {
          alert("Avtorizatsiya xatosi: Token noto‘g‘ri yoki muddati o‘tgan. Iltimos, qayta kiring.");
          localStorage.removeItem("token");
          router.push("/");
        } else {
          alert("Ma'lumotlarni yangilashda xatolik yuz berdi!");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleBlockUser = () => {
    if (!token) {
      alert("Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.");
      router.push("/");
      return;
    }

    setIsLoading(true);
    axios
      .post(
        `https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/block/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        alert("Foydalanuvchi muvaffaqiyatli bloklandi!");
        fetchUserData(); // Ma'lumotlarni yangilash
      })
      .catch((err) => {
        console.log("Bloklashda xatolik:", err);
        if (err.response?.status === 401) {
          alert("Avtorizatsiya xatosi: Token noto‘g‘ri yoki muddati o‘tgan. Iltimos, qayta kiring.");
          localStorage.removeItem("token");
          router.push("/");
        } else {
          alert("Foydalanuvchi bloklashda xatolik yuz berdi!");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUnblockUser = () => {
    if (!token) {
      alert("Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.");
      router.push("/");
      return;
    }

    setIsLoading(true);
    axios
      .post(
        `https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/unblock/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        alert("Foydalanuvchi muvaffaqiyatli blokdan ochildi!");
        fetchUserData(); // Ma'lumotlarni yangilash
      })
      .catch((err) => {
        console.log("Blokdan ochishda xatolik:", err);
        if (err.response?.status === 401) {
          alert("Avtorizatsiya xatosi: Token noto‘g‘ri yoki muddati o‘tgan. Iltimos, qayta kiring.");
          localStorage.removeItem("token");
          router.push("/");
        } else {
          alert("Foydalanuvchi blokdan ochishda xatolik yuz berdi!");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteUser = () => {
    if (!token) {
      alert("Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.");
      router.push("/");
      return;
    }

    if (confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) {
      setIsLoading(true);
      axios
        .delete(`https://testonline.pythonanywhere.com/api/admin/users/${Number(userId)}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          alert("Foydalanuvchi muvaffaqiyatli o'chirildi!");
          router.push("/admin/dashboard");
        })
        .catch((err) => {
          console.log("O'chirishda xatolik:", err);
          if (err.response?.status === 401) {
            alert("Avtorizatsiya xatosi: Token noto‘g‘ri yoki muddati o‘tgan. Iltimos, qayta kiring.");
            localStorage.removeItem("token");
            router.push("/");
          } else {
            alert("Foydalanuvchi o'chirishda xatolik yuz berdi!");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {isLoading && <div className="text-center">Yuklanmoqda...</div>}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-2xl font-bold mb-1">Foydalanuvchi ma'lumotlari</h2>
              <p className="text-gray-600">ID: {userId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleUnblockUser} disabled={isLoading}>
              Blokdan ochish
            </Button>
            <Button variant="outline" onClick={handleBlockUser} disabled={isLoading}>
              Bloklash
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isLoading}>
              O'chirish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="tests">Testlar</TabsTrigger>
            <TabsTrigger value="payments">To'lovlar</TabsTrigger>
            <TabsTrigger value="statistics">Statistika</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
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
                          <Label htmlFor="full_name">To'liq ism</Label>
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Telefon</Label>
                          <Input
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Manzil</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="study_place">Maktab</Label>
                          <Input
                            id="study_place"
                            value={formData.study_place}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade">Sinf</Label>
                          <Input
                            id="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="target_university">Maqsad universitet</Label>
                          <Input
                            id="target_university"
                            value={formData.target_university}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="target_faculty">Maqsad fakultet</Label>
                          <Input
                            id="target_faculty"
                            value={formData.target_faculty}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about_me">Qo'shimcha ma'lumotlar</Label>
                        <Textarea
                          id="about_me"
                          value={formData.about_me}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="active-status">Faol holati</Label>
                          <div className="text-sm text-gray-500">Foydalanuvchi faol holatini o'zgartirish</div>
                        </div>
                        <Switch
                          id="active-status"
                          checked={formData.status === "Faol"}
                          onCheckedChange={handleStatusChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      Saqlash
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-blue-500" />
                      Foydalanuvchi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{userData.name}</h3>
                      {/* //////////////////////////// test-1 */}
                      <Badge className="mb-4">{userData.role}</Badge>
                      <div className="w-full space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{userData.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{userData.phone}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wallet className="mr-2 h-5 w-5 text-blue-500" />
                      Balans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{userData.balance.toLocaleString()} so'm</div>
                      <Button className="w-full" onClick={() => router.push(`/admin/payments/add/${userId}`)}>
                        Balansni to'ldirish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Foydalanuvchi testlari
                </CardTitle>
                <CardDescription>Foydalanuvchi tomonidan ishlangan testlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Test nomi</th>
                          <th className="text-left p-3 font-medium">Fan</th>
                          <th className="text-left p-3 font-medium">Sana</th>
                          <th className="text-left p-3 font-medium">Ball</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* ///////////////////////////////////////////////////////// */}
                        <tr className="border-t">
                          <td className="p-3">#1000</td>
                          <td className="p-3">Test 1</td>
                          <td className="p-3">Matematika</td>
                          <td className="p-3">08/04/2025</td>
                          <td className="p-3 font-medium">91/100</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Tugatilgan
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/tests/1000`)}>
                              Ko'rish
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3">#1001</td>
                          <td className="p-3">Test 2</td>
                          <td className="p-3">Fizika</td>
                          <td className="p-3">09/04/2025</td>
                          <td className="p-3 font-medium">85/100</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Tugatilgan
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/tests/1001`)}>
                              Ko'rish
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-blue-500" />
                  Foydalanuvchi to'lovlari
                </CardTitle>
                <CardDescription>Foydalanuvchi tomonidan amalga oshirilgan to'lovlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Tavsif</th>
                          <th className="text-left p-3 font-medium">Tur</th>
                          <th className="text-right p-3 font-medium">Summa</th>
                          <th className="text-left p-3 font-medium">Sana</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentsHistoryUser.length > 0 ? (
                          paymentsHistoryUser.map((paymenthis, index) => (
                            <tr className="border-t" key={index}>
                              <td className="p-3">#{paymenthis.id}</td>
                              <td className="p-3">{paymenthis.type_display || "Noma'lum"}</td>
                              <td className="p-3">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {paymenthis.payment_type || "Noma'lum"}
                                </Badge>
                              </td>
                              <td className="p-3 text-right font-medium text-green-600">
                                {paymenthis.amount_display || "0 so'm"}
                              </td>
                              <td className="p-3">{paymenthis.created_at || "Noma'lum"}</td>
                              <td className="p-3">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {paymenthis.status_display || "Noma'lum"}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/payments/${paymenthis.id}`)}
                                >
                                  Ko'rish
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-3 text-center text-gray-500">
                              To'lov tarixi mavjud emas
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
                  Foydalanuvchi statistikasi
                </CardTitle>
                <CardDescription>Foydalanuvchining o'qish ko'rsatkichlari</CardDescription>
              </CardHeader>
              <CardContent>
                {statistichis.length > 0 ? (
                  statistichis.map((value, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Tugatilgan testlar</div>
                          <div className="text-2xl font-bold">{value.completed_tests || 0}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">O'rtacha ball</div>
                          <div className="text-2xl font-bold">{value.average_score || 0}%</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-gray-500">Jami to'lovlar</div>
                          <div className="text-2xl font-bold">{value.total_payments || 0} so'm</div>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4">
                    <p className="text-gray-500">Statistika ma'lumotlari mavjud emas</p>
                  </div>
                )}
                <div className="text-center p-10 border rounded-lg">
                  <p className="text-gray-500">Bu yerda foydalanuvchi statistikasi grafiklari bo'ladi</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => router.push(`/admin/statistics/users/${userId}`)}
                  >
                    Batafsil statistika
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}