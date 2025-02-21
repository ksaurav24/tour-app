import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/types/ProfileTypes'
import { api } from '@/config/ApiConfig' // Make sure to import your API configuration

type UserStore = {
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  logout: () => void
  fetchProfile: () => Promise<void>
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserProfile) => set({ user }),
      logout: () => set({ user: null }),
      fetchProfile: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
          const response = await api.get<{ data: UserProfile }>('/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const profileData = response?.data?.data;
          set({ user: profileData });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Optionally, you can handle the error here, e.g., by setting an error state
          // set({ error: "Failed to fetch profile" });
        }
      },
    }),
    {
      name: 'user-storage',
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

export default useUserStore
