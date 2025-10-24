const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
    try {
        // Prefer Authorization header; fall back to token query param (for SSE/EventSource)
        const authHeader = req.headers["authorization"];
        let token = null;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (typeof req.query.token === "string" && req.query.token.length > 0) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
module.exports = verifyAuth