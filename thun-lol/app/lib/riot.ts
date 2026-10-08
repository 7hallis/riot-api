const DDRAGON_VERSION = "15.20.1";

export function getChampionImage(championName: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championName}.png`;
}