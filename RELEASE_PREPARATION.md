# SimpliCSS initial release checklist and licensing review

Status: **release candidate preparation; no npm publication or official external AI provider adoption has occurred.**

## Public npm name

Check the canonical registry read-only with `npm view simplicss name version maintainers --json --registry=https://registry.npmjs.org`, or inspect the GitHub Actions **Release readiness and npm identity** job. A 404 suggests no public metadata at that moment, but does **not** reserve the name or guarantee publishing rights. A 200 indicates existing metadata; do not assume ownership. An authenticated publisher must verify permissions.

We do not publish `simplicss@1.0.3` without verifying ownership and the release history.

## Licensing (requires maintainer review)

The repository `LICENSE` contains GPLv3 and npm metadata says `GPL-3.0-only`; this is consistent with the existing legal file, not a new license grant.

GNU GPLv3 permits commercial use, but redistributing GPL-covered code or a combined derivative work may carry source availability and license obligations. For a CSS framework intended to be bundled into commercial websites and AI-generated deliverables, these requirements deserve specialist review. Permissive options such as MIT or Apache-2.0 could lower downstream friction **only if all copyright holders approve and third-party code rights allow relicensing**. Do not assume the author is the sole copyright holder; do not change license files automatically.

## Publish gates

- [x] Real Node package entrypoint and AI CLI commands.
- [x] CI pack contents and MCP stdio subprocess tests.
- [x] Public introduction, runnable source examples and agent instructions.
- [ ] Confirm npm name ownership, package identity and reserve under maintainer account.
- [ ] Review permissions and intended commercial/AI downstream redistribution.
- [ ] Independently test Claude Code and Gemini CLI with actual model calls.
- [ ] Audit browser compatibility/accessibility and fix release-blocking bugs.
- [ ] Choose semver version/tag and publish via authenticated npm account.
- [ ] Tag GitHub release with checksum/changelog and published package provenance.

The GitHub Pages landing page source lives at `docs/index.html`. Hosting requires enabling GitHub Pages (deploy from `main` / `docs`) or another deployment target.
