import { BGM_MAX_NUM_IDX } from "../constants";

export class PokeDexHelper {
  musicIndex: number;
  setMusicIndex: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement>;
  constructor({
    musicIndex,
    setMusicIndex,
    audioRef,
  }: {
    musicIndex: number;
    setMusicIndex: React.Dispatch<React.SetStateAction<number>>;
    audioRef: React.RefObject<HTMLAudioElement>;
  }) {
    this.musicIndex = musicIndex;
    this.setMusicIndex = setMusicIndex;
    this.audioRef = audioRef;
  }

  public playNextMusic() {
    const newIdx = (this.musicIndex + 1) % BGM_MAX_NUM_IDX;
    this.setMusicIndex(newIdx);
    setTimeout(() => {
      if (this.audioRef.current === null) {
        return;
      }
      this.audioRef.current.play();
    }, 1000);
  }

  public playPrevMusic() {
    const newIdx =
      this.musicIndex === 0 ? BGM_MAX_NUM_IDX - 1 : this.musicIndex - 1;
    this.setMusicIndex(newIdx);
    setTimeout(() => {
      if (this.audioRef.current === null) {
        return;
      }
      this.audioRef.current.play();
    }, 1000);
  }
}
