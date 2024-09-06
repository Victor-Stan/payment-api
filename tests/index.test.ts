import request from "supertest";
import app from "../src/index";

describe("Index.ts", () => {
  it("should return a running message on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("running");
  });
});