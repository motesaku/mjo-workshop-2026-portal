// Local edited derivatives only. Raw workshop sources are never a runtime input.
export interface ThemeItem { title: string; text: string; refs: string[]; origin: string }
export interface ThemeSection { id: string; title: string; intro: string; items: ThemeItem[] }
export interface Theme { id: string; title: string; description: string; sections: ThemeSection[]; issues: string[]; video_context: string; video_gap: string }
export interface ReviewIssue { id: string; title: string; question: string; classification: string; records: { text: string; evidence_ids: string[]; claim_id: string; origin: string }[]; coverage: string; status: string }
export interface ReviewSource { source_id: string; title: string; source_version: string; coverage: string; limitations: string; source_review_status: string; contribution_family: string }
export interface ReviewEvidence { evidence_id: string; source_id: string; source_sha256: string; line_start: number; line_end: number; locator: string; excerpt_sha256: string; verification: string }
export interface ThemeReview { format: string; version: string; created_on: string; scientific_review: string; publication_approval: string; language_review: string; themes: Theme[]; issues: ReviewIssue[]; sources: ReviewSource[]; evidence: ReviewEvidence[]; references: { id: string; title: string; url: string; verified_on: string; scope: string }[]; highlight: { youtube_id: string; verification_date: string } }
export async function loadThemeReview(): Promise<ThemeReview | null> {
  // Astro replaces DEV at build time: normal builds do not load or bundle drafts.
  if (!import.meta.env.DEV) return null;
  const { readFile } = await import('node:fs/promises');
  const { resolve } = await import('node:path');
  try {
    const text = await readFile(resolve(process.cwd(), 'exports/phase6-20261103-v1/themes.en.json'), 'utf8');
    const data = JSON.parse(text) as ThemeReview;
    if (data.format !== 'phase6-local-theme-review' || data.scientific_review !== 'pending' || data.publication_approval !== 'pending') return null;
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') console.warn('Theme review package unavailable or invalid. Draft content withheld.');
    return null;
  }
}
export const themeRoutes: Record<string, string> = { ai: '/ai-for-mjo-research', indices: '/mjo-indices-and-diagnostics' };
