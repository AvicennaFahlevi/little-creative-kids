function doGet() {
  return HtmlService.createTemplateFromFile('Shell').evaluate()
    .setTitle('Little Creative Kids')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Only trusted, fixed partial names from Shell.html are included.
function include_(name) {
  var allowed = ['Styles','Utilities','References','Audio','Drawing','Coloring','Alphabet','Numbers','App'];
  if (allowed.indexOf(name) < 0) throw new Error('Unknown partial');
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}
