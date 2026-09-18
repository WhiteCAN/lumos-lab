export const initialPlayback = { index: 0, started: false, playing: false, finished: false };
export type PlaybackAction = "play" | "pause" | "tick" | "restart";

export function updatePlayback(state: typeof initialPlayback, action: PlaybackAction, count: number) {
  if (count === 0) return state;
  switch (action) {
    case "restart":
      return { ...initialPlayback, started: true, playing: true };
    case "play":
      return state.finished ? state : { ...state, started: true, playing: true };
    case "pause":
      return { ...state, playing: false };
    case "tick":
      if (!state.playing) return state;
      return state.index + 1 >= count
        ? { ...state, playing: false, finished: true }
        : { ...state, index: state.index + 1 };
  }
}
