import { MAX_MUSIC_LEN } from "../constants";
import { PokeDexServiceType } from "../services/pokedex-service";

interface PokeDexHelperProps {
  setMusicIndex: React.Dispatch<React.SetStateAction<number>>;
  setYoutubeMusics: React.Dispatch<
    React.SetStateAction<
      {
        startTime: string;
        name: string;
      }[]
    >
  >;
  pokeDexService: PokeDexServiceType;
  playerRef: React.MutableRefObject<YT.Player | null>;
}

export class PokeDexHelper {
  private setMusicIndex: React.Dispatch<React.SetStateAction<number>>;
  private setYoutubeMusics: React.Dispatch<
    React.SetStateAction<
      {
        startTime: string;
        name: string;
      }[]
    >
  >;
  private pokeDexService: PokeDexServiceType;
  private playerRef: React.MutableRefObject<YT.Player | null>;

  constructor({
    setMusicIndex,
    setYoutubeMusics,
    pokeDexService,
    playerRef,
  }: PokeDexHelperProps) {
    this.setMusicIndex = setMusicIndex;
    this.setYoutubeMusics = setYoutubeMusics;
    this.pokeDexService = pokeDexService;
    this.playerRef = playerRef;
  }

  public convertMusicStartTime(time: string): number {
    const timeArr = time.split(":");
    let hour: number;
    let min: number;
    let sec: number;
    if (timeArr.length === 3) {
      // time is hour long
      hour = Number(timeArr[0]);
      min = Number(timeArr[1]);
      sec = Number(timeArr[2]);

      return hour * 60 * 60 + min * 60 + sec;
    } else if (timeArr.length == 2) {
      // time is min long
      min = Number(timeArr[0]);
      sec = Number(timeArr[1]);
      return min * 60 + sec;
    }

    return 0;
  }

  public async handlePrevMusic(event: React.MouseEvent<HTMLButtonElement>) {
    if (!this.playerRef.current) {
      return;
    }

    const musicIndex = Number(event.currentTarget.value);

    const prevIndex = musicIndex <= 0 ? MAX_MUSIC_LEN - 1 : musicIndex - 1;
    this.playerRef.current.loadPlaylist({
      list: "PL2Hh8Ce3B0ObkyQr65oyCMaqnE6HfqoIg",
      index: prevIndex,
    });
    this.setMusicIndex(prevIndex);
    const tmp = await this.pokeDexService.getMusicDescriptionByIndex(
      prevIndex.toString()
    );

    this.setYoutubeMusics(tmp.musicDescription);
    this.playerRef.current.playVideo();
  }
}
