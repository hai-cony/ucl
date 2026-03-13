"use client";

import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calculator,
  LayoutDashboard,
  NotebookIcon,
  NotebookPen,
  NotebookPenIcon,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
// import InventoryTopbar from "../inventory/topbar";
import { Navbar } from "@/components/ui/navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";

type UserRole = {
  role: string;
};

async function getUserRole() {
  // const router = useRouter();
  // Ambil session terbaru dari Supabase
  // await supabase.auth.signOut();
  // await supabase.auth.refreshSession();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) return { user: null, message: "Error getting session" };

  if (!session)
    return { user: null, message: "No session found. User not logged in." };

  if (session) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      return { user: null, message: "No session found. User not logged in." };
    }

    if (profile?.role == "admin")
      return { user: { role: profile?.role }, message: "success" };
  }
}

export default function Home() {
  // inisiasi router jang navigasi halaman / url
  const router = useRouter();
  const [role, setRole] = useState("");

  // push ka halaman berdasarkan parameter nu dikirim to tombol nu di click
  // tergantung tombol module nu di pencet
  const handleModuleClick = (module: string) => router.push(`/${module}`);

  getUserRole().then((data) => {
    if (data?.user?.role === "admin") setRole("admin");
  });

  const signIn = async () => {
    router.push("/sign-in");
  };

  return (
    <div>
      <Navbar onSignInClick={signIn} />
      <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
            <Button
              onClick={() => handleModuleClick("dashboard")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <LayoutDashboard />
              </div>
              <div>Dashboard</div>
            </Button>
            <Button
              // kirim parameter module ka function handleModuleClick
              onClick={() => handleModuleClick("inventory")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <Briefcase />
              </div>
              <div>Inventory</div>
            </Button>
            <Button
              onClick={() => handleModuleClick("sales")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <LayoutDashboard />
              </div>
              <div>Sales</div>
            </Button>
            <Button
              onClick={() => handleModuleClick("purchasing")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <ShoppingCart />
              </div>
              <div>Purchasing</div>
            </Button>
            <Button
              onClick={() => handleModuleClick("product")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <Package />
              </div>
              <div>Production</div>
            </Button>
            <Button
              onClick={() => handleModuleClick("planner")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <NotebookPen />
              </div>
              <div>Planner</div>
            </Button>
            <Button
              onClick={() => handleModuleClick("hr")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <Calculator />
              </div>
              <div>HR</div>
            </Button>
            <Button
              onClick={() => handleModuleClick("reports")}
              variant={"outline"}
              className="h-32 block"
              disabled={!["admin"].includes(role)}
            >
              <div className="flex justify-center">
                <LayoutDashboard />
              </div>
              <div>Reports</div>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
