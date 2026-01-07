import { createSlice } from '@reduxjs/toolkit';

interface VideoAudioState {
  isMuted: boolean;
}

const initialState: VideoAudioState = {
  isMuted: true, // default: muted
};

const videoAudioSlice = createSlice({
  name: 'videoAudio',
  initialState,
  reducers: {
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setMute: (state, action: { payload: boolean }) => {
      state.isMuted = action.payload;
    },
    resetMute: (state) => {
      state.isMuted = true;
    },
  },
});

export const { toggleMute, setMute, resetMute } = videoAudioSlice.actions;
export default videoAudioSlice.reducer;
