interface Receipt {
  transactionId: string;
  date: Date;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
}

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export function generateReceiptHTML(receipt: Receipt): string {
  const dateStr = receipt.date.toLocaleString();
  const itemsHTML = receipt.items
    .map(
      (item) =>
        `<tr>
      <td>${item.name}</td>
      <td style="text-align: right;">${item.quantity}</td>
      <td style="text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="text-align: right;">$${item.total.toFixed(2)}</td>
    </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Receipt #${receipt.transactionId}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            max-width: 80mm;
            margin: 0;
            padding: 10mm;
            font-size: 12px;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .receipt-id {
            text-align: center;
            margin: 10px 0;
          }
          .customer-info {
            margin: 10px 0;
            padding: 10px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
          }
          table {
            width: 100%;
            margin: 10px 0;
            border-collapse: collapse;
          }
          th {
            text-align: left;
            border-bottom: 1px solid #000;
            padding: 5px 0;
          }
          td {
            padding: 5px 0;
          }
          .totals {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #000;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .grand-total {
            font-weight: bold;
            font-size: 14px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body { margin: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          POS SYSTEM
        </div>
        <div class="receipt-id">
          Receipt #${receipt.transactionId}
        </div>
        <div class="receipt-id">
          ${dateStr}
        </div>
        ${receipt.customerName ? `<div class="customer-info">Customer: ${receipt.customerName}</div>` : ''}
        
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
            <span>$${receipt.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>$${receipt.tax.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>$${receipt.total.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Payment: ${receipt.paymentMethod}</span>
          </div>
        </div>

        <div class="footer">
          Thank you for your purchase!
          <br />
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `;
}

export function printReceipt(receipt: Receipt): void {
  const htmlContent = generateReceiptHTML(receipt);
  const printWindow = window.open('', '', 'width=80mm,height=100mm');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
}

export function generateReportHTML(title: string, data: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
          }
          .report-meta {
            color: #666;
            font-size: 12px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #2563eb;
            color: white;
            padding: 10px;
            text-align: left;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
          @media print {
            body { margin: 0; }
            h1 { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="report-meta">
          Generated on ${new Date().toLocaleString()}
        </div>
        ${data}
      </body>
    </html>
  `;
}

export function printReport(title: string, data: string): void {
  const htmlContent = generateReportHTML(title, data);
  const printWindow = window.open('', '', 'width=1200,height=800');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
}

export function exportToPDF(filename: string, htmlContent: string): void {
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  element.style.display = 'none';
  document.body.appendChild(element);

  const printWindow = window.open('', '', 'width=1200,height=800');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${filename}</title>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  document.body.removeChild(element);
}
