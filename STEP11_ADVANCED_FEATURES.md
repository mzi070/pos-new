# Step 11 - Advanced Features Enhancement Guide

## Overview
Step 11 adds enterprise-grade features to the POS system including multi-store management, employee time tracking, advanced discount rules, gift cards/vouchers, return processing, email receipts, and payment gateway integration.

---

## 🏪 1. Multi-Store Support

### Store Location Management

**File:** `src/stores/storeLocationStore.ts`

Manage multiple store locations with independent inventory and transactions.

#### Usage:
```tsx
import { useStoreLocationStore } from '@/stores/storeLocationStore';

function StoreSelector() {
  const { locations, selectedLocationId, selectLocation } = useStoreLocationStore();

  return (
    <select value={selectedLocationId || ''} onChange={(e) => selectLocation(e.target.value)}>
      {locations.map((loc) => (
        <option key={loc.id} value={loc.id}>
          {loc.name} - {loc.city}
        </option>
      ))}
    </select>
  );
}
```

#### Features:
- ✅ Store location CRUD operations
- ✅ Latitude/longitude coordinates
- ✅ Store manager assignment
- ✅ Active/inactive status
- ✅ Contact information management
- ✅ Location-based transaction tracking
- ✅ LocalStorage persistence

#### Data Model:
```typescript
interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  isActive: boolean;
  coordinates?: { lat: number; lng: number };
  createdAt: Date;
}
```

---

## 👥 2. Employee Management & Time Tracking

### Employee Management

**File:** `src/stores/employeeStore.ts`

Track employee profiles, roles, wages, and time sheets.

#### Usage:
```tsx
import { useEmployeeStore } from '@/stores/employeeStore';

function EmployeeClockIn({ employeeId }) {
  const { clockIn, clockOut, getTotalHours } = useEmployeeStore();

  const handleClockIn = () => {
    clockIn(employeeId, 'loc-001');
  };

  const handleClockOut = () => {
    clockOut(employeeId);
  };

  const hours = getTotalHours(employeeId, new Date('2024-01-01'), new Date());

  return (
    <div>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
      <p>Total Hours This Period: {hours}</p>
    </div>
  );
}
```

#### Features:
- ✅ Employee profiles with wages
- ✅ Clock in/out functionality
- ✅ Break tracking
- ✅ Time sheet management
- ✅ Employee role assignment (5 roles)
- ✅ Attendance reports
- ✅ Total hours calculation
- ✅ SSN and emergency contact storage

#### Employee Roles:
- `admin` - Full system access
- `manager` - Store management
- `cashier` - POS operations
- `stock` - Inventory management
- `supervisor` - Team oversight

#### Shift Record:
```typescript
interface ShiftRecord {
  id: string;
  employeeId: string;
  date: Date;
  clockInTime: Date;
  clockOutTime?: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  totalBreakMinutes: number;
  notes?: string;
  storeLocationId: string;
}
```

---

## 💰 3. Advanced Discount System

### Discount Management

**File:** `src/stores/discountStore.ts`

Create and manage complex discount rules including BOGO, percentage, fixed amount, and conditional discounts.

#### Usage:
```tsx
import { useDiscountStore } from '@/stores/discountStore';

function ApplyDiscount({ orderAmount }) {
  const { getActiveDiscounts, calculateDiscount, applyDiscount } = useDiscountStore();

  const activeDiscounts = getActiveDiscounts();

  const handleApplyDiscount = (discountId) => {
    const discountAmount = calculateDiscount(discountId, orderAmount);
    applyDiscount(discountId);
    console.log(`Discount applied: $${discountAmount}`);
  };

  return (
    <div>
      {activeDiscounts.map((discount) => (
        <button key={discount.id} onClick={() => handleApplyDiscount(discount.id)}>
          {discount.name} - {discount.description}
        </button>
      ))}
    </div>
  );
}
```

#### Discount Types:
- **Percentage**: Discount by percentage (0-100%)
- **Fixed**: Fixed dollar amount off
- **BOGO**: Buy One Get One deals
- **Conditional**: Minimum order amount required

#### Features:
- ✅ Product-specific discounts
- ✅ Category-wide discounts
- ✅ Minimum order requirements
- ✅ Maximum discount cap
- ✅ Usage limits and tracking
- ✅ Date-based activation
- ✅ BOGO configurations
- ✅ Usage analytics

#### Discount Model:
```typescript
interface Discount {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'conditional';
  value: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  minOrderAmount?: number;
  maxDiscount?: number;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  usageLimit?: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎁 4. Gift Cards & Voucher System

### Gift Card & Voucher Management

**File:** `src/stores/giftCardVoucherStore.ts`

Create, track, and redeem gift cards and promotional vouchers.

#### Usage:
```tsx
import { useGiftCardVoucherStore } from '@/stores/giftCardVoucherStore';

function GiftCardCheckout({ cardNumber, amount }) {
  const { redeemGiftCard, getGiftCardBalance } = useGiftCardVoucherStore();

  const balance = getGiftCardBalance(cardNumber);
  const canRedeem = balance >= amount;

  const handleRedeem = (transactionId) => {
    const success = redeemGiftCard(cardNumber, amount, transactionId);
    if (success) {
      console.log(`Redeemed $${amount} from card`);
    }
  };

  return (
    <div>
      <p>Card Balance: ${balance.toFixed(2)}</p>
      <button disabled={!canRedeem} onClick={() => handleRedeem('txn-123')}>
        Redeem ${amount}
      </button>
    </div>
  );
}
```

#### Features - Gift Cards:
- ✅ Gift card creation with initial balance
- ✅ Reload functionality
- ✅ Transaction history per card
- ✅ Expiry date management
- ✅ Active/inactive status
- ✅ Balance tracking
- ✅ Last 4 digits display for security

#### Features - Vouchers:
- ✅ Unique voucher code generation
- ✅ Percentage or fixed value
- ✅ Maximum usage limits
- ✅ Expiry date tracking
- ✅ Minimum order requirements
- ✅ Product-specific applicability
- ✅ Redemption history

#### Gift Card Model:
```typescript
interface GiftCard {
  id: string;
  cardNumber: string;
  balance: number;
  originalAmount: number;
  isActive: boolean;
  issuedDate: Date;
  expiryDate?: Date;
  purchasedBy?: string;
  usageHistory: GiftCardTransaction[];
  createdAt: Date;
}
```

---

## 🔄 5. Return & Refund Management

### Return Processing Workflow

**File:** `src/stores/returnManagementStore.ts`

Comprehensive return and refund processing with policies, approvals, and restocking.

#### Usage:
```tsx
import { useReturnManagementStore } from '@/stores/returnManagementStore';

function ProcessReturn({ transactionId, items }) {
  const { createReturn, approveReturn, completeReturn } = useReturnManagementStore();

  const handleCreateReturn = () => {
    const returnRecord = createReturn(transactionId, items);
    console.log(`Return created: ${returnRecord.id}`);
  };

  const handleApproveReturn = (returnId, refundAmount) => {
    approveReturn(returnId, refundAmount, 'Approved - good condition');
  };

  const handleCompleteReturn = (returnId) => {
    completeReturn(returnId, 'cash');
  };

  return (
    <div>
      <button onClick={handleCreateReturn}>Create Return Request</button>
    </div>
  );
}
```

#### Return Workflow:
1. **Pending** - Initial return request created
2. **Approved** - Manager approves refund
3. **Rejected** - Return denied with reason
4. **Completed** - Refund processed
5. **Cancelled** - Return cancelled

#### Features:
- ✅ Multi-item returns
- ✅ Return reasons tracking
- ✅ Approval workflow
- ✅ Refund method selection (cash, card, store credit, gift card)
- ✅ Restocking management
- ✅ Item condition tracking
- ✅ Return policies
- ✅ Refund calculations with fees
- ✅ Customer return history

#### Return Status Flow:
```typescript
type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
type ReturnReason = 'damaged' | 'defective' | 'wrong_item' | 'changed_mind' | 'other';
```

---

## 📧 6. Email Receipt System

### Email Service for Receipts

**File:** `src/utils/emailService.ts`

Send receipts and promotional emails with multiple SMTP providers.

#### Usage:
```tsx
import { emailService, generateReceiptEmail } from '@/utils/emailService';

// Configure once at startup
emailService.configure({
  provider: 'sendgrid',
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: 'receipts@store.com',
  fromName: 'Your Store',
  environment: 'production',
});

// Send receipt email
async function sendOrderReceipt(customerEmail, orderData) {
  const receipt = generateReceiptEmail(
    customerEmail,
    'REC-123456',
    orderData.items,
    orderData.subtotal,
    orderData.tax,
    orderData.total,
    'Your Store Name'
  );

  const result = await emailService.sendReceipt(receipt);
  if (result.success) {
    console.log(`Receipt sent: ${result.messageId}`);
  }
}
```

#### Supported Providers:
- ✅ **SMTP** - Generic SMTP servers
- ✅ **SendGrid** - SendGrid API
- ✅ **Mailgun** - Mailgun API
- ✅ **AWS SES** - Amazon SES

#### Features:
- ✅ HTML receipt templates
- ✅ Promotional email templates
- ✅ Retry logic (3 attempts)
- ✅ Batch email sending
- ✅ Webhook support
- ✅ Custom attachments
- ✅ Template variables

#### Email Configuration:
```typescript
interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  environment: 'sandbox' | 'production';
}
```

---

## 💳 7. Payment Gateway Integration

### Payment Processing

**File:** `src/utils/paymentGateway.ts`

Integrate Stripe, Square, and PayPal payment processors.

#### Usage:
```tsx
import { paymentGateway, validateCardDetails } from '@/utils/paymentGateway';

// Configure payment gateway
paymentGateway.configure({
  gateway: 'stripe',
  apiKey: process.env.STRIPE_API_KEY,
  environment: 'production',
});

// Process payment
async function processPayment(amount, description) {
  const result = await paymentGateway.processPayment({
    amount,
    currency: 'USD',
    description,
    customerEmail: 'customer@example.com',
  });

  if (result.success) {
    console.log(`Payment successful: ${result.transactionId}`);
  }
}

// Process refund
async function refundPayment(transactionId, amount) {
  const result = await paymentGateway.refundPayment(transactionId, amount);
  if (result.success) {
    console.log(`Refund successful: ${result.transactionId}`);
  }
}

// Validate card before payment
function validateCard(cardNumber, expiry, cvv) {
  const validation = validateCardDetails(cardNumber, expiry, cvv);
  if (!validation.valid) {
    console.error(validation.error);
  }
}
```

#### Supported Gateways:
- ✅ **Stripe** - Full payment processing
- ✅ **Square** - Square payments
- ✅ **PayPal** - PayPal integration

#### Payment Processing:
```typescript
interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail?: string;
  customerId?: string;
  paymentMethod?: string;
  metadata?: Record<string, string>;
}
```

#### Features:
- ✅ Multiple currency support
- ✅ Payment processing
- ✅ Refund processing
- ✅ Card validation (Luhn algorithm)
- ✅ Webhook handling
- ✅ Transaction history
- ✅ Sandbox & production modes
- ✅ Idempotency keys

#### Card Validation:
```tsx
// Validate card details
const validation = validateCardDetails('4242424242424242', '12/25', '123');

// Mask card number for display
const masked = maskCardNumber('4242424242424242'); // ****-****-****-4242
```

---

## 🔗 Integration Examples

### Complete Checkout Flow with Advanced Features

```tsx
import { useCartStore } from '@/stores/cartStore';
import { useDiscountStore } from '@/stores/discountStore';
import { useGiftCardVoucherStore } from '@/stores/giftCardVoucherStore';
import { paymentGateway } from '@/utils/paymentGateway';
import { emailService, generateReceiptEmail } from '@/utils/emailService';

function AdvancedCheckout() {
  const { items, clearCart } = useCartStore();
  const { getActiveDiscounts, calculateDiscount, applyDiscount } = useDiscountStore();
  const { validateVoucher, redeemVoucher, redeemGiftCard } = useGiftCardVoucherStore();

  let subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  let tax = subtotal * 0.07;
  let discount = 0;
  let finalTotal = subtotal + tax - discount;

  // Apply discount
  const handleApplyDiscount = (discountId) => {
    discount = calculateDiscount(discountId, subtotal);
    applyDiscount(discountId);
    finalTotal = subtotal + tax - discount;
  };

  // Apply voucher
  const handleApplyVoucher = (code) => {
    const voucher = validateVoucher(code, subtotal);
    if (voucher) {
      const voucherDiscount = discount + (subtotal * voucher.value) / 100;
      discount = voucherDiscount;
      finalTotal = subtotal + tax - discount;
      redeemVoucher(code, 'customer-id');
    }
  };

  // Process payment with Stripe
  const handlePayment = async () => {
    const paymentResult = await paymentGateway.processPayment({
      amount: finalTotal,
      currency: 'USD',
      description: `Order with ${items.length} items`,
      customerEmail: 'customer@example.com',
    });

    if (paymentResult.success) {
      // Send receipt email
      const receipt = generateReceiptEmail(
        'customer@example.com',
        paymentResult.transactionId || 'REC-001',
        items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          total: i.product.price * i.quantity,
        })),
        subtotal,
        tax,
        finalTotal,
        'Your Store'
      );

      await emailService.sendReceipt(receipt);
      clearCart();
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>
        <p>Discount: -${discount.toFixed(2)}</p>
        <h3>Total: ${finalTotal.toFixed(2)}</h3>
      </div>

      <div>
        <h4>Available Discounts:</h4>
        {getActiveDiscounts().map((discount) => (
          <button key={discount.id} onClick={() => handleApplyDiscount(discount.id)}>
            {discount.name}
          </button>
        ))}
      </div>

      <button onClick={handlePayment}>Complete Payment</button>
    </div>
  );
}
```

---

## 📊 Data Models Summary

### All New Stores:
1. **storeLocationStore** - Multi-store management
2. **employeeStore** - Employee profiles and time tracking
3. **discountStore** - Advanced discount rules
4. **giftCardVoucherStore** - Gift cards and vouchers
5. **returnManagementStore** - Returns and refunds

### All New Utilities:
1. **emailService** - Email receipt sending
2. **paymentGateway** - Payment processing

---

## ✅ Feature Checklist

### Multi-Store Support ✅
- [x] Store location CRUD
- [x] Location selector
- [x] Location-based transactions
- [x] Store manager assignment

### Employee Management ✅
- [x] Employee profiles
- [x] Time clock in/out
- [x] Break tracking
- [x] Total hours calculation
- [x] 5 employee roles
- [x] Attendance reports

### Advanced Discounts ✅
- [x] Percentage discounts
- [x] Fixed amount discounts
- [x] BOGO deals
- [x] Conditional discounts
- [x] Usage limits
- [x] Date-based activation

### Gift Cards ✅
- [x] Card creation
- [x] Balance tracking
- [x] Reload functionality
- [x] Transaction history
- [x] Expiry management

### Vouchers ✅
- [x] Unique code generation
- [x] Redemption tracking
- [x] Usage limits
- [x] Expiry dates

### Returns/Refunds ✅
- [x] Return workflow
- [x] Approval process
- [x] Refund policies
- [x] Restocking management
- [x] Return reasons

### Email Receipts ✅
- [x] HTML templates
- [x] Multiple providers
- [x] Retry logic
- [x] Batch sending

### Payment Gateways ✅
- [x] Stripe integration
- [x] Square integration
- [x] PayPal integration
- [x] Card validation
- [x] Refund processing

---

## 🚀 Future Enhancements

1. **Analytics Dashboard** - Multi-store analytics
2. **Loyalty Program Integration** - Link to gift cards
3. **Inventory Sync** - Real-time sync across locations
4. **Staff Scheduling** - Auto-scheduling based on availability
5. **Advanced Reporting** - Business intelligence
6. **Mobile App** - React Native mobile POS
7. **API Backend** - Node.js/Express API server
8. **Webhook Handlers** - Real-time payment notifications

---

## 📞 Support

For implementation help:
1. Review example components in `src/components/features/`
2. Check TypeScript interfaces for data structures
3. Review store functions for available methods
4. See integration examples above

---

**Step 11 Enhancement Complete!** 🎉

Total Features Added: 7 major features with 40+ methods
