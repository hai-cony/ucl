"use client";
import { useState, useMemo } from "react";

// ─── Data ──────────────────────────────────────────────────────
const DEPARTMENTS = [
  "Semua",
  "Produksi",
  "Gudang",
  "Sales",
  "Purchasing",
  "HR",
  "Finance",
  "Management",
];

const EMPLOYEES = [
  {
    id: 1,
    nik: "EMP-0142",
    name: "Budi Santoso",
    dept: "Management",
    position: "General Manager",
    status: "active",
    joinDate: "15 Jan 2018",
    salary: 18500000,
    gender: "M",
  },
  {
    id: 2,
    nik: "EMP-0089",
    name: "Sari Dewi",
    dept: "Purchasing",
    position: "Purchasing Staff",
    status: "active",
    joinDate: "03 Mar 2020",
    salary: 6200000,
    gender: "F",
  },
  {
    id: 3,
    nik: "EMP-0201",
    name: "Anton Wijaya",
    dept: "Finance",
    position: "Finance Manager",
    status: "active",
    joinDate: "20 Jul 2016",
    salary: 14000000,
    gender: "M",
  },
  {
    id: 4,
    nik: "EMP-0055",
    name: "Dewi Rahayu",
    dept: "Sales",
    position: "Sales Executive",
    status: "active",
    joinDate: "12 Apr 2021",
    salary: 7500000,
    gender: "F",
  },
  {
    id: 5,
    nik: "EMP-0056",
    name: "Rina Kusuma",
    dept: "HR",
    position: "HR Staff",
    status: "active",
    joinDate: "08 Sep 2022",
    salary: 5800000,
    gender: "F",
  },
  {
    id: 6,
    nik: "EMP-0057",
    name: "Ahmad Fauzi",
    dept: "Produksi",
    position: "Operator Mesin",
    status: "active",
    joinDate: "01 Feb 2019",
    salary: 5200000,
    gender: "M",
  },
  {
    id: 7,
    nik: "EMP-0058",
    name: "Siti Rahma",
    dept: "Gudang",
    position: "Gudang Staff",
    status: "active",
    joinDate: "15 Jun 2023",
    salary: 4800000,
    gender: "F",
  },
  {
    id: 8,
    nik: "EMP-0059",
    name: "Hendra Gunawan",
    dept: "Produksi",
    position: "Supervisor Produksi",
    status: "active",
    joinDate: "10 Nov 2017",
    salary: 9500000,
    gender: "M",
  },
  {
    id: 9,
    nik: "EMP-0060",
    name: "Maya Sari",
    dept: "Finance",
    position: "Accounting Staff",
    status: "active",
    joinDate: "22 Aug 2021",
    salary: 6800000,
    gender: "F",
  },
  {
    id: 10,
    nik: "EMP-0061",
    name: "Dodi Permana",
    dept: "Produksi",
    position: "Operator Mesin",
    status: "resigned",
    joinDate: "05 Mar 2020",
    salary: 5000000,
    gender: "M",
  },
];

const ATTENDANCE_TODAY = [
  {
    id: 1,
    name: "Budi Santoso",
    dept: "Management",
    checkIn: "07:58",
    checkOut: null,
    status: "present",
  },
  {
    id: 2,
    name: "Sari Dewi",
    dept: "Purchasing",
    checkIn: "08:02",
    checkOut: null,
    status: "present",
  },
  {
    id: 3,
    name: "Anton Wijaya",
    dept: "Finance",
    checkIn: "08:15",
    checkOut: null,
    status: "late",
  },
  {
    id: 4,
    name: "Dewi Rahayu",
    dept: "Sales",
    checkIn: null,
    checkOut: null,
    status: "leave",
  },
  {
    id: 5,
    name: "Rina Kusuma",
    dept: "HR",
    checkIn: "07:55",
    checkOut: null,
    status: "present",
  },
  {
    id: 6,
    name: "Ahmad Fauzi",
    dept: "Produksi",
    checkIn: null,
    checkOut: null,
    status: "absent",
  },
  {
    id: 7,
    name: "Siti Rahma",
    dept: "Gudang",
    checkIn: "08:10",
    checkOut: null,
    status: "present",
  },
  {
    id: 8,
    name: "Hendra Gunawan",
    dept: "Produksi",
    checkIn: "07:45",
    checkOut: null,
    status: "present",
  },
  {
    id: 9,
    name: "Maya Sari",
    dept: "Finance",
    checkIn: "08:05",
    checkOut: null,
    status: "present",
  },
];

const LEAVE_REQUESTS = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    dept: "Produksi",
    type: "Cuti Tahunan",
    start: "14 Mar",
    end: "16 Mar",
    days: 3,
    status: "pending",
    note: "Keperluan keluarga",
  },
  {
    id: 2,
    name: "Siti Rahma",
    dept: "Gudang",
    type: "Cuti Tahunan",
    start: "18 Mar",
    end: "18 Mar",
    days: 1,
    status: "pending",
    note: "Urusan pribadi",
  },
  {
    id: 3,
    name: "Dewi Rahayu",
    dept: "Sales",
    type: "Cuti Tahunan",
    start: "12 Mar",
    end: "12 Mar",
    days: 1,
    status: "approved",
    note: "Pernikahan saudara",
  },
  {
    id: 4,
    name: "Hendra Gunawan",
    dept: "Produksi",
    type: "Cuti Sakit",
    start: "10 Mar",
    end: "11 Mar",
    days: 2,
    status: "approved",
    note: "Demam — surat dokter",
  },
  {
    id: 5,
    name: "Maya Sari",
    dept: "Finance",
    type: "Cuti Melahirkan",
    start: "01 Apr",
    end: "30 Jun",
    days: 90,
    status: "pending",
    note: "Persalinan",
  },
];

const PAYROLL_MONTHS = [
  { month: "Mar 2026", status: "draft", total: 485000000, headcount: 214 },
  { month: "Feb 2026", status: "paid", total: 482000000, headcount: 212 },
  { month: "Jan 2026", status: "paid", total: 479500000, headcount: 211 },
];

const PAYROLL_ITEMS = [
  {
    nik: "EMP-0142",
    name: "Budi Santoso",
    dept: "Management",
    basic: 18500000,
    allowance: 3500000,
    overtime: 0,
    deduction: 2100000,
    net: 19900000,
    status: "paid",
  },
  {
    nik: "EMP-0089",
    name: "Sari Dewi",
    dept: "Purchasing",
    basic: 6200000,
    allowance: 800000,
    overtime: 450000,
    deduction: 710000,
    net: 6740000,
    status: "paid",
  },
  {
    nik: "EMP-0201",
    name: "Anton Wijaya",
    dept: "Finance",
    basic: 14000000,
    allowance: 2000000,
    overtime: 0,
    deduction: 1600000,
    net: 14400000,
    status: "paid",
  },
  {
    nik: "EMP-0055",
    name: "Dewi Rahayu",
    dept: "Sales",
    basic: 7500000,
    allowance: 1200000,
    overtime: 600000,
    deduction: 920000,
    net: 8380000,
    status: "draft",
  },
  {
    nik: "EMP-0056",
    name: "Rina Kusuma",
    dept: "HR",
    basic: 5800000,
    allowance: 600000,
    overtime: 0,
    deduction: 650000,
    net: 5750000,
    status: "draft",
  },
];

const ATTEND_STATUS: any = {
  present: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", label: "Hadir" },
  late: { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", label: "Telat" },
  leave: { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", label: "Cuti" },
  absent: { bg: "rgba(239,68,68,0.12)", text: "#f87171", label: "Absen" },
};

const LEAVE_STATUS: any = {
  pending: { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", label: "Menunggu" },
  approved: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", label: "Disetujui" },
  rejected: { bg: "rgba(239,68,68,0.12)", text: "#f87171", label: "Ditolak" },
};

const PAY_STATUS: any = {
  draft: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Draft" },
  paid: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", label: "Dibayar" },
};

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

function Badge({ cfg }: any) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 10px",
        borderRadius: 20,
        background: cfg.bg,
        color: cfg.text,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}
function Th({ children, right, center }: any) {
  return (
    <th
      style={{
        fontSize: 10,
        color: "#334155",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        fontWeight: 600,
        padding: "9px 14px",
        textAlign: right ? "right" : center ? "center" : "left",
        borderBottom: "1px solid #1e2130",
        background: "#0f1117",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}
function Td({ children, mono, muted, right, center, bold }: any) {
  return (
    <td
      style={{
        fontSize: 13,
        padding: "11px 14px",
        borderBottom: "1px solid #1a1d2a",
        textAlign: right ? "right" : center ? "center" : "left",
        color: bold
          ? "#f1f5f9"
          : mono
            ? "#60a5fa"
            : muted
              ? "#475569"
              : "#94a3b8",
        fontFamily: mono ? "monospace" : "inherit",
        fontWeight: bold ? 700 : 400,
      }}
    >
      {children}
    </td>
  );
}

function Avatar({
  name,
  size = 28,
  colors = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"],
}: any) {
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg,${colors[idx]},${colors[(idx + 2) % colors.length]})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 700,
        color: "white",
        flexShrink: 0,
      }}
    >
      {name[0]}
    </div>
  );
}

// ─── Employee Form Modal ───────────────────────────────────────
function EmployeeModal({ onClose }: any) {
  const inputSt = {
    width: "100%",
    padding: "7px 10px",
    background: "#0f1117",
    border: "1px solid #1e2130",
    borderRadius: 7,
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelSt = {
    fontSize: 11,
    color: "#475569",
    marginBottom: 4,
    display: "block",
    fontWeight: 500,
  };
  const G2 = ({ children }: any) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
  const F = ({
    label,
    type = "text",
    placeholder = "",
    select = false,
    options = [],
  }: any) => (
    <div>
      <label style={labelSt}>{label}</label>
      {select ? (
        <select style={{ ...inputSt, cursor: "pointer" }}>
          {options.map((o: any) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} style={inputSt} />
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#13151e",
          border: "1px solid #1e2130",
          borderRadius: 16,
          width: 580,
          maxHeight: "92vh",
          overflow: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid #1e2130",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
              Tambah Karyawan
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              NIK akan dibuat otomatis
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #1e2130",
              color: "#475569",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          style={{
            padding: "18px 22px",
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Section: Data Pribadi */}
          <div
            style={{
              fontSize: 11,
              color: "#3b82f6",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Data Pribadi
          </div>
          <G2>
            <F label="Nama Lengkap *" placeholder="Nama sesuai KTP" />
            <F
              label="Jenis Kelamin"
              select
              options={["Laki-laki", "Perempuan"]}
            />
          </G2>
          <G2>
            <F label="Tanggal Lahir" type="date" />
            <F label="No. KTP *" placeholder="16 digit NIK KTP" />
          </G2>
          <F label="Alamat" placeholder="Alamat lengkap" />

          {/* Section: Data Kerja */}
          <div
            style={{
              fontSize: 11,
              color: "#3b82f6",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginTop: 4,
            }}
          >
            Data Kerja
          </div>
          <G2>
            <F label="Departemen *" select options={DEPARTMENTS.slice(1)} />
            <F label="Jabatan *" placeholder="cth. Operator Mesin" />
          </G2>
          <G2>
            <F label="Tanggal Bergabung *" type="date" />
            <F
              label="Status Karyawan"
              select
              options={["Tetap", "Kontrak", "Magang"]}
            />
          </G2>

          {/* Section: Gaji */}
          <div
            style={{
              fontSize: 11,
              color: "#3b82f6",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginTop: 4,
            }}
          >
            Komponen Gaji
          </div>
          <G2>
            <F label="Gaji Pokok *" type="number" placeholder="0" />
            <F label="Tunjangan Tetap" type="number" placeholder="0" />
          </G2>
          <G2>
            <F label="No. Rekening" placeholder="Nomor rekening bank" />
            <F
              label="Nama Bank"
              select
              options={["BCA", "BNI", "BRI", "Mandiri", "BSI", "CIMB"]}
            />
          </G2>
        </div>

        <div
          style={{
            padding: "14px 22px 18px",
            borderTop: "1px solid #1e2130",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid #1e2130",
              color: "#64748b",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Batal
          </button>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              background: "#3b82f6",
              border: "none",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                "0 0 0 1px rgba(59,130,246,0.4),0 4px 12px rgba(59,130,246,0.25)",
            }}
          >
            Simpan Karyawan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function HRPage() {
  const [tab, setTab] = useState("employees");
  const [search, setSearch] = useState("");
  const [deptF, setDeptF] = useState("Semua");
  const [showModal, setModal] = useState(false);
  const [selEmp, setSelEmp] = useState(null);

  const filteredEmps = useMemo(
    () =>
      EMPLOYEES.filter(
        (e) =>
          (deptF === "Semua" || e.dept === deptF) &&
          (e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.nik.toLowerCase().includes(search.toLowerCase()) ||
            e.position.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, deptF],
  );

  const filteredAttend = useMemo(
    () =>
      ATTENDANCE_TODAY.filter(
        (a) =>
          (deptF === "Semua" || a.dept === deptF) &&
          a.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, deptF],
  );

  const filteredLeave = useMemo(
    () =>
      LEAVE_REQUESTS.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const filteredPayroll = useMemo(
    () =>
      PAYROLL_ITEMS.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.nik.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const presentCount = ATTENDANCE_TODAY.filter(
    (a) => a.status === "present" || a.status === "late",
  ).length;
  const absentCount = ATTENDANCE_TODAY.filter(
    (a) => a.status === "absent",
  ).length;
  const leaveCount = ATTENDANCE_TODAY.filter(
    (a) => a.status === "leave",
  ).length;
  const pendingLeave = LEAVE_REQUESTS.filter(
    (l) => l.status === "pending",
  ).length;

  const S = {
    fontFamily: "'DM Sans','IBM Plex Sans',sans-serif",
    background: "#0f1117",
    minHeight: "100vh",
    color: "#e2e8f0",
    padding: 24,
  };
  const tabBtn = (key: any, label: any, dot = false) => (
    <button
      onClick={() => setTab(key)}
      style={{
        padding: "7px 16px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: tab === key ? 600 : 400,
        cursor: "pointer",
        position: "relative",
        background: tab === key ? "rgba(59,130,246,0.12)" : "transparent",
        color: tab === key ? "#60a5fa" : "#475569",
        border:
          tab === key
            ? "1px solid rgba(59,130,246,0.25)"
            : "1px solid transparent",
        transition: "all 0.15s",
      }}
    >
      {label}
      {dot && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ef4444",
          }}
        />
      )}
    </button>
  );

  return (
    <div style={S}>
      {showModal && <EmployeeModal onClose={() => setModal(false)} />}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            HR
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0" }}>
            Karyawan, absensi, cuti, dan penggajian
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {tab === "payroll" && (
            <button
              style={{
                padding: "8px 16px",
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: 8,
                color: "#34d399",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Proses Gaji Bulan Ini
            </button>
          )}
          {tab === "employees" && (
            <button
              onClick={() => setModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                background: "#3b82f6",
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow:
                  "0 0 0 1px rgba(59,130,246,0.4),0 4px 12px rgba(59,130,246,0.25)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Karyawan
            </button>
          )}
        </div>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Total Karyawan",
            value:
              EMPLOYEES.filter((e) => e.status === "active").length + " orang",
            color: "#3b82f6",
          },
          {
            label: "Hadir Hari Ini",
            value: presentCount + " orang",
            color: "#10b981",
          },
          {
            label: "Absen Hari Ini",
            value: absentCount + " orang",
            color: absentCount > 0 ? "#ef4444" : "#10b981",
          },
          {
            label: "Sedang Cuti",
            value: leaveCount + " orang",
            color: "#8b5cf6",
          },
          {
            label: "Pengajuan Cuti",
            value: pendingLeave + " pending",
            color: pendingLeave > 0 ? "#f59e0b" : "#10b981",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              background: "#13151e",
              border: "1px solid #1e2130",
              borderRadius: 10,
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#475569",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
              }}
            >
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div
        style={{
          background: "#13151e",
          border: "1px solid #1e2130",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #1e2130",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {tabBtn("employees", "Karyawan")}
            {tabBtn("attendance", "Absensi")}
            {tabBtn("leave", "Cuti", pendingLeave > 0)}
            {tabBtn("payroll", "Penggajian")}
          </div>
          <div style={{ flex: 1 }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#0f1117",
              border: "1px solid #1e2130",
              borderRadius: 8,
              padding: "6px 12px",
              width: 200,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#334155"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIK..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e2e8f0",
                fontSize: 13,
                flex: 1,
              }}
            />
          </div>

          {(tab === "employees" || tab === "attendance") && (
            <select
              value={deptF}
              onChange={(e) => setDeptF(e.target.value)}
              style={{
                background: "#0f1117",
                border: "1px solid #1e2130",
                borderRadius: 8,
                color: "#64748b",
                fontSize: 13,
                padding: "6px 12px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          )}

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: "transparent",
              border: "1px solid #1e2130",
              borderRadius: 8,
              color: "#475569",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>

        {/* ── TAB: Karyawan ── */}
        {tab === "employees" && !selEmp && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>NIK</Th>
                  <Th>Nama</Th>
                  <Th>Departemen</Th>
                  <Th>Jabatan</Th>
                  <Th>Bergabung</Th>
                  <Th right>Gaji Pokok</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredEmps.map((emp: any) => (
                  <tr
                    key={emp.id}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                        fontSize: 11,
                        color: "#475569",
                        fontFamily: "monospace",
                      }}
                    >
                      {emp.nik}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Avatar name={emp.name} />
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#e2e8f0",
                          }}
                        >
                          {emp.name}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "rgba(59,130,246,0.08)",
                          color: "#60a5fa",
                        }}
                      >
                        {emp.dept}
                      </span>
                    </td>
                    <Td muted>{emp.position}</Td>
                    <Td muted>{emp.joinDate}</Td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f1f5f9",
                        }}
                      >
                        {rp(emp.salary)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 10,
                          background:
                            emp.status === "active"
                              ? "rgba(34,197,94,0.1)"
                              : "rgba(71,85,105,0.2)",
                          color:
                            emp.status === "active" ? "#4ade80" : "#64748b",
                        }}
                      >
                        {emp.status === "active" ? "Aktif" : "Resign"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          onClick={() => setSelEmp(emp)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: "transparent",
                            border: "1px solid #1e2130",
                            color: "#475569",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          Detail
                        </button>
                        <button
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: "transparent",
                            border: "1px solid #1e2130",
                            color: "#475569",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Employee Detail */}
        {tab === "employees" && selEmp && (
          <div>
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #1e2130",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() => setSelEmp(null)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  background: "transparent",
                  border: "1px solid #1e2130",
                  color: "#475569",
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Kembali
              </button>
              <Avatar name={selEmp.name} size={36} />
              <div>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}
                >
                  {selEmp.name}
                </div>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  {selEmp.nik} · {selEmp.position} · {selEmp.dept}
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "20px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
              }}
            >
              {[
                { label: "Tanggal Bergabung", value: selEmp.joinDate },
                {
                  label: "Status",
                  value: selEmp.status === "active" ? "Aktif" : "Resign",
                },
                {
                  label: "Jenis Kelamin",
                  value: selEmp.gender === "M" ? "Laki-laki" : "Perempuan",
                },
                { label: "Gaji Pokok", value: rp(selEmp.salary) },
                { label: "Departemen", value: selEmp.dept },
                { label: "Jabatan", value: selEmp.position },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0f1117",
                    border: "1px solid #1e2130",
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}
                  >
                    {f.label}
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}
                  >
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: Absensi ── */}
        {tab === "attendance" && (
          <div>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #1e2130",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "#475569" }}>
                Hari ini, Kamis 12 Maret 2026
              </span>
              <div style={{ flex: 1 }} />
              {Object.entries(ATTEND_STATUS).map(([key, s]) => (
                <div
                  key={key}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: s.text,
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#475569" }}>
                    {s.label}:{" "}
                    {ATTENDANCE_TODAY.filter((a) => a.status === key).length}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th>Nama</Th>
                    <Th>Departemen</Th>
                    <Th center>Check In</Th>
                    <Th center>Check Out</Th>
                    <Th center>Jam Kerja</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttend.map((a, i) => {
                    const hours =
                      a.checkIn && a.checkOut
                        ? `${parseInt(a.checkOut) - parseInt(a.checkIn)} jam`
                        : a.checkIn
                          ? "Sedang bekerja"
                          : "—";
                    return (
                      <tr
                        key={i}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.02)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Avatar name={a.name} size={26} />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#e2e8f0",
                              }}
                            >
                              {a.name}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              padding: "2px 8px",
                              borderRadius: 6,
                              background: "rgba(59,130,246,0.08)",
                              color: "#60a5fa",
                            }}
                          >
                            {a.dept}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontFamily: "monospace",
                              color:
                                a.status === "late"
                                  ? "#fbbf24"
                                  : a.checkIn
                                    ? "#4ade80"
                                    : "#334155",
                            }}
                          >
                            {a.checkIn || "—"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontFamily: "monospace",
                              color: a.checkOut ? "#94a3b8" : "#334155",
                            }}
                          >
                            {a.checkOut || "—"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "center",
                            fontSize: 12,
                            color: "#475569",
                          }}
                        >
                          {hours}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                          }}
                        >
                          <Badge cfg={ATTEND_STATUS[a.status]} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: Cuti ── */}
        {tab === "leave" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Karyawan</Th>
                  <Th>Tipe Cuti</Th>
                  <Th>Periode</Th>
                  <Th center>Hari</Th>
                  <Th>Catatan</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredLeave.map((l, i) => (
                  <tr
                    key={i}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Avatar name={l.name} size={26} />
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: "#e2e8f0",
                            }}
                          >
                            {l.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#475569" }}>
                            {l.dept}
                          </div>
                        </div>
                      </div>
                    </td>
                    <Td muted>{l.type}</Td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                        fontSize: 13,
                        color: "#94a3b8",
                      }}
                    >
                      {l.start === l.end ? l.start : `${l.start} – ${l.end}`}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f1f5f9",
                        }}
                      >
                        {l.days}
                      </span>
                    </td>
                    <Td muted>{l.note}</Td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <Badge cfg={LEAVE_STATUS[l.status]} />
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      {l.status === "pending" && (
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: "rgba(34,197,94,0.1)",
                              border: "1px solid rgba(34,197,94,0.2)",
                              color: "#4ade80",
                              fontSize: 11,
                              cursor: "pointer",
                            }}
                          >
                            ✓ Setujui
                          </button>
                          <button
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: "rgba(239,68,68,0.08)",
                              border: "1px solid rgba(239,68,68,0.2)",
                              color: "#f87171",
                              fontSize: 11,
                              cursor: "pointer",
                            }}
                          >
                            ✕ Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB: Penggajian ── */}
        {tab === "payroll" && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
            {/* Payroll month list */}
            <div style={{ borderRight: "1px solid #1e2130" }}>
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid #1e2130",
                  fontSize: 11,
                  color: "#334155",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Riwayat Penggajian
              </div>
              {PAYROLL_MONTHS.map((pm, i) => (
                <div
                  key={i}
                  style={{
                    padding: "13px 14px",
                    borderBottom: "1px solid #1a1d2a",
                    cursor: "pointer",
                    background:
                      i === 0 ? "rgba(59,130,246,0.05)" : "transparent",
                    borderLeft:
                      i === 0 ? "3px solid #3b82f6" : "3px solid transparent",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#e2e8f0",
                      }}
                    >
                      {pm.month}
                    </span>
                    <Badge
                      cfg={
                        pm.status === "paid"
                          ? {
                              bg: "rgba(34,197,94,0.1)",
                              text: "#4ade80",
                              label: "Lunas",
                            }
                          : {
                              bg: "rgba(71,85,105,0.25)",
                              text: "#94a3b8",
                              label: "Draft",
                            }
                      }
                    />
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {pm.headcount} karyawan
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#f1f5f9",
                      marginTop: 4,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {rp(pm.total)}
                  </div>
                </div>
              ))}
            </div>

            {/* Payroll detail */}
            <div>
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #1e2130",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}
                  >
                    Maret 2026
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
                    Draft · 214 karyawan · Total Rp 485jt
                  </div>
                </div>
                <button
                  style={{
                    padding: "6px 14px",
                    borderRadius: 7,
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "#34d399",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Proses & Bayar Semua
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <Th>NIK</Th>
                      <Th>Nama</Th>
                      <Th>Dept</Th>
                      <Th right>Gaji Pokok</Th>
                      <Th right>Tunjangan</Th>
                      <Th right>Lembur</Th>
                      <Th right>Potongan</Th>
                      <Th right>Take Home</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayroll.map((p, i) => (
                      <tr
                        key={i}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.02)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            fontSize: 11,
                            color: "#475569",
                            fontFamily: "monospace",
                          }}
                        >
                          {p.nik}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Avatar name={p.name} size={24} />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#e2e8f0",
                              }}
                            >
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              padding: "2px 7px",
                              borderRadius: 5,
                              background: "rgba(59,130,246,0.08)",
                              color: "#60a5fa",
                            }}
                          >
                            {p.dept}
                          </span>
                        </td>
                        <Td right>{rp(p.basic)}</Td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "right",
                            fontSize: 13,
                            color: "#4ade80",
                          }}
                        >
                          {rp(p.allowance)}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "right",
                            fontSize: 13,
                            color: p.overtime > 0 ? "#60a5fa" : "#334155",
                          }}
                        >
                          {p.overtime > 0 ? rp(p.overtime) : "—"}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "right",
                            fontSize: 13,
                            color: "#f87171",
                          }}
                        >
                          ({rp(p.deduction)})
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "right",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#f1f5f9",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {rp(p.net)}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            borderBottom: "1px solid #1a1d2a",
                          }}
                        >
                          <Badge cfg={PAY_STATUS[p.status]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Summary */}
              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid #1e2130",
                  display: "flex",
                  gap: 24,
                }}
              >
                {[
                  [
                    "Total Gaji Pokok",
                    filteredPayroll.reduce((a, p) => a + p.basic, 0),
                  ],
                  [
                    "Total Tunjangan",
                    filteredPayroll.reduce((a, p) => a + p.allowance, 0),
                  ],
                  [
                    "Total Lembur",
                    filteredPayroll.reduce((a, p) => a + p.overtime, 0),
                  ],
                  [
                    "Total Potongan",
                    filteredPayroll.reduce((a, p) => a + p.deduction, 0),
                  ],
                  [
                    "Total Take Home",
                    filteredPayroll.reduce((a, p) => a + p.net, 0),
                  ],
                ].map(([label, val], i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#334155",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 2,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color:
                          i === 3 ? "#f87171" : i === 4 ? "#4ade80" : "#94a3b8",
                      }}
                    >
                      {rp(val)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {tab !== "payroll" && (
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #1e2130",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: "#334155" }}>
              Menampilkan{" "}
              {tab === "employees"
                ? filteredEmps.length
                : tab === "attendance"
                  ? filteredAttend.length
                  : filteredLeave.length}{" "}
              data
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {["←", "1", "2", "3", "→"].map((p, i) => (
                <button
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background:
                      p === "1" ? "rgba(59,130,246,0.15)" : "transparent",
                    border: `1px solid ${p === "1" ? "rgba(59,130,246,0.3)" : "#1e2130"}`,
                    color: p === "1" ? "#60a5fa" : "#475569",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
