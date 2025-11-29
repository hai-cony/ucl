import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("suppliers").select("*");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("suppliers")
    .insert(body)
    .select();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}
