let clues = {1:false,2:false,3:false,4:false,5:false};

// ========== GAME TIMER ==========
let gameStartTime = null;
let timerInterval = null;

function startGameTimer() {
  gameStartTime = Date.now();
  
  // Update timer every second
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - gameStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    const timerDisplay = document.getElementById('gameTimer');
    if (timerDisplay) {
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, 1000);
}

function stopGameTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function getElapsedTime() {
  if (!gameStartTime) return '00:00';
  const elapsed = Date.now() - gameStartTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ========== HINT SYSTEM ==========
const hintMessages = {
  'slideMuseum': '💡 Think about French words related to art and museums. Try translating "Peinture" or "Musée" to English!',
  'slideCafe': '🕵️‍♂️ Look carefully at each person. Who seems out of place? Someone here is reading, but not quite like the others...',
  'slideBoutique': '🧣 Among all these luxury items, one doesn\'t belong. Look for something that seems worn or cheaper than the rest.',
  'slideBookstore': '📚 You\'re looking for a cookbook section. Think about where you\'d find recipes for French desserts!',
  'slideBakery': '🥐 Making macarons is all about the process! Start with ingredients, then whisk, fold, pipe, rest, and finally bake.'
};

function updateHintButton(slideId) {
  const hintButton = document.getElementById('hintButton');
  const hintChat = document.getElementById('hintChat');
  
  if (!hintButton || !hintChat) {
    console.log('Hint elements not found');
    return;
  }
  
  // Show hint button only on specific slides (steps 2-6)
  const slidesWithHints = ['slideMuseum', 'slideCafe', 'slideBoutique', 'slideBookstore', 'slideBakery'];
  
  console.log('Current slide:', slideId, 'Has hints:', slidesWithHints.includes(slideId));
  
  if (slidesWithHints.includes(slideId)) {
    hintButton.classList.add('show');
    console.log('Hint button should be visible now');
    // Close chat when changing slides
    hintChat.classList.remove('show');
  } else {
    hintButton.classList.remove('show');
    hintChat.classList.remove('show');
  }
}

function toggleHintChat() {
  // 🔊 Play glass clink sound
  playGlassClinkSound();
  
  const hintChat = document.getElementById('hintChat');
  const hintText = document.getElementById('hintText');
  const activeSlide = document.querySelector('.slide.active');
  
  if (activeSlide && hintMessages[activeSlide.id]) {
    hintText.textContent = hintMessages[activeSlide.id];
    hintChat.classList.toggle('show');
  }
}

function closeHintChat() {
  const hintChat = document.getElementById('hintChat');
  hintChat.classList.remove('show');
}

// ========== NOTES SYSTEM ==========
function updateNotesButton(slideId) {
  const notesButton = document.getElementById('notesButton');
  
  if (!notesButton) return;
  
  // Show notes button on all game slides (not on landing page)
  const landingPage = document.getElementById('landingPage');
  if (landingPage && landingPage.classList.contains('active')) {
    notesButton.classList.remove('show');
  } else {
    notesButton.classList.add('show');
  }
}

function toggleNotes() {
  const notesWindow = document.getElementById('notesWindow');
  notesWindow.classList.toggle('show');
  
  // Load saved notes when opening
  if (notesWindow.classList.contains('show')) {
    loadNotes();
  }
}

function closeNotes() {
  const notesWindow = document.getElementById('notesWindow');
  notesWindow.classList.remove('show');
}

function saveNotes() {
  const notesText = document.getElementById('notesTextarea').value;
  sessionStorage.setItem('detectiveNotes', notesText);
}

function loadNotes() {
  const savedNotes = sessionStorage.getItem('detectiveNotes') || '';
  document.getElementById('notesTextarea').value = savedNotes;
}

function clearNotes() {
  if (confirm('Are you sure you want to clear all your notes?')) {
    document.getElementById('notesTextarea').value = '';
    sessionStorage.removeItem('detectiveNotes');
  }
}

// Auto-save notes as user types
document.addEventListener('DOMContentLoaded', () => {
  const notesTextarea = document.getElementById('notesTextarea');
  if (notesTextarea) {
    notesTextarea.addEventListener('input', saveNotes);
    // Don't load notes on page load - they're cleared on every refresh
  }
});

// ========== TOAST NOTIFICATION SYSTEM ==========
function showToast(message, type = 'info') {
  // Remove any existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remove after 2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

// ========== SOUND EFFECTS SYSTEM ==========
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create a pleasant transition sound
function playTransitionSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Elegant "whoosh" sound
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.type = 'sine';
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Create a success/achievement sound
function playSuccessSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Pleasant "ding" sound
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
  
  oscillator.type = 'sine';
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.4);
}

// Create a clue collection sound
function playClueSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Magical "sparkle" sound
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(2400, audioContext.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
  
  oscillator.type = 'triangle';
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.25);
}

// Create a smooth notification bell sound for hint button
function playGlassClinkSound() {
  const now = audioContext.currentTime;
  
  // Create a pleasant bell-like notification sound
  // Using a major chord (C-E-G) for a pleasant, professional sound
  
  // Fundamental note (C - 523.25 Hz)
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  
  osc1.frequency.setValueAtTime(523.25, now); // C5
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.15, now + 0.01); // Smooth attack
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  osc1.type = 'sine';
  osc1.start(now);
  osc1.stop(now + 0.5);
  
  // Third (E - 659.25 Hz)
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  
  osc2.frequency.setValueAtTime(659.25, now + 0.01); // E5
  gain2.gain.setValueAtTime(0, now + 0.01);
  gain2.gain.linearRampToValueAtTime(0.12, now + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
  osc2.type = 'sine';
  osc2.start(now + 0.01);
  osc2.stop(now + 0.6);
  
  // Fifth (G - 783.99 Hz) - adds brightness
  const osc3 = audioContext.createOscillator();
  const gain3 = audioContext.createGain();
  osc3.connect(gain3);
  gain3.connect(audioContext.destination);
  
  osc3.frequency.setValueAtTime(783.99, now + 0.02); // G5
  gain3.gain.setValueAtTime(0, now + 0.02);
  gain3.gain.linearRampToValueAtTime(0.1, now + 0.03);
  gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
  osc3.type = 'sine';
  osc3.start(now + 0.02);
  osc3.stop(now + 0.7);
}

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
  // 🔊 Play transition sound
  playTransitionSound();
  
  // 1️⃣ Get current active slide and add slide-out animation
  const currentSlide = document.querySelector('.slide.active');
  if (currentSlide) {
    currentSlide.classList.add('slide-out');
    currentSlide.classList.remove('active');
  }

  // 2️⃣ Wait for slide-out animation, then show new slide
  setTimeout(() => {
    // Remove slide-out class from all slides
    document.querySelectorAll('.slide').forEach(s => {
      s.classList.remove('slide-out');
    });
    
    // Show new slide
    document.getElementById(id).classList.add('active');

    // ✅ Initialize slide-specific things
    if(id === 'slideMuseum'){
      initializeMuseumQuiz(); // initialize the museum quiz
    }
    
    if(id === 'slideBookstore'){
      enterLibrary(); // automatically show the library sections
    }
    
    if(id === 'slideBakery'){
      initializeMacaronGame(); // initialize the macaron ordering game
    }
    
    // ⏱️ Check if victory slide - stop timer and show final time
    if(id === 'slideEiffel'){
      stopGameTimer();
      const finalTimeDisplay = document.getElementById('finalTime');
      if (finalTimeDisplay) {
        finalTimeDisplay.textContent = getElapsedTime();
      }
    }

    // ✅ Update wizard progress
    updateWizardProgress(id);
    
    // ✅ Update hint button visibility
    updateHintButton(id);
    
    // ✅ Update notes button visibility
    updateNotesButton(id);
  }, 500); // Smooth transition timing
}

// Launch game from landing page
function launchGame() {
  // 🔊 Play success sound for starting the game
  playSuccessSound();
  
  const landingPage = document.getElementById('landingPage');
  const wizardProgress = document.getElementById('wizardProgress');
  
  // Add fade-out animation to landing page
  landingPage.classList.add('fade-out');
  
  // Wait for animation, then hide landing page and show game
  setTimeout(() => {
    landingPage.classList.remove('active', 'fade-out');
    wizardProgress.style.display = 'block';
    
    // ⏱️ Start the game timer
    startGameTimer();
    
    goToSlide('slide0');
  }, 800);
}

// Initialize wizard on page load
window.addEventListener('DOMContentLoaded', () => {
  // Clear notes on page load/hard refresh
  sessionStorage.removeItem('detectiveNotes');
  const notesTextarea = document.getElementById('notesTextarea');
  if (notesTextarea) {
    notesTextarea.value = '';
  }
  
  // Check if landing page exists and is active
  const landingPage = document.getElementById('landingPage');
  const wizardProgress = document.getElementById('wizardProgress');
  
  if (landingPage && landingPage.classList.contains('active')) {
    // Hide wizard if landing page is active
    wizardProgress.style.display = 'none';
    // Hide hint button on landing page
    const hintButton = document.getElementById('hintButton');
    if (hintButton) {
      hintButton.classList.remove('show');
    }
    // Hide notes button on landing page
    const notesButton = document.getElementById('notesButton');
    if (notesButton) {
      notesButton.classList.remove('show');
    }
  } else {
    // Show wizard and initialize for first game slide
    wizardProgress.style.display = 'block';
    updateWizardProgress('slide0');
    // Check which slide is active and update hint button
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
      updateHintButton(activeSlide.id);
      updateNotesButton(activeSlide.id);
    }
  }
});

// Reset game to initial state
function resetGame() {
  // Reset clues
  clues = {1:false,2:false,3:false,4:false,5:false};
  
  // Reset museum quiz
  quizAnswers = {
    q1: false,
    q2: false,
    q3: false
  };
  
  // Reset macaron game
  selectedSteps = [];
  shuffledSteps = [];
  
  // Reset popup flow
  popupStep = "";
  currentFlow = "";
  
  // Stop and reset timer
  stopGameTimer();
  gameStartTime = null;
  
  // Update clue displays
  updateClues();
  
  // Clear final clues
  const clueBox = document.getElementById('finalClues');
  if (clueBox) {
    clueBox.style.display = 'none';
    clueBox.innerHTML = '';
  }
  
  // Clear final message
  const finalMessage = document.getElementById('finalMessage');
  if (finalMessage) {
    finalMessage.innerText = '';
  }
  
  // Clear final input
  const finalInput = document.getElementById('finalInput');
  if (finalInput) {
    finalInput.value = '';
  }
  
  // Hide wizard and show landing page
  const landingPage = document.getElementById('landingPage');
  const wizardProgress = document.getElementById('wizardProgress');
  
  // Hide all game slides
  document.querySelectorAll('.slide').forEach(s => {
    s.classList.remove('active', 'slide-out');
  });
  
  // Hide hint button
  const hintButton = document.getElementById('hintButton');
  if (hintButton) {
    hintButton.classList.remove('show');
  }
  
  // Hide hint chat
  const hintChat = document.getElementById('hintChat');
  if (hintChat) {
    hintChat.classList.remove('show');
  }
  
  // Hide notes button
  const notesButton = document.getElementById('notesButton');
  if (notesButton) {
    notesButton.classList.remove('show');
  }
  
  // Hide notes window
  const notesWindow = document.getElementById('notesWindow');
  if (notesWindow) {
    notesWindow.classList.remove('show');
  }
  
  // Clear notes
  document.getElementById('notesTextarea').value = '';
  sessionStorage.removeItem('detectiveNotes');
  
  // Show landing page
  wizardProgress.style.display = 'none';
  landingPage.classList.add('active');
  
  // Reset timer display
  const timerDisplay = document.getElementById('gameTimer');
  if (timerDisplay) {
    timerDisplay.textContent = '00:00';
  }
}

// Update clues and toggle animation
function addClue(num, text){
  // 🔊 Play clue collection sound
  playClueSound();
  
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

//////////////// Louvre Mini-Game (All Questions at Once) //////////////////

const museumQuestions = [
  {id: 'q1', q:'Translate "Peinture" → ?', a:'Painting'},
  {id: 'q2', q:'Translate "Musée" → ?', a:'Museum'},
  {id: 'q3', q:'Year Mona Lisa painted?', a:'1503'}
];

let quizAnswers = {
  q1: false,
  q2: false,
  q3: false
};

function initializeMuseumQuiz() {
  // Reset quiz state
  quizAnswers = {
    q1: false,
    q2: false,
    q3: false
  };
  
  const container = document.getElementById('quizQuestions');
  container.innerHTML = '';
  
  // Create all questions at once
  museumQuestions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    questionDiv.id = `question-${question.id}`;
    
    questionDiv.innerHTML = `
      <div class="question-text">${index + 1}. ${question.q}</div>
      <div class="question-input-group">
        <input type="text"
               id="answer-${question.id}"
               placeholder="Type your answer here"
               onkeypress="handleQuizEnter(event, '${question.id}', '${question.a}')">
        <button onclick="checkQuizAnswer('${question.id}', '${question.a}')">Submit</button>
      </div>
    `;
    
    container.appendChild(questionDiv);
  });
  
  updateQuizProgress();
}

function handleQuizEnter(event, questionId, correctAnswer) {
  if (event.key === 'Enter') {
    checkQuizAnswer(questionId, correctAnswer);
  }
}

function checkQuizAnswer(questionId, correctAnswer) {
  const input = document.getElementById(`answer-${questionId}`);
  const questionDiv = document.getElementById(`question-${questionId}`);
  const userAnswer = input.value.trim();
  
  // Don't check if already answered correctly
  if (quizAnswers[questionId]) {
    showToast('You already answered this correctly!', 'info');
    return;
  }
  
  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    // Correct answer
    playSuccessSound();
    showToast('Correct! Well done! 🎉', 'success');
    quizAnswers[questionId] = true;
    
    // Mark question as correct
    questionDiv.classList.add('correct');
    input.disabled = true;
    questionDiv.querySelector('button').disabled = true;
    
    updateQuizProgress();
    
    // Check if all answered correctly
    const allCorrect = Object.values(quizAnswers).every(v => v === true);
    if (allCorrect) {
      setTimeout(() => {
        showToast('All questions answered correctly! Clue unlocked! ✨', 'success');
        setTimeout(() => {
          addClue(1); // unlock Clue #1 and advance
        }, 1500);
      }, 500);
    }
  } else {
    // Wrong answer
    showToast('Incorrect. Try again!', 'error');
    questionDiv.classList.add('incorrect');
    setTimeout(() => {
      questionDiv.classList.remove('incorrect');
    }, 1000);
  }
}

function updateQuizProgress() {
  const correctCount = Object.values(quizAnswers).filter(v => v === true).length;
  document.getElementById('correctCount').textContent = correctCount;
}

// Library 2-Step Search – Section then Book

// Step 1 – Sections
const librarySections = ["Science & Arts","Food & Cookery","Magic & Spells"];
const correctSection = "Food & Cookery"; // Section with macaron book

// Step 2 – Books in Food & Cookery
const booksInFood = ["Baking Basics","Wine and Whiskers","French Desserts","Cooking with Stars","Mastering Croissants","Parisian Pastries","Simple Guide To Cook Frogs","Baguettes for Beginners","Escargot for Dummies","Secret Macaron Guide","The Art of Making Nothing Taste Fancy","Le Guide Culinaire"];
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
    playSuccessSound(); // 🔊 Success sound
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
    playSuccessSound(); // 🔊 Victory sound
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
    showPopup("Something feels off… he isn’t flipping the pages of the book 📖 .");
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
      showPopup("Houdin notices the elegant scarf… 👗");
      return;
    }
    if(popupStep === "step2"){
      popupStep = "step3";
      showPopup("“Not enough evidence to stop him… but that scarf is expensive…” 🎩");
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
