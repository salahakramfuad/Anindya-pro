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

/** Questions reference the same wording shoppers see on cards (750 ml, tracking, self-clean bundle, etc.) */
const quizQuestions = [
  {
    text: 'Size and price—what fits you?',
    options: [
      {
        label: '500 ml compact special edition ($7.99)—small bag, limited runs',
        bump: { 'Arctic White': 6, 'Rose Red': 6 }
      },
      {
        label: '750 ml everyday bottle ($9.99)—main lineup, more colors',
        bump: {
          'Ocean Blue': 5,
          'Energy Green': 5,
          'Galaxy Purple': 5,
          'Classic Steel': 5,
          'Bright Black': 5,
          'Hot Pink': 5
        }
      },
      {
        label: 'Lowest price matters most right now',
        bump: { 'Arctic White': 8, 'Rose Red': 8, 'Ocean Blue': 1, 'Energy Green': 1, 'Galaxy Purple': 1, 'Classic Steel': 1, 'Bright Black': 1, 'Hot Pink': 1 }
      },
      {
        label: 'Not sure—show a balanced pick',
        bump: {
          'Ocean Blue': 2,
          'Energy Green': 2,
          'Galaxy Purple': 2,
          'Classic Steel': 2,
          'Bright Black': 2,
          'Hot Pink': 2,
          'Arctic White': 2,
          'Rose Red': 2
        }
      }
    ]
  },
  {
    text: 'Which capability matches what you want? (from our listings)',
    options: [
      {
        label: 'Smart hydration tracking (app)—like Ocean Blue',
        bump: { 'Ocean Blue': 10 }
      },
      {
        label: 'Temperature display on the bottle—like Energy Green',
        bump: { 'Energy Green': 10 }
      },
      {
        label: 'App reminders + leak-proof lid—like Galaxy Purple',
        bump: { 'Galaxy Purple': 10 }
      },
      {
        label: 'None of that—I just want water, no apps',
        bump: { 'Classic Steel': 7, 'Bright Black': 6, 'Hot Pink': 6, 'Arctic White': 2, 'Rose Red': 2 }
      }
    ]
  },
  {
    text: 'Materials and care—which line sounds like you?',
    options: [
      {
        label: 'BPA-free stainless steel (sporty)—Energy Green style',
        bump: { 'Energy Green': 8 }
      },
      {
        label: 'Dishwasher-safe lid—Hot Pink style',
        bump: { 'Hot Pink': 8 }
      },
      {
        label: 'Self-clean bundle included in the box—Arctic White SE',
        bump: { 'Arctic White': 10 }
      },
      {
        label: 'Matte finish + wide mouth for ice—Classic Steel style',
        bump: { 'Classic Steel': 9 }
      }
    ]
  },
  {
    text: 'Portability and finish for daily use?',
    options: [
      {
        label: 'Carry loop + fingerprint-resistant—Bright Black',
        bump: { 'Bright Black': 10 }
      },
      {
        label: 'Leak-proof for tossing in a gym bag—Galaxy Purple',
        bump: { 'Galaxy Purple': 7 }
      },
      {
        label: 'Bold finish + easy-care lid—Hot Pink',
        bump: { 'Hot Pink': 7 }
      },
      {
        label: 'Simple stainless everyday look—Classic Steel',
        bump: { 'Classic Steel': 6, 'Ocean Blue': 2, 'Energy Green': 2 }
      }
    ]
  },
  {
    text: 'Buying mainly as a gift or for yourself?',
    options: [
      {
        label: 'Gift-ready packaging matters—Rose Red SE',
        bump: { 'Rose Red': 10 }
      },
      {
        label: 'Limited / special colorway—compact SE',
        bump: { 'Arctic White': 5, 'Rose Red': 5 }
      },
      {
        label: 'For myself—daily carry',
        bump: {
          'Ocean Blue': 3,
          'Energy Green': 3,
          'Galaxy Purple': 3,
          'Classic Steel': 3,
          'Bright Black': 3,
          'Hot Pink': 3
        }
      },
      {
        label: 'No strong preference',
        bump: {
          'Ocean Blue': 1,
          'Energy Green': 1,
          'Galaxy Purple': 1,
          'Classic Steel': 1,
          'Bright Black': 1,
          'Hot Pink': 1,
          'Arctic White': 1,
          'Rose Red': 1
        }
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