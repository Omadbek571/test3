"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Award, BookOpen, CheckCircle, Clock, Star, Trophy } from "lucide-react"

export default function AchievementsPage() {
  const router = useRouter()

  // Mock achievements data
  const achievementsData = {
    stats: {
      totalAchievements: 28,
      completedAchievements: 15,
      progress: 54,
      level: 8,
      levelProgress: 75,
      nextLevelPoints: 250,
      currentPoints: 187,
      totalPoints: 1520,
    },
    categories: {
      general: [
        {
          id: 1,
          title: "Birinchi qadam",
          description: "Platformaga ro'yxatdan o'ting",
          points: 10,
          completed: true,
          completedDate: "2023-05-15",
          icon: "🏆",
        },
        {
          id: 2,
          title: "Profil to'ldirish",
          description: "Profilingizni to'liq to'ldiring",
          points: 20,
          completed: true,
          completedDate: "2023-05-16",
          icon: "👤",
        },
        {
          id: 3,
          title: "Birinchi test",
          description: "Birinchi testni topshiring",
          points: 30,
          completed: true,
          completedDate: "2023-05-18",
          icon: "📝",
        },
        {
          id: 4,
          title: "Faol foydalanuvchi",
          description: "Platformada 10 soat o'tkazing",
          points: 50,
          completed: true,
          completedDate: "2023-05-25",
          icon: "⏱️",
        },
        {
          id: 5,
          title: "Ijtimoiy tarmoqlar",
          description: "Platformani ijtimoiy tarmoqlarda ulashing",
          points: 25,
          completed: false,
          icon: "🔗",
        },
      ],
      tests: [
        {
          id: 6,
          title: "Test ustasi",
          description: "10 ta testni topshiring",
          points: 50,
          completed: true,
          completedDate: "2023-06-01",
          icon: "🧠",
        },
        {
          id: 7,
          title: "A'lo natija",
          description: "Bitta testda 90% dan yuqori ball to'plang",
          points: 75,
          completed: true,
          completedDate: "2023-06-05",
          icon: "🎯",
        },
        {
          id: 8,
          title: "Matematika ustasi",
          description: "Matematika bo'yicha 5 ta testni topshiring",
          points: 60,
          completed: true,
          completedDate: "2023-06-08",
          icon: "🔢",
        },
        {
          id: 9,
          title: "Fizika ustasi",
          description: "Fizika bo'yicha 5 ta testni topshiring",
          points: 60,
          completed: false,
          progress: 60,
          icon: "⚛️",
        },
        {
          id: 10,
          title: "Ingliz tili ustasi",
          description: "Ingliz tili bo'yicha 5 ta testni topshiring",
          points: 60,
          completed: false,
          progress: 40,
          icon: "🔤",
        },
      ],
      streak: [
        {
          id: 11,
          title: "3 kunlik streak",
          description: "3 kun ketma-ket platformadan foydalaning",
          points: 30,
          completed: true,
          completedDate: "2023-05-20",
          icon: "🔥",
        },
        {
          id: 12,
          title: "7 kunlik streak",
          description: "7 kun ketma-ket platformadan foydalaning",
          points: 70,
          completed: true,
          completedDate: "2023-05-24",
          icon: "🔥",
        },
        {
          id: 13,
          title: "14 kunlik streak",
          description: "14 kun ketma-ket platformadan foydalaning",
          points: 140,
          completed: false,
          progress: 50,
          icon: "🔥",
        },
        {
          id: 14,
          title: "30 kunlik streak",
          description: "30 kun ketma-ket platformadan foydalaning",
          points: 300,
          completed: false,
          progress: 23,
          icon: "🔥",
        },
      ],
      mockTests: [
        {
          id: 15,
          title: "Mock test qahramon",
          description: "Birinchi mock testni topshiring",
          points: 50,
          completed: true,
          completedDate: "2023-06-10",
          icon: "📚",
        },
        {
          id: 16,
          title: "Ingliz tili bilimdon",
          description: "Ingliz tili mock testida 6.5+ ball to'plang",
          points: 100,
          completed: true,
          completedDate: "2023-06-10",
          icon: "🇬🇧",
        },
        {
          id: 17,
          title: "Turk tili bilimdon",
          description: "Turk tili mock testida 6.0+ ball to'plang",
          points: 100,
          completed: false,
          icon: "🇹🇷",
        },
        {
          id: 18,
          title: "Arab tili bilimdon",
          description: "Arab tili mock testida 6.0+ ball to'plang",
          points: 100,
          completed: false,
          icon: "🇸🇦",
        },
      ],
    },
    badges: [
      {
        id: 1,
        name: "Bronza",
        description: "500 ball to'plang",
        icon: "🥉",
        completed: true,
        completedDate: "2023-05-30",
      },
      {
        id: 2,
        name: "Kumush",
        description: "1000 ball to'plang",
        icon: "🥈",
        completed: true,
        completedDate: "2023-06-10",
      },
      {
        id: 3,
        name: "Oltin",
        description: "2000 ball to'plang",
        icon: "🥇",
        completed: false,
        progress: 76,
      },
      {
        id: 4,
        name: "Platina",
        description: "5000 ball to'plang",
        icon: "💎",
        completed: false,
        progress: 30,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Yutuqlar</h1>
        </div>

        {/* Achievement Stats */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-2xl border-4 border-blue-300">
                  {achievementsData.stats.level}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Daraja</h2>
                  <p className="text-gray-600">Umumiy ball: {achievementsData.stats.totalPoints}</p>
                  <div className="mt-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">Keyingi daraja</span>
                      <span className="text-xs text-gray-500">
                        {achievementsData.stats.currentPoints}/{achievementsData.stats.nextLevelPoints}
                      </span>
                    </div>
                    <Progress value={achievementsData.stats.levelProgress} className="h-1.5" />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-gray-600 mb-1">Yutuqlar</div>
                <div className="text-lg font-bold text-blue-700">
                  {achievementsData.stats.completedAchievements}/{achievementsData.stats.totalAchievements}
                </div>
                <Progress value={achievementsData.stats.progress} className="h-1.5 w-40 mt-1" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievementsData.badges.map((badge) => (
                <div key={badge.id} className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <div className="font-medium">{badge.name}</div>
                  <div className="text-xs text-gray-500">{badge.description}</div>
                  {badge.completed ? (
                    <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                      Qo'lga kiritilgan
                    </Badge>
                  ) : (
                    <div className="mt-2">
                      <Progress value={badge.progress} className="h-1.5" />
                      <div className="text-xs text-gray-500 mt-1">{badge.progress}%</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">Barchasi</TabsTrigger>
            <TabsTrigger value="general">Umumiy</TabsTrigger>
            <TabsTrigger value="tests">Testlar</TabsTrigger>
            <TabsTrigger value="streak">Streak</TabsTrigger>
            <TabsTrigger value="mockTests">Mock testlar</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-blue-500" />
                  Barcha yutuqlar
                </CardTitle>
                <CardDescription>Platformadagi barcha yutuqlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(achievementsData.categories).map(([category, achievements]) => (
                    <div key={category}>
                      <h3 className="font-medium mb-3 capitalize">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map((achievement) => (
                          <Card key={achievement.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="text-3xl mr-3">{achievement.icon}</div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium">{achievement.title}</h4>
                                    <div className="text-sm font-medium text-blue-600">{achievement.points} ball</div>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

                                  {achievement.completed ? (
                                    <div className="flex justify-between items-center mt-2">
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" /> Qo'lga kiritilgan
                                      </Badge>
                                      <div className="text-xs text-gray-500">
                                        {new Date(achievement.completedDate).toLocaleDateString("uz-UZ")}
                                      </div>
                                    </div>
                                  ) : achievement.progress ? (
                                    <div className="mt-2">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-xs text-gray-500">Progress</span>
                                        <span className="text-xs text-gray-500">{achievement.progress}%</span>
                                      </div>
                                      <Progress value={achievement.progress} className="h-1.5" />
                                    </div>
                                  ) : (
                                    <Badge variant="outline" className="mt-2 bg-gray-50 text-gray-700 border-gray-200">
                                      Qo'lga kiritilmagan
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-blue-500" />
                  Umumiy yutuqlar
                </CardTitle>
                <CardDescription>Platformadagi umumiy yutuqlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievementsData.categories.general.map((achievement) => (
                    <Card key={achievement.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="text-3xl mr-3">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{achievement.title}</h4>
                              <div className="text-sm font-medium text-blue-600">{achievement.points} ball</div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

                            {achievement.completed ? (
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Qo'lga kiritilgan
                                </Badge>
                                <div className="text-xs text-gray-500">
                                  {new Date(achievement.completedDate).toLocaleDateString("uz-UZ")}
                                </div>
                              </div>
                            ) : (
                              <Badge variant="outline" className="mt-2 bg-gray-50 text-gray-700 border-gray-200">
                                Qo'lga kiritilmagan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  Test yutuqlari
                </CardTitle>
                <CardDescription>Testlar bo'yicha yutuqlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievementsData.categories.tests.map((achievement) => (
                    <Card key={achievement.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="text-3xl mr-3">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{achievement.title}</h4>
                              <div className="text-sm font-medium text-blue-600">{achievement.points} ball</div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

                            {achievement.completed ? (
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Qo'lga kiritilgan
                                </Badge>
                                <div className="text-xs text-gray-500">
                                  {new Date(achievement.completedDate).toLocaleDateString("uz-UZ")}
                                </div>
                              </div>
                            ) : achievement.progress ? (
                              <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-gray-500">Progress</span>
                                  <span className="text-xs text-gray-500">{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} className="h-1.5" />
                              </div>
                            ) : (
                              <Badge variant="outline" className="mt-2 bg-gray-50 text-gray-700 border-gray-200">
                                Qo'lga kiritilmagan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streak">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Streak yutuqlari
                </CardTitle>
                <CardDescription>Muntazamlik bo'yicha yutuqlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievementsData.categories.streak.map((achievement) => (
                    <Card key={achievement.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="text-3xl mr-3">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{achievement.title}</h4>
                              <div className="text-sm font-medium text-blue-600">{achievement.points} ball</div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

                            {achievement.completed ? (
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Qo'lga kiritilgan
                                </Badge>
                                <div className="text-xs text-gray-500">
                                  {new Date(achievement.completedDate).toLocaleDateString("uz-UZ")}
                                </div>
                              </div>
                            ) : achievement.progress ? (
                              <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-gray-500">Progress</span>
                                  <span className="text-xs text-gray-500">{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} className="h-1.5" />
                              </div>
                            ) : (
                              <Badge variant="outline" className="mt-2 bg-gray-50 text-gray-700 border-gray-200">
                                Qo'lga kiritilmagan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mockTests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-blue-500" />
                  Mock test yutuqlari
                </CardTitle>
                <CardDescription>Mock testlar bo'yicha yutuqlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievementsData.categories.mockTests.map((achievement) => (
                    <Card key={achievement.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="text-3xl mr-3">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{achievement.title}</h4>
                              <div className="text-sm font-medium text-blue-600">{achievement.points} ball</div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

                            {achievement.completed ? (
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Qo'lga kiritilgan
                                </Badge>
                                <div className="text-xs text-gray-500">
                                  {new Date(achievement.completedDate).toLocaleDateString("uz-UZ")}
                                </div>
                              </div>
                            ) : (
                              <Badge variant="outline" className="mt-2 bg-gray-50 text-gray-700 border-gray-200">
                                Qo'lga kiritilmagan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

