import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DiscountType = 'percentage' | 'fixed' | 'bogo' | 'conditional';

export interface Discount {
  id: string;
  name: string;
  description: string;
  type: DiscountType;
  value: number; // percentage (0-100) or fixed amount
  applicableProducts?: string[]; // product IDs
  applicableCategories?: string[]; // category IDs
  minOrderAmount?: number;
  maxDiscount?: number;
  bogoType?: 'buy1get1' | 'buy2get1' | 'custom'; // for BOGO
  bogoGetQuantity?: number; // for BOGO
  bogoGetPercentage?: number; // percentage off for second item
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  usageLimit?: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DiscountState {
  discounts: Discount[];
  addDiscount: (discount: Omit<Discount, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  updateDiscount: (id: string, discount: Partial<Discount>) => void;
  deleteDiscount: (id: string) => void;
  getActiveDiscounts: () => Discount[];
  getDiscountsForProduct: (productId: string) => Discount[];
  calculateDiscount: (discountId: string, amount: number) => number;
  applyDiscount: (discountId: string) => void;
}

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set, get) => ({
      discounts: [
        {
          id: 'disc-001',
          name: 'Summer Sale',
          description: '20% off all products',
          type: 'percentage',
          value: 20,
          isActive: true,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-08-31'),
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'disc-002',
          name: 'Buy One Get One Free',
          description: 'Buy 1, Get 1 Free on selected items',
          type: 'bogo',
          value: 0,
          bogoType: 'buy1get1',
          bogoGetPercentage: 100,
          applicableProducts: [],
          isActive: true,
          startDate: new Date(),
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'disc-003',
          name: '$5 Off',
          description: 'Fixed $5 off on purchases over $25',
          type: 'fixed',
          value: 5,
          minOrderAmount: 25,
          isActive: true,
          startDate: new Date(),
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      addDiscount: (discount) => {
        set((state) => ({
          discounts: [
            ...state.discounts,
            {
              ...discount,
              id: `disc-${Date.now()}`,
              usageCount: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
      },

      updateDiscount: (id, updates) => {
        set((state) => ({
          discounts: state.discounts.map((disc) =>
            disc.id === id ? { ...disc, ...updates, updatedAt: new Date() } : disc
          ),
        }));
      },

      deleteDiscount: (id) => {
        set((state) => ({
          discounts: state.discounts.filter((disc) => disc.id !== id),
        }));
      },

      getActiveDiscounts: () => {
        const now = new Date();
        return get().discounts.filter(
          (disc) =>
            disc.isActive &&
            disc.startDate <= now &&
            (!disc.endDate || disc.endDate >= now) &&
            (!disc.usageLimit || disc.usageCount < disc.usageLimit)
        );
      },

      getDiscountsForProduct: (productId) => {
        return get()
          .getActiveDiscounts()
          .filter(
            (disc) =>
              !disc.applicableProducts ||
              disc.applicableProducts.length === 0 ||
              disc.applicableProducts.includes(productId)
          );
      },

      calculateDiscount: (discountId, amount) => {
        const discount = get().discounts.find((d) => d.id === discountId);
        if (!discount || !discount.isActive) return 0;

        if (discount.minOrderAmount && amount < discount.minOrderAmount) {
          return 0;
        }

        let discountAmount = 0;

        if (discount.type === 'percentage') {
          discountAmount = (amount * discount.value) / 100;
        } else if (discount.type === 'fixed') {
          discountAmount = discount.value;
        }

        if (discount.maxDiscount) {
          discountAmount = Math.min(discountAmount, discount.maxDiscount);
        }

        return Math.round(discountAmount * 100) / 100;
      },

      applyDiscount: (discountId) => {
        set((state) => ({
          discounts: state.discounts.map((disc) =>
            disc.id === discountId
              ? { ...disc, usageCount: disc.usageCount + 1 }
              : disc
          ),
        }));
      },
    }),
    {
      name: 'discount-store',
    }
  )
);
