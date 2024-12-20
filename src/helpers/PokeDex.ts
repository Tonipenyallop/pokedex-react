export class PokeDexHelper {
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
}
