"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RingLoader } from "react-spinners";

export default function signIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const backToHome = () => router.back();

  const getInfo = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error.message);
      return null;
    }

    const session = data.session;

    if (session) {
      router.push("/home");
      // console.log("No session found. User not logged in.");
      return null;
    }

    setIsLoading(false);
  };

  const login = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log(data);

      if (error) console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>
          <RingLoader size={60} color="blue" />
          <div className="mt-5 animate-pulse">Loading..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login untuk mengakses menu</CardTitle>
          <CardDescription>
            <div>Masukkan email dan password.</div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
            />
          </div>
          <Button className="w-full" onClick={login}>
            Login
          </Button>
          <Button className="w-full" variant="outline" onClick={backToHome}>
            Kembali ke halaman utama
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
