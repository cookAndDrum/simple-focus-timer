const timerCount = document.querySelector(".timer__count");
const startButton = document.querySelector(".timer-button-area__button");
const typeContainer = document.querySelector(".type");
const typeText = document.querySelectorAll(".type__text");
const modal = document.querySelector(".modal");
const yesBtn = document.querySelector(".yes");
const noBtn = document.querySelector(".no");
const overlay = document.querySelector(".overlay");
const todoSub = document.querySelector(".todo__subheader");
const todoInput = document.querySelector(".todo__input");
const todoPush = document.querySelector(".todo__push");

let time, timer, clicked;
let timerOngoing = false;

/////////////////////////////////////////////////////////////////////////////////
//Common Functions
// each second tick
const tick = function () {
  const min = String(Math.trunc(time / 60)).padStart(2, 0);
  const sec = String(Math.trunc(time % 60)).padStart(2, 0);

  if (time === 0) {
    clearInterval(timer);
    alert("The session is completed!! 😁");
    timerEvent();
    typeSwitch();
    return;
  }
  time--;
  timerCount.textContent = `${min}:${sec}`;
  // add a dynamic clock in the <head><title>
};

// read the timer value
const totalTime = function () {
  const presetMin = Number(timerCount.textContent.slice(0, 2));
  const presetSec = Number(timerCount.textContent.slice(3));

  time = presetMin * 60 + presetSec;
};

// Overlay function
const overlayOn = function () {
  overlay.classList.remove("hidden");
};

const overlayClose = function () {
  overlay.classList.add("hidden");
};

// stop propagate like this .modal -> #modal-root -> body , while clicking outside the modal will only go through #modal-root -> body.
const modalClick = function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
};

const typeSwitch = function (clicked) {
  // Delete all, then add
  typeText.forEach((t) => t.classList.remove("type__selected"));
  clicked.classList.add("type__selected");

  clicked.classList.add("timer__hidden");
  clicked.classList.remove("timer__hidden");
  // Change timer value based on type
  if (clicked.textContent === "Focus") timerCount.textContent = "40:00";
  if (clicked.textContent === "Short Break") timerCount.textContent = "05:00";
  if (clicked.textContent === "Long Break") timerCount.textContent = "15:00";
};

const timerEvent = function () {
  // timer start
  if (!timerOngoing) {
    // need to call the function, as it would delay 1 sec with setInterval
    tick();
    timer = setInterval(tick, 1000);
    timerOngoing = true;
    startButton.textContent = "Stop";

    //CSS
    startButton.style = "transform: translateY(4px); box-shadow: none;";
  } else {
    clearInterval(timer);
    timerOngoing = false;
    startButton.textContent = "Start";
    // CSS
    startButton.style =
      "transform: translateY(-4px); box-shadow: 0 4px #d1d1d1;";
  }
};

const todoDelete = function () {
  // To do delete button
  // should place this variable inside the event, as the value is fixed outside this EventListener
  const currentTask = document.querySelectorAll(
    ".todo__task-container--delete"
  );
  for (let i = 0; i < currentTask.length; i++) {
    currentTask[i].addEventListener("click", function () {
      this.closest(".todo__task-container").remove();
    });
    // todoDelete[i].onclick = function () {
    //   this.parentNode.remove();
    // };
  }
};
/////////////////////////////////////////////////////////////////////////////////////
// Timer Events

// Change Timer Type
// using event delegation, select the parent container, then find the children
typeContainer.addEventListener("click", function (e) {
  e.preventDefault();
  clicked = e.target.closest(".type__text");
  // Guard clause
  if (!clicked || clicked.classList.contains("type__selected")) return;
  // Overlay and guard clause the type__selected
  if (timerOngoing && !clicked.classList.contains("type__selected")) {
    overlayOn();
    return;
  }
  typeSwitch(clicked);
});

// Start Timer
startButton.addEventListener("click", function (e) {
  e.preventDefault();
  totalTime();
  timerEvent();
});

// Click outside, no, escape the modal to close
overlay.addEventListener("click", overlayClose);
noBtn.addEventListener("click", overlayClose);
document.addEventListener("keydown", function (event) {
  const { key } = event;
  if (key === "Escape") overlayClose();
});

// Click modal stop the propagation
modal.addEventListener("click", modalClick);

// Yes btn
yesBtn.addEventListener("click", function () {
  timerEvent();
  overlayClose();
  typeSwitch();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
// To do Events
todoPush.addEventListener("click", function (e) {
  e.preventDefault();
  const inputValue = todoInput.value;
  const todoHTML = `
    <div class="todo__task-container">
      <span class="todo__task-container--task">${inputValue}</span>
      <button class="todo__task-container--delete"><i class="fa fa-trash"></i></button>
    </div>`;

  if (todoInput.value.length === 0)
    alert("Input a task that you would like to complete. 😊");
  else {
    todoSub.innerHTML += todoHTML;
    todoInput.value = "";
  }
  todoDelete();
});
