const express = require("express");
const app = express();
const workspaceRouter = require("./routes/dashboard");
const userRouter = require("./routes/userRoute");
const dotenv = require("dotenv")
dotenv.config();
app.use(express.json());

const verifyAuth = require("./middlewares/verifyAuth");
const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Welcome to Vlabs....")
})
app.use("/workspace", verifyAuth, workspaceRouter);
app.use("/user", userRouter);
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on port " + PORT);
})


