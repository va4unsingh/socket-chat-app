import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { checkUserSession as checkUserSessionApi, logout as logoutApi } from '@/lib/api';

const adjectives = ['Silent', 'Swift', 'Hidden', 'Mystic', 'Shadow', 'Phantom', 'Quiet', 'Invisible'];
const nouns = ['Whisper', 'Specter', 'Ghost', 'Echo', 'Shade', 'Cipher', 'Rogue', 'Voyager'];

const generateRandomUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}${num}`;
};

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string | null;
}

export interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  user: null,
  status: 'loading',
};

export const checkUserSession = createAsyncThunk(
  'user/checkSession',
  async () => {
    try {
      const response = await checkUserSessionApi();
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } catch (error) {
    throw error;
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'succeeded';
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    updateUsername: (state, action: PayloadAction<string>) => {
        if (state.user) {
            const newUsername = action.payload.slice(0, 20);
            state.user.username = newUsername;
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
    updateAvatar: (state, action: PayloadAction<string | null>) => {
        if (state.user) {
            state.user.avatar = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(checkUserSession.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      });
  },
});

export const { login, updateUsername, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
