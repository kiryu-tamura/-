// script.js (完成版)

// --- グローバル変数定義 ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameState = 'TITLE'; // ゲームの状態 ('TITLE', 'QUESTION', 'RESULT')
let currentQuestionIndex = 0; // 現在の質問番号 (0から)
let points = {}; // 各キャラクターのポイント
let resultCharacter = ''; // 診断結果のキャラクター名

// ボタン領域の定義
const startButton = { x: canvas.width / 2 - 100, y: 300, width: 200, height: 50 };
const replayButton = { x: canvas.width / 2 - 100, y: 500, width: 200, height: 50 };

// --- データ定義 ---

// 質問データ
const questions = [
    { text: "まったく知らない場所に来てしまった！まずどうする？", choices: [{ text: "A. 不安もあるけど、好奇心が勝つ！とりあえず探索してみる。", points: { rin: 4, chihiro: 2 } },{ text: "B. 周囲を注意深く観察し、安全な場所や情報を探す。", points: { haku: 4, kamaji: 4 } },{ text: "C. 頼れそうな人を探して、状況を尋ねてみる。", points: { chihiro: 3, zeniba: 3, bou: 2 } }]},
    { text: "誰かが明らかに困っている様子。あなたなら？", choices: [{ text: "A. 放っておけない！自分のことは後回しにしてでも助けようとする。", points: { chihiro: 5, zeniba: 4, kaonashi: 2 } },{ text: "B. 自分に何ができるか考え、無理のない範囲で手伝う。", points: { rin: 2, kamaji: 2, haku: 2 } },{ text: "C. 関わると面倒なことになりそう… そっと距離を置く。", points: { yubaba: 5 } }]},
    { text: "責任重大な役割や仕事を任された！どう感じる？", choices: [{ text: "A. プレッシャー！でも、やりがいを感じて「やってやろう！」と燃える。", points: { rin: 4 } },{ text: "B. 「自分にできるかな…」と不安になる。まずは手順や詳細を確認したい。", points: { chihiro: 3, kamaji: 3, haku: 2 } },{ text: "C. 正直、ちょっと面倒くさい。できるだけ効率よく、楽に終わらせたい。", points: { yubaba: 4 } }]},
    { text: "自分の大切な目標を達成するためなら…", choices: [{ text: "A. 周囲との関係を壊してまで進むことはできない。", points: { zeniba: 5, chihiro: 4 } },{ text: "B. 時には、誰かの反対を押し切る覚悟も必要だと思う。", points: { haku: 3, rin: 3 } },{ text: "C. 使えるものは何でも使う。手段を選んでいる余裕はない。", points: { yubaba: 5 } }]},
    { text: "グループの中で、自分の意見が他の人と違ったら？", choices: [{ text: "A. まずは相手の意見をしっかり聞く。場の調和を大切にしたい。", points: { zeniba: 4, chihiro: 3, kaonashi: 3 } },{ text: "B. なぜ違うのか、お互いの考えを話し合って理解を深めたい。", points: { kamaji: 3, haku: 3 } },{ text: "C. 自分の考えが正しいと思うなら、はっきりと主張する。", points: { yubaba: 5, rin: 4, bou: 3 } }]},
    { text: "古くからのルールや決まりごとについてどう思う？", choices: [{ text: "A. 大切に守っていくべき、秩序の基本だと思う。", points: { kamaji: 5, yubaba: 3 } },{ text: "B. 良いものは残しつつ、時代や状況に合わせて変えるべきだ。", points: { rin: 4, chihiro: 3, zeniba: 2 } },{ text: "C. あまり縛られたくない。自分のやり方で進めたい。", points: { haku: 3, rin: 2, yubaba: 1 } }]},
    { text: "あなたが誰かに親切にするのは、どんな時？", choices: [{ text: "A. 見返りなんて考えない。困っている人がいたら自然と体が動く。", points: { chihiro: 5, zeniba: 4, kaonashi: 2 } },{ text: "B. 相手のためでもあるし、巡り巡って自分のためにもなると思うから。", points: { kamaji: 3, rin: 2 } },{ text: "C. その人に恩を売っておけば、後で何か頼みやすくなるかもしれないから。", points: { yubaba: 5 } }]},
    { text: "ひとりで過ごす時間は好き？", choices: [{ text: "A. 大好き！誰にも邪魔されず、自分の世界に没頭できる貴重な時間。", points: { haku: 5, kamaji: 4, kaonashi: 3 } },{ text: "B. 嫌いではない。考え事をしたり、リラックスしたりするのに良い。", points: { zeniba: 3, chihiro: 2 } },{ text: "C. どちらかというと苦手。誰かと一緒にいる方が安心するし楽しい。", points: { rin: 4, bou: 3, yubaba: 2 } }]},
    { text: "「これが欲しい！」「これを食べたい！」という強い欲求が湧いてきたら？", choices: [{ text: "A. 我慢できない！すぐに手に入れるか、満たそうと行動する。", points: { kaonashi: 5, yubaba: 4, bou: 3 } },{ text: "B. グッとこらえる。欲求に流されず、理性的に判断したい。", points: { zeniba: 5, kamaji: 4, haku: 3 } },{ text: "C. 他のことをして気を紛らわせる。時間が経てば収まるかも。", points: { chihiro: 3 } }]},
    { text: "困難な壁にぶつかった時、どう乗り越える？", choices: [{ text: "A. 諦めずに何度も挑戦する。その経験が自分を強くすると信じている。", points: { chihiro: 5, bou: 3, rin: 3 } },{ text: "B. 一人で抱え込まず、信頼できる人に相談して助けを求める。", points: { kaonashi: 4 } },{ text: "C. 冷静に状況を分析し、最も合理的で効率的な解決策を探す。", points: { yubaba: 3, haku: 3, kamaji: 2 } }]}
];

// 結果表示用コンテンツ
const resultContents = {
    chihiro: { name: "千尋", description: "物語の主人公。最初は少し臆病で無気力な普通の女の子でしたが、不思議な世界での様々な出会いや困難な仕事を通して、状況に適応し、優しさや勇気を発揮して大きく成長していきます。大切な人を守るためなら、どんな困難にも立ち向かう芯の強さを持っています。", reason: "あなたは、慣れない環境にも粘り強く適応し、困難な状況でも諦めずに解決策を探そうと努力できる人ですね。周りの人を大切に思い、誰かのために行動できる深い優しさを持っています。最初は不安を感じても、経験を通して学び、内なる勇気を発揮できるところが、千尋タイプと言えるでしょう。" },
    haku: { name: "ハク", description: "千尋を助ける謎めいた少年。湯婆婆のもとで働きながらも、どこか影があり、冷静沈着な雰囲気をまとっています。知的で計画性に優れ、いざという時には強い意志と力を示します。大切な存在を守るためには、自身を危険にさらすことも厭わない忠誠心と優しさを秘めています。", reason: "あなたは、物事を冷静に分析し、慎重に計画を立ててから行動する知的なタイプ。多くを語らず、内に強い意志や信念を秘めているところがあるのでは？大切な人や自分の信じるもののために、静かに、しかし力強く行動できるところが、ハクタイプと言えるでしょう。" },
    yubaba: { name: "湯婆婆", description: "油屋を取り仕切るパワフルな経営者。強欲で支配的な一方で、現実的な判断力と経営手腕も持っています。自分の目標達成のためには手段を選ばない厳しさがありますが、息子の坊には非常に甘いという一面も。エネルギッシュで存在感のある人物です。", reason: "あなたは、自分の目標に向かってパワフルに行動できる人ですね。現実的な視点を持ち、物事を効率的に進める力があります。周りを巻き込み、自分の考えをはっきりと主張できる強いリーダーシップを持っているところが、湯婆婆タイプと言えるでしょう。損得勘定にも明るいのでは？" },
    zeniba: { name: "銭婆", description: "湯婆婆の双子の姉ですが、性格は正反対。沼の底で質素ながらも心豊かな生活を送る、穏やかで賢明な魔女です。訪れる者を温かく迎え入れ、的確な助言を与えてくれます。手作りの温もりや、他者を受け入れる寛大さを大切にしています。", reason: "あなたは、周りの人を温かく受け入れ、優しく見守ることができる人ですね。目先の利益や派手さよりも、心の充足や穏やかな人間関係を大切にする傾向があるのでは？物事の本質を見抜く落ち着きと、見返りを求めない親切心を持っているところが、銭婆タイプと言えるでしょう。" },
    kaonashi: { name: "カオナシ", description: "自分の顔や声を持たず、他者の影響を受けやすい不思議な存在。最初は静かで孤独な様子ですが、環境や関わる相手によって大きく変化します。人との繋がりを強く求めており、純粋さゆえに時に暴走してしまうことも。根は寂しがり屋で、自分の居場所を探しています。", reason: "あなたは、周りの人の気持ちや場の空気にとても敏感で、共感力が高い人かもしれません。人との繋がりを大切にし、誰かに受け入れられたいという気持ちが強いのでは？純粋で繊細な心を持ち、環境によって様々な側面を見せるところが、カオナシタイプと言えるでしょう。" },
    kamaji: { name: "鎌爺", description: "油屋のボイラー室を取り仕切る釜焚きのおじいさん。多くの腕を操り、黙々と仕事をこなす職人気質です。一見ぶっきらぼうで取っ付きにくいですが、根は優しく情に厚い一面も。頼られると、文句を言いながらも面倒を見てくれる、縁の下の力持ちです。", reason: "あなたは、任された仕事や自分の役割を責任感を持って黙々とこなす、実直なタイプですね。多くを語らず、自分の仕事に誇りを持っているのでは？ぶっきらぼうに見えても、実は困っている人を見ると放っておけない、内に秘めた優しさを持っているところが、鎌爺タイプと言えるでしょう。" },
    rin: { name: "リン", description: "油屋で働く千尋の先輩。サバサバした姉御肌で、現実的な考え方の持ち主です。口は少し悪いけれど、面倒見が良く、困っている千尋を何かと助けてくれます。油屋を出て自分の道を歩むことを夢見ており、たくましく生きる力を持っています。", reason: "あなたは、現実をしっかり見据え、テキパキと行動できる人ですね。面倒見が良く、仲間や後輩から頼りにされることが多いのでは？少し口調は強くても、困っている人を放っておけない優しさと、自分の目標に向かって努力するタフさを持っているところが、リンタイプと言えるでしょう。" },
    bou: { name: "坊", description: "湯婆婆に溺愛されて育った巨大な赤ちゃん。最初はわがままで自己中心的でしたが、千尋との旅を通じて外の世界を知り、他者への共感や自分で行動することの大切さを学び、大きく成長します。根は素直で、大切な人を守ろうとする気持ちも持っています。", reason: "あなたは、素直で、自分の気持ちに正直なタイプかもしれません。守られた環境から一歩踏み出し、新しい経験を通して大きく成長できる可能性を秘めています。最初は自分のこと中心でも、大切な人のためなら勇気を出して行動できる、そんな純粋さと変化の可能性を持っているところが、坊タイプと言えるでしょう。" }
};

// 画像読み込み関連
const characterImages = {}; // 読み込んだ画像オブジェクト
let imagesLoaded = 0;     // 読み込み完了した画像の数
const totalImages = Object.keys(resultContents).length; // 画像の総数 (8)
let allImagesLoaded = false; // 全画像読み込み完了フラグ
let choiceButtons = [];   // 選択肢ボタンのクリック領域

// --- 関数定義 ---

/**
 * 画像を事前に読み込む関数
 */
function preloadImages() {
    console.log("画像のプリロードを開始します...");
    for (const charKey in resultContents) {
        characterImages[charKey] = new Image();
        // 画像読み込み完了時の処理
        characterImages[charKey].onload = () => {
            imagesLoaded++;
            console.log(`${charKey}.png が読み込まれました (${imagesLoaded}/${totalImages})`);
            // 全ての画像が読み込まれたらフラグを立てて、最初の描画を行う
            if (imagesLoaded === totalImages) {
                console.log("全ての画像が読み込まれました。");
                allImagesLoaded = true;
                drawGame(); // 画像読み込み後に最初の描画を開始
            }
        };
        // 画像読み込み失敗時の処理
        characterImages[charKey].onerror = () => {
            console.error(`${charKey}.png の読み込みに失敗しました。imagesフォルダとファイル名を確認してください。`);
            imagesLoaded++; // エラーでもカウントは進める（無限ループ防止）
             if (imagesLoaded === totalImages) {
                allImagesLoaded = true;
                drawGame();
            }
        };
        // 画像ファイルのパスを指定
        characterImages[charKey].src = `images/${charKey}.png`;
    }
}

/**
 * 指定された幅でテキストを折り返して描画する関数
 * @param {CanvasRenderingContext2D} context - Canvasの2Dコンテキスト
 * @param {string} text - 描画するテキスト
 * @param {number} x - 描画開始位置のX座標
 * @param {number} y - 描画開始位置のY座標
 * @param {number} maxWidth - テキストの最大幅
 * @param {number} lineHeight - 行の高さ
 */
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const lines = text.split('\n'); // まず改行コードで分割
    let currentY = y;

    for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(' '); // 次にスペースで単語に分割
        let line = ''; // 現在の行

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '; // 次の単語を追加してテスト
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;

            // 幅が最大幅を超えたら、現在の行を描画して改行
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, currentY);
                line = words[n] + ' '; // 新しい行は現在の単語から開始
                currentY += lineHeight;
            } else {
                // 幅を超えなければ、テスト行を現在の行にする
                line = testLine;
            }
        }
        // ループの最後に残った行を描画
        context.fillText(line.trim(), x, currentY); // 行末のスペースを削除して描画
        currentY += lineHeight; // 改行コードまたは行末で改行
    }
}

/**
 * タイトル画面を描画する関数
 */
function drawTitleScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0'; // 背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // タイトル
    ctx.fillStyle = 'black';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('千と千尋の正確診断', canvas.width / 2, 150);

    // スタートボタン
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px sans-serif';
    ctx.fillText('診断スタート！', canvas.width / 2, startButton.y + 35); // Y座標を調整して中央に
}

/**
 * 質問画面を描画する関数
 */
function drawQuestionScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0'; // 背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 現在の質問データを取得
    const currentQuestion = questions[currentQuestionIndex];

    // 質問文を描画 (wrapTextを使用)
    ctx.fillStyle = 'black';
    ctx.font = '24px sans-serif'; // 質問文のフォントサイズ
    ctx.textAlign = 'left';       // wrapTextは左揃え前提
    const questionText = `Q${currentQuestionIndex + 1}. ${currentQuestion.text}`;
    const questionX = 50;          // 左端マージン
    const questionY = 80;          // 開始Y座標
    const questionMaxWidth = canvas.width - questionX * 2; // 最大幅
    const questionLineHeight = 30; // 行の高さ
    wrapText(ctx, questionText, questionX, questionY, questionMaxWidth, questionLineHeight);

    // 選択肢ボタンを描画
    choiceButtons = []; // 描画前にリセット
    const buttonWidth = 600; // ボタンの幅
    const buttonHeight = 50;  // ボタンの高さ
    const startY = 180;      // 最初のボタンのY座標 (質問文の高さに応じて調整が必要な場合あり)
    const gap = 20;          // ボタン間の隙間
    const startX = canvas.width / 2 - buttonWidth / 2; // 中央揃えのためのX座標

    currentQuestion.choices.forEach((choice, index) => {
        const buttonY = startY + index * (buttonHeight + gap);
        const button = {
            x: startX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            choiceIndex: index // どの選択肢かを示すインデックス
        };
        choiceButtons.push(button); // クリック判定用に保存

        // ボタンの描画
        ctx.fillStyle = 'lightgreen';
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = 'black';
        ctx.font = '18px sans-serif'; // 選択肢のフォントサイズ
        ctx.textAlign = 'left';       // 選択肢テキストは左揃え
        // テキストをボタンの中央（垂直方向）に配置
        const textX = button.x + 15; // 左に少し余白
        const textY = button.y + buttonHeight / 2 + 6; // 中央より少し下 (ベースライン調整)
        // TODO: 選択肢テキストもwrapTextを使うとより安全
        ctx.fillText(choice.text, textX, textY);
    });
}

/**
 * 結果画面を描画する関数
 */
function drawResultScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0'; // 背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 結果データと画像を取得
    const content = resultContents[resultCharacter];
    const image = characterImages[resultCharacter];

    // 結果が見つからない場合のエラー表示
    if (!content) {
        ctx.fillStyle = 'red'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('エラー: 結果データが見つかりません。', canvas.width / 2, 100);
        return;
    }

    // 1. 見出しを描画
    ctx.fillStyle = 'black';
    ctx.font = '30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`あなたのキャラクタータイプは【${content.name}】です！`, canvas.width / 2, 60);

    // 2. 画像を描画
    const imgWidth = 200; // 表示画像の幅
    const imgHeight = image.height * (imgWidth / image.width); // アスペクト比維持
    const imgX = canvas.width / 2 - imgWidth / 2; // 中央X座標
    const imgY = 100; // Y座標
    if (image && image.complete && image.naturalWidth !== 0) { // 画像が読み込み完了かつ有効なら描画
         ctx.drawImage(image, imgX, imgY, imgWidth, imgHeight);
    } else { // 読み込み中または失敗時の代替表示
         ctx.fillStyle = 'grey';
         ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
         ctx.fillStyle = 'white'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
         ctx.fillText('画像表示不可', canvas.width/2, imgY + imgHeight / 2);
         console.error(`画像の描画に失敗: ${resultCharacter}`);
    }

    // 3. キャラクター紹介文を描画 (wrapTextを使用)
    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    const textX = 50; // テキストエリアの左端X座標
    const textMaxWidth = canvas.width - textX * 2; // テキストエリアの最大幅
    const textLineHeight = 24; // 行の高さ
    const descY = imgY + imgHeight + 30; // 紹介文の開始Y座標
    wrapText(ctx, `【${content.name}とは？】\n${content.description}`, textX, descY, textMaxWidth, textLineHeight);

    // 4. 診断理由を描画 (wrapTextを使用)
    // Y座標は前のテキストの高さに応じて調整が必要（今回は固定値で試す）
    const reasonY = 360; // 診断理由の開始Y座標 (必要に応じて調整)
    wrapText(ctx, `【あなたが${content.name}タイプの理由】\n${content.reason}`, textX, reasonY, textMaxWidth, textLineHeight);

    // 5. もう一度プレイボタンを描画
    ctx.fillStyle = 'lightcoral';
    ctx.fillRect(replayButton.x, replayButton.y, replayButton.width, replayButton.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('もう一度診断する', canvas.width / 2, replayButton.y + 35); // Y座標調整
}

/**
 * 診断結果を計算する関数
 */
function calculateResult() {
    let maxPoints = -1;
    let topCharacter = '';
    // キャラクターの優先順位リスト (同点の場合)
    const characterPriority = ['chihiro', 'haku', 'zeniba', 'rin', 'kamaji', 'bou', 'kaonashi', 'yubaba'];

    console.log("最終ポイント:", points); // デバッグ用

    for (const character of characterPriority) {
        const currentPoints = points[character] || 0; // ポイントがない場合は0として扱う
        if (currentPoints > maxPoints) {
            maxPoints = currentPoints;
            topCharacter = character;
        }
    }

    // もし全員0点だった場合のフォールバック
    if (topCharacter === '') {
        topCharacter = characterPriority[0]; // デフォルトで千尋にする
        console.warn("全員のポイントが0でした。デフォルトの結果を表示します。");
    }

    resultCharacter = topCharacter; // 結果をグローバル変数に格納
    console.log("診断結果:", resultCharacter); // デバッグ用
}

/**
 * ゲームの状態に応じて適切な描画関数を呼び出す関数
 */
function drawGame() {
    // 画像読み込み完了を待つ
    if (!allImagesLoaded) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('画像を読み込み中...', canvas.width / 2, canvas.height / 2);
        return; // 描画中断
    }

    // 状態に応じて描画
    if (gameState === 'TITLE') {
        drawTitleScreen();
    } else if (gameState === 'QUESTION') {
        drawQuestionScreen();
    } else if (gameState === 'RESULT') {
        // 結果計算は結果画面表示の初回のみ行う
        if (resultCharacter === '') {
             calculateResult();
        }
        drawResultScreen();
    }
}

/**
 * Canvas上でのクリックイベントを処理する関数
 * @param {MouseEvent} event - クリックイベントオブジェクト
 */
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // タイトル画面での処理
    if (gameState === 'TITLE') {
        if (clickX >= startButton.x && clickX <= startButton.x + startButton.width &&
            clickY >= startButton.y && clickY <= startButton.y + startButton.height) {
            console.log('スタートボタンクリック');
            // ゲーム開始処理
            gameState = 'QUESTION';
            currentQuestionIndex = 0;
            // ポイントを初期化
            points = { chihiro: 0, haku: 0, yubaba: 0, zeniba: 0, kaonashi: 0, kamaji: 0, rin: 0, bou: 0 };
            resultCharacter = ''; // 結果もリセット
            drawGame(); // 質問画面を描画
        }
    }
    // 質問画面での処理
    else if (gameState === 'QUESTION') {
        choiceButtons.forEach(button => {
            // クリック位置が選択肢ボタンの範囲内かチェック
            if (clickX >= button.x && clickX <= button.x + button.width &&
                clickY >= button.y && clickY <= button.y + button.height) {
                console.log(`Q${currentQuestionIndex + 1} - 選択肢 ${button.choiceIndex + 1} クリック`);

                // ポイントを加算
                const selectedChoice = questions[currentQuestionIndex].choices[button.choiceIndex];
                for (const char in selectedChoice.points) {
                    // pointsオブジェクトにキーが存在しない場合も考慮
                    points[char] = (points[char] || 0) + selectedChoice.points[char];
                }
                // console.log("現在のポイント:", points); // デバッグ用

                // 次の質問へ
                currentQuestionIndex++;

                // 全問終了したかチェック
                if (currentQuestionIndex >= questions.length) {
                    gameState = 'RESULT'; // 結果画面へ
                }

                drawGame(); // 次の質問または結果画面を描画
            }
        });
    }
    // 結果画面での処理
    else if (gameState === 'RESULT') {
        // もう一度プレイボタンがクリックされたかチェック
         if (
            clickX >= replayButton.x && clickX <= replayButton.x + replayButton.width &&
            clickY >= replayButton.y && clickY <= replayButton.y + replayButton.height
        ) {
            console.log('もう一度診断ボタンクリック');
            // ゲーム状態をタイトルに戻す
            gameState = 'TITLE';
            // resultCharacterをリセット (他はTITLE画面遷移時にリセットされる)
            resultCharacter = '';
            drawGame(); // タイトル画面を描画
        }
    }
}

// --- 初期化処理 ---
canvas.addEventListener('click', handleClick); // クリックイベントリスナーを設定
preloadImages(); // 画像のプリロードを開始 (完了後にdrawGameが呼ばれる)

console.log('千と千尋の正確診断ゲームへようこそ！');

