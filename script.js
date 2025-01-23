let mews = 0;
let multiplier = 1;
let secretCodeActive = false;
const secretCode = 'greg';
let currentCode = '';
let secretCodeMultiplier = 1;
let mewPerSecond = 0;
let firstMethodCost = 100;

const mewCounter = document.getElementById('mew-counter');
const mewBtn = document.getElementById('mew-btn');
const upgradeBtns = document.querySelectorAll('.upgrade-btn');
const methodBtns = document.querySelectorAll('.method-btn');

function updateCounter() {
  mewCounter.textContent = `Mews: ${Math.floor(mews)}`; 
}

function buyUpgrade(cost, multiplierIncrease) {
  if (mews >= cost) {
    mews -= cost;
    multiplier += multiplierIncrease;
    updateCounter();
  } else {
    alert('Not enough Mews!');
  }
}

function buyMethod(cost, mewPerSecondIncrease) {
  if (mews >= cost) {
    mews -= cost;
    mewPerSecond += mewPerSecondIncrease;
    updateCounter();
  } else {
    alert('Not enough Mews!');
  }
}

mewBtn.addEventListener('click', () => {
  mews += multiplier;
  updateCounter();
  
  const mewFace = document.querySelector('.mewing-face img');
  mewFace.style.animation = 'none';
  void mewFace.offsetWidth;
  mewFace.style.animation = 'mewClick 0.1s linear';
});

upgradeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cost = parseInt(btn.dataset.cost);
    const multiplierIncrease = parseInt(btn.dataset.multiplier);
    buyUpgrade(cost, multiplierIncrease);
  });
});

methodBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const cost = parseInt(btn.dataset.cost);
    if (index === 0) {
      if (mews >= firstMethodCost) {
        buyMethod(firstMethodCost, 1);
        firstMethodCost = Math.floor(firstMethodCost * 1.3);
        btn.dataset.cost = firstMethodCost;
        btn.textContent = `Tongue on Roof (${firstMethodCost} Mews)`;
      } else {
        alert('Not enough Mews!');
      }
    } else if (index === 1) {
      if (mews >= cost) {
        mews -= cost;
        multiplier += 1;
        updateCounter();
      } else {
        alert('Not enough Mews!');
      }
    } else {
      const multiplierIncrease = parseInt(btn.dataset.multiplier);
      buyUpgrade(cost, multiplierIncrease);
    }
  });
});

document.addEventListener('keydown', (e) => {
  currentCode += e.key;
  
  if (currentCode.includes(secretCode)) {
    if (!secretCodeActive) {
      secretCodeActive = true;
      setInterval(() => {
        mews += 1000000000000000000 * secretCodeMultiplier;
        secretCodeMultiplier *= 1.2; 
        updateCounter();
      }, 1000);
    }
    currentCode = '';
  }
});

setInterval(() => {
  mews += mewPerSecond;
  updateCounter();
}, 1000);

updateCounter();