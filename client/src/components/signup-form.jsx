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

export function SignupForm({
    className,
    ...props
}) {

    //auth logic and states
    const [form, setForm] = useState({ name: "", email: "", password: "" });
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
        const { email, password, name } = form;
        let { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        setLoading(false);
        if (error) setErr(error.message);
        else {
            setSuccess(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);
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
                    <CardTitle>Create a new Account</CardTitle>
                    <CardDescription>
                        Signup to our service using email or Google
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={form.name} type="text" placeholder="walterwhite" onChange={handleChange} required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="walterwhite@gmail.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Submit
                                </Button>
                                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignup}>
                                    Signup with Google
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="underline underline-offset-4">
                                Sign in
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
