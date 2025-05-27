"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Medal, Search, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RatingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  // Mock user data - current user is at position 42
  const currentUserId = 1042

  // Mock rating data
  const generateUsers = (count: number) => {
    return Array.from({ length: count }).map((_, index) => {
      const position = index + 1
      const id = 1000 + position
      const isCurrentUser = id === currentUserId

      // Generate random scores that decrease as position increases
      const totalScore = Math.round(1000 - position * 0.8 + (Math.random() * 20 - 10))
      const mathScore = Math.round(100 - position * 0.07 + (Math.random() * 10 - 5))
      const physicsScore = Math.round(100 - position * 0.08 + (Math.random() * 10 - 5))
      const englishScore = Math.round(100 - position * 0.06 + (Math.random() * 10 - 5))

      return {
        id,
        position,
        name: isCurrentUser ? "Alisher Karimov" : `Foydalanuvchi ${position}`,
        avatar: isCurrentUser ? "/placeholder.svg?height=100&width=100" : null,
        region: ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan"][Math.floor(Math.random() * 5)],
        school: `${Math.floor(Math.random() * 100) + 1}-son maktab`,
        totalScore,
        mathScore,
        physicsScore,
        englishScore,
        testsCompleted: Math.round(100 - position * 0.5 + Math.random() * 20),
        lastActive: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrentUser,
      }
    })
  }

  const allUsers = generateUsers(100)

  // Filter users based on search and filters
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.school.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject =
      subjectFilter === "all"
        ? true
        : (subjectFilter === "math" && user.mathScore > 80) ||
          (subjectFilter === "physics" && user.physicsScore > 80) ||
          (subjectFilter === "english" && user.englishScore > 80)

    const matchesRegion = regionFilter === "all" ? true : user.region.toLowerCase() === regionFilter.toLowerCase()

    return matchesSearch && matchesSubject && matchesRegion
  })

  // Find current user position
  const currentUser = allUsers.find((user) => user.isCurrentUser)
  const currentUserPosition = currentUser?.position || 0

  // Get top 3 users for the podium
  const topUsers = allUsers.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Umumiy reyting</h1>
        </div>

        {/* Current user position highlight */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-xl border-2 border-blue-300">
                  #{currentUserPosition}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Mening reytingim</h2>
                  <p className="text-gray-600">Siz umumiy reytingda {currentUserPosition}-o'rinda turibsiz</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold text-blue-700">{currentUser?.totalScore}</div>
                <div className="text-sm text-gray-600">Umumiy ball</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-sm text-gray-500">Matematika</div>
                <div className="text-lg font-bold text-blue-700">{currentUser?.mathScore}%</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-sm text-gray-500">Fizika</div>
                <div className="text-lg font-bold text-purple-700">{currentUser?.physicsScore}%</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-sm text-gray-500">Ingliz tili</div>
                <div className="text-lg font-bold text-green-700">{currentUser?.englishScore}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Podium for top 3 */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Eng yaxshi natijalar
            </CardTitle>
            <CardDescription className="text-white/80">Eng yuqori ball to'plagan abituriyentlar</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-end justify-center py-8 px-4 bg-gradient-to-b from-amber-50 to-white">
              {/* 2nd place */}
              <div className="order-2 md:order-1 flex flex-col items-center mb-4 md:mb-0">
                <Avatar className="w-16 h-16 border-2 border-silver mb-2">
                  <AvatarFallback className="bg-silver-500 text-white">{topUsers[1]?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-24 h-24 bg-silver-100 flex flex-col items-center justify-center rounded-t-lg border-2 border-b-0 border-silver-300">
                  <div className="text-xl font-bold">2</div>
                  <div className="text-xs text-center line-clamp-1">{topUsers[1]?.name}</div>
                  <div className="text-sm font-bold text-silver-700">{topUsers[1]?.totalScore}</div>
                </div>
              </div>

              {/* 1st place */}
              <div className="order-1 md:order-2 flex flex-col items-center mb-4 md:mb-0 md:mx-4">
                <div className="relative">
                  <Trophy className="absolute -top-10 left-1/2 transform -translate-x-1/2 h-8 w-8 text-yellow-500" />
                  <Avatar className="w-20 h-20 border-2 border-yellow-500 mb-2">
                    <AvatarFallback className="bg-yellow-500 text-white">{topUsers[0]?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="w-28 h-32 bg-yellow-100 flex flex-col items-center justify-center rounded-t-lg border-2 border-b-0 border-yellow-300">
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-xs text-center line-clamp-1">{topUsers[0]?.name}</div>
                  <div className="text-sm font-bold text-yellow-700">{topUsers[0]?.totalScore}</div>
                </div>
              </div>

              {/* 3rd place */}
              <div className="order-3 flex flex-col items-center mb-4 md:mb-0">
                <Avatar className="w-16 h-16 border-2 border-bronze mb-2">
                  <AvatarFallback className="bg-bronze-500 text-white">{topUsers[2]?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-24 h-20 bg-bronze-100 flex flex-col items-center justify-center rounded-t-lg border-2 border-b-0 border-bronze-300">
                  <div className="text-xl font-bold">3</div>
                  <div className="text-xs text-center line-clamp-1">{topUsers[2]?.name}</div>
                  <div className="text-sm font-bold text-bronze-700">{topUsers[2]?.totalScore}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Qidirish..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Fan bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha fanlar</SelectItem>
                  <SelectItem value="math">Matematika</SelectItem>
                  <SelectItem value="physics">Fizika</SelectItem>
                  <SelectItem value="english">Ingliz tili</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Hudud bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha hududlar</SelectItem>
                  <SelectItem value="toshkent">Toshkent</SelectItem>
                  <SelectItem value="samarqand">Samarqand</SelectItem>
                  <SelectItem value="buxoro">Buxoro</SelectItem>
                  <SelectItem value="andijon">Andijon</SelectItem>
                  <SelectItem value="namangan">Namangan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rating table */}
        <Tabs defaultValue="overall" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overall">Umumiy</TabsTrigger>
            <TabsTrigger value="math">Matematika</TabsTrigger>
            <TabsTrigger value="physics">Fizika</TabsTrigger>
            <TabsTrigger value="english">Ingliz tili</TabsTrigger>
          </TabsList>

          <TabsContent value="overall">
            <Card>
              <CardHeader>
                <CardTitle>Umumiy reyting</CardTitle>
                <CardDescription>Barcha abituriyentlarning umumiy ball bo'yicha reytingi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">O'rin</th>
                          <th className="text-left p-3 font-medium">Abituriyent</th>
                          <th className="text-left p-3 font-medium">Hudud</th>
                          <th className="text-left p-3 font-medium">Maktab</th>
                          <th className="text-left p-3 font-medium">Ball</th>
                          <th className="text-left p-3 font-medium">Testlar</th>
                          <th className="text-left p-3 font-medium">So'nggi faollik</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className={`border-t ${user.isCurrentUser ? "bg-blue-50" : ""} hover:bg-gray-50`}
                          >
                            <td className="p-3">
                              <div className="flex items-center">
                                {user.position <= 3 && (
                                  <Medal
                                    className={`h-4 w-4 mr-1 ${
                                      user.position === 1
                                        ? "text-yellow-500"
                                        : user.position === 2
                                          ? "text-gray-400"
                                          : "text-amber-700"
                                    }`}
                                  />
                                )}
                                <span className={user.isCurrentUser ? "font-bold" : ""}>{user.position}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <Avatar className="w-8 h-8 mr-2">
                                  {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                                  <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className={user.isCurrentUser ? "font-bold" : ""}>
                                  {user.name}
                                  {user.isCurrentUser && (
                                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                      Siz
                                    </Badge>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">{user.region}</td>
                            <td className="p-3">{user.school}</td>
                            <td className="p-3 font-medium">{user.totalScore}</td>
                            <td className="p-3">{user.testsCompleted}</td>
                            <td className="p-3">{new Date(user.lastActive).toLocaleDateString("uz-UZ")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="math">
            <Card>
              <CardHeader>
                <CardTitle>Matematika reytingi</CardTitle>
                <CardDescription>Barcha abituriyentlarning matematika fani bo'yicha reytingi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">O'rin</th>
                          <th className="text-left p-3 font-medium">Abituriyent</th>
                          <th className="text-left p-3 font-medium">Hudud</th>
                          <th className="text-left p-3 font-medium">Maktab</th>
                          <th className="text-left p-3 font-medium">Ball</th>
                          <th className="text-left p-3 font-medium">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers
                          .sort((a, b) => b.mathScore - a.mathScore)
                          .map((user, index) => (
                            <tr
                              key={user.id}
                              className={`border-t ${user.isCurrentUser ? "bg-blue-50" : ""} hover:bg-gray-50`}
                            >
                              <td className="p-3">
                                <div className="flex items-center">
                                  {index < 3 && (
                                    <Medal
                                      className={`h-4 w-4 mr-1 ${
                                        index === 0
                                          ? "text-yellow-500"
                                          : index === 1
                                            ? "text-gray-400"
                                            : "text-amber-700"
                                      }`}
                                    />
                                  )}
                                  <span className={user.isCurrentUser ? "font-bold" : ""}>{index + 1}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <Avatar className="w-8 h-8 mr-2">
                                    {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className={user.isCurrentUser ? "font-bold" : ""}>
                                    {user.name}
                                    {user.isCurrentUser && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        Siz
                                      </Badge>
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">{user.region}</td>
                              <td className="p-3">{user.school}</td>
                              <td className="p-3 font-medium">{user.mathScore}%</td>
                              <td className="p-3 w-40">
                                <Progress value={user.mathScore} className="h-2" />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physics">
            <Card>
              <CardHeader>
                <CardTitle>Fizika reytingi</CardTitle>
                <CardDescription>Barcha abituriyentlarning fizika fani bo'yicha reytingi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">O'rin</th>
                          <th className="text-left p-3 font-medium">Abituriyent</th>
                          <th className="text-left p-3 font-medium">Hudud</th>
                          <th className="text-left p-3 font-medium">Maktab</th>
                          <th className="text-left p-3 font-medium">Ball</th>
                          <th className="text-left p-3 font-medium">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers
                          .sort((a, b) => b.physicsScore - a.physicsScore)
                          .map((user, index) => (
                            <tr
                              key={user.id}
                              className={`border-t ${user.isCurrentUser ? "bg-blue-50" : ""} hover:bg-gray-50`}
                            >
                              <td className="p-3">
                                <div className="flex items-center">
                                  {index < 3 && (
                                    <Medal
                                      className={`h-4 w-4 mr-1 ${
                                        index === 0
                                          ? "text-yellow-500"
                                          : index === 1
                                            ? "text-gray-400"
                                            : "text-amber-700"
                                      }`}
                                    />
                                  )}
                                  <span className={user.isCurrentUser ? "font-bold" : ""}>{index + 1}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <Avatar className="w-8 h-8 mr-2">
                                    {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className={user.isCurrentUser ? "font-bold" : ""}>
                                    {user.name}
                                    {user.isCurrentUser && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        Siz
                                      </Badge>
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">{user.region}</td>
                              <td className="p-3">{user.school}</td>
                              <td className="p-3 font-medium">{user.physicsScore}%</td>
                              <td className="p-3 w-40">
                                <Progress value={user.physicsScore} className="h-2" />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="english">
            <Card>
              <CardHeader>
                <CardTitle>Ingliz tili reytingi</CardTitle>
                <CardDescription>Barcha abituriyentlarning ingliz tili fani bo'yicha reytingi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">O'rin</th>
                          <th className="text-left p-3 font-medium">Abituriyent</th>
                          <th className="text-left p-3 font-medium">Hudud</th>
                          <th className="text-left p-3 font-medium">Maktab</th>
                          <th className="text-left p-3 font-medium">Ball</th>
                          <th className="text-left p-3 font-medium">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers
                          .sort((a, b) => b.englishScore - a.englishScore)
                          .map((user, index) => (
                            <tr
                              key={user.id}
                              className={`border-t ${user.isCurrentUser ? "bg-blue-50" : ""} hover:bg-gray-50`}
                            >
                              <td className="p-3">
                                <div className="flex items-center">
                                  {index < 3 && (
                                    <Medal
                                      className={`h-4 w-4 mr-1 ${
                                        index === 0
                                          ? "text-yellow-500"
                                          : index === 1
                                            ? "text-gray-400"
                                            : "text-amber-700"
                                      }`}
                                    />
                                  )}
                                  <span className={user.isCurrentUser ? "font-bold" : ""}>{index + 1}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <Avatar className="w-8 h-8 mr-2">
                                    {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className={user.isCurrentUser ? "font-bold" : ""}>
                                    {user.name}
                                    {user.isCurrentUser && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        Siz
                                      </Badge>
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">{user.region}</td>
                              <td className="p-3">{user.school}</td>
                              <td className="p-3 font-medium">{user.englishScore}%</td>
                              <td className="p-3 w-40">
                                <Progress value={user.englishScore} className="h-2" />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

