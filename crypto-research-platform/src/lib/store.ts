import { create } from 'zustand';
import type { ChatMessage, CryptoAsset } from '@/types';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // Watchlist
  watchlist: string[];
  addToWatchlist: (assetId: string) => void;
  removeFromWatchlist: (assetId: string) => void;
  isInWatchlist: (assetId: string) => boolean;

  // Selected assets
  selectedAssets: CryptoAsset[];
  setSelectedAssets: (assets: CryptoAsset[]) => void;
  addSelectedAsset: (asset: CryptoAsset) => void;
  removeSelectedAsset: (assetId: string) => void;

  // UI State
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Theme
  theme: 'dark',
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(newTheme);
  },

  // Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  clearChat: () => set({ chatMessages: [] }),

  // Watchlist
  watchlist: [],
  addToWatchlist: (assetId) =>
    set((state) => {
      const newWatchlist = [...state.watchlist, assetId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      }
      return { watchlist: newWatchlist };
    }),
  removeFromWatchlist: (assetId) =>
    set((state) => {
      const newWatchlist = state.watchlist.filter((id) => id !== assetId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      }
      return { watchlist: newWatchlist };
    }),
  isInWatchlist: (assetId) => get().watchlist.includes(assetId),

  // Selected assets
  selectedAssets: [],
  setSelectedAssets: (assets) => set({ selectedAssets: assets }),
  addSelectedAsset: (asset) =>
    set((state) => {
      const exists = state.selectedAssets.find((a) => a.id === asset.id);
      if (exists) return state;
      return { selectedAssets: [...state.selectedAssets, asset] };
    }),
  removeSelectedAsset: (assetId) =>
    set((state) => ({
      selectedAssets: state.selectedAssets.filter((a) => a.id !== assetId),
    })),

  // UI State
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// Initialize theme and watchlist from localStorage
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (savedTheme) {
    useStore.getState().setTheme(savedTheme);
  }

  const savedWatchlist = localStorage.getItem('watchlist');
  if (savedWatchlist) {
    try {
      const watchlist = JSON.parse(savedWatchlist);
      useStore.setState({ watchlist });
    } catch (error) {
      console.error('Failed to parse watchlist:', error);
    }
  }
}

