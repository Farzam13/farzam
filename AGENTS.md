# AGENTS.md — Codex project operating contract

## Working principles
- Inspect repository files, relevant documentation, dependency manifests, and tests before edits.
- Fix root causes. Prefer minimal, reversible, maintainable changes and preserve existing contracts.
- Separate verified findings from assumptions. Add regression checks where practical.
- Protect secrets, user data, authentication, and existing deployments; request approval before destructive operations, schema changes on production, or releases.
- Never silently delete files, modify production infrastructure, or claim unexecuted tests passed.
- Follow established conventions. Avoid unjustified rewrites and new dependencies.
- Communicate in Persian, retaining English code identifiers.
- Finish with changed files, actual checks/results, remaining risks, and next action.

## Project context
- Observed project: Next.js/Supabase multi-tenant home care SaaS.
- Priority safeguards: Enforce clinic_id RLS in every request and export. Protect health data, roles and matching explainability. Verify build.

## Task workflow
1. Locate implementation and affected dependencies.
2. Establish current behavior and a safe change boundary.
3. Implement the requested behavior, respecting safeguards above.
4. Run applicable available tests, type checks and build; report anything untested.
