"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, LogOut, Settings, Trophy, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export function ProfileHeader() {
  const { logout } = useAuth();
  const router = useRouter();

  const [meInfo, setMeInfo] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get(`https://testonline.pythonanywhere.com/api/profile/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMeInfo(res.data);
      })
      .catch((err) => {
        console.log("Xatolik:", err);
      });
  }, []);

  const user = {
    name: meInfo?.full_name || "Ism kiritilmagan",
    avatar: meInfo?.profile_picture || "/placeholder.svg?height=100&width=100",
    role: meInfo?.role_display || "Foydalanuvchi",
    balance: meInfo?.balance_display || "0 so'm",
    level: `${meInfo?.rating?.level || 1}-daraja`,
    joinDate: meInfo?.date_joined
      ? meInfo.date_joined.split(" ")[0]
      : "Noma'lum",
    ratingRank: meInfo?.rating?.rank ?? 0,
  };

  if (!meInfo) {
    return <div className="text-center p-10 text-white">Yuklanmoqda...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bilimdon Abituriyent</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => router.push("/notifications")}
            >
              <Bell size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => router.push("/profile/settings")}
            >
              <Settings size={20} />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={logout}
            >
              <LogOut size={16} className="mr-2" />
              Chiqish
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-none shadow-lg relative mt-6 mb-[-50px]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-500 text-white text-2xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100">{user.role}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-white/20 rounded-full px-4 py-1 text-sm">
                  A'zo bo'lgan:{" "}
                  {new Date(user.joinDate).toLocaleDateString("uz-UZ")}
                </div>
                <div className="bg-yellow-500/80 rounded-full px-4 py-1 text-sm font-medium">
                  {user.level}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => router.push("/rating")}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Reyting: #{user.ratingRank}
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-sm">Balans</div>
                <div className="text-xl font-bold">{user.balance}</div>
              </div>
              <Button
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => router.push("/profile/edit")}
              >
                <User size={16} className="mr-2" />
                Profilni tahrirlash
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
