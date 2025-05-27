"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Users, Activity, PieChart as PieChartIcon, ListChecks, CreditCard, BookOpen } from "lucide-react"
import axios from "axios"
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const API_BASE_URL = "https://testonline.pythonanywhere.com/api/admin";

export default function StatisticsPage() {
  const [period, setPeriod] = useState("month");
  const [dashboardStats, setDashboardStats] = useState({
    total_users: { value: 0, target: 0 },
    active_students: { value: 0, target: 0 },
    total_tests_taken: { value: 0 },
    total_revenue: { value: 0, target: 0 },
  });
  const [detailedStats, setDetailedStats] = useState({
    users: {
      users_graph: [],
      new_users: { value: 0, change_percentage: null },
      active_users: { value: 0, change_percentage: null },
      average_activity: { value: "0 min", change_percentage: null },
    },
    tests: {
      tests_graph: [],
      total_tests: { value: 0, change_percentage: null },
      tests_taken: { value: 0, change_percentage: null },
      average_score: { value: 0, change_percentage: null },
    },
    payments: {
      payments_graph: [],
      total_income: { value: 0, change_percentage: null },
      total_expenses: { value: 0, change_percentage: null },
      average_payment: { value: 0, change_percentage: null },
    },
    courses: {
      courses_graph: [],
      total_courses: { value: 0, change_percentage: null },
      enrollments: { value: 0, change_percentage: null },
      completions: { value: 0, change_percentage: null },
    },
  });

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingDetailed, setLoadingDetailed] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoadingDashboard(true);
    axios
      .get(`${API_BASE_URL}/dashboard/stats/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDashboardStats(prevStats => ({ ...prevStats, ...res.data }));
      })
      .catch((err) => {
        console.error("Dashboard statistikasini yuklashda xatolik:", err);
      })
      .finally(() => {
        setLoadingDashboard(false);
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoadingDetailed(true);
    axios
      .get(`${API_BASE_URL}/statistics/?period=${period}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setDetailedStats({
          users: {
            users_graph: data.users?.users_graph || [],
            new_users: data.users?.new_users || { value: 0, change_percentage: null },
            active_users: data.users?.active_users || { value: 0, change_percentage: null },
            average_activity: data.users?.average_activity || { value: "0 min", change_percentage: null },
          },
          tests: {
            tests_graph: data.tests?.tests_graph || [],
            total_tests: data.tests?.total_tests || { value: 0, change_percentage: null },
            tests_taken: data.tests?.tests_taken || { value: 0, change_percentage: null },
            average_score: data.tests?.average_score || { value: 0, change_percentage: null },
          },
          payments: {
            payments_graph: data.payments?.payments_graph || [],
            total_income: data.payments?.total_income || { value: 0, change_percentage: null },
            total_expenses: data.payments?.total_expenses || { value: 0, change_percentage: null },
            average_payment: data.payments?.average_payment || { value: 0, change_percentage: null },
          },
          courses: {
            courses_graph: data.courses?.courses_graph || [],
            total_courses: data.courses?.total_courses || { value: 0, change_percentage: null },
            enrollments: data.courses?.enrollments || { value: 0, change_percentage: null },
            completions: data.courses?.completions || { value: 0, change_percentage: null },
          },
        });
      })
      .catch((err) => {
        console.error("Batafsil statistika yuklashda xatolik:", err);
        setDetailedStats({
            users: { users_graph: [], new_users: { value: 0, change_percentage: null }, active_users: { value: 0, change_percentage: null }, average_activity: { value: "0 min", change_percentage: null }},
            tests: { tests_graph: [], total_tests: { value: 0, change_percentage: null }, tests_taken: { value: 0, change_percentage: null }, average_score: { value: 0, change_percentage: null }},
            payments: { payments_graph: [], total_income: { value: 0, change_percentage: null }, total_expenses: { value: 0, change_percentage: null }, average_payment: { value: 0, change_percentage: null }},
            courses: { courses_graph: [], total_courses: { value: 0, change_percentage: null }, enrollments: { value: 0, change_percentage: null }, completions: { value: 0, change_percentage: null }},
        });
      })
      .finally(() => {
        setLoadingDetailed(false);
      });
  }, [period, token]);

  const formatChangePercentage = (percentage) => {
    if (percentage === null || percentage === undefined) {
      return <span className="text-xs text-gray-500">-</span>;
    }
    const value = parseFloat(percentage);
    const sign = value > 0 ? "+" : "";
    const color = value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-500";
    return <span className={`text-xs ${color}`}>{sign}{value.toFixed(1)}%</span>;
  };

  // **XATOLIK SHU YERDA EDI, TO'G'IRLANDI:**
  const isLoading = loadingDashboard || loadingDetailed;

  const getBaseChartOptions = (categories) => ({
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'inherit',
    },
    xaxis: {
      categories: categories,
      labels: { style: { colors: '#6b7280' } }
    },
    yaxis: { labels: { style: { colors: '#6b7280' } } },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 4 },
    tooltip: { theme: 'light', x: { format: 'dd MMM yy' } },
    noData: { text: "Ma'lumotlar yo'q", align: 'center', verticalAlign: 'middle', style: { color: '#6b7280', fontSize: '14px' } }
  });

  const usersChartOptions = getBaseChartOptions(detailedStats.users?.users_graph?.map(item => item.date) || []);
  const usersChartSeries = [{ name: "Foydalanuvchilar", data: detailedStats.users?.users_graph?.map(item => item.value) || [] }];

  const testsChartOptions = getBaseChartOptions(detailedStats.tests?.tests_graph?.map(item => item.date) || []);
  const testsChartSeries = [{ name: "Yechilgan Testlar", data: detailedStats.tests?.tests_graph?.map(item => item.value) || [] }];

  const paymentsChartOptions = getBaseChartOptions(detailedStats.payments?.payments_graph?.map(item => item.date) || []);
  const paymentsChartSeries = [{ name: "To'lovlar Soni", data: detailedStats.payments?.payments_graph?.map(item => item.value) || [] }];

  const coursesChartOptions = getBaseChartOptions(detailedStats.courses?.courses_graph?.map(item => item.date) || []);
  const coursesChartSeries = [{ name: "Kursga Yozilishlar", data: detailedStats.courses?.courses_graph?.map(item => item.value) || [] }];


  const renderChart = (options, series, graphData) => {
    if (isLoading) {
        return (
            <div className="h-80 rounded-lg bg-muted/20 p-2 flex items-center justify-center">
                <div role="status" className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">.</span>
                </div>
            </div>
        );
    }
    return ( (graphData?.length ?? 0) > 0 ? (
      <Chart options={options} series={series} type="line" height="100%" />
    ) : (
      <div className="flex items-center justify-center h-full text-muted-foreground">Grafik uchun ma'lumotlar yo'q</div>
    ));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1 sm:mb-2">Statistika</h2>
            <p className="text-gray-600">Platforma statistikasi va analitikasi</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={period} onValueChange={setPeriod} disabled={isLoading}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Davr" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Hafta</SelectItem>
                <SelectItem value="month">Oy</SelectItem>
                <SelectItem value="quarter">Chorak</SelectItem>
                <SelectItem value="year">Yil</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto" disabled={isLoading}>Hisobotni yuklab olish</Button>
          </div>
        </div>

        {loadingDashboard ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1,2,3].map(i => (
                <Card key={i}><CardContent className="p-6 h-36 animate-pulse bg-gray-200 rounded-lg"></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Jami foydalanuvchilar</p>
                    <h3 className="text-3xl font-bold">{dashboardStats.total_users?.value ?? 0}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Maqsad: {dashboardStats.total_users?.target ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Faol abituriyentlar</p>
                    <h3 className="text-3xl font-bold">{dashboardStats.active_students?.value ?? 0}</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Maqsad: {dashboardStats.active_students?.target ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Jami daromad</p>
                    <h3 className="text-3xl font-bold">{(dashboardStats.total_revenue?.value ?? 0).toLocaleString()} so'm</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <PieChartIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Maqsad: {(dashboardStats.total_revenue?.target ?? 0).toLocaleString()} so'm</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger value="users" disabled={loadingDetailed}>Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="tests" disabled={loadingDetailed}>Testlar</TabsTrigger>
            <TabsTrigger value="payments" disabled={loadingDetailed}>To'lovlar</TabsTrigger>
            <TabsTrigger value="courses" disabled={loadingDetailed}>Kurslar</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Foydalanuvchilar statistikasi ({period} davri)</CardTitle>
                <CardDescription>Platformadagi foydalanuvchilar soni dinamikasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-lg bg-muted/20 p-2">
                  {renderChart(usersChartOptions, usersChartSeries, detailedStats.users?.users_graph)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Yangi foydalanuvchilar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.users?.new_users?.value ?? 0)}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.users?.new_users?.change_percentage)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Faol foydalanuvchilar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.users?.active_users?.value ?? 0)}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.users?.active_users?.change_percentage)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">O'rtacha faollik</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.users?.average_activity?.value ?? "N/A")}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.users?.average_activity?.change_percentage)}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>Testlar statistikasi ({period} davri)</CardTitle>
                <CardDescription>Yechilgan testlar soni dinamikasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-lg bg-muted/20 p-2">
                  {renderChart(testsChartOptions, testsChartSeries, detailedStats.tests?.tests_graph)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Jami testlar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.tests?.total_tests?.value ?? 0)}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.tests?.total_tests?.change_percentage)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Yechilgan testlar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.tests?.tests_taken?.value ?? 0)}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.tests?.tests_taken?.change_percentage)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">O'rtacha ball</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : `${(detailedStats.tests?.average_score?.value ?? 0).toFixed(1)}%`}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.tests?.average_score?.change_percentage)}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
             <Card>
              <CardHeader>
                <CardTitle>To'lovlar statistikasi ({period} davri)</CardTitle>
                <CardDescription>To'lovlar soni dinamikasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-lg bg-muted/20 p-2">
                  {renderChart(paymentsChartOptions, paymentsChartSeries, detailedStats.payments?.payments_graph)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Jami daromad</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : `${(detailedStats.payments?.total_income?.value ?? 0).toLocaleString()} so'm`}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.payments?.total_income?.change_percentage)}
                    </CardContent>
                  </Card>
                   <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Jami xarajatlar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : `${(detailedStats.payments?.total_expenses?.value ?? 0).toLocaleString()} so'm`}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.payments?.total_expenses?.change_percentage)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">O'rtacha to'lov</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : `${(detailedStats.payments?.average_payment?.value ?? 0).toLocaleString()} so'm`}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.payments?.average_payment?.change_percentage)}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Kurslar statistikasi ({period} davri)</CardTitle>
                <CardDescription>Kurslarga yozilishlar dinamikasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-lg bg-muted/20 p-2">
                  {renderChart(coursesChartOptions, coursesChartSeries, detailedStats.courses?.courses_graph)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Jami kurslar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.courses?.total_courses?.value ?? 0)}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.courses?.total_courses?.change_percentage)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Yozilishlar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.courses?.enrollments?.value ?? 0)}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.courses?.enrollments?.change_percentage)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">Tugatganlar</div>
                      <div className="text-2xl font-bold">{loadingDetailed ? '...' : (detailedStats.courses?.completions?.value ?? 0)}</div>
                      {loadingDetailed ? <div className="h-4 w-24 bg-gray-200 rounded mt-1 animate-pulse"></div> : formatChangePercentage(detailedStats.courses?.completions?.change_percentage)}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}