"use client";

import type { MatchParticipant, RiotMatch } from "@/app/types/riot";
import Image from "next/image";
import { getChampionImage } from "@/app/lib/riot";

type MatchHistoryProps = {
  matches: RiotMatch[];
  puuid: string;
};

export default function MatchHistory({
  matches,
  puuid,
}: MatchHistoryProps) {
  if (!matches.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-zinc-400">
          Nenhuma partida encontrada.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          Últimas partidas
        </h2>

        <p className="text-sm text-zinc-500">
          Histórico recente do jogador
        </p>
      </div>

      <div className="space-y-3">
        {matches.map((match) => {
          const player = match.info.participants.find(
            (participant: MatchParticipant) => participant.puuid === puuid
          );

          if (!player) {
            return null;
          }

          const kda =
            player.deaths === 0
              ? player.kills + player.assists
              : (player.kills + player.assists) /
                player.deaths;

          const cs =
            player.totalMinionsKilled +
            player.neutralMinionsKilled;

          const durationMinutes = Math.floor(
            match.info.gameDuration / 60
          );

          const durationSeconds =
            match.info.gameDuration % 60;

          return (
            <article
              key={match.metadata.matchId}
              className={`rounded-2xl border p-4 ${
                player.win
                  ? "border-emerald-900 bg-emerald-950/30"
                  : "border-red-900 bg-red-950/30"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                {/* Resultado */}
                <div className="min-w-28">
                  <p
                    className={`font-bold ${
                      player.win
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {player.win ? "Vitória" : "Derrota"}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {durationMinutes}:
                    {durationSeconds
                      .toString()
                      .padStart(2, "0")}
                  </p>
                </div>

                {/* Campeão */}
                <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                        src={getChampionImage(player.championName)}
                        alt={player.championName}
                        fill
                        sizes="48px"
                        className="object-cover"
                    />
                    </div>

                  <div>
                    <p className="font-semibold">
                      {player.championName}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {match.info.gameMode}
                    </p>
                  </div>
                </div>

                {/* KDA */}
                <div>
                  <p className="text-xs text-zinc-500">
                    KDA
                  </p>

                  <p className="font-semibold">
                    {player.kills} /{" "}
                    <span className="text-red-400">
                      {player.deaths}
                    </span>{" "}
                    / {player.assists}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {kda.toFixed(2)} KDA
                  </p>
                </div>

                {/* CS */}
                <div>
                  <p className="text-xs text-zinc-500">
                    CS
                  </p>

                  <p className="font-semibold">
                    {cs}
                  </p>
                </div>

                {/* Dano */}
                <div>
                  <p className="text-xs text-zinc-500">
                    Dano
                  </p>

                  <p className="font-semibold">
                    {player.totalDamageDealtToChampions.toLocaleString(
                      "pt-BR"
                    )}
                  </p>
                </div>

                {/* Ouro */}
                <div>
                  <p className="text-xs text-zinc-500">
                    Ouro
                  </p>

                  <p className="font-semibold">
                    {player.goldEarned.toLocaleString(
                      "pt-BR"
                    )}
                  </p>
                </div>

              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

