let burgers = [];
let currentSteps = [];
let currentBurger = null;
let currentStepIndex = 0;

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    burgers = data.burgers;
    showMenu();
  });

function showMenu() {
  const list = document.getElementById('burger-list');
  list.innerHTML = '';
  burgers.forEach((burger, index) => {
    const btn = document.createElement('button');
    btn.textContent = burger.name;
    btn.onclick = () => startGame(index);
    list.appendChild(btn);
  });
}

function startGame(index) {
  currentBurger = burgers[index];
  currentSteps = [...currentBurger.steps];
  currentStepIndex = 0;

  document.getElementById('menu-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('selected-burger-name').textContent = currentBurger.name;

  document.getElementById('return-button').classList.add('hidden');
  renderStepButtons();
}

function renderStepButtons() {
  const container = document.getElementById('step-buttons');
  container.innerHTML = '';

  const shuffled = [...currentSteps].sort(() => Math.random() - 0.5);

  shuffled.forEach(step => {
    const btn = document.createElement('button');
    btn.classList.add('step-button');

    const img = document.createElement('img');
    const filename = step
      .replace(/[ー]/g, '')
      .replace(/[^a-zA-Z0-9一-龯ぁ-んァ-ン]+/g, '_')
      .replace(/_+/g, '_') + '.png';
    img.src = `images/${filename}`;
    img.alt = step;

    const span = document.createElement('span');
    span.textContent = step;

    btn.appendChild(img);
    btn.appendChild(span);
    btn.onclick = () => handleStepClick(step, btn);
    container.appendChild(btn);
  });
}

function normalizeStepName(name) {
  return name
    .replace(/[ー]/g, '')
    .replace(/[^a-zA-Z0-9一-龯ぁ-んァ-ン]+/g, '')
    .replace(/[0-9]/g, '')
    .toLowerCase();
}

function handleStepClick(step, button) {
  const expected = currentSteps[currentStepIndex];
  if (normalizeStepName(step) === normalizeStepName(expected)) {
    button.remove();
    currentStepIndex++;
    if (currentStepIndex === currentSteps.length) {
      showResult('⭕ 成功！');
    }
  } else {
    showResult('❌ 失敗！');
  }
}

function showResult(text) {
  document.getElementById('result').textContent = text;
  document.getElementById('retry-button').classList.remove('hidden');
  const returnButton = document.getElementById('return-button');
  returnButton.classList.remove('hidden');
  document.getElementById('step-buttons').innerHTML = '';
}

document.getElementById('retry-button').onclick = () => {
  currentStepIndex = 0;
  document.getElementById('result').textContent = '';
  document.getElementById('retry-button').classList.add('hidden');
  document.getElementById('return-button').classList.add('hidden');
  renderStepButtons();
};

document.getElementById('return-button').onclick = () => {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('menu-screen').classList.remove('hidden');
  document.getElementById('result').textContent = '';
  document.getElementById('retry-button').classList.add('hidden');
  document.getElementById('return-button').classList.add('hidden');
};
