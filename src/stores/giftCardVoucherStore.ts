import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GiftCard {
  id: string;
  cardNumber: string; // Last 4 digits visible
  balance: number;
  originalAmount: number;
  isActive: boolean;
  issuedDate: Date;
  expiryDate?: Date;
  purchasedBy?: string; // customer ID
  usageHistory: GiftCardTransaction[];
  createdAt: Date;
}

export interface GiftCardTransaction {
  id: string;
  giftCardId: string;
  amount: number;
  type: 'purchase' | 'redemption' | 'reload';
  transactionId?: string;
  date: Date;
  notes?: string;
}

export interface Voucher {
  id: string;
  code: string;
  value: number;
  type: 'percentage' | 'fixed';
  maxUses: number;
  usageCount: number;
  isActive: boolean;
  issuedDate: Date;
  expiryDate?: Date;
  minOrderAmount?: number;
  applicableProducts?: string[];
  redeemedBy?: string[]; // customer IDs
  createdAt: Date;
}

interface GiftCardVoucherState {
  giftCards: GiftCard[];
  vouchers: Voucher[];
  createGiftCard: (amount: number, expiryDate?: Date) => GiftCard;
  redeemGiftCard: (cardNumber: string, amount: number, transactionId: string) => boolean;
  reloadGiftCard: (cardNumber: string, amount: number) => void;
  createVoucher: (
    value: number,
    type: 'percentage' | 'fixed',
    maxUses: number,
    expiryDate?: Date
  ) => Voucher;
  redeemVoucher: (code: string, customerId: string) => Voucher | null;
  getGiftCardBalance: (cardNumber: string) => number;
  validateVoucher: (code: string, orderAmount: number) => Voucher | null;
  calculateVoucherDiscount: (voucherId: string, amount: number) => number;
}

export const useGiftCardVoucherStore = create<GiftCardVoucherState>()(
  persist(
    (set, get) => ({
      giftCards: [
        {
          id: 'gc-001',
          cardNumber: '****1234',
          balance: 50.0,
          originalAmount: 100.0,
          isActive: true,
          issuedDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-12-31'),
          usageHistory: [
            {
              id: 'gct-001',
              giftCardId: 'gc-001',
              amount: 50.0,
              type: 'redemption',
              date: new Date(),
              notes: 'Used in transaction',
            },
          ],
          createdAt: new Date(),
        },
      ],
      vouchers: [
        {
          id: 'vouch-001',
          code: 'WELCOME10',
          value: 10,
          type: 'percentage',
          maxUses: 100,
          usageCount: 25,
          isActive: true,
          issuedDate: new Date(),
          expiryDate: new Date('2025-12-31'),
          minOrderAmount: 25,
          redeemedBy: [],
          createdAt: new Date(),
        },
      ],

      createGiftCard: (amount, expiryDate) => {
        const giftCard: GiftCard = {
          id: `gc-${Date.now()}`,
          cardNumber: `****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          balance: amount,
          originalAmount: amount,
          isActive: true,
          issuedDate: new Date(),
          expiryDate,
          usageHistory: [],
          createdAt: new Date(),
        };

        set((state) => ({
          giftCards: [...state.giftCards, giftCard],
        }));

        return giftCard;
      },

      redeemGiftCard: (cardNumber, amount, transactionId) => {
        let success = false;

        set((state) => {
          const giftCard = state.giftCards.find((gc) => gc.cardNumber === cardNumber);
          if (!giftCard || !giftCard.isActive || giftCard.balance < amount) {
            return state;
          }

          success = true;

          return {
            giftCards: state.giftCards.map((gc) =>
              gc.id === giftCard.id
                ? {
                    ...gc,
                    balance: gc.balance - amount,
                    usageHistory: [
                      ...gc.usageHistory,
                      {
                        id: `gct-${Date.now()}`,
                        giftCardId: gc.id,
                        amount,
                        type: 'redemption',
                        transactionId,
                        date: new Date(),
                      },
                    ],
                  }
                : gc
            ),
          };
        });

        return success;
      },

      reloadGiftCard: (cardNumber, amount) => {
        set((state) => {
          const giftCard = state.giftCards.find((gc) => gc.cardNumber === cardNumber);
          if (!giftCard) return state;

          return {
            giftCards: state.giftCards.map((gc) =>
              gc.id === giftCard.id
                ? {
                    ...gc,
                    balance: gc.balance + amount,
                    usageHistory: [
                      ...gc.usageHistory,
                      {
                        id: `gct-${Date.now()}`,
                        giftCardId: gc.id,
                        amount,
                        type: 'reload',
                        date: new Date(),
                      },
                    ],
                  }
                : gc
            ),
          };
        });
      },

      createVoucher: (value, type, maxUses, expiryDate) => {
        const voucher: Voucher = {
          id: `vouch-${Date.now()}`,
          code: `VOUCH${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          value,
          type,
          maxUses,
          usageCount: 0,
          isActive: true,
          issuedDate: new Date(),
          expiryDate,
          redeemedBy: [],
          createdAt: new Date(),
        };

        set((state) => ({
          vouchers: [...state.vouchers, voucher],
        }));

        return voucher;
      },

      redeemVoucher: (code, customerId) => {
        let redeemed = false;

        set((state) => {
          const voucher = state.vouchers.find(
            (v) => v.code === code && v.isActive && v.usageCount < v.maxUses
          );

          if (!voucher) return state;

          redeemed = true;

          return {
            vouchers: state.vouchers.map((v) =>
              v.id === voucher.id
                ? {
                    ...v,
                    usageCount: v.usageCount + 1,
                    redeemedBy: [...(v.redeemedBy || []), customerId],
                  }
                : v
            ),
          };
        });

        return redeemed ? get().vouchers.find((v) => v.code === code) || null : null;
      },

      getGiftCardBalance: (cardNumber) => {
        const giftCard = get().giftCards.find((gc) => gc.cardNumber === cardNumber);
        return giftCard?.balance || 0;
      },

      validateVoucher: (code, orderAmount) => {
        const voucher = get().vouchers.find(
          (v) =>
            v.code === code &&
            v.isActive &&
            v.usageCount < v.maxUses &&
            (!v.expiryDate || v.expiryDate > new Date()) &&
            (!v.minOrderAmount || orderAmount >= v.minOrderAmount)
        );
        return voucher || null;
      },

      calculateVoucherDiscount: (voucherId, amount) => {
        const voucher = get().vouchers.find((v) => v.id === voucherId);
        if (!voucher) return 0;

        if (voucher.type === 'percentage') {
          return Math.round(((amount * voucher.value) / 100) * 100) / 100;
        } else {
          return Math.min(voucher.value, amount);
        }
      },
    }),
    {
      name: 'gift-card-voucher-store',
    }
  )
);
