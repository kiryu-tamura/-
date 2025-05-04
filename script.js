// script.js (完成版 - Q9修正)

// --- グローバル変数定義 ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameState = 'TITLE';
let currentQuestionIndex = 0;
let points = {};
let resultCharacter = '';

const startButton = { x: canvas.width / 2 - 100, y: 300, width: 200, height: 50 };
const replayButton = { x: canvas.width / 2 - 100, y: 500, width: 200, height: 50 };

// --- データ定義 ---

const questions = [ /* ... (質問データは変更なし、省略) ... */
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
const resultContents = { /* ... (結果コンテンツデータは変更なし、省略) ... */
    chihiro: { name: "千尋", description: "物語の主人公。最初は少し臆病で無気力な普通の女の子でしたが、不思議な世界での様々な出会いや困難な仕事を通して、状況に適応し、優しさや勇気を発揮して大きく成長していきます。大切な人を守るためなら、どんな困難にも立ち向かう芯の強さを持っています。", reason: "あなたは、慣れない環境にも粘り強く適応し、困難な状況でも諦めずに解決策を探そうと努力できる人ですね。周りの人を大切に思い、誰かのために行動できる深い優しさを持っています。最初は不安を感じても、経験を通して学び、内なる勇気を発揮できるところが、千尋タイプと言えるでしょう。" },
    haku: { name: "ハク", description: "千尋を助ける謎めいた少年。湯婆婆のもとで働きながらも、どこか影があり、冷静沈着な雰囲気をまとっています。知的で計画性に優れ、いざという時には強い意志と力を示します。大切な存在を守るためには、自身を危険にさらすことも厭わない忠誠心と優しさを秘めています。", reason: "あなたは、物事を冷静に分析し、慎重に計画を立ててから行動する知的なタイプ。多くを語らず、内に強い意志や信念を秘めているところがあるのでは？大切な人や自分の信じるもののために、静かに、しかし力強く行動できるところが、ハクタイプと言えるでしょう。" },
    yubaba: { name: "湯婆婆", description: "油屋を取り仕切るパワフルな経営者。強欲で支配的な一方で、現実的な判断力と経営手腕も持っています。自分の目標達成のためには手段を選ばない厳しさがありますが、息子の坊には非常に甘いという一面も。エネルギッシュで存在感のある人物です。", reason: "あなたは、自分の目標に向かってパワフルに行動できる人ですね。現実的な視点を持ち、物事を効率的に進める力があります。周りを巻き込み、自分の考えをはっきりと主張できる強いリーダーシップを持っているところが、湯婆婆タイプと言えるでしょう。損得勘定にも明るいのでは？" },
    zeniba: { name: "銭婆", description: "湯婆婆の双子の姉ですが、性格は正反対。沼の底で質素ながらも心豊かな生活を送る、穏やかで賢明な魔女です。訪れる者を温かく迎え入れ、的確な助言を与えてくれます。手作りの温もりや、他者を受け入れる寛大さを大切にしています。", reason: "あなたは、周りの人を温かく受け入れ、優しく見守ることができる人ですね。目先の利益や派手さよりも、心の充足や穏やかな人間関係を大切にする傾向があるのでは？物事の本質を見抜く落ち着きと、見返りを求めない親切心を持っているところが、銭婆タイプと言えるでしょう。" },
    kaonashi: { name: "カオナシ", description: "自分の顔や声を持たず、他者の影響を受けやすい不思議な存在。最初は静かで孤独な様子ですが、環境や関わる相手によって大きく変化します。人との繋がりを強く求めており、純粋さゆえに時に暴走してしまうことも。根は寂しがり屋で、自分の居場所を探しています。", reason: "あなたは、周りの人の気持ちや場の空気にとても敏感で、共感力が高い人かもしれません。人との繋がりを大切にし、誰かに受け入れられたいという気持ちが強いのでは？純粋で繊細な心を持ち、環境によって様々な側面を見せるところが、カオナシタイプと言えるでしょう。" },
    kamaji: { name: "鎌爺", description: "油屋のボイラー室を取り仕切る釜焚きのおじいさん。多くの腕を操り、黙々と仕事をこなす職人気質です。一見ぶっきらぼうで取っ付きにくいですが、根は優しく情に厚い一面も。頼られると、文句を言いながらも面倒を見てくれる、縁の下の力持ちです。", reason: "あなたは、任された仕事や自分の役割を責任感を持って黙々とこなす、実直なタイプですね。多くを語らず、自分の仕事に誇りを持っているのでは？ぶっきらぼうに見えても、実は困っている人を見ると放っておけない、内に秘めた優しさを持っているところが、鎌爺タイプと言えるでしょう。" },
    rin: { name: "リン", description: "油屋で働く千尋の先輩。サバサバした姉御肌で、現実的な考え方の持ち主です。口は少し悪いけれど、面倒見が良く、困っている千尋を何かと助けてくれます。油屋を出て自分の道を歩むことを夢見ており、たくましく生きる力を持っています。", reason: "あなたは、現実をしっかり見据え、テキパキと行動できる人ですね。面倒見が良く、仲間や後輩から頼りにされることが多いのでは？少し口調は強くても、困っている人を放っておけない優しさと、自分の目標に向かって努力するタフさを持っているところが、リンタイプと言えるでしょう。" },
    bou: { name: "坊", description: "湯婆婆に溺愛されて育った巨大な赤ちゃん。最初はわがままで自己中心的でしたが、千尋との旅を通じて外の世界を知り、他者への共感や自分で行動することの大切さを学び、大きく成長します。根は素直で、大切な人を守ろうとする気持ちも持っています。", reason: "あなたは、素直で、自分の気持ちに正直なタイプかもしれません。守られた環境から一歩踏み出し、新しい経験を通して大きく成長できる可能性を秘めています。最初は自分のこと中心でも、大切な人のためなら勇気を出して行動できる、そんな純粋さと変化の可能性を持っているところが、坊タイプと言えるでしょう。" }
};
const characterImages = {};
let imagesLoaded = 0;
const totalImages = Object.keys(resultContents).length;
let allImagesLoaded = false;
let choiceButtons = []; // 選択肢ボタンの領域を保持する配列

// --- 関数定義 ---

// 画像の事前読み込み関数 (変更なし)
function preloadImages() { /* ... (省略) ... */
    console.log("画像のプリロードを開始します...");
    for (const charKey in resultContents) {
        characterImages[charKey] = new Image();
        characterImages[charKey].onload = () => {
            imagesLoaded++; console.log(`${charKey}.png が読み込まれました (${imagesLoaded}/${totalImages})`);
            if (imagesLoaded === totalImages) { console.log("全ての画像が読み込まれました。"); allImagesLoaded = true; drawGame(); }
        };
        characterImages[charKey].onerror = () => {
            console.error(`${charKey}.png の読み込みに失敗しました。imagesフォルダとファイル名を確認してください。`); imagesLoaded++;
             if (imagesLoaded === totalImages) { allImagesLoaded = true; drawGame(); }
        };
        characterImages[charKey].src = `images/${charKey}.png`;
    }
}

// テキスト折り返し描画関数 (デバッグ用ログ追加)
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const lines = text.split('\n');
    let currentY = y;

    for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                // *** 追加: ログ出力 1 ***
                console.log(`wrapText: Drawing line part 1: "${line}" at Y=${currentY}`);
                context.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        // *** 追加: ログ出力 2 ***
        console.log(`wrapText: Drawing line part 2 (final): "${line}" at Y=${currentY}`);
        context.fillText(line, x, currentY);
        currentY += lineHeight;
    }
}

// 描画関数: タイトル画面 (変更なし)
function drawTitleScreen() { /* ... (省略) ... */
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black'; ctx.font = '40px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('千と千尋の正確診断', canvas.width / 2, 150);
    ctx.fillStyle = 'lightblue'; ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
    ctx.fillStyle = 'black'; ctx.font = '20px sans-serif';
    ctx.fillText('診断スタート！', canvas.width / 2, startButton.y + 35);
}

// *** ↓↓↓ drawQuestionScreen 関数の修正箇所 ↓↓↓ ***
function drawQuestionScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentQuestion = questions[currentQuestionIndex];

    // --- 質問文の描画を wrapText を使うように変更 ---
    ctx.fillStyle = 'black';
    ctx.font = '24px sans-serif'; // 質問文のフォントサイズ
    ctx.textAlign = 'left';       // wrapText は左揃えを前提としているため変更
    const questionText = `Q${currentQuestionIndex + 1}. ${currentQuestion.text}`;
    const questionX = 50;          // 質問文の左端マージン
    const questionY = 80;          // 質問文の開始 Y 座標
    const questionMaxWidth = canvas.width - questionX * 2; // 左右マージンを考慮した最大幅
    const questionLineHeight = 30; // 質問文の行の高さ (フォントサイズより少し大きめ)
    wrapText(ctx, questionText, questionX, questionY, questionMaxWidth, questionLineHeight);
    // --- 質問文描画の変更ここまで ---

    // 選択肢ボタンの描画 (ここは変更なし、ただし Y 座標は質問文の描画高さに応じて調整が必要かも)
    choiceButtons = [];
    const buttonWidth = 600; const buttonHeight = 50;
    const startY = 180; // 質問文が長くなった場合に備え、少し下げるか、wrapText の戻り値を使うべき (今回は固定)
    const gap = 20; const startX = canvas.width / 2 - buttonWidth / 2;
    currentQuestion.choices.forEach((choice, index) => {
        const buttonY = startY + index * (buttonHeight + gap);
        const button = {x: startX, y: buttonY, width: buttonWidth, height: buttonHeight, choiceIndex: index};
        choiceButtons.push(button);
        ctx.fillStyle = 'lightgreen'; ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = 'black'; ctx.font = '18px sans-serif'; ctx.textAlign = 'left';
        // 選択肢テキストも wrapText を使うように変更すると、より確実にはみ出しを防げる (今回は未対応)
        ctx.fillText(choice.text, button.x + 15, button.y + 30);
    });
}
// *** ↑↑↑ drawQuestionScreen 関数の修正箇所 ↑↑↑ ***

// 描画関数: 結果画面 (変更なし)
function drawResultScreen() { /* ... (省略) ... */
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const content = resultContents[resultCharacter]; const image = characterImages[resultCharacter];
    if (!content) { ctx.fillStyle = 'red'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('エラー: 結果が見つかりません。', canvas.width / 2, 100); return; }
    ctx.fillStyle = 'black'; ctx.font = '30px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`あなたのキャラクタータイプは【${content.name}】です！`, canvas.width / 2, 60);
    const imgWidth = 200; const imgHeight = image.height * (imgWidth / image.width); const imgX = canvas.width / 2 - imgWidth / 2; const imgY = 100;
    if (image && image.complete) { ctx.drawImage(image, imgX, imgY, imgWidth, imgHeight); } else { ctx.fillStyle = 'grey'; ctx.fillRect(imgX, imgY, imgWidth, imgHeight); ctx.fillStyle = 'white'; ctx.font = '16px sans-serif'; ctx.fillText('画像読込中...', canvas.width/2, imgY + imgHeight / 2); }
    ctx.fillStyle = 'black'; ctx.font = '16px sans-serif'; ctx.textAlign = 'left';
    const descX = 50; const descY = imgY + imgHeight + 30; const descMaxWidth = canvas.width - descX * 2;
    wrapText(ctx, `【${content.name}とは？】\n${content.description}`, descX, descY, descMaxWidth, 24);
    const reasonY = 360; // Y座標は必要に応じて調整
    wrapText(ctx, `【あなたが${content.name}タイプの理由】\n${content.reason}`, descX, reasonY, descMaxWidth, 24);
    ctx.fillStyle = 'lightcoral'; ctx.fillRect(replayButton.x, replayButton.y, replayButton.width, replayButton.height);
    ctx.fillStyle = 'black'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('もう一度診断する', canvas.width / 2, replayButton.y + 35);
}

// 結果計算関数 (変更なし)
function calculateResult() { /* ... (省略) ... */
    let maxPoints = -1; let topCharacter = ''; const characterPriority = ['chihiro', 'haku', 'zeniba', 'rin', 'kamaji', 'bou', 'kaonashi', 'yubaba'];
    console.log("最終ポイント:", points);
    for (const character of characterPriority) { const currentPoints = points[character] || 0; if (currentPoints > maxPoints) { maxPoints = currentPoints; topCharacter = character; } }
    if (topCharacter === '') { topCharacter = characterPriority[0]; } resultCharacter = topCharacter; console.log("診断結果:", resultCharacter);
}

// ゲーム描画統括関数 (変更なし)
function drawGame() { /* ... (省略) ... */
    if (!allImagesLoaded) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'black'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('画像を読み込み中...', canvas.width / 2, canvas.height / 2); return; }
    if (gameState === 'TITLE') { drawTitleScreen(); } else if (gameState === 'QUESTION') { drawQuestionScreen(); } else if (gameState === 'RESULT') { if (resultCharacter === '') { calculateResult(); } drawResultScreen(); }
}

// クリックイベント処理関数 (変更なし)
function handleClick(event) { /* ... (省略) ... */
    const rect = canvas.getBoundingClientRect(); const clickX = event.clientX - rect.left; const clickY = event.clientY - rect.top;
    if (gameState === 'TITLE') { if (clickX >= startButton.x && clickX <= startButton.x + startButton.width && clickY >= startButton.y && clickY <= startButton.y + startButton.height) { console.log('スタートボタンクリック'); gameState = 'QUESTION'; currentQuestionIndex = 0; points = { chihiro: 0, haku: 0, yubaba: 0, zeniba: 0, kaonashi: 0, kamaji: 0, rin: 0, bou: 0 }; resultCharacter = ''; drawGame(); } } else if (gameState === 'QUESTION') { choiceButtons.forEach(button => { if (clickX >= button.x && clickX <= button.x + button.width && clickY >= button.y && clickY <= button.y + button.height) { console.log(`Q${currentQuestionIndex + 1} - 選択肢 ${button.choiceIndex + 1} クリック`); const selectedChoice = questions[currentQuestionIndex].choices[button.choiceIndex]; for (const char in selectedChoice.points) { if (points[char] === undefined) points[char] = 0; points[char] += selectedChoice.points[char]; } currentQuestionIndex++; if (currentQuestionIndex >= questions.length) { gameState = 'RESULT'; } drawGame(); } }); } else if (gameState === 'RESULT') { if (clickX >= replayButton.x && clickX <= replayButton.x + replayButton.width && clickY >= replayButton.y && clickY <= replayButton.y + replayButton.height) { console.log('もう一度診断ボタンクリック'); gameState = 'TITLE'; resultCharacter = ''; drawGame(); } }
}

// --- 初期化処理 ---
canvas.addEventListener('click', handleClick);
preloadImages(); // 画像読み込み開始