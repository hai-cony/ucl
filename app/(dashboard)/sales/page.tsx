// app/(dashboard)/sales/page.tsx — Server Component

// import { createServerClient } from "@/lib/supabase/server";
import SalesPage from "./_component/sales-component";

export default async function Page() {
  //   const supabase = createServerClient();

  //   const [
  //     { data: orders },
  //     { data: deliveries },
  //     { data: invoices },
  //   ] = await Promise.all([
  //     supabase
  //       .from("sales_orders")
  //       .select(`
  //         id, so_number, status, order_date, due_date,
  //         subtotal, discount, tax_amount, total,
  //         customer:contacts(name),
  //         items:sales_order_items(id)
  //       `)
  //       .order("created_at", { ascending: false }),

  //     supabase
  //       .from("deliveries")
  //       .select(`
  //         id, delivery_number, delivery_date, status,
  //         so:sales_orders(so_number),
  //         customer:contacts(name),
  //         items:delivery_items(id)
  //       `)
  //       .order("created_at", { ascending: false }),

  //     supabase
  //       .from("invoices")
  //       .select(`
  //         id, invoice_number, invoice_date, due_date,
  //         subtotal, tax_amount, total, paid_amount, status,
  //         so:sales_orders(so_number),
  //         customer:contacts(name)
  //       `)
  //       .order("created_at", { ascending: false }),
  //   ]);

  return (
    <SalesPage
    //   orders={orders ?? []}
    //   deliveries={deliveries ?? []}
    //   invoices={invoices ?? []}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// app/(dashboard)/sales/actions.ts — Server Actions
// ─────────────────────────────────────────────────────────────

/*
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Buat Sales Order baru
export async function createSalesOrder(data: {
  customer_id:  string;
  due_date:     string;
  notes?:       string;
  items: {
    product_id: string;
    quantity:   number;
    unit_price: number;
    discount:   number;
  }[];
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  // Generate nomor SO otomatis
  const soNumber = await supabase
    .rpc("generate_doc_number", { p_company_id: profile?.company_id, p_type: "SO" });

  const subtotal = data.items.reduce((a, i) => a + i.quantity * i.unit_price - i.discount, 0);
  const tax      = Math.round(subtotal * 0.11);

  const { data: so, error } = await supabase
    .from("sales_orders")
    .insert({
      company_id:  profile?.company_id,
      customer_id: data.customer_id,
      so_number:   soNumber.data,
      order_date:  new Date().toISOString().split("T")[0],
      due_date:    data.due_date,
      subtotal,
      tax_amount:  tax,
      total:       subtotal + tax,
      notes:       data.notes,
      status:      "draft",
      created_by:  user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Insert items
  await supabase.from("sales_order_items").insert(
    data.items.map(item => ({
      so_id:      so.id,
      product_id: item.product_id,
      quantity:   item.quantity,
      unit_price: item.unit_price,
      discount:   item.discount,
    }))
  );

  revalidatePath("/sales");
  return so;
}

// Konfirmasi SO (draft → confirmed)
export async function confirmSalesOrder(soId: string) {
  const supabase = createServerClient();
  await supabase.from("sales_orders").update({ status: "confirmed" }).eq("id", soId);
  revalidatePath("/sales");
}

// Buat Delivery Order dari SO
export async function createDelivery(soId: string, items: { so_item_id: string; product_id: string; quantity: number }[]) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user!.id).single();

  const doNumber = await supabase.rpc("generate_doc_number", { p_company_id: profile?.company_id, p_type: "DO" });

  const { data: delivery } = await supabase.from("deliveries").insert({
    company_id:      profile?.company_id,
    so_id:           soId,
    delivery_number: doNumber.data,
    delivery_date:   new Date().toISOString().split("T")[0],
    status:          "draft",
    created_by:      user!.id,
  }).select().single();

  await supabase.from("delivery_items").insert(
    items.map(i => ({ delivery_id: delivery!.id, ...i }))
  );

  revalidatePath("/sales");
  return delivery;
}

// Catat pembayaran invoice
export async function recordPayment(invoiceId: string, amount: number, method: string, reference?: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user!.id).single();

  const { data: invoice } = await supabase.from("invoices").select("total, paid_amount, customer_id").eq("id", invoiceId).single();
  const newPaid  = (invoice?.paid_amount ?? 0) + amount;
  const newStatus = newPaid >= (invoice?.total ?? 0) ? "paid" : "partial";

  await supabase.from("invoices").update({ paid_amount: newPaid, status: newStatus }).eq("id", invoiceId);
  await supabase.from("payments").insert({
    company_id:  profile?.company_id,
    type:        "receive",
    invoice_id:  invoiceId,
    contact_id:  invoice?.customer_id,
    payment_date:new Date().toISOString().split("T")[0],
    amount,
    method,
    reference,
    created_by:  user!.id,
  });

  revalidatePath("/sales");
}
*/
