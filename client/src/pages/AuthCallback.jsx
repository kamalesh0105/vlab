import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/Supabase";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        const run = async () => {
            const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (!active) return;
            if (error) {
                setError(error.message);
                return;
            }
            if (data?.session) {
                login(data.session);
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        };
        run();
        return () => { active = false; };
    }, [login, navigate]);

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm text-center text-sm text-slate-400">
                {error ? `Authentication failed: ${error}` : "Finalizing sign-in..."}
            </div>
        </div>
    );
}


