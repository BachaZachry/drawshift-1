/* eslint-disable no-unused-vars */
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import { api } from './api';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

interface State {
  user: any;
  authModalOpen: boolean;
  token: string;
}

interface Actions {
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ data: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any }>;
  signOut: () => void;
  setUser: () => void;
  setAuthModalOpen: (open: boolean) => void;
  // updatePassword: (password: string) => Promise<{ error: any }>;
  reset: () => void;
  googleAuth: (accessToken) => Promise<{ data: any }>;
  addDrawing: (
    title: string,
    path: string,
    base64_image: string
  ) => Promise<{ data: any }>;
  retrieveDrawings: () => Promise<{ data: any }>;
  retrieveSingleDrawing: (id: string) => Promise<{ data: any }>;
}

const createSlice: StateCreator<State & Actions> = (set, get) => ({
  user: null,
  authModalOpen: false,
  token: null,
  signUp: async (username, email, password) => {
    try {
      const response = await api.post('users/register/', {
        username,
        email,
        password,
      });
      set({
        user: response.data.user,
        token: response.data.token,
      });

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  signIn: async (username, password) => {
    try {
      const response = await api.post('users/login/', {
        username,
        password,
      });
      set({
        user: response.data.user,
        token: response.data.token,
      });

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  signOut: async () => {
    try {
      await api.post('users/logout/');
      localStorage.removeItem('token');
      api.defaults.headers['Authorization'] = null;
      set({
        user: null,
        token: null,
      });
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  setUser: async () => {
    try {
      const response = await api.get('users/load-user/');
      set({ user: response.data });
    } catch (err) {
      localStorage.removeItem('token');
      api.defaults.headers['Authorization'] = null;
      console.error(err);
      throw new Error(err);
    }
  },
  setAuthModalOpen: (open) => set(() => ({ authModalOpen: open })),
  // updatePassword: async () => {},
  reset: () => set({ user: null, authModalOpen: false, token: null }),
  googleAuth: async (accessToken) => {
    try {
      const response = await api.post('users/rest-auth/google/', {
        accessToken,
      });
      set({
        user: response.data.user,
        token: response.data.token,
      });

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  addDrawing: async (title, path, base64_image) => {
    try {
      const response = await api.post('boards/drawing/', {
        title,
        path,
        base64_image,
      });

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  retrieveDrawings: async () => {
    try {
      const response = await api.get('boards/drawing/');

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  retrieveSingleDrawing: async (id) => {
    try {
      const response = await api.post(`boards/drawing/${id}/`);

      return response.data.drawing;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
});

const useStoreBase = create<State & Actions>()(
  devtools(
    persist(
      (...a) => ({
        ...createSlice(...a),
      }),
      {
        name: 'store-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export const useGlobalStore = createSelectors(useStoreBase);
