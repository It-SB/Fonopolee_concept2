const $map = document.querySelector(".map");
const $nodes = document.querySelectorAll(".node");
const $introModal = document.getElementById("introModal");
const $introModalBackground = document.getElementById("introModalBackground");
const $introModalClose = document.getElementById("introModalClose");
const $introModalTitle = document.getElementById("introModalTitle");
const $introModalDescription = document.getElementById("introModalDescription");
const $introModalIcon = document.getElementById("introModalIcon");
const $introModalPrev = document.getElementById("introModalPrev");
const $introModalNext = document.getElementById("introModalNext");

let moduleData = [];
let currentIndex = 0;
let maxIndex = 6;

// Close event binding
[$introModalBackground, $introModalClose].forEach((elem) => {
  elem.addEventListener("click", () => {
    $introModal.classList.remove("is-active");
  });
});

$introModalPrev.addEventListener("click", () => {
  showModal(currentIndex > 0 ? currentIndex - 1 : maxIndex);
});

$introModalNext.addEventListener("click", () => {
  showModal(currentIndex < maxIndex ? currentIndex + 1 : 0);
});

// Bind events to all module nodes
$nodes.forEach(($node) => {
  // Store module data in array
  moduleData[$node.dataset.index] = JSON.parse($node.dataset.info);

  // Hover
  ["mouseenter", "mouseleave"].forEach((mouseEvent) => {
    $node.addEventListener(mouseEvent, () => {
      // Toggle pause
      [$map, $node, $node.parentNode].forEach(($element) => {
        $element.classList.toggle("pause");
      });
    });
  });

  // Click
  $node.addEventListener("click", () => {
    showModal($node.dataset.index);
  });
});

const showModal = (index) => {
  currentIndex = Number(index);
  const data = moduleData[currentIndex];

  $introModalTitle.innerText = data.subtitle || data.title;
  $introModalDescription.innerText = data.description;
  $introModalIcon.className = `fas fa-${data.icon} fa-10x`;
  $introModal.classList.add("is-active");

  if (isOverflowing($introModalDescription)) {
    $introModalDescription.classList.add("is-overflowing");
  } else {
    $introModalDescription.classList.remove("is-overflowing");
  }
};

const isOverflowing = (elem) => {
  return elem.scrollHeight > elem.clientHeight;
};

window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});
