import Link from "next/link"
import { Book, FileText, Video, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Materials() {
  const materialTypes = [
    {
      id: "books",
      title: "Kitoblar",
      description: "Abituriyentlar uchun foydali kitoblar to'plami",
      icon: <Book className="h-8 w-8" />,
      count: 120,
    },
    {
      id: "articles",
      title: "Maqolalar",
      description: "Mutaxassislar tomonidan yozilgan maqolalar",
      icon: <FileText className="h-8 w-8" />,
      count: 85,
    },
    {
      id: "videos",
      title: "Video darslar",
      description: "Fanlar bo'yicha video darslar to'plami",
      icon: <Video className="h-8 w-8" />,
      count: 64,
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">O'quv materiallari</h1>
      <p className="text-muted-foreground">
        Abituriyentlar uchun foydali o'quv materiallari to'plami. Bu yerda siz kitoblar, maqolalar va video darslarni
        topishingiz mumkin.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {materialTypes.map((type) => (
          <Card key={type.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                {type.icon}
                <CardTitle>{type.title}</CardTitle>
              </div>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Jami: <span className="font-medium">{type.count}</span> ta material
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/materials/${type.id}`}>
                  Ko'rish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

