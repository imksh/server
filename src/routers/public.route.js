import express from "express";
import { testQR } from '../controllers/public.controller.js';


const router = express.Router();


router.get("/qr/test",testQR)

export default router;
