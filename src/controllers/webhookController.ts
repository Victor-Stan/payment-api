import { Request, Response } from "express";
import { capturePayment } from "../services/paymentService";

interface WebhookRequestBody {
  paymentReference: string;
  status: "reserved" | "error";
}

export const handleWebhookCallback = async (
  req: Request<{}, {}, WebhookRequestBody>,
  res: Response
) => {
  const { paymentReference, status } = req.body;

  try {
    if (status === "reserved") {
      const captureResult = await capturePayment(paymentReference);
      if (captureResult.status === "ok") {
        return res.status(200).json({ message: "Webhook processed successfully" });
      } else {
        return res.status(400).json({ message: "Payment capture failed" });
      }
    } else if (status === "error") {
      return res.status(400).json({ message: "Payment failed" });
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Webhook processing failed" });
  }
};
