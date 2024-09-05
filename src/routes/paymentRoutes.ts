import { Router } from "express";
import {
  createPaymentController,
  handlePaymentStatus,
} from "../controllers/paymentController";

const router = Router();

router.post("/create", createPaymentController);
router.post("/status", handlePaymentStatus);

export default router;
