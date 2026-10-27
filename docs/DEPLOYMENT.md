# Deployment status

Updated 27 October 2026, Asia/Jakarta.

## Created and read back from Google

- Project: **Little Creative Kids**.
- Version **1** was created as a private web app. Its editor URL, launch URL, project ID, and deployment ID are kept in ignored local handoff files, not this public repository.
- API metadata reports `access: MYSELF`, `executeAs: USER_ACCESSING`.
- Fourteen selected application files were uploaded successfully with clasp 3.4.1. A readback of version 1 matched all 14 local source files. OAuth credentials and local project linkage are excluded from Git.

## Verification boundary

The Google Apps Script deployment API returned the launch URL and private configuration. An unauthenticated HTTP launch and the available in-app browser both reached **Sign in — Google Accounts**. This confirms the launch endpoint requires authentication; it does not verify the game's runtime after OAuth consent.

Sign in with the Google account used by the local clasp default authorization, approve the application's Google scopes, and open the web app. Then complete the authenticated launch and optional Drive checks in [QA.md](QA.md). The deployment has not been made public, and a GitHub pull request does not automatically update it.

Cloud backup code is implemented and its input/identity/opt-in controls have unit coverage. An actual artwork write to Google Drive has **not** been verified. Cloud remains disabled until explicitly enabled in Parent Mode.

## Requested project folder

The connected Drive service can read the user-supplied folder, containing an earlier HTML file. However, the Google account authorized in local clasp receives `404 File not found` for that folder. Conversely, the Drive connector cannot read the newly created Apps Script project. The two connections therefore do not currently provide joint access to move the project. Folder identifiers are retained only in the local handoff.

The Apps Script project was created in the deploying account's **Drive root**. Existing folder contents and sharing permissions were preserved. To place the project in the supplied folder, use an account with access to both, or intentionally grant the deploying account folder access. No cross-account sharing was performed.

## Future updates

Keep `.clasp.json` local with the project ID from the private handoff and `rootDir: "."`. Review `clasp show-file-status`, then `clasp push`. Use `clasp update-deployment <deploymentId>` to create a new version for the existing URL. Read back deployment metadata after updating. Never change to execute-as-owner for shared use: uploads must run under the authorizing user's account.

The generated `index.html` is compatible with GitHub Pages. It offers local storage and downloads, while Drive operations are available only through Google Apps Script. GitHub Pages hosting was not changed during this task.
