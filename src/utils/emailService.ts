/**
 * Email Service for Receipt and Notification Sending
 * Supports multiple SMTP providers with retry logic
 */

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
  apiKey?: string;
  apiSecret?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailReceipt {
  to: string;
  subject: string;
  htmlContent: string;
  attachments?: { filename: string; content: string; type: string }[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryCount: number;
}

class EmailService {
  private config: EmailConfig | null = null;
  private maxRetries = 3;
  private retryDelay = 1000; // ms

  /**
   * Initialize email service with configuration
   */
  configure(config: EmailConfig): void {
    this.config = config;
  }

  /**
   * Send receipt email
   */
  async sendReceipt(receipt: EmailReceipt, retryCount = 0): Promise<EmailResult> {
    if (!this.config) {
      return {
        success: false,
        error: 'Email service not configured',
        retryCount,
      };
    }

    try {
      const result = await this.send(receipt);
      return {
        success: true,
        messageId: result,
        retryCount,
      };
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.sendReceipt(receipt, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount,
      };
    }
  }

  /**
   * Send multiple receipts in batch
   */
  async sendReceiptBatch(receipts: EmailReceipt[]): Promise<EmailResult[]> {
    return Promise.all(receipts.map((receipt) => this.sendReceipt(receipt)));
  }

  /**
   * Private method to handle actual sending
   */
  private async send(email: EmailReceipt): Promise<string> {
    if (!this.config) throw new Error('Email service not configured');

    switch (this.config.provider) {
      case 'smtp':
        return this.sendViaSMTP(email);
      case 'sendgrid':
        return this.sendViaSendGrid(email);
      case 'mailgun':
        return this.sendViaMailgun(email);
      case 'ses':
        return this.sendViaSES(email);
      default:
        throw new Error(`Unknown email provider: ${this.config.provider}`);
    }
  }

  /**
   * Send via SMTP (generic)
   */
  private async sendViaSMTP(email: EmailReceipt): Promise<string> {
    if (!this.config?.host || !this.config?.port) {
      throw new Error('SMTP configuration incomplete');
    }

    // In a real implementation, you'd use nodemailer or similar
    // For now, we'll simulate the send
    console.log(`Sending via SMTP to ${email.to}:`, email.subject);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`mock-message-id-${Date.now()}`);
      }, 100);
    });
  }

  /**
   * Send via SendGrid API
   */
  private async sendViaSendGrid(email: EmailReceipt): Promise<string> {
    if (!this.config?.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: email.to }],
              subject: email.subject,
            },
          ],
          from: {
            email: this.config.fromEmail,
            name: this.config.fromName,
          },
          content: [
            {
              type: 'text/html',
              value: email.htmlContent,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.statusText}`);
      }

      return `sendgrid-${Date.now()}`;
    } catch (error) {
      throw new Error(`SendGrid error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  /**
   * Send via Mailgun API
   */
  private async sendViaMailgun(email: EmailReceipt): Promise<string> {
    if (!this.config?.apiKey) {
      throw new Error('Mailgun API key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('from', `${this.config.fromName} <${this.config.fromEmail}>`);
      formData.append('to', email.to);
      formData.append('subject', email.subject);
      formData.append('html', email.htmlContent);

      const response = await fetch('https://api.mailgun.net/v3/YOUR_DOMAIN/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${this.config.apiKey}`)}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Mailgun API error: ${response.statusText}`);
      }

      const data = (await response.json()) as { id: string };
      return data.id;
    } catch (error) {
      throw new Error(`Mailgun error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  /**
   * Send via AWS SES
   */
  private async sendViaSES(email: EmailReceipt): Promise<string> {
    // AWS SES would typically use AWS SDK
    // This is a placeholder for demonstration
    console.log(`Sending via SES to ${email.to}:`, email.subject);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`ses-${Date.now()}`);
      }, 100);
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();

/**
 * Generate receipt HTML email
 */
export function generateReceiptEmail(
  customerEmail: string,
  receiptNumber: string,
  items: Array<{ name: string; quantity: number; price: number; total: number }>,
  subtotal: number,
  tax: number,
  total: number,
  storeName: string
): EmailReceipt {
  const itemsHTML = items
    .map(
      (item) =>
        `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.total.toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  return {
    to: customerEmail,
    subject: `Your Receipt from ${storeName} - #${receiptNumber}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
            .receipt-number { font-size: 14px; color: #666; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f0f0f0; padding: 10px; text-align: left; }
            .totals { margin-top: 20px; border-top: 2px solid #2563eb; padding-top: 10px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { font-size: 18px; font-weight: bold; color: #2563eb; margin-top: 10px; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${storeName}</h1>
              <p>Thank you for your purchase!</p>
            </div>
            <div class="content">
              <div class="receipt-number">Receipt #${receiptNumber}</div>
              <div class="receipt-number">Date: ${new Date().toLocaleString()}</div>
              
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: right;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <div class="totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Tax:</span>
                  <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="total-row grand-total">
                  <span>Total:</span>
                  <span>$${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>We appreciate your business!</p>
              <p style="margin-top: 15px; font-size: 11px;">This is an automated email. Please do not reply to this email address.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

/**
 * Generate promotional email
 */
export function generatePromoEmail(
  customerEmail: string,
  promoTitle: string,
  promoDescription: string,
  promoCode: string,
  expiryDate: Date,
  storeName: string
): EmailReceipt {
  return {
    to: customerEmail,
    subject: `${promoTitle} - Special Offer from ${storeName}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; border: 1px solid #ddd; text-align: center; }
            .code-box { background-color: #2563eb; color: white; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 24px; font-weight: bold; font-family: monospace; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${promoTitle}</h1>
            </div>
            <div class="content">
              <p>${promoDescription}</p>
              <div class="code-box">${promoCode}</div>
              <p style="color: #666; font-size: 14px;">Expires: ${expiryDate.toLocaleDateString()}</p>
            </div>
            <div class="footer">
              <p>Visit us today at ${storeName} to redeem this offer!</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
