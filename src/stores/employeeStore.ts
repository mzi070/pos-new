import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EmployeeRole = 'admin' | 'manager' | 'cashier' | 'stock' | 'supervisor';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  storeLocationId: string;
  hireDate: Date;
  hourlyWage: number;
  isActive: boolean;
  ssn?: string; // Last 4 digits
  emergencyContact?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftRecord {
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

interface EmployeeState {
  employees: Employee[];
  shiftRecords: ShiftRecord[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  clockIn: (employeeId: string, storeLocationId: string) => ShiftRecord;
  clockOut: (employeeId: string) => void;
  startBreak: (recordId: string) => void;
  endBreak: (recordId: string) => void;
  getEmployeeShifts: (employeeId: string, startDate: Date, endDate: Date) => ShiftRecord[];
  getTotalHours: (employeeId: string, startDate: Date, endDate: Date) => number;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      employees: [
        {
          id: 'emp-001',
          name: 'John Doe',
          email: 'john@store.com',
          phone: '(555) 111-1111',
          role: 'manager',
          storeLocationId: 'loc-001',
          hireDate: new Date('2023-01-15'),
          hourlyWage: 25.0,
          isActive: true,
          ssn: '1234',
          emergencyContact: '(555) 111-2222',
          address: '789 Oak Street',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'emp-002',
          name: 'Jane Smith',
          email: 'jane@store.com',
          phone: '(555) 111-3333',
          role: 'cashier',
          storeLocationId: 'loc-001',
          hireDate: new Date('2023-06-01'),
          hourlyWage: 16.5,
          isActive: true,
          ssn: '5678',
          emergencyContact: '(555) 111-4444',
          address: '654 Elm Street',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      shiftRecords: [],

      addEmployee: (employee) => {
        set((state) => ({
          employees: [
            ...state.employees,
            {
              ...employee,
              id: `emp-${Date.now()}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updates, updatedAt: new Date() } : emp
          ),
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }));
      },

      clockIn: (employeeId, storeLocationId) => {
        const record: ShiftRecord = {
          id: `shift-${Date.now()}`,
          employeeId,
          date: new Date(),
          clockInTime: new Date(),
          totalBreakMinutes: 0,
          storeLocationId,
        };

        set((state) => ({
          shiftRecords: [...state.shiftRecords, record],
        }));

        return record;
      },

      clockOut: (employeeId) => {
        set((state) => {
          const today = new Date().toDateString();
          return {
            shiftRecords: state.shiftRecords.map((record) => {
              if (
                record.employeeId === employeeId &&
                record.date.toDateString() === today &&
                !record.clockOutTime
              ) {
                return { ...record, clockOutTime: new Date() };
              }
              return record;
            }),
          };
        });
      },

      startBreak: (recordId) => {
        set((state) => ({
          shiftRecords: state.shiftRecords.map((record) =>
            record.id === recordId && !record.breakStartTime
              ? { ...record, breakStartTime: new Date() }
              : record
          ),
        }));
      },

      endBreak: (recordId) => {
        set((state) => {
          return {
            shiftRecords: state.shiftRecords.map((record) => {
              if (
                record.id === recordId &&
                record.breakStartTime &&
                !record.breakEndTime
              ) {
                const breakMinutes = Math.floor(
                  (new Date().getTime() - record.breakStartTime.getTime()) / 60000
                );
                return {
                  ...record,
                  breakEndTime: new Date(),
                  totalBreakMinutes: record.totalBreakMinutes + breakMinutes,
                };
              }
              return record;
            }),
          };
        });
      },

      getEmployeeShifts: (employeeId, startDate, endDate) => {
        return get().shiftRecords.filter(
          (record) =>
            record.employeeId === employeeId &&
            record.date >= startDate &&
            record.date <= endDate
        );
      },

      getTotalHours: (employeeId, startDate, endDate) => {
        const shifts = get().getEmployeeShifts(employeeId, startDate, endDate);
        let totalMinutes = 0;

        shifts.forEach((shift) => {
          if (shift.clockOutTime && shift.clockInTime) {
            const shiftMinutes =
              (shift.clockOutTime.getTime() - shift.clockInTime.getTime()) / 60000;
            totalMinutes += shiftMinutes - shift.totalBreakMinutes;
          }
        });

        return Math.round((totalMinutes / 60) * 100) / 100;
      },
    }),
    {
      name: 'employee-store',
    }
  )
);
