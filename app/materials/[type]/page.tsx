import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for materials
const materials = {
  books: [
    {
      id: 1,
      title: "Matematika abituriyentlar uchun",
      author: "Alisher Qodirov",
      date: "2023-05-15",
      readTime: "3 soat",
      subject: "Matematika",
    },
    {
      id: 2,
      title: "Fizika masalalar to'plami",
      author: "Bobur Karimov",
      date: "2023-04-10",
      readTime: "2 soat",
      subject: "Fizika",
    },
    {
      id: 3,
      title: "Kimyo formulalar",
      author: "Gulnora Azimova",
      date: "2023-06-20",
      readTime: "1.5 soat",
      subject: "Kimyo",
    },
    {
      id: 4,
      title: "Biologiya atlas",
      author: "Sardor Mahmudov",
      date: "2023-03-05",
      readTime: "4 soat",
      subject: "Biologiya",
    },
    {
      id: 5,
      title: "Tarix sanalar",
      author: "Dilshod Rahimov",
      date: "2023-07-12",
      readTime: "2.5 soat",
      subject: "Tarix",
    },
  ],
  articles: [
    {
      id: 1,
      title: "Abituriyentlar uchun foydali maslahatlar",
      author: "Alisher Qodirov",
      date: "2023-08-15",
      readTime: "10 daqiqa",
      subject: "Umumiy",
    },
    {
      id: 2,
      title: "Matematikadan test yechish sirlari",
      author: "Bobur Karimov",
      date: "2023-07-10",
      readTime: "15 daqiqa",
      subject: "Matematika",
    },
    {
      id: 3,
      title: "Fizika formulalarini yodlash usullari",
      author: "Gulnora Azimova",
      date: "2023-09-20",
      readTime: "12 daqiqa",
      subject: "Fizika",
    },
    {
      id: 4,
      title: "Biologiya testlariga tayyorlanish",
      author: "Sardor Mahmudov",
      date: "2023-06-05",
      readTime: "8 daqiqa",
      subject: "Biologiya",
    },
    {
      id: 5,
      title: "Tarix sanalarini yodlash usullari",
      author: "Dilshod Rahimov",
      date: "2023-08-12",
      readTime: "14 daqiqa",
      subject: "Tarix",
    },
  ],
  videos: [
    {
      id: 1,
      title: "Matematika: Algebra asoslari",
      author: "Alisher Qodirov",
      date: "2023-05-15",
      readTime: "45 daqiqa",
      subject: "Matematika",
    },
    {
      id: 2,
      title: "Fizika: Mexanika",
      author: "Bobur Karimov",
      date: "2023-04-10",
      readTime: "50 daqiqa",
      subject: "Fizika",
    },
    {
      id: 3,
      title: "Kimyo: Organik kimyo",
      author: "Gulnora Azimova",
      date: "2023-06-20",
      readTime: "40 daqiqa",
      subject: "Kimyo",
    },
    {
      id: 4,
      title: "Biologiya: Botanika",
      author: "Sardor Mahmudov",
      date: "2023-03-05",
      readTime: "55 daqiqa",
      subject: "Biologiya",
    },
    {
      id: 5,
      title: "Tarix: O'zbekiston tarixi",
      author: "Dilshod Rahimov",
      date: "2023-07-12",
      readTime: "60 daqiqa",
      subject: "Tarix",
    },
  ],
}

// Type name mapping
const typeNames = {
  books: "Kitoblar",
  articles: "Maqolalar",
  videos: "Video darslar",
}

export default function MaterialsPage({ params }: { params: { type: string } }) {
  const type = params.type
  const typeName = typeNames[type as keyof typeof typeNames] || type
  const typeMaterials = materials[type as keyof typeof materials] || []

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/materials">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{typeName}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {typeMaterials.map((material) => (
          <Card key={material.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{material.title}</CardTitle>
                <Badge variant="outline">{material.subject}</Badge>
              </div>
              <CardDescription>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{material.author}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(material.date).toLocaleDateString("uz-UZ")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{material.readTime}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/materials/view/${material.id}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ko'rish
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

