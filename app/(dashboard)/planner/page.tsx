// app/(dashboard)/planner/page.tsx — Server Component

// import { createServerClient } from "@/lib/supabase/server";
import PlannerPage from "./_components/planner-page";

export default async function Page() {
  //   const supabase = createServerClient();

  //   const [
  //     { data: plans      },
  //     { data: mrpResults },
  //     { data: workOrders },
  //     { data: workCenters},
  //   ] = await Promise.all([
  //     supabase
  //       .from("production_plans")
  //       .select(`
  //         id, plan_number, period_month, period_year, status,
  //         items:production_plan_items(
  //           id, target_qty, planned_qty, priority,
  //           product:products(name)
  //         )
  //       `)
  //       .order("period_year", { ascending: false })
  //       .order("period_month", { ascending: false }),

  //     supabase
  //       .from("material_requirements")
  //       .select(`
  //         required_qty, available_qty, on_order_qty, shortage_qty,
  //         product:products(sku, name, unit:units(abbr))
  //       `)
  //       .order("shortage_qty", { ascending: false }),

  //     supabase
  //       .from("work_orders")
  //       .select(`
  //         id, wo_number, status, start_date, end_date, priority,
  //         product:products(name),
  //         work_center:work_centers(id, name)
  //       `)
  //       .in("status", ["draft","released","in_progress"])
  //       .order("start_date"),

  //     supabase
  //       .from("work_centers")
  //       .select("id, name, capacity_hours")
  //       .eq("is_active", true)
  //       .order("name"),

  //     // Capacity plans
  //     supabase
  //       .from("capacity_plans")
  //       .select("work_center_id, planned_hours, available_hours"),
  //   ]);

  return (
    <PlannerPage
    //   plans={plans        ?? []}
    //   mrpResults={mrpResults ?? []}
    //   workOrders={workOrders ?? []}
    //   workCenters={workCenters ?? []}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// app/(dashboard)/planner/actions.ts — Server Actions
// ─────────────────────────────────────────────────────────────

/*
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Buat rencana produksi baru
export async function createProductionPlan(data: {
  period_month: number;
  period_year:  number;
  based_on:     "so" | "manual" | "both";
  items: {
    product_id: string;
    target_qty: number;
    priority:   string;
  }[];
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles").select("company_id").eq("id", user.id).single();

  const planNumber = await supabase
    .rpc("generate_doc_number", { p_company_id: profile?.company_id, p_type: "PP" });

  const { data: plan, error } = await supabase
    .from("production_plans")
    .insert({
      company_id:   profile?.company_id,
      plan_number:  planNumber.data,
      period_month: data.period_month,
      period_year:  data.period_year,
      status:       "draft",
      created_by:   user.id,
    })
    .select().single();

  if (error) throw new Error(error.message);

  await supabase.from("production_plan_items").insert(
    data.items.map(item => ({
      plan_id:     plan.id,
      product_id:  item.product_id,
      target_qty:  item.target_qty,
      planned_qty: item.target_qty,
      priority:    item.priority,
    }))
  );

  revalidatePath("/planner");
  return plan;
}

// Jalankan MRP — hitung kebutuhan bahan dari rencana produksi
export async function runMRP(planId: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles").select("company_id").eq("id", user.id).single();

  // Ambil semua items rencana + BOM masing-masing produk
  const { data: planItems } = await supabase
    .from("production_plan_items")
    .select(`
      planned_qty,
      product_id,
      product:products(
        bom:bom(
          items:bom_items(material_id, quantity)
        )
      )
    `)
    .eq("plan_id", planId);

  if (!planItems) return;

  // Aggregasi kebutuhan per material
  const needs: Record<string, number> = {};
  for (const pi of planItems) {
    const bom = (pi.product as any)?.bom?.[0]?.items ?? [];
    for (const b of bom) {
      needs[b.material_id] = (needs[b.material_id] ?? 0) + b.quantity * pi.planned_qty;
    }
  }

  // Hapus MRP lama untuk plan ini
  await supabase.from("material_requirements")
    .delete().eq("plan_id", planId);

  // Hitung shortage per material
  for (const [materialId, required] of Object.entries(needs)) {
    const { data: stock } = await supabase
      .from("stock")
      .select("quantity")
      .eq("product_id", materialId);

    const onHand  = stock?.reduce((a, s) => a + s.quantity, 0) ?? 0;
    const { data: onOrder } = await supabase
      .from("purchase_order_items")
      .select("quantity, received_qty")
      .eq("product_id", materialId)
      .in("po:purchase_orders.status", ["sent", "partial"]);

    const ordered  = onOrder?.reduce((a, o) => a + (o.quantity - (o.received_qty ?? 0)), 0) ?? 0;
    const shortage = Math.max(0, required - onHand - ordered);

    await supabase.from("material_requirements").insert({
      plan_id:       planId,
      company_id:    profile?.company_id,
      product_id:    materialId,
      required_qty:  required,
      available_qty: onHand,
      on_order_qty:  ordered,
      shortage_qty:  shortage,
    });
  }

  revalidatePath("/planner");
}

// Generate PO otomatis untuk semua bahan yang kurang
export async function generatePurchaseOrders(planId: string) {
  const supabase = createServerClient();

  const { data: shortages } = await supabase
    .from("material_requirements")
    .select("product_id, shortage_qty")
    .eq("plan_id", planId)
    .gt("shortage_qty", 0);

  if (!shortages?.length) return;

  // Group by supplier (simplified — in production, match product to preferred supplier)
  // For each shortage, create a draft PO item
  // This would call createPurchaseOrder from purchasing/actions.ts

  revalidatePath("/planner");
  revalidatePath("/purchasing");
}
*/
