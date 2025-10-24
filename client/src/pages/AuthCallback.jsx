import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/Supabase";
import { useAuth } from "../context/AuthContext";

const apiBase = import.meta.env.VITE_API_BASE_URL || "/workspace"; // we only need headers for /user calls

export default function AuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        const run = async () => {
            // For implicit flow, Supabase parses tokens from the hash and stores the session automatically
            const { data, error } = await supabase.auth.getSession();
            if (!active) return;
            if (error) {
                setError(error.message);
                return;
            }
            if (data?.session) {
                // Persist auth in context/localStorage
                login(data.session);
                console.log(data.session + "session");
                // Create user in backend if not exists
                try {
                    const user = data.session.user;
                    const name = user.user_metadata?.name || user.email?.split("@")[0] || "";
                    await fetch(`/user`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email: user.email })
                    });
                } catch { /* ignore create errors to not block login */ }

                navigate("/docs", { replace: true });
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


