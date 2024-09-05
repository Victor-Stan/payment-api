import { Router } from "express";
import { handleWebhookCallback } from "../controllers/webhookController";

const router = Router();

router.post("/webhook", handleWebhookCallback); 

export default router;
