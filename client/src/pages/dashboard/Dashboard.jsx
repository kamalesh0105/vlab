import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useAuth } from "../../context/AuthContext";

const apiBase = import.meta.env.VITE_API_BASE_URL || "/workspace";

const Dashboard = () => {
    const { token } = useAuth();
    const [status, setStatus] = useState("unknown");
    const [info, setInfo] = useState({ username: "", url: "", container_id: null, password: null });
    const [busy, setBusy] = useState(false);

    const authHeaders = useMemo(() => ({
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }), [token]);

    useEffect(() => {
        if (!token) return;
        // Prime current status once
        fetch(`${apiBase}/status`, { headers: authHeaders })
            .then(r => r.json())
            .then(d => {
                if (d?.success) {
                    setStatus(d.status);
                    setInfo({ username: d.username || "", url: d.url || "", container_id: d.container_id || null, password: null });
                }
            }).catch(() => { });

        // Subscribe via SSE
        const es = new EventSource(`${apiBase}/stream`, { withCredentials: false });
        es.onmessage = (evt) => {
            try {
                const payload = JSON.parse(evt.data);
                if (payload?.status) setStatus(payload.status);
                if (payload?.container_id) setInfo(prev => ({ ...prev, container_id: payload.container_id }));
            } catch { }
        };
        es.onerror = () => { /* keep silent */ };
        return () => es.close();
    }, [token, authHeaders]);

    const canDeploy = status === "absent" || status === "exited";
    const canStart = status === "exited";
    const canStop = status === "running";
    const canRedeploy = status === "running" || status === "exited";

    const deploy = async () => {
        setBusy(true);
        try {
            const username = info.username || (await (await fetch(`${apiBase}/me`, { headers: authHeaders })).json()).data?.username;
            const res = await fetch(`${apiBase}`, { method: "POST", headers: authHeaders, body: JSON.stringify({ username }) });
            const d = await res.json();
            if (d?.success) {
                setInfo(prev => ({ ...prev, username: d.data.username, url: d.data.url }));
            }
        } finally { setBusy(false); }
    };

    const start = async () => {
        if (!info.container_id) return;
        setBusy(true);
        try {
            await fetch(`${apiBase}/start`, { method: "POST", headers: authHeaders, body: JSON.stringify({ workspaceID: info.container_id }) });
        } finally { setBusy(false); }
    };

    const stop = async () => {
        if (!info.container_id) return;
        setBusy(true);
        try {
            await fetch(`${apiBase}`, { method: "DELETE", headers: authHeaders, body: JSON.stringify({ workspaceID: info.container_id }) });
        } finally { setBusy(false); }
    };

    const redeploy = async () => {
        if (!info.container_id) return;
        setBusy(true);
        try {
            await fetch(`${apiBase}/redeploy`, { method: "POST", headers: authHeaders, body: JSON.stringify({ workspaceID: info.container_id }) });
        } finally { setBusy(false); }
    };

    return (
        <div className="flex flex-col w-full h-full  text-white">
            {/* Topbar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
                <h1 className="text-2xl font-bold">Workspace Dashboard</h1>
                <div className="flex gap-3">
                    <Button variant="secondary" className="bg-indigo-600 hover:bg-indigo-700" onClick={deploy} disabled={!canDeploy || busy}>
                        Deploy
                    </Button>
                    <Button variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={redeploy} disabled={!canRedeploy || busy}>
                        Redeploy
                    </Button>
                    <Button variant="destructive" onClick={stop} disabled={!canStop || busy}>Stop</Button>
                    <Button variant="secondary" onClick={start} disabled={!canStart || busy}>Start</Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex gap-6">
                {/* Lab Info */}
                <Card className="w-2/3 bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle>Connection Information ({status})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-400">Username</p>
                            <p className="font-mono">{info.username || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Server URL</p>
                            <p className="font-mono text-blue-400 underline">
                                {info.url || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Server Password</p>
                            <p className="font-mono">********</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Side Info (optional placeholder) */}
                <Card className="w-1/3 bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 text-sm">
                            You can add any additional details here like environment status or
                            quick tips for the user.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
