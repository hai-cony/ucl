"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Factory, FileText, Package, Truck } from "lucide-react";

export default function PurchasingHome() {
  const menus = [
    {
      title: "Suppliers",
      desc: "Kelola daftar supplier: tambah, edit, dan hapus supplier.",
      href: "/purchasing/suppliers",
      icon: Factory,
    },
    {
      title: "Purchase Order",
      desc: "Buat PO baru dan monitor status pembelian.",
      href: "/purchasing/po",
      icon: FileText,
    },
    {
      title: "Goods Receipt",
      desc: "Penerimaan barang dari PO untuk masuk ke gudang.",
      href: "/purchasing/gr",
      icon: Truck,
    },
    {
      title: "Purchasing Reports",
      desc: "Analisis pembelian, status PO & GR.",
      href: "/purchasing/reports",
      icon: Package,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">PURCHASING</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {menus.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <item.icon className="w-6 h-6 text-blue-600" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.desc}</p>
                <div className="flex items-center gap-2 mt-4 text-blue-600 font-medium">
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
