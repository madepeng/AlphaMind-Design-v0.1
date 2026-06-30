import {
  createJournal,
  deleteJournal,
  getJournal,
  getJournals,
} from "../api/journalApi";
import type {
  JournalCreateDTO,
  JournalDTO,
  JournalViewDTO,
} from "../types/journal";
import { getCompanyName } from "./companyService";

export async function loadJournals(): Promise<JournalViewDTO[]> {
  return (await getJournals()).map(toJournalView);
}

export async function loadJournal(journalId: number): Promise<JournalViewDTO> {
  return toJournalView(await getJournal(journalId));
}

export async function saveJournal(journal: JournalCreateDTO): Promise<void> {
  await createJournal(journal);
}

export async function removeJournal(journalId: number): Promise<void> {
  await deleteJournal(journalId);
}

export function filterJournals(
  journals: JournalViewDTO[],
  query: string,
): JournalViewDTO[] {
  const normalizedQuery = query.trim().toUpperCase();
  if (!normalizedQuery) {
    return journals;
  }
  return journals.filter(
    (journal) =>
      journal.ticker.includes(normalizedQuery) ||
      journal.createdAt.slice(0, 10).includes(normalizedQuery),
  );
}

export function formatJournalDate(createdAt: string): string {
  return createdAt.slice(0, 10);
}

function toJournalView(journal: JournalDTO): JournalViewDTO {
  return {
    ...journal,
    companyName: getCompanyName(journal.ticker),
  };
}
