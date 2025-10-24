import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const { user, loading } = useAuth();
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6">
            <div className="text-center">
                <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight">Move beyond your IDE</h1>
                <p className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    Access your cloud-powered VS Code workspace anytime, anywhere.
                    Work seamlessly on projects, collaborate with peers, and code in secure sandboxed environments — all from your browser.
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                    {loading ? null : user ? (
                        <Button asChild size="lg">
                            <Link to="/dashboard">Launch your workspace</Link>
                        </Button>
                    ) : (
                        <>
                            <Button asChild size="lg">
                                <Link to="/login">Sign in</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link to="/signup">Create account</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage
