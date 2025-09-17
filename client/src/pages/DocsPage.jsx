import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const DocsPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
                <p className="text-lg text-muted-foreground">Everything you need to know about Vlabs</p>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">1. Create Account</h3>
                            <p className="text-muted-foreground">Sign up with email or Google to get your personal workspace.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">2. Deploy Workspace</h3>
                            <p className="text-muted-foreground">Click "Deploy" to spin up your VS Code environment. It takes about 30 seconds.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">3. Start Coding</h3>
                            <p className="text-muted-foreground">Access your workspace at <code className="bg-muted px-1 rounded">https://yourusername.xemplar.live</code></p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Workspace Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Deploy</h3>
                            <p className="text-muted-foreground">Creates a new VS Code container with your personal subdomain.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Start</h3>
                            <p className="text-muted-foreground">Resumes a stopped workspace without losing your files.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Stop</h3>
                            <p className="text-muted-foreground">Pauses your workspace to save resources. Your files are preserved.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Redeploy</h3>
                            <p className="text-muted-foreground">Restarts your workspace with a fresh environment. Use when troubleshooting.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Personal Subdomain</h3>
                            <p className="text-muted-foreground">Each user gets a unique subdomain for easy access and sharing.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Secure & Isolated</h3>
                            <p className="text-muted-foreground">Docker containers ensure complete isolation between workspaces.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">VS Code in Browser</h3>
                            <p className="text-muted-foreground">Full VS Code experience with extensions, terminal, and Git support.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Persistent Storage</h3>
                            <p className="text-muted-foreground">Your files and settings persist between sessions.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Technical Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Infrastructure</h3>
                            <p className="text-muted-foreground">Powered by Docker containers, Traefik for routing, and Supabase for authentication.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Resources</h3>
                            <p className="text-muted-foreground">Each workspace gets 512MB RAM and 512 CPU shares.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Network</h3>
                            <p className="text-muted-foreground">Automatic HTTPS with Let's Encrypt certificates.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DocsPage;
