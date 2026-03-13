"use client";
import { useState, useMemo } from "react";

// ─── Data ──────────────────────────────────────────────────────
const WORK_CENTERS = [
  {
    id: 1,
    name: "Mesin Press A",
    type: "press",
    capacity: 8,
    used: 6.5,
    status: "running",
  },
  {
    id: 2,
    name: "Mesin Press B",
    type: "press",
    capacity: 8,
    used: 0,
    status: "maintenance",
  },
  {
    id: 3,
    name: "Mesin Bubut CNC",
    type: "cnc",
    capacity: 8,
    used: 8,
    status: "running",
  },
  {
    id: 4,
    name: "Mesin Las MIG",
    type: "welding",
    capacity: 8,
    used: 3,
    status: "idle",
  },
  {
    id: 5,
    name: "Line Assembly 1",
    type: "assembly",
    capacity: 8,
    used: 7,
    status: "running",
  },
  {
    id: 6,
    name: "Line Assembly 2",
    type: "assembly",
    capacity: 8,
    used: 0,
    status: "idle",
  },
];

const WORK_ORDERS = [
  {
    id: 1,
    no: "WO/2026/03/0031",
    product: "Bracket Stainless A2",
    plannedQty: 500,
    producedQty: 380,
    rejectedQty: 8,
    status: "in_progress",
    wc: "Mesin Press A",
    startDate: "10 Mar",
    endDate: "14 Mar",
    priority: "high",
  },
  {
    id: 2,
    no: "WO/2026/03/0030",
    product: "Housing Aluminium B1",
    plannedQty: 200,
    producedQty: 200,
    rejectedQty: 3,
    status: "completed",
    wc: "Line Assembly 1",
    startDate: "08 Mar",
    endDate: "11 Mar",
    priority: "normal",
  },
  {
    id: 3,
    no: "WO/2026/03/0029",
    product: "Cover Plate 3mm",
    plannedQty: 800,
    producedQty: 120,
    rejectedQty: 2,
    status: "in_progress",
    wc: "Mesin Bubut CNC",
    startDate: "11 Mar",
    endDate: "17 Mar",
    priority: "normal",
  },
  {
    id: 4,
    no: "WO/2026/03/0028",
    product: "Shaft Ø25 Grade A",
    plannedQty: 150,
    producedQty: 0,
    rejectedQty: 0,
    status: "released",
    wc: "Mesin Bubut CNC",
    startDate: "13 Mar",
    endDate: "15 Mar",
    priority: "urgent",
  },
  {
    id: 5,
    no: "WO/2026/03/0027",
    product: "Bracket Stainless A2",
    plannedQty: 300,
    producedQty: 0,
    rejectedQty: 0,
    status: "draft",
    wc: "Mesin Press B",
    startDate: "14 Mar",
    endDate: "18 Mar",
    priority: "normal",
  },
  {
    id: 6,
    no: "WO/2026/03/0026",
    product: "Cover Plate 3mm",
    plannedQty: 400,
    producedQty: 400,
    rejectedQty: 12,
    status: "completed",
    wc: "Mesin Press A",
    startDate: "05 Mar",
    endDate: "09 Mar",
    priority: "normal",
  },
];

const BOM_LIST = [
  {
    id: 1,
    product: "Bracket Stainless A2",
    version: "v1.2",
    components: 4,
    lastUpdate: "01 Mar",
    status: "active",
  },
  {
    id: 2,
    product: "Housing Aluminium B1",
    version: "v2.0",
    components: 6,
    lastUpdate: "15 Feb",
    status: "active",
  },
  {
    id: 3,
    product: "Cover Plate 3mm",
    version: "v1.0",
    components: 3,
    lastUpdate: "20 Jan",
    status: "active",
  },
  {
    id: 4,
    product: "Shaft Ø25 Grade A",
    version: "v1.1",
    components: 2,
    lastUpdate: "10 Feb",
    status: "active",
  },
  {
    id: 5,
    product: "Bracket Legacy",
    version: "v0.9",
    components: 5,
    lastUpdate: "05 Jan",
    status: "inactive",
  },
];

const BOM_DETAIL: any = {
  1: [
    {
      sku: "RM-00089",
      material: "Stainless Rod Ø25",
      qty: 0.5,
      unit: "m",
      available: 48,
    },
    {
      sku: "RM-00201",
      material: "Carbon Steel Plate 3mm",
      qty: 0.2,
      unit: "kg",
      available: 215,
    },
    {
      sku: "CS-00012",
      material: "Coolant Metalwork",
      qty: 0.05,
      unit: "ltr",
      available: 14,
    },
    {
      sku: "CS-00013",
      material: "Cutting Oil Premium",
      qty: 0.02,
      unit: "ltr",
      available: 0,
    },
  ],
};

const PROD_LOGS = [
  {
    time: "09:15",
    wo: "WO/2026/03/0031",
    wc: "Mesin Press A",
    type: "production",
    qty: 50,
    note: "Shift pagi — normal",
  },
  {
    time: "08:45",
    wo: "WO/2026/03/0029",
    wc: "Mesin Bubut CNC",
    type: "production",
    qty: 30,
    note: "",
  },
  {
    time: "08:30",
    wo: "WO/2026/03/0031",
    wc: "Mesin Press A",
    type: "reject",
    qty: 3,
    note: "Dimensi tidak sesuai spec",
  },
  {
    time: "08:00",
    wo: "WO/2026/03/0029",
    wc: "Mesin Bubut CNC",
    type: "production",
    qty: 40,
    note: "Shift pagi",
  },
  {
    time: "07:30",
    wo: "WO/2026/03/0031",
    wc: "Mesin Press A",
    type: "production",
    qty: 60,
    note: "",
  },
];

const WO_STATUS: any = {
  draft: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Draft" },
  released: {
    bg: "rgba(245,158,11,0.15)",
    text: "#fbbf24",
    label: "Siap Mulai",
  },
  in_progress: {
    bg: "rgba(59,130,246,0.15)",
    text: "#60a5fa",
    label: "Proses",
  },
  completed: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "Selesai" },
  cancelled: { bg: "rgba(239,68,68,0.12)", text: "#f87171", label: "Batal" },
};

const WC_STATUS: any = {
  running: { color: "#4ade80", label: "Jalan", dot: true },
  idle: { color: "#94a3b8", label: "Idle", dot: false },
  maintenance: { color: "#f87171", label: "Maintenance", dot: false },
};

const PRIORITY: any = {
  urgent: { color: "#ef4444", label: "Urgent" },
  high: { color: "#f59e0b", label: "High" },
  normal: { color: "#475569", label: "Normal" },
};

const rp = (n) => "Rp " + n.toLocaleString("id-ID");

// ─── Components ───────────────────────────────────────────────
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

// ─── Log Entry Modal ──────────────────────────────────────────
function LogModal({ wo, onClose }: any) {
  const [qty, setQty] = useState("");
  const [reject, setReject] = useState("0");
  const [note, setNote] = useState("");
  const [wc, setWc] = useState(wo?.wc || "");

  const inp = (value: any, onChange: any, type = "text", placeholder = "") => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "8px 10px",
        background: "#0f1117",
        border: "1px solid #1e2130",
        borderRadius: 7,
        color: "#e2e8f0",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
  const label = (text: any) => (
    <label
      style={{
        fontSize: 11,
        color: "#475569",
        marginBottom: 4,
        display: "block",
        fontWeight: 500,
      }}
    >
      {text}
    </label>
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
          width: 480,
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid #1e2130",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
              Catat Produksi
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#60a5fa",
                fontFamily: "monospace",
                marginTop: 3,
              }}
            >
              {wo?.no}
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
            gap: 14,
          }}
        >
          {/* Progress info */}
          <div
            style={{
              background: "#0f1117",
              border: "1px solid #1e2130",
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "#64748b" }}>
                {wo?.product}
              </span>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                {wo?.producedQty}/{wo?.plannedQty} pcs
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
                  width: `${Math.round((wo?.producedQty / wo?.plannedQty) * 100)}%`,
                  background: "#3b82f6",
                  borderRadius: 3,
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
              Sisa: {wo?.plannedQty - wo?.producedQty} pcs
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              {label("Qty Produksi *")}
              {inp(qty, setQty, "number", "0")}
            </div>
            <div>
              {label("Qty Reject")}
              {inp(reject, setReject, "number", "0")}
            </div>
          </div>

          <div>
            {label("Work Center")}
            <select
              value={wc}
              onChange={(e) => setWc(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "#0f1117",
                border: "1px solid #1e2130",
                borderRadius: 7,
                color: "#e2e8f0",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {WORK_CENTERS.filter((w) => w.status !== "maintenance").map(
                (w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            {label("Catatan")}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Catatan shift, kendala mesin, dsb..."
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "#0f1117",
                border: "1px solid #1e2130",
                borderRadius: 7,
                color: "#94a3b8",
                fontSize: 13,
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {Number(reject) > 0 && (
            <div
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 12,
                color: "#f87171",
              }}
            >
              ⚠ {reject} pcs akan dicatat sebagai reject — stok produk jadi
              tidak akan bertambah untuk qty ini.
            </div>
          )}
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
            Simpan Log
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WO Form Modal ────────────────────────────────────────────
function WOModal({ onClose }: any) {
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("100");
  const [wc, setWc] = useState("");
  const [start, setStart] = useState("2026-03-13");
  const [end, setEnd] = useState("");
  const [priority, setPriority] = useState("normal");

  const selectedBom = BOM_LIST.find((b) => b.product === product);
  const bomDetail = selectedBom ? BOM_DETAIL[selectedBom.id] : null;

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
          width: 560,
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
              Buat Work Order
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              Nomor WO dibuat otomatis
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
            gap: 14,
            overflowY: "auto",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelSt}>Produk *</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                style={{
                  ...inputSt,
                  cursor: "pointer",
                  color: product ? "#e2e8f0" : "#475569",
                }}
              >
                <option value="">Pilih produk jadi...</option>
                {BOM_LIST.filter((b) => b.status === "active").map((b) => (
                  <option key={b.id} value={b.product}>
                    {b.product}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelSt}>Qty Rencana *</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                style={inputSt}
              />
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelSt}>Work Center *</label>
              <select
                value={wc}
                onChange={(e) => setWc(e.target.value)}
                style={{
                  ...inputSt,
                  cursor: "pointer",
                  color: wc ? "#e2e8f0" : "#475569",
                }}
              >
                <option value="">Pilih mesin/line...</option>
                {WORK_CENTERS.map((w) => (
                  <option
                    key={w.id}
                    value={w.name}
                    disabled={w.status === "maintenance"}
                  >
                    {w.name} {w.status === "maintenance" ? "(Maintenance)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelSt}>Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ ...inputSt, cursor: "pointer" }}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelSt}>Tanggal Mulai</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                style={inputSt}
              />
            </div>
            <div>
              <label style={labelSt}>Target Selesai *</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                style={inputSt}
              />
            </div>
          </div>

          {/* BOM preview */}
          {bomDetail && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#475569",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Kebutuhan Bahan (per {qty || 1} pcs)
              </div>
              <div
                style={{
                  background: "#0f1117",
                  border: "1px solid #1e2130",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {bomDetail.map((mat: any, i: any) => {
                  const needed = mat.qty * Number(qty || 1);
                  const shortage = mat.available < needed;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        borderBottom:
                          i < bomDetail.length - 1
                            ? "1px solid #1e2130"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#334155",
                            fontFamily: "monospace",
                          }}
                        >
                          {mat.sku}
                        </span>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>
                          {mat.material}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          Butuh:{" "}
                          <strong
                            style={{ color: shortage ? "#f87171" : "#e2e8f0" }}
                          >
                            {needed} {mat.unit}
                          </strong>
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: shortage ? "#f87171" : "#4ade80",
                          }}
                        >
                          Stok: {mat.available} {mat.unit}
                        </span>
                        {shortage && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "1px 7px",
                              borderRadius: 8,
                              background: "rgba(239,68,68,0.12)",
                              color: "#f87171",
                            }}
                          >
                            KURANG
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {bomDetail.some(
                (m: any) => m.available < m.qty * Number(qty || 1),
              ) && (
                <div
                  style={{
                    marginTop: 8,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 12,
                    color: "#f87171",
                  }}
                >
                  ⚠ Bahan baku tidak mencukupi. WO bisa dibuat sebagai Draft,
                  tapi tidak bisa di-release sebelum stok tersedia.
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "14px 22px 18px",
            borderTop: "1px solid #1e2130",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              Release WO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function ProductionPage() {
  const [tab, setTab] = useState("workorders");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("Semua");
  const [showWO, setShowWO] = useState(false);
  const [logWO, setLogWO] = useState(null);
  const [selBom, setSelBom] = useState(null);

  const filteredWOs = useMemo(
    () =>
      WORK_ORDERS.filter(
        (o) =>
          (statusF === "Semua" || o.status === statusF) &&
          (o.no.toLowerCase().includes(search.toLowerCase()) ||
            o.product.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, statusF],
  );

  const filteredBOMs = useMemo(
    () =>
      BOM_LIST.filter((b) =>
        b.product.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const inProgress = WORK_ORDERS.filter(
    (w) => w.status === "in_progress",
  ).length;
  const totalProd = WORK_ORDERS.filter((w) => w.status === "completed").reduce(
    (a, w) => a + w.producedQty,
    0,
  );
  const totalReject = WORK_ORDERS.reduce((a, w) => a + w.rejectedQty, 0);
  const wcRunning = WORK_CENTERS.filter((w) => w.status === "running").length;

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

  return (
    <div style={S}>
      {showWO && <WOModal onClose={() => setShowWO(false)} />}
      {logWO && <LogModal wo={logWO} onClose={() => setLogWO(null)} />}

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
            Production
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0" }}>
            Work Order, Bill of Materials, dan Work Center
          </p>
        </div>
        <button
          onClick={() => setShowWO(true)}
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
          Buat Work Order
        </button>
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
            label: "WO Sedang Berjalan",
            value: inProgress + " WO",
            color: "#3b82f6",
          },
          {
            label: "Produksi Bulan Ini",
            value: totalProd.toLocaleString() + " pcs",
            color: "#8b5cf6",
          },
          {
            label: "Total Reject",
            value: totalReject + " pcs",
            color: totalReject > 20 ? "#ef4444" : "#10b981",
          },
          {
            label: "Mesin Aktif",
            value: `${wcRunning}/${WORK_CENTERS.length} unit`,
            color: "#10b981",
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
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
                marginBottom: 4,
              }}
            >
              {k.value}
            </div>
            <div style={{ height: 3, background: "#1e2130", borderRadius: 2 }}>
              <div
                style={{
                  height: "100%",
                  width: "60%",
                  background: k.color,
                  borderRadius: 2,
                  opacity: 0.6,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Work Center Status Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {WORK_CENTERS.map((wc) => {
          const sc = WC_STATUS[wc.status];
          const pct = Math.round((wc.used / wc.capacity) * 100);
          return (
            <div
              key={wc.id}
              style={{
                background: "#13151e",
                border: `1px solid ${wc.status === "running" ? "rgba(34,197,94,0.2)" : wc.status === "maintenance" ? "rgba(239,68,68,0.2)" : "#1e2130"}`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}
                >
                  {wc.name.length > 14 ? wc.name.slice(0, 14) + "…" : wc.name}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {wc.status === "running" && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4ade80",
                        boxShadow: "0 0 6px #4ade80",
                        display: "inline-block",
                      }}
                    />
                  )}
                  <span
                    style={{ fontSize: 10, color: sc.color, fontWeight: 600 }}
                  >
                    {sc.label}
                  </span>
                </span>
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color:
                    wc.status === "maintenance"
                      ? "#f87171"
                      : wc.status === "idle"
                        ? "#475569"
                        : "#f1f5f9",
                  marginBottom: 5,
                  letterSpacing: "-0.03em",
                }}
              >
                {pct}%
              </div>
              <div
                style={{
                  height: 3,
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
                      pct > 85 ? "#f87171" : pct > 60 ? "#f59e0b" : "#4ade80",
                    borderRadius: 2,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>
                {wc.used}/{wc.capacity} jam
              </div>
            </div>
          );
        })}
      </div>

      {/* Main table card */}
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
            {tabBtn("workorders", "Work Order")}
            {tabBtn("bom", "Bill of Materials")}
            {tabBtn("logs", "Log Produksi")}
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
              width: 220,
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
              placeholder={
                tab === "bom" ? "Cari produk..." : "Cari WO atau produk..."
              }
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

          {tab === "workorders" && (
            <select
              value={statusF}
              onChange={(e) => setStatusF(e.target.value)}
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
              {[
                "Semua",
                "draft",
                "released",
                "in_progress",
                "completed",
                "cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s === "Semua" ? "Semua Status" : WO_STATUS[s]?.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ── TAB: Work Orders ── */}
        {tab === "workorders" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Nomor WO</Th>
                  <Th>Produk</Th>
                  <Th>Work Center</Th>
                  <Th center>Prioritas</Th>
                  <Th>Periode</Th>
                  <Th center>Progress</Th>
                  <Th center>Reject</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredWOs.map((wo: any) => {
                  const pct = Math.round(
                    (wo.producedQty / wo.plannedQty) * 100,
                  );
                  const pr = PRIORITY[wo.priority];
                  return (
                    <tr
                      key={wo.id}
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
                        }}
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
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#e2e8f0",
                          }}
                        >
                          {wo.product}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          fontSize: 13,
                          color: "#64748b",
                        }}
                      >
                        {wo.wc}
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
                            fontSize: 10,
                            fontWeight: 700,
                            color: pr.color,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {wo.priority === "urgent"
                            ? "🔴 "
                            : wo.priority === "high"
                              ? "🟡 "
                              : ""}
                          {pr.label}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          fontSize: 12,
                          color: "#475569",
                        }}
                      >
                        {wo.startDate} – {wo.endDate}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                            minWidth: 100,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#f1f5f9",
                            }}
                          >
                            {wo.producedQty}/{wo.plannedQty}
                          </span>
                          <div
                            style={{
                              width: "100%",
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
                                  pct === 100
                                    ? "#4ade80"
                                    : pct > 50
                                      ? "#3b82f6"
                                      : "#f59e0b",
                                borderRadius: 2,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 10, color: "#475569" }}>
                            {pct}%
                          </span>
                        </div>
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
                            fontWeight: 600,
                            color: wo.rejectedQty > 0 ? "#f87171" : "#475569",
                          }}
                        >
                          {wo.rejectedQty}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <Badge cfg={WO_STATUS[wo.status]} />
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <div style={{ display: "flex", gap: 5 }}>
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
                            Detail
                          </button>
                          {wo.status === "in_progress" && (
                            <button
                              onClick={() => setLogWO(wo)}
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
                              Log
                            </button>
                          )}
                          {wo.status === "released" && (
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
                              Mulai
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB: BOM ── */}
        {tab === "bom" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: selBom ? "1fr 1.2fr" : "1fr",
              transition: "all 0.2s",
            }}
          >
            {/* BOM List */}
            <div
              style={{
                borderRight: selBom ? "1px solid #1e2130" : "none",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th>Produk</Th>
                    <Th center>Versi</Th>
                    <Th center>Komponen</Th>
                    <Th>Update Terakhir</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBOMs.map((b: any) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelBom(selBom?.id === b.id ? null : b)}
                      style={{
                        cursor: "pointer",
                        background:
                          selBom?.id === b.id
                            ? "rgba(59,130,246,0.05)"
                            : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (selBom?.id !== b.id)
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.02)";
                      }}
                      onMouseLeave={(e) => {
                        if (selBom?.id !== b.id)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#e2e8f0",
                          }}
                        >
                          {b.product}
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
                            fontSize: 11,
                            color: "#60a5fa",
                            fontFamily: "monospace",
                          }}
                        >
                          {b.version}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          textAlign: "center",
                          color: "#94a3b8",
                          fontSize: 13,
                        }}
                      >
                        {b.components}
                      </td>
                      <Td muted>{b.lastUpdate}</Td>
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
                              b.status === "active"
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(71,85,105,0.2)",
                            color:
                              b.status === "active" ? "#4ade80" : "#64748b",
                          }}
                        >
                          {b.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BOM Detail */}
            {selBom && (
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
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#f1f5f9",
                      }}
                    >
                      {selBom.product}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#475569", marginTop: 2 }}
                    >
                      BOM {selBom.version} · {selBom.components} komponen
                    </div>
                  </div>
                  <button
                    style={{
                      padding: "5px 12px",
                      borderRadius: 7,
                      background: "transparent",
                      border: "1px solid #1e2130",
                      color: "#475569",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Edit BOM
                  </button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <Th>SKU</Th>
                      <Th>Material</Th>
                      <Th right>Qty / pcs</Th>
                      <Th>Satuan</Th>
                      <Th right>Stok</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {(BOM_DETAIL[selBom.id] || []).map((mat, i) => (
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
                            fontSize: 11,
                            color: "#475569",
                            fontFamily: "monospace",
                          }}
                        >
                          {mat.sku}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            fontSize: 13,
                            color: "#94a3b8",
                          }}
                        >
                          {mat.material}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            textAlign: "right",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#f1f5f9",
                          }}
                        >
                          {mat.qty}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            borderBottom: "1px solid #1a1d2a",
                            fontSize: 12,
                            color: "#475569",
                          }}
                        >
                          {mat.unit}
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
                              fontSize: 13,
                              fontWeight: 600,
                              color:
                                mat.available === 0
                                  ? "#ef4444"
                                  : mat.available < 20
                                    ? "#f59e0b"
                                    : "#4ade80",
                            }}
                          >
                            {mat.available}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!BOM_DETAIL[selBom.id] && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#334155",
                            fontSize: 13,
                            borderBottom: "1px solid #1a1d2a",
                          }}
                        >
                          Detail BOM belum tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Logs ── */}
        {tab === "logs" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Waktu</Th>
                  <Th>Work Order</Th>
                  <Th>Work Center</Th>
                  <Th>Tipe</Th>
                  <Th center>Qty</Th>
                  <Th>Catatan</Th>
                </tr>
              </thead>
              <tbody>
                {PROD_LOGS.map((l, i) => (
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
                        fontSize: 12,
                        color: "#475569",
                        fontFamily: "monospace",
                      }}
                    >
                      {l.time}
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
                          color: "#60a5fa",
                          fontFamily: "monospace",
                        }}
                      >
                        {l.wo}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      {l.wc}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      {l.type === "reject" ? (
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
                          ✕ Reject
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
                          ✓ Produksi
                        </span>
                      )}
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
                          fontSize: 14,
                          fontWeight: 700,
                          color: l.type === "reject" ? "#f87171" : "#f1f5f9",
                        }}
                      >
                        {l.qty}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                        fontSize: 12,
                        color: "#475569",
                      }}
                    >
                      {l.note || <span style={{ color: "#252836" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
            {tab === "workorders"
              ? filteredWOs.length
              : tab === "bom"
                ? filteredBOMs.length
                : PROD_LOGS.length}{" "}
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
      </div>
    </div>
  );
}
