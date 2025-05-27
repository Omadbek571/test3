"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building, GraduationCap, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UniversitiesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [fieldFilter, setFieldFilter] = useState("all")

  // Mock universities data
  const universities = [
    {
      id: 1,
      name: "Toshkent Davlat Texnika Universiteti",
      shortName: "TDTU",
      region: "Toshkent",
      type: "Davlat",
      website: "https://tdtu.uz",
      logo: "/placeholder.svg?height=80&width=80",
      faculties: [
        { id: 1, name: "Kompyuter injiniringi", code: "5330200" },
        { id: 2, name: "Dasturiy injiniring", code: "5330100" },
        { id: 3, name: "Elektr energetikasi", code: "5310100" },
      ],
      admissionScores: {
        "5330200": { grant: 180, contract: 160 },
        "5330100": { grant: 185, contract: 165 },
        "5310100": { grant: 170, contract: 150 },
      },
    },
    {
      id: 2,
      name: "O'zbekiston Milliy Universiteti",
      shortName: "O'zMU",
      region: "Toshkent",
      type: "Davlat",
      website: "https://nuu.uz",
      logo: "/placeholder.svg?height=80&width=80",
      faculties: [
        { id: 1, name: "Matematika", code: "5130100" },
        { id: 2, name: "Fizika", code: "5140200" },
        { id: 3, name: "Biologiya", code: "5140100" },
      ],
      admissionScores: {
        "5130100": { grant: 175, contract: 155 },
        "5140200": { grant: 170, contract: 150 },
        "5140100": { grant: 165, contract: 145 },
      },
    },
    {
      id: 3,
      name: "Toshkent Axborot Texnologiyalari Universiteti",
      shortName: "TATU",
      region: "Toshkent",
      type: "Davlat",
      website: "https://tuit.uz",
      logo: "/placeholder.svg?height=80&width=80",
      faculties: [
        { id: 1, name: "Kompyuter injiniringi", code: "5330200" },
        { id: 2, name: "Telekommunikatsiya texnologiyalari", code: "5350101" },
        { id: 3, name: "Axborot xavfsizligi", code: "5330300" },
      ],
      admissionScores: {
        "5330200": { grant: 182, contract: 162 },
        "5350101": { grant: 175, contract: 155 },
        "5330300": { grant: 180, contract: 160 },
      },
    },
    {
      id: 4,
      name: "Samarqand Davlat Universiteti",
      shortName: "SamDU",
      region: "Samarqand",
      type: "Davlat",
      website: "https://samdu.uz",
      logo: "/placeholder.svg?height=80&width=80",
      faculties: [
        { id: 1, name: "Tarix", code: "5120300" },
        { id: 2, name: "Filologiya", code: "5120100" },
        { id: 3, name: "Matematika", code: "5130100" },
      ],
      admissionScores: {
        "5120300": { grant: 165, contract: 145 },
        "5120100": { grant: 170, contract: 150 },
        "5130100": { grant: 168, contract: 148 },
      },
    },
    {
      id: 5,
      name: "Buxoro Davlat Universiteti",
      shortName: "BuxDU",
      region: "Buxoro",
      type: "Davlat",
      website: "https://buxdu.uz",
      logo: "/placeholder.svg?height=80&width=80",
      faculties: [
        { id: 1, name: "Iqtisodiyot", code: "5230100" },
        { id: 2, name: "Tarix", code: "5120300" },
        { id: 3, name: "Filologiya", code: "5120100" },
      ],
      admissionScores: {
        "5230100": { grant: 160, contract: 140 },
        "5120300": { grant: 155, contract: 135 },
        "5120100": { grant: 158, contract: 138 },
      },
    },
    {
      id: 6,
      name: "Andijon Davlat Universiteti",
      shortName: "AndDU",
      region: "Andijon",
      type: "Davlat",
      website: "https://adu.uz",
      logo: "/placeholder.svg?height=80&width=80",
      faculties: [
        { id: 1, name: "Pedagogika", code: "5110700" },
        { id: 2, name: "Filologiya", code: "5120100" },
        { id: 3, name: "Biologiya", code: "5140100" },
      ],
      admissionScores: {
        "5110700": { grant: 158, contract: 138 },
        "5120100": { grant: 160, contract: 140 },
        "5140100": { grant: 155, contract: 135 },
      },
    },
  ]

  // Mock fields data
  const fields = [
    { id: "5330200", name: "Kompyuter injiniringi" },
    { id: "5330100", name: "Dasturiy injiniring" },
    { id: "5310100", name: "Elektr energetikasi" },
    { id: "5130100", name: "Matematika" },
    { id: "5140200", name: "Fizika" },
    { id: "5140100", name: "Biologiya" },
    { id: "5350101", name: "Telekommunikatsiya texnologiyalari" },
    { id: "5330300", name: "Axborot xavfsizligi" },
    { id: "5120300", name: "Tarix" },
    { id: "5120100", name: "Filologiya" },
    { id: "5230100", name: "Iqtisodiyot" },
    { id: "5110700", name: "Pedagogika" },
  ]

  // Filter universities based on search and filters
  const filteredUniversities = universities.filter((university) => {
    const matchesSearch =
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.shortName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = regionFilter === "all" ? true : university.region.toLowerCase() === regionFilter.toLowerCase()

    const matchesField =
      fieldFilter === "all" ? true : university.faculties.some((faculty) => faculty.code === fieldFilter)

    return matchesSearch && matchesRegion && matchesField
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Oliy ta'lim muassasalari</h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Universitet qidirish..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
                </SelectContent>
              </Select>

              <Select value={fieldFilter} onValueChange={setFieldFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Yo'nalish bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha yo'nalishlar</SelectItem>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Universities */}
        <Tabs defaultValue="list" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">Ro'yxat</TabsTrigger>
            <TabsTrigger value="scores">Kirish ballari</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-4">
              {filteredUniversities.map((university) => (
                <Card key={university.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-64 bg-blue-50 p-4 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2">
                          <img
                            src={university.logo || "/placeholder.svg"}
                            alt={university.name}
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <h3 className="font-bold text-center">{university.shortName}</h3>
                        <p className="text-sm text-gray-500 text-center">{university.type}</p>
                      </div>

                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-bold">{university.name}</h2>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="mr-2">
                                {university.region}
                              </Badge>
                              <a
                                href={university.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {university.website}
                              </a>
                            </div>
                          </div>
                          <Button
                            className="mt-2 md:mt-0"
                            onClick={() => router.push(`/universities/${university.id}`)}
                          >
                            Batafsil
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Yo'nalishlar</h3>
                          <div className="flex flex-wrap gap-2">
                            {university.faculties.map((faculty) => (
                              <Badge key={faculty.id} variant="outline">
                                {faculty.name} ({faculty.code})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredUniversities.length === 0 && (
                <div className="text-center p-8 border rounded-lg">
                  <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-1">Universitetlar topilmadi</h3>
                  <p className="text-gray-500">Qidiruv parametrlarini o'zgartiring</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
                  O'tgan yilgi kirish ballari
                </CardTitle>
                <CardDescription>2022-2023 o'quv yili uchun oliy ta'lim muassasalariga kirish ballari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Yo'nalish kodi</th>
                          <th className="text-left p-3 font-medium">Yo'nalish nomi</th>
                          <th className="text-left p-3 font-medium">Universitet</th>
                          <th className="text-left p-3 font-medium">Hudud</th>
                          <th className="text-right p-3 font-medium">Grant ball</th>
                          <th className="text-right p-3 font-medium">Kontrakt ball</th>
                        </tr>
                      </thead>
                      <tbody>
                        {universities.flatMap((university) =>
                          university.faculties.map((faculty) => (
                            <tr key={`${university.id}-${faculty.id}`} className="border-t hover:bg-gray-50">
                              <td className="p-3 font-medium">{faculty.code}</td>
                              <td className="p-3">{faculty.name}</td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center mr-2">
                                    <Building className="h-3 w-3 text-blue-700" />
                                  </div>
                                  <span>{university.shortName}</span>
                                </div>
                              </td>
                              <td className="p-3">{university.region}</td>
                              <td className="p-3 text-right font-medium text-green-600">
                                {university.admissionScores[faculty.code]?.grant || "-"}
                              </td>
                              <td className="p-3 text-right font-medium text-blue-600">
                                {university.admissionScores[faculty.code]?.contract || "-"}
                              </td>
                            </tr>
                          )),
                        )}
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

