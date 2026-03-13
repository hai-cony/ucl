import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // const authHeader = req.headers.get("authorization");

    // if (!authHeader) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const token = authHeader.replace("Bearer", "");

    // const {
    //   data: { user },
    //   error,
    // } = await supabase.auth.getUser(token);

    // if (error || !user)
    //   return NextResponse.json({ error: "Invalide token." }, { status: 401 });

    // const { data: profile } = await supabase
    //   .from("profiles")
    //   .select("role")
    //   .eq("id", user.id)
    //   .single();

    // if (profile?.role !== "admin")
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { email, password } = body;

    // const password: string = await argon2.hash(passwd);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "user",
        },
      },
    });

    if (error) {
      console.log(error);
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }
    // console.log(newUser);
    return NextResponse.json({ user: data }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
