"use client";
import { useState, useMemo } from "react";

// ─── Data ──────────────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agt",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const TODAY_WEEK = 11; // minggu ke-11 di tahun 2026

const PLANS = [
  {
    id: 1,
    no: "PP/2026/03/0008",
    period: "Mar 2026",
    status: "confirmed",
    totalWO: 12,
    completedWO: 7,
    targetQty: 4200,
    plannedQty: 4200,
  },
  {
    id: 2,
    no: "PP/2026/04/0001",
    period: "Apr 2026",
    status: "draft",
    totalWO: 8,
    completedWO: 0,
    targetQty: 3800,
    plannedQty: 3200,
  },
  {
    id: 3,
    no: "PP/2026/02/0007",
    period: "Feb 2026",
    status: "closed",
    totalWO: 10,
    completedWO: 10,
    targetQty: 3500,
    plannedQty: 3600,
  },
];

const PLAN_ITEMS = [
  {
    id: 1,
    planId: 1,
    product: "Bracket Stainless A2",
    targetQty: 1500,
    plannedQty: 1500,
    completedQty: 1100,
    priority: "high",
  },
  {
    id: 2,
    planId: 1,
    product: "Housing Aluminium B1",
    targetQty: 800,
    plannedQty: 800,
    completedQty: 600,
    priority: "normal",
  },
  {
    id: 3,
    planId: 1,
    product: "Cover Plate 3mm",
    targetQty: 1200,
    plannedQty: 1200,
    completedQty: 300,
    priority: "normal",
  },
  {
    id: 4,
    planId: 1,
    product: "Shaft Ø25 Grade A",
    targetQty: 700,
    plannedQty: 700,
    completedQty: 700,
    priority: "urgent",
  },
];

const MRP_RESULTS = [
  {
    sku: "RM-00142",
    material: "Aluminium Sheet 2mm",
    need: 420,
    onHand: 12,
    onOrder: 200,
    shortage: 208,
    unit: "kg",
    suggestPO: true,
  },
  {
    sku: "RM-00089",
    material: "Stainless Rod Ø25",
    need: 85,
    onHand: 48,
    onOrder: 0,
    shortage: 37,
    unit: "m",
    suggestPO: true,
  },
  {
    sku: "RM-00201",
    material: "Carbon Steel Plate 3mm",
    need: 180,
    onHand: 215,
    onOrder: 0,
    shortage: 0,
    unit: "kg",
    suggestPO: false,
  },
  {
    sku: "CS-00012",
    material: "Coolant Metalwork",
    need: 28,
    onHand: 14,
    onOrder: 20,
    shortage: 0,
    unit: "ltr",
    suggestPO: false,
  },
  {
    sku: "CS-00013",
    material: "Cutting Oil Premium",
    need: 12,
    onHand: 0,
    onOrder: 0,
    shortage: 12,
    unit: "ltr",
    suggestPO: true,
  },
];

const CAPACITY_DATA = [
  { wc: "Mesin Press A", capacity: 160, planned: 148, unit: "jam" },
  { wc: "Mesin Press B", capacity: 160, planned: 0, unit: "jam" },
  { wc: "Mesin Bubut CNC", capacity: 160, planned: 160, unit: "jam" },
  { wc: "Mesin Las MIG", capacity: 160, planned: 72, unit: "jam" },
  { wc: "Line Assembly 1", capacity: 160, planned: 140, unit: "jam" },
  { wc: "Line Assembly 2", capacity: 160, planned: 0, unit: "jam" },
];

// Gantt chart data — work orders per week (week 10–13)
const GANTT_ITEMS = [
  {
    id: 1,
    no: "WO/03/0028",
    product: "Shaft Ø25 Grade A",
    wc: "Mesin Bubut CNC",
    startWeek: 11,
    endWeek: 11,
    status: "released",
    color: "#f59e0b",
  },
  {
    id: 2,
    no: "WO/03/0029",
    product: "Cover Plate 3mm",
    wc: "Mesin Bubut CNC",
    startWeek: 11,
    endWeek: 13,
    status: "in_progress",
    color: "#3b82f6",
  },
  {
    id: 3,
    no: "WO/03/0030",
    product: "Housing Aluminium B1",
    wc: "Line Assembly 1",
    startWeek: 10,
    endWeek: 11,
    status: "completed",
    color: "#4ade80",
  },
  {
    id: 4,
    no: "WO/03/0031",
    product: "Bracket Stainless A2",
    wc: "Mesin Press A",
    startWeek: 10,
    endWeek: 12,
    status: "in_progress",
    color: "#3b82f6",
  },
  {
    id: 5,
    no: "WO/03/0032",
    product: "Cover Plate 3mm",
    wc: "Mesin Press A",
    startWeek: 13,
    endWeek: 14,
    status: "draft",
    color: "#475569",
  },
  {
    id: 6,
    no: "WO/03/0033",
    product: "Bracket Stainless A2",
    wc: "Mesin Press B",
    startWeek: 12,
    endWeek: 14,
    status: "draft",
    color: "#475569",
  },
];
const GANTT_WEEKS = [10, 11, 12, 13, 14];
const GANTT_WCS = [...new Set(GANTT_ITEMS.map((g) => g.wc))];

const PLAN_STATUS: any = {
  draft: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Draft" },
  confirmed: {
    bg: "rgba(59,130,246,0.15)",
    text: "#60a5fa",
    label: "Confirmed",
  },
  closed: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "Selesai" },
};

const rp = (n: any) => "Rp " + n.toLocaleString("id-ID");

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
function Td({ children, mono, muted, right, center }: any) {
  return (
    <td
      style={{
        fontSize: 13,
        padding: "11px 14px",
        borderBottom: "1px solid #1a1d2a",
        textAlign: right ? "right" : center ? "center" : "left",
        color: mono ? "#60a5fa" : muted ? "#475569" : "#94a3b8",
        fontFamily: mono ? "monospace" : "inherit",
      }}
    >
      {children}
    </td>
  );
}

// ─── Create Plan Modal ─────────────────────────────────────────
function PlanModal({ onClose }: any) {
  const [period, setPeriod] = useState("2026-04");
  const [items, setItems] = useState([
    { product: "Bracket Stainless A2", qty: 1500, priority: "normal" },
  ]);
  const addItem = () =>
    setItems((i) => [...i, { product: "", qty: 100, priority: "normal" }]);
  const removeItem = (idx: any) =>
    setItems((i) => i.filter((_, j) => j !== idx));
  const setItem = (idx: any, key: any, val: any) =>
    setItems((i) => i.map((it, j) => (j === idx ? { ...it, [key]: val } : it)));

  const PRODUCTS = [
    "Bracket Stainless A2",
    "Housing Aluminium B1",
    "Cover Plate 3mm",
    "Shaft Ø25 Grade A",
  ];
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
          maxHeight: "90vh",
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
              Buat Rencana Produksi
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              Setelah disimpan, MRP akan dihitung otomatis
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
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelSt}>Periode (Bulan) *</label>
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={inputSt}
              />
            </div>
            <div>
              <label style={labelSt}>Berdasarkan</label>
              <select style={{ ...inputSt, cursor: "pointer" }}>
                <option>Sales Order Confirmed</option>
                <option>Target Manual</option>
                <option>SO + Target</option>
              </select>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label style={labelSt}>Target Produksi *</label>
              <button
                onClick={addItem}
                style={{
                  fontSize: 11,
                  color: "#3b82f6",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                + Tambah Produk
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 100px 120px 28px",
                gap: 6,
                marginBottom: 4,
              }}
            >
              {["Produk", "Target Qty", "Prioritas", ""].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    color: "#334155",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 100px 120px 28px",
                  gap: 6,
                  marginBottom: 6,
                  alignItems: "center",
                }}
              >
                <select
                  value={item.product}
                  onChange={(e) => setItem(idx, "product", e.target.value)}
                  style={{
                    padding: "7px 8px",
                    background: "#0f1117",
                    border: "1px solid #1e2130",
                    borderRadius: 7,
                    color: item.product ? "#e2e8f0" : "#475569",
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Pilih produk...</option>
                  {PRODUCTS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => setItem(idx, "qty", Number(e.target.value))}
                  style={{
                    padding: "7px 8px",
                    background: "#0f1117",
                    border: "1px solid #1e2130",
                    borderRadius: 7,
                    color: "#e2e8f0",
                    fontSize: 12,
                    outline: "none",
                    textAlign: "center",
                  }}
                />
                <select
                  value={item.priority}
                  onChange={(e) => setItem(idx, "priority", e.target.value)}
                  style={{
                    padding: "7px 8px",
                    background: "#0f1117",
                    border: "1px solid #1e2130",
                    borderRadius: 7,
                    color: "#e2e8f0",
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <button
                  onClick={() => removeItem(idx)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: "transparent",
                    border: "1px solid #1e2130",
                    color: "#475569",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#60a5fa",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              ℹ Setelah Disimpan
            </div>
            <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
              Sistem akan otomatis:
              <br />
              • Hitung kebutuhan bahan baku (MRP) dari BOM × target qty
              <br />
              • Cek kapasitas mesin vs rencana produksi
              <br />• Generate rekomendasi PO untuk bahan yang kurang
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "14px 22px 18px",
            borderTop: "1px solid #1e2130",
            display: "flex",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <button
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
            Simpan Draft
          </button>
          <div style={{ display: "flex", gap: 8 }}>
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
              Hitung MRP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gantt Chart ───────────────────────────────────────────────
function GanttChart() {
  const WEEK_W = 120;
  const ROW_H = 44;

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 240 + GANTT_WEEKS.length * WEEK_W }}>
        {/* Header weeks */}
        <div style={{ display: "flex", borderBottom: "1px solid #1e2130" }}>
          <div
            style={{
              width: 220,
              flexShrink: 0,
              padding: "8px 14px",
              fontSize: 10,
              color: "#334155",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              background: "#0f1117",
            }}
          >
            Work Center
          </div>
          {GANTT_WEEKS.map((w) => (
            <div
              key={w}
              style={{
                width: WEEK_W,
                flexShrink: 0,
                padding: "8px 0",
                textAlign: "center",
                fontSize: 11,
                color: w === TODAY_WEEK ? "#60a5fa" : "#334155",
                fontWeight: w === TODAY_WEEK ? 700 : 400,
                background: "#0f1117",
                borderLeft: "1px solid #1e2130",
                position: "relative",
              }}
            >
              W{w}
              {w === TODAY_WEEK && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 1,
                    height: 4,
                    background: "#3b82f6",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Rows per WC */}
        {GANTT_WCS.map((wc, wcIdx) => {
          const items = GANTT_ITEMS.filter((g) => g.wc === wc);
          return (
            <div
              key={wc}
              style={{
                display: "flex",
                borderBottom: "1px solid #1a1d2a",
                minHeight: ROW_H,
                alignItems: "center",
                background:
                  wcIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.005)",
              }}
            >
              <div
                style={{
                  width: 220,
                  flexShrink: 0,
                  padding: "8px 14px",
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                {wc}
              </div>
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: ROW_H,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Today line */}
                {(() => {
                  const todayIdx = GANTT_WEEKS.indexOf(TODAY_WEEK);
                  if (todayIdx < 0) return null;
                  return (
                    <div
                      style={{
                        position: "absolute",
                        left: todayIdx * WEEK_W + WEEK_W / 2,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        background: "rgba(59,130,246,0.3)",
                        zIndex: 0,
                      }}
                    />
                  );
                })()}

                {/* Bars */}
                {GANTT_WEEKS.map((w, i) => {
                  const bar = items.find((g) => g.startWeek === w);
                  if (!bar)
                    return (
                      <div
                        key={w}
                        style={{
                          width: WEEK_W,
                          flexShrink: 0,
                          borderLeft: "1px solid #1a1d2a",
                          height: "100%",
                        }}
                      />
                    );
                  const span = bar.endWeek - bar.startWeek + 1;
                  return (
                    <div
                      key={w}
                      style={{
                        width: WEEK_W,
                        flexShrink: 0,
                        borderLeft: "1px solid #1a1d2a",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <div
                        title={`${bar.no} — ${bar.product}`}
                        style={{
                          position: "absolute",
                          left: 6,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: span * WEEK_W - 12,
                          height: 26,
                          borderRadius: 6,
                          background: `${bar.color}20`,
                          border: `1px solid ${bar.color}50`,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 8,
                          gap: 6,
                          cursor: "pointer",
                          zIndex: 1,
                          transition: "filter 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.filter = "brightness(1.2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.filter = "brightness(1)")
                        }
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: bar.color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: span * WEEK_W - 40,
                          }}
                        >
                          {bar.no}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function PlannerPage() {
  const [tab, setTab] = useState("plans");
  const [selPlan, setSelPlan] = useState(PLANS[0]);
  const [showModal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [runMRP, setRunMRP] = useState(false);

  const S = {
    fontFamily: "'DM Sans','IBM Plex Sans',sans-serif",
    background: "#0f1117",
    minHeight: "100vh",
    color: "#e2e8f0",
    padding: 24,
  };
  const tabBtn = (key: any, label: any) => (
    <button
      onClick={() => setTab(key)}
      style={{
        padding: "7px 16px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: tab === key ? 600 : 400,
        cursor: "pointer",
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
    </button>
  );

  const mrpShortages = MRP_RESULTS.filter((m) => m.shortage > 0).length;

  return (
    <div style={S}>
      {showModal && <PlanModal onClose={() => setModal(false)} />}

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
            Planner
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0" }}>
            Rencana produksi, MRP, kapasitas mesin, dan Gantt chart
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setRunMRP(!runMRP)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: runMRP ? "rgba(139,92,246,0.15)" : "transparent",
              border: runMRP
                ? "1px solid rgba(139,92,246,0.3)"
                : "1px solid #1e2130",
              borderRadius: 8,
              color: runMRP ? "#a78bfa" : "#64748b",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
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
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.82" />
            </svg>
            {runMRP ? "MRP Dijalankan" : "Jalankan MRP"}
          </button>
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
            Make To Stock
          </button>
        </div>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Rencana Aktif",
            value: "Mar 2026",
            sub: "12 WO planned",
            color: "#3b82f6",
          },
          {
            label: "Progress Bulan Ini",
            value: "58%",
            sub: "7 dari 12 WO selesai",
            color: "#8b5cf6",
          },
          {
            label: "Kekurangan Bahan",
            value: mrpShortages + " item",
            sub: "Perlu PO segera",
            color: mrpShortages > 0 ? "#ef4444" : "#10b981",
          },
          {
            label: "Utilisasi Mesin",
            value: "68%",
            sub: "Mesin Bubut CNC 100% terpakai",
            color: "#f59e0b",
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
                fontSize: 22,
                fontWeight: 800,
                color:
                  k.label === "Kekurangan Bahan" && mrpShortages > 0
                    ? "#ef4444"
                    : "#f1f5f9",
                letterSpacing: "-0.03em",
                marginBottom: 4,
              }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: k.color }}>{k.sub}</div>
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
            {tabBtn("plans", "Rencana Produksi")}
            {tabBtn("mrp", "MRP")}
            {tabBtn("capacity", "Kapasitas")}
            {tabBtn("gantt", "Gantt Chart")}
          </div>
          <div style={{ flex: 1 }} />

          {tab !== "gantt" && tab !== "capacity" && (
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
                placeholder="Cari..."
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
          )}
        </div>

        {/* ── TAB: Rencana Produksi ── */}
        {tab === "plans" && (
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr" }}>
            {/* Plan list */}
            <div style={{ borderRight: "1px solid #1e2130" }}>
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelPlan(p)}
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #1a1d2a",
                    cursor: "pointer",
                    background:
                      selPlan?.id === p.id
                        ? "rgba(59,130,246,0.06)"
                        : "transparent",
                    transition: "background 0.1s",
                    borderLeft:
                      selPlan?.id === p.id
                        ? "3px solid #3b82f6"
                        : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selPlan?.id !== p.id)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    if (selPlan?.id !== p.id)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#e2e8f0",
                        }}
                      >
                        {p.period}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#475569",
                          fontFamily: "monospace",
                          marginTop: 2,
                        }}
                      >
                        {p.no}
                      </div>
                    </div>
                    <Badge cfg={PLAN_STATUS[p.status]} />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      WO:{" "}
                      <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                        {p.completedWO}/{p.totalWO}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      Qty:{" "}
                      <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                        {p.plannedQty.toLocaleString()} pcs
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      height: 3,
                      background: "#1e2130",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round((p.completedWO / p.totalWO) * 100)}%`,
                        background:
                          p.status === "closed" ? "#4ade80" : "#3b82f6",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Plan detail */}
            {selPlan && (
              <div>
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
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#f1f5f9",
                      }}
                    >
                      {selPlan.period}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#475569", marginTop: 2 }}
                    >
                      Target: {selPlan.targetQty.toLocaleString()} pcs ·{" "}
                      {selPlan.totalWO} Work Order
                    </div>
                  </div>
                  {selPlan.status === "draft" && (
                    <button
                      style={{
                        padding: "6px 14px",
                        borderRadius: 7,
                        background: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        color: "#60a5fa",
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Konfirmasi Rencana
                    </button>
                  )}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <Th>Produk</Th>
                      <Th center>Target Qty</Th>
                      <Th center>Planned Qty</Th>
                      <Th center>Selesai</Th>
                      <Th>Progress</Th>
                      <Th>Prioritas</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLAN_ITEMS.filter((i) => i.planId === selPlan.id).map(
                      (item, i) => {
                        const pct: any = Math.round(
                          (item.completedQty / item.plannedQty) * 100,
                        );
                        const pr: any = {
                          urgent: { color: "#ef4444" },
                          high: { color: "#f59e0b" },
                          normal: { color: "#475569" },
                        }[item.priority];
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
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#e2e8f0",
                              }}
                            >
                              {item.product}
                            </td>
                            <td
                              style={{
                                padding: "11px 14px",
                                borderBottom: "1px solid #1a1d2a",
                                textAlign: "center",
                                fontSize: 13,
                                color: "#94a3b8",
                              }}
                            >
                              {item.targetQty.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "11px 14px",
                                borderBottom: "1px solid #1a1d2a",
                                textAlign: "center",
                                fontSize: 13,
                                color: "#94a3b8",
                              }}
                            >
                              {item.plannedQty.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "11px 14px",
                                borderBottom: "1px solid #1a1d2a",
                                textAlign: "center",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#f1f5f9",
                              }}
                            >
                              {item.completedQty.toLocaleString()}
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
                                <div
                                  style={{
                                    flex: 1,
                                    height: 4,
                                    background: "#1e2130",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      height: "100%",
                                      width: `${pct}%`,
                                      background:
                                        pct === 100 ? "#4ade80" : "#3b82f6",
                                      borderRadius: 2,
                                    }}
                                  />
                                </div>
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
                                  fontWeight: 700,
                                  color: pr.color,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                {item.priority}
                              </span>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: MRP ── */}
        {tab === "mrp" && (
          <div>
            {/* MRP header info */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #1e2130",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 12, color: "#475569" }}>
                Berdasarkan rencana produksi{" "}
                <span style={{ color: "#60a5fa", fontWeight: 600 }}>
                  Mar 2026
                </span>{" "}
                · Dijalankan 12 Mar 09:00
              </div>
              {mrpShortages > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 10px",
                    borderRadius: 20,
                    background: "rgba(239,68,68,0.12)",
                    color: "#f87171",
                  }}
                >
                  {mrpShortages} kekurangan bahan
                </span>
              )}
              <div style={{ flex: 1 }} />
              <button
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "#60a5fa",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Generate PO Otomatis
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th>SKU</Th>
                    <Th>Material</Th>
                    <Th right>Kebutuhan</Th>
                    <Th right>Stok</Th>
                    <Th right>On Order</Th>
                    <Th right>Kekurangan</Th>
                    <Th>Status</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {MRP_RESULTS.map((m, i) => (
                    <tr
                      key={i}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      style={{
                        background:
                          m.shortage > 0
                            ? "rgba(239,68,68,0.02)"
                            : "transparent",
                      }}
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
                        {m.sku}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#e2e8f0",
                        }}
                      >
                        {m.material}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          textAlign: "right",
                          fontSize: 13,
                          color: "#94a3b8",
                        }}
                      >
                        {m.need} {m.unit}
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
                            fontSize: 13,
                            fontWeight: 600,
                            color:
                              m.onHand === 0
                                ? "#ef4444"
                                : m.onHand < m.need
                                  ? "#f59e0b"
                                  : "#4ade80",
                          }}
                        >
                          {m.onHand} {m.unit}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          textAlign: "right",
                          fontSize: 13,
                          color: "#64748b",
                        }}
                      >
                        {m.onOrder} {m.unit}
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
                            fontWeight: 700,
                            color: m.shortage > 0 ? "#ef4444" : "#4ade80",
                          }}
                        >
                          {m.shortage > 0
                            ? `${m.shortage} ${m.unit}`
                            : "✓ Cukup"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        {m.shortage > 0 ? (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "2px 10px",
                              borderRadius: 20,
                              background: "rgba(239,68,68,0.12)",
                              color: "#f87171",
                            }}
                          >
                            Buat PO
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "2px 10px",
                              borderRadius: 20,
                              background: "rgba(34,197,94,0.1)",
                              color: "#4ade80",
                            }}
                          >
                            OK
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        {m.suggestPO && (
                          <button
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: "rgba(59,130,246,0.1)",
                              border: "1px solid rgba(59,130,246,0.2)",
                              color: "#60a5fa",
                              fontSize: 11,
                              cursor: "pointer",
                            }}
                          >
                            Buat PO
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: Capacity ── */}
        {tab === "capacity" && (
          <div style={{ padding: "20px 20px" }}>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>
              Kapasitas mesin untuk periode{" "}
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>
                Mar 2026
              </span>{" "}
              · 20 hari kerja × 8 jam
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CAPACITY_DATA.map((wc, i) => {
                const pct = Math.round((wc.planned / wc.capacity) * 100);
                const color =
                  pct >= 100 ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#4ade80";
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#e2e8f0",
                        }}
                      >
                        {wc.wc}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span style={{ fontSize: 12, color: "#475569" }}>
                          {wc.planned}/{wc.capacity} {wc.unit}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color,
                            letterSpacing: "-0.02em",
                            width: 44,
                            textAlign: "right",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#1e2130",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(pct, 100)}%`,
                          background: color,
                          borderRadius: 4,
                          boxShadow: `0 0 8px ${color}60`,
                          transition: "width 1s cubic-bezier(.4,0,.2,1)",
                        }}
                      />
                    </div>
                    {pct >= 100 && (
                      <div
                        style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}
                      >
                        ⚠ Kapasitas penuh — pertimbangkan tambahan shift atau
                        outsource
                      </div>
                    )}
                    {pct === 0 && (
                      <div
                        style={{ fontSize: 11, color: "#475569", marginTop: 4 }}
                      >
                        Belum ada WO yang dijadwalkan di mesin ini
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: Gantt ── */}
        {tab === "gantt" && (
          <div>
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #1e2130",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 12, color: "#475569" }}>
                Minggu 10–14, Maret 2026
              </span>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { color: "#4ade80", label: "Selesai" },
                  { color: "#3b82f6", label: "Berjalan" },
                  { color: "#f59e0b", label: "Siap Mulai" },
                  { color: "#475569", label: "Draft" },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: l.color,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#475569" }}>
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 6 }}>
                {["◀", "▶"].map((d, i) => (
                  <button
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: "transparent",
                      border: "1px solid #1e2130",
                      color: "#475569",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <GanttChart />
          </div>
        )}

        {/* Footer */}
        {(tab === "plans" || tab === "mrp") && (
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
              {tab === "plans"
                ? `${PLANS.length} rencana`
                : `${MRP_RESULTS.length} material`}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {["←", "1", "→"].map((p, i) => (
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
