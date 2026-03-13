// app/(dashboard)/production/page.tsx — Server Component

// import { createServerClient } from "@/lib/supabase/server";
import ProductionPage from "./_components/production-page";

export default async function Page() {
  //   const supabase = createServerClient();

  //   const [
  //     { data: workOrders  },
  //     { data: bomList     },
  //     { data: workCenters },
  //     { data: logs        },
  //   ] = await Promise.all([
  //     supabase
  //       .from("work_orders")
  //       .select(`
  //         id, wo_number, planned_qty, produced_qty, rejected_qty,
  //         status, start_date, end_date, priority,
  //         product:products(name, sku),
  //         work_center:work_centers(name)
  //       `)
  //       .order("created_at", { ascending: false }),

  //     supabase
  //       .from("bom")
  //       .select(`
  //         id, version, is_active, updated_at,
  //         product:products(name),
  //         items:bom_items(id)
  //       `)
  //       .order("updated_at", { ascending: false }),

  //     supabase
  //       .from("work_centers")
  //       .select("id, name, type, capacity_hours, is_active")
  //       .eq("is_active", true)
  //       .order("name"),

  //     supabase
  //       .from("production_logs")
  //       .select(`
  //         type, quantity, notes, created_at,
  //         work_order:work_orders(wo_number),
  //         work_center:work_centers(name),
  //         created_by:profiles(full_name)
  //       `)
  //       .order("created_at", { ascending: false })
  //       .limit(50),
  //   ]);

  return (
    <ProductionPage
    //   workOrders={workOrders   ?? []}
    //   bomList={bomList         ?? []}
    //   workCenters={workCenters ?? []}
    //   logs={logs               ?? []}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// app/(dashboard)/production/actions.ts — Server Actions
// ─────────────────────────────────────────────────────────────

/*
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Buat Work Order baru
export async function createWorkOrder(data: {
  product_id:     string;
  work_center_id: string;
  planned_qty:    number;
  start_date:     string;
  end_date:       string;
  priority:       "normal" | "high" | "urgent";
  notes?:         string;
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles").select("company_id").eq("id", user.id).single();

  const woNumber = await supabase
    .rpc("generate_doc_number", { p_company_id: profile?.company_id, p_type: "WO" });

  const { data: wo, error } = await supabase
    .from("work_orders")
    .insert({
      ...data,
      company_id:   profile?.company_id,
      wo_number:    woNumber.data,
      produced_qty: 0,
      rejected_qty: 0,
      status:       "draft",
      created_by:   user.id,
    })
    .select().single();

  if (error) throw new Error(error.message);

  // Copy BOM materials ke work_order_materials
  const { data: bom } = await supabase
    .from("bom")
    .select("id, items:bom_items(*)")
    .eq("product_id", data.product_id)
    .eq("is_active", true)
    .single();

  if (bom?.items) {
    await supabase.from("work_order_materials").insert(
      bom.items.map((item: any) => ({
        work_order_id: wo.id,
        product_id:    item.material_id,
        planned_qty:   item.quantity * data.planned_qty,
        actual_qty:    0,
      }))
    );
  }

  revalidatePath("/production");
  return wo;
}

// Release WO (draft → released) — validasi stok bahan baku
export async function releaseWorkOrder(woId: string) {
  const supabase = createServerClient();

  // Cek apakah semua bahan tersedia
  const { data: materials } = await supabase
    .from("work_order_materials")
    .select("planned_qty, product:products(id)")
    .eq("work_order_id", woId);

  // Di production, cek stok sebelum release
  // (simplified — di production code perlu per-warehouse check)
  await supabase.from("work_orders")
    .update({ status: "released" })
    .eq("id", woId);

  revalidatePath("/production");
}

// Mulai produksi (released → in_progress)
export async function startWorkOrder(woId: string) {
  const supabase = createServerClient();
  await supabase.from("work_orders")
    .update({ status: "in_progress", actual_start_date: new Date().toISOString().split("T")[0] })
    .eq("id", woId);
  revalidatePath("/production");
}

// Catat log produksi — memanggil DB function otomatis update stok
export async function logProduction(data: {
  work_order_id: string;
  quantity:      number;
  rejected_qty:  number;
  notes?:        string;
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Insert log
  await supabase.from("production_logs").insert({
    work_order_id: data.work_order_id,
    type:          "production",
    quantity:      data.quantity,
    notes:         data.notes,
    created_by:    user.id,
  });

  if (data.rejected_qty > 0) {
    await supabase.from("production_logs").insert({
      work_order_id: data.work_order_id,
      type:          "reject",
      quantity:      data.rejected_qty,
      notes:         data.notes,
      created_by:    user.id,
    });
  }

  // Update produced_qty di WO
  const { data: wo } = await supabase
    .from("work_orders")
    .select("produced_qty, rejected_qty, planned_qty")
    .eq("id", data.work_order_id).single();

  const newProduced = (wo?.produced_qty ?? 0) + data.quantity;
  const newRejected = (wo?.rejected_qty ?? 0) + data.rejected_qty;
  const isDone      = newProduced >= (wo?.planned_qty ?? 0);

  await supabase.from("work_orders").update({
    produced_qty: newProduced,
    rejected_qty: newRejected,
    ...(isDone ? { status: "completed", actual_end_date: new Date().toISOString().split("T")[0] } : {}),
  }).eq("id", data.work_order_id);

  // Jika selesai, panggil DB function untuk update stok produk jadi
  if (isDone) {
    await supabase.rpc("complete_work_order", {
      p_wo_id:       data.work_order_id,
      p_produced_qty: newProduced,
      p_rejected_qty: newRejected,
    });
  }

  revalidatePath("/production");
  revalidatePath("/inventory");
}
*/
