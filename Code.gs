function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('Little Creative Kids').addMetaTag('viewport','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}
