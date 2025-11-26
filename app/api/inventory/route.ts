import { NextResponse } from "next/server";

export async function GET() {
  try {
    // dummy data aing hoream nyien tabel di supabase na
    // kena mah query ti database mun gs aya mah
    const data: Record<string, any>[] = [
      {
        id: "monyet1",
        amount: 316,
        status: "success",
        email: "monyet1@yahoo.com",
      },
      {
        id: "onyet2",
        amount: 242,
        status: "success",
        email: "monyet2@gmail.com",
      },
      {
        id: "monyet3",
        amount: 837,
        status: "processing",
        email: "monyet3@gmail.com",
      },
      {
        id: "monyet4",
        amount: 874,
        status: "success",
        email: "monyet4@gmail.com",
      },
      {
        id: "monyet5",
        amount: 721,
        status: "failed",
        email: "monyet5@hotmail.com",
      },
    ];

    // kirim response success ka frontend
    return NextResponse.json(data);
  } catch (error) {
    // log error na
    console.log(error);

    // kirim response error ka client/forntend
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
