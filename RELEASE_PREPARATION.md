# SimpliCSS initial release checklist and licensing review

Status: **release candidate preparation; no npm publication or official external AI provider adoption has occurred.**

## Public npm name

Check the canonical registry read-only with `npm view simplicss name version maintainers --json --registry=https://registry.npmjs.org`, or inspect the GitHub Actions **Release readiness and npm identity** job. A 404 suggests no public metadata at that moment, but does **not** reserve the name or guarantee publishing rights. A 200 indicates existing metadata; do not assume ownership. An authenticated publisher must verify permissions.

We do not publish `simplicss@1.0.3` without verifying ownership and the release history.

## Licensing: MIT adopted by maintainer request

The current `LICENSE` and npm metadata now specify MIT. The standard MIT permission and copyright notices must accompany copies or substantial portions. This prospective change does not cancel any rights granted on previously distributed GPLv3 versions. Before publishing, audit the ownership and provenance of all contributions and third-party source to ensure every part can lawfully be distributed under MIT. Dependencies and bundled external assets may have their own terms.

## Publish gates

- [x] Real Node package entrypoint and AI CLI commands.
- [x] CI pack contents and MCP stdio subprocess tests.
- [x] Public introduction, runnable source examples and agent instructions.
- [ ] Confirm npm name ownership, package identity and reserve under maintainer account.
- [ ] Verify contributor permissions, third-party notices and intended redistribution under MIT.
- [ ] Independently test Claude Code and Gemini CLI with actual model calls.
- [ ] Audit browser compatibility/accessibility and fix release-blocking bugs.
- [ ] Choose semver version/tag and publish via authenticated npm account.
- [ ] Tag GitHub release with checksum/changelog and published package provenance.

The GitHub Pages landing page source lives at `docs/index.html`. Hosting requires enabling GitHub Pages (deploy from `main` / `docs`) or another deployment target.
