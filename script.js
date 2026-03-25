let clues = {1:false,2:false,3:false,4:false,5:false};

// ========== WIZARD PROGRESS TRACKING ==========
const wizardSteps = {
  'slide0': { step: 1, title: 'Begin Your Adventure', name: 'Intro' },
  'slideMuseum': { step: 2, title: 'Louvre Museum - Decode the Painting', name: 'Louvre' },
  'slideTransition': { step: 2, title: 'Louvre Museum - Clue Revealed', name: 'Louvre' },
  'slideCafe': { step: 3, title: 'Café de Flore - Find the Suspect', name: 'Café' },
  'slideTransitionBoutique': { step: 3, title: 'Following the Trail...', name: 'Café' },
  'slideBoutique': { step: 4, title: 'Chanel Boutique - Examine the Scarf', name: 'Boutique' },
  'slideTransitionBookstore': { step: 4, title: 'Next Clue Found...', name: 'Boutique' },
  'slideBookstore': { step: 5, title: 'Bookstore - Find the Secret Guide', name: 'Bookstore' },
  'slideTransitionBakery': { step: 5, title: 'The Final Trail...', name: 'Bookstore' },
  'slideBakery': { step: 6, title: 'Bakery - Order the Macaron Steps', name: 'Bakery' },
  'slideTransitionBakerySecret': { step: 6, title: 'The Secret Revealed...', name: 'Bakery' },
  'slideFinal': { step: 7, title: 'Combine All Clues - Final Puzzle', name: 'Final' },
  'slideEiffel': { step: 8, title: 'Victory! Recipe Recovered!', name: 'Victory' }
};

function updateWizardProgress(slideId) {
  const stepInfo = wizardSteps[slideId];
  if (!stepInfo) return;

  const currentStepNum = stepInfo.step;
  const totalSteps = 8;

  // Update step counter
  document.getElementById('currentStep').textContent = currentStepNum;
  document.getElementById('totalSteps').textContent = totalSteps;
  
  // Update step title
  document.getElementById('stepTitle').textContent = stepInfo.title;

  // Update progress bar
  const progressPercent = (currentStepNum / totalSteps) * 100;
  document.getElementById('progressFill').style.width = progressPercent + '%';

  // Update step circles
  const allSteps = document.querySelectorAll('.wizard-step');
  allSteps.forEach((stepElement, index) => {
    const stepNumber = index + 1;
    stepElement.classList.remove('active', 'completed');
    
    if (stepNumber < currentStepNum) {
      stepElement.classList.add('completed');
    } else if (stepNumber === currentStepNum) {
      stepElement.classList.add('active');
    }
  });
}

function goToSlide(id){
  // 1️⃣ Hide all slides
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));

  // 2️⃣ Small delay before showing new slide for smoother fade-in
  setTimeout(() => {
    document.getElementById(id).classList.add('active');

    // ✅ Initialize slide-specific things
    if(id === 'slideBookstore'){
      enterLibrary(); // automatically show the library sections
    }
    
    if(id === 'slideBakery'){
      initializeMacaronGame(); // initialize the macaron ordering game
    }

    // ✅ Update wizard progress
    updateWizardProgress(id);
  }, 50); // 50ms delay
}

// Initialize wizard on page load
window.addEventListener('DOMContentLoaded', () => {
  updateWizardProgress('slide0');
});
// Update clues and toggle animation
function addClue(num, text){
  // mark clue as collected
  clues[num] = true;

  // update all clue displays
  updateClues();

  // update final clues popup
  let clueBox = document.getElementById('finalClues');
  clueBox.style.display = 'block';
  clueBox.innerHTML = `Clues Collected:<br>`;
  if(clues[1]) clueBox.innerHTML += `<span class="clue-animate">Clue #1: Louvre</span><br>`;
  if(clues[2]) clueBox.innerHTML += `<span class="clue-animate">Clue #2: Café</span><br>`;
  if(clues[3]) clueBox.innerHTML += `<span class="clue-animate">Clue #3: Boutique</span><br>`;
  if(clues[4]) clueBox.innerHTML += `<span class="clue-animate">Clue #4: Bookstore</span><br>`;
  if(clues[5]) clueBox.innerHTML += `<span class="clue-animate">Clue #5: Bakery</span><br>`;

  // Slide progression
  if(num === 1) goToSlide('slideTransition'); // Museum → transition
  else if(num === 3){
    // Boutique flow handled by popup
  }
  else if(num === 4){
    // Bookstore flow handled by popup
  }
  else if(num === 5) goToSlide('slideFinal');    // Bakery → final
}

function updateClues(){
  document.getElementById('cluesMuseum').innerText=`Clues collected: ${countClues()}/5`;
  document.getElementById('cluesCafe').innerText=`Clues collected: ${countClues()}/5`;
  document.getElementById('cluesBoutique').innerText=`Clues collected: ${countClues()}/5`; // ✅ ADD THIS
  document.getElementById('cluesBookstore').innerText=`Clues collected: ${countClues()}/5`;
  document.getElementById('cluesBakery').innerText=`Clues collected: ${countClues()}/5`;
}

function countClues(){
  return Object.values(clues).filter(Boolean).length;
}

//////////////// Louvre Mini-Game (3/5 correct) //////////////////

const museumQuestions = [
  {q:'Translate "Peinture" → ?', a:'Painting'},
  {q:'Translate "Musée" → ?', a:'Museum'},
  {q:'Year Mona Lisa painted?', a:'1503'},
  {q:'Translate "Artiste" → ?', a:'Artist'},
  {q:'Where is the Louvre Museum Located', a:'Paris'}
];

let museumCorrect = 0;

// Track remaining questions so they don't repeat
let remainingMuseumQuestions = [...museumQuestions];

function nextMuseumTask() {
  if (museumCorrect >= 3) { 
    addClue(1); // unlock Clue #1
    return; 
  }

  // Reset if all questions have been asked
  if (remainingMuseumQuestions.length === 0) {
    remainingMuseumQuestions = [...museumQuestions];
  }

  // Pick a random question from remaining
  const index = Math.floor(Math.random() * remainingMuseumQuestions.length);
  const task = remainingMuseumQuestions[index];

  // Remove it so it doesn't repeat immediately
  remainingMuseumQuestions.splice(index, 1);

  // Display question and bigger input box
  document.getElementById('museumTask').innerHTML = `
   <div class="museum-question">${task.q}</div><br>
    <input type="text" id="museumAnswer" placeholder="Type your answer here" style="width:300px; font-size:16px; padding:5px;">
    <button onclick="checkMuseum('${task.a}')">Submit</button>
  `;
}

function checkMuseum(ans) {
  const val = document.getElementById('museumAnswer').value.trim();
  if (val.toLowerCase() === ans.toLowerCase()) {
    showPopup('✅ Correct!');
    museumCorrect++;
    nextMuseumTask(); // automatically show next question
  } else {
    showPopup('❌ Try again!');
  }
}

// Library 2-Step Search – Section then Book

// Step 1 – Sections
const librarySections = ["Science & Arts","Food & Cookery","Magic & Spells"];
const correctSection = "Food & Cookery"; // Section with macaron book

// Step 2 – Books in Food & Cookery
const booksInFood = ["Baking Basics","Secret Macaron Guide","French Desserts","Cooking with Stars","Mastering Croissants","Parisian Pastries","Simple Guide To Cook Frogs","Baguettes for Beginners","Escargot for Dummies","Wine and Whiskers","The Art of Making Nothing Taste Fancy","Le Guide Culinaire"];
const correctBook = "Secret Macaron Guide";

// Step 1 – Choose a section
function enterLibrary(){
  let html = `<p>Choose a section to search:</p>`;
  librarySections.forEach(sec=>{
    html += `<button onclick="chooseSection('${sec}')">${sec}</button> `;
  });
  document.getElementById('libraryTask').innerHTML = html;
}

// Step 2 – Choose a book in the section
function chooseSection(section){
  if(section === correctSection){
    let html = `<p>You are in ${section} section. Which book do you pick?</p>`;
    booksInFood.forEach(book=>{
      html += `<button onclick="chooseBook('${book}')">${book}</button> `;
    });
    document.getElementById('libraryTask').innerHTML = html;
  } else {
    showPopup("This section doesn't have the book! Try another section.");
  }
}

// Step 3 – Pick the correct book
function chooseBook(book){
  if(book === correctBook){
    currentFlow = "bookstore";
    popupStep = "start";
    showPopup("You found the Secret Macaron Guide! 📖");
  } else {
    showPopup("Wrong book… look carefully.");
  }
}

// ========== MACARON ORDERING GAME ==========

// Correct order for making macarons
const correctMacaronOrder = [
  "Prepare ingredients",
  "Whisk egg whites",
  "Fold dry ingredients",
  "Pipe the batter",
  "Rest the shells",
  "Bake the macarons"
];

// Create a shuffled version
let shuffledSteps = [];
let selectedSteps = [];

// Initialize the bakery ordering game
function initializeMacaronGame() {
  // Shuffle the steps
  shuffledSteps = [...correctMacaronOrder];
  for (let i = shuffledSteps.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledSteps[i], shuffledSteps[j]] = [shuffledSteps[j], shuffledSteps[i]];
  }
  
  selectedSteps = [];
  renderMacaronSteps();
}

// Render the available and selected steps
function renderMacaronSteps() {
  const availableContainer = document.getElementById('availableSteps');
  const selectedContainer = document.getElementById('selectedStepsList');
  
  // Render available steps
  availableContainer.innerHTML = '';
  shuffledSteps.forEach((step, index) => {
    const isSelected = selectedSteps.some(s => s.text === step);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step-card' + (isSelected ? ' selected' : '');
    stepDiv.innerHTML = step;
    
    if (!isSelected) {
      stepDiv.onclick = () => selectStep(step);
    }
    
    availableContainer.appendChild(stepDiv);
  });
  
  // Render selected steps
  selectedContainer.innerHTML = '';
  if (selectedSteps.length === 0) {
    selectedContainer.innerHTML = '<p style="color: #999; font-style: italic;">No steps selected yet...</p>';
  } else {
    selectedSteps.forEach((step, index) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'selected-step-item';
      stepDiv.innerHTML = `
        <span class="selected-step-number">${index + 1}</span>
        <span class="selected-step-text">${step.text}</span>
      `;
      selectedContainer.appendChild(stepDiv);
    });
  }
}

// Select a step
function selectStep(stepText) {
  if (selectedSteps.length < correctMacaronOrder.length) {
    selectedSteps.push({ text: stepText });
    renderMacaronSteps();
  }
}

// Reset the order
function resetMacaronOrder() {
  selectedSteps = [];
  renderMacaronSteps();
}

// Check if the order is correct
function checkMacaronOrder() {
  if (selectedSteps.length !== correctMacaronOrder.length) {
    showPopup(`❌ You need to select all ${correctMacaronOrder.length} steps!`);
    return;
  }
  
  // Check if the order matches
  let isCorrect = true;
  for (let i = 0; i < correctMacaronOrder.length; i++) {
    if (selectedSteps[i].text !== correctMacaronOrder[i]) {
      isCorrect = false;
      break;
    }
  }
  
  if (isCorrect) {
    currentFlow = "bakery";
    popupStep = "start";
    showPopup('🎉 Perfect! You know the secret macaron recipe!');
  } else {
    showPopup('❌ Not quite right... The order matters! Try again.');
  }
}

// Bakery Ingredients (old function - kept for compatibility)
function checkIngredient(choice){
  if(choice==='correct'){ showPopup('You found the secret ingredient!'); addClue(5); }
  else showPopup('No clue here, keep searching!');
}

// Final Slide
function checkFinal(){
  const val=document.getElementById('finalInput').value.toUpperCase();
  if(val==='L-C-F-B-B'){
    goToSlide('slideEiffel'); // Move to the new Eiffel Tower slide
} else { 
    document.getElementById('finalMessage').innerText='Incorrect. Check your clues and try again.'; 
}
}
// Boutique Game

function chooseScarf(choice){
  if(choice === 'correct'){
    currentFlow = "boutique";
    popupStep = "start";
    showPopup("Strange… this scarf feels cheaper than the rest… 🧣");
  } else {
    showPopup("Everything here seems perfectly normal… too normal.");
  }
}

function findCompartment(choice){
  if(choice === 'correct'){
    showPopup("You notice uneven stitching… something is hidden.");

    setTimeout(()=>{
      showPopup("Inside, you find a tiny folded note 📜");
    },800);

    setTimeout(()=>{
      showPopup("It reads: 'Rue des Livres' 📚");
    },1600);

    setTimeout(()=>{
      addClue(3);
    },2400);

  } else {
    showPopup("Nothing unusual here…");
  }
}

let cafeStep = 0;
let boutiqueStep = 0;
let bookstoreStep = 0;

// ================= CLEAN POPUP SYSTEM =================
let popupStep = "";
let currentFlow = "";

function showPopup(message){
  document.getElementById("popupText").innerText = message;
  document.getElementById("customPopup").style.display = "flex";
}
function chooseCafePerson(choice){
  console.log("input",choice);
  if(choice === 'correct'){
    currentFlow = "cafe";
    popupStep = "start";
    console.log("ifcondition");
    showPopup("Something feels off… he isn’t reading at all.");
  } else {
    console.log("elsecondition");
    showPopup("They seem completely normal… look closer.");
  }
}

function closePopup(){
  document.getElementById("customPopup").style.display = "none";

  // ☕ CAFE FLOW
  if(currentFlow === "cafe"){
    if(popupStep === "start"){
      popupStep = "step2";
      showPopup("Houdin notices the elegant scarf beside him… 👗");
      return;
    }
    if(popupStep === "step2"){
      popupStep = "step3";
      showPopup("“Not enough evidence to stop him… but that scarf…” 🎩");
      return;
    }
    if(popupStep === "step3"){
      popupStep = "";
      currentFlow = "";
      addClue(2);
      goToSlide('slideTransitionBoutique');
      return;
    }
  }

  // 🧥 BOUTIQUE FLOW
  if(currentFlow === "boutique"){
    if(popupStep === "start"){
      popupStep = "step2";
      showPopup("Houdin examines the stitching… uneven. Hidden compartment? 👀");
      return;
    }
    if(popupStep === "step2"){
      popupStep = "step3";
      showPopup("Inside… a folded note. “Cookery Section.” 📜");
      return;
    }
    if(popupStep === "step3"){
      popupStep = "";
      currentFlow = "";
      addClue(3);
      goToSlide('slideTransitionBookstore');
      return;
    }
  }

  // 📚 BOOKSTORE FLOW
  if(currentFlow === "bookstore"){
    if(popupStep === "start"){
      popupStep = "step2";
      showPopup("Wait… something is hidden inside the book… 👀");
      return;
    }
    if(popupStep === "step2"){
      popupStep = "";
      currentFlow = "";
      addClue(4);
      goToSlide('slideTransitionBakery');
      return;
    }
  }

  // 🥐 BAKERY FLOW
  if(currentFlow === "bakery"){
    if(popupStep === "start"){
      popupStep = "";
      currentFlow = "";
      goToSlide('slideTransitionBakerySecret');
      return;
    }
  }
}