// Phase 8 provenance supplement (2026-11-04).
//
// Six evidence identifiers are cited in issue comparison, limitation and
// proposal fields of personal-synthesis.json but were omitted from its public
// `evidence` list, because the original build only collected evidence from
// `records` and `positions`. Their public locator fields (no text, no hashes,
// no paths) were confirmed against the local, gitignored provenance export.
// The committed package is intentionally left unchanged; entries already
// present in the package always take precedence over this supplement.

export const SUPPLEMENT_ID = "phase8-provenance-supplement-2026-11-04";

export const supplementalEvidence = [
	{ evidence_id: "e-brennek-45-51", source_id: "src-brennek", line_start: 45, line_end: 51, locator: "## Open issues", verification: "pending_human_review", coverage: "partial" },
	{ evidence_id: "e-closing-268-284", source_id: "src-closing", line_start: 268, line_end: 284, locator: "### 7.1", verification: "pending_human_review", coverage: "partial" },
	{ evidence_id: "e-final-144-147", source_id: "src-final", line_start: 144, line_end: 147, locator: "#### 2.4.3", verification: "pending_human_review", coverage: "partial" },
	{ evidence_id: "e-g3-284-341", source_id: "src-g3", line_start: 284, line_end: 341, locator: "## 3.7", verification: "pending_human_review", coverage: "partial" },
	{ evidence_id: "e-lin-43-49", source_id: "src-lin", line_start: 43, line_end: 49, locator: "## Open issues", verification: "pending_human_review", coverage: "partial" },
	{ evidence_id: "e-robertson-23-28", source_id: "src-robertson", line_start: 23, line_end: 28, locator: "Section near lines 23–28", verification: "pending_human_review", coverage: "partial" },
];

export const supplementalSources = [
	{
		source_id: "src-brennek",
		title: "The MJO as envelope, waves as trigger",
		source_version: "version withheld from public package",
		snapshot_date: "2026-11-02",
		session_date: "2026-10-26",
		contribution_family: "talk-brennek",
		attribution_mode: "named_talk",
		source_review_status: "not_established",
		coverage: "partial",
		limitations: "Minutes derived from automatic speech recognition; no explicit scientific sign-off located. Numerical and causal claims require review.",
	},
];
