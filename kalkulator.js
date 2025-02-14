const CACHE_KEY = "calculation_history";

const calculator = {
  displayNumber: '0',
  operator: null,
  firstNumber: null,
  waitingForSecondNumber: false,
};

function updateDisplay() {
  document.querySelector("#displayNumber").innerText = calculator.displayNumber;
}

function clearCalculator() {
  calculator.displayNumber = '0';
  calculator.operator = null;
  calculator.firstNumber = null;
  calculator.waitingForSecondNumber = false;
}

function inputDigit(digit) {
  if (calculator.displayNumber === '0') {
    calculator.displayNumber = digit;
  } else {
    calculator.displayNumber += digit;
  }
}

function inverseNumber() {
  if (calculator.displayNumber !== '0') {
    calculator.displayNumber = calculator.displayNumber * -1;
  }
}

function handleOperator(operator) {
  if (!calculator.waitingForSecondNumber) {
    calculator.operator = operator;
    calculator.waitingForSecondNumber = true;
    calculator.firstNumber = calculator.displayNumber;
    calculator.displayNumber = '0';
  } else {
    alert('Operator sudah ditetapkan');
  }
}

function performCalculation() {
  if (calculator.firstNumber == null || calculator.operator == null) {
    alert("Anda belum menetapkan operator");
    return;
  }

  let result = 0;
  if (calculator.operator === "+") {
    result = parseInt(calculator.firstNumber) + parseInt(calculator.displayNumber);
  } else if (calculator.operator === "-") {
    result = parseInt(calculator.firstNumber) - parseInt(calculator.displayNumber);
  } else if (calculator.operator === "*") {
    result = parseInt(calculator.firstNumber) * parseInt(calculator.displayNumber);
  } else if (calculator.operator === "/") {
    result = parseInt(calculator.firstNumber) / parseInt(calculator.displayNumber);
  }

  // Objek yang akan dikirimkan sebagai argumen fungsi putHistory()
  const history = {
    firstNumber: calculator.firstNumber,
    secondNumber: calculator.displayNumber,
    operator: calculator.operator,
    result: result
  };

  putHistory(history); // Memasukkan riwayat perhitungan
  calculator.displayNumber = result; // Menampilkan hasil di layar kalkulator
  renderHistory(); // Menampilkan riwayat pada tampilan
}

const buttons = document.querySelectorAll(".button");
for (let button of buttons) {
  button.addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('clear')) {
      clearCalculator();
      updateDisplay();
      return;
    }

    if (target.classList.contains('negative')) {
      inverseNumber();
      updateDisplay();
      return;
    }

    if (target.classList.contains('equals')) {
      performCalculation();
      updateDisplay();
      return;
    }

    if (target.classList.contains('operator')) {
      handleOperator(target.innerText);
      return;
    }

    inputDigit(target.innerText);
    updateDisplay();
  });
}

// LocalStorage functions for history
function checkForStorage() {
  return typeof Storage !== "undefined";
}

function putHistory(data) {
  if (checkForStorage()) {
    let historyData = null;
    if (localStorage.getItem(CACHE_KEY) === null) {
      historyData = [];
    } else {
      historyData = JSON.parse(localStorage.getItem(CACHE_KEY));
    }

    historyData.unshift(data);

    if (historyData.length > 5) {
      historyData.pop();
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(historyData));
  }
}

function showHistory() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
  } else {
    return [];
  }
}

function renderHistory() {
  const historyData = showHistory();
  let historyList = document.querySelector("#historyList tbody");
  historyList.innerHTML = "";

  for (let history of historyData) {
    let row = document.createElement("tr");
    row.innerHTML = `<td>${history.firstNumber}</td>`;
    row.innerHTML += `<td>${history.operator}</td>`;
    row.innerHTML += `<td>${history.secondNumber}</td>`;
    row.innerHTML += `<td>${history.result}</td>`;

    historyList.appendChild(row);
  }
}

renderHistory();
