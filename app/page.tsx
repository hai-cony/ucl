"use client";

import { Button } from "@/components/ui/button";
import {
  Briefcase,
  LayoutDashboard,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  // inisiasi router jang navigasi halaman / url
  const router = useRouter();

  const handleModuleClick = (module: string) => {
    // push ka halaman berdasarkan parameter nu dikirim to tombol nu di click
    // tergantung tombol module nu di pencet
    router.push(`/${module}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex justify-evenly flex-wrap space-x-2 w-full">
          <Button
            // kirim parameter module ka function handleModuleClick
            onClick={() => handleModuleClick("inventory")}
            variant={"outline"}
            className="h-20 block"
          >
            <div className="flex justify-center">
              <Briefcase />
            </div>
            <div>Inventory</div>
          </Button>
          <Button
            onClick={() => handleModuleClick("dashboard")}
            variant={"outline"}
            className="h-20 block"
          >
            <div className="flex justify-center">
              <LayoutDashboard />
            </div>
            <div>Dashboard</div>
          </Button>
          <Button
            onClick={() => handleModuleClick("purchasing")}
            variant={"outline"}
            className="h-20 block"
          >
            <div className="flex justify-center">
              <ShoppingCart />
            </div>
            <div>Purchasing</div>
          </Button>
          <Button
            onClick={() => handleModuleClick("product")}
            variant={"outline"}
            className="h-20 block"
          >
            <div className="flex justify-center">
              <Package />
            </div>
            <div>Product</div>
          </Button>
        </div>
      </main>
    </div>
  );
}
