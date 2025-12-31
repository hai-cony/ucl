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
import InventoryTopbar from "./inventory/topbar";

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
        <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
          <Button
            // kirim parameter module ka function handleModuleClick
            onClick={() => handleModuleClick("inventory")}
            variant={"outline"}
            className="h-32 block"
          >
            <div className="flex justify-center">
              <Briefcase/>
            </div>
            <div>Inventory</div>
          </Button>
          <Button
            onClick={() => handleModuleClick("dashboard")}
            variant={"outline"}
            className="h-32 block"
          >
            <div className="flex justify-center">
              <LayoutDashboard />
            </div>
            <div>Dashboard</div>
          </Button>
          <Button
            onClick={() => handleModuleClick("purchasing")}
            variant={"outline"}
            className="h-32 block"
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
          >
            <div className="flex justify-center">
              <NotebookPen />
            </div>
            <div>Planner</div>
          </Button>
          <Button
            onClick={() => handleModuleClick("accounting")}
            variant={"outline"}
            className="h-32 block"
          >
            <div className="flex justify-center">
              <Calculator />
            </div>
            <div>Accounting</div>
          </Button>
        </div>
      </main>
    </div>
  );
}
