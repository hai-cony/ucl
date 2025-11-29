"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);

  const load = async () => {
    const res = await fetch("/api/suppliers");
    const data = await res.json();
    setSuppliers(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Suppliers</h1>
        <Link
          href="/purchasing/suppliers/create"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Tambah Supplier
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Alamat</th>
            <th className="border p-2">Telepon</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s: any) => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.address}</td>
              <td className="border p-2">{s.phone}</td>
              <td className="border p-2">{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
