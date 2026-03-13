"use client";
import { useState, useMemo } from "react";

// ─── Helpers ───────────────────────────────────────────────────
const rp = (n: any) => "Rp " + Math.round(n).toLocaleString("id-ID");
const rpM = (n: any) => "Rp " + (n / 1e6).toFixed(1) + "jt";

// ─── Chart Components ──────────────────────────────────────────
function BarChart({ data, color = "#3b82f6", height = 120 }: any) {
  const max = Math.max(...data.map((d: any) => d.value), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height,
        padding: "0 4px",
      }}
    >
      {data.map((d: any, i: any) => {
        const h = Math.round((d.value / max) * (height - 24));
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{ fontSize: 9, color: "#334155", whiteSpace: "nowrap" }}
            >
              {d.value >= 1e6 ? rpM(d.value) : d.value.toLocaleString()}
            </span>
            <div
              style={{
                width: "100%",
                height: h,
                background: `${color}25`,
                borderRadius: "3px 3px 0 0",
                position: "relative",
                overflow: "hidden",
                minHeight: 3,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "100%",
                  background: color,
                  borderRadius: "3px 3px 0 0",
                  opacity: 0.85,
                }}
              />
            </div>
            <span
              style={{ fontSize: 9, color: "#334155", whiteSpace: "nowrap" }}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ datasets, height = 100, showDots = true }: any) {
  const w = 300,
    h = height;
  const allVals = datasets.flatMap((d: any) => d.data.map((p: any) => p.value));
  const max = Math.max(...allVals, 1);
  const min = 0;
  const range = max - min || 1;
  const n = datasets[0].data.length;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        {datasets.map((ds: any) => (
          <linearGradient
            key={ds.color}
            id={`lg-${ds.color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={ds.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={0}
          y1={h - f * (h - 8) - 4}
          x2={w}
          y2={h - f * (h - 8) - 4}
          stroke="#1e2130"
          strokeWidth="1"
          strokeDasharray="3,4"
        />
      ))}
      {datasets.map((ds: any) => {
        const pts = ds.data.map((d: any, i: any) => ({
          x: (i / (n - 1)) * w,
          y: h - ((d.value - min) / range) * (h - 8) - 4,
        }));
        const polyline = pts.map((p: any) => `${p.x},${p.y}`).join(" ");
        const area = `0,${h} ` + polyline + ` ${w},${h}`;
        return (
          <g key={ds.color}>
            <polygon
              points={area}
              fill={`url(#lg-${ds.color.replace("#", "")})`}
            />
            <polyline
              points={polyline}
              fill="none"
              stroke={ds.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {showDots &&
              pts.map((p: any, i: any) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={i === n - 1 ? 3 : 2}
                  fill={ds.color}
                  opacity={i === n - 1 ? 1 : 0.5}
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments, size = 80 }: any) {
  const total = segments.reduce((a: any, s: any) => a + s.value, 0);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#1e2130"
        strokeWidth="10"
      />
      {segments.map((s: any, i: any) => {
        const dash = (s.value / total) * circ;
        const el = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ─── Data ──────────────────────────────────────────────────────
const MONTHS_6 = ["Okt", "Nov", "Des", "Jan", "Feb", "Mar"];

const SALES_MONTHLY = [
  { label: "Okt", value: 185e6 },
  { label: "Nov", value: 220e6 },
  { label: "Des", value: 195e6 },
  { label: "Jan", value: 240e6 },
  { label: "Feb", value: 210e6 },
  { label: "Mar", value: 268e6 },
];
const PURCHASE_MONTHLY = [
  { label: "Okt", value: 88e6 },
  { label: "Nov", value: 105e6 },
  { label: "Des", value: 91e6 },
  { label: "Jan", value: 112e6 },
  { label: "Feb", value: 98e6 },
  { label: "Mar", value: 85e6 },
];
const PRODUCTION_MONTHLY = [
  { label: "Okt", value: 3800 },
  { label: "Nov", value: 4100 },
  { label: "Des", value: 3600 },
  { label: "Jan", value: 4300 },
  { label: "Feb", value: 4050 },
  { label: "Mar", value: 4920 },
];

const TOP_PRODUCTS = [
  { name: "Bracket Stainless A2", revenue: 98e6, qty: 530, growth: 18 },
  { name: "Housing Aluminium B1", revenue: 74e6, qty: 231, growth: -5 },
  { name: "Cover Plate 3mm", revenue: 49e6, qty: 516, growth: 32 },
  { name: "Shaft Ø25 Grade A", revenue: 47e6, qty: 224, growth: 8 },
];

const TOP_CUSTOMERS = [
  { name: "PT Maju Bersama", total: 185e6, orders: 8, paid: 185e6 },
  { name: "PT Sinar Harapan", total: 142e6, orders: 5, paid: 142e6 },
  { name: "PT Teknindo Jaya", total: 98e6, orders: 6, paid: 55e6 },
  { name: "CV Karya Mandiri", total: 67e6, orders: 9, paid: 67e6 },
  { name: "UD Sejahtera", total: 38e6, orders: 4, paid: 31e6 },
];

const PROFIT_DATA = MONTHS_6.map((label, i) => ({
  label,
  sales: SALES_MONTHLY[i].value,
  purchase: PURCHASE_MONTHLY[i].value,
  profit: SALES_MONTHLY[i].value - PURCHASE_MONTHLY[i].value - 40e6,
}));

const PROD_BY_TYPE = [
  { label: "Bracket SS", value: 2100, color: "#3b82f6" },
  { label: "Housing Al", value: 924, color: "#8b5cf6" },
  { label: "Cover Plate", value: 1296, color: "#10b981" },
  { label: "Shaft Ø25", value: 600, color: "#f59e0b" },
];

const REJECT_MONTHLY = [
  { label: "Okt", value: 28 },
  { label: "Nov", value: 35 },
  { label: "Des", value: 22 },
  { label: "Jan", value: 41 },
  { label: "Feb", value: 19 },
  { label: "Mar", value: 25 },
];

const AR_AGING = [
  { label: "0–30 hari", value: 148e6, color: "#4ade80", pct: 49 },
  { label: "31–60 hari", value: 87e6, color: "#f59e0b", pct: 29 },
  { label: ">60 hari", value: 66e6, color: "#ef4444", pct: 22 },
];

const HR_STATS = [
  { label: "Hadir", value: 192, color: "#4ade80" },
  { label: "Cuti", value: 14, color: "#3b82f6" },
  { label: "Sakit", value: 5, color: "#f59e0b" },
  { label: "Absen", value: 3, color: "#ef4444" },
];

const REPORTS = [
  {
    id: "sales_summary",
    label: "Laporan Penjualan",
    icon: "📊",
    color: "#3b82f6",
    desc: "Omset, invoice, piutang per periode",
  },
  {
    id: "purchase_sum",
    label: "Laporan Pembelian",
    icon: "🛒",
    color: "#8b5cf6",
    desc: "PO, penerimaan, hutang per supplier",
  },
  {
    id: "inventory_val",
    label: "Laporan Stok & Valuasi",
    icon: "📦",
    color: "#10b981",
    desc: "Nilai stok, pergerakan, stok opname",
  },
  {
    id: "production_sum",
    label: "Laporan Produksi",
    icon: "⚙",
    color: "#f59e0b",
    desc: "Work order, output, reject rate per mesin",
  },
  {
    id: "ar_aging",
    label: "Laporan Piutang (AR)",
    icon: "💰",
    color: "#06b6d4",
    desc: "Aging piutang, status pembayaran pelanggan",
  },
  {
    id: "ap_aging",
    label: "Laporan Hutang (AP)",
    icon: "🏦",
    color: "#ec4899",
    desc: "Aging hutang, jadwal pembayaran supplier",
  },
  {
    id: "hr_attendance",
    label: "Laporan Kehadiran",
    icon: "👥",
    color: "#a78bfa",
    desc: "Rekap absensi, lembur, cuti per departemen",
  },
  {
    id: "payroll_recap",
    label: "Rekap Penggajian",
    icon: "💳",
    color: "#34d399",
    desc: "Gaji, tunjangan, potongan, PPh 21 per periode",
  },
  {
    id: "profit_loss",
    label: "Laba Rugi Sederhana",
    icon: "📈",
    color: "#fb923c",
    desc: "Estimasi laba berdasarkan penjualan vs pembelian",
  },
];

// ─── KPI Card ──────────────────────────────────────────────────
function KPI({ label, value, sub, color, growth }: any) {
  return (
    <div
      style={{
        background: "#13151e",
        border: "1px solid #1e2130",
        borderRadius: 10,
        padding: "14px 16px",
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
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#f1f5f9",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {(sub || growth !== undefined) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 6,
          }}
        >
          {growth !== undefined && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke={growth >= 0 ? "#4ade80" : "#f87171"}
              strokeWidth="2.5"
            >
              {growth >= 0 ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
          )}
          <span
            style={{
              fontSize: 11,
              color:
                growth !== undefined
                  ? growth >= 0
                    ? "#4ade80"
                    : "#f87171"
                  : "#475569",
            }}
          >
            {growth !== undefined ? `${Math.abs(growth)}% vs bulan lalu` : sub}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function ReportsPage() {
  const [section, setSection] = useState("overview"); // overview | sales | production | hr | generate
  const [period, setPeriod] = useState("6months");
  const [genModal, setGenModal] = useState(null);

  const totalSales = SALES_MONTHLY.reduce((a, d) => a + d.value, 0);
  const totalPurchase = PURCHASE_MONTHLY.reduce((a, d) => a + d.value, 0);
  const totalProfit = PROFIT_DATA.reduce((a, d) => a + d.profit, 0);
  const totalProd = PRODUCTION_MONTHLY.reduce((a, d) => a + d.value, 0);
  const totalAR = AR_AGING.reduce((a, d) => a + d.value, 0);

  const S = {
    fontFamily: "'DM Sans','IBM Plex Sans',sans-serif",
    background: "#0f1117",
    minHeight: "100vh",
    color: "#e2e8f0",
    padding: 24,
  };

  const navBtn = (key: any, label: any) => (
    <button
      onClick={() => setSection(key)}
      style={{
        padding: "7px 16px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: section === key ? 600 : 400,
        cursor: "pointer",
        background: section === key ? "rgba(59,130,246,0.12)" : "transparent",
        color: section === key ? "#60a5fa" : "#475569",
        border:
          section === key
            ? "1px solid rgba(59,130,246,0.25)"
            : "1px solid transparent",
      }}
    >
      {label}
    </button>
  );

  const card = (children: any, style = {}) => (
    <div
      style={{
        background: "#13151e",
        border: "1px solid #1e2130",
        borderRadius: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );

  const cardHeader: any = (title: any, sub: any, action: any) => (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid #1e2130",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  );

  // ── Generate Report Modal ──
  const GenModal = ({ report, onClose }: any) => (
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
          width: 460,
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid #1e2130",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
              Generate Laporan
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              {report.label}
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
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[
            ["Periode Dari", "date"],
            ["Periode Sampai", "date"],
          ].map(([label, type], i) => (
            <div key={i}>
              <label
                style={{
                  fontSize: 11,
                  color: "#475569",
                  marginBottom: 4,
                  display: "block",
                  fontWeight: 500,
                }}
              >
                {label}
              </label>
              <input
                type={type}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  background: "#0f1117",
                  border: "1px solid #1e2130",
                  borderRadius: 7,
                  color: "#e2e8f0",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
          <div>
            <label
              style={{
                fontSize: 11,
                color: "#475569",
                marginBottom: 4,
                display: "block",
                fontWeight: 500,
              }}
            >
              Format Output
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["PDF", "Excel", "CSV"].map((f) => (
                <label
                  key={f}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "8px",
                    background: "#0f1117",
                    border: "1px solid #1e2130",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#94a3b8",
                  }}
                >
                  <input
                    type="radio"
                    name="format"
                    defaultChecked={f === "PDF"}
                    style={{ accentColor: "#3b82f6" }}
                  />{" "}
                  {f}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "12px 22px 18px",
            borderTop: "1px solid #1e2130",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
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
            Download Laporan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S}>
      {genModal && (
        <GenModal report={genModal} onClose={() => setGenModal(null)} />
      )}

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
            Reports
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0" }}>
            Dashboard analitik dan generate laporan per modul
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              background: "#13151e",
              border: "1px solid #1e2130",
              borderRadius: 8,
              color: "#64748b",
              fontSize: 13,
              padding: "7px 12px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="3months">3 Bulan Terakhir</option>
            <option value="6months">6 Bulan Terakhir</option>
            <option value="ytd">Year-to-Date</option>
          </select>
          <button
            onClick={() => setSection("generate")}
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
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Generate Laporan
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {navBtn("overview", "Overview")}
        {navBtn("sales", "Sales & Finance")}
        {navBtn("production", "Produksi")}
        {navBtn("hr", "HR")}
        {navBtn("generate", "Laporan")}
      </div>

      {/* ── OVERVIEW ── */}
      {section === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Top KPIs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 12,
            }}
          >
            <KPI
              label="Total Penjualan 6 Bln"
              value={rpM(totalSales)}
              growth={14}
            />
            <KPI
              label="Total Pembelian 6 Bln"
              value={rpM(totalPurchase)}
              growth={-3}
            />
            <KPI
              label="Estimasi Laba Kotor"
              value={rpM(totalProfit)}
              growth={22}
            />
            <KPI
              label="Total Produksi 6 Bln"
              value={totalProd.toLocaleString() + " pcs"}
              growth={8}
            />
            <KPI
              label="Total Piutang"
              value={rpM(totalAR)}
              sub={`${AR_AGING.filter((a) => a.label.includes(">")).length} overdue`}
            />
          </div>

          {/* Row 2: Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
            }}
          >
            {/* Sales vs Purchase */}
            {card(
              <>
                {cardHeader("Penjualan vs Pembelian", "6 bulan terakhir")}
                <div style={{ padding: "16px 16px 10px" }}>
                  <LineChart
                    datasets={[
                      {
                        color: "#3b82f6",
                        data: SALES_MONTHLY.map((d) => ({ value: d.value })),
                      },
                      {
                        color: "#f59e0b",
                        data: PURCHASE_MONTHLY.map((d) => ({ value: d.value })),
                      },
                    ]}
                    height={90}
                  />
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    {[
                      { color: "#3b82f6", label: "Penjualan" },
                      { color: "#f59e0b", label: "Pembelian" },
                    ].map((l) => (
                      <div
                        key={l.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: l.color,
                          }}
                        />
                        <span style={{ fontSize: 11, color: "#475569" }}>
                          {l.label}
                        </span>
                      </div>
                    ))}
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 10, color: "#334155" }}>
                      {MONTHS_6[0]} – {MONTHS_6[MONTHS_6.length - 1]}
                    </span>
                  </div>
                </div>
              </>,
            )}

            {/* Laba per bulan */}
            {card(
              <>
                {cardHeader(
                  "Estimasi Laba Kotor",
                  "Penjualan – Pembelian – Biaya Operasional",
                )}
                <div style={{ padding: "16px 16px 10px" }}>
                  <BarChart
                    data={PROFIT_DATA.map((d) => ({
                      label: d.label,
                      value: d.profit,
                    }))}
                    color="#10b981"
                    height={110}
                  />
                </div>
              </>,
            )}

            {/* AR Aging donut */}
            {card(
              <>
                {cardHeader("Aging Piutang", "Total " + rpM(totalAR))}
                <div style={{ padding: "16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 20 }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <DonutChart segments={AR_AGING} size={90} />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#f1f5f9",
                            lineHeight: 1,
                          }}
                        >
                          {AR_AGING.reduce((a, d) => a + d.pct, 0)}%
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {AR_AGING.map((a, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 2,
                                background: a.color,
                              }}
                            />
                            <span style={{ fontSize: 12, color: "#64748b" }}>
                              {a.label}
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: a.color,
                              }}
                            >
                              {a.pct}%
                            </div>
                            <div style={{ fontSize: 10, color: "#334155" }}>
                              {rpM(a.value)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>,
            )}
          </div>

          {/* Row 3: Top Products + Customers */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {card(
              <>
                {cardHeader("Top Produk — Mar 2026", "Berdasarkan revenue")}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Produk", "Revenue", "Qty", "Growth"].map((h, i) => (
                          <th
                            key={i}
                            style={{
                              fontSize: 10,
                              color: "#334155",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              fontWeight: 600,
                              padding: "8px 14px",
                              textAlign: i > 0 ? "right" : "left",
                              borderBottom: "1px solid #1e2130",
                              background: "#0f1117",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_PRODUCTS.map((p, i) => (
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
                              padding: "10px 14px",
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
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#334155",
                                  width: 16,
                                }}
                              >
                                #{i + 1}
                              </span>
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
                              padding: "10px 14px",
                              borderBottom: "1px solid #1a1d2a",
                              textAlign: "right",
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#f1f5f9",
                            }}
                          >
                            {rpM(p.revenue)}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "1px solid #1a1d2a",
                              textAlign: "right",
                              fontSize: 13,
                              color: "#475569",
                            }}
                          >
                            {p.qty.toLocaleString()} pcs
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "1px solid #1a1d2a",
                              textAlign: "right",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: p.growth >= 0 ? "#4ade80" : "#f87171",
                              }}
                            >
                              {p.growth >= 0 ? "+" : ""}
                              {p.growth}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>,
            )}

            {card(
              <>
                {cardHeader(
                  "Top Pelanggan — Mar 2026",
                  "Berdasarkan total transaksi",
                )}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Pelanggan", "Total", "Order", "Piutang"].map(
                          (h, i) => (
                            <th
                              key={i}
                              style={{
                                fontSize: 10,
                                color: "#334155",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                fontWeight: 600,
                                padding: "8px 14px",
                                textAlign: i > 0 ? "right" : "left",
                                borderBottom: "1px solid #1e2130",
                                background: "#0f1117",
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_CUSTOMERS.map((c, i) => (
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
                              padding: "10px 14px",
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
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#334155",
                                  width: 16,
                                }}
                              >
                                #{i + 1}
                              </span>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: "#e2e8f0",
                                }}
                              >
                                {c.name}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "1px solid #1a1d2a",
                              textAlign: "right",
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#f1f5f9",
                            }}
                          >
                            {rpM(c.total)}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "1px solid #1a1d2a",
                              textAlign: "right",
                              fontSize: 13,
                              color: "#475569",
                            }}
                          >
                            {c.orders}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "1px solid #1a1d2a",
                              textAlign: "right",
                            }}
                          >
                            {c.total > c.paid ? (
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#f87171",
                                }}
                              >
                                {rpM(c.total - c.paid)}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, color: "#4ade80" }}>
                                ✓ Lunas
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>,
            )}
          </div>
        </div>
      )}

      {/* ── SALES & FINANCE ── */}
      {section === "sales" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            <KPI label="Penjualan Mar" value={rpM(268e6)} growth={14} />
            <KPI label="Pembelian Mar" value={rpM(85e6)} growth={-3} />
            <KPI label="Laba Kotor Mar" value={rpM(143e6)} growth={28} />
            <KPI
              label="Piutang Overdue"
              value={rpM(66e6)}
              sub="Lebih dari 60 hari"
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}
          >
            {card(
              <>
                {cardHeader(
                  "Tren Penjualan vs Pembelian vs Laba",
                  "6 bulan terakhir · dalam jutaan Rp",
                )}
                <div style={{ padding: "16px 20px 12px" }}>
                  <LineChart
                    datasets={[
                      {
                        color: "#3b82f6",
                        data: SALES_MONTHLY.map((d) => ({ value: d.value })),
                      },
                      {
                        color: "#f59e0b",
                        data: PURCHASE_MONTHLY.map((d) => ({ value: d.value })),
                      },
                      {
                        color: "#4ade80",
                        data: PROFIT_DATA.map((d) => ({ value: d.profit })),
                      },
                    ]}
                    height={120}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 18,
                      marginTop: 8,
                    }}
                  >
                    {[
                      { c: "#3b82f6", l: "Penjualan" },
                      { c: "#f59e0b", l: "Pembelian" },
                      { c: "#4ade80", l: "Laba" },
                    ].map((x) => (
                      <div
                        key={x.l}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 3,
                            borderRadius: 2,
                            background: x.c,
                          }}
                        />
                        <span style={{ fontSize: 11, color: "#475569" }}>
                          {x.l}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    {MONTHS_6.map((m, i) => (
                      <div key={m} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "#334155" }}>{m}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>,
            )}
            {card(
              <>
                {cardHeader("Aging Piutang")}
                <div style={{ padding: "16px" }}>
                  {AR_AGING.map((a, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          {a.label}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: a.color,
                          }}
                        >
                          {rpM(a.value)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: "#1e2130",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${a.pct}%`,
                            background: a.color,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      borderTop: "1px solid #1e2130",
                      paddingTop: 12,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      Total Piutang
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#f1f5f9",
                      }}
                    >
                      {rpM(totalAR)}
                    </span>
                  </div>
                </div>
              </>,
            )}
          </div>
        </div>
      )}

      {/* ── PRODUKSI ── */}
      {section === "production" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            <KPI label="Produksi Mar" value="4.920 pcs" growth={8} />
            <KPI
              label="Total Reject Mar"
              value="25 pcs"
              sub="0.51% reject rate"
            />
            <KPI label="WO Selesai" value="18 WO" growth={20} />
            <KPI label="Utilisasi Mesin" value="68%" sub="Avg 6 work center" />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {card(
              <>
                {cardHeader("Volume Produksi", "6 bulan terakhir · dalam pcs")}
                <div style={{ padding: "16px 20px 10px" }}>
                  <BarChart
                    data={PRODUCTION_MONTHLY}
                    color="#8b5cf6"
                    height={120}
                  />
                </div>
              </>,
            )}
            {card(
              <>
                {cardHeader("Reject per Bulan", "Jumlah pcs reject")}
                <div style={{ padding: "16px 20px 10px" }}>
                  <BarChart
                    data={REJECT_MONTHLY}
                    color="#ef4444"
                    height={120}
                  />
                </div>
              </>,
            )}
          </div>
          {card(
            <>
              {cardHeader("Output per Produk — Mar 2026")}
              <div style={{ padding: "16px 20px" }}>
                {PROD_BY_TYPE.map((p, i) => {
                  const totalPcs = PROD_BY_TYPE.reduce(
                    (a, x) => a + x.value,
                    0,
                  );
                  const pct = Math.round((p.value / totalPcs) * 100);
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 14,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: "#94a3b8",
                          width: 140,
                          flexShrink: 0,
                        }}
                      >
                        {p.label}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: "#1e2130",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: p.color,
                            borderRadius: 3,
                            boxShadow: `0 0 6px ${p.color}40`,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f1f5f9",
                          width: 60,
                          textAlign: "right",
                        }}
                      >
                        {p.value.toLocaleString()}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#475569",
                          width: 32,
                          textAlign: "right",
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>,
          )}
        </div>
      )}

      {/* ── HR ── */}
      {section === "hr" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            <KPI
              label="Total Karyawan Aktif"
              value="214 orang"
              sub="6 resign YTD"
            />
            <KPI
              label="Kehadiran Hari Ini"
              value="192 / 214"
              sub="89.7% attendance"
            />
            <KPI label="Total Gaji Mar" value="Rp 485jt" growth={1} />
            <KPI
              label="Pengajuan Cuti"
              value="5 pending"
              sub="3 disetujui bulan ini"
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {card(
              <>
                {cardHeader("Status Kehadiran Hari Ini")}
                <div style={{ padding: "16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 20 }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <DonutChart
                        segments={HR_STATS.map((s) => ({
                          value: s.value,
                          color: s.color,
                        }))}
                        size={90}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#f1f5f9",
                            lineHeight: 1,
                          }}
                        >
                          214
                        </span>
                        <span style={{ fontSize: 9, color: "#475569" }}>
                          total
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {HR_STATS.map((s, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 2,
                                background: s.color,
                              }}
                            />
                            <span style={{ fontSize: 12, color: "#64748b" }}>
                              {s.label}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: s.color,
                            }}
                          >
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>,
            )}
            {card(
              <>
                {cardHeader("Karyawan per Departemen")}
                <div style={{ padding: "14px 16px" }}>
                  {[
                    { dept: "Produksi", count: 85, color: "#3b82f6" },
                    { dept: "Gudang", count: 32, color: "#8b5cf6" },
                    { dept: "Sales", count: 18, color: "#10b981" },
                    { dept: "Purchasing", count: 12, color: "#f59e0b" },
                    { dept: "Finance", count: 10, color: "#06b6d4" },
                    { dept: "HR", count: 8, color: "#ec4899" },
                    { dept: "Management", count: 5, color: "#a78bfa" },
                    { dept: "Lainnya", count: 44, color: "#475569" },
                  ].map((d, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 9,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          width: 80,
                          flexShrink: 0,
                        }}
                      >
                        {d.dept}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 5,
                          background: "#1e2130",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(d.count / 85) * 100}%`,
                            background: d.color,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#94a3b8",
                          width: 28,
                          textAlign: "right",
                        }}
                      >
                        {d.count}
                      </span>
                    </div>
                  ))}
                </div>
              </>,
            )}
          </div>
        </div>
      )}

      {/* ── GENERATE LAPORAN ── */}
      {section === "generate" && (
        <div>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 16 }}>
            Pilih jenis laporan, atur periode, dan download dalam format PDF
            atau Excel.
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            {REPORTS.map((r: any) => (
              <div
                key={r.id}
                style={{
                  background: "#13151e",
                  border: "1px solid #1e2130",
                  borderRadius: 12,
                  padding: "16px 18px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${r.color}40`;
                  e.currentTarget.style.background = "#161820";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e2130";
                  e.currentTarget.style.background = "#13151e";
                }}
                onClick={() => setGenModal(r)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${r.color}18`,
                      border: `1px solid ${r.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {r.icon}
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}
                  >
                    {r.label}
                  </div>
                </div>
                <div
                  style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}
                >
                  {r.desc}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {["PDF", "Excel"].map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: 5,
                        background: `${r.color}12`,
                        color: r.color,
                        border: `1px solid ${r.color}20`,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
