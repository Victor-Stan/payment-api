import request from "supertest";
import app from "../src/index";
import { capturePayment } from "../src/services/paymentService";

jest.mock("../src/services/paymentService", () => ({
  capturePayment: jest.fn(),
}));

describe("Webhook Controller", () => {
  it("should handle a successful webhook notification", async () => {
    (capturePayment as jest.Mock).mockResolvedValue({ status: "ok" });

    const response = await request(app).post("/api/webhooks/webhook").send({
      paymentReference: "test-ref",
      status: "reserved",
    });

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Webhook processed successfully");
  });

  it("should handle webhook errors", async () => {
    (capturePayment as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const response = await request(app).post("/api/webhooks/webhook").send({
      paymentReference: "test-ref",
      status: "error",
    });

    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Payment failed");
  });
});