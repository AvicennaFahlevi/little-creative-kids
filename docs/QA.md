# Quality assurance

Baseline: 27 October 2026. Tests run against the compiled static page, whose CSS and JavaScript are the same partials served by Apps Script. Authenticated Apps Script rendering and Drive writes require separate runtime verification.

## Executed

- `node tools/check.mjs`: all client scripts and `.gs` files parse; every include resolves; manifest enforces USER_ACCESSING and MYSELF; no filename case collision.
- `node --test tests/geometry.test.mjs tests/backend.test.mjs`: **40 tests passed**. For every uppercase letter A–Z and digit 0–9, correct and imperfect paths pass; empty, tap-only, partial, distant, reversed, extra, and missing-component attempts fail. A covering scribble fails. PNG signature, chunk boundaries, CRCs, size, dimensions, cloud opt-in, and account isolation checks are covered.
- `node tests/browser.mjs`: **19 checks passed** in installed Google Chrome through Playwright. No uncaught page errors. Checks cover all four modules, 13 independent SVG scenes, colors, brush tools, eraser pixels, undo/redo, destructive confirmation, PNG exports, normalized drawings after resize, cancellation, secondary pointers, release outside the canvas, home navigation, reload persistence, real pointer tracing of A and 3, invalid tracing, independent mode, demonstration, counting, parent gate, gallery, mute persistence, and overflow.
- Viewports: 1180×820 landscape, 800×1080 portrait, 390×844 small portrait. Screenshots and JSON results are generated in ignored `test-results/`.

## Run locally

Requires Node 20+ and Google Chrome installed. `npm install`, then `npm run build`, `npm run check`, `npm test`. Start `npm run serve` in another terminal and run `npm run test:browser`. Set `LCK_BROWSER_CHANNEL=msedge` to use installed Edge. For a bundled Playwright installation, set `LCK_NODE_MODULES` to its absolute `node_modules` directory; otherwise the local package is used. The suite always creates a fresh browser context and never uses a personal browser profile.

## Android tablet release checklist — not yet executed

- [ ] Test with a real Android tablet in Chrome, both orientations, with its normal device pixel ratio.
- [ ] Draw slow curves and fast loops with a finger; try pencil, crayon, marker, and eraser.
- [ ] Start another finger while drawing. Only the first finger should be tracked.
- [ ] Leave the canvas while holding a finger; lift outside it and resume.
- [ ] Interrupt a stroke by switching apps, locking the screen, or changing orientation. Resume without a stuck pointer or lost committed strokes.
- [ ] Verify the page does not pan while drawing and ordinary page scrolling works outside the canvas.
- [ ] Confirm PNG downloads in Android's download UI and the Apps Script iframe; reopen the PNG.
- [ ] Close/reopen the tab. Confirm drafts, gallery, and completed practice remain. Repeat in private browsing and with unavailable/full storage; download must remain possible.
- [ ] Exercise all coloring regions with a finger, especially small connecting parts. Confirm fills stay within their regions.
- [ ] Trace every character with a child and educator. Review stroke order and tolerance for age suitability. The current tests use synthetic variation, not a child handwriting dataset.
- [ ] Check Indonesian speech on devices with and without an installed Indonesian voice. Muting must stop speech. Confirm system speech-service behavior and privacy preferences with the parent.
- [ ] Confirm long sessions remain responsive and storage failures give a readable message.
- [ ] Open the deployed `/exec` URL with the deploying Google account, grant the app's scopes, and verify the home screen and all activities.
- [ ] In Parent Mode, enable Drive, save a new PNG, verify it in the app-created folder, then disable Drive and confirm subsequent artwork remains local.
- [ ] Verify another signed-in user cannot access the MYSELF deployment. If access is expanded later, keep USER_ACCESSING and test each user's separate app folder and consent.

## Limits of current validation

Handwriting follows the demonstrated uppercase centerline model and expects one continuous pointer stroke per numbered component, in the shown order and direction. Stroke shape checks use 64 arc-length samples, 80% reference coverage within 8.5% of the writing square, 82% precision within 9.5%, start/end tolerance 14%, mean ordered deviation at most 10.5%, and length ratio 0.65–1.65. These are transparent engineering thresholds, not measured recognition accuracy. Real handwriting, split strokes, alternative orders, and lowercase require future educator-led calibration.

Canvas history is limited to 200 strokes and 8,000 points per stroke to bound memory. Artwork gallery retention is limited by browser storage; there is no promise of permanent or multi-device storage. The first application load needs network access; gameplay then runs locally. This is not an offline-installable PWA.

PNG upload validation checks structure, dimensions, CRCs, and bounds. Apps Script does not decode IDAT pixels, so this is structural validation rather than a full image decoder. Cloud integration is optional and its actual Google Drive write path must be tested after the deploying account grants the web app's scopes.
