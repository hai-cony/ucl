"use client";

// import komponen Button ti folder /app/components/ui/button.tsx
// make @/components/ui/button => alias ti path /app/components/ui/button
import { Button } from "@/components/ui/button";

export default function InventoryTopbar() {
  return (
    <div className="flex w-full px-4 py-2 shadow">
      <div className="flex-1">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Button variant={"outline"} className="rounded-sm">
                Buat
              </Button>
              <Button variant={"outline"} className="rounded-sm">
                Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
