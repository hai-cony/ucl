"use client";
import { useState, useRef, useEffect } from "react";

// const NOTIFICATIONS = [
//   {
//     id: 1,
//     type: "warning",
//     title: "Stok Kritis",
//     body: "Bahan baku Aluminium Sheet tinggal 12 kg (min: 50 kg)",
//     time: "5 mnt lalu",
//     read: false,
//     module: "Inventory",
//   },
//   {
//     id: 2,
//     type: "info",
//     title: "Work Order Selesai",
//     body: "WO/2026/03/0028 – Bracket Assembly telah selesai diproduksi",
//     time: "32 mnt lalu",
//     read: false,
//     module: "Production",
//   },
//   {
//     id: 3,
//     type: "danger",
//     title: "Invoice Jatuh Tempo",
//     body: "INV/2026/03/0015 – PT Maju Bersama sudah lewat 3 hari",
//     time: "1 jam lalu",
//     read: false,
//     module: "Sales",
//   },
//   {
//     id: 4,
//     type: "success",
//     title: "PO Diterima",
//     body: "Penerimaan barang GR/2026/03/0041 telah dikonfirmasi",
//     time: "2 jam lalu",
//     read: true,
//     module: "Purchasing",
//   },
//   {
//     id: 5,
//     type: "info",
//     title: "Karyawan Baru",
//     body: "Dewi Rahayu (Operator Produksi) bergabung hari ini",
//     time: "3 jam lalu",
//     read: true,
//     module: "HR",
//   },
// ];

// const SEARCH_SUGGESTIONS = [
//   {
//     label: "SO/2026/03/0042",
//     sub: "Sales Order · PT Maju Bersama",
//     type: "doc",
//   },
//   {
//     label: "Work Order WO/2026/03/0028",
//     sub: "Production · Bracket Assembly",
//     type: "doc",
//   },
//   {
//     label: "Produk: Aluminium Sheet 2mm",
//     sub: "Inventory · SKU-00142",
//     type: "product",
//   },
//   {
//     label: "Karyawan: Budi Santoso",
//     sub: "HR · Divisi Produksi",
//     type: "person",
//   },
// ];

const BREADCRUMBS = [
  { label: "Sales", href: "#" },
  { label: "Sales Order", href: "#" },
  // { label: "SO/2026/03/0042", href: null },
];

// const typeIcon: any = {
//   warning: {
//     bg: "rgba(245,158,11,0.15)",
//     color: "#fbbf24",
//     svg: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
//         <line x1="12" y1="9" x2="12" y2="13" />
//         <line x1="12" y1="17" x2="12.01" y2="17" />
//       </svg>
//     ),
//   },
//   info: {
//     bg: "rgba(59,130,246,0.15)",
//     color: "#60a5fa",
//     svg: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <circle cx="12" cy="12" r="10" />
//         <line x1="12" y1="8" x2="12" y2="12" />
//         <line x1="12" y1="16" x2="12.01" y2="16" />
//       </svg>
//     ),
//   },
//   danger: {
//     bg: "rgba(239,68,68,0.15)",
//     color: "#f87171",
//     svg: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <circle cx="12" cy="12" r="10" />
//         <line x1="15" y1="9" x2="9" y2="15" />
//         <line x1="9" y1="9" x2="15" y2="15" />
//       </svg>
//     ),
//   },
//   success: {
//     bg: "rgba(34,197,94,0.15)",
//     color: "#4ade80",
//     svg: (
//       <svg
//         width="14"
//         height="14"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <polyline points="20 6 9 17 4 12" />
//       </svg>
//     ),
//   },
// };

function useClickOutside(ref: any, handler: any) {
  useEffect(() => {
    const listener = (e: any) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export default function TopbarPreview() {
  // const [searchOpen, setSearchOpen] = useState(false);
  // const [searchVal, setSearchVal] = useState("");
  // const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  // const [notifications, setNotifications] = useState(NOTIFICATIONS);

  // const notifRef = useRef(null);
  const userRef = useRef(null);
  // const searchRef = useRef(null);

  // useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(userRef, () => setUserOpen(false));
  // useClickOutside(searchRef, () => {
  //   setSearchOpen(false);
  //   setSearchVal("");
  // });

  return (
    <div
      style={{
        background: "#0f1117",
        fontFamily: "'DM Sans', 'IBM Plex Sans', sans-serif",
        padding: "0",
      }}
    >
      {/* ── TOPBAR ── */}
      <header
        style={{
          height: 56,
          background: "#0f1117",
          borderBottom: "1px solid #1e2130",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
          position: "relative",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 6,
            minWidth: 0,
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2d3748"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {BREADCRUMBS.map((crumb, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2d3748"
                strokeWidth="2.5"
                style={{ flexShrink: 0 }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              {crumb.href ? (
                <a
                  href={crumb.href}
                  style={{
                    color: "#475569",
                    fontSize: 13,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e: any) => (e.target.style.color = "#64748b")}
                  onMouseLeave={(e: any) => (e.target.style.color = "#475569")}
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {/* User Menu */}
          <div ref={userRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setUserOpen(!userOpen);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: userOpen ? "rgba(255,255,255,0.06)" : "transparent",
                border: `1px solid ${userOpen ? "#252836" : "transparent"}`,
                borderRadius: 8,
                padding: "4px 8px 4px 4px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!userOpen)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!userOpen) e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                A
              </div>
              <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#e2e8f0",
                    whiteSpace: "nowrap",
                  }}
                >
                  Admin User
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: "#475569",
                    whiteSpace: "nowrap",
                  }}
                >
                  Administrator
                </div>
              </div>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                style={{
                  transition: "transform 0.2s",
                  transform: userOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* User Dropdown */}
            {userOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 220,
                  background: "#13151e",
                  border: "1px solid #1e2130",
                  borderRadius: 10,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                {/* User info header */}
                <div
                  style={{
                    padding: "12px 14px 10px",
                    borderBottom: "1px solid #1e2130",
                  }}
                >
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}
                  >
                    Admin User
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>
                    admin@nexaerp.id
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "rgba(59,130,246,0.15)",
                        color: "#60a5fa",
                        letterSpacing: "0.02em",
                      }}
                    >
                      ADMINISTRATOR
                    </span>
                  </div>
                </div>

                {/* Menu items */}
                {[
                  {
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    ),
                    label: "Profil Saya",
                  },
                  {
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    ),
                    label: "Pengaturan",
                  },
                  {
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ),
                    label: "Ubah Password",
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 14px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      fontSize: 13,
                      textAlign: "left",
                      transition: "background 0.1s, color 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = "#94a3b8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#64748b";
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                <div
                  style={{ height: 1, background: "#1e2130", margin: "4px 0" }}
                />

                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 14px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: 13,
                    textAlign: "left",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
