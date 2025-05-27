"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  GraduationCap,
  History,
  Loader2,
  Star,
  Wallet,
  AlertCircle,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface TestSubject {
  id: number;
  name: string;
  icon?: string;
}

interface TestDetail {
  id: number;
  title: string;
  subject: TestSubject;
}

interface TestHistoryItem {
  id: number;
  test: TestDetail;
  score: number;
  total_questions: number;
  end_time: string;
  start_time: string;
  status_display: string;
}

interface MaterialSubject {
  id: number;
  name: string;
}

interface Material {
  id: number;
  title: string;
  subject: MaterialSubject;
  material_type: string;
  format?: string;
  size?: string;
  price?: number;
  is_free: boolean;
  description?: string;
  download_url: string;
}

interface Payment {
  id: number;
  created_at: string;
  description: string;
  payment_type: string;
  payment_type_display?: string;
  amount_display: string;
  status: string;
  status_display?: string;
}

interface UserProfile {
  full_name?: string;
  birth_date?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  school?: string;
  grade?: string;
  target_university?: string;
  target_faculty?: string;
}

interface UserSettings {
  language?: string;
  theme?: string;
  notify_email?: boolean;
  notify_sms?: boolean;
  notify_push?: boolean;
  two_factor_enabled?: boolean;
  autoplay_videos?: boolean;
}

interface RecommendedTest {
  id: number;
  title: string;
  subject: TestSubject;
  test_type: string;
  type_display: string;
  question_count: number;
  difficulty: string;
  difficulty_display: string;
  price: string;
  price_display: string;
  time_limit: number;
  reward_points: number;
  status: string;
  status_display: string;
  created_at: string;
}

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>([]);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState<boolean>(true);
  const [errorMaterials, setErrorMaterials] = useState<string | null>(null);
  const [activeMaterialTypeFilter, setActiveMaterialTypeFilter] = useState<string>("all");

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(true);
  const [errorPayments, setErrorPayments] = useState<string | null>(null);
  const [activePaymentTypeFilter, setActivePaymentTypeFilter] = useState<string>("all");

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);
  const [errorSettings, setErrorSettings] = useState<string | null>(null);

  const [recommendedTests, setRecommendedTests] = useState<RecommendedTest[]>([]);
  const [loadingRecommendedTests, setLoadingRecommendedTests] = useState<boolean>(true);
  const [errorRecommendedTests, setErrorRecommendedTests] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`https://testonline.pythonanywhere.com/api/profile/test-history/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTestHistory(res.data.results || res.data);
        })
        .catch((err) => {
          console.error("Test tarixi yuklashda xatolik:", err);
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMaterials("Materiallarni ko'rish uchun tizimga kiring.");
      setLoadingMaterials(false);
      return;
    }
    setLoadingMaterials(true);
    setErrorMaterials(null);
    const params: { material_type?: string } = {};
    if (activeMaterialTypeFilter && activeMaterialTypeFilter !== "all") {
      params.material_type = activeMaterialTypeFilter;
    }
    axios
      .get(`https://testonline.pythonanywhere.com/api/materials/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((res) => {
        setMaterials(res.data.results || res.data);
        setLoadingMaterials(false);
      })
      .catch((err) => {
        console.error("Materiallarni yuklashda xatolik:", err);
        setErrorMaterials(
          "Materiallarni yuklashda xatolik yuz berdi."
        );
        setLoadingMaterials(false);
      });
  }, [activeMaterialTypeFilter]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorPayments("To'lovlar tarixini ko'rish uchun tizimga kiring.");
      setLoadingPayments(false);
      return;
    }
    setLoadingPayments(true);
    setErrorPayments(null);
    const params: { payment_type?: string } = {};
    if (activePaymentTypeFilter && activePaymentTypeFilter !== "all") {
      params.payment_type = activePaymentTypeFilter;
    }
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/payment-history/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((res) => {
        setPayments(res.data.results || res.data);
        setLoadingPayments(false);
      })
      .catch((err) => {
        console.error("To'lovlar tarixini yuklashda xatolik:", err);
        setErrorPayments(
          "To'lovlar tarixini yuklashda xatolik yuz berdi."
        );
        setLoadingPayments(false);
      });
  }, [activePaymentTypeFilter]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorProfile("Shaxsiy ma'lumotlarni ko'rish uchun tizimga kiring.");
      setLoadingProfile(false);
      setErrorSettings("Sozlamalarni ko'rish uchun tizimga kiring.");
      setLoadingSettings(false);
      setErrorRecommendedTests("Tavsiya etilgan testlarni ko'rish uchun tizimga kiring.");
      setLoadingRecommendedTests(false);
      return;
    }

    setLoadingProfile(true);
    setErrorProfile(null);
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/me/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserProfile(res.data);
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error("Shaxsiy ma'lumotlarni yuklashda xatolik:", err);
        setErrorProfile(
          "Shaxsiy ma'lumotlarni yuklashda xatolik yuz berdi."
        );
        setLoadingProfile(false);
         if (err.response?.data?.detail === "Given token not valid for any token type") {
          localStorage.clear()
          router.push("/")
        }
      });

    setLoadingSettings(true);
    setErrorSettings(null);
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/settings/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserSettings(res.data);
        setLoadingSettings(false);
      })
      .catch((err) => {
        console.error("Sozlamalarni yuklashda xatolik:", err);
        setErrorSettings(
          "Sozlamalarni yuklashda xatolik yuz berdi."
        );
        setLoadingSettings(false);
         if (err.response?.data?.detail === "Given token not valid for any token type") {
          localStorage.clear()
          router.push("/")
        }
      });
    
    setLoadingRecommendedTests(true);
    setErrorRecommendedTests(null);
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/recommended-tests/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { limit: 3 } // Default 3 ta so'raymiz, o'zgartirish mumkin
      })
      .then((res) => {
        setRecommendedTests(res.data || []);
        setLoadingRecommendedTests(false);
      })
      .catch((err) => {
        console.error("Tavsiya etilgan testlarni yuklashda xatolik:", err);
        setErrorRecommendedTests(
          "Tavsiya etilgan testlarni yuklashda xatolik yuz berdi."
        );
        setLoadingRecommendedTests(false);
         if (err.response?.data?.detail === "Given token not valid for any token type") {
          localStorage.clear()
          router.push("/")
        }
      });

  }, [router]);


  const handleStartTest = (testId: number) => {
    router.push(`/tests/${testId}`);
  };

  const handleViewTest = (testId: number) => {
    router.push(`/tests/results/${testId}`);
  };

  const handleDownloadMaterial = (downloadUrl: string) => {
    window.open(downloadUrl, "_blank");
  };

  const handleAddFunds = (amount: number) => {
    router.push(`/payments/add?amount=${amount}`);
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleCreateSchedule = () => {
    router.push("/schedule/create");
  };

  const handleUpdateSetting = async (settingKey: keyof UserSettings, value: any) => {
    const token = localStorage.getItem("token");
    if (!token || !userSettings) return;

    const originalSettings = { ...userSettings };
    const optimisticUserSettings = { ...userSettings, [settingKey]: value };
    setUserSettings(optimisticUserSettings);

    try {
      const response = await axios.patch(
        `https://testonline.pythonanywhere.com/api/profile/settings/`,
        { [settingKey]: value },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserSettings(response.data);
    } catch (error) {
      console.error(`Error updating ${settingKey}:`, error);
      setUserSettings(originalSettings);
       if ((error as any).response?.data?.detail === "Given token not valid for any token type") {
        localStorage.clear()
        router.push("/")
      }
    }
  };


  return (
    <Tabs
      defaultValue="overview"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="overview">Umumiy</TabsTrigger>
        <TabsTrigger value="tests">Testlar</TabsTrigger>
        <TabsTrigger value="materials">Materiallar</TabsTrigger>
        <TabsTrigger value="payments">To'lovlar</TabsTrigger>
        <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <History className="mr-2 h-5 w-5 text-blue-500" />
                So'nggi faoliyat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testHistory.length > 0 ? (
                  testHistory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {item.test.subject.name}
                            </Badge>
                            <h3 className="font-medium">{item.test.title}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(item.end_time).toLocaleDateString(
                              "uz-UZ"
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {item.score}/{item.total_questions}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.round(
                              (item.score / item.total_questions) * 100
                            )}
                            %
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={(item.score / item.total_questions) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Test tarixi hozircha mavjud emas.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Star className="mr-2 h-5 w-5 text-amber-500" />
                Tavsiya etilgan testlar
              </CardTitle>
              <CardDescription>
                Sizning o'qish ko'rsatkichlaringizga asoslangan testlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecommendedTests && (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="ml-2 text-sm">Yuklanmoqda...</p>
                </div>
              )}
              {errorRecommendedTests && !loadingRecommendedTests && (
                <div className="flex flex-col justify-center items-center py-6 text-red-500">
                  <AlertCircle className="h-6 w-6 mb-1" />
                  <p className="text-sm">{errorRecommendedTests}</p>
                </div>
              )}
              {!loadingRecommendedTests && !errorRecommendedTests && recommendedTests.length === 0 && (
                 <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">Hozircha sizga tavsiya etilgan testlar mavjud emas.</p>
                 </div>
              )}
              {!loadingRecommendedTests && !errorRecommendedTests && recommendedTests.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedTests.map((test) => (
                    <Card key={test.id} className="border">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2">
                          {test.subject.name}
                        </Badge>
                        <h3 className="font-medium mb-1 text-base">{test.title}</h3>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            {test.difficulty_display}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartTest(test.id)}
                          >
                            Boshlash
                          </Button>
                        </div>
                         <div className="text-xs text-gray-400 mt-1">
                            {test.question_count} savol, {test.time_limit} daq.
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                O'qish jadvali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-gray-500">
                  Bu yerda sizning shaxsiy o'qish jadvalingiz bo'ladi
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={handleCreateSchedule}
                >
                  Jadval yaratish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tests">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Mening testlarim
            </CardTitle>
            <CardDescription>Siz ishtirok etgan barcha testlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/tests/all")}
                  >
                    Barchasi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/tests/completed")}
                  >
                    Tugatilgan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/tests/incomplete")}
                  >
                    Tugatilmagan
                  </Button>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/tests/report")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Hisobot
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Test nomi</th>
                        <th className="text-left p-3 font-medium">Fan</th>
                        <th className="text-left p-3 font-medium">Sana</th>
                        <th className="text-left p-3 font-medium">Ball</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {testHistory.length > 0 ? (
                        testHistory.map((testItem) => (
                          <tr key={testItem.id} className="border-t">
                            <td className="p-3">{testItem.test.title}</td>
                            <td className="p-3">{testItem.test.subject.name}</td>
                            <td className="p-3">
                              {new Date(testItem.start_time).toLocaleDateString(
                                "uz-UZ"
                              )}
                            </td>
                            <td className="p-3 font-medium">
                              {testItem.score}/{testItem.total_questions}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />{" "}
                                {testItem.status_display}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewTest(testItem.id)}
                              >
                                Ko'rish
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-sm text-gray-500">
                            Testlar tarixi mavjud emas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="materials">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              O'quv materiallari
            </CardTitle>
            <CardDescription>
              Sizga tavsiya etilgan va yuklab olishingiz mumkin bo'lgan materiallar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant={activeMaterialTypeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveMaterialTypeFilter("all");
                    }}
                  >
                    Barchasi
                  </Button>
                  <Button
                    variant={activeMaterialTypeFilter === "book" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveMaterialTypeFilter("book");
                    }}
                  >
                    Kitoblar
                  </Button>
                  <Button
                    variant={activeMaterialTypeFilter === "video" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveMaterialTypeFilter("video");
                    }}
                  >
                    Video darslar
                  </Button>
                  <Button
                    variant={activeMaterialTypeFilter === "guide" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveMaterialTypeFilter("guide");
                    }}
                  >
                    Qo'llanmalar
                  </Button>
                </div>
              </div>

              {loadingMaterials && (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="ml-2">Materiallar yuklanmoqda...</p>
                </div>
              )}

              {errorMaterials && !loadingMaterials && (
                <div className="flex flex-col justify-center items-center py-10 text-red-600">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>{errorMaterials}</p>
                </div>
              )}

              {!loadingMaterials && !errorMaterials && materials.length === 0 && (
                 <div className="text-center py-10">
                    <p className="text-gray-500">Hozircha materiallar mavjud emas.</p>
                 </div>
              )}

              {!loadingMaterials && !errorMaterials && materials.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((material) => (
                    <Card key={material.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center mr-3">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-1">
                              {material.subject.name}
                            </Badge>
                            <h3 className="font-medium">{material.title}</h3>
                            {(material.format || material.size) && (
                               <div className="text-sm text-gray-500 mt-1">
                                {material.format}
                                {material.format && material.size && ", "}
                                {material.size}
                              </div>
                            )}
                             <div className="text-sm text-gray-500 mt-1">
                                {material.is_free ? "Bepul" : `Narxi: ${material.price || 0} so'm`}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                               <div className="text-sm text-gray-500">
                                {material.material_type === "book" && "Kitob"}
                                {material.material_type === "video" && "Video dars"}
                                {material.material_type === "guide" && "Qo'llanma"}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownloadMaterial(material.download_url)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                {material.material_type === 'video' ? "Ko'rish" : "Yuklab olish"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-blue-500" />
              To'lovlar tarixi
            </CardTitle>
            <CardDescription>
              Hisobingiz bo'yicha barcha operatsiyalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant={activePaymentTypeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePaymentTypeFilter("all")}
                  >
                    Barchasi
                  </Button>
                  <Button
                    variant={activePaymentTypeFilter === "income" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePaymentTypeFilter("income")}
                  >
                    Kirim
                  </Button>
                  <Button
                    variant={activePaymentTypeFilter === "expense" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePaymentTypeFilter("expense")}
                  >
                    Chiqim
                  </Button>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/payments/report")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Hisobot
                  </Button>
                </div>
              </div>

              {loadingPayments && (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="ml-2">To'lovlar yuklanmoqda...</p>
                </div>
              )}

              {errorPayments && !loadingPayments && (
                <div className="flex flex-col justify-center items-center py-10 text-red-600">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>{errorPayments}</p>
                </div>
              )}

              {!loadingPayments && !errorPayments && payments.length === 0 && (
                 <div className="text-center py-10">
                    <p className="text-gray-500">Hozircha to'lovlar mavjud emas.</p>
                 </div>
              )}
              
              {!loadingPayments && !errorPayments && payments.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Sana</th>
                          <th className="text-left p-3 font-medium">Tavsif</th>
                          <th className="text-left p-3 font-medium">Tur</th>
                          <th className="text-right p-3 font-medium">Summa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-t">
                            <td className="p-3">
                              {new Date(payment.created_at).toLocaleDateString(
                                "uz-UZ"
                              )}
                            </td>
                            <td className="p-3">{payment.description}</td>
                            <td className="p-3">
                              <Badge
                                variant={payment.amount_display.startsWith('+') ? "outline" : "secondary"}
                                className={
                                  payment.amount_display.startsWith('+')
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }
                              >
                                {payment.payment_type_display || payment.payment_type}
                              </Badge>
                            </td>
                            <td
                              className={`p-3 text-right font-medium ${
                                payment.amount_display.startsWith('+')
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {payment.amount_display}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Hisobni to'ldirish</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col"
                    onClick={() => handleAddFunds(10000)}
                  >
                    <span className="text-lg font-bold">10,000</span>
                    <span className="text-sm text-gray-500">so'm</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col"
                    onClick={() => handleAddFunds(50000)}
                  >
                    <span className="text-lg font-bold">50,000</span>
                    <span className="text-sm text-gray-500">so'm</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col"
                    onClick={() => handleAddFunds(100000)}
                  >
                    <span className="text-lg font-bold">100,000</span>
                    <span className="text-sm text-gray-500">so'm</span>
                  </Button>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => router.push("/payments/add")}
                >
                  To'ldirish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        {(loadingProfile || loadingSettings) && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-2">Ma'lumotlar yuklanmoqda...</p>
          </div>
        )}

        {(errorProfile || errorSettings) && !loadingProfile && !loadingSettings && (
           <div className="flex flex-col justify-center items-center py-10 text-red-600">
             <AlertCircle className="h-8 w-8 mb-2" />
             <p>{errorProfile || errorSettings}</p>
           </div>
        )}
        
        {!loadingProfile && !errorProfile && userProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
                Shaxsiy ma'lumotlar
              </CardTitle>
              <CardDescription>Sizning shaxsiy ma'lumotlaringiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        To'liq ism
                      </h3>
                      <p>{userProfile.full_name || "-"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Tug'ilgan sana
                      </h3>
                      <p>
                        {userProfile.birth_date
                          ? new Date(userProfile.birth_date).toLocaleDateString("uz-UZ")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Telefon raqam
                      </h3>
                      <p>{userProfile.phone_number || "-"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Email
                      </h3>
                      <p>{userProfile.email || "-"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Manzil
                      </h3>
                      <p>{userProfile.address || "-"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Maktab
                      </h3>
                      <p>{userProfile.school || "-"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Sinf
                      </h3>
                      <p>{userProfile.grade || "-"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Maqsad universitet
                      </h3>
                      <p>{userProfile.target_university || "-"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Maqsad fakultet
                      </h3>
                      <p>{userProfile.target_faculty || "-"}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleEditProfile}>
                  Ma'lumotlarni tahrirlash
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!loadingSettings && !errorSettings && userSettings && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-blue-500" />
                Umumiy sozlamalar
              </CardTitle>
              <CardDescription>Bildirishnomalar, til va boshqa afzalliklar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email bildirishnomalari</h3>
                    <p className="text-sm text-gray-500">
                      Muhim yangiliklar va hisobotlarni email orqali olish
                    </p>
                  </div>
                  <div>
                    <Button
                      variant={userSettings.notify_email ? "default" : "outline"}
                      onClick={() => handleUpdateSetting("notify_email", !userSettings.notify_email)}
                    >
                      {userSettings.notify_email ? "Yoqilgan" : "Yoqish"}
                    </Button>
                  </div>
                </div>
                 <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Ikki faktorli autentifikatsiya</h3>
                    <p className="text-sm text-gray-500">
                      Hisobingiz xavfsizligini oshirish
                    </p>
                  </div>
                  <div>
                     <Button
                      variant={userSettings.two_factor_enabled ? "default" : "outline"}
                      onClick={() => {
                        handleUpdateSetting("two_factor_enabled", !userSettings.two_factor_enabled)
                      }}
                    >
                      {userSettings.two_factor_enabled ? "O'chirish" : "Yoqish"}
                    </Button>
                  </div>
                </div>
                 <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Til</h3>
                    <p className="text-sm text-gray-500">
                      Platforma interfeysi tili ({userSettings.language || "uz"})
                    </p>
                  </div>
                  <div>
                     <Button
                      variant="outline"
                      onClick={() => {
                        alert("Tilni o'zgartirish funksiyasi keyinroq qo'shiladi.")
                      }}
                    >
                      O'zgartirish
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
         <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-blue-500" />
              Xavfsizlik
            </CardTitle>
            <CardDescription>Parolni o'zgartirish</CardDescription>
          </CardHeader>
          <CardContent>
             <Button
                onClick={() => router.push("/profile/change-password")}
              >
                Parolni o'zgartirish
              </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}