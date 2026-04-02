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

/** Catalog-aligned ids for openOrderModal + imagery */
const QUIZ_PRODUCT_META = {
  "Ocean Blue": {
    title: "Ocean Blue",
    price: "$9.99",
    headline: "Your pick: Ocean Blue",
    description: "Strong match for tracking and daily sips—smart hydration features with optional UV add-on when you want to level up.",
    image: "bottle_blue.png",
    imageAlt: "Ocean Blue bottle",
    icon: "💧"
  },
  "Energy Green": {
    title: "Energy Green",
    price: "$9.99",
    headline: "Your pick: Energy Green",
    description: "Great when you want quick temp readouts and a sporty feel without going full app-heavy.",
    image: "bottle_green.png",
    imageAlt: "Energy Green bottle",
    icon: "🌿"
  },
  "Galaxy Purple": {
    title: "Galaxy Purple",
    price: "$9.99",
    headline: "Your pick: Galaxy Purple",
    description: "Styled and practical—leak-proof lid and reminders for a lighter smart setup.",
    image: "bottle_purple.png",
    imageAlt: "Galaxy Purple bottle",
    icon: "✨"
  },
  "Classic Steel": {
    title: "Classic Steel",
    price: "$9.99",
    headline: "Your pick: Classic Steel",
    description: "Keep it simple: durable steel, wide mouth for ice, no-fuss hydration.",
    image: "Whitebottle.png",
    imageAlt: "Classic Steel bottle",
    icon: "🥤"
  },
  "Bright Black": {
    title: "Bright Black",
    price: "$9.99",
    headline: "Your pick: Bright Black",
    description: "Low-key and rugged—fingerprint-resistant finish with a carry loop for on-the-go days.",
    image: "blackbottle.png",
    imageAlt: "Bright Black bottle",
    icon: "⬛"
  },
  "Hot Pink": {
    title: "Hot Pink",
    price: "$9.99",
    headline: "Your pick: Hot Pink",
    description: "Bold color with a dishwasher-safe lid when you want the bottle to feel personal.",
    image: "pinkbottle.png",
    imageAlt: "Hot Pink bottle",
    icon: "🩷"
  },
  "Arctic White": {
    title: "Arctic White (Special Edition)",
    price: "$7.99",
    headline: "Your pick: Arctic White",
    description: "Compact budget pick with self-clean bundle in the box—ideal when you want value under $10.",
    image: "white.png",
    imageAlt: "Arctic White bottle",
    icon: "❄️"
  },
  "Rose Red": {
    title: "Rose Red (Special Edition)",
    price: "$7.99",
    headline: "Your pick: Rose Red",
    description: "Special edition sizing with gift-ready packaging—great when color and price both matter.",
    image: "red.png",
    imageAlt: "Rose Red bottle",
    icon: "🌹"
  }
}

const MEMBERSHIP_HINTS = {
  "Basic Hydration": "Reminders and light perks—fits moderate routines.",
  "Premium Hydration": "Best when you want full app features and priority support.",
  "Family Hydration": "Multiple profiles—works well for busy households or teams.",
  "Annual Premium": "Best value if you are all-in for the year—we will pre-select it at checkout."
}

let currentQuestion = 0
let userAnswers = []
let quizAnswers = []

function pickQuizProductId ( answers )
{
  const drink = answers[ 0 ]
  const activity = answers[ 1 ]
  const smart = answers[ 2 ]
  const budget = answers[ 3 ]
  const color = answers[ 4 ]

  if ( budget === 0 )
  {
    if ( color >= 2 || smart >= 2 ) return "Rose Red"
    return "Arctic White"
  }

  if ( smart === 3 )
  {
    if ( budget >= 2 ) return "Ocean Blue"
    return "Arctic White"
  }

  if ( activity >= 2 && smart >= 2 ) return "Ocean Blue"
  if ( activity >= 2 && smart === 1 ) return "Energy Green"

  if ( smart === 0 )
  {
    if ( color === 0 ) return "Classic Steel"
    if ( color === 1 ) return "Galaxy Purple"
    if ( color === 2 ) return "Hot Pink"
    return "Bright Black"
  }

  if ( smart === 1 ) return "Energy Green"
  if ( smart === 2 )
  {
    if ( color <= 1 ) return "Galaxy Purple"
    return "Ocean Blue"
  }

  return "Ocean Blue"
}

function pickMembershipPlan ( answers )
{
  const drink = answers[ 0 ]
  const activity = answers[ 1 ]
  const smart = answers[ 2 ]
  const budget = answers[ 3 ]

  if ( budget >= 3 && ( smart >= 3 || drink >= 3 ) ) return "Annual Premium"
  if ( activity === 3 && drink >= 2 ) return "Family Hydration"
  if ( activity >= 2 && drink >= 3 && smart >= 1 ) return "Family Hydration"
  if ( smart >= 2 || ( drink >= 3 && activity >= 2 ) ) return "Premium Hydration"
  if ( smart === 1 || drink >= 2 || activity >= 2 ) return "Basic Hydration"
  return ""
}

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
  /* Option index 0..3 per question, in order */
  const ordered = quizQuestions.map( ( _, i ) => quizAnswers[ i ] )

  const productId = pickQuizProductId( ordered )
  const membershipPlan = pickMembershipPlan( ordered )

  window.__quizRecommendation = { productId, membershipPlan }

  const meta = QUIZ_PRODUCT_META[ productId ] || QUIZ_PRODUCT_META[ "Ocean Blue" ]

  document.getElementById( 'resultIcon' ).textContent = meta.icon
  document.getElementById( 'resultTitle' ).textContent = meta.headline
  document.getElementById( 'resultDescription' ).textContent = meta.description

  document.getElementById( 'resultBottleName' ).textContent = meta.title
  document.getElementById( 'resultBottlePrice' ).textContent = meta.price

  const memNameEl = document.getElementById( 'resultMembershipName' )
  const memHintEl = document.getElementById( 'resultMembershipHint' )
  if ( membershipPlan )
  {
    memNameEl.textContent = membershipPlan
    memHintEl.textContent = MEMBERSHIP_HINTS[ membershipPlan ] || 'We will pre-select this in the order form—you can change it.'
  } else
  {
    memNameEl.textContent = 'No plan suggested'
    memHintEl.textContent = 'Stay flexible, or add a plan in checkout.'
  }

  const img = document.getElementById( 'resultBottleImg' )
  const fb = document.getElementById( 'resultBottleFallback' )
  if ( meta.image && img && fb )
  {
    img.src = meta.image
    img.alt = meta.imageAlt || meta.title
    img.hidden = false
    fb.hidden = true
  } else if ( img && fb )
  {
    img.hidden = true
    fb.hidden = false
  }

  document.getElementById( 'quizCard' ).style.display = 'none'
  document.getElementById( 'quizResult' ).style.display = 'block'
}

function resetQuiz ()
{
  currentQuestion = 0
  quizAnswers = []
  window.__quizRecommendation = null
  document.getElementById( 'quizCard' ).style.display = 'block'
  document.getElementById( 'quizResult' ).style.display = 'none'
  loadQuestion()
}

// Event listeners
document.getElementById( 'quizNext' )?.addEventListener( 'click', nextQuestion )
document.getElementById( 'quizPrev' )?.addEventListener( 'click', prevQuestion )

document.getElementById( 'quizOrderBtn' )?.addEventListener( 'click', e =>
{
  e.preventDefault()
  const pick = window.__quizRecommendation
  if ( pick && typeof window.openOrderModal === 'function' )
  {
    window.openOrderModal( {
      productId: pick.productId,
      membershipPlan: pick.membershipPlan ?? ''
    } )
  } else if ( typeof window.openOrderModal === 'function' )
  {
    window.openOrderModal( {} )
  }
} )

// Initialize quiz
if ( document.getElementById( 'quizOptions' ) )
{
  loadQuestion()
}
