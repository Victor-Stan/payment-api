import request from "supertest";
import app from "../src/index"; 
import {
  createPayment,
  getPaymentStatus,
  capturePayment,
} from "../src/services/paymentService";

jest.mock("../src/services/paymentService");

describe("Payment Controller", () => {
  it("should create a payment and return a token", async () => {
    (createPayment as jest.Mock).mockResolvedValue({
      token: "test-token",
    });

    const response = await request(app)
      .post("/api/payments/create")
      .send({
        itemId: "item123",
        amount: 100,
        currency: "USD",
        clientId: "client123",
      });

    console.log(response.body); 
    expect(response.status).toBe(200);
    expect(response.body.token).toBe("test-token");
  });

  it("should handle payment status and return success", async () => {
    (getPaymentStatus as jest.Mock).mockResolvedValue({
      status: "reserved",
    });

    (capturePayment as jest.Mock).mockResolvedValue({
      status: "ok",
    });

    const response = await request(app)
      .post("/api/payments/status")
      .send({ itemId: "item123", clientId: "client123", status: "accepted" });

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.text).toBe("Payment for item = item123 successful!");
  });
});