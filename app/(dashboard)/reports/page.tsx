// app/(dashboard)/reports/page.tsx — Server Component

// import { createServerClient } from "@/lib/supabase/server";
import ReportsPage from "./_components/reports-page";

export default async function Page() {
  //   const supabase = createServerClient();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const since = sixMonthsAgo.toISOString().split("T")[0];

  //   const [
  //     { data: salesByMonth    },
  //     { data: purchaseByMonth },
  //     { data: productionByMonth },
  //     { data: topProducts     },
  //     { data: topCustomers    },
  //     { data: arAging         },
  //     { data: rejectByMonth   },
  //     { data: attendanceToday },
  //     { data: headcountByDept },
  //   ] = await Promise.all([
  //     // Penjualan per bulan
  //     supabase.rpc("get_sales_by_month", { p_since: since }),

  //     // Pembelian per bulan
  //     supabase.rpc("get_purchase_by_month", { p_since: since }),

  //     // Produksi per bulan
  //     supabase.rpc("get_production_by_month", { p_since: since }),

  //     // Top produk berdasarkan revenue bulan ini
  //     supabase.rpc("get_top_products_this_month"),

  //     // Top pelanggan berdasarkan total transaksi
  //     supabase.rpc("get_top_customers_this_month"),

  //     // AR aging: group by bucket (<30, 31-60, >60 hari)
  //     supabase.rpc("get_ar_aging"),

  //     // Reject per bulan
  //     supabase.rpc("get_reject_by_month", { p_since: since }),

  //     // Attendance hari ini
  //     supabase
  //       .from("attendances")
  //       .select("status")
  //       .eq("date", new Date().toISOString().split("T")[0]),

  //     // Headcount per departemen
  //     supabase
  //       .from("employees")
  //       .select("department:departments(name)")
  //       .eq("status", "active"),
  //   ]);

  return (
    <ReportsPage
    //   salesByMonth={salesByMonth       ?? []}
    //   purchaseByMonth={purchaseByMonth ?? []}
    //   productionByMonth={productionByMonth ?? []}
    //   topProducts={topProducts         ?? []}
    //   topCustomers={topCustomers       ?? []}
    //   arAging={arAging                 ?? []}
    //   rejectByMonth={rejectByMonth     ?? []}
    //   attendanceToday={attendanceToday ?? []}
    //   headcountByDept={headcountByDept ?? []}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Supabase DB Functions (tambahkan ke migration)
// ─────────────────────────────────────────────────────────────

/*
-- Penjualan per bulan
CREATE OR REPLACE FUNCTION get_sales_by_month(p_since DATE)
RETURNS TABLE(month TEXT, total NUMERIC) AS $$
  SELECT
    TO_CHAR(invoice_date, 'Mon YYYY') AS month,
    SUM(total)                        AS total
  FROM invoices
  WHERE invoice_date >= p_since
    AND status NOT IN ('cancelled')
    AND company_id = get_my_company_id()
  GROUP BY DATE_TRUNC('month', invoice_date), month
  ORDER BY DATE_TRUNC('month', invoice_date);
$$ LANGUAGE sql SECURITY DEFINER;

-- Pembelian per bulan
CREATE OR REPLACE FUNCTION get_purchase_by_month(p_since DATE)
RETURNS TABLE(month TEXT, total NUMERIC) AS $$
  SELECT
    TO_CHAR(invoice_date, 'Mon YYYY') AS month,
    SUM(total)                        AS total
  FROM purchase_invoices
  WHERE invoice_date >= p_since
    AND company_id = get_my_company_id()
  GROUP BY DATE_TRUNC('month', invoice_date), month
  ORDER BY DATE_TRUNC('month', invoice_date);
$$ LANGUAGE sql SECURITY DEFINER;

-- Produksi per bulan
CREATE OR REPLACE FUNCTION get_production_by_month(p_since DATE)
RETURNS TABLE(month TEXT, total_qty BIGINT) AS $$
  SELECT
    TO_CHAR(created_at, 'Mon YYYY') AS month,
    SUM(quantity)                   AS total_qty
  FROM production_logs
  WHERE type = 'production'
    AND created_at >= p_since
    AND company_id = get_my_company_id()
  GROUP BY DATE_TRUNC('month', created_at), month
  ORDER BY DATE_TRUNC('month', created_at);
$$ LANGUAGE sql SECURITY DEFINER;

-- AR Aging
CREATE OR REPLACE FUNCTION get_ar_aging()
RETURNS TABLE(bucket TEXT, total NUMERIC) AS $$
  SELECT
    CASE
      WHEN CURRENT_DATE - due_date <= 30 THEN '0-30 hari'
      WHEN CURRENT_DATE - due_date <= 60 THEN '31-60 hari'
      ELSE '>60 hari'
    END AS bucket,
    SUM(total - paid_amount) AS total
  FROM invoices
  WHERE status IN ('unpaid','partial','overdue')
    AND company_id = get_my_company_id()
  GROUP BY bucket;
$$ LANGUAGE sql SECURITY DEFINER;

-- Top produk bulan ini
CREATE OR REPLACE FUNCTION get_top_products_this_month()
RETURNS TABLE(product_name TEXT, revenue NUMERIC, qty BIGINT) AS $$
  SELECT
    p.name AS product_name,
    SUM(si.quantity * si.unit_price - si.discount) AS revenue,
    SUM(si.quantity)                               AS qty
  FROM sales_order_items si
  JOIN products p ON p.id = si.product_id
  JOIN sales_orders so ON so.id = si.so_id
  WHERE DATE_TRUNC('month', so.order_date) = DATE_TRUNC('month', CURRENT_DATE)
    AND so.company_id = get_my_company_id()
    AND so.status NOT IN ('cancelled','draft')
  GROUP BY p.name
  ORDER BY revenue DESC
  LIMIT 10;
$$ LANGUAGE sql SECURITY DEFINER;
*/

// ─────────────────────────────────────────────────────────────
// app/(dashboard)/reports/actions.ts — Download laporan
// ─────────────────────────────────────────────────────────────

/*
"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function generateReport(params: {
  type:       string;
  start_date: string;
  end_date:   string;
  format:     "pdf" | "excel" | "csv";
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Untuk PDF/Excel, panggil Edge Function Supabase yang handle rendering
  const { data, error } = await supabase.functions.invoke("generate-report", {
    body: {
      ...params,
      user_id: user.id,
    },
  });

  if (error) throw new Error(error.message);

  // Edge Function returns a signed URL to the generated file
  return data.url as string;
}

// Untuk CSV, bisa generate langsung di server action
export async function generateCSV(type: string, startDate: string, endDate: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let rows: any[] = [];
  let headers: string[] = [];

  switch (type) {
    case "sales_summary":
      headers = ["Nomor SO","Pelanggan","Tanggal","Total","Status"];
      const { data: orders } = await supabase
        .from("sales_orders")
        .select("so_number, customer:contacts(name), order_date, total, status")
        .gte("order_date", startDate)
        .lte("order_date", endDate);
      rows = orders?.map(o => [o.so_number, (o.customer as any).name, o.order_date, o.total, o.status]) ?? [];
      break;

    case "inventory_val":
      headers = ["SKU","Nama Produk","Tipe","Stok","Satuan","Nilai"];
      const { data: stocks } = await supabase
        .from("stock")
        .select("quantity, product:products(sku, name, type, buy_price, unit:units(abbr))");
      rows = stocks?.map(s => {
        const p = s.product as any;
        return [p.sku, p.name, p.type, s.quantity, p.unit.abbr, s.quantity * p.buy_price];
      }) ?? [];
      break;

    // tambah case lain sesuai kebutuhan
  }

  const csv = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
}
*/
