"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Download, FileText, Users, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useEffect, useState } from "react"
import axios from "axios"

// ApexCharts importi
// Dinamik importdan foydalanamiz, chunki ApexCharts client-side kutubxona
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function AdminDashboard() {
  const router = useRouter();
  const [userCard, setUserCard] = useState<any[]>([]);
  const [testCard, setTestCard] = useState<any[]>([]);
  const [statistic, setStatistic] = useState<any>({});
  const [payments, setPayments] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false) // ApexCharts faqat clientda ishlashi uchun

  useEffect(() => {
    setIsClient(true) // Komponent mount bo'lgandan keyin clientda ekanligimizni bildiramiz
  }, [])


  // Statisticalardi olish uchun
  useEffect(() => {
    if (!token) return;

    axios
      .get("https://testonline.pythonanywhere.com/api/admin/dashboard/stats/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStatistic(res.data)
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.detail === 'Given token not valid for any token type') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/");
        }
        console.log("Statistic error:", err);
      });
  }, [token, router])


  const usersStatistic = {
    totalUsers: {
      value: statistic?.total_users?.value,
      change_percentage: statistic?.total_users?.change_percentage,
      target: statistic?.total_users?.target
    },
    activeStudents: {
      value: statistic?.active_students?.value,
      change_percentage: statistic?.active_students?.change_percentage,
      target: statistic?.active_students?.target
    },
    totalTests: {
      value: statistic?.total_tests_taken?.value,
      change_percentage: statistic?.total_tests_taken?.change_percentage,
      target: statistic?.total_tests_taken?.target
    },
    totalRevenue: {
      value: statistic?.total_revenue?.value,
      change_percentage: statistic?.total_revenue?.change_percentage,
      target: statistic?.total_revenue?.target
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        // Token yo'q bo'lsa, login sahifasiga yo'naltirish shart,
        // aks holda API so'rovlari xatolik beradi.
        router.push("/");
      }
    }
  }, [router]);

  // Foydalanuvchilar ma'lumotlarini olish
  useEffect(() => {
    if (!token) return;

    axios
      .get("https://testonline.pythonanywhere.com/api/admin/dashboard/latest/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUserCard(res.data.latest_users || []);
        }
      })
      .catch((err) => {
        console.log("Latest users error:", err);
      });
  }, [token]);

  // Testlar ma'lumotlarini olish
  useEffect(() => {
    if (!token) return;

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/tests/?limit=5&ordering=-created_at`, { // Oxirgi 5ta testni olish
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setTestCard(res.data.results || [])
        }
      })
      .catch((err) => {
        console.log("Tests error:", err);
      });
  }, [token]);

  // Tolovlardi malumotini olish
  useEffect(() => {
    if (!token) return;

    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/payments/?limit=5&ordering=-created_at`, { // Oxirgi 5ta to'lovni olish
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPayments(res.data.results || []);
      })
      .catch((err) => {
        console.log("Payments error:", err);
      });
  }, [token])

  // ApexCharts uchun demo ma'lumotlar
  const apexChartSeries = [
    {
      name: 'Yangi foydalanuvchilar',
      data: [31, 40, 28, 51, 42, 109, 100].map(v => Math.floor(Math.random() * 120)), // Tasodifiy
    },
    {
      name: 'Faol abituriyentlar',
      data: [11, 32, 45, 32, 34, 52, 41].map(v => Math.floor(Math.random() * 100)), // Tasodifiy
    },
  ];

  const apexChartOptions: ApexCharts.ApexOptions = { // Tipni aniq ko'rsatish
    chart: {
      height: 380, // Balandlikni biroz oshirdim
      type: 'area', // 'line' o'rniga 'area' chiroyliroq ko'rinishi mumkin
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
        }
      },
      fontFamily: 'inherit', // Saytning umumiy shriftini olish
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: { // 'area' chart uchun fill sozlamalari
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
    },
    title: {
      text: "Foydalanuvchilar Dinamikasi (Oylik Demo)",
      align: 'left',
      style: {
        fontSize: '18px', // Sarlavha o'lchami
        fontWeight: 'bold',
        color: '#333'
      }
    },
    // subtitle: { // Qo'shimcha sarlavha
    //   text: 'Oxirgi 7 oy uchun',
    //   align: 'left',
    //   style: {
    //     fontSize: '13px',
    //     color: '#666'
    //   }
    // },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl'], // Qisqartirilgan oylar
      title: {
        text: 'Oylar',
        style: {
            fontSize: '12px',
            color: '#777'
        }
      },
      labels: {
        style: {
            colors: '#777'
        }
      }
    },
    yaxis: {
      title: {
        text: "Soni (kishi)",
        style: {
            fontSize: '12px',
            color: '#777'
        }
      },
      labels: {
        style: {
            colors: '#777'
        },
        formatter: (value) => { return value.toFixed(0); } // Butun son qilib ko'rsatish
      },
      min: 0
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    //   floating: true,
    //   offsetY: -5, // Yuqoriga surish
    //   offsetX: -5
        fontSize: '13px',
        markers: {
            width: 10,
            height: 10,
        }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0) + " ta";
        },
      },
      theme: 'light', // 'dark' yoki 'light'
    },
    colors: ['#008FFB', '#00E396'], // Chiziq ranglari (ko'k va yashil)
    markers: { // Nuqtalar uchun markerlar
        size: 5,
        hover: {
          size: 7
        }
    },
  };


  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Xush kelibsiz, SuperAdmin!</h2>
          <p className="text-gray-600">Bilimdon Abituriyent platformasi boshqaruv paneli</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Jami foydalanuvchilar</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.totalUsers.value || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              {usersStatistic.totalUsers.change_percentage !== undefined && (
                <div className={`mt-4 text-sm flex items-center ${usersStatistic.totalUsers.change_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{usersStatistic.totalUsers.change_percentage >= 0 ? '+' : ''}{usersStatistic.totalUsers.change_percentage || 0}%</span>
                  {/* <ChevronRight className="h-4 w-4 ml-1" /> */}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Faol abituriyentlar</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.activeStudents.value || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              {usersStatistic.activeStudents.change_percentage !== undefined && (
                <div className={`mt-4 text-sm flex items-center ${usersStatistic.activeStudents.change_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{usersStatistic.activeStudents.change_percentage >= 0 ? '+' : ''}{usersStatistic.activeStudents.change_percentage || 0}%</span>
                  {/* <ChevronRight className="h-4 w-4 ml-1" /> */}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Topshirilgan testlar</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.totalTests.value || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              {usersStatistic.totalTests.change_percentage !== undefined && (
                 <div className={`mt-4 text-sm flex items-center ${usersStatistic.totalTests.change_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{usersStatistic.totalTests.change_percentage >= 0 ? '+' : ''}{usersStatistic.totalTests.change_percentage || 0}%</span>
                  {/* <ChevronRight className="h-4 w-4 ml-1" /> */}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Jami daromad</p>
                  <h3 className="text-3xl font-bold">{usersStatistic.totalRevenue.value ? `${parseFloat(usersStatistic.totalRevenue.value).toLocaleString('uz-UZ')} so'm` : "0 so'm"}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              {usersStatistic.totalRevenue.change_percentage !== undefined && (
                <div className={`mt-4 text-sm flex items-center ${usersStatistic.totalRevenue.change_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{usersStatistic.totalRevenue.change_percentage >= 0 ? '+' : ''}{usersStatistic.totalRevenue.change_percentage || 0}%</span>
                  {/* <ChevronRight className="h-4 w-4 ml-1" /> */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ////////////// MANA SHU YERDA O'ZGARTIRILDI ////////////// */}
        <Tabs defaultValue="users" className="mb-6">
        {/* ///////////////////////////////////////////////////////// */}
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="tests">Testlar</TabsTrigger>
            <TabsTrigger value="payments">To'lovlar</TabsTrigger>
            <TabsTrigger value="stats">Statistika</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                {/* <CardTitle>Platforma Statistikasi</CardTitle> */}
                {/* CardTitle ni chart o'zi ko'rsatgani uchun olib tashladim, yoki chart optionlaridan title ni olib tashlash mumkin */}
                <CardDescription>
                  Tanlangan davr uchun asosiy ko'rsatkichlar dinamikasi (Demo).
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {isClient && ( // Faqat client-side da render qilish
                    <Chart
                    options={apexChartOptions}
                    series={apexChartSeries}
                    type="area" // Yoki 'line', 'bar' va hokazo
                    height={380}
                    width="100%"
                    />
                )}
                {!isClient && <div className="h-[380px] flex items-center justify-center text-gray-500">Grafik yuklanmoqda...</div>}

                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => router.push("/admin/statistics")}>
                    Batafsil statistika sahifasiga o'tish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi ro'yxatdan o'tgan foydalanuvchilar</CardTitle>
                <CardDescription>Platformada ro'yxatdan o'tgan eng so'nggi {userCard.length} ta foydalanuvchi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Ism</th>
                          <th className="text-left p-3 font-medium">Telefon</th>
                          <th className="text-left p-3 font-medium">Ro'yxatdan o'tgan sana</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-right p-3 font-medium">Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userCard?.length > 0 ? (
                          userCard.map((value, index) => (
                            <tr key={value?.id || index} className="border-t hover:bg-muted/30">
                              <td className="p-3">#{value?.id}</td>
                              <td className="p-3">{value?.full_name || "-"}</td>
                              <td className="p-3">{value?.phone_number || "-"}</td>
                              <td className="p-3">
                                {value?.date_joined
                                  ? new Date(value.date_joined).toLocaleDateString("uz-UZ", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  })
                                  : "-"}
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={`border px-2 py-1 text-xs font-semibold rounded-full
                                    ${value?.status_display === "Faol"
                                      ? "bg-green-100 text-green-700 border-green-300"
                                      : value?.status_display === "Nofaol"
                                        ? "bg-red-100 text-red-700 border-red-300"
                                        : "bg-yellow-100 text-yellow-700 border-yellow-300"}`}
                                >
                                  {value?.status_display || "Noma'lum"}
                                </Badge>
                              </td>
                              <td className="p-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/users/${value?.id}`)}
                                >
                                  Ko'rish
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-6 text-gray-500">
                                    Foydalanuvchilar topilmadi.
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {userCard.length > 0 && (
                    <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={() => router.push("/admin/users")}>
                        Barcha foydalanuvchilar
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi qo'shilgan testlar</CardTitle>
                <CardDescription>Platformaga qo'shilgan eng so'nggi {testCard.length} ta test</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Test nomi</th>
                          <th className="text-left p-3 font-medium">Fan</th>
                          <th className="text-left p-3 font-medium">Qo'shilgan sana</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-right p-3 font-medium">Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testCard.length > 0 ? (
                            testCard.map(function (value, index) {
                            const date = value.created_at ? new Date(value.created_at) : null;
                            const formattedDate = date ? `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}` : "-";

                            return (
                              <tr key={value.id || index} className="border-t hover:bg-muted/30">
                                <td className="p-3">#{value.id}</td>
                                <td className="p-3 truncate max-w-xs" title={value.title}>{value.title || "-"}</td>
                                <td className="p-3">{value.subject_name || "-"}</td>
                                <td className="p-3">{formattedDate}</td>
                                <td className="p-3">
                                  <Badge variant={value.status === 'active' ? 'default' : 'secondary'}
                                     className={`${value.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' :
                                                value.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                                value.status === 'inactive' ? 'bg-red-100 text-red-700 border-red-300' :
                                                'bg-gray-100 text-gray-700 border-gray-300'} px-2 py-1 text-xs rounded-full`}>
                                    {value.status === 'active' ? 'Faol' : value.status === 'draft' ? "Qoralama" : value.status === 'inactive' ? "Nofaol" : (value.status || "Noma'lum")}
                                  </Badge>
                                </td>
                                <td className="p-3 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/tests/${value.id}`)}
                                  >
                                    Ko'rish
                                  </Button>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-6 text-gray-500">
                                    Testlar topilmadi.
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {testCard.length > 0 && (
                    <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={() => router.push("/admin/tests")}>
                        Barcha testlar
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi to'lovlar</CardTitle>
                <CardDescription>Platformada amalga oshirilgan eng so'nggi {payments.length} ta to'lov</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Foydalanuvchi</th>
                          <th className="text-left p-3 font-medium">Summa</th>
                          <th className="text-left p-3 font-medium">Sana</th>
                          <th className="text-left p-3 font-medium">To'lov tizimi</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-right p-3 font-medium">Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length > 0 ? (
                            payments.map(function (value, index) {
                             const paymentDate = value.created_at ? new Date(value.created_at).toLocaleString('uz-UZ', { dateStyle: 'medium', timeStyle: 'short'}) : '-';
                            return (
                              <tr key={value.id || index} className="border-t hover:bg-muted/30">
                                <td className="p-3">#{value.id}</td>
                                <td className="p-3">{value.user_email || value.user_phone || "Noma'lum"}</td>
                                <td className="p-3 font-semibold">{value.amount_display || "-"}</td>
                                <td className="p-3">{paymentDate}</td>
                                <td className="p-3">{value.payment_gateway_display || "N/A"}</td>
                                <td className="p-3">
                                  <Badge variant={value.status === 'completed' ? 'default' : 'secondary'}
                                    className={`${value.status_display === 'Muvaffaqiyatli' ? 'bg-green-100 text-green-700 border-green-300' :
                                                value.status_display === "Kutilmoqda" ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                                value.status_display === "Bekor qilingan" ? 'bg-red-100 text-red-700 border-red-300' :
                                                'bg-gray-100 text-gray-700 border-gray-300'} px-2 py-1 text-xs rounded-full`}>
                                    {value.status_display || "Noma'lum"}
                                  </Badge>
                                </td>
                                <td className="p-3 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/payments/${value.id}`)}
                                  >
                                    Ko'rish
                                  </Button>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center p-6 text-gray-500">
                                    To'lovlar topilmadi.
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {payments.length > 0 && (
                    <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={() => router.push("/admin/payments")}>
                        Barcha to'lovlar
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}