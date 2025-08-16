import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useState } from "react";
import supabase from "../lib/Supabase";
import { useNavigate } from "react-router-dom"

//auth context
import { useAuth } from "../context/AuthContext";

export function LoginForm({
  className,
  ...props
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [sucess, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev, [id]: value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const { email, password } = form;

    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    setLoading(false);
    if (error) setErr(error.message);
    else {
      setSuccess(true);
      login(data);
      console.log("success");
      navigate("/dashboard");
    }
  }

  const handleGoogleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} method="POST">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="walterwhite@gmail.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignup}>
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
