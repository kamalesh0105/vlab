import { useEffect, useState } from "react";

const images = [
    { src: "/home.png", alt: "Landing preview" },
    { src: "/db.png", alt: "Dashboard" },
    { src: "/webIDE.png", alt: "web VSCODE" },
];

export default function AboutPage() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((i) => (i + 1) % images.length);
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

    useEffect(() => {
        const id = setInterval(next, 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold">About Vlabs</h1>
                <p className="mt-4 text-lg text-muted-foreground">A minimal platform to launch personal, secure cloud workspaces.</p>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black/5">
                <img
                    src={images[index].src}
                    alt={images[index].alt}
                    className="h-full w-full object-contain"
                />
                <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-white/80 px-3 py-1 text-sm shadow hover:bg-white"
                    aria-label="Previous image"
                >
                    Prev
                </button>
                <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white/80 px-3 py-1 text-sm shadow hover:bg-white"
                    aria-label="Next image"
                >
                    Next
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, i) => (
                        <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                <div>
                    <h3 className="font-semibold">Single-tenant workspaces</h3>
                    <p className="text-sm text-muted-foreground">Each user gets an isolated code-server container on their own subdomain.</p>
                </div>
                <div>
                    <h3 className="font-semibold">Simple lifecycle</h3>
                    <p className="text-sm text-muted-foreground">Deploy, start, stop, and redeploy from a minimal dashboard.</p>
                </div>
                <div>
                    <h3 className="font-semibold">Secure by default</h3>
                    <p className="text-sm text-muted-foreground">JWT auth with Supabase and HTTPS routing via Traefik + ACME.</p>
                </div>
            </div>
        </div>
    );
}


