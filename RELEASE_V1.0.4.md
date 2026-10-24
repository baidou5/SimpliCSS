# SimpliCSS v1.0.4 — npm publishing handoff

Release candidate prepared for the public npm package `simplicss`.

**Publication has NOT happened unless the npm registry displays this exact version.**

## One-time owner setup

1. Sign into https://www.npmjs.com/ with the account that should own `simplicss`.
2. Verify that the package name remains available; npm registry 404 is not a reservation.
3. Verify ownership and MIT relicensing permission for every contribution and embedded third-party asset.
4. In GitHub repository Settings → Environments, create `npm-publish` with required reviewers if desired.
5. Create a granular npm publication token with the necessary package permissions and 2FA-bypass publishing authorization, then store it **only** as a GitHub repository secret named `NPM_PUBLISH_TOKEN`. Never commit it or paste it into chat.
6. From GitHub Actions, manually run **Publish SimpliCSS to npm** against `main` with release_version `1.0.4` and confirm `PUBLISH`.
7. Confirm `npm view simplicss@1.0.4 name version license --json` and `npm install simplicss@1.0.4`.

Workflow does not execute automatically. It is guarded by an explicit confirmation and protected environment. Publishing requires configured npm credentials; CI without credentials only validates the candidate.

**Preferred future hardening:** After first publication, set up npm Trusted Publishing with GitHub Actions OIDC and remove long-lived publish tokens. npm Trusted Publishing requires Node >=22.14 and npm CLI >=11.5.1 and a configured trust relation under the package settings. First-time publishing may require owner bootstrap, according to current npm documentation.

License: MIT for project-owned sources; earlier GPL grants survive for previously distributed versions; third-party rights remain independent.
