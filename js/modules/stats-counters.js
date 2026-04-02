/**
 * Impact stats animation + extra nav links
 */
// ========== FUN FACTS COUNTER (FIXED VERSION) ==========
// Set target numbers
const targets = {
  bottlesSold: 3452,
  happyCustomers: 2987,
  plasticSaved: 92100,
  countries: 5,
  rating: 4.7,
  members: 1056
}

// Function to animate counting
function animateCounter ( element, start, end, duration )
{
  if ( !element ) return

  let startTimestamp = null
  const step = ( timestamp ) =>
  {
    if ( !startTimestamp ) startTimestamp = timestamp
    const progress = Math.min( ( timestamp - startTimestamp ) / duration, 1 )
    let currentValue

    if ( end % 1 !== 0 )
    {
      // For decimal numbers (like rating)
      currentValue = ( progress * ( end - start ) + start ).toFixed( 1 )
    } else
    {
      // For whole numbers
      currentValue = Math.floor( progress * ( end - start ) + start )
    }

    element.textContent = currentValue.toLocaleString()

    if ( progress < 1 )
    {
      window.requestAnimationFrame( step )
    } else
    {
      // Ensure final value is exactly the target
      if ( end % 1 !== 0 )
      {
        element.textContent = end.toFixed( 1 )
      } else
      {
        element.textContent = end.toLocaleString()
      }
    }
  }
  window.requestAnimationFrame( step )
}

// Function to check if element is in viewport
function isElementInViewport ( el )
{
  if ( !el ) return false
  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  return rect.top <= windowHeight - 100 && rect.bottom >= 100
}

// Start all counters immediately (no scroll needed)
function startAllCounters ()
{
  const bottlesElement = document.getElementById( 'bottlesSold' )
  const customersElement = document.getElementById( 'happyCustomers' )
  const plasticElement = document.getElementById( 'plasticSaved' )
  const countriesElement = document.getElementById( 'countries' )
  const ratingElement = document.getElementById( 'rating' )
  const membersElement = document.getElementById( 'members' )

  if ( bottlesElement )
  {
    bottlesElement.textContent = "0"
    animateCounter( bottlesElement, 0, targets.bottlesSold, 2000 )
  }
  if ( customersElement )
  {
    customersElement.textContent = "0"
    animateCounter( customersElement, 0, targets.happyCustomers, 2000 )
  }
  if ( plasticElement )
  {
    plasticElement.textContent = "0"
    animateCounter( plasticElement, 0, targets.plasticSaved, 2000 )
  }
  if ( countriesElement )
  {
    countriesElement.textContent = "0"
    animateCounter( countriesElement, 0, targets.countries, 1500 )
  }
  if ( ratingElement )
  {
    ratingElement.textContent = "0"
    animateCounter( ratingElement, 0, targets.rating, 1500 )
  }
  if ( membersElement )
  {
    membersElement.textContent = "0"
    animateCounter( membersElement, 0, targets.members, 2000 )
  }
}

// Start counters immediately when page loads
if ( document.readyState === 'loading' )
{
  document.addEventListener( 'DOMContentLoaded', function ()
  {
    setTimeout( startAllCounters, 500 )
  } )
} else
{
  setTimeout( startAllCounters, 500 )
}

// Also start when facts section comes into view (as backup)
let countersStarted = false

function startCountersOnView ()
{
  if ( countersStarted ) return

  const factsSection = document.querySelector( '.facts-section' )
  if ( factsSection && isElementInViewport( factsSection ) )
  {
    countersStarted = true
    startAllCounters()
  }
}

window.addEventListener( 'scroll', startCountersOnView )
window.addEventListener( 'load', startCountersOnView )

// ========== ADD REVIEWS AND FACTS TO NAVIGATION ==========
// Add Reviews and Facts links to navigation
const navList = document.querySelector( 'nav ul' )
if ( navList && !document.querySelector( 'a[href="#reviews"]' ) )
{
  const reviewsLi = document.createElement( 'li' )
  reviewsLi.innerHTML = '<a href="#reviews">Reviews</a>'
  const factsLi = document.createElement( 'li' )
  factsLi.innerHTML = '<a href="#facts">Impact</a>'

  // Insert before the last item or at appropriate position
  const orderLi = document.querySelector( 'a[href="#order"]' )?.closest( 'li' )
  if ( orderLi )
  {
    orderLi.insertAdjacentElement( 'afterend', reviewsLi )
    reviewsLi.insertAdjacentElement( 'afterend', factsLi )
  } else
  {
    navList.appendChild( reviewsLi )
    navList.appendChild( factsLi )
  }
}

// Smooth scroll for new navigation links
document.querySelectorAll( 'a[href="#reviews"], a[href="#facts"]' ).forEach( anchor =>
{
  anchor.addEventListener( 'click', function ( e )
  {
    e.preventDefault()
    const targetId = this.getAttribute( 'href' )
    const targetElement = document.querySelector( targetId )
    if ( targetElement )
    {
      targetElement.scrollIntoView( { behavior: 'smooth' } )
    }
  } )
} )

