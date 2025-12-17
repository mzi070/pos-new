import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type ReturnReason = 'damaged' | 'defective' | 'wrong_item' | 'changed_mind' | 'other';

export interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  originalPrice: number;
  reason: ReturnReason;
  notes?: string;
}

export interface Return {
  id: string;
  transactionId: string;
  customerId?: string;
  items: ReturnItem[];
  status: ReturnStatus;
  refundAmount: number;
  refundMethod: 'cash' | 'card' | 'store_credit' | 'gift_card';
  storeLocationId: string;
  processedBy?: string; // employee ID
  approvalNotes?: string;
  createdAt: Date;
  completedAt?: Date;
  restockDate?: Date;
}

export interface RestockRecord {
  id: string;
  returnId: string;
  productId: string;
  quantity: number;
  condition: 'sellable' | 'damaged' | 'unsellable';
  notes?: string;
  date: Date;
}

export interface RefundPolicy {
  id: string;
  name: string;
  returnWindowDays: number;
  requiresReceipt: boolean;
  allowPartialReturn: boolean;
  requiresInspection: boolean;
  appliedTo: 'all' | 'specific_products';
  applicableProductIds?: string[];
  restockFeePercentage: number;
  isActive: boolean;
  createdAt: Date;
}

interface ReturnManagementState {
  returns: Return[];
  restockRecords: RestockRecord[];
  refundPolicies: RefundPolicy[];
  createReturn: (
    transactionId: string,
    items: ReturnItem[],
    customerId?: string,
    storeLocationId?: string
  ) => Return;
  updateReturnStatus: (returnId: string, status: ReturnStatus, notes?: string) => void;
  approveReturn: (returnId: string, refundAmount: number, notes?: string) => void;
  rejectReturn: (returnId: string, notes?: string) => void;
  completeReturn: (returnId: string, refundMethod: 'cash' | 'card' | 'store_credit' | 'gift_card') => void;
  addRestockRecord: (
    returnId: string,
    productId: string,
    quantity: number,
    condition: 'sellable' | 'damaged' | 'unsellable'
  ) => void;
  calculateRefundAmount: (items: ReturnItem[], policyId?: string) => number;
  getReturnsByCustomer: (customerId: string) => Return[];
  getReturnsByStatus: (status: ReturnStatus) => Return[];
  createRefundPolicy: (policy: Omit<RefundPolicy, 'id' | 'createdAt'>) => void;
}

export const useReturnManagementStore = create<ReturnManagementState>()(
  persist(
    (set, get) => ({
      returns: [],
      restockRecords: [],
      refundPolicies: [
        {
          id: 'policy-001',
          name: 'Standard Return Policy',
          returnWindowDays: 30,
          requiresReceipt: true,
          allowPartialReturn: true,
          requiresInspection: true,
          appliedTo: 'all',
          restockFeePercentage: 10,
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: 'policy-002',
          name: 'Electronics Return Policy',
          returnWindowDays: 14,
          requiresReceipt: true,
          allowPartialReturn: false,
          requiresInspection: true,
          appliedTo: 'specific_products',
          applicableProductIds: [],
          restockFeePercentage: 15,
          isActive: true,
          createdAt: new Date(),
        },
      ],

      createReturn: (transactionId, items, customerId, storeLocationId = 'loc-001') => {
        const returnRecord: Return = {
          id: `ret-${Date.now()}`,
          transactionId,
          customerId,
          items,
          status: 'pending',
          refundAmount: 0,
          refundMethod: 'cash',
          storeLocationId,
          createdAt: new Date(),
        };

        set((state) => ({
          returns: [...state.returns, returnRecord],
        }));

        return returnRecord;
      },

      updateReturnStatus: (returnId, status, notes) => {
        set((state) => ({
          returns: state.returns.map((ret) =>
            ret.id === returnId
              ? { ...ret, status, approvalNotes: notes }
              : ret
          ),
        }));
      },

      approveReturn: (returnId, refundAmount, notes) => {
        set((state) => ({
          returns: state.returns.map((ret) =>
            ret.id === returnId
              ? {
                  ...ret,
                  status: 'approved',
                  refundAmount,
                  approvalNotes: notes,
                }
              : ret
          ),
        }));
      },

      rejectReturn: (returnId, notes) => {
        set((state) => ({
          returns: state.returns.map((ret) =>
            ret.id === returnId
              ? { ...ret, status: 'rejected', approvalNotes: notes }
              : ret
          ),
        }));
      },

      completeReturn: (returnId, refundMethod) => {
        set((state) => ({
          returns: state.returns.map((ret) =>
            ret.id === returnId
              ? {
                  ...ret,
                  status: 'completed',
                  refundMethod,
                  completedAt: new Date(),
                }
              : ret
          ),
        }));
      },

      addRestockRecord: (returnId, productId, quantity, condition) => {
        const record: RestockRecord = {
          id: `restock-${Date.now()}`,
          returnId,
          productId,
          quantity,
          condition,
          date: new Date(),
        };

        set((state) => ({
          restockRecords: [...state.restockRecords, record],
        }));
      },

      calculateRefundAmount: (items, policyId) => {
        let totalRefund = 0;
        let restockFeePercentage = 10;

        if (policyId) {
          const policy = get().refundPolicies.find((p) => p.id === policyId);
          if (policy) {
            restockFeePercentage = policy.restockFeePercentage;
          }
        }

        items.forEach((item) => {
          const itemTotal = item.originalPrice * item.quantity;
          const restockFee = (itemTotal * restockFeePercentage) / 100;
          totalRefund += itemTotal - restockFee;
        });

        return Math.round(totalRefund * 100) / 100;
      },

      getReturnsByCustomer: (customerId) => {
        return get().returns.filter((ret) => ret.customerId === customerId);
      },

      getReturnsByStatus: (status) => {
        return get().returns.filter((ret) => ret.status === status);
      },

      createRefundPolicy: (policy) => {
        set((state) => ({
          refundPolicies: [
            ...state.refundPolicies,
            {
              ...policy,
              id: `policy-${Date.now()}`,
              createdAt: new Date(),
            },
          ],
        }));
      },
    }),
    {
      name: 'return-management-store',
    }
  )
);
