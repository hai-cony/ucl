"use client";
import { useState, useEffect } from "react";

// ── Sparkline mini chart ──────────────────────────────────────
function Sparkline({ data, color, height = 36 }: any) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80,
    h = height;
  const points = data
    .map((v: any, i: any) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${h} ` + points + ` ${w},${h}`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={`g-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#g-${color.replace("#", "")})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {(() => {
        const last = points.split(" ").pop().split(",");
        return <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}

// ── Radial progress ───────────────────────────────────────────
function RadialProgress({ value, max, color, size = 56 }: any) {
  const pct = value / max;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
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
        strokeWidth="4"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

// ── Bar chart (horizontal) ─────────────────────────────────────
function MiniBarChart({ data }: any) {
  const max: any = Math.max(...data.map((d: any) => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d: any, i: any) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 11,
              color: "#475569",
              width: 80,
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            {d.label}
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
                borderRadius: 3,
                background: d.color,
                width: `${(d.value / max) * 100}%`,
                transition: "width 1s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </div>
          <span
            style={{ fontSize: 11, color: "#64748b", width: 40, flexShrink: 0 }}
          >
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Area chart (sales trend) ──────────────────────────────────
function AreaChart({ data, color = "#3b82f6" }: any) {
  const w = 300,
    h = 80;
  const max = Math.max(...data.map((d: any) => d.v));
  const min = 0;
  const range = max - min || 1;
  const pts = data.map((d: any, i: any) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.v - min) / range) * (h - 8) - 4;
    return { x, y, label: d.label };
  });
  const polyPts = pts.map((p: any) => `${p.x},${p.y}`).join(" ");
  const areaPts = `0,${h} ` + polyPts + ` ${w},${h}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
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
      <polygon points={areaPts} fill="url(#area-grad)" />
      <polyline
        points={polyPts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p: any, i: any) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill={color}
          opacity={i === pts.length - 1 ? 1 : 0.4}
        />
      ))}
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────
const salesTrend = [
  { v: 185, label: "Okt" },
  { v: 220, label: "Nov" },
  { v: 195, label: "Des" },
  { v: 240, label: "Jan" },
  { v: 210, label: "Feb" },
  { v: 268, label: "Mar" },
];
const productionTrend = [
  420, 380, 460, 390, 440, 475, 420, 490, 510, 480, 520, 495,
];
const purchaseTrend = [80, 95, 72, 88, 105, 91, 112, 98, 85, 110, 93, 107];

const KPI_CARDS = [
  {
    title: "Omset Bulan Ini",
    value: "Rp 2,68M",
    sub: "+14.2% vs bulan lalu",
    positive: true,
    color: "#3b82f6",
    sparkData: [185, 220, 195, 240, 210, 268, 240, 268],
  },
  {
    title: "Total Produksi",
    value: "4.920 pcs",
    sub: "+8.6% vs bulan lalu",
    positive: true,
    color: "#8b5cf6",
    sparkData: [420, 380, 460, 390, 440, 475, 460, 490],
  },
  {
    title: "Nilai Pembelian",
    value: "Rp 847jt",
    sub: "-3.1% vs bulan lalu",
    positive: false,
    color: "#f59e0b",
    sparkData: [110, 95, 105, 88, 112, 98, 103, 98],
  },
  {
    title: "Karyawan Aktif",
    value: "214 / 220",
    sub: "6 sedang cuti",
    positive: null,
    color: "#10b981",
    sparkData: [218, 216, 220, 215, 214, 218, 212, 214],
  },
];

const ALERTS = [
  {
    type: "danger",
    icon: "⬇",
    label: "Stok Kritis",
    detail: "Aluminium Sheet 2mm — 12 kg (min 50 kg)",
    action: "Buat PO",
    module: "Inventory",
  },
  {
    type: "warning",
    icon: "⏰",
    label: "Invoice Jatuh Tempo",
    detail: "INV/2026/03/0015 – PT Maju Bersama — Rp 48.5jt",
    action: "Lihat",
    module: "Sales",
  },
  {
    type: "warning",
    icon: "⚙",
    label: "Mesin Maintenance",
    detail: "Work Center: Mesin Press A — jadwal hari ini",
    action: "Detail",
    module: "Production",
  },
  {
    type: "info",
    icon: "📦",
    label: "PO Menunggu Konfirmasi",
    detail: "3 Purchase Order belum disetujui manager",
    action: "Review",
    module: "Purchasing",
  },
];

const WORK_ORDERS = [
  {
    no: "WO/2026/03/0031",
    product: "Bracket Stainless",
    qty: 500,
    done: 380,
    status: "in_progress",
  },
  {
    no: "WO/2026/03/0030",
    product: "Housing Aluminium",
    qty: 200,
    done: 200,
    status: "completed",
  },
  {
    no: "WO/2026/03/0029",
    product: "Cover Plate 3mm",
    qty: 800,
    done: 120,
    status: "in_progress",
  },
  {
    no: "WO/2026/03/0028",
    product: "Shaft Ø25",
    qty: 150,
    done: 0,
    status: "released",
  },
];

const ACTIVITIES = [
  {
    time: "09:41",
    user: "Sari",
    color: "#0ea5e9",
    action: "mengkonfirmasi penerimaan barang",
    ref: "GR/2026/03/0041",
    module: "Purchasing",
  },
  {
    time: "09:15",
    user: "Budi",
    color: "#8b5cf6",
    action: "membuat Work Order baru",
    ref: "WO/2026/03/0031",
    module: "Production",
  },
  {
    time: "08:52",
    user: "Dewi",
    color: "#10b981",
    action: "mengirim invoice ke pelanggan",
    ref: "INV/2026/03/0018",
    module: "Sales",
  },
  {
    time: "08:30",
    user: "Anton",
    color: "#f59e0b",
    action: "menyetujui Purchase Order",
    ref: "PO/2026/03/0022",
    module: "Purchasing",
  },
  {
    time: "08:05",
    user: "Rina",
    color: "#ef4444",
    action: "mencatat karyawan absen",
    ref: "3 karyawan",
    module: "HR",
  },
];

const SALES_BY_PRODUCT: any = [
  { label: "Bracket SS", value: 87, color: "#3b82f6" },
  { label: "Housing Al", value: 64, color: "#8b5cf6" },
  { label: "Cover Plate", value: 52, color: "#10b981" },
  { label: "Shaft Ø25", value: 39, color: "#f59e0b" },
  { label: "Lainnya", value: 26, color: "#475569" },
];

const STATUS_COLORS: any = {
  in_progress: {
    bg: "rgba(59,130,246,0.12)",
    text: "#60a5fa",
    label: "Proses",
  },
  completed: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", label: "Selesai" },
  released: {
    bg: "rgba(245,158,11,0.12)",
    text: "#fbbf24",
    label: "Siap Mulai",
  },
  draft: { bg: "rgba(71,85,105,0.2)", text: "#94a3b8", label: "Draft" },
};

const ALERT_COLORS: any = {
  danger: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    dot: "#ef4444",
    text: "#f87171",
  },
  warning: {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
    dot: "#f59e0b",
    text: "#fbbf24",
  },
  info: {
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.18)",
    dot: "#3b82f6",
    text: "#60a5fa",
  },
};

// ── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

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

  return (
    <div
      style={{
        background: "#0f1117",
        padding: "24px",
        fontFamily: "'DM Sans', 'IBM Plex Sans', sans-serif",
        color: "#e2e8f0",
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Dashboard
            </h1>
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 10,
                background: "rgba(16,185,129,0.12)",
                color: "#34d399",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              LIVE
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>
            Kamis, 12 Maret 2026 · Update terakhir 09:41
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Hari Ini", "7 Hari", "Bulan Ini"].map((t, i) => (
            <button
              key={t}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                background: i === 2 ? "rgba(59,130,246,0.15)" : "transparent",
                color: i === 2 ? "#60a5fa" : "#475569",
                border:
                  i === 2
                    ? "1px solid rgba(59,130,246,0.3)"
                    : "1px solid #1e2130",
                transition: "all 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {KPI_CARDS.map((kpi, i) => (
          <div
            key={i}
            style={{
              background: "#13151e",
              border: "1px solid #1e2130",
              borderRadius: 12,
              padding: "16px 18px",
              opacity: animated ? 1 : 0,
              transform: animated ? "none" : "translateY(8px)",
              transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  color: "#475569",
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {kpi.title}
              </span>
              <Sparkline data={kpi.sparkData} color={kpi.color} height={28} />
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#f1f5f9",
                lineHeight: 1,
              }}
            >
              {kpi.value}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 6,
              }}
            >
              {kpi.positive !== null && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={kpi.positive ? "#4ade80" : "#f87171"}
                  strokeWidth="2.5"
                >
                  {kpi.positive ? (
                    <polyline points="18 15 12 9 6 15" />
                  ) : (
                    <polyline points="6 9 12 15 18 9" />
                  )}
                </svg>
              )}
              <span
                style={{
                  fontSize: 11.5,
                  color:
                    kpi.positive === true
                      ? "#4ade80"
                      : kpi.positive === false
                        ? "#f87171"
                        : "#64748b",
                  fontWeight: 500,
                }}
              >
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alert Bar ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {ALERTS.map((a, i) => {
          const c: any = ALERT_COLORS[a.type];
          return (
            <div
              key={i}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 10,
                padding: "11px 14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                opacity: animated ? 1 : 0,
                transition: `opacity 0.4s ease ${0.3 + i * 0.06}s`,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: c.dot,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: c.text }}
                  >
                    {a.label}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "#334155",
                      background: "#1a1d2a",
                      padding: "1px 6px",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  >
                    {a.module}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    margin: 0,
                    lineHeight: 1.4,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {a.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Charts ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Sales Trend */}
        {card(
          <>
            <div
              style={{
                padding: "16px 18px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#94a3b8",
                    marginBottom: 2,
                  }}
                >
                  Tren Penjualan
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#f1f5f9",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Rp 268jt
                </div>
                <div style={{ fontSize: 11, color: "#4ade80", marginTop: 2 }}>
                  ▲ 27.6% vs Okt
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ fontSize: 10, color: "#334155", marginBottom: 4 }}
                >
                  6 bulan terakhir
                </div>
              </div>
            </div>
            <div style={{ padding: "0 18px 16px" }}>
              <AreaChart data={salesTrend} color="#3b82f6" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                {salesTrend.map((d, i) => (
                  <span key={i} style={{ fontSize: 10, color: "#334155" }}>
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          </>,
        )}

        {/* Work Order Status */}
        {card(
          <>
            <div
              style={{
                padding: "16px 18px 14px",
                borderBottom: "1px solid #1e2130",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 12,
                }}
              >
                Work Order Aktif
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                }}
              >
                {[
                  { label: "Proses", count: 7, color: "#3b82f6" },
                  { label: "Selesai", count: 18, color: "#4ade80" },
                  { label: "Siap Mulai", count: 4, color: "#f59e0b" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <RadialProgress
                        value={s.count}
                        max={25}
                        color={s.color}
                        size={52}
                      />
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#f1f5f9",
                        }}
                      >
                        {s.count}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 10.5, color: "#475569", marginTop: 4 }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 18px" }}>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 8 }}>
                TOP PRODUK BULAN INI
              </div>
              <MiniBarChart data={SALES_BY_PRODUCT} />
            </div>
          </>,
        )}

        {/* HR Snapshot */}
        {card(
          <>
            <div
              style={{
                padding: "16px 18px 12px",
                borderBottom: "1px solid #1e2130",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: 12,
                }}
              >
                Kehadiran Hari Ini
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ position: "relative" }}>
                  <RadialProgress
                    value={192}
                    max={214}
                    color="#10b981"
                    size={64}
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
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#f1f5f9",
                        lineHeight: 1,
                      }}
                    >
                      192
                    </span>
                    <span style={{ fontSize: 9, color: "#475569" }}>hadir</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    { label: "Hadir", count: 192, color: "#10b981" },
                    { label: "Cuti", count: 14, color: "#3b82f6" },
                    { label: "Sakit", count: 5, color: "#f59e0b" },
                    { label: "Absen", count: 3, color: "#ef4444" },
                  ].map((r, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 5,
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
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: r.color,
                          }}
                        />
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          {r.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#94a3b8",
                        }}
                      >
                        {r.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: "12px 18px" }}>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 8 }}>
                PENGAJUAN CUTI PENDING
              </div>
              {[
                { name: "Ahmad Fauzi", dept: "Produksi", days: "14–16 Mar" },
                { name: "Siti Rahma", dept: "Gudang", days: "18 Mar" },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "white",
                        background: `linear-gradient(135deg, ${["#0ea5e9", "#8b5cf6"][i]}, ${["#6366f1", "#ec4899"][i]})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {c.name[0]}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          fontWeight: 500,
                        }}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#334155" }}>
                        {c.dept} · {c.days}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.2)",
                        color: "#4ade80",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      ✓
                    </button>
                    <button
                      style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>,
        )}
      </div>

      {/* ── Row 3: WO Table + Activity Feed ── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14 }}
      >
        {/* Work Order Table */}
        {card(
          <>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid #1e2130",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Work Order — Progress Hari Ini
              </span>
              <button
                style={{
                  fontSize: 11,
                  color: "#3b82f6",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Lihat Semua →
              </button>
            </div>
            <div>
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 90px 120px 80px",
                  padding: "8px 18px",
                  gap: 8,
                }}
              >
                {["Nomor WO", "Produk", "Qty", "Progress", "Status"].map(
                  (h, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 10,
                        color: "#334155",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </span>
                  ),
                )}
              </div>
              {WORK_ORDERS.map((wo, i) => {
                const pct = Math.round((wo.done / wo.qty) * 100);
                const s = STATUS_COLORS[wo.status];
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1fr 90px 120px 80px",
                      padding: "11px 18px",
                      gap: 8,
                      borderTop: "1px solid #1a1d2a",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#60a5fa",
                        fontFamily: "monospace",
                      }}
                    >
                      {wo.no}
                    </span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      {wo.product}
                    </span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      {wo.done}/{wo.qty}
                    </span>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 10, color: "#475569" }}>
                          {pct}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "#1e2130",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 2,
                            width: `${pct}%`,
                            background:
                              pct === 100
                                ? "#4ade80"
                                : pct > 50
                                  ? "#3b82f6"
                                  : "#f59e0b",
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: s.bg,
                        color: s.text,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>,
        )}

        {/* Activity Feed */}
        {card(
          <>
            <div
              style={{
                padding: "14px 16px 10px",
                borderBottom: "1px solid #1e2130",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                Aktivitas Terkini
              </span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {ACTIVITIES.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "10px 16px",
                    position: "relative",
                  }}
                >
                  {/* Timeline line */}
                  {i < ACTIVITIES.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 28,
                        top: 38,
                        width: 1,
                        height: "calc(100% - 10px)",
                        background: "#1e2130",
                      }}
                    />
                  )}
                  {/* Avatar */}
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: `${a.color}22`,
                      border: `1px solid ${a.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: a.color,
                    }}
                  >
                    {a.user[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                        {a.user}
                      </span>{" "}
                      {a.action}{" "}
                      <span
                        style={{
                          color: "#60a5fa",
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        {a.ref}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                      <span style={{ fontSize: 10, color: "#334155" }}>
                        {a.time}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: "#252836",
                          background: "#1a1d2a",
                          padding: "0 5px",
                          borderRadius: 3,
                        }}
                      >
                        {a.module}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "8px 16px 12px",
                borderTop: "1px solid #1e2130",
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "7px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid #1e2130",
                  borderRadius: 7,
                  color: "#475569",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Lihat semua aktivitas
              </button>
            </div>
          </>,
        )}
      </div>
    </div>
  );
}
