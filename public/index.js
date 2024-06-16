const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");
const solvedMsg = document.getElementById("solved");

document.addEventListener("DOMContentLoaded", () => {
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillpuzzle(textArea.value);
});

coordInput.addEventListener("input", (e) => {
  cleanError(errorMsg); // clean error message
});

valInput.addEventListener("input", (e) => {
  cleanError(errorMsg); // clean error message
});
textArea.addEventListener("input", (e) => {
  fillpuzzle(textArea.value);
  solvedMsg.style.display = "none";
});

function fillpuzzle(data) {
  cleanBoard();
  let len = data.length < 81 ? data.length : 81;
  for (let i = 0; i < len; i++) {
    let rowLetter = String.fromCharCode("A".charCodeAt(0) + Math.floor(i / 9));
    let col = (i % 9) + 1;
    if (!data[i] || data[i] === ".") {
      document.getElementsByClassName(rowLetter + col)[0].innerText = " ";
      continue;
    }
    document.getElementsByClassName(rowLetter + col)[0].innerText = data[i];
  }
}
function cleanBoard() {
  for (let i = 0; i < 81; i++) {
    let rowLetter = String.fromCharCode("A".charCodeAt(0) + Math.floor(i / 9));
    let col = (i % 9) + 1;
    document.getElementsByClassName(rowLetter + col)[0].innerText = " ";
  }
}

async function getSolved() {
  const stuff = { puzzle: textArea.value };
  try {
    const data = await fetch("/api/solve", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(stuff),
    });
    const parsed = await data.json();
    if (parsed.error) {
      errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
      return;
    }
    cleanError(errorMsg);
    // display solved element
    solvedMsg.style.display = "block";

    fillpuzzle(parsed.solution);
  } catch (error) {
    console.log(error);
  }
}

async function getChecked() {
  hideSolved(solvedMsg);
  const stuff = {
    puzzle: textArea.value,
    coordinate: coordInput.value,
    value: valInput.value,
  };
  try {
    const data = await fetch("/api/check", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(stuff),
    });
    const parsed = await data.json();
    errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("solve-button").addEventListener("click", getSolved);
document.getElementById("check-button").addEventListener("click", getChecked);
function cleanError(errorMsg) {
  errorMsg.innerHTML = "If error occurs this will be displayed here";
}
function hideSolved(solvedMsg) {
  if (solvedMsg.style.display !== "none") {
    solvedMsg.style.display = "none";
  }
}
