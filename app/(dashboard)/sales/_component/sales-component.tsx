"use client";
import { useState, useMemo } from "react";

// ─── Data ─────────────────────────────────────────────────────
const CUSTOMERS = [
  "PT Maju Bersama",
  "CV Karya Mandiri",
  "PT Sinar Harapan",
  "UD Sejahtera",
  "PT Teknindo Jaya",
  "CV Abadi Makmur",
];

const PRODUCTS = [
  {
    id: 1,
    sku: "FG-00055",
    name: "Bracket Stainless A2",
    unit: "pcs",
    price: 185000,
    stock: 82,
  },
  {
    id: 2,
    sku: "FG-00056",
    name: "Housing Aluminium B1",
    unit: "pcs",
    price: 320000,
    stock: 8,
  },
  {
    id: 3,
    sku: "FG-00057",
    name: "Cover Plate 3mm",
    unit: "pcs",
    price: 95000,
    stock: 134,
  },
  {
    id: 4,
    sku: "FG-00058",
    name: "Shaft Ø25 Grade A",
    unit: "pcs",
    price: 210000,
    stock: 24,
  },
];

const ORDERS = [
  {
    id: 1,
    no: "SO/2026/03/0042",
    customer: "PT Maju Bersama",
    date: "12 Mar",
    due: "26 Mar",
    total: 48500000,
    status: "confirmed",
    items: 3,
    delivered: 0,
  },
  {
    id: 2,
    no: "SO/2026/03/0041",
    customer: "CV Karya Mandiri",
    date: "11 Mar",
    due: "25 Mar",
    total: 12750000,
    status: "draft",
    items: 1,
    delivered: 0,
  },
  {
    id: 3,
    no: "SO/2026/03/0040",
    customer: "PT Sinar Harapan",
    date: "10 Mar",
    due: "24 Mar",
    total: 93200000,
    status: "delivered",
    items: 5,
    delivered: 5,
  },
  {
    id: 4,
    no: "SO/2026/03/0039",
    customer: "UD Sejahtera",
    date: "09 Mar",
    due: "23 Mar",
    total: 7400000,
    status: "partial",
    items: 2,
    delivered: 1,
  },
  {
    id: 5,
    no: "SO/2026/03/0038",
    customer: "PT Teknindo Jaya",
    date: "08 Mar",
    due: "22 Mar",
    total: 55000000,
    status: "confirmed",
    items: 4,
    delivered: 0,
  },
  {
    id: 6,
    no: "SO/2026/03/0037",
    customer: "CV Abadi Makmur",
    date: "07 Mar",
    due: "21 Mar",
    total: 18300000,
    status: "cancelled",
    items: 2,
    delivered: 0,
  },
];

const INVOICES = [
  {
    no: "INV/2026/03/0018",
    so: "SO/2026/03/0040",
    customer: "PT Sinar Harapan",
    date: "10 Mar",
    due: "24 Mar",
    total: 93200000,
    paid: 93200000,
    status: "paid",
  },
  {
    no: "INV/2026/03/0017",
    so: "SO/2026/03/0039",
    customer: "UD Sejahtera",
    date: "09 Mar",
    due: "23 Mar",
    total: 7400000,
    paid: 0,
    status: "overdue",
  },
  {
    no: "INV/2026/03/0016",
    so: "SO/2026/03/0038",
    customer: "PT Teknindo Jaya",
    date: "08 Mar",
    due: "22 Mar",
    total: 55000000,
    paid: 20000000,
    status: "partial",
  },
  {
    no: "INV/2026/03/0015",
    so: "SO/2026/03/0042",
    customer: "PT Maju Bersama",
    date: "12 Mar",
    due: "26 Mar",
    total: 48500000,
    paid: 0,
    status: "unpaid",
  },
];

const DELIVERIES = [
  {
    no: "DO/2026/03/0021",
    so: "SO/2026/03/0040",
    customer: "PT Sinar Harapan",
    date: "11 Mar",
    status: "delivered",
    items: 5,
  },
  {
    no: "DO/2026/03/0020",
    so: "SO/2026/03/0039",
    customer: "UD Sejahtera",
    date: "10 Mar",
    status: "shipped",
    items: 1,
  },
  {
    no: "DO/2026/03/0019",
    so: "SO/2026/03/0038",
    customer: "PT Teknindo Jaya",
    date: "12 Mar",
    status: "draft",
    items: 4,
  },
];

// ─── Status configs ────────────────────────────────────────────
const SO_STATUS: any = {
  draft: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Draft" },
  confirmed: {
    bg: "rgba(59,130,246,0.15)",
    text: "#60a5fa",
    label: "Confirmed",
  },
  partial: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", label: "Partial" },
  delivered: {
    bg: "rgba(34,197,94,0.15)",
    text: "#4ade80",
    label: "Delivered",
  },
  cancelled: {
    bg: "rgba(239,68,68,0.12)",
    text: "#f87171",
    label: "Cancelled",
  },
};

const INV_STATUS: any = {
  unpaid: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Belum Bayar" },
  partial: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", label: "Partial" },
  paid: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "Lunas" },
  overdue: { bg: "rgba(239,68,68,0.15)", text: "#f87171", label: "Overdue" },
};

const DO_STATUS: any = {
  draft: { bg: "rgba(71,85,105,0.25)", text: "#94a3b8", label: "Draft" },
  shipped: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", label: "Dikirim" },
  delivered: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "Diterima" },
};

// ─── Helpers ──────────────────────────────────────────────────
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

function Td({ children, mono, right, muted, bold }: any) {
  return (
    <td
      style={{
        fontSize: 13,
        padding: "11px 14px",
        borderBottom: "1px solid #1a1d2a",
        textAlign: right ? "right" : "left",
        color: bold ? "#f1f5f9" : muted ? "#475569" : "#94a3b8",
        fontFamily: mono ? "monospace" : "inherit",
        fontWeight: bold ? 700 : 400,
      }}
    >
      {children}
    </td>
  );
}

// ─── SO Form Modal ─────────────────────────────────────────────
function SOModal({ onClose }: any) {
  const [customer, setCustomer] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([
    { productId: "", qty: 1, price: 0, discount: 0 },
  ]);

  const addItem = () =>
    setItems((i) => [...i, { productId: "", qty: 1, price: 0, discount: 0 }]);
  const removeItem = (idx: any) =>
    setItems((i) => i.filter((_, j) => j !== idx));
  const setItem = (idx: any, key: any, val: any) =>
    setItems((i) =>
      i.map((item, j) => (j === idx ? { ...item, [key]: val } : item)),
    );

  const subtotal = items.reduce(
    (acc, it) => acc + (it.qty * it.price - it.discount),
    0,
  );
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  const inp = (value: any, onChange: any, type = "text", placeholder = "") => (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
          width: 640,
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
              Buat Sales Order
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              Nomor akan dibuat otomatis
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
        <div style={{ padding: "18px 22px", flex: 1, overflowY: "auto" }}>
          {/* Customer + Tanggal */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 14,
            }}
          >
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
                Pelanggan *
              </label>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  background: "#0f1117",
                  border: "1px solid #1e2130",
                  borderRadius: 7,
                  color: customer ? "#e2e8f0" : "#475569",
                  fontSize: 13,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">Pilih pelanggan...</option>
                {CUSTOMERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
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
                Jatuh Tempo *
              </label>
              {inp(dueDate, setDueDate, "date")}
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label
                style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}
              >
                Item Pesanan *
              </label>
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

            {/* Item header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 70px 110px 100px 100px 28px",
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
              const prod = PRODUCTS.find(
                (p) => p.id === Number(item.productId),
              );
              const sub = item.qty * item.price - item.discount;
              return (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 70px 110px 100px 100px 28px",
                    gap: 6,
                    marginBottom: 6,
                    alignItems: "center",
                  }}
                >
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const p = PRODUCTS.find(
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
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.qty}
                    min={1}
                    onChange={(e) =>
                      setItem(idx, "qty", Number(e.target.value))
                    }
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
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      setItem(idx, "price", Number(e.target.value))
                    }
                    style={{
                      padding: "7px 8px",
                      background: "#0f1117",
                      border: "1px solid #1e2130",
                      borderRadius: 7,
                      color: "#e2e8f0",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      setItem(idx, "discount", Number(e.target.value))
                    }
                    style={{
                      padding: "7px 8px",
                      background: "#0f1117",
                      border: "1px solid #1e2130",
                      borderRadius: 7,
                      color: "#e2e8f0",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      textAlign: "right",
                    }}
                  >
                    {rp(Math.max(0, sub))}
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
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 11,
                color: "#475569",
                marginBottom: 4,
                display: "block",
                fontWeight: 500,
              }}
            >
              Catatan
            </label>
            <textarea
              placeholder="Catatan tambahan untuk SO ini..."
              rows={2}
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
              { label: "Subtotal", value: rp(subtotal), muted: true },
              { label: "PPN 11%", value: rp(tax), muted: true },
              { label: "Total", value: rp(total), bold: true },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                  {r.label}
                </span>
                <span
                  style={{
                    fontSize: i === 2 ? 18 : 13,
                    color: i === 2 ? "#f1f5f9" : "#64748b",
                    fontWeight: i === 2 ? 800 : 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {r.value}
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
            Simpan sebagai Draft
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
              Konfirmasi SO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function SalesPage() {
  const [tab, setTab] = useState("orders");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("Semua");
  const [showModal, setModal] = useState(false);

  const filteredOrders = useMemo(
    () =>
      ORDERS.filter(
        (o) =>
          (statusF === "Semua" || o.status === statusF) &&
          (o.no.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, statusF],
  );

  const filteredInvoices = useMemo(
    () =>
      INVOICES.filter(
        (i) =>
          i.no.toLowerCase().includes(search.toLowerCase()) ||
          i.customer.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const filteredDeliveries = useMemo(
    () =>
      DELIVERIES.filter(
        (d) =>
          d.no.toLowerCase().includes(search.toLowerCase()) ||
          d.customer.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const totalPiutang = INVOICES.filter((i) => i.status !== "paid").reduce(
    (a, i) => a + (i.total - i.paid),
    0,
  );
  const overdueCount = INVOICES.filter((i) => i.status === "overdue").length;
  const thisMonthSales = ORDERS.filter((o) => o.status !== "cancelled").reduce(
    (a, o) => a + o.total,
    0,
  );

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
      {showModal && <SOModal onClose={() => setModal(false)} />}

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
            Sales
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0" }}>
            Kelola pesanan, pengiriman, dan invoice pelanggan
          </p>
        </div>
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
          Buat SO
        </button>
      </div>

      {/* KPI strip */}
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
            label: "Omset Bulan Ini",
            value: rp(thisMonthSales),
            color: "#3b82f6",
            sub: "+14% vs bulan lalu",
          },
          {
            label: "SO Aktif",
            value:
              ORDERS.filter(
                (o) => o.status === "confirmed" || o.status === "partial",
              ).length + " order",
            color: "#8b5cf6",
            sub: "Perlu diproses",
          },
          {
            label: "Total Piutang",
            value: rp(totalPiutang),
            color: totalPiutang > 0 ? "#f59e0b" : "#10b981",
            sub: `${overdueCount} invoice overdue`,
          },
          {
            label: "Pengiriman Hari Ini",
            value:
              DELIVERIES.filter((d) => d.status !== "delivered").length + " DO",
            color: "#10b981",
            sub: "Sedang berjalan",
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
            {tabBtn("orders", "Sales Order")}
            {tabBtn("deliveries", "Pengiriman")}
            {tabBtn("invoices", "Invoice")}
          </div>
          <div style={{ flex: 1 }} />

          {/* Search */}
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
              placeholder="Cari nomor atau pelanggan..."
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

          {/* Status filter - only for orders */}
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
                "confirmed",
                "partial",
                "delivered",
                "cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s === "Semua" ? "Semua Status" : SO_STATUS[s]?.label}
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

        {/* ── TAB: Sales Orders ── */}
        {tab === "orders" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Nomor SO</Th>
                  <Th>Pelanggan</Th>
                  <Th>Tgl Order</Th>
                  <Th>Jatuh Tempo</Th>
                  <Th right>Total</Th>
                  <Th>Item</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
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
                        {o.customer}
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
                          color:
                            o.status === "cancelled" ? "#475569" : "#64748b",
                        }}
                      >
                        {o.due}
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
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#f1f5f9",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {rp(o.total)}
                      </span>
                    </td>
                    <Td muted>{o.items} item</Td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <Badge cfg={SO_STATUS[o.status]} />
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
                        {(o.status === "confirmed" ||
                          o.status === "partial") && (
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
                            Kirim
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

        {/* ── TAB: Deliveries ── */}
        {tab === "deliveries" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Nomor DO</Th>
                  <Th>Sales Order</Th>
                  <Th>Pelanggan</Th>
                  <Th>Tgl Kirim</Th>
                  <Th>Item</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((d, i) => (
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
                        {d.no}
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
                        {d.so}
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
                        {d.customer}
                      </span>
                    </td>
                    <Td muted>{d.date}</Td>
                    <Td muted>{d.items} item</Td>
                    <td
                      style={{
                        padding: "11px 14px",
                        borderBottom: "1px solid #1a1d2a",
                      }}
                    >
                      <Badge cfg={DO_STATUS[d.status]} />
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
                        {d.status === "shipped" && (
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
                            Konfirmasi Terima
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

        {/* ── TAB: Invoices ── */}
        {tab === "invoices" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Nomor Invoice</Th>
                  <Th>Sales Order</Th>
                  <Th>Pelanggan</Th>
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
                {filteredInvoices.map((inv, i) => {
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
                          {inv.so}
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
                          {inv.customer}
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
                                background: "rgba(34,197,94,0.1)",
                                border: "1px solid rgba(34,197,94,0.2)",
                                color: "#4ade80",
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
              ? filteredOrders.length
              : tab === "deliveries"
                ? filteredDeliveries.length
                : filteredInvoices.length}{" "}
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
