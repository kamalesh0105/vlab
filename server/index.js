const express=require("express");
const app=express();
const workspaceRouter=require("./routes/dashboard");
app.use(express.json());
const PORT=5000;

app.get("/",(req,res)=>{
    res.send("Welcome to Vlabs....")
})
app.use("/workspace",workspaceRouter);

app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
})