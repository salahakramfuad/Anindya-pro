/**
 * Bottle recommendation quiz
 * Loads after: none
 */
// ========== BOTTLE QUIZ (FULLY WORKING) ==========
const quizQuestions = [
  {
    text: "How often do you drink water?",
    options: [ "Rarely (1-2 glasses/day)", "Sometimes (3-4 glasses/day)", "Often (5-6 glasses/day)", "Always (7-8+ glasses/day)" ],
    scores: [ 1, 2, 3, 4 ]
  },
  {
    text: "What's your main activity?",
    options: [ "Student/Sedentary job", "Light exercise", "Regular sports/athlete", "Outdoor worker" ],
    scores: [ 1, 2, 3, 4 ]
  },
  {
    text: "Do you want smart features?",
    options: [ "No, just a basic bottle", "Maybe, temperature display", "Yes, reminders and tracking", "Yes, all features + self-cleaning" ],
    scores: [ 1, 2, 3, 4 ]
  },
  {
    text: "What's your budget?",
    options: [ "Under $10", "$10-$15", "$15-$20", "$20+" ],
    scores: [ 1, 2, 3, 4 ]
  },
  {
    text: "Do you care about bottle color?",
    options: [ "Not at all", "A little", "Yes, want options", "I want custom colors" ],
    scores: [ 1, 2, 3, 4 ]
  }
]

let currentQuestion = 0
let userAnswers = []
let quizAnswers = []

function loadQuestion ()
{
  const q = quizQuestions[ currentQuestion ]
  document.getElementById( 'quizQuestion' ).textContent = `Question ${currentQuestion + 1}/${quizQuestions.length}`
  document.getElementById( 'quizText' ).textContent = q.text

  const optionsDiv = document.getElementById( 'quizOptions' )
  optionsDiv.innerHTML = ''
  q.options.forEach( ( option, idx ) =>
  {
    const optionDiv = document.createElement( 'div' )
    optionDiv.className = 'quiz-option'
    if ( quizAnswers[ currentQuestion ] === idx ) optionDiv.classList.add( 'selected' )
    optionDiv.textContent = option
    optionDiv.onclick = () => selectOption( idx )
    optionsDiv.appendChild( optionDiv )
  } )

  const progress = ( ( currentQuestion + 1 ) / quizQuestions.length ) * 100
  document.getElementById( 'quizProgressBar' ).style.width = `${progress}%`

  document.getElementById( 'quizPrev' ).style.display = currentQuestion === 0 ? 'none' : 'inline-block'
  document.getElementById( 'quizNext' ).textContent = currentQuestion === quizQuestions.length - 1 ? 'See Result →' : 'Next ▶'
}

function selectOption ( optionIndex )
{
  quizAnswers[ currentQuestion ] = optionIndex
  document.querySelectorAll( '.quiz-option' ).forEach( ( opt, idx ) =>
  {
    if ( idx === optionIndex ) opt.classList.add( 'selected' )
    else opt.classList.remove( 'selected' )
  } )
}

function nextQuestion ()
{
  if ( quizAnswers[ currentQuestion ] === undefined )
  {
    alert( 'Please select an answer!' )
    return
  }

  if ( currentQuestion === quizQuestions.length - 1 )
  {
    showResult()
  } else
  {
    currentQuestion++
    loadQuestion()
  }
}

function prevQuestion ()
{
  if ( currentQuestion > 0 )
  {
    currentQuestion--
    loadQuestion()
  }
}

function showResult ()
{
  let totalScore = 0
  quizAnswers.forEach( ( answer, idx ) =>
  {
    totalScore += quizQuestions[ idx ].scores[ answer ]
  } )

  let result = {}
  if ( totalScore <= 8 )
  {
    result = {
      title: "💧 Classic Steel",
      description: "Perfect for beginners! Basic hydration with stainless steel durability. Affordable and reliable.",
      bottle: "Classic Steel - $9.99",
      icon: "🥤"
    }
  } else if ( totalScore <= 12 )
  {
    result = {
      title: "🎨 Color Edition",
      description: "Express your style! Choose from 8 vibrant colors. Includes temperature display.",
      bottle: "Ocean Blue / Energy Green / Hot Pink - $9.99",
      icon: "🎨"
    }
  } else if ( totalScore <= 16 )
  {
    result = {
      title: "⚡ Smart Hydration",
      description: "Smart reminders + touch display + temperature tracking. Perfect for health-conscious users.",
      bottle: "Premium Smart Bottle - $9.99 + Membership",
      icon: "⚡"
    }
  } else
  {
    result = {
      title: "🚀 Ultimate Pro",
      description: "All smart features + self-cleaning UV technology + custom colors. The ultimate hydration experience!",
      bottle: "HydroSmart Pro + Premium Membership",
      icon: "🚀"
    }
  }

  document.getElementById( 'resultIcon' ).textContent = result.icon
  document.getElementById( 'resultTitle' ).textContent = result.title
  document.getElementById( 'resultDescription' ).innerHTML = `${result.description}<br><br><strong>Recommended: ${result.bottle}</strong>`
  document.getElementById( 'resultBottle' ).innerHTML = `<div class="water-fill" style="width: 80px; height: 120px; margin: 0 auto;"><div class="water-level" style="height: 70%;"></div></div>`

  document.getElementById( 'quizCard' ).style.display = 'none'
  document.getElementById( 'quizResult' ).style.display = 'block'
}

function resetQuiz ()
{
  currentQuestion = 0
  quizAnswers = []
  document.getElementById( 'quizCard' ).style.display = 'block'
  document.getElementById( 'quizResult' ).style.display = 'none'
  loadQuestion()
}

// Event listeners
document.getElementById( 'quizNext' )?.addEventListener( 'click', nextQuestion )
document.getElementById( 'quizPrev' )?.addEventListener( 'click', prevQuestion )

// Initialize quiz
if ( document.getElementById( 'quizOptions' ) )
{
  loadQuestion()
}

