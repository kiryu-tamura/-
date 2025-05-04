// script.js (UI・テーマ対応版)

// --- DOM要素の取得 ---
const titleScreen = document.getElementById('title-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const screens = document.querySelectorAll('.screen'); // 全ての画面要素

const startButton = document.getElementById('start-button');
const questionTextElem = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices');

// プログレスバー関連
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// 結果画面要素
const resultNameElem = document.getElementById('result-name');
const resultImageElem = document.getElementById('result-image');
const resultNameDescElem = document.getElementById('result-name-desc');
const resultDescriptionElem = document.getElementById('result-description');
const resultNameReasonElem = document.getElementById('result-name-reason');
const resultReasonElem = document.getElementById('result-reason');
const replayButton = document.getElementById('replay-button');

// --- ゲームの状態とデータ ---
let currentQuestionIndex = 0;
let points = {};
let resultCharacter = '';

// 質問データ (テキスト修正版)
const questions = [
    { text: "まったく知らない場所に来てしまった！\nまずどうする？", choices: [ { text: "A. 不安もあるけど、好奇心が勝つ！\nとりあえず探索してみる。", points: { rin: 4, chihiro: 2 } },{ text: "B. 周囲を注意深く観察し、\n安全な場所や情報を探す。", points: { haku: 4, kamaji: 4 } },{ text: "C. 頼れそうな人を探して、\n状況を尋ねてみる。", points: { chihiro: 3, zeniba: 3, bou: 2 } } ]},
    { text: "誰かが明らかに困っている様子。\nあなたなら？", choices: [ { text: "A. 放っておけない！自分のことは後回しにして\nでも助けようとする。", points: { chihiro: 5, zeniba: 4, kaonashi: 2 } },{ text: "B. 自分に何ができるか考え、\n無理のない範囲で手伝う。", points: { rin: 2, kamaji: 2, haku: 2 } },{ text: "C. 関わると面倒なことになりそう…\nそっと距離を置く。", points: { yubaba: 5 } } ]},
    { text: "責任重大な役割や仕事を任された！\nどう感じる？", choices: [ { text: "A. プレッシャー！でも、やりがいを感じて\n「やってやろう！」と燃える。", points: { rin: 4 } },{ text: "B. 「自分にできるかな…」と不安になる。\nまずは手順や詳細を確認したい。", points: { chihiro: 3, kamaji: 3, haku: 2 } },{ text: "C. 正直、ちょっと面倒くさい。\nできるだけ効率よく、楽に終わらせたい。", points: { yubaba: 4 } } ]},
    { text: "自分の大切な目標を達成するためなら…", choices: [ { text: "A. 周囲との関係を壊してまで\n進むことはできない。", points: { zeniba: 5, chihiro: 4 } },{ text: "B. 時には、誰かの反対を押し切る\n覚悟も必要だと思う。", points: { haku: 3, rin: 3 } },{ text: "C. 使えるものは何でも使う。\n手段を選んでいる余裕はない。", points: { yubaba: 5 } } ]},
    { text: "グループの中で、自分の意見が\n他の人と違ったら？", choices: [ { text: "A. まずは相手の意見をしっかり聞く。\n場の調和を大切にしたい。", points: { zeniba: 4, chihiro: 3, kaonashi: 3 } },{ text: "B. なぜ違うのか、お互いの考えを\n話し合って理解を深めたい。", points: { kamaji: 3, haku: 3 } },{ text: "C. 自分の考えが正しいと思うなら、\nはっきりと主張する。", points: { yubaba: 5, rin: 4, bou: 3 } } ]},
    { text: "古くからのルールや決まりごとについて\nどう思う？", choices: [ { text: "A. 大切に守っていくべき、\n秩序の基本だと思う。", points: { kamaji: 5, yubaba: 3 } },{ text: "B. 良いものは残しつつ、\n時代や状況に合わせて変えるべきだ。", points: { rin: 4, chihiro: 3, zeniba: 2 } },{ text: "C. あまり縛られたくない。\n自分のやり方で進めたい。", points: { haku: 3, rin: 2, yubaba: 1 } } ]},
    { text: "あなたが誰かに親切にするのは、\nどんな時？", choices: [ { text: "A. 見返りなんて考えない。\n困っている人がいたら自然と体が動く。", points: { chihiro: 5, zeniba: 4, kaonashi: 2 } },{ text: "B. 相手のためでもあるし、\n巡り巡って自分のためにもなると思うから。", points: { kamaji: 3, rin: 2 } },{ text: "C. その人に恩を売っておけば、\n後で何か頼みやすくなるかもしれないから。", points: { yubaba: 5 } } ]},
    { text: "ひとりで過ごす時間は好き？", choices: [ { text: "A. 大好き！誰にも邪魔されず、\n自分の世界に没頭できる貴重な時間。", points: { haku: 5, kamaji: 4, kaonashi: 3 } },{ text: "B. 嫌いではない。\n考え事をしたり、リラックスしたりするのに良い。", points: { zeniba: 3, chihiro: 2 } },{ text: "C. どちらかというと苦手。\n誰かと一緒にいる方が安心するし楽しい。", points: { rin: 4, bou: 3, yubaba: 2 } } ]},
    { text: "「これが欲しい！」「これを食べたい！」\nという強い欲求が湧いてきたら？", choices: [ { text: "A. 我慢できない！すぐに手に入れるか、満たそうと行動する。", points: { kaonashi: 5, yubaba: 4, bou: 3 } },{ text: "B. グッとこらえる。欲求に流されず、理性的に判断したい。", points: { zeniba: 5, kamaji: 4, haku: 3 } },{ text: "C. 他のことをして気を紛らわせる。時間が経てば収まるかも。", points: { chihiro: 3 } } ]},
    { text: "困難な壁にぶつかった時、\nどう乗り越える？", choices: [ { text: "A. 諦めずに何度も挑戦する。\nその経験が自分を強くすると信じている。", points: { chihiro: 5, bou: 3, rin: 3 } },{ text: "B. 一人で抱え込まず、\n信頼できる人に相談して助けを求める。", points: { kaonashi: 4 } },{ text: "C. 冷静に状況を分析し、\n最も合理的で効率的な解決策を探す。", points: { yubaba: 3, haku: 3, kamaji: 2 } } ]}
];


// 結果表示用コンテンツ (テキスト修正版)
const resultContents = {
    chihiro: { name: "千尋", description: "物語の主人公。最初は臆病で無気力でしたが、\n不思議な世界での出会いや仕事を通して成長します。\n大切な人を守るためなら、困難にも立ち向かう\n芯の強さを持っています。", reason: "慣れない環境にも粘り強く適応し、\n困難な状況でも諦めず努力できる人ですね。\n周りを大切に思い、誰かのために行動できる\n深い優しさを持つところが千尋タイプです。" },
    haku: { name: "ハク", description: "千尋を助ける謎めいた少年。\n冷静沈着で、知的で計画性に優れています。\n大切な存在を守るためには、自身を危険にさらす\nことも厭わない忠誠心と優しさを秘めています。", reason: "物事を冷静に分析し、慎重に行動する知的なタイプ。\n内に強い意志や信念を秘めています。\n大切なもののために、静かに力強く行動できる\nところがハクタイプと言えるでしょう。" },
    yubaba: { name: "湯婆婆", description: "油屋を取り仕切るパワフルな経営者。\n強欲で支配的ですが、現実的な判断力も持ちます。\n目標達成のためには手段を選ばない厳しさも。\nエネルギッシュで存在感のある人物です。", reason: "目標に向かってパワフルに行動できる人ですね。\n現実的な視点を持ち、効率的に物事を進める力があります。\n周りを巻き込み、自分の考えを主張できる\n強いリーダーシップが湯婆婆タイプです。" },
    zeniba: { name: "銭婆", description: "湯婆婆の双子の姉ですが、性格は正反対。\n沼の底で質素ながらも心豊かな生活を送る、\n穏やかで賢明な魔女です。\n手作りの温もりや寛大さを大切にしています。", reason: "周りの人を温かく受け入れ、優しく見守る人ですね。\n目先の利益より心の充足や穏やかな関係を大切にします。\n物事の本質を見抜く落ち着きと、見返りを求めない\n親切心が銭婆タイプと言えるでしょう。" },
    kaonashi: { name: "カオナシ", description: "自分の顔や声を持たず、他者の影響を受けやすい存在。\n環境や相手によって大きく変化します。\n人との繋がりを強く求め、純粋さゆえに暴走する\nことも。根は寂しがり屋で居場所を探しています。", reason: "周りの気持ちや空気に敏感で、共感力が高い人かも。\n人との繋がりを大切にし、受け入れられたい気持ちが強い。\n純粋で繊細な心を持ち、環境によって様々な面を\n見せるところがカオナシタイプです。" },
    kamaji: { name: "鎌爺", description: "油屋のボイラー室を取り仕切る釜焚きのおじいさん。\n多くの腕を操り、黙々と仕事をこなす職人気質。\n一見ぶっきらぼうですが、根は優しく情に厚い。\n頼られると面倒を見てくれる縁の下の力持ちです。", reason: "任された役割を責任感を持って黙々とこなす実直なタイプ。\n自分の仕事に誇りを持っています。\nぶっきらぼうに見えても、困っている人を放っておけない\n内に秘めた優しさが鎌爺タイプです。" },
    rin: { name: "リン", description: "油屋で働く千尋の先輩。\nサバサバした姉御肌で、現実的な考え方の持ち主。\n口は少し悪いけれど、面倒見が良い。\n自分の道を歩むことを夢見る、たくましい人です。", reason: "現実をしっかり見据え、テキパキ行動できる人ですね。\n面倒見が良く、仲間から頼りにされることが多い。\n口調は強くても優しく、目標に向かって努力する\nタフさがリンタイプと言えるでしょう。" },
    bou: { name: "坊", description: "湯婆婆に溺愛されて育った巨大な赤ちゃん。\n最初はわがままでしたが、千尋との旅を通じて成長。\n他者への共感や自分で行動することの大切さを学びます。\n根は素直で、大切な人を守ろうとします。", reason: "素直で、自分の気持ちに正直なタイプかも。\n新しい経験を通して大きく成長できる可能性を秘めています。\n最初は自己中心的でも、大切な人のためなら勇気を\n出せる純粋さが坊タイプです。" }
};

// --- 関数定義 ---

/**
 * 指定された画面を表示し、他を非表示にする関数
 * @param {string} screenId 表示する画面のID ('title-screen', 'question-screen', 'result-screen')
 */
function showScreen(screenId) {
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
        }
    });
}

/**
 * プログレスバーを更新する関数
 */
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
}

/**
 * 質問を表示する関数
 */
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    // HTML内で改行を<br>に変換して表示 (CSSで white-space: pre-line; でも可)
    questionTextElem.innerHTML = currentQuestion.text.replace(/\n/g, '<br>');
    // questionTextElem.textContent = currentQuestion.text; // CSSで改行する場合

    // 以前の選択肢をクリア
    choicesContainer.innerHTML = '';

    // 新しい選択肢ボタンを作成して追加
    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.classList.add('choice-button');
        // HTML内で改行を<br>に変換して表示
        button.innerHTML = choice.text.replace(/\n/g, '<br>');
        // button.textContent = choice.text; // CSSで改行する場合
        button.dataset.choiceIndex = index; // data属性にインデックスを保存
        choicesContainer.appendChild(button);
    });

    // プログレスバー更新
    updateProgressBar();
}

/**
 * 選択肢クリック時の処理
 * @param {Event} event クリックイベント
 */
function handleChoiceClick(event) {
    // クリックされた要素が選択肢ボタンか確認
    const clickedButton = event.target.closest('.choice-button');
    if (!clickedButton) {
        return; // 選択肢ボタン以外がクリックされた場合は何もしない
    }

    const choiceIndex = parseInt(clickedButton.dataset.choiceIndex, 10);
    const selectedChoice = questions[currentQuestionIndex].choices[choiceIndex];

    console.log(`Q${currentQuestionIndex + 1} - 選択肢 ${choiceIndex + 1} クリック`);

    // ポイントを加算
    for (const char in selectedChoice.points) {
        points[char] = (points[char] || 0) + selectedChoice.points[char];
    }
    // console.log("現在のポイント:", points);

    // 次の質問へ
    currentQuestionIndex++;

    // 全問終了したかチェック
    if (currentQuestionIndex >= questions.length) {
        calculateResult();
        displayResult();
        showScreen('result-screen');
    } else {
        displayQuestion(); // 次の質問を表示
        // 画面を一番上までスクロール (スマホで見やすくするため)
        window.scrollTo(0, 0);
    }
}

/**
 * 診断結果を計算する関数
 */
function calculateResult() {
    let maxPoints = -1;
    let topCharacter = '';
    const characterPriority = ['chihiro', 'haku', 'zeniba', 'rin', 'kamaji', 'bou', 'kaonashi', 'yubaba'];

    console.log("最終ポイント:", points);

    for (const character of characterPriority) {
        const currentPoints = points[character] || 0;
        if (currentPoints > maxPoints) {
            maxPoints = currentPoints;
            topCharacter = character;
        }
    }
    if (topCharacter === '') {
        topCharacter = characterPriority[0];
        console.warn("全員のポイントが0でした。デフォルトの結果を表示します。");
    }
    resultCharacter = topCharacter;
    console.log("診断結果:", resultCharacter);
}

/**
 * 診断結果を表示する関数
 */
function displayResult() {
    const content = resultContents[resultCharacter];
    if (!content) {
        console.error("結果コンテンツが見つかりません:", resultCharacter);
        // エラー表示を適切に行う（例: アラートや専用の表示）
        resultNameElem.textContent = "エラー";
        resultImageElem.style.display = 'none'; // 画像非表示
        resultDescriptionElem.textContent = "診断結果の表示中にエラーが発生しました。";
        resultReasonElem.textContent = "";
        return;
    }

    resultNameElem.textContent = `【${content.name}】`;
    resultImageElem.src = `images/${resultCharacter}.png`; // 画像パスを設定
    resultImageElem.alt = content.name; // altテキスト設定
    resultImageElem.style.display = 'block'; // 画像を表示

    // 説明文と理由のテキストを設定 (改行を<br>に変換)
    resultNameDescElem.textContent = content.name;
    resultDescriptionElem.innerHTML = content.description.replace(/\n/g, '<br>');
    resultNameReasonElem.textContent = content.name;
    resultReasonElem.innerHTML = content.reason.replace(/\n/g, '<br>');
}

/**
 * ゲームを開始する関数
 */
function startGame() {
    console.log('ゲーム開始');
    currentQuestionIndex = 0;
    // ポイントを初期化
    points = { chihiro: 0, haku: 0, yubaba: 0, zeniba: 0, kaonashi: 0, kamaji: 0, rin: 0, bou: 0 };
    resultCharacter = '';
    displayQuestion(); // 最初の質問を表示
    showScreen('question-screen'); // 質問画面を表示
    window.scrollTo(0, 0); // 画面トップへ
}

/**
 * ゲームをリプレイ（タイトルに戻る）関数
 */
function replayGame() {
    console.log('リプレイ');
    showScreen('title-screen'); // タイトル画面を表示
    window.scrollTo(0, 0); // 画面トップへ
}

// --- イベントリスナーの設定 ---
startButton.addEventListener('click', startGame);
choicesContainer.addEventListener('click', handleChoiceClick); // イベント委任を使用
replayButton.addEventListener('click', replayGame);

// --- 初期化処理 ---
showScreen('title-screen'); // 最初にタイトル画面を表示
console.log('千と千尋の性格診断ゲームへようこそ！ (HTMLベース版)');

