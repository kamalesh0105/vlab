import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const Dashboard = () => {
    return (
        <div className="flex flex-col w-full h-full  text-white">
            {/* Topbar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
                <h1 className="text-2xl font-bold">Workspace Dashboard</h1>
                <div className="flex gap-3">
                    <Button variant="secondary" className="bg-indigo-600 hover:bg-indigo-700">
                        Deploy
                    </Button>
                    <Button variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        Redeploy
                    </Button>
                    <Button variant="destructive">Stop</Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex gap-6">
                {/* Lab Info */}
                <Card className="w-2/3 bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle>Connection Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-400">Username</p>
                            <p className="font-mono">kamaleshselvam75</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Server URL</p>
                            <p className="font-mono text-blue-400 underline">
                                https://example-lab-url.com
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
