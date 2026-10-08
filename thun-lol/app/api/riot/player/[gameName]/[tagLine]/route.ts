import { NextResponse } from "next/server";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

const ACCOUNT_REGION = "americas";
const LOL_REGION = "br1";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      gameName: string;
      tagLine: string;
    }>;
  }
) {
  try {
    if (!RIOT_API_KEY) {
      return NextResponse.json(
        { error: "RIOT_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const { gameName, tagLine } = await params;

    /*
     * 1. ACCOUNT
     */

    const accountResponse = await fetch(
      `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
        cache: "no-store",
      }
    );

    if (!accountResponse.ok) {
      return NextResponse.json(
        {
          error: "Jogador não encontrado",
          status: accountResponse.status,
        },
        { status: accountResponse.status }
      );
    }

    const account = await accountResponse.json();

    /*
     * 2. SUMMONER
     */

    const summonerResponse = await fetch(
      `https://${LOL_REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
        account.puuid
      )}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
        cache: "no-store",
      }
    );

    if (!summonerResponse.ok) {
      return NextResponse.json(
        {
          error: "Não foi possível obter os dados do invocador",
          status: summonerResponse.status,
        },
        { status: summonerResponse.status }
      );
    }

    const summoner = await summonerResponse.json();

    /*
     * 3. RANK
     */

    const leagueResponse = await fetch(
      `https://${LOL_REGION}.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(
        account.puuid
      )}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
        cache: "no-store",
      }
    );

    let leagues = [];

    if (leagueResponse.ok) {
      leagues = await leagueResponse.json();
    }

    const soloQueue = leagues.find(
      (league: { queueType: string }) =>
        league.queueType === "RANKED_SOLO_5x5"
    );

    /*
     * 4. MATCH IDS
     */

    const matchesResponse = await fetch(
      `https://${ACCOUNT_REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
        account.puuid
      )}/ids?start=0&count=10`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
        cache: "no-store",
      }
    );

    let matchIds: string[] = [];

    if (matchesResponse.ok) {
      matchIds = await matchesResponse.json();
    }

    /*
     * 5. MATCH DETAILS
     */

    const matches = await Promise.all(
      matchIds.map(async (matchId) => {
        const response = await fetch(
          `https://${ACCOUNT_REGION}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(
            matchId
          )}`,
          {
            headers: {
              "X-Riot-Token": RIOT_API_KEY,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return null;
        }

        return response.json();
      })
    );

    /*
     * 6. RESPONSE
     */

    return NextResponse.json({
      account: {
        gameName: account.gameName,
        tagLine: account.tagLine,
        puuid: account.puuid,
      },

      summoner: {
        level: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
      },

      rank: soloQueue
        ? {
            tier: soloQueue.tier,
            rank: soloQueue.rank,
            lp: soloQueue.leaguePoints,
            wins: soloQueue.wins,
            losses: soloQueue.losses,
          }
        : null,

      matches: matches.filter(Boolean),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

