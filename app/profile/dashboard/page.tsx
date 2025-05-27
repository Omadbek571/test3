"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  Star,
  Target,
  TrendingUp,
  User,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

interface UserRatingData {
  total_score?: number;
  rank?: number;
  level?: number;
  points_to_next_level?: number;
  current_level_points?: number;
  level_progress_percentage?: number;
  math_score?: number;
  physics_score?: number;
  english_score?: number;
  ona_tili_score?: number;
  tarix_score?: number;
  last_updated?: string;
}

interface UserProfileApiResponse {
  id: number;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: string;
  role_display: string;
  profile_picture: string | null;
  balance: string;
  balance_display: string;
  date_joined: string;
  is_active: boolean;
  is_blocked: boolean;
  settings?: any;
  rating?: UserRatingData;
}

interface DashboardStatsApiResponse {
  total_tests_taken: number;
  completed_tests: number;
  average_score: number;
  total_study_hours: number;
  streak_days: number;
}

interface TestSubject {
  id: number;
  name: string;
  icon: string | null;
}

interface TestDetail {
  id: number;
  title: string;
  subject: TestSubject;
}

interface UserTestResult {
  id: number;
  user: number;
  test: TestDetail;
  score: number;
  total_questions: number;
  percentage: number;
  start_time: string;
  end_time: string | null;
  time_spent: string | null;
  time_spent_display: string | null;
  status: string;
  status_display: string;
}

interface RecommendedTestAPIResponse {
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

interface SubjectProgress { name: string; progress: number; }


function getLevelName(levelNumber?: number): string {
  if (levelNumber === undefined) return "Noma'lum";
  if (levelNumber >= 10) return "Platinum";
  if (levelNumber >= 7) return "Oltin";
  if (levelNumber >= 4) return "Kumush";
  if (levelNumber >= 1) return "Bronza";
  return "Boshlang'ich";
}

export default function DashboardPage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState<UserProfileApiResponse | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsApiResponse | null>(null);
  const [recentTestsData, setRecentTestsData] = useState<UserTestResult[]>([]);
  const [recommendedTestsData, setRecommendedTestsData] = useState<RecommendedTestAPIResponse[]>([]);
  const [subjectsProgress, setSubjectsProgress] = useState<SubjectProgress[]>([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  const [loadingRecentTests, setLoadingRecentTests] = useState(true);
  const [errorRecentTests, setErrorRecentTests] = useState<string | null>(null);

  const [loadingRecommendedTests, setLoadingRecommendedTests] = useState(true);
  const [errorRecommendedTests, setErrorRecommendedTests] = useState<string | null>(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoadingProfile(true);
    setErrorProfile(null);
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfileData(res.data);
        if (res.data.rating) {
            const ratingData = res.data.rating as UserRatingData;
            const newSubjectsProgress: SubjectProgress[] = [];
            if (ratingData.math_score !== undefined) newSubjectsProgress.push({ name: "Matematika", progress: Math.min(100, Math.max(0, ratingData.math_score / 10)) });
            if (ratingData.physics_score !== undefined) newSubjectsProgress.push({ name: "Fizika", progress: Math.min(100, Math.max(0, ratingData.physics_score / 10)) });
            if (ratingData.english_score !== undefined) newSubjectsProgress.push({ name: "Ingliz tili", progress: Math.min(100, Math.max(0, ratingData.english_score / 10)) });
            if (ratingData.ona_tili_score !== undefined) newSubjectsProgress.push({ name: "Ona tili", progress: Math.min(100, Math.max(0, ratingData.ona_tili_score / 10)) });
            if (ratingData.tarix_score !== undefined) newSubjectsProgress.push({ name: "Tarix", progress: Math.min(100, Math.max(0, ratingData.tarix_score / 10)) });
            setSubjectsProgress(newSubjectsProgress);
        }
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error("Profil ma'lumotlarini olishda xatolik:", err);
        setErrorProfile("Profil ma'lumotlarini yuklashda xatolik yuz berdi.");
        if (err.response?.status === 401 || err.response?.data?.detail === "Given token not valid for any token type") {
          localStorage.removeItem("token");
          router.push("/login");
        }
        setLoadingProfile(false);
      });
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    setLoadingStats(true);
    setErrorStats(null);
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/my-dashboard-stats/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDashboardStats(res.data);
        setLoadingStats(false);
      })
      .catch((err) => {
        console.error("Dashboard statistikasini olishda xatolik:", err);
        setErrorStats("Dashboard statistikasini yuklashda xatolik yuz berdi.");
         if (err.response?.status === 401 || err.response?.data?.detail === "Given token not valid for any token type") {
          localStorage.removeItem("token");
          router.push("/login");
        }
        setLoadingStats(false);
      });
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    setLoadingRecentTests(true);
    setErrorRecentTests(null);
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/test-history/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { page_size: 3 }
      })
      .then((res) => {
        setRecentTestsData(res.data.results || res.data);
        setLoadingRecentTests(false);
      })
      .catch((err) => {
        console.error("So'nggi testlarni olishda xatolik:", err);
        setErrorRecentTests("So'nggi testlarni yuklashda xatolik yuz berdi.");
        if (err.response?.status === 401 || err.response?.data?.detail === "Given token not valid for any token type") {
         localStorage.removeItem("token");
         router.push("/login");
       }
        setLoadingRecentTests(false);
      });
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    setLoadingRecommendedTests(true);
    setErrorRecommendedTests(null);
    axios
        .get(`https://testonline.pythonanywhere.com/api/profile/recommended-tests/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: { limit: 3 }
        })
        .then((res) => {
            setRecommendedTestsData(res.data || []);
            setLoadingRecommendedTests(false);
        })
        .catch((err) => {
            console.error("Tavsiya etilgan testlarni olishda xatolik:", err);
            setErrorRecommendedTests("Tavsiya etilgan testlarni yuklashda xatolik yuz berdi.");
             if (err.response?.status === 401 || err.response?.data?.detail === "Given token not valid for any token type") {
                localStorage.removeItem("token");
                router.push("/login");
            }
            setLoadingRecommendedTests(false);
        });
  }, [router]);


  if (loadingProfile || loadingStats || loadingRecentTests || loadingRecommendedTests) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg">Yuklanmoqda...</p>
      </div>
    );
  }

  if (errorProfile || errorStats || errorRecentTests || errorRecommendedTests) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-red-600">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-xl mb-2">Xatolik yuz berdi!</p>
        {errorProfile && <p className="text-center mb-1">{errorProfile}</p>}
        {errorStats && <p className="text-center mb-1">{errorStats}</p>}
        {errorRecentTests && <p className="text-center mb-1">{errorRecentTests}</p>}
        {errorRecommendedTests && <p className="text-center mb-4">{errorRecommendedTests}</p>}
        <Button onClick={() => router.push("/login")}>Qaytadan kirish</Button>
      </div>
    );
  }

  if (!profileData || !dashboardStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Foydalanuvchi ma'lumotlari to'liq topilmadi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Shaxsiy kabinet</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.push("/notifications")}
              >
                Bildirishnomalar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.push("/profile/settings")}
              >
                Sozlamalar
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={profileData.profile_picture || undefined} alt={profileData.full_name} />
              <AvatarFallback className="bg-blue-500 text-white text-2xl">
                {profileData.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{profileData.full_name}</h2>
              <p className="text-blue-100">{profileData.role_display}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-white/20 rounded-full px-4 py-1 text-sm">
                  A'zo bo'lgan: {new Date(profileData.date_joined).toLocaleDateString("uz-UZ")}
                </div>
                <div className="bg-yellow-500/80 rounded-full px-4 py-1 text-sm font-medium">
                  {getLevelName(profileData.rating?.level)} daraja
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-sm">Balans</div>
                <div className="text-xl font-bold">{profileData.balance_display}</div>
              </div>
              <Button className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => router.push("/profile/edit")}>
                <User size={16} className="mr-2" />
                Profilni tahrirlash
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  O'qish statistikasi
                </CardTitle>
                <CardDescription>Sizning o'qish ko'rsatkichlaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Jami testlar</div>
                      <div className="text-2xl font-bold text-blue-700">{dashboardStats.total_tests_taken}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Tugatilgan</div>
                      <div className="text-2xl font-bold text-green-700">{dashboardStats.completed_tests}</div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">O'rtacha ball</div>
                    <div className="text-2xl font-bold text-amber-700">{dashboardStats.average_score.toFixed(1)}%</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Jami soatlar</div>
                      <div className="text-2xl font-bold text-purple-700">{dashboardStats.total_study_hours}</div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-500">Streak</div>
                      <div className="text-2xl font-bold text-indigo-700">{dashboardStats.streak_days} kun</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-yellow-500" />
                  Daraja va yutuqlar
                </CardTitle>
                <CardDescription>Sizning darajangiz va yutuqlaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Joriy daraja</div>
                    <div className="text-2xl font-bold">{profileData.rating?.level || 0}-daraja ({getLevelName(profileData.rating?.level)})</div>
                    {profileData.rating?.level_progress_percentage !== undefined && (
                        <>
                            <div className="mt-2">
                                <Progress value={profileData.rating.level_progress_percentage} className="h-2" />
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {profileData.rating.current_level_points || 0}/{profileData.rating.points_to_next_level || 0} ball ({profileData.rating.level_progress_percentage.toFixed(0)}%)
                            </div>
                        </>
                    )}
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">So'nggi yutuqlar</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">5 ta test ketma-ket</div>
                          <div className="text-xs text-gray-500">2 kun oldin</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">90% dan yuqori ball</div>
                          <div className="text-xs text-gray-500">5 kun oldin</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                  Fanlar bo'yicha progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjectsProgress.length > 0 ? subjectsProgress.map((subject) => (
                    <div key={subject.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-500">{subject.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  )) : <p className="text-sm text-gray-500">Fanlar bo'yicha progress mavjud emas.</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                  Umumiy ko'rsatkichlar
                </CardTitle>
                <CardDescription>Sizning o'qish ko'rsatkichlaringiz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-500">Jami testlar</div>
                      <div className="text-2xl font-bold">{dashboardStats.total_tests_taken}</div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-sm text-gray-500">O'rtacha ball</div>
                      <div className="text-2xl font-bold">{dashboardStats.average_score.toFixed(1)}%</div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-sm text-gray-500">O'qish vaqti</div>
                      <div className="text-2xl font-bold">{dashboardStats.total_study_hours} soat</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  So'nggi faoliyat
                </CardTitle>
                <CardDescription>Sizning so'nggi test natijalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTestsData.length > 0 ? recentTestsData.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {test.test.subject.name}
                            </Badge>
                            <h3 className="font-medium">{test.test.title}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(test.start_time).toLocaleDateString("uz-UZ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {test.score}/{test.total_questions}
                          </div>
                          <div className="text-sm text-gray-500">{test.percentage.toFixed(0)}%</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={test.percentage} className="h-2" />
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/tests/results/${test.id}`)}>
                          Batafsil ko'rish
                        </Button>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-500">So'nggi faoliyat mavjud emas.</p>}

                  <div className="flex justify-center">
                    <Button variant="outline" onClick={() => router.push("/tests/all")}>
                      Barcha testlarni ko'rish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Star className="mr-2 h-5 w-5 text-amber-500" />
                  Tavsiya etilgan testlar
                </CardTitle>
                <CardDescription>Sizning o'qish ko'rsatkichlaringizga asoslangan testlar</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRecommendedTests && (
                     <div className="flex justify-center items-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <p className="ml-2 text-sm">Tavsiyalar yuklanmoqda...</p>
                    </div>
                )}
                {!loadingRecommendedTests && errorRecommendedTests && (
                     <div className="flex flex-col justify-center items-center py-6 text-red-500">
                        <AlertCircle className="h-6 w-6 mb-1" />
                        <p className="text-sm">{errorRecommendedTests}</p>
                    </div>
                )}
                {!loadingRecommendedTests && !errorRecommendedTests && recommendedTestsData.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Tavsiya etilgan testlar hozircha mavjud emas.</p>
                )}
                {!loadingRecommendedTests && !errorRecommendedTests && recommendedTestsData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recommendedTestsData.map((test) => (
                            <Card key={test.id} className="border">
                            <CardContent className="p-4">
                                <Badge variant="outline" className="mb-2">
                                {test.subject.name}
                                </Badge>
                                <h3 className="font-medium mb-1">{test.title}</h3>
                                <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">Qiyinlik: {test.difficulty_display}</div>
                                <Button size="sm" variant="ghost" onClick={() => router.push(`/tests/${test.id}`)}>
                                    Boshlash
                                </Button>
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={() => router.push("/tests/all")}>
                    Ko'proq tavsiyalar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}