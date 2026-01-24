import { paystackClient } from "../config/paystack";


//initialize payment
export const initializePayment = async (email: string, amount: number, metadata?: any) => {

  const response = await paystackClient.post("/transaction/initialize", {
    email,
    amount: amount * 100,  // Paystack accepts amount in kobo/cent
    metadata,
  });

  return response.data;
};

//verify payment
export const verifyPayment = async (reference: string) => {

  const response = await paystackClient.get(`/transaction/verify/${reference}`);

  return response.data;
};

//refund payment
export const refundPayment = async (reference: string, amount?: number) => {
  const response = await paystackClient.post("/refund", {
    transaction: reference,
    amount: amount ? amount * 100 : undefined,
  });

  return response.data;
}