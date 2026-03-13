import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
    }

    console.log(data);

    return NextResponse.json({
      data: "Berhasil",
    });
  } catch (error) {
    console.log(error);
  }
}
