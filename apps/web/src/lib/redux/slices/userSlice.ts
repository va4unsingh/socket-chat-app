import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const adjectives = ['Silent', 'Swift', 'Hidden', 'Mystic', 'Shadow', 'Phantom', 'Quiet', 'Invisible'];
const nouns = ['Whisper', 'Specter', 'Ghost', 'Echo', 'Shade', 'Cipher', 'Rogue', 'Voyager'];

const generateRandomUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}${num}`;
};

interface User {
  email: string;
  username: string;
  avatar?: string | null;
}

interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  user: null,
  status: 'idle',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Omit<User, 'username'>>) => {
      const user = { ...action.payload, username: generateRandomUsername() };
      state.user = user;
      state.status = 'succeeded';
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
    initializeUser: (state) => {
        state.status = 'loading';
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                state.user = JSON.parse(storedUser);
                state.status = 'succeeded';
            } else {
                state.status = 'idle';
            }
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
});

export const { login, logout, initializeUser, updateUsername, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
