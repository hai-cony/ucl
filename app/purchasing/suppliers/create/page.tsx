"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSupplier() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/suppliers", {
      method: "POST",
      body: JSON.stringify(form),
    });

    router.push("/purchasing/suppliers");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Tambah Supplier</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Nama Supplier"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Alamat"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Telepon"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Simpan
        </button>
      </form>
    </div>
  );
}
