// Adds Tiller Tools menu with Amazon Orders Import only (standalone repo).
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Tiller Tools")
    .addItem("Amazon Orders Import", "importAmazonCSV_LocalUpload")
    .addToUi();
}
