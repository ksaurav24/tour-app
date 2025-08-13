import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trips } from '@/types/TripsTypes'
import { api } from '@/config/ApiConfig' // Make sure to import your API configuration
type TripStore = {
  trips: trips;
  setTrips: (trips: trips) => void
  fetchAllTrips: () => Promise<void>
}

const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      trips: {
        joinedTrips: [],
        createdTrips: [],
        joinRequests: []
      },
      setTrips: (trips: trips) => set({ trips }),
      fetchAllTrips: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
          const response = await api.get<{ data: trips }>('/user/myTrips', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials:true
          });

          const trips = response?.data?.data;
          set({ trips });
        } catch (error) {
          console.error("Failed to fetch trips:", error);
          // Optionally, you can handle the error here, e.g., by setting an error state
          // set({ error: "Failed to fetch trips" });
        }
      },
      
    }),
    {
      name: 'trip-storage',
      storage: {
        getItem: (name: string) => {
          const item = typeof window !== 'undefined' ? window.localStorage.getItem(name) : null;
          return item ? JSON.parse(item) : null;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setItem: (name: string, value: any) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name: string) => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(name);
          }
        },
      },
    }
  )
)

export { useTripStore }
