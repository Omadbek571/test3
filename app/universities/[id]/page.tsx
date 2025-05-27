"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building, ExternalLink, GraduationCap, MapPin, Phone, Users } from "lucide-react"

// Mock university data
const getUniversity = (id: string) => {
  const universities = {
    "1": {
      id: 1,
      name: "Toshkent Davlat Texnika Universiteti",
      shortName: "TDTU",
      region: "Toshkent",
      type: "Davlat",
      website: "https://tdtu.uz",
      phone: "+998 71 246-46-00",
      email: "info@tdtu.uz",
      address: "Toshkent sh., Universitet ko'chasi, 2-uy",
      description:
        "Toshkent davlat texnika universiteti (TDTU) — O'zbekistondagi eng yirik texnik oliy o'quv yurtlaridan biri. 1918-yilda tashkil etilgan. Universitet 10 ta fakultet, 65 ta kafedra va 25,000 dan ortiq talabaga ega.",
      logo: "/placeholder.svg?height=120&width=120",
      image: "/placeholder.svg?height=400&width=800",
      founded: "1918",
      students: 25000,
      staff: 1200,
      faculties: [
        { id: 1, name: "Kompyuter injiniringi", code: "5330200" },
        { id: 2, name: "Dasturiy injiniring", code: "5330100" },
        { id: 3, name: "Elektr energetikasi", code: "5310100" },
        { id: 4, name: "Mexanika injiniringi", code: "5320200" },
        { id: 5, name: "Kimyoviy texnologiya", code: "5320400" },
        { id: 6, name: "Neft va gaz ishi", code: "5311900" },
      ],
      admissionScores: {
        "5330200": { grant: 180, contract: 160 },
        "5330100": { grant: 185, contract: 165 },
        "5310100": { grant: 170, contract: 150 },
        "5320200": { grant: 165, contract: 145 },
        "5320400": { grant: 160, contract: 140 },
        "5311900": { grant: 175, contract: 155 },
      },
      facilities: [
        "Zamonaviy o'quv binolari",
        "Kutubxona",
        "Kompyuter markazlari",
        "Laboratoriyalar",
        "Sport majmuasi",
        "Talabalar turar joyi",
        "Oshxona va kafelar",
      ],
      partners: [
        "Turin politexnika universiteti (Italiya)",
        "Berlin texnika universiteti (Germaniya)",
        "Moskvadagi Bauman nomidagi MDTU (Rossiya)",
        "Seul milliy universiteti (Janubiy Koreya)",
      ],
      achievements: [
        "O'zbekistondagi eng nufuzli texnika universitetlaridan biri",
        "Xalqaro reytinglarda yuqori o'rinlar",
        "Ko'plab xalqaro loyihalarda ishtirok etish",
        "Sanoat korxonalari bilan mustahkam aloqalar",
      ],
    },
    "2": {
      id: 2,
      name: "O'zbekiston Milliy Universiteti",
      shortName: "O'zMU",
      region: "Toshkent",
      type: "Davlat",
      website: "https://nuu.uz",
      phone: "+998 71 246-01-95",
      email: "info@nuu.uz",
      address: "Toshkent sh., Universitet ko'chasi, 4-uy",
      description:
        "O'zbekiston Milliy universiteti (O'zMU) — O'zbekistondagi eng qadimiy va nufuzli oliy o'quv yurtlaridan biri. 1918-yilda tashkil etilgan. Universitet 15 ta fakultet, 80 ta kafedra va 27,000 dan ortiq talabaga ega.",
      logo: "/placeholder.svg?height=120&width=120",
      image: "/placeholder.svg?height=400&width=800",
      founded: "1918",
      students: 27000,
      staff: 1500,
      faculties: [
        { id: 1, name: "Matematika", code: "5130100" },
        { id: 2, name: "Fizika", code: "5140200" },
        { id: 3, name: "Biologiya", code: "5140100" },
        { id: 4, name: "Kimyo", code: "5140500" },
        { id: 5, name: "Tarix", code: "5120300" },
        { id: 6, name: "Filologiya", code: "5120100" },
      ],
      admissionScores: {
        "5130100": { grant: 175, contract: 155 },
        "5140200": { grant: 170, contract: 150 },
        "5140100": { grant: 165, contract: 145 },
        "5140500": { grant: 168, contract: 148 },
        "5120300": { grant: 160, contract: 140 },
        "5120100": { grant: 162, contract: 142 },
      },
      facilities: [
        "Zamonaviy o'quv binolari",
        "Kutubxona",
        "Kompyuter markazlari",
        "Laboratoriyalar",
        "Sport majmuasi",
        "Talabalar turar joyi",
        "Oshxona va kafelar",
      ],
      partners: [
        "Moskva davlat universiteti (Rossiya)",
        "Berlin universiteti (Germaniya)",
        "Kembridj universiteti (Buyuk Britaniya)",
        "Seul milliy universiteti (Janubiy Koreya)",
      ],
      achievements: [
        "O'zbekistondagi eng nufuzli universitetlardan biri",
        "Xalqaro reytinglarda yuqori o'rinlar",
        "Ko'plab xalqaro loyihalarda ishtirok etish",
        "Ilmiy tadqiqotlarda yetakchilik",
      ],
    },
  }

  return universities[id] || null
}

interface Faculty {
  id: number
  name: string
  code: string
}

interface AdmissionScore {
  grant: number
  contract: number
}

interface University {
  id: number
  name: string
  shortName: string
  region: string
  type: string
  website: string
  phone: string
  email: string
  address: string
  description: string
  logo: string
  image: string
  founded: string
  students: number
  staff: number
  faculties: Faculty[]
  admissionScores: {
    [key: string]: AdmissionScore
  }
  facilities: string[]
  partners: string[]
  achievements: string[]
}

export default function UniversityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const university = getUniversity(params.id) as University | null

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Universitet topilmadi</h1>
          <p className="mb-8 text-gray-600">So'ralgan universitet mavjud emas yoki o'chirilgan</p>
          <Button onClick={() => router.push("/universities")}>Universitetlar ro'yxatiga qaytish</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button variant="outline" className="mb-6" onClick={() => router.push("/universities")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Universitetlar ro'yxatiga qaytish
        </Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-48 md:h-64 bg-blue-600">
            <img
              src={university.image || "/placeholder.svg"}
              alt={university.name}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{university.name}</h1>
                <p className="text-lg">{university.shortName}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 lg:w-1/4">
                <div className="bg-white rounded-lg border p-4 text-center mb-6">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img
                      src={university.logo || "/placeholder.svg"}
                      alt={university.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <h2 className="font-bold text-lg mb-1">{university.shortName}</h2>
                  <Badge variant="outline" className="mb-4">
                    {university.type}
                  </Badge>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-left">{university.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{university.phone}</span>
                    </div>
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span>{university.website}</span>
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-4 mb-6">
                  <h3 className="font-semibold mb-3">Asosiy ma'lumotlar</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tashkil etilgan:</span>
                      <span className="font-medium">{university.founded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Talabalar soni:</span>
                      <span className="font-medium">{university.students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">O'qituvchilar:</span>
                      <span className="font-medium">{university.staff.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fakultetlar:</span>
                      <span className="font-medium">{university.faculties.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hudud:</span>
                      <span className="font-medium">{university.region}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-semibold mb-3">Infratuzilma</h3>
                  <ul className="space-y-2">
                    {university.facilities.map((facility, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                        <span>{facility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:w-2/3 lg:w-3/4">
                <Tabs defaultValue="about">
                  <TabsList className="mb-6">
                    <TabsTrigger value="about">Universitet haqida</TabsTrigger>
                    <TabsTrigger value="faculties">Fakultetlar</TabsTrigger>
                    <TabsTrigger value="admission">Qabul ballari</TabsTrigger>
                    <TabsTrigger value="partners">Hamkorlar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about">
                    <Card>
                      <CardHeader>
                        <CardTitle>Universitet haqida</CardTitle>
                        <CardDescription>{university.name} haqida umumiy ma'lumot</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-6 text-gray-700 whitespace-pre-line">{university.description}</p>

                        <h3 className="font-semibold text-lg mb-3">Yutuqlar va muvaffaqiyatlar</h3>
                        <ul className="space-y-2 mb-6">
                          {university.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 mr-2"></div>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg mb-2 flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                            Abituriyentlar uchun
                          </h3>
                          <p className="text-gray-700">
                            {university.name}ga kirish uchun DTM test sinovlaridan muvaffaqiyatli o'tishingiz kerak.
                            Universitetning rasmiy veb-saytida qabul jarayoni haqida batafsil ma'lumot olishingiz
                            mumkin.
                          </p>
                          <Button className="mt-4" onClick={() => window.open(university.website, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Rasmiy veb-saytga o'tish
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="faculties">
                    <Card>
                      <CardHeader>
                        <CardTitle>Fakultetlar va yo'nalishlar</CardTitle>
                        <CardDescription>{university.name}dagi fakultetlar va ta'lim yo'nalishlari</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {university.faculties.map((faculty) => (
                            <Card key={faculty.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <Building className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{faculty.name}</h4>
                                    <p className="text-sm text-gray-500">Kod: {faculty.code}</p>
                                  </div>
                                </div>
                                <div className="mt-3 flex justify-between text-sm">
                                  <div>
                                    <span className="text-gray-500">Grant ball:</span>
                                    <span className="font-medium text-green-600 ml-1">
                                      {university.admissionScores[faculty.code]?.grant || "-"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Kontrakt ball:</span>
                                    <span className="font-medium text-blue-600 ml-1">
                                      {university.admissionScores[faculty.code]?.contract || "-"}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="admission">
                    <Card>
                      <CardHeader>
                        <CardTitle>Qabul ballari</CardTitle>
                        <CardDescription>2022-2023 o'quv yili uchun qabul ballari</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="text-left p-3 font-medium">Yo'nalish kodi</th>
                                  <th className="text-left p-3 font-medium">Yo'nalish nomi</th>
                                  <th className="text-right p-3 font-medium">Grant ball</th>
                                  <th className="text-right p-3 font-medium">Kontrakt ball</th>
                                </tr>
                              </thead>
                              <tbody>
                                {university.faculties.map((faculty) => (
                                  <tr key={faculty.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-medium">{faculty.code}</td>
                                    <td className="p-3">{faculty.name}</td>
                                    <td className="p-3 text-right font-medium text-green-600">
                                      {university.admissionScores[faculty.code]?.grant || "-"}
                                    </td>
                                    <td className="p-3 text-right font-medium text-blue-600">
                                      {university.admissionScores[faculty.code]?.contract || "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-yellow-600" />
                            Abituriyentlar uchun eslatma
                          </h3>
                          <p className="text-gray-700">
                            Qabul ballari har yili o'zgarishi mumkin. Eng so'nggi ma'lumotlar uchun universitetning
                            rasmiy veb-saytiga murojaat qiling.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="partners">
                    <Card>
                      <CardHeader>
                        <CardTitle>Hamkor universitetlar</CardTitle>
                        <CardDescription>{university.name}ning xalqaro hamkorlari</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {university.partners.map((partner, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{partner}</h4>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="mt-6">
                          <h3 className="font-semibold mb-3">Hamkorlik imkoniyatlari</h3>
                          <p className="text-gray-700">
                            {university.name} xalqaro hamkorlik doirasida talabalar almashinuvi, qo'shma ta'lim
                            dasturlari, ilmiy tadqiqotlar va boshqa loyihalarda ishtirok etadi. Bu imkoniyatlar haqida
                            batafsil ma'lumotni universitetning xalqaro aloqalar bo'limidan olishingiz mumkin.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

