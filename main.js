const config = PropertiesService.getScriptProperties().getProperties();

// メイン
function main() {
    const lock = LockService.getScriptLock();
    // ロック
    if (lock.tryLock(3000)) {
        exec();
        lock.releaseLock();
    } else {
        console.log("既にスクリプトが実行されています");
    }
}

// 処理
function exec() {
    const searchWords = getSearchWords();
    let sinceIDs = getSinceID();
    let tweets;
    let blocks = [];

    searchWords.forEach((word, i) => {
        try {
            // 検索結果取得
            tweets = getSearchTweets(config.twitterToken, word, sinceIDs[i][0]).statuses;
        } catch (err) {
            console.error(`[Error] ${word}\n${err}`);
            return;
        }

        // 検索結果が0件ならスキップ
        if (tweets.length <= 0) {
            console.log(`[NotFound] ${word}`);
            return;
        }

        // 最新ツイートのIDをsince_idに登録
        sinceIDs[i] = [tweets[0].id_str];

        // blockに検索結果を追加
        blocks = addResultBlock(word, tweets, blocks);
    });

    // 検索結果がない場合処理を中断
    if (blocks.length <= 0) {
        return;
    }

    // slackに飛ばす
    const payload = {
        "text": "新しいツイートがみつかりました🐣",
        "blocks": blocks
    }

    try {
        sendMessage(config.slackWebhook, payload);
    } catch (err) {
        console.error(err);
        throw new error('Slackへの送信に失敗しました');
    }

    // since_idをスプレッドシートに保存
    setSinceID(sinceIDs);

    console.log('Success');
}
