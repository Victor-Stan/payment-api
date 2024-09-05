import express from "express";
import dotenv from "dotenv";
import {
  createPaymentController,
  handlePaymentStatus,
} from "./controllers/paymentController";
import webhookRouter from "./routes/webhookRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("running");
});

app.post("/api/payments/create", createPaymentController);
app.post("/api/payments/status", handlePaymentStatus);
app.use("/api/webhooks", webhookRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
