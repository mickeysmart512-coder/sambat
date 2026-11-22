export type PaymentResult = { status: 'success' | 'failed' | 'pending'; providerReference: string };
export interface PaymentProvider {
  createPayment(input: { orderReference: string; amount: number; currency: string }): Promise<PaymentResult>;
  verifyPayment(providerReference: string): Promise<PaymentResult>;
}

export class DummyPaymentProvider implements PaymentProvider {
  async createPayment(input: { orderReference: string }): Promise<PaymentResult> {
    const outcome = process.env.DUMMY_PAYMENT_OUTCOME || 'success';
    return { status: outcome === 'failed' ? 'failed' : outcome === 'pending' ? 'pending' : 'success', providerReference: `dummy_${input.orderReference}` };
  }
  async verifyPayment(providerReference: string): Promise<PaymentResult> {
    return { status: 'success', providerReference };
  }
}

export const paymentProvider: PaymentProvider = new DummyPaymentProvider();
