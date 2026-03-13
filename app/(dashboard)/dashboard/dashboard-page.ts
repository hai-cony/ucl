// import { createServerClient } from "@/lib/supabase/server";
// import { DashboardClient } from "./_components/dashboard-client";

// // ── Types ─────────────────────────────────────────────────────
// export type DashboardKPI = {
//   total_sales:       number;
//   sales_growth:      number;
//   total_production:  number;
//   production_growth: number;
//   total_purchase:    number;
//   purchase_growth:   number;
//   active_employees:  number;
//   on_leave:          number;
// };

// export type AlertItem = {
//   type:   "danger" | "warning" | "info";
//   label:  string;
//   detail: string;
//   action: string;
//   module: string;
//   href:   string;
// };

// // ── Queries ───────────────────────────────────────────────────
// async function getDashboardData(supabase: ReturnType<typeof createServerClient>) {
//   const companyId = (await supabase.auth.getUser()).data.user?.id;

//   const [
//     { data: salesMonth },
//     { data: workOrders },
//     { data: stockAlerts },
//     { data: overdueInvoices },
//     { data: pendingPOs },
//     { data: attendance },
//     { data: activities },
//     { data: salesTrend },
//   ] = await Promise.all([
//     // Total penjualan bulan ini
//     supabase
//       .from("invoices")
//       .select("total, created_at")
//       .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),

//     // Work order aktif
//     supabase
//       .from("work_orders")
//       .select("id, wo_number, product:products(name), planned_qty, produced_qty, status")
//       .in("status", ["released", "in_progress"])
//       .order("created_at", { ascending: false })
//       .limit(6),

//     // Stok kritis
//     supabase
//       .from("stock")
//       .select("quantity, product:products(name, min_stock, sku)")
//       .filter("quantity", "lt", "products.min_stock"),

//     // Invoice overdue
//     supabase
//       .from("invoices")
//       .select("invoice_number, total, customer:contacts(name), due_date")
//       .eq("status", "unpaid")
//       .lt("due_date", new Date().toISOString().split("T")[0])
//       .limit(5),

//     // PO pending approval
//     supabase
//       .from("purchase_orders")
//       .select("id")
//       .eq("status", "draft"),

//     // Kehadiran hari ini
//     supabase
//       .from("attendances")
//       .select("status")
//       .eq("date", new Date().toISOString().split("T")[0]),

//     // Aktivitas terkini
//     supabase
//       .from("stock_movements")
//       .select("type, quantity, reference_type, reference_id, created_at, created_by:profiles(full_name)")
//       .order("created_at", { ascending: false })
//       .limit(10),

//     // Tren penjualan 6 bulan
//     supabase
//       .from("invoices")
//       .select("total, created_at")
//       .gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString())
//       .order("created_at"),
//   ]);

//   return { salesMonth, workOrders, stockAlerts, overdueInvoices, pendingPOs, attendance, activities, salesTrend };
// }

// // ── Page ──────────────────────────────────────────────────────
// export default async function DashboardPage() {
//   const supabase = createServerClient();
//   const data = await getDashboardData(supabase);

//   return <DashboardClient data={data} />;
// }
