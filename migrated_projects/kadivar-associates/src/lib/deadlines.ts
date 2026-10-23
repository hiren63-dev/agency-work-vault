/**
 * Recurring Indian statutory deadlines.
 *
 * Used to show a visitor what is actually due next. This is factual
 * information, not solicitation — and it is the fastest way to make a
 * business owner recognise that the site is written by people who do
 * this work.
 *
 * Dates are the general position and can shift with CBDT/CBIC extensions,
 * so the UI states that alongside them.
 */

export type Deadline = {
  label: string;
  detail: string;
  /** Day of month for monthly items. */
  day: number;
  /** 1-indexed months this applies to. Omit for every month. */
  months?: number[];
};

export const DEADLINES: Deadline[] = [
  { label: "TDS payment", detail: "Deposit of tax deducted for the previous month", day: 7 },
  { label: "GSTR-1", detail: "Outward supplies return, monthly filers", day: 11 },
  { label: "GSTR-3B", detail: "Summary return and tax payment", day: 20 },
  {
    label: "Advance tax instalment",
    detail: "Quarterly advance tax for businesses and individuals",
    day: 15,
    months: [6, 9, 12, 3],
  },
  {
    label: "TDS return",
    detail: "Quarterly statement of tax deducted at source",
    day: 31,
    months: [5, 7, 10, 1],
  },
  {
    label: "Income tax return",
    detail: "Non-audit cases, individuals and businesses",
    day: 31,
    months: [7],
  },
  {
    label: "Tax audit report",
    detail: "Audit under section 44AB",
    day: 30,
    months: [9],
  },
  {
    label: "DIR-3 KYC",
    detail: "Annual director KYC with the MCA",
    day: 30,
    months: [9],
  },
];

export type UpcomingDeadline = Deadline & {
  date: Date;
  daysAway: number;
};

/** Next occurrences, soonest first. */
export function getUpcoming(from: Date, count = 3): UpcomingDeadline[] {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const results: UpcomingDeadline[] = [];

  // Look ahead a year — enough to catch every annual item.
  for (let offset = 0; offset < 13; offset += 1) {
    const cursor = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const month = cursor.getMonth() + 1;

    for (const deadline of DEADLINES) {
      if (deadline.months && !deadline.months.includes(month)) continue;

      // Clamp to the real last day so "31" is safe in short months.
      const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
      const date = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        Math.min(deadline.day, lastDay)
      );

      if (date < today) continue;

      results.push({
        ...deadline,
        date,
        daysAway: Math.round((date.getTime() - today.getTime()) / 86_400_000),
      });
    }

    if (results.length >= count * 3) break;
  }

  return results.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, count);
}

export function formatDeadline(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}
