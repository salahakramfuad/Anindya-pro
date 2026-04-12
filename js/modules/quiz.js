/**
 * Bottle matcher — scoring ties each answer to real catalog copy (capacity, tech, materials).
 * Loads on products.html after catalog defines window.__productsCatalogData (optional for tie-break).
 */
const QUIZ_CATALOG_ORDER = [
  'Ocean Blue',
  'Energy Green',
  'Galaxy Purple',
  'Classic Steel',
  'Bright Black',
  'Hot Pink',
  'Arctic White',
  'Rose Red'
]

/** Enhanced personality-based bottle matcher with lifestyle scenarios */
const quizQuestions = [
  {
    text: '🌅 Your perfect morning starts with...',
    options: [
      {
        label: '⚡ High-intensity workout - need hydration that keeps up',
        bump: { 'Energy Green': 10, 'Ocean Blue': 5 }
      },
      {
        label: '☕ Slow coffee ritual - elegance matters',
        bump: { 'Classic Steel': 8, 'Rose Red': 6 }
      },
      {
        label: '🧘‍♀️ Meditation & yoga - peaceful vibes only',
        bump: { 'Galaxy Purple': 9, 'Arctic White': 5 }
      },
      {
        label: '🚀 Rush hour warrior - grab and go!',
        bump: { 'Bright Black': 10, 'Hot Pink': 4 }
      }
    ]
  },
  {
    text: '💼 Your work style is...',
    options: [
      {
        label: '🏢 Corporate professional - sleek & discreet',
        bump: { 'Classic Steel': 10, 'Bright Black': 7 }
      },
      {
        label: '🎨 Creative freelancer - bold & expressive',
        bump: { 'Hot Pink': 10, 'Galaxy Purple': 6 }
      },
      {
        label: '👨‍💻 Tech innovator - smart & connected',
        bump: { 'Ocean Blue': 10, 'Energy Green': 5 }
      },
      {
        label: '🌿 Outdoor adventurer - rugged & ready',
        bump: { 'Energy Green': 9, 'Classic Steel': 4 }
      }
    ]
  },
  {
    text: '🎉 Weekend personality check...',
    options: [
      {
        label: '🏃‍♀️ Adventure seeker - hiking, biking, exploring',
        bump: { 'Energy Green': 10, 'Classic Steel': 6 }
      },
      {
        label: '📚 Cozy homebody - books, Netflix, comfort',
        bump: { 'Arctic White': 9, 'Rose Red': 5 }
      },
      {
        label: '🎉 Social butterfly - parties, events, people',
        bump: { 'Hot Pink': 10, 'Bright Black': 4 }
      },
      {
        label: '✨ Self-care Sunday - spa, wellness, me-time',
        bump: { 'Galaxy Purple': 9, 'Rose Red': 6 }
      }
    ]
  },
  {
    text: '📱 Your tech philosophy...',
    options: [
      {
        label: '🚀 Early adopter - love smart features & apps',
        bump: { 'Ocean Blue': 10, 'Energy Green': 6 }
      },
      {
        label: '🔋 Battery life obsessed - practical over flashy',
        bump: { 'Classic Steel': 8, 'Energy Green': 7 }
      },
      {
        label: '📸 Instagram ready - aesthetics are everything',
        bump: { 'Hot Pink': 10, 'Galaxy Purple': 8, 'Rose Red': 6 }
      },
      {
        label: '🚫 Tech-minimalist - just want it to work',
        bump: { 'Arctic White': 9, 'Classic Steel': 5 }
      }
    ]
  },
  {
    text: '🎁 This bottle is for...',
    options: [
      {
        label: '🎯 Me - daily hydration upgrade',
        bump: {
          'Ocean Blue': 3,
          'Energy Green': 3,
          'Classic Steel': 3,
          'Bright Black': 3,
          'Hot Pink': 3,
          'Galaxy Purple': 3
        }
      },
      {
        label: '🎁 Special gift - wow factor required',
        bump: { 'Rose Red': 10, 'Galaxy Purple': 8, 'Arctic White': 6 }
      },
      {
        label: '🏆 Achievement reward - earned this!',
        bump: { 'Bright Black': 8, 'Classic Steel': 6, 'Energy Green': 5 }
      },
      {
        label: '💕 Couple matching - his & hers vibes',
        bump: { 'Rose Red': 7, 'Arctic White': 5, 'Hot Pink': 4 }
      }
    ]
  }
]

function catalogQuizProduct ( id )
{
  return window.__productsCatalogData?.products?.find( p => p.id === id )
}

function emptyScores ()
{
  const scores = {}
  QUIZ_CATALOG_ORDER.forEach( id => { scores[ id ] = 0 } )
  return scores
}

function applyBumps ( scores, bump )
{
  if ( !bump ) return
  for ( const [ id, w ] of Object.entries( bump ) )
  {
    if ( typeof scores[ id ] === 'number' ) scores[ id ] += w
  }
}

function totalScoresForAnswers ( answers )
{
  const scores = emptyScores()
  answers.forEach( ( optIdx, qi ) =>
  {
    const opt = quizQuestions[ qi ]?.options?.[ optIdx ]
    if ( opt ) applyBumps( scores, opt.bump )
  } )
  return scores
}

function pickTopProductId ( scores )
{
  let bestId = QUIZ_CATALOG_ORDER[ 0 ]
  let best = scores[ bestId ] ?? -1
  for ( const id of QUIZ_CATALOG_ORDER )
  {
    const s = scores[ id ] ?? 0
    if ( s > best )
    {
      best = s
      bestId = id
      continue
    }
    if ( s === best )
    {
      const popNew = !!catalogQuizProduct( id )?.popular
      const popOld = !!catalogQuizProduct( bestId )?.popular
      if ( popNew && !popOld ) bestId = id
    }
  }
  return bestId
}

function pickMembershipPlanFromAnswers ( answers )
{
  const tech = answers[ 1 ]
  const gift = answers[ 4 ]
  if ( tech === 0 || tech === 2 ) return 'Premium Hydration'
  if ( tech === 1 ) return 'Basic Hydration'
  if ( tech === 3 && gift === 0 ) return 'Basic Hydration'
  return ''
}

const QUIZ_ICONS = {
  'Ocean Blue': '💧',
  'Energy Green': '🌿',
  'Galaxy Purple': '✨',
  'Classic Steel': '🥤',
  'Bright Black': '⬛',
  'Hot Pink': '🩷',
  'Arctic White': '❄️',
  'Rose Red': '🌹'
}

let currentQuestion = 0
let quizAnswers = []

function loadQuestion ()
{
  const q = quizQuestions[ currentQuestion ]
  document.getElementById( 'quizQuestion' ).textContent =
    `Question ${currentQuestion + 1}/${quizQuestions.length}`
  document.getElementById( 'quizText' ).textContent = q.text

  const optionsDiv = document.getElementById( 'quizOptions' )
  optionsDiv.innerHTML = ''
  q.options.forEach( ( option, idx ) =>
  {
    const optionDiv = document.createElement( 'div' )
    optionDiv.className = 'quiz-option'
    if ( quizAnswers[ currentQuestion ] === idx ) optionDiv.classList.add( 'selected' )
    optionDiv.textContent = option.label
    optionDiv.onclick = () => selectOption( idx )
    optionsDiv.appendChild( optionDiv )
  } )

  const progress = ( ( currentQuestion + 1 ) / quizQuestions.length ) * 100
  document.getElementById( 'quizProgressBar' ).style.width = `${progress}%`

  document.getElementById( 'quizPrev' ).style.display = currentQuestion === 0 ? 'none' : 'inline-block'
  document.getElementById( 'quizNext' ).textContent =
    currentQuestion === quizQuestions.length - 1 ? 'See match →' : 'Next ▶'
}

function selectOption ( optionIndex )
{
  // Add haptic feedback simulation (visual pulse)
  const options = document.querySelectorAll( '.quiz-option' )
  options.forEach( ( opt, idx ) =>
  {
    opt.classList.remove( 'selected' )
    if ( idx === optionIndex )
    {
      opt.classList.add( 'selected' )
      // Add pulse animation
      opt.style.animation = 'none'
      setTimeout( () => {
        opt.style.animation = 'pulse 0.3s ease-out'
      }, 10 )
    }
  } )

  quizAnswers[ currentQuestion ] = optionIndex

  // Auto-advance after selection for better UX
  setTimeout( () => {
    if ( currentQuestion < quizQuestions.length - 1 )
    {
      nextQuestion()
    }
  }, 800 )
}

function nextQuestion ()
{
  if ( quizAnswers[ currentQuestion ] === undefined )
  {
    alert( 'Please choose an answer.' )
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
  const ordered = quizQuestions.map( ( _, i ) => quizAnswers[ i ] )
  const scores = totalScoresForAnswers( ordered )
  const productId = pickTopProductId( scores )
  const membershipPlan = pickMembershipPlanFromAnswers( ordered )

  window.__quizRecommendation = { productId, membershipPlan }

  const catalog = catalogQuizProduct( productId )
  const title = catalog?.title || productId
  const price = catalog?.price || ''
  const bullets = catalog?.items?.length
    ? `What's on the card: ${catalog.items.join( ' · ' )}.`
    : ''

  document.getElementById( 'resultIcon' ).textContent = QUIZ_ICONS[ productId ] || '🏆'
  document.getElementById( 'resultTitle' ).textContent = `Your match: ${title}`

  const lead = catalog
    ? 'We weighed your answers against each bottle’s real features (capacity, tech, materials, and finish).'
    : 'Here is the closest match from our catalog.'
  document.getElementById( 'resultDescription' ).textContent =
    `${lead} Best overall fit right now: ${title}${price ? ` (${price})` : ''}.`

  const lineEl = document.getElementById( 'resultCatalogLine' )
  if ( lineEl ) lineEl.textContent = bullets

  const memEl = document.getElementById( 'resultMembershipLine' )
  if ( memEl )
  {
    memEl.textContent = membershipPlan
      ? `Optional membership at checkout: ${membershipPlan} (you can change or clear it).`
      : ''
  }

  const img = document.getElementById( 'resultBottleImg' )
  const fb = document.getElementById( 'resultBottleFallback' )
  if ( catalog?.image && img && fb )
  {
    img.src = catalog.image
    img.alt = catalog.imageAlt || title
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
  const lineEl = document.getElementById( 'resultCatalogLine' )
  const memEl = document.getElementById( 'resultMembershipLine' )
  if ( lineEl ) lineEl.textContent = ''
  if ( memEl ) memEl.textContent = ''
  document.getElementById( 'quizCard' ).style.display = 'block'
  document.getElementById( 'quizResult' ).style.display = 'none'
  loadQuestion()
}

window.resetQuiz = resetQuiz

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

if ( document.getElementById( 'quizOptions' ) )
{
  loadQuestion()
}