import { Router } from "express";

import { SignUp, LogIn, LogOut, getProfile } from "../controllers/auth.controller"
import { isLoggedIn } from "../middlewares/auth.middleware.js"

const router = Router();


router.post("/signUp", SignUp);
router.post("/login", LogIn);
router.post("/logout", LogOut);

router.get("/profile", isLoggedIn, getProfile);


export default router;