"use client";

import { useState } from "react";
import { RiotMatch } from "../types/riot";
import MatchHistory from "./MatchHistory";

type PlayerData = {
  account: {
    gameName: string;
    tagLine: string;
    puuid: string;
  };

  summoner: {
    level: number;
    profileIconId: number;
  };

  rank: {
    tier: string;
    rank: string;
    lp: number;
    wins: number;
    losses: number;
  } | null;

  matches: RiotMatch[];
};




export default function PlayerDashboard() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  const [player, setPlayer] = useState<PlayerData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchPlayer() {
    if (!gameName || !tagLine) {
      setError("Digite o Riot ID completo.");
      return;
    }

    setLoading(true);
    setError("");
    setPlayer(null);

    try {
      const response = await fetch(
        `/api/riot/player/${encodeURIComponent(
          gameName
        )}/${encodeURIComponent(tagLine)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Jogador não encontrado.");
      }

      setPlayer(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao buscar jogador."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">

        <header className="mb-10">
          <h1 className="text-4xl font-bold">
            Thun LoL Stats
          </h1>

          <p className="mt-2 text-zinc-400">
            Consulte estatísticas de jogadores de League of Legends.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row">

            <input
              type="text"
              placeholder="Game Name"
              value={gameName}
              onChange={(event) =>
                setGameName(event.target.value)
              }
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />

            <div className="flex items-center gap-2">
              <span className="text-zinc-500">
                #
              </span>

              <input
                type="text"
                placeholder="Tagline"
                value={tagLine}
                onChange={(event) =>
                  setTagLine(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchPlayer();
                  }
                }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white sm:w-32"
              />
            </div>

            <button
              onClick={searchPlayer}
              disabled={loading}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>

          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-950 p-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </section>

        {player && (
          <section className="mt-8">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-bold">
                    {player.account.gameName}
                    <span className="text-zinc-500">
                      #{player.account.tagLine}
                    </span>
                  </h2>

                  <p className="mt-1 text-zinc-400">
                    Nível {player.summoner.level}
                  </p>
                </div>

                <div className="rounded-xl bg-zinc-800 px-5 py-3 text-center">
                  <p className="text-xs uppercase text-zinc-500">
                    Level
                  </p>

                  <p className="text-2xl font-bold">
                    {player.summoner.level}
                  </p>
                </div>

              </div>

            </div>

            {player.rank && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">
                    Ranked Solo
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {player.rank.tier}
                  </p>

                  <p className="text-zinc-400">
                    {player.rank.rank}
                  </p>
                </div>
              

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">
                    League Points
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {player.rank.lp}
                  </p>

                  <p className="text-zinc-400">
                    LP
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">
                    Winrate
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {Math.round(
                      (player.rank.wins /
                        (player.rank.wins +
                          player.rank.losses)) *
                        100
                    )}
                    %
                  </p>

                  <p className="text-zinc-400">
                    {player.rank.wins}W /{" "}
                    {player.rank.losses}L
                  </p>
                </div>

              </div>
            )}

            <MatchHistory
              matches={player.matches}
              puuid={player.account.puuid}
            />

          </section>
        )}

      </div>
    </main>
  );
}

