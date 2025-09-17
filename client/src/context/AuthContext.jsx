import { useContext, useState, useEffect, createContext } from "react";
import supabase from "../lib/Supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                const session = data?.session ?? null;
                if (!isMounted) return;
                if (session) {
                    setUser(session.user ?? null);
                    setToken(session.access_token ?? null);
                    localStorage.setItem("user", JSON.stringify(session.user));
                    localStorage.setItem("token", session.access_token || "");
                } else {
                    const storedUser = localStorage.getItem("user");
                    const storedToken = localStorage.getItem("token");
                    if (storedUser && storedToken) {
                        try {
                            setUser(JSON.parse(storedUser));
                            setToken(storedToken);
                        } catch {
                            localStorage.removeItem("user");
                            localStorage.removeItem("token");
                        }
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        init();

        const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            setToken(session?.access_token ?? null);
            if (session?.user) {
                localStorage.setItem("user", JSON.stringify(session.user));
                localStorage.setItem("token", session.access_token || "");
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        });

        return () => {
            isMounted = false;
            subscription.subscription.unsubscribe();
        };
    }, []);

    const login = (session) => {
        // Accepts either the Supabase session object or the wrapper used elsewhere
        const s = session?.session ? session.session : session;
        if (!s) return;
        setUser(s.user ?? null);
        setToken(s.access_token ?? null);
        localStorage.setItem("user", JSON.stringify(s.user));
        localStorage.setItem("token", s.access_token || "");
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}