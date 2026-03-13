// app/(dashboard)/inventory/page.tsx
// Server Component — fetch data dari Supabase, kirim ke client

// import { createServerClient } from "@/lib/supabase/server";
// import InventoryPage    from "./_components/_inventory-page";
import InventoryPage from "./_components/_inventory-page";

export default async function Page() {
  //   const supabase = createServerClient();

  //   const [
  //     { data: products },
  //     { data: stocks },
  //     { data: movements },
  //     { data: categories },
  //     { data: warehouses },
  //   ] = await Promise.all([
  //     supabase
  //       .from("products")
  //       .select(
  //         `
  //         id, sku, name, type, buy_price, sell_price, min_stock, is_active,
  //         category:product_categories(name),
  //         unit:units(name, abbr)
  //       `,
  //       )
  //       .order("sku"),

  //     supabase
  //       .from("stock")
  //       .select(
  //         `
  //         quantity, updated_at,
  //         product:products(id, sku, name, type, min_stock, unit:units(abbr)),
  //         warehouse:warehouses(name)
  //       `,
  //       )
  //       .order("updated_at", { ascending: false }),

  //     supabase
  //       .from("stock_movements")
  //       .select(
  //         `
  //         type, quantity, reference_type, reference_id, notes, created_at,
  //         product:products(name, sku),
  //         warehouse:warehouses(name),
  //         created_by:profiles(full_name)
  //       `,
  //       )
  //       .order("created_at", { ascending: false })
  //       .limit(100),

  //     supabase.from("product_categories").select("id, name").order("name"),
  //     supabase.from("warehouses").select("id, name").order("name"),
  //   ]);

  return (
    <InventoryPage
    //   products={products ?? []}
    //   stocks={stocks ?? []}
    //   movements={movements ?? []}
    //   categories={categories ?? []}
    //   warehouses={warehouses ?? []}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// app/(dashboard)/inventory/_components/inventory-client.tsx
// (Pisahkan ke file terpisah di project kamu)
// ─────────────────────────────────────────────────────────────

// Server Action untuk create/update produk
// app/(dashboard)/inventory/actions.ts

/*
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProductSchema = z.object({
  sku:        z.string().min(1),
  name:       z.string().min(1),
  type:       z.enum(["raw_material", "wip", "finished", "consumable"]),
  category_id:z.string().uuid().optional(),
  unit_id:    z.string().uuid(),
  buy_price:  z.number().min(0).default(0),
  sell_price: z.number().min(0).default(0),
  min_stock:  z.number().min(0).default(0),
});

export async function createProduct(formData: FormData) {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  const parsed = ProductSchema.parse({
    sku:         formData.get("sku"),
    name:        formData.get("name"),
    type:        formData.get("type"),
    category_id: formData.get("category_id") || undefined,
    unit_id:     formData.get("unit_id"),
    buy_price:   Number(formData.get("buy_price") || 0),
    sell_price:  Number(formData.get("sell_price") || 0),
    min_stock:   Number(formData.get("min_stock") || 0),
  });

  const { error } = await supabase.from("products").insert({
    ...parsed,
    company_id: profile?.company_id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/inventory");
}

export async function updateStock(
  productId: string,
  warehouseId: string,
  delta: number,
  notes?: string
) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Update stok
  const { data: existing } = await supabase
    .from("stock")
    .select("quantity")
    .eq("product_id", productId)
    .eq("warehouse_id", warehouseId)
    .single();

  const newQty = (existing?.quantity ?? 0) + delta;

  await supabase.from("stock").upsert({
    product_id:   productId,
    warehouse_id: warehouseId,
    quantity:     Math.max(0, newQty),
    updated_at:   new Date().toISOString(),
  });

  // Catat mutasi
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  await supabase.from("stock_movements").insert({
    company_id:   profile?.company_id,
    product_id:   productId,
    warehouse_id: warehouseId,
    type:         "adjustment",
    quantity:     Math.abs(delta),
    notes:        notes ?? "Manual adjustment",
    created_by:   user.id,
  });

  revalidatePath("/inventory");
}
*/
