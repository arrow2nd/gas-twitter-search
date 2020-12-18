/**
* ツイートを検索
*
* @param  {String} token Bearer token
* @param  {String} query 検索ワード
* @return                検索結果
*/
function getSearchTweets(token, query, sinceID) {
    // RTを除外
    query = encodeURIComponent(query + ' -filter:retweets');

    // since_idがあればクエリに追加
    if (sinceID != '') {
        query += '&since_id=' + sinceID;
    }

    var bearerAuthHeader = {
        'Authorization': 'Bearer ' + token
    };

    var res = UrlFetchApp.fetch(
        'https://api.twitter.com/1.1/search/tweets.json?q=' + query + '&count=103&result_type=recent',
        { 'headers': bearerAuthHeader }
    );

    result = JSON.parse(res);

    return result;
}
