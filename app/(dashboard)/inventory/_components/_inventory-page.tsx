"use client";
import { useState, useMemo } from "react";

// ─── Data ──────────────────────────────────────────────────────
const CATEGORIES = ["Semua", "Bahan Baku", "WIP", "Produk Jadi", "Consumable"];
const WAREHOUSES = [
  "Semua Gudang",
  "Gudang Utama",
  "Gudang Bahan Baku",
  "Gudang FG",
];

const PRODUCTS = [
  {
    id: 1,
    sku: "RM-00142",
    name: "Aluminium Sheet 2mm",
    category: "Bahan Baku",
    unit: "kg",
    buyPrice: 45000,
    sellPrice: 0,
    minStock: 50,
    type: "raw_material",
    active: true,
  },
  {
    id: 2,
    sku: "RM-00089",
    name: "Stainless Rod Ø25",
    category: "Bahan Baku",
    unit: "m",
    buyPrice: 120000,
    sellPrice: 0,
    minStock: 30,
    type: "raw_material",
    active: true,
  },
  {
    id: 3,
    sku: "RM-00201",
    name: "Carbon Steel Plate 3mm",
    category: "Bahan Baku",
    unit: "kg",
    buyPrice: 38000,
    sellPrice: 0,
    minStock: 100,
    type: "raw_material",
    active: true,
  },
  {
    id: 4,
    sku: "WIP-0031",
    name: "Bracket Semi-Finish",
    category: "WIP",
    unit: "pcs",
    buyPrice: 0,
    sellPrice: 0,
    minStock: 0,
    type: "wip",
    active: true,
  },
  {
    id: 5,
    sku: "FG-00055",
    name: "Bracket Stainless A2",
    category: "Produk Jadi",
    unit: "pcs",
    buyPrice: 0,
    sellPrice: 185000,
    minStock: 20,
    type: "finished",
    active: true,
  },
  {
    id: 6,
    sku: "FG-00056",
    name: "Housing Aluminium B1",
    category: "Produk Jadi",
    unit: "pcs",
    buyPrice: 0,
    sellPrice: 320000,
    minStock: 10,
    type: "finished",
    active: true,
  },
  {
    id: 7,
    sku: "FG-00057",
    name: "Cover Plate 3mm",
    category: "Produk Jadi",
    unit: "pcs",
    buyPrice: 0,
    sellPrice: 95000,
    minStock: 50,
    type: "finished",
    active: true,
  },
  {
    id: 8,
    sku: "CS-00012",
    name: "Coolant Metalwork",
    category: "Consumable",
    unit: "ltr",
    buyPrice: 35000,
    sellPrice: 0,
    minStock: 20,
    type: "consumable",
    active: true,
  },
  {
    id: 9,
    sku: "CS-00013",
    name: "Cutting Oil Premium",
    category: "Consumable",
    unit: "ltr",
    buyPrice: 55000,
    sellPrice: 0,
    minStock: 15,
    type: "consumable",
    active: false,
  },
];

const STOCKS = [
  {
    productId: 1,
    warehouse: "Gudang Bahan Baku",
    qty: 12,
    lastUpdate: "12 Mar 09:30",
  },
  {
    productId: 2,
    warehouse: "Gudang Bahan Baku",
    qty: 48,
    lastUpdate: "11 Mar 14:20",
  },
  {
    productId: 3,
    warehouse: "Gudang Bahan Baku",
    qty: 215,
    lastUpdate: "10 Mar 08:00",
  },
  {
    productId: 4,
    warehouse: "Gudang Utama",
    qty: 45,
    lastUpdate: "12 Mar 08:15",
  },
  { productId: 5, warehouse: "Gudang FG", qty: 82, lastUpdate: "12 Mar 07:50" },
  { productId: 6, warehouse: "Gudang FG", qty: 8, lastUpdate: "11 Mar 16:30" },
  {
    productId: 7,
    warehouse: "Gudang FG",
    qty: 134,
    lastUpdate: "10 Mar 11:00",
  },
  {
    productId: 8,
    warehouse: "Gudang Utama",
    qty: 14,
    lastUpdate: "09 Mar 13:45",
  },
  {
    productId: 9,
    warehouse: "Gudang Utama",
    qty: 0,
    lastUpdate: "05 Mar 10:00",
  },
];

const MOVEMENTS = [
  {
    date: "12 Mar 09:30",
    type: "in",
    product: "Aluminium Sheet 2mm",
    qty: 50,
    ref: "GR/2026/03/0041",
    wh: "Gudang Bahan Baku",
    user: "Sari",
  },
  {
    date: "12 Mar 08:15",
    type: "production_out",
    product: "Aluminium Sheet 2mm",
    qty: 30,
    ref: "WO/2026/03/0031",
    wh: "Gudang Bahan Baku",
    user: "Budi",
  },
  {
    date: "11 Mar 16:30",
    type: "out",
    product: "Housing Aluminium B1",
    qty: 12,
    ref: "DO/2026/03/0018",
    wh: "Gudang FG",
    user: "Dewi",
  },
  {
    date: "11 Mar 14:20",
    type: "in",
    product: "Stainless Rod Ø25",
    qty: 20,
    ref: "GR/2026/03/0040",
    wh: "Gudang Bahan Baku",
    user: "Sari",
  },
  {
    date: "10 Mar 11:00",
    type: "adjustment",
    product: "Cover Plate 3mm",
    qty: 5,
    ref: "ADJ-2026-031",
    wh: "Gudang FG",
    user: "Anton",
  },
  {
    date: "10 Mar 08:00",
    type: "in",
    product: "Carbon Steel Plate 3mm",
    qty: 100,
    ref: "GR/2026/03/0039",
    wh: "Gudang Bahan Baku",
    user: "Sari",
  },
  {
    date: "09 Mar 13:45",
    type: "production_in",
    product: "Bracket Stainless A2",
    qty: 200,
    ref: "WO/2026/03/0028",
    wh: "Gudang FG",
    user: "Budi",
  },
];

const TYPE_COLOR: any = {
  raw_material: {
    bg: "rgba(245,158,11,0.1)",
    text: "#fbbf24",
    label: "Bahan Baku",
  },
  wip: { bg: "rgba(139,92,246,0.1)", text: "#a78bfa", label: "WIP" },
  finished: {
    bg: "rgba(59,130,246,0.1)",
    text: "#60a5fa",
    label: "Produk Jadi",
  },
  consumable: {
    bg: "rgba(16,185,129,0.1)",
    text: "#34d399",
    label: "Consumable",
  },
};

const MOVE_COLOR: any = {
  in: {
    bg: "rgba(34,197,94,0.12)",
    text: "#4ade80",
    icon: "↑",
    label: "Masuk",
  },
  out: {
    bg: "rgba(239,68,68,0.12)",
    text: "#f87171",
    icon: "↓",
    label: "Keluar",
  },
  production_in: {
    bg: "rgba(59,130,246,0.12)",
    text: "#60a5fa",
    icon: "⊕",
    label: "Prod. In",
  },
  production_out: {
    bg: "rgba(245,158,11,0.12)",
    text: "#fbbf24",
    icon: "⊖",
    label: "Prod. Out",
  },
  adjustment: {
    bg: "rgba(139,92,246,0.12)",
    text: "#a78bfa",
    icon: "≈",
    label: "Adjustment",
  },
};

// ─── Sub-components ────────────────────────────────────────────
function StockBadge({ qty, minStock }: any) {
  if (qty === 0)
    return <span style={badge("#ef4444", "rgba(239,68,68,0.12)")}>Habis</span>;
  if (qty < minStock)
    return (
      <span style={badge("#fbbf24", "rgba(245,158,11,0.12)")}>Kritis</span>
    );
  if (qty < minStock * 2)
    return (
      <span style={badge("#f59e0b", "rgba(245,158,11,0.08)")}>Rendah</span>
    );
  return <span style={badge("#4ade80", "rgba(34,197,94,0.1)")}>Normal</span>;
}

function badge(color: any, bg: any) {
  return {
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 10,
    color,
    background: bg,
    whiteSpace: "nowrap",
  };
}

function Th({ children }: any) {
  return (
    <th
      style={{
        fontSize: 10,
        color: "#334155",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        fontWeight: 600,
        padding: "9px 14px",
        textAlign: "left",
        borderBottom: "1px solid #1e2130",
        background: "#0f1117",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, mono }: any) {
  return (
    <td
      style={{
        fontSize: 13,
        color: mono ? "#60a5fa" : "#94a3b8",
        padding: "11px 14px",
        borderBottom: "1px solid #1a1d2a",
        fontFamily: mono ? "monospace" : "inherit",
      }}
    >
      {children}
    </td>
  );
}

function formatRp(n: any) {
  if (!n) return "—";
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Modal Tambah Produk ───────────────────────────────────────
function ProductModal({ onClose }: any) {
  const [form, setForm] = useState<any>({
    sku: "",
    name: "",
    category: "Bahan Baku",
    unit: "pcs",
    buyPrice: "",
    sellPrice: "",
    minStock: "",
    type: "raw_material",
  });
  const set = (k: any, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    background: "#0f1117",
    border: "1px solid #1e2130",
    borderRadius: 8,
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 11,
    color: "#475569",
    marginBottom: 4,
    display: "block",
    fontWeight: 500,
  };
  const row = (children: any) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
  const field = (label: any, key: any, type = "text", opts = {}) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {opts.select ? (
        <select
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          // style={{ ...inputStyle, cursor: "pointer" }}
        >
          {opts.options.map((o: any) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          placeholder={opts.placeholder || ""}
          // style={inputStyle}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
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
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
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
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
              Tambah Produk
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              Isi data produk baru
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
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {row(
            <>
              {field("SKU *", "sku", "text", { placeholder: "cth. RM-00150" })}
              {field("Tipe Produk *", "type", "text", {
                select: true,
                options: [
                  { value: "raw_material", label: "Bahan Baku" },
                  { value: "wip", label: "Work In Progress" },
                  { value: "finished", label: "Produk Jadi" },
                  { value: "consumable", label: "Consumable" },
                ],
              })}
            </>,
          )}
          <div>
            <label style={labelStyle}>Nama Produk *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nama lengkap produk"
              // style={inputStyle}
            />
          </div>
          {row(
            <>
              {field("Kategori", "category", "text", {
                select: true,
                options: CATEGORIES.slice(1).map((c) => ({
                  value: c,
                  label: c,
                })),
              })}
              {field("Satuan *", "unit", "text", {
                select: true,
                options: ["pcs", "kg", "m", "ltr", "box", "roll", "set"].map(
                  (u) => ({ value: u, label: u }),
                ),
              })}
            </>,
          )}
          {row(
            <>
              {field("Harga Beli (Rp)", "buyPrice", "number", {
                placeholder: "0",
              })}
              {field("Harga Jual (Rp)", "sellPrice", "number", {
                placeholder: "0",
              })}
            </>,
          )}
          <div>
            <label style={labelStyle}>Stok Minimum</label>
            <input
              type="number"
              value={form.minStock}
              onChange={(e) => set("minStock", e.target.value)}
              placeholder="0"
              // style={inputStyle}
            />
            <p style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
              Alert stok kritis akan muncul jika di bawah nilai ini
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px 18px",
            borderTop: "1px solid #1e2130",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
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
            }}
          >
            Simpan Produk
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────
export default function InventoryPage() {
  const [tab, setTab] = useState("products"); // products | stock | movements
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("Semua");
  const [whFilter, setWh] = useState("Semua Gudang");
  const [showModal, setModal] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const S = {
    fontFamily: "'DM Sans','IBM Plex Sans',sans-serif",
    background: "#0f1117",
    minHeight: "100vh",
    color: "#e2e8f0",
    padding: 24,
  };

  // Filtered products
  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        const matchSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === "Semua" || p.category === catFilter;
        const matchActive = showInactive || p.active;
        return matchSearch && matchCat && matchActive;
      }),
    [search, catFilter, showInactive],
  );

  // Stock with product info
  const stockRows = useMemo(
    () =>
      STOCKS.filter(
        (s) => whFilter === "Semua Gudang" || s.warehouse === whFilter,
      )
        .map((s) => ({
          ...s,
          product: PRODUCTS.find((p) => p.id === s.productId),
        }))
        .filter(
          (s) =>
            s.product &&
            (s.product.name.toLowerCase().includes(search.toLowerCase()) ||
              s.product.sku.toLowerCase().includes(search.toLowerCase())),
        ),
    [search, whFilter],
  );

  // Filtered movements
  const filteredMoves = useMemo(
    () =>
      MOVEMENTS.filter(
        (m) =>
          m.product.toLowerCase().includes(search.toLowerCase()) ||
          m.ref.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  // Stats
  const criticalCount = STOCKS.filter((s) => {
    const p = PRODUCTS.find((x) => x.id === s.productId);
    return p && p.minStock > 0 && s.qty < p.minStock;
  }).length;
  const totalSkus = PRODUCTS.filter((p) => p.active).length;
  const stockValue = STOCKS.reduce((acc, s) => {
    const p = PRODUCTS.find((x) => x.id === s.productId);
    return acc + (p ? s.qty * p.buyPrice : 0);
  }, 0);

  const tabStyle = (active: any) => ({
    padding: "7px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    background: active ? "rgba(59,130,246,0.12)" : "transparent",
    color: active ? "#60a5fa" : "#475569",
    border: active
      ? "1px solid rgba(59,130,246,0.25)"
      : "1px solid transparent",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  const filterSelect = (value: any, onChange: any, options: any) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#13151e",
        border: "1px solid #1e2130",
        borderRadius: 8,
        color: "#64748b",
        fontSize: 13,
        padding: "6px 12px",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {options.map((o: any) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  return (
    <div style={S}>
      {showModal && <ProductModal onClose={() => setModal(false)} />}

      {/* ── Header ── */}
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
            Inventory
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0" }}>
            Kelola produk, stok, dan mutasi barang
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
              "0 0 0 1px rgba(59,130,246,0.4), 0 4px 12px rgba(59,130,246,0.25)",
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
          Tambah Produk
        </button>
      </div>

      {/* ── KPI Strip ── */}
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
            label: "Total SKU Aktif",
            value: totalSkus,
            color: "#3b82f6",
            suffix: "",
          },
          {
            label: "Stok Kritis",
            value: criticalCount,
            color: "#ef4444",
            suffix: " item",
          },
          {
            label: "Nilai Stok",
            value: "Rp " + Math.round(stockValue / 1e6) + "jt",
            color: "#10b981",
            suffix: "",
          },
          {
            label: "Pergerakan Hari Ini",
            value: MOVEMENTS.filter((m) => m.date.includes("12 Mar")).length,
            color: "#8b5cf6",
            suffix: " transaksi",
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
                  k.label === "Stok Kritis" && criticalCount > 0
                    ? "#ef4444"
                    : "#f1f5f9",
                letterSpacing: "-0.03em",
              }}
            >
              {k.value}
              {k.suffix}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs + Toolbar ── */}
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
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginRight: 8 }}>
            {[
              ["products", "Produk"],
              ["stock", "Stok"],
              ["movements", "Mutasi"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={tabStyle(tab === key)}
              >
                {label}
              </button>
            ))}
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
              placeholder="Cari SKU atau nama..."
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

          {/* Filters */}
          {tab === "products" && filterSelect(catFilter, setCat, CATEGORIES)}
          {tab === "stock" && filterSelect(whFilter, setWh, WAREHOUSES)}

          {/* Toggle inactive */}
          {tab === "products" && (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                fontSize: 12,
                color: "#475569",
              }}
            >
              <div
                onClick={() => setShowInactive(!showInactive)}
                style={{
                  width: 32,
                  height: 18,
                  borderRadius: 9,
                  background: showInactive ? "#3b82f6" : "#1e2130",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  border: `1px solid ${showInactive ? "#3b82f6" : "#252836"}`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: showInactive ? 14 : 2,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                  }}
                />
              </div>
              Tampilkan nonaktif
            </label>
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

        {/* ── TAB: Products ── */}
        {tab === "products" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>SKU</Th>
                  <Th>Nama Produk</Th>
                  <Th>Tipe</Th>
                  <Th>Satuan</Th>
                  <Th>Harga Beli</Th>
                  <Th>Harga Jual</Th>
                  <Th>Min. Stok</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p: any) => {
                  const tc = TYPE_COLOR[p.type];
                  return (
                    <tr
                      key={p.id}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <Td mono>{p.sku}</Td>
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
                            color: p.active ? "#e2e8f0" : "#475569",
                          }}
                        >
                          {p.name}
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
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: tc.bg,
                            color: tc.text,
                          }}
                        >
                          {tc.label}
                        </span>
                      </td>
                      <Td>{p.unit}</Td>
                      <Td>{formatRp(p.buyPrice)}</Td>
                      <Td>{formatRp(p.sellPrice)}</Td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          color: "#64748b",
                          fontSize: 13,
                        }}
                      >
                        {p.minStock || "—"} {p.minStock ? p.unit : ""}
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
                            background: p.active
                              ? "rgba(34,197,94,0.1)"
                              : "rgba(71,85,105,0.2)",
                            color: p.active ? "#4ade80" : "#64748b",
                          }}
                        >
                          {p.active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <div style={{ display: "flex", gap: 6 }}>
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#334155",
                  fontSize: 13,
                }}
              >
                Tidak ada produk yang sesuai filter
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Stock ── */}
        {tab === "stock" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>SKU</Th>
                  <Th>Nama Produk</Th>
                  <Th>Tipe</Th>
                  <Th>Gudang</Th>
                  <Th>Qty</Th>
                  <Th>Satuan</Th>
                  <Th>Min. Stok</Th>
                  <Th>Status</Th>
                  <Th>Update Terakhir</Th>
                </tr>
              </thead>
              <tbody>
                {stockRows.map((s: any, i: any) => {
                  const tc = TYPE_COLOR[s.product.type];
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
                      <Td mono>{s.product.sku}</Td>
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
                          {s.product.name}
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
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: tc.bg,
                            color: tc.text,
                          }}
                        >
                          {tc.label}
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
                        {s.warehouse}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color:
                              s.qty === 0
                                ? "#ef4444"
                                : s.qty < s.product.minStock
                                  ? "#fbbf24"
                                  : "#f1f5f9",
                          }}
                        >
                          {s.qty.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <Td>{s.product.unit}</Td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          fontSize: 13,
                          color: "#475569",
                        }}
                      >
                        {s.product.minStock || "—"}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <StockBadge qty={s.qty} minStock={s.product.minStock} />
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          fontSize: 12,
                          color: "#334155",
                        }}
                      >
                        {s.lastUpdate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB: Movements ── */}
        {tab === "movements" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Tanggal</Th>
                  <Th>Tipe</Th>
                  <Th>Produk</Th>
                  <Th>Qty</Th>
                  <Th>Referensi</Th>
                  <Th>Gudang</Th>
                  <Th>User</Th>
                </tr>
              </thead>
              <tbody>
                {filteredMoves.map((m, i) => {
                  const mc = MOVE_COLOR[m.type];
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
                          fontSize: 12,
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.date}
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
                            fontWeight: 600,
                            padding: "2px 10px",
                            borderRadius: 10,
                            background: mc.bg,
                            color: mc.text,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {mc.icon} {mc.label}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                          fontSize: 13,
                          color: "#e2e8f0",
                          fontWeight: 500,
                        }}
                      >
                        {m.product}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #1a1d2a",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: m.type.includes("in")
                              ? "#4ade80"
                              : m.type === "adjustment"
                                ? "#a78bfa"
                                : "#f87171",
                          }}
                        >
                          {m.type.includes("in") ? "+" : "-"}
                          {m.qty}
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
                            color: "#60a5fa",
                            fontFamily: "monospace",
                          }}
                        >
                          {m.ref}
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
                        {m.wh}
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
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: "rgba(59,130,246,0.15)",
                              border: "1px solid rgba(59,130,246,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#60a5fa",
                            }}
                          >
                            {m.user[0]}
                          </div>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            {m.user}
                          </span>
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
            {tab === "products"
              ? filteredProducts.length
              : tab === "stock"
                ? stockRows.length
                : filteredMoves.length}{" "}
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
