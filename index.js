import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/index.config.js";

( async ()=>{
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB CONNECTED!");

        app.on('error', (err)=>{
            console.error("ERROR: ", err);
            throw err;
        })

        app.listen(config.PORT, ()=>{
            console.log(`Listening on PORT ${config.PORT}`)
        })
    } catch (err) {
        console.error("ERROR: ", err);
        throw err
    }
})()