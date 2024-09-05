import { Request, Response } from "express";
import {
  createPayment,
  getPaymentStatus,
  capturePayment,
} from "../services/paymentService";

interface PaymentRequestBody {
  itemId: string;
  amount: number;
  currency: string;
  clientId: string;
}

interface PaymentStatusRequestBody {
  itemId: string;
  clientId: string;
  status?: "accepted" | "declined" | "error";
}

export const createPaymentController = async (
  req: Request<{}, {}, PaymentRequestBody>,
  res: Response
) => {
  const { itemId, amount, currency, clientId } = req.body;
  const webhookCallbackUrl = process.env.WEBHOOK_URL || "";

  try {
    const paymentData = await createPayment(
      itemId,
      amount,
      currency,
      webhookCallbackUrl
    );
    res.status(200).json({ token: paymentData.token });
  } catch (error) {
    console.error("Error in createPaymentController:", error);
    res.status(400).json({ message: "Payment creation failed" });
  }
};

export const handlePaymentStatus = async (
  req: Request<{}, {}, PaymentStatusRequestBody>,
  res: Response
) => {
  const { itemId, clientId, status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: "Payment status not provided" });
    }

    if (status === "accepted") {
      const paymentStatus = await getPaymentStatus(itemId);
      if (paymentStatus.status === "reserved") {
        const captureResult = await capturePayment(itemId);
        if (captureResult.status === "ok") {
          return res
            .status(200)
            .send(`Payment for item = ${itemId} successful!`);
        }
        return res.status(400).send(`Payment for item = ${itemId} failed!`);
      } else if (paymentStatus.status === "error") {
        return res.status(400).send(`Payment for item = ${itemId} failed!`);
      }
    } else {
      return res.status(400).send(`Payment for item = ${itemId} failed!`);
    }
  } catch (error) {
    console.error("Error in handlePaymentStatus:", error);
    res.status(400).json({ message: "Payment status handling failed" });
  }
};
