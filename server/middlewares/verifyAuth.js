const jwt = require("jsonwebtoken");

const verifyAuth = (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid token format" });
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