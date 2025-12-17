import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StoreLocation {
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
  createdAt: Date;
  coordinates?: { lat: number; lng: number };
}

interface StoreLocationState {
  locations: StoreLocation[];
  selectedLocationId: string | null;
  addLocation: (location: Omit<StoreLocation, 'id' | 'createdAt'>) => void;
  updateLocation: (id: string, location: Partial<StoreLocation>) => void;
  deleteLocation: (id: string) => void;
  selectLocation: (id: string) => void;
  getSelectedLocation: () => StoreLocation | undefined;
}

export const useStoreLocationStore = create<StoreLocationState>()(
  persist(
    (set, get) => ({
      locations: [
        {
          id: 'loc-001',
          name: 'Main Store',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '(555) 123-4567',
          email: 'main@store.com',
          manager: 'John Manager',
          isActive: true,
          createdAt: new Date(),
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        {
          id: 'loc-002',
          name: 'Downtown Branch',
          address: '456 Park Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          phone: '(555) 234-5678',
          email: 'downtown@store.com',
          manager: 'Jane Manager',
          isActive: true,
          createdAt: new Date(),
          coordinates: { lat: 40.7614, lng: -73.9776 },
        },
      ],
      selectedLocationId: 'loc-001',

      addLocation: (location) => {
        set((state) => ({
          locations: [
            ...state.locations,
            {
              ...location,
              id: `loc-${Date.now()}`,
              createdAt: new Date(),
            },
          ],
        }));
      },

      updateLocation: (id, updates) => {
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...updates } : loc
          ),
        }));
      },

      deleteLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id),
          selectedLocationId:
            state.selectedLocationId === id
              ? state.locations[0]?.id || null
              : state.selectedLocationId,
        }));
      },

      selectLocation: (id) => {
        set({ selectedLocationId: id });
      },

      getSelectedLocation: () => {
        const { locations, selectedLocationId } = get();
        return locations.find((loc) => loc.id === selectedLocationId);
      },
    }),
    {
      name: 'store-location-store',
    }
  )
);
