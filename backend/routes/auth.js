import express from "express";
import { menu } from "../controllers/menucontroler.js";
import { login, logout, signup } from "../controllers/auth.controllers.js";


const router=express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)


router.get("/menus",menu)

export default router;
