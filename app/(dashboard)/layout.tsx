"use client";
import { Sidebar } from "@/components/usr/layout/dashboard-sidebar";
import TopbarPreview from "@/components/usr/layout/dashboard-topbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

export default function DashboardLayout({ children }: any) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbs: any = [
    { label: "Sales", href: "/sales" },
    { label: "Sales Order" }, // tanpa href = halaman aktif
  ];

  const GetInfo = async () => {
    try {
      const user = await axios.get(
        "https://vjwxtkikrdghrzqktngu.supabase.co/functions/v1/user-auth",
      );
      console.log(user);
    } catch (error) {
      // Lempar ke halaman Login
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    // GetInfo();
    setIsLoading(false);
  }, []);

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>
          <RingLoader size={60} color="blue" />
          <div className="mt-5 animate-pulse">Loading..</div>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen">
      <Sidebar
        user={{
          name: "Budi Santoso",
          email: "budi@pt-xyz.com",
          avatarInitial: "B",
        }}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopbarPreview
        //   breadcrumbs={breadcrumbs[1].label}
        //   user={{ name: "Budi", email: "budi@pt.id", role: "Manager", avatarInitial: "B" }}
        //   notifications={2}
        //   onMarkRead={(id:any) => markRead(id)}
        //   onMarkAllRead={markAllRead}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
