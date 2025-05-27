import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for a single material
const getMaterial = (id: string) => {
  return {
    id: Number.parseInt(id),
    title: "Matematika abituriyentlar uchun",
    author: "Alisher Qodirov",
    date: "2023-05-15",
    readTime: "3 soat",
    subject: "Matematika",
    content: `
      <h2>Kirish</h2>
      <p>Ushbu kitob abituriyentlar uchun matematika fanidan tayyorlanish uchun mo'ljallangan. Kitobda algebra, geometriya va trigonometriya bo'limlari bo'yicha nazariy ma'lumotlar va masalalar yechish usullari keltirilgan.</p>
      
      <h2>Algebra</h2>
      <p>Algebra bo'limida sonlar, algebraik ifodalar, tenglamalar va tengsizliklar, funksiyalar va ularning xossalari haqida ma'lumotlar berilgan.</p>
      
      <h2>Geometriya</h2>
      <p>Geometriya bo'limida tekislikdagi va fazodagi geometrik shakllar, ularning xossalari, yuzasi va hajmini hisoblash usullari keltirilgan.</p>
      
      <h2>Trigonometriya</h2>
      <p>Trigonometriya bo'limida trigonometrik funksiyalar, ularning xossalari, trigonometrik tenglamalar va tengsizliklarni yechish usullari haqida ma'lumotlar berilgan.</p>
    `,
  }
}

export default function MaterialView({ params }: { params: { id: string } }) {
  const material = getMaterial(params.id)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/materials">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Material</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{material.title}</CardTitle>
              <Badge variant="outline">{material.subject}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{material.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(material.date).toLocaleDateString("uz-UZ")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{material.readTime}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: material.content }} />

          <div className="mt-8 flex justify-center">
            <Button size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              To'liq ko'rish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

