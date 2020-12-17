const config = PropertiesService.getScriptProperties().getProperties();

/**
* メイン
*/
function main() {
    const searchWords = getSearchWords();
    let sinceIDs = getSinceID();
    let tweets;
    let blocks = [];

    searchWords.forEach((word, i) => {
        // 検索結果取得
        tweets = getSearchTweets(config.twitterToken, word, sinceIDs[i][0]).statuses;

        // 無い場合return 
        if (tweets.length <= 0) {
            console.log(word + ': NotFound');
            return;
        }

        // 最新ツイートのIDをsince_idに登録
        sinceIDs[i] = [tweets[0].id_str];

        // blockに検索結果を追加
        blocks = addResultBlock(word, tweets, blocks);
    });

    // slackに飛ばす
    const payload = {
        "text": "新しいツイートがみつかりました🐣",
        "blocks": blocks
    };
    sendMessage(config.slackWebhook, payload);

    // since_idをスプレッドシートに保存
    setSinceID(sinceIDs);

    console.log('success!')
}
