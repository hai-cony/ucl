"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────
type NavChild = { label: string; href: string };
type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavChild[];
};

// ─── Icons ───────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  inventory: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  purchasing: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  sales: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  production: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  planner: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  hr: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  reports: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  chevronDown: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronLeft: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  settings: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

// ─── Nav Config ──────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Icons.dashboard,
  },
  {
    key: "sales",
    label: "Sales",
    href: "/sales",
    icon: Icons.sales,
    // children: [
    //   { label: "Sales Order", href: "/sales" },
    //   { label: "Pengiriman", href: "/sales/deliveries" },
    //   { label: "Invoice", href: "/sales/invoices" },
    //   { label: "Pembayaran", href: "/sales/payments" },
    // ],
  },
  {
    key: "planner",
    label: "Planner",
    href: "/planner",
    icon: Icons.planner,
    // children: [
    //   { label: "Rencana Produksi", href: "/planner/plans" },
    //   { label: "Kebutuhan Material", href: "/planner/mrp" },
    //   { label: "Kapasitas Mesin", href: "/planner/capacity" },
    // ],
  },
  {
    key: "inventory",
    label: "Inventory",
    href: "/inventory",
    icon: Icons.inventory,
    children: [
      // { label: "Produk & Stok", href: "/inventory" },
      // { label: "Gudang", href: "/inventory/warehouses" },
      // { label: "Stok", href: "/inventory/stock" },
      // { label: "Mutasi Stok", href: "/inventory/movements" },
    ],
  },
  {
    key: "purchasing",
    label: "Purchasing",
    href: "/purchasing",
    icon: Icons.purchasing,
    // children: [
    //   { label: "Purchase Order", href: "/purchasing/orders" },
    //   { label: "Penerimaan Barang", href: "/purchasing/receipts" },
    //   { label: "Invoice Supplier", href: "/purchasing/invoices" },
    // ],
  },

  {
    key: "production",
    label: "Production",
    href: "/production",
    icon: Icons.production,
    // children: [
    //   { label: "Work Order", href: "/production/work-orders" },
    //   { label: "Bill of Materials", href: "/production/bom" },
    //   { label: "Work Center", href: "/production/work-centers" },
    // ],
  },
  {
    key: "hr",
    label: "HR",
    href: "/hr",
    icon: Icons.hr,
    // children: [
    //   { label: "Karyawan", href: "/hr/employees" },
    //   { label: "Absensi", href: "/hr/attendance" },
    //   { label: "Cuti", href: "/hr/leave" },
    //   { label: "Penggajian", href: "/hr/payroll" },
    // ],
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: Icons.reports,
    // children: [
    //   { label: "Penjualan", href: "/reports/sales" },
    //   { label: "Inventory", href: "/reports/inventory" },
    //   { label: "Produksi", href: "/reports/production" },
    //   { label: "HR", href: "/reports/hr" },
    // ],
  },
];

// ─── Component ───────────────────────────────────────────────
interface SidebarProps {
  user?: { name: string; email: string; avatarInitial?: string };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-open menu yang sedang aktif
  const activeModule = NAV_ITEMS.find(
    (item) =>
      item.children?.some((c) => pathname.startsWith(c.href)) ||
      pathname === item.href,
  )?.key;

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(
    activeModule ? { [activeModule]: true } : {},
  );

  const toggleMenu = (key: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenMenus({ [key]: true });
      return;
    }
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#13151e] border-r border-[#1e2130]",
        "transition-[width,min-width] duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]",
        collapsed ? "w-16 min-w-16" : "w-60 min-w-60",
      )}
    >
      {/* ── Logo ── */}
      <div className="flex items-center h-14 border-b border-[#1e2130] shrink-0 px-4 gap-2.5">
        <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_4px_12px_rgba(59,130,246,0.2)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-[#f1f5f9] font-bold text-sm tracking-tight leading-none">
              UCL Industry
            </p>
            <p className="text-[#475569] text-[10px] tracking-widest uppercase mt-0.5">
              Indonesia
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 [scrollbar-width:none]">
        {NAV_ITEMS.map((item) => {
          const isParentActive = activeModule === item.key;
          const isOpen = openMenus[item.key];
          const hasChildren = !!item.children?.length;

          return (
            <div key={item.key}>
              {/* Parent item */}
              <button
                onClick={() => (hasChildren ? toggleMenu(item.key) : undefined)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-2.5 py-[9px] border-l-2 transition-all duration-150",
                  "text-[#64748b] hover:bg-white/[0.04] hover:text-[#94a3b8]",
                  collapsed ? "pl-[18px] pr-0" : "pl-3.5 pr-3",
                  isParentActive
                    ? "border-blue-500 bg-blue-500/[0.12] text-[#93c5fd]"
                    : "border-transparent",
                )}
              >
                {/* Jika tidak ada children, bungkus dengan Link */}
                {hasChildren ? (
                  <>
                    <span
                      className={cn(
                        "shrink-0 flex",
                        isParentActive && "text-blue-400",
                      )}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span
                          className={cn(
                            "text-[13.5px] tracking-tight flex-1 text-left whitespace-nowrap",
                            isParentActive
                              ? "font-semibold text-[#e2e8f0]"
                              : "font-[450]",
                          )}
                        >
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        >
                          {Icons.chevronDown}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 w-full"
                  >
                    <span
                      className={cn(
                        "shrink-0 flex",
                        isParentActive && "text-blue-400",
                      )}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span
                        className={cn(
                          "text-[13.5px] tracking-tight flex-1 text-left whitespace-nowrap",
                          isParentActive
                            ? "font-semibold text-[#e2e8f0]"
                            : "font-[450]",
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}
              </button>

              {/* Submenu */}
              {hasChildren && !collapsed && (
                <div
                  className="overflow-hidden transition-[max-height] duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]"
                  style={{
                    maxHeight: isOpen
                      ? `${item.children!.length * 36}px`
                      : "0px",
                  }}
                >
                  {item.children!.map((child) => {
                    const isChildActive =
                      pathname === child.href ||
                      pathname.startsWith(child.href + "/");
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 py-[7px] pl-[42px] pr-3 text-[13px] tracking-tight transition-all duration-100",
                          isChildActive
                            ? "text-[#93c5fd] font-medium bg-blue-500/[0.08]"
                            : "text-[#475569] hover:text-[#94a3b8] hover:bg-white/[0.03]",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1 h-1 rounded-full shrink-0 transition-colors duration-100",
                            isChildActive ? "bg-blue-500" : "bg-[#334155]",
                          )}
                        />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="h-px bg-[#1e2130] mb-2" />

      {/* ── User Profile ── */}
      <div
        className={cn(
          "flex items-center gap-2.5 cursor-pointer transition-colors duration-100 hover:bg-white/[0.04] mb-1",
          collapsed ? "px-[13px] py-2.5" : "px-3 py-2.5",
        )}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shrink-0 text-[13px] font-bold text-white">
          {user?.avatarInitial ?? "A"}
        </div>
        {!collapsed && (
          <>
            <div className="overflow-hidden flex-1">
              <p className="text-[13px] font-semibold text-[#e2e8f0] truncate">
                {user?.name ?? "Admin User"}
              </p>
              <p className="text-[11px] text-[#475569] truncate">
                {user?.email ?? "admin@company.com"}
              </p>
            </div>
            <span className="text-[#475569] shrink-0">{Icons.settings}</span>
          </>
        )}
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "flex items-center justify-center gap-1.5 mb-3 text-[#475569] text-xs",
          "bg-white/[0.04] border border-[#1e2130] rounded-lg transition-all duration-100",
          "hover:bg-white/[0.08] hover:text-[#94a3b8]",
          collapsed ? "mx-auto w-9 h-9" : "mx-3 py-[7px] px-2.5",
        )}
      >
        <span
          className={cn(
            "transition-transform duration-[220ms]",
            collapsed && "rotate-180",
          )}
        >
          {Icons.chevronLeft}
        </span>
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
