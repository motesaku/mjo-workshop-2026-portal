#!/usr/bin/env node
/**
 * Build src/data/personal-synthesis.json from local (gitignored) Phase 5/6 exports.
 * Strips private filesystem paths. English-only. Safe to commit the output.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const phase5 = JSON.parse(await readFile(resolve(root, "exports/phase5-20261102-v1/editorial-drafts.en.json"), "utf8"));
const phase6 = JSON.parse(await readFile(resolve(root, "exports/phase6-20261103-v1/themes.en.json"), "utf8"));
const provenance = JSON.parse(await readFile(resolve(root, "exports/phase5-20261102-v1/provenance.private.json"), "utf8"));

const CLASS_MAP = {
	diverging_perspectives: "diverging perspectives",
	emerging_alignment: "emerging alignment",
	open_questions: "open questions",
	"diverging perspectives": "diverging perspectives",
	"emerging alignment": "emerging alignment",
	"open questions": "open questions",
};

function publicSource(s) {
	return {
		source_id: s.source_id,
		title: s.title,
		source_version: s.source_version ?? (s.sha256 ? `sha256:${s.sha256}` : "unknown"),
		sha256: s.sha256,
		snapshot_date: s.snapshot_date ?? null,
		session_date: s.session_date ?? null,
		contribution_family: s.contribution_family,
		attribution_mode: s.attribution_mode ?? null,
		source_review_status: s.source_review_status ?? "not_established",
		coverage: s.coverage ?? "partial",
		limitations: s.limitations ?? "",
	};
}

const LOCATOR_EN = {
	"## 質疑": "## Discussion / Q&A",
	"## 結果": "## Results",
	"## 課題": "## Open issues",
	"## 主張": "## Claims",
	"## 前提": "## Premises",
	"## 歴史観": "## Historical framing",
	"## 社会的応用": "## Societal applications",
	"## AI予測の進展": "## Progress in AI prediction",
	"### 予報検証": "### Forecast verification",
	"### 評価対象と指標": "### Evaluation targets and metrics",
	"### 発生・多様性": "### Initiation and diversity",
};

function englishLocator(locator, lineStart, lineEnd) {
	if (!locator) return `lines ${lineStart}–${lineEnd}`;
	if (LOCATOR_EN[locator]) return LOCATOR_EN[locator];
	if (!/[\u3040-\u30ff\u3400-\u9fff]/.test(locator)) return locator;
	return `Section near lines ${lineStart}–${lineEnd}`;
}

function publicEvidence(e) {
	return {
		evidence_id: e.evidence_id,
		source_id: e.source_id,
		source_sha256: e.source_sha256,
		line_start: e.line_start,
		line_end: e.line_end,
		locator: englishLocator(e.locator, e.line_start, e.line_end),
		excerpt_sha256: e.excerpt_sha256,
		verification: e.verification ?? "pending_human_review",
		coverage: e.coverage ?? "partial",
	};
}

const p6IssueIds = new Set(phase6.issues.map((i) => i.id));
const issues = [];

for (const raw of phase5.issues) {
	const id = raw.issue_id;
	const classification = CLASS_MAP[raw.classification] ?? raw.classification;
	if (p6IssueIds.has(id)) {
		const p6 = phase6.issues.find((i) => i.id === id);
		issues.push({
			...p6,
			classification: CLASS_MAP[p6.classification] ?? p6.classification,
			status: "Personal synthesis from converted minutes · not workshop consensus",
			proposed_research: raw.proposed_research ?? null,
			positions: raw.positions ?? [],
			comparison: raw.comparison ?? null,
			emerging_alignment: raw.emerging_alignment ?? null,
			unresolved_questions: raw.unresolved_questions ?? null,
			limitations: raw.limitations ?? null,
		});
		continue;
	}
	issues.push({
		id,
		title: raw.title,
		question: raw.central_question,
		classification,
		records: (raw.workshop_record ?? []).map((r) => ({
			text: r.text,
			evidence_ids: r.evidence_ids ?? [],
			claim_id: r.claim_id,
			origin: r.origin,
			verification: r.verification ?? "unverified",
		})),
		coverage: raw.coverage ?? "partial",
		status: "Personal synthesis from converted minutes · not workshop consensus",
		proposed_research: raw.proposed_research ?? null,
		positions: raw.positions ?? [],
		comparison: raw.comparison ?? null,
		emerging_alignment: raw.emerging_alignment ?? null,
		unresolved_questions: raw.unresolved_questions ?? null,
		limitations: raw.limitations ?? null,
		formal_consensus: raw.formal_consensus ?? "not_established",
	});
}

issues.sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));

function asTextList(value) {
	if (!value) return [];
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.map((s) => (typeof s === "string" ? s : s.text)).filter(Boolean);
	if (typeof value === "object" && value.text) return [value.text];
	return [];
}

const actions = issues
	.filter((i) => i.proposed_research?.title)
	.map((i) => {
		const pr = i.proposed_research;
		return {
			id: `action-${i.id}`,
			issue_id: i.id,
			title: pr.title,
			classification: i.classification,
			rationale: pr.rationale?.text ?? "",
			steps: asTextList(pr.steps),
			expected_outputs: asTextList(pr.expected_outputs),
			limitations: asTextList(pr.limitations),
			illustrative: true,
		};
	});

const neededEvidence = new Set();
const neededSources = new Set();
for (const issue of issues) {
	for (const r of issue.records ?? []) for (const id of r.evidence_ids ?? []) neededEvidence.add(id);
	for (const p of issue.positions ?? []) for (const id of p.evidence_ids ?? []) neededEvidence.add(id);
}
for (const theme of phase6.themes) {
	for (const section of theme.sections) {
		for (const item of section.items) {
			for (const ref of item.refs ?? []) {
				if (ref.startsWith("e-")) neededEvidence.add(ref);
			}
		}
	}
}

const provEvidence = provenance.evidence ?? {};
const evidList = Array.isArray(provEvidence) ? provEvidence : Object.values(provEvidence);
const evidById = new Map(evidList.map((e) => [e.evidence_id, e]));
for (const e of phase6.evidence ?? []) evidById.set(e.evidence_id, e);

const evidence = [];
for (const id of [...neededEvidence].sort()) {
	const e = evidById.get(id);
	if (!e) continue;
	evidence.push(publicEvidence(e));
	neededSources.add(e.source_id);
}

const provSources = provenance.sources ?? {};
const srcList = Array.isArray(provSources) ? provSources : Object.values(provSources);
const srcById = new Map(srcList.map((s) => [s.source_id, s]));
for (const s of phase6.sources ?? []) srcById.set(s.source_id, s);

const sources = [...neededSources]
	.sort()
	.map((id) => srcById.get(id))
	.filter(Boolean)
	.map(publicSource);

const package_ = {
	format: "personal-workshop-synthesis",
	version: "1.0.0",
	created_on: "2026-11-03",
	language: "en",
	authorship: {
		author: "Qoosaku Moteki",
		role: "individual workshop participant",
		stance: "personal_learning_and_present_understanding",
		access_model: "public_personal_report",
		not_claimed: [
			"official ICTP publication",
			"workshop multi-author consensus",
			"shared participant CMS",
		],
	},
	scientific_review: "personal_synthesis_from_minutes",
	publication_approval: "owner_personal_report",
	language_review: "author_english",
	formal_consensus: "not_established",
	coverage: "partial",
	themes: phase6.themes,
	issues,
	actions,
	sources,
	evidence,
	references: phase6.references ?? [],
	highlight: {
		...(phase6.highlight ?? {}),
		scientific_review: "pending_as_independent_evidence",
		publication_permission: "owner_approved",
		representative_version_approval: "owner_approved",
	},
};

const text = JSON.stringify(package_, null, 2);
if (/\/Users\/|file:\/\/|"path"\s*:/.test(text)) {
	throw new Error("Refusing to write personal-synthesis.json: private path-like content detected");
}
const cjk = text.match(/[\u3040-\u30ff\u3400-\u9fff]/g);
if (cjk) {
	throw new Error(`Refusing to write personal-synthesis.json: non-English script detected (${cjk.length} chars)`);
}

const out = resolve(root, "src/data/personal-synthesis.json");
await mkdir(dirname(out), { recursive: true });
await writeFile(out, text + "\n");
console.log(
	`Wrote ${out} (${issues.length} issues, ${package_.themes.length} themes, ${actions.length} actions, ${sources.length} sources, ${evidence.length} evidence)`,
);
