import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import routes from "./routes/index.route.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());


app.use("/api/v1", routes);


app.get("/", (req, res)=>{
    res.send("Hey there ! Welcome to the api");
})


app.all("*", (req,res)=>{
    return res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

export default app;