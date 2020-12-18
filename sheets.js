const ss = SpreadsheetApp.openById(config.sheetID).getActiveSheet();
const endRow = ss.getLastRow() - 1;

/**
* スプレッドシートから検索ワードを取得
* 
* @return {Array} 検索ワード
*/
function getSearchWords() {
    return ss.getRange(2, 1, endRow, 1).getValues();
}

/**
* スプレッドシートからsince_idを取得
* 
* @return {Array} since_id
*/
function getSinceID() {
    return values = ss.getRange(2, 2, endRow, 1).getValues();
}

/**
* スプレッドシートにsince_idを保存
* 
* @param {Array} sinceID since_id
*/
function setSinceID(sinceID) {
    ss.getRange(2, 2, endRow, 1).setValues(sinceID);
}
