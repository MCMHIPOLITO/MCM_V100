/**
 * Utility functions to extract values from Sportmonks response
 */

type Trend = {
  id: number;
  fixture_id: number;
  participant_id: number | null;
  type_id: number;
  location: "home" | "away" | null;
  value: number | string | null;
  period_id?: number | null;
};

type Period = {
  id: number;
  description: string; // "1st-half", "2nd-half" etc
  minutes?: number | null;
  seconds?: number | null;
};

type Participant = {
  id: number;
  name: string;
  meta?: { location?: "home" | "away" };
};

type Score = {
  participant_id: number;
  goals: number | null;
};

export type Row = {
  key: string;
  match: string;
  scoreHome: number | null;
  scoreAway: number | null;
  time: string;
  period: "1T" | "2T" | "" ;
  cornersHome1HT: number | null;
  cornersAway1HT: number | null;
  possHome: number | null;
  possAway: number | null;
  daHome1HT: number | null; // dangerous attacks 1st half home
  daAway1HT: number | null;
  daHome2HT: number | null;
  daAway2HT: number | null;
  daDeltaHome: number | null;
  daDeltaAway: number | null;
};

function pad(v: number | null | undefined) {
  if (v == null || Number.isNaN(v)) return "00";
  return String(v).padStart(2, "0");
}

function trendValue(trends: Trend[], type: number, loc: "home"|"away", half: "1st-half"|"2nd-half"|null, periods: Period[]) {
  // find period_ids for selected half if provided
  let candidatePeriodIds: Set<number> | null = null;
  if (half) {
    candidatePeriodIds = new Set(periods.filter(p => p.description === half).map(p => p.id));
  }
  const found = trends.find(t => t.type_id === type && t.location === loc && (!candidatePeriodIds || (t.period_id && candidatePeriodIds.has(t.period_id))));
  if (!found) return null;
  const n = Number(found.value);
  return Number.isFinite(n) ? n : null;
}

export function buildRows(data: any): Row[] {
  const list: Row[] = [];
  const items = Array.isArray(data?.data) ? data.data : [];

  for (const fx of items) {
    const trends: Trend[] = fx?.trends || [];
    const periods: Period[] = fx?.periods || [];
    const participants: Participant[] = fx?.participants || [];
    const scores: Score[] = fx?.scores || [];

    const home = participants.find(p => p?.meta?.location === "home") || participants[0];
    const away = participants.find(p => p?.meta?.location === "away") || participants[1];

    const homeName = home?.name ?? "Home";
    const awayName = away?.name ?? "Away";
    const match = `${homeName} — ${awayName}`;

    const scoreHome = scores.find(s => s.participant_id === home?.id)?.goals ?? null;
    const scoreAway = scores.find(s => s.participant_id === away?.id)?.goals ?? null;

    const active = periods.find(p => p.description === "2nd-half") ||
                   periods.find(p => p.description === "1st-half") ||
                   periods[0];
    const timeStr = active ? `${pad(active.minutes ?? null)}:${pad(active.seconds ?? null)}` : "";

    const periodLabel: "1T" | "2T" | "" =
      active?.description === "1st-half" ? "1T" :
      active?.description === "2nd-half" ? "2T" : "";

    const cornersHome1HT = trendValue(trends, 34, "home", "1st-half", periods);
    const cornersAway1HT = trendValue(trends, 34, "away", "1st-half", periods);

    const possHome = trendValue(trends, 81, "home", null, periods);
    const possAway = trendValue(trends, 81, "away", null, periods);

    const daHome1HT = trendValue(trends, 44, "home", "1st-half", periods);
    const daAway1HT = trendValue(trends, 44, "away", "1st-half", periods);
    const daHome2HT = trendValue(trends, 44, "home", "2nd-half", periods);
    const daAway2HT = trendValue(trends, 44, "away", "2nd-half", periods);

    const daDeltaHome = (daHome2HT != null && daHome1HT != null) ? (daHome2HT - daHome1HT) : null;
    const daDeltaAway = (daAway2HT != null && daAway1HT != null) ? (daAway2HT - daAway1HT) : null;

    list.push({
      key: String(fx?.id ?? Math.random()),
      match,
      scoreHome: (scoreHome ?? null),
      scoreAway: (scoreAway ?? null),
      time: timeStr,
      period: periodLabel,
      cornersHome1HT,
      cornersAway1HT,
      possHome,
      possAway,
      daHome1HT,
      daAway1HT,
      daHome2HT,
      daAway2HT,
      daDeltaHome,
      daDeltaAway,
    });
  }

  return list;
}
