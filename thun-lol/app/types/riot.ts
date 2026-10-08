export type MatchParticipant = {
  puuid: string;
  summonerName?: string;
  riotIdGameName?: string;
  riotIdTagline?: string;

  championName: string;

  kills: number;
  deaths: number;
  assists: number;

  win: boolean;

  totalMinionsKilled: number;
  neutralMinionsKilled: number;

  goldEarned: number;
  totalDamageDealtToChampions: number;

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
};

export type RiotMatch = {
  metadata: {
    matchId: string;
  };

  info: {
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    participants: MatchParticipant[];
  };
};

