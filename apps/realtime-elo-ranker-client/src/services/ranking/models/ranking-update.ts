import { RankingEventType } from "./ranking-event";

export type RankingUpdate = {
  type: RankingEventType.RankingUpdate;
  player: {
    name: string;
    rank: number
  }
}