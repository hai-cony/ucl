"use client";
import { useState, useMemo } from "react";

const SUPPLIERS = [
  "PT Baja Nusantara",
  "CV Logam Jaya",
  "PT Alumindo Prima",
  "UD Besi Kuat",
  "PT Surya Metal",
  "CV Indo Steel",
];

const RAW_MATERIALS = [
  {
    id: 1,
    sku: "RM-00142",
    name: "Aluminium Sheet 2mm",
    unit: "kg",
    price: 45000,
  },
  {
    id: 2,
    sku: "RM-00089",
    name: "Stainless Rod Ø25",
    unit: "m",
    price: 120000,
  },
  {
    id: 3,
    sku: "RM-00201",
    name: "Carbon Steel Plate 3mm",
    unit: "kg",
    price: 38000,
  },
  {
    id: 4,
    sku: "CS-00012",
    name: "Coolant Metalwork",
    unit: "ltr",
    price: 35000,
  },
  {
    id: 5,
    sku: "CS-00013",
    name: "Cutting Oil Premium",
    unit: "ltr",
    price: 55000,
  },
];

const PURCHASE_ORDERS = [
  {
    id: 1,
    no: "PO/2026/03/0022",
    supplier: "PT Baja Nusantara",
    date: "11 Mar",
    expected: "18 Mar",
    total: 18500000,
    status: "sent",
    items: 2,
    received: 0,
  },
  {
    id: 2,
    no: "PO/2026/03/0021",
    supplier: "CV Logam Jaya",
    date: "10 Mar",
    expected: "17 Mar",
    total: 9600000,
    status: "partial",
    items: 3,
    received: 2,
  },
  {
    id: 3,
    no: "PO/2026/03/0020",
    supplier: "PT Alumindo Prima",
    date: "08 Mar",
    expected: "15 Mar",
    total: 54000000,
    status: "received",
    items: 4,
    received: 4,
  },
  {
    id: 4,
    no: "PO/2026/03/0019",
    supplier: "UD Besi Kuat",
    date: "07 Mar",
    expected: "14 Mar",
    total: 7200000,
    status: "draft",
    items: 1,
    received: 0,
  },
  {
    id: 5,
    no: "PO/2026/03/0018",
    supplier: "PT Surya Metal",
    date: "05 Mar",
    expected: "12 Mar",
    total: 33750000,
    status: "received",
    items: 3,
    received: 3,
  },
  {
    id: 6,
    no: "PO/2026/03/0017",
    supplier: "CV Indo Steel",
    date: "04 Mar",
    expected: "11 Mar",
    total: 4800000,
    status: "cancelled",
    items: 1,
    received: 0,
  },
];

const RECEIPTS = [
  {
    id: 1,
    no: "GR/2026/03/0041",
    po: "PO/2026/03/0020",
    supplier: "PT Alumindo Prima",
    date: "12 Mar",
    status: "confirmed",
    items: 4,
  },
  {
    id: 2,
    no: "GR/2026/03/0040",
    po: "PO/2026/03/0021",
    supplier: "CV Logam Jaya",
    date: "11 Mar",
    status: "confirmed",
    items: 2,
  },
  {
    id: 3,
    no: "GR/2026/03/0039",
    po: "PO/2026/03/0018",
    supplier: "PT Surya Metal",
    date: "10 Mar",
    status: "confirmed",
    items: 3,
  },
  {
    id: 4,
    no: "GR/2026/03/0038",
    po: "PO/2026/03/0021",
    supplier: "CV Logam Jaya",
    date: "12 Mar",
    status: "draft",
    items: 1,
  },
];

const PINVOICES = [
  {
    no: "PINV-BN-0312",
    po: "PO/2026/03/0022",
    supplier: "PT Baja Nusantara",
    date: "11 Mar",
    due: "25 Mar",
    total: 18500000,
    paid: 0,
    status: "unpaid",
  },
  {
    no: "PINV-LJ-0311",
    po: "PO/2026/03/0021",
    supplier: "CV Logam Jaya",
    date: "10 Mar",
    due: "24 Mar",
    total: 9600000,
    paid: 9600000,
    status: "paid",
  },
  {
    no: "PINV-AP-0308",
    po: "PO/2026/03/0020",
    supplier: "PT Alumindo Prima",
    date: "08 Mar",
    due: "22 Mar",
    total: 54000000,
    paid: 20000000,
    status: "partial",
  },
  {
    no: "PINV-SM-0305",
    po: "PO/2026/03/0018",
    supplier: "PT Surya Metal",
    date: "05 Mar",
    due: "19 Mar",
    total: 33750000,
    paid: 0,
    status: "overdue",
  },
];

const PO_STATUS: any = {
  draft: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Draft" },
  sent: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", label: "Terkirim" },
  partial: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", label: "Partial" },
  received: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "Diterima" },
  cancelled: { bg: "rgba(239,68,68,0.12)", text: "#f87171", label: "Batal" },
};
const GR_STATUS: any = {
  draft: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Draft" },
  confirmed: {
    bg: "rgba(34,197,94,0.15)",
    text: "#4ade80",
    label: "Dikonfirmasi",
  },
};
const INV_STATUS: any = {
  unpaid: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Belum Bayar" },
  partial: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", label: "Partial" },
  paid: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "Lunas" },
  overdue: { bg: "rgba(239,68,68,0.15)", text: "#f87171", label: "Overdue" },
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
function Th({ children, right }: any) {
  return (
    <th
      style={{
        fontSize: 10,
        color: "#334155",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        fontWeight: 600,
        padding: "9px 14px",
        textAlign: right ? "right" : "left",
        borderBottom: "1px solid #1e2130",
        background: "#0f1117",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}
function Td({ children, mono, muted, right }: any) {
  return (
    <td
      style={{
        fontSize: 13,
        padding: "11px 14px",
        borderBottom: "1px solid #1a1d2a",
        textAlign: right ? "right" : "left",
        color: mono ? "#60a5fa" : muted ? "#475569" : "#94a3b8",
        fontFamily: mono ? "monospace" : "inherit",
      }}
    >
      {children}
    </td>
  );
}

// ─── PO Form Modal ─────────────────────────────────────────────
function POModal({ onClose }: any) {
  const [supplier, setSupplier] = useState("");
  const [expected, setExpected] = useState("");
  const [warehouse, setWarehouse] = useState("Gudang Bahan Baku");
  const [items, setItems] = useState([
    { productId: "", qty: 1, price: 0, discount: 0 },
  ]);

  const addItem = () =>
    setItems((i) => [...i, { productId: "", qty: 1, price: 0, discount: 0 }]);
  const removeItem = (idx: any) =>
    setItems((i) => i.filter((_, j) => j !== idx));
  const setItem = (idx: any, key: any, val: any) =>
    setItems((i) => i.map((it, j) => (j === idx ? { ...it, [key]: val } : it)));

  const subtotal = items.reduce(
    (a, it) => a + it.qty * it.price - it.discount,
    0,
  );
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

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
          width: 660,
          maxHeight: "92vh",
          overflow: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
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
              Buat Purchase Order
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              Nomor PO dibuat otomatis saat disimpan
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

        {/* Body */}
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
          {/* Row 1 */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelSt}>Supplier *</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                style={{
                  ...inputSt,
                  cursor: "pointer",
                  color: supplier ? "#e2e8f0" : "#475569",
                }}
              >
                <option value="">Pilih supplier...</option>
                {SUPPLIERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelSt}>Gudang Tujuan *</label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                style={{ ...inputSt, cursor: "pointer" }}
              >
                {["Gudang Bahan Baku", "Gudang Utama", "Gudang FG"].map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelSt}>Tanggal Order</label>
              <input type="date" defaultValue="2026-03-13" style={inputSt} />
            </div>
            <div>
              <label style={labelSt}>Estimasi Tiba *</label>
              <input
                type="date"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                style={inputSt}
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label style={labelSt}>Item Pembelian *</label>
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
                + Tambah Item
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 70px 110px 100px 100px 28px",
                gap: 6,
                marginBottom: 4,
              }}
            >
              {["Produk", "Qty", "Harga Satuan", "Diskon", "Subtotal", ""].map(
                (h, i) => (
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
                ),
              )}
            </div>

            {items.map((item, idx) => {
              const sub = Math.max(0, item.qty * item.price - item.discount);
              return (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 70px 110px 100px 100px 28px",
                    gap: 6,
                    marginBottom: 6,
                    alignItems: "center",
                  }}
                >
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const p = RAW_MATERIALS.find(
                        (x) => x.id === Number(e.target.value),
                      );
                      setItem(idx, "productId", e.target.value);
                      if (p) setItem(idx, "price", p.price);
                    }}
                    style={{
                      padding: "7px 8px",
                      background: "#0f1117",
                      border: "1px solid #1e2130",
                      borderRadius: 7,
                      color: item.productId ? "#e2e8f0" : "#475569",
                      fontSize: 12,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Pilih produk...</option>
                    {RAW_MATERIALS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {[
                    [
                      item.qty,
                      (v) => setItem(idx, "qty", Number(v)),
                      "number",
                      "center",
                    ],
                    [
                      item.price,
                      (v) => setItem(idx, "price", Number(v)),
                      "number",
                      "left",
                    ],
                    [
                      item.discount,
                      (v) => setItem(idx, "discount", Number(v)),
                      "number",
                      "left",
                    ],
                  ].map(([val, onChange, type, align], i) => (
                    <input
                      key={i}
                      type={type}
                      value={val}
                      onChange={(e) => onChange(e.target.value)}
                      style={{
                        padding: "7px 8px",
                        background: "#0f1117",
                        border: "1px solid #1e2130",
                        borderRadius: 7,
                        color: "#e2e8f0",
                        fontSize: 12,
                        outline: "none",
                        textAlign: align,
                      }}
                    />
                  ))}
                  <span
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      textAlign: "right",
                    }}
                  >
                    {rp(sub)}
                  </span>
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
              );
            })}
          </div>

          {/* Notes */}
          <div>
            <label style={labelSt}>Catatan ke Supplier</label>
            <textarea
              rows={2}
              placeholder="Syarat pengiriman, spesifikasi tambahan, dsb..."
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

          {/* Totals */}
          <div
            style={{
              background: "#0f1117",
              border: "1px solid #1e2130",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            {[
              ["Subtotal", rp(subtotal), false],
              ["PPN 11%", rp(tax), false],
              ["Total", rp(total), true],
            ].map(([label, value, bold], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: i < 2 ? 8 : 0,
                  paddingTop: i === 2 ? 10 : 0,
                  borderTop: i === 2 ? "1px solid #1e2130" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: i === 2 ? 13 : 12,
                    color: i === 2 ? "#94a3b8" : "#475569",
                    fontWeight: i === 2 ? 600 : 400,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: i === 2 ? 18 : 13,
                    color: i === 2 ? "#f1f5f9" : "#64748b",
                    fontWeight: i === 2 ? 800 : 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
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
              Kirim ke Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GR Confirm Modal ──────────────────────────────────────────
function GRModal({ onClose }: any) {
  const [items, setItems] = useState([
    { name: "Aluminium Sheet 2mm", ordered: 100, received: 100, unit: "kg" },
    { name: "Carbon Steel Plate", ordered: 200, received: 185, unit: "kg" },
  ]);
  const setReceived = (idx: any, val: any) =>
    setItems((i) =>
      i.map((it, j) => (j === idx ? { ...it, received: Number(val) } : it)),
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
          width: 520,
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid #1e2130",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
              Terima Barang
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              PO/2026/03/0022 — PT Baja Nusantara
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

        <div style={{ padding: "18px 22px" }}>
          <div
            style={{
              fontSize: 11,
              color: "#475569",
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            Masukkan jumlah barang yang benar-benar diterima:
          </div>

          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 90px 50px",
              gap: 8,
              marginBottom: 6,
            }}
          >
            {["Produk", "Dipesan", "Diterima", "Sat."].map((h, i) => (
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

          {items.map((it, idx) => {
            const diff = it.received - it.ordered;
            return (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px 90px 50px",
                  gap: 8,
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}
                >
                  {it.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  {it.ordered}
                </span>
                <div>
                  <input
                    type="number"
                    value={it.received}
                    onChange={(e) => setReceived(idx, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      background: "#0f1117",
                      border: `1px solid ${it.received < it.ordered ? "#f59e0b" : "#1e2130"}`,
                      borderRadius: 7,
                      color: "#e2e8f0",
                      fontSize: 13,
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                  {diff !== 0 && (
                    <div
                      style={{
                        fontSize: 10,
                        color: diff < 0 ? "#fbbf24" : "#4ade80",
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff} {it.unit}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#475569" }}>
                  {it.unit}
                </span>
              </div>
            );
          })}

          {/* Warning jika ada selisih */}
          {items.some((it) => it.received < it.ordered) && (
            <div
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                marginTop: 8,
                fontSize: 12,
                color: "#fbbf24",
              }}
            >
              ⚠ Ada barang yang diterima kurang dari yang dipesan. PO akan
              berstatus <strong>Partial</strong>.
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <label
              style={{
                fontSize: 11,
                color: "#475569",
                marginBottom: 4,
                display: "block",
                fontWeight: 500,
              }}
            >
              Catatan Penerimaan
            </label>
            <textarea
              rows={2}
              placeholder="Kondisi barang, nomor surat jalan, dsb..."
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
              background: "#10b981",
              border: "none",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                "0 0 0 1px rgba(16,185,129,0.4),0 4px 12px rgba(16,185,129,0.2)",
            }}
          >
            Konfirmasi Terima
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function PurchasingPage() {
  const [tab, setTab] = useState("orders");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("Semua");
  const [showPO, setShowPO] = useState(false);
  const [showGR, setShowGR] = useState(false);

  const filteredPOs = useMemo(
    () =>
      PURCHASE_ORDERS.filter(
        (o) =>
          (statusF === "Semua" || o.status === statusF) &&
          (o.no.toLowerCase().includes(search.toLowerCase()) ||
            o.supplier.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, statusF],
  );

  const filteredGRs = useMemo(
    () =>
      RECEIPTS.filter(
        (r) =>
          r.no.toLowerCase().includes(search.toLowerCase()) ||
          r.supplier.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const filteredInv = useMemo(
    () =>
      PINVOICES.filter(
        (i) =>
          i.no.toLowerCase().includes(search.toLowerCase()) ||
          i.supplier.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const totalHutang = PINVOICES.filter((i) => i.status !== "paid").reduce(
    (a, i) => a + (i.total - i.paid),
    0,
  );
  const overdueCount = PINVOICES.filter((i) => i.status === "overdue").length;
  const pendingPOs = PURCHASE_ORDERS.filter(
    (o) => o.status === "sent" || o.status === "partial",
  ).length;
  const thisMonthBuy = PURCHASE_ORDERS.filter(
    (o) => o.status !== "cancelled",
  ).reduce((a, o) => a + o.total, 0);

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
      {showPO && <POModal onClose={() => setShowPO(false)} />}
      {showGR && <GRModal onClose={() => setShowGR(false)} />}

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
            Purchasing
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0" }}>
            Kelola pembelian, penerimaan barang, dan hutang supplier
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowGR(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #1e2130",
              borderRadius: 8,
              color: "#64748b",
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Terima Barang
          </button>
          <button
            onClick={() => setShowPO(true)}
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
            Buat PO
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
            label: "Pembelian Bulan Ini",
            value: rp(thisMonthBuy),
            color: "#3b82f6",
            sub: "Total nilai PO",
          },
          {
            label: "PO Menunggu Barang",
            value: pendingPOs + " PO",
            color: "#8b5cf6",
            sub: "Sent / Partial",
          },
          {
            label: "Total Hutang",
            value: rp(totalHutang),
            color: totalHutang > 0 ? "#f59e0b" : "#10b981",
            sub: `${overdueCount} overdue`,
          },
          {
            label: "Penerimaan Pending",
            value: RECEIPTS.filter((r) => r.status === "draft").length + " GR",
            color: "#10b981",
            sub: "Belum dikonfirmasi",
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
            {tabBtn("orders", "Purchase Order")}
            {tabBtn("receipts", "Penerimaan Barang")}
            {tabBtn("invoices", "Invoice Supplier")}
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
              placeholder="Cari nomor atau supplier..."
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

          {tab === "orders" && (
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
                "sent",
                "partial",
                "received",
                "cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s === "Semua" ? "Semua Status" : PO_STATUS[s]?.label}
                </option>
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

        {/* ── TAB: Purchase Orders ── */}
        {tab === "orders" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Nomor PO</Th>
                  <Th>Supplier</Th>
                  <Th>Tgl Order</Th>
                  <Th>Est. Tiba</Th>
                  <Th>Item</Th>
                  <Th right>Total</Th>
                  <Th>Penerimaan</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map((o) => {
                  const recPct =
                    o.items > 0 ? Math.round((o.received / o.items) * 100) : 0;
                  return (
                    <tr
                      key={o.id}
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
                          {o.no}
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
                          {o.supplier}
                        </span>
                      </td>
                      <Td muted>{o.date}</Td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: o.status === "sent" ? "#fbbf24" : "#475569",
                          }}
                        >
                          {o.expected}
                        </span>
                      </td>
                      <Td muted>{o.items} item</Td>
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
                            color: "#f1f5f9",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {rp(o.total)}
                        </span>
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
                              width: 60,
                              height: 4,
                              background: "#1e2130",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${recPct}%`,
                                background:
                                  recPct === 100 ? "#4ade80" : "#3b82f6",
                                borderRadius: 2,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 11, color: "#475569" }}>
                            {o.received}/{o.items}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <Badge cfg={PO_STATUS[o.status]} />
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
                          {(o.status === "sent" || o.status === "partial") && (
                            <button
                              onClick={() => setShowGR(true)}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 6,
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.2)",
                                color: "#34d399",
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              Terima
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

        {/* ── TAB: Receipts ── */}
        {tab === "receipts" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Nomor GR</Th>
                  <Th>Purchase Order</Th>
                  <Th>Supplier</Th>
                  <Th>Tgl Terima</Th>
                  <Th>Item</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredGRs.map((r, i) => (
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
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#60a5fa",
                          fontFamily: "monospace",
                        }}
                      >
                        {r.no}
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
                          fontSize: 12,
                          color: "#475569",
                          fontFamily: "monospace",
                        }}
                      >
                        {r.po}
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
                        {r.supplier}
                      </span>
                    </td>
                    <Td muted>{r.date}</Td>
                    <Td muted>{r.items} item</Td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <Badge cfg={GR_STATUS[r.status]} />
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
                        {r.status === "draft" && (
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
                            Konfirmasi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB: Purchase Invoices ── */}
        {tab === "invoices" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Nomor Invoice</Th>
                  <Th>Purchase Order</Th>
                  <Th>Supplier</Th>
                  <Th>Tgl Invoice</Th>
                  <Th>Jatuh Tempo</Th>
                  <Th right>Total</Th>
                  <Th right>Terbayar</Th>
                  <Th right>Sisa</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredInv.map((inv, i) => {
                  const sisa = inv.total - inv.paid;
                  const pct = Math.round((inv.paid / inv.total) * 100);
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
                          {inv.no}
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
                            fontSize: 12,
                            color: "#475569",
                            fontFamily: "monospace",
                          }}
                        >
                          {inv.po}
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
                          {inv.supplier}
                        </span>
                      </td>
                      <Td muted>{inv.date}</Td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color:
                              inv.status === "overdue" ? "#f87171" : "#475569",
                          }}
                        >
                          {inv.due}
                        </span>
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
                            fontWeight: 700,
                            color: "#f1f5f9",
                          }}
                        >
                          {rp(inv.total)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          textAlign: "right",
                        }}
                      >
                        <span style={{ fontSize: 13, color: "#4ade80" }}>
                          {rp(inv.paid)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          textAlign: "right",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: 13,
                              color: sisa > 0 ? "#f87171" : "#4ade80",
                              fontWeight: 600,
                            }}
                          >
                            {rp(sisa)}
                          </span>
                          {sisa > 0 && (
                            <div
                              style={{
                                marginTop: 3,
                                height: 3,
                                background: "#1e2130",
                                borderRadius: 2,
                                overflow: "hidden",
                                width: 80,
                                marginLeft: "auto",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${pct}%`,
                                  background: "#3b82f6",
                                  borderRadius: 2,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <Badge cfg={INV_STATUS[inv.status]} />
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
                          {inv.status !== "paid" && (
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
                              Bayar
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
            {tab === "orders"
              ? filteredPOs.length
              : tab === "receipts"
                ? filteredGRs.length
                : filteredInv.length}{" "}
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
