// MBTI 각 지표별 다양한 질문 pool
const questionPools = {
  E: [
    '나는 새로운 사람을 만나는 것이 즐겁다.',
    '여러 사람과 함께 있을 때 에너지가 생긴다.',
    '모임이나 파티에 자주 참석하는 편이다.',
    '여럿이 함께하는 활동을 선호한다.',
    '처음 보는 사람과도 쉽게 대화할 수 있다.'
  ],
  I: [
    '나는 혼자만의 시간이 필요하다.',
    '혼자 있을 때 에너지가 충전된다.',
    '조용한 환경에서 시간을 보내는 것을 좋아한다.',
    '사람이 많은 곳에 오래 있으면 피곤하다.',
    '깊은 대화를 소수와 나누는 것이 좋다.'
  ],
  N: [
    '나는 세부사항보다 큰 그림을 보는 것을 선호한다.',
    '새로운 아이디어를 떠올리는 것을 좋아한다.',
    '상상하는 것을 즐긴다.',
    '미래에 대해 자주 생각한다.',
    '추상적인 개념을 이해하는 것이 쉽다.'
  ],
  S: [
    '나는 현실적이고 구체적인 것을 선호한다.',
    '경험에 기반한 판단을 내린다.',
    '세부사항을 잘 기억하는 편이다.',
    '지금 이 순간에 집중하는 것이 편하다.',
    '실용적인 해결책을 선호한다.'
  ],
  T: [
    '나는 결정을 내릴 때 감정보다 논리를 더 중시한다.',
    '객관적인 사실을 중요하게 생각한다.',
    '비판적으로 사고하는 편이다.',
    '논리적인 토론을 즐긴다.',
    '문제를 해결할 때 감정에 휘둘리지 않는다.'
  ],
  F: [
    '나는 다른 사람의 감정을 잘 공감한다.',
    '결정할 때 사람의 감정을 고려한다.',
    '타인의 기분을 잘 살핀다.',
    '분위기를 맞추는 것이 중요하다.',
    '상대방을 배려하는 편이다.'
  ],
  J: [
    '나는 계획적으로 움직이는 것을 좋아한다.',
    '일정을 미리 정해두는 것이 편하다.',
    '정리정돈을 잘하는 편이다.',
    '목표를 세우고 실천하는 것을 선호한다.',
    '계획에 따라 움직일 때 안정감을 느낀다.'
  ],
  P: [
    '나는 즉흥적으로 행동하는 것을 좋아한다.',
    '상황에 따라 유연하게 대처한다.',
    '계획 없이 움직이는 것이 편하다.',
    '마감 직전에 일을 처리하는 경우가 많다.',
    '새로운 변화를 즐기는 편이다.'
  ]
};

// 각 유형별로 2개씩 랜덤 추출하여 8문항, 나머지 2문항은 전체 pool에서 랜덤 추출(중복X)
function getRandomQuestions() {
  let selected = [];
  let used = new Set();
  const types = Object.keys(questionPools);
  // 각 유형별로 1개씩 먼저 뽑기 (8문항)
  types.forEach(type => {
    const pool = questionPools[type];
    let idx;
    do {
      idx = Math.floor(Math.random() * pool.length);
    } while (used.has(type + idx));
    selected.push({ question: pool[idx], type });
    used.add(type + idx);
  });
  // 각 유형별로 2번째 문항씩 뽑기 (8+8=16, 하지만 10문항만 필요)
  while (selected.length < 10) {
    const type = types[Math.floor(Math.random() * types.length)];
    const pool = questionPools[type];
    let idx;
    do {
      idx = Math.floor(Math.random() * pool.length);
    } while (used.has(type + idx));
    selected.push({ question: pool[idx], type });
    used.add(type + idx);
  }
  // 10개만 남기기
  return selected.slice(0, 10);
}

let questions = [];
let current = 0;
let scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

function showQuestion() {
  const container = document.querySelector('.container');
  if (current >= questions.length) {
    showResult();
    return;
  }
  const q = questions[current];
  container.innerHTML = `
    <div class="lemon-logo">🍋</div>
    <h1>lemon의 MBTI 검사</h1>
    <div style="margin: 24px 0 16px 0; font-size:1.15rem; color:#444; min-height:48px;">${current+1} / ${questions.length}<br><b>${q.question}</b></div>
    <div style="display:flex; gap:16px; justify-content:center; margin-bottom:24px;">
      <button class="start-btn" style="flex:1;" onclick="selectAnswer('${q.type}', true)">그렇다</button>
      <button class="start-btn" style="flex:1; background: #eee; color:#888;" onclick="selectAnswer('${q.type}', false)">아니다</button>
    </div>
    <div style="color:#aaa; font-size:0.95rem;">질문에 솔직하게 답해주세요!</div>
  `;
}

function selectAnswer(type, isPositive) {
  if (isPositive) {
    scores[type]++;
  } else {
    if (type === 'E') scores['I']++;
    else if (type === 'I') scores['E']++;
    else if (type === 'N') scores['S']++;
    else if (type === 'S') scores['N']++;
    else if (type === 'T') scores['F']++;
    else if (type === 'F') scores['T']++;
    else if (type === 'J') scores['P']++;
    else if (type === 'P') scores['J']++;
  }
  current++;
  showQuestion();
}

function showResult() {
  const EI = scores.E >= scores.I ? 'E' : 'I';
  const NS = scores.N >= scores.S ? 'N' : 'S';
  const TF = scores.T >= scores.F ? 'T' : 'F';
  const JP = scores.J >= scores.P ? 'J' : 'P';
  const mbti = EI + NS + TF + JP;

  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="lemon-logo">🍋</div>
    <h1>나의 MBTI 결과는?</h1>
    <div style="font-size:2.2rem; color:#f7b801; margin:24px 0 12px 0; font-weight:bold; letter-spacing:2px;">${mbti}</div>
    <div style="color:#555; font-size:1.1rem; margin-bottom:32px;">당신의 MBTI 유형은 <b>${mbti}</b> 입니다!</div>
    <button class="start-btn" onclick="restart()">다시 검사하기</button>
  `;
}

function restart() {
  current = 0;
  scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
  questions = getRandomQuestions();
  showQuestion();
}

window.onload = function() {
  const startBtn = document.querySelector('.start-btn');
  if (startBtn) {
    startBtn.onclick = function() {
      current = 0;
      scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
      questions = getRandomQuestions();
      showQuestion();
    };
  }
}; 