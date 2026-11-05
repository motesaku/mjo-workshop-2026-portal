// Bundled personal synthesis only. Raw workshop sources are never a runtime input.
import synthesis from "../data/personal-synthesis.json";
import { applyPackage } from "./phase10/apply.mjs";

export interface ThemeItem { title: string; text: string; refs: string[]; origin: string }
export interface ThemeSection { id: string; title: string; intro: string; items: ThemeItem[] }
export interface Theme { id: string; title: string; description: string; sections: ThemeSection[]; issues: string[]; video_context: string; video_gap: string }
export interface ReviewIssue {
	id: string;
	title: string;
	question: string;
	classification: string;
	records: { text: string; evidence_ids: string[]; claim_id: string; origin: string; verification?: string }[];
	coverage: string;
	status: string;
	proposed_research?: unknown;
	positions?: { text: string; evidence_ids: string[]; claim_id: string; origin: string }[];
	comparison?: { text?: string } | string | null;
	emerging_alignment?: { text?: string } | string | null;
	unresolved_questions?: { text?: string } | string | Array<{ text?: string }> | null;
	limitations?: { text?: string } | string | null;
}
export interface ReviewSource { source_id: string; title: string; source_version: string; coverage: string; limitations: string; source_review_status: string; contribution_family: string }
export interface ReviewEvidence { evidence_id: string; source_id: string; line_start: number; line_end: number; locator: string; verification: string }
export interface ReviewAction {
	id: string;
	issue_id: string;
	title: string;
	classification: string;
	rationale: string;
	steps: string[];
	expected_outputs: string[];
	limitations: string[];
	illustrative: boolean;
}
export interface ThemeReview {
	format: string;
	version: string;
	created_on: string;
	scientific_review: string;
	publication_approval: string;
	language_review: string;
	formal_consensus?: string;
	authorship?: { author: string; role: string; stance: string; access_model: string };
	themes: Theme[];
	issues: ReviewIssue[];
	actions?: ReviewAction[];
	sources: ReviewSource[];
	evidence: ReviewEvidence[];
	references: { id: string; title: string; url: string; verified_on: string; scope: string }[];
	highlight: { youtube_id: string; verification_date: string; publication_permission?: string };
}

const ALLOWED_FORMATS = new Set(["personal-workshop-synthesis", "phase6-local-theme-review"]);

export function loadThemeReview(): ThemeReview | null {
	const data = applyPackage(synthesis) as ThemeReview;
	if (!ALLOWED_FORMATS.has(data.format)) return null;
	if (data.formal_consensus && data.formal_consensus !== "not_established") return null;
	return data;
}

export function issuesByClassification(classification: string): ReviewIssue[] {
	const review = loadThemeReview();
	if (!review) return [];
	return review.issues.filter((i) => i.classification === classification);
}

export function getAction(issueId: string): ReviewAction | undefined {
	return loadThemeReview()?.actions?.find((a) => a.issue_id === issueId);
}

export function textField(value: { text?: string } | string | Array<{ text?: string }> | null | undefined): string {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map((item) => item.text ?? "").filter(Boolean).join(" ");
	return value.text ?? "";
}

export const themeRoutes: Record<string, string> = { ai: "/ai-for-mjo-research", indices: "/mjo-indices-and-diagnostics" };

export const CLASSIFICATION_ROUTES: Record<string, string> = {
	"diverging perspectives": "/diverging-perspectives",
	"emerging alignment": "/emerging-alignment",
	"open questions": "/open-challenges",
};
