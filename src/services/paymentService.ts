import axios, { AxiosResponse } from "axios";

const BP_API_BASE_URL = "https://bp.pay/v2/payments";

interface CreatePaymentResponse {
  paymentReference: string;
  token: string;
}

interface PaymentStatusResponse {
  merchantReference: string;
  amount: number;
  currency: string;
  status: "initiated" | "reserved" | "error" | "captured";
}

interface CapturePaymentResponse {
  status: "ok" | "alreadyCaptured" | "error";
  errorMessage?: string;
}

export const createPayment = async (
  itemId: string,
  amount: number,
  currency: string,
  webhookCallbackUrl: string
): Promise<CreatePaymentResponse> => {
  try {
    const response: AxiosResponse<CreatePaymentResponse> = await axios.post(
      `${BP_API_BASE_URL}/create`,
      {
        merchantReference: itemId,
        amount: Math.round(amount * 100),
        currency,
        webhookCallbackUrl,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating payment:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getPaymentStatus = async (
  paymentReference: string
): Promise<PaymentStatusResponse> => {
  try {
    const response: AxiosResponse<PaymentStatusResponse> = await axios.get(
      `${BP_API_BASE_URL}/get`,
      {
        params: { paymentReference },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error getting payment status:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const capturePayment = async (
  paymentReference: string
): Promise<CapturePaymentResponse> => {
  try {
    const response: AxiosResponse<CapturePaymentResponse> = await axios.post(
      `${BP_API_BASE_URL}/capture`,
      { paymentReference }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error capturing payment:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
