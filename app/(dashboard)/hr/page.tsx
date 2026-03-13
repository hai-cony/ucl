// app/(dashboard)/hr/page.tsx — Server Component

// import { createServerClient } from "@/lib/supabase/server";
import HRPage from "./_components/hr-page";

export default async function Page() {
  //   const supabase = createServerClient();
  const today = new Date().toISOString().split("T")[0];
  const firstOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .split("T")[0];

  //   const [
  //     { data: employees   },
  //     { data: attendance  },
  //     { data: leaveReqs   },
  //     { data: payrollItems},
  //     { data: departments },
  //   ] = await Promise.all([
  //     supabase
  //       .from("employees")
  //       .select(`
  //         id, nik, full_name, gender, join_date, status,
  //         department:departments(name),
  //         position:positions(name),
  //         basic_salary
  //       `)
  //       .order("full_name"),

  //     supabase
  //       .from("attendances")
  //       .select(`
  //         check_in, check_out, status,
  //         employee:employees(nik, full_name, department:departments(name))
  //       `)
  //       .eq("date", today),

  //     supabase
  //       .from("leave_requests")
  //       .select(`
  //         id, type, start_date, end_date, total_days, notes, status,
  //         employee:employees(full_name, department:departments(name))
  //       `)
  //       .order("created_at", { ascending: false }),

  //     supabase
  //       .from("payroll_items")
  //       .select(`
  //         basic_salary, allowance_total, overtime_pay, deduction_total, net_salary, status,
  //         employee:employees(nik, full_name, department:departments(name)),
  //         payroll:payrolls(period_month, period_year, status)
  //       `)
  //       .gte("payroll.period_start", firstOfMonth),

  //     supabase
  //       .from("departments")
  //       .select("id, name")
  //       .order("name"),
  //   ]);

  return (
    <HRPage
    //   employees={employees    ?? []}
    //   attendance={attendance  ?? []}
    //   leaveRequests={leaveReqs ?? []}
    //   payrollItems={payrollItems ?? []}
    //   departments={departments ?? []}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// app/(dashboard)/hr/actions.ts — Server Actions
// ─────────────────────────────────────────────────────────────

/*
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Tambah karyawan baru
export async function createEmployee(data: {
  full_name:    string;
  gender:       "M" | "F";
  birth_date:   string;
  ktp_number:   string;
  address:      string;
  department_id:string;
  position_id:  string;
  join_date:    string;
  employment_type: "permanent" | "contract" | "intern";
  basic_salary: number;
  fixed_allowance: number;
  bank_account: string;
  bank_name:    string;
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles").select("company_id").eq("id", user.id).single();

  // Generate NIK otomatis
  const { data: lastEmp } = await supabase
    .from("employees")
    .select("nik")
    .eq("company_id", profile?.company_id)
    .order("nik", { ascending: false })
    .limit(1)
    .single();

  const lastNum = lastEmp ? parseInt(lastEmp.nik.split("-")[1]) : 0;
  const nik = `EMP-${String(lastNum + 1).padStart(4, "0")}`;

  // Buat user Supabase Auth untuk karyawan
  const { data: authUser } = await supabase.auth.admin.createUser({
    email: `${nik.toLowerCase()}@internal.company`,
    password: `${nik}-${data.ktp_number.slice(-4)}`,
  });

  const { error } = await supabase.from("employees").insert({
    ...data,
    nik,
    company_id: profile?.company_id,
    user_id:    authUser?.user?.id,
    status:     "active",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/hr");
}

// Setujui atau tolak cuti
export async function processLeaveRequest(
  requestId: string,
  action:     "approved" | "rejected",
  note?:      string
) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("leave_requests").update({
    status:      action,
    approved_by: user.id,
    approved_at: new Date().toISOString(),
    notes:       note,
  }).eq("id", requestId);

  revalidatePath("/hr");
}

// Proses penggajian bulanan
export async function processPayroll(payrollId: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles").select("company_id").eq("id", user.id).single();

  // Ambil semua karyawan aktif
  const { data: employees } = await supabase
    .from("employees")
    .select("id, basic_salary")
    .eq("company_id", profile?.company_id)
    .eq("status", "active");

  if (!employees) return;

  const now   = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();

  // Hitung gaji per karyawan
  for (const emp of employees) {
    // Hitung hari hadir dari tabel attendances
    const { data: attends } = await supabase
      .from("attendances")
      .select("status")
      .eq("employee_id", emp.id)
      .gte("date", `${year}-${String(month).padStart(2,"0")}-01`);

    const workDays  = attends?.filter(a => a.status !== "absent").length ?? 0;
    const totalDays = 22; // Asumsi 22 hari kerja/bulan

    const basicProrated = Math.round(emp.basic_salary * (workDays / totalDays));
    const bpjsKes       = Math.round(basicProrated * 0.01);   // BPJS Kesehatan 1%
    const bpjsTk        = Math.round(basicProrated * 0.02);   // BPJS TK 2%
    const pph21         = Math.round(Math.max(0, basicProrated - 5400000) * 0.05); // PPh 21 simplified
    const totalDeduction = bpjsKes + bpjsTk + pph21;
    const netSalary      = basicProrated - totalDeduction;

    await supabase.from("payroll_items").insert({
      payroll_id:       payrollId,
      employee_id:      emp.id,
      basic_salary:     basicProrated,
      allowance_total:  0,
      overtime_pay:     0,
      deduction_total:  totalDeduction,
      net_salary:       netSalary,
      status:           "draft",
    });
  }

  await supabase.from("payrolls").update({ status: "processed" }).eq("id", payrollId);
  revalidatePath("/hr");
}

// Record manual check-in/out (backup dari mesin absen)
export async function recordAttendance(
  employeeId: string,
  type:        "check_in" | "check_out",
  time:        string
) {
  const supabase = createServerClient();
  const today = new Date().toISOString().split("T")[0];

  if (type === "check_in") {
    await supabase.from("attendances").upsert({
      employee_id: employeeId,
      date:        today,
      check_in:    time,
      status:      time > "08:00" ? "late" : "present",
    });
  } else {
    await supabase.from("attendances")
      .update({ check_out: time })
      .eq("employee_id", employeeId)
      .eq("date", today);
  }

  revalidatePath("/hr");
}
*/
