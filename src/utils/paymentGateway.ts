/**
 * Payment Gateway Integration
 * Supports Stripe, Square, and other payment processors
 */

export type PaymentGateway = 'stripe' | 'square' | 'paypal';

export interface PaymentConfig {
  gateway: PaymentGateway;
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
  environment: 'sandbox' | 'production';
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail?: string;
  customerId?: string;
  paymentMethod?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface Webhook {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
  processed: boolean;
}

class PaymentGatewayService {
  private config: PaymentConfig | null = null;
  private webhooks: Webhook[] = [];

  /**
   * Configure payment gateway
   */
  configure(config: PaymentConfig): void {
    this.config = config;
  }

  /**
   * Process payment
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!this.config) {
      return { success: false, error: 'Payment gateway not configured' };
    }

    switch (this.config.gateway) {
      case 'stripe':
        return this.processStripePayment(request);
      case 'square':
        return this.processSquarePayment(request);
      case 'paypal':
        return this.processPayPalPayment(request);
      default:
        return { success: false, error: `Unknown gateway: ${this.config.gateway}` };
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    if (!this.config) {
      return { success: false, error: 'Payment gateway not configured' };
    }

    switch (this.config.gateway) {
      case 'stripe':
        return this.refundStripePayment(transactionId, amount);
      case 'square':
        return this.refundSquarePayment(transactionId, amount);
      default:
        return { success: false, error: `Refund not supported for ${this.config.gateway}` };
    }
  }

  /**
   * Handle webhook event
   */
  handleWebhook(event: Record<string, unknown>): boolean {
    if (!this.config?.webhookSecret) return false;

    try {
      const webhook: Webhook = {
        id: `webhook-${Date.now()}`,
        type: event.type as string,
        data: event,
        timestamp: new Date(),
        processed: false,
      };

      this.webhooks.push(webhook);
      return true;
    } catch (error) {
      console.error('Webhook error:', error);
      return false;
    }
  }

  /**
   * Get webhook history
   */
  getWebhooks(limit: number = 10): Webhook[] {
    return this.webhooks.slice(-limit);
  }

  // ============ STRIPE IMPLEMENTATION ============

  private async processStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config?.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: Math.round(request.amount * 100).toString(),
          currency: request.currency,
          description: request.description,
          metadata: JSON.stringify(request.metadata || {}),
        }),
      });

      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        id: string;
        status: string;
      };

      return {
        success: data.status === 'succeeded' || data.status === 'requires_action',
        transactionId: data.id,
        status: data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async refundStripePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch('https://api.stripe.com/v1/refunds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config?.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          payment_intent: transactionId,
          ...(amount && { amount: Math.round(amount * 100).toString() }),
        }),
      });

      if (!response.ok) {
        throw new Error(`Stripe refund error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        id: string;
        status: string;
      };

      return {
        success: data.status === 'succeeded',
        transactionId: data.id,
        status: data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============ SQUARE IMPLEMENTATION ============

  private async processSquarePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(
        this.config?.environment === 'production'
          ? 'https://connect.squareup.com/v2/payments'
          : 'https://connect.squareupsandbox.com/v2/payments',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config?.apiKey}`,
            'Content-Type': 'application/json',
            'Square-Version': '2024-01-18',
          },
          body: JSON.stringify({
            source_id: request.paymentMethod || 'CARD_NONCE_OK',
            amount_money: {
              amount: Math.round(request.amount * 100),
              currency: request.currency,
            },
            idempotency_key: `key-${Date.now()}`,
            note: request.description,
            customer_id: request.customerId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Square API error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        payment: { id: string; status: string };
      };

      return {
        success: data.payment.status === 'COMPLETED',
        transactionId: data.payment.id,
        status: data.payment.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async refundSquarePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(
        this.config?.environment === 'production'
          ? `https://connect.squareup.com/v2/refunds`
          : `https://connect.squareupsandbox.com/v2/refunds`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config?.apiKey}`,
            'Content-Type': 'application/json',
            'Square-Version': '2024-01-18',
          },
          body: JSON.stringify({
            payment_id: transactionId,
            idempotency_key: `refund-${Date.now()}`,
            ...(amount && {
              amount_money: {
                amount: Math.round(amount * 100),
                currency: 'USD',
              },
            }),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Square refund error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        refund: { id: string; status: string };
      };

      return {
        success: data.refund.status === 'COMPLETED',
        transactionId: data.refund.id,
        status: data.refund.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============ PAYPAL IMPLEMENTATION ============

  private async processPayPalPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Get access token first
      const tokenResponse = await fetch(
        this.config?.environment === 'production'
          ? 'https://api.paypal.com/v1/oauth2/token'
          : 'https://api.sandbox.paypal.com/v1/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.config?.apiKey}:${this.config?.apiSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        }
      );

      if (!tokenResponse.ok) {
        throw new Error('PayPal authentication failed');
      }

      const { access_token } = (await tokenResponse.json()) as { access_token: string };

      // Create payment
      const paymentResponse = await fetch(
        this.config?.environment === 'production'
          ? 'https://api.paypal.com/v2/checkout/orders'
          : 'https://api.sandbox.paypal.com/v2/checkout/orders',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  value: request.amount.toString(),
                  currency_code: request.currency,
                },
                description: request.description,
              },
            ],
          }),
        }
      );

      if (!paymentResponse.ok) {
        throw new Error('PayPal payment creation failed');
      }

      const data = (await paymentResponse.json()) as {
        id: string;
        status: string;
      };

      return {
        success: true,
        transactionId: data.id,
        status: data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const paymentGateway = new PaymentGatewayService();

/**
 * Payment validation utilities
 */
export function validateCardDetails(
  cardNumber: string,
  expiry: string,
  cvv: string
): { valid: boolean; error?: string } {
  // Remove spaces and dashes
  const cleanCardNumber = cardNumber.replace(/[\s-]/g, '');

  // Basic length check
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    return { valid: false, error: 'Invalid card number length' };
  }

  // Luhn algorithm check
  if (!luhnCheck(cleanCardNumber)) {
    return { valid: false, error: 'Invalid card number' };
  }

  // Expiry check
  const [month, year] = expiry.split('/');
  const expDate = new Date(Number(`20${year}`), Number(month));
  if (expDate < new Date()) {
    return { valid: false, error: 'Card expired' };
  }

  // CVV check
  if (!/^\d{3,4}$/.test(cvv)) {
    return { valid: false, error: 'Invalid CVV' };
  }

  return { valid: true };
}

/**
 * Luhn algorithm for card validation
 */
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = Number(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Format card number for display
 */
export function maskCardNumber(cardNumber: string): string {
  const lastFour = cardNumber.slice(-4);
  return `****-****-****-${lastFour}`;
}
