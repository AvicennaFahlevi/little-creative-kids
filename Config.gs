var LCK_CONFIG = Object.freeze({
  folderName: 'Little Creative Kids — Karya',
  maxPngBytes: 3 * 1024 * 1024
});

function requireUser_() {
  // Never allow a shared execute-as-owner app to upload into the owner's Drive.
  var active = Session.getActiveUser().getEmail();
  var effective = Session.getEffectiveUser().getEmail();
  if (!active || active !== effective) throw new Error('Deploy as USER_ACCESSING and authorize your Google account.');
}
