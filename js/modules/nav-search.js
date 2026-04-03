/**
 * FAQ items, search, buy buttons, smooth nav
 * Loads after: scroll, custom-color-modal
 */

// ========== FAQ TOGGLE ==========
document.querySelectorAll( '.faq-item' ).forEach( item =>
{
  item.addEventListener( 'click', function ()
  {
    this.classList.toggle( 'active' )
  } )
} )

// ========== SEARCH FUNCTIONALITY ==========
const searchInputField = document.getElementById( 'searchInput' )
const searchButton = document.getElementById( 'searchButton' )
const productsContainer = document.querySelector( ".products" )
let allCards = Array.from( document.querySelectorAll( ".card" ) )

function refreshProductSearchCards ()
{
  allCards = Array.from( document.querySelectorAll( ".card" ) )
  if ( productsContainer && allCards.length )
  {
    updateResultCount( allCards.length, allCards.length )
  }
}

document.addEventListener( 'hydro:productsCatalogRendered', refreshProductSearchCards )

const resultCounter = document.createElement( "div" )
resultCounter.className = "result-counter"
if ( productsContainer )
{
  productsContainer.parentNode.insertBefore( resultCounter, productsContainer.nextSibling )
}

function updateResultCount ( visibleCount, totalCount )
{
  if ( resultCounter )
  {
    if ( visibleCount === totalCount )
    {
      resultCounter.textContent = `Showing all ${totalCount} bottles`
    } else
    {
      resultCounter.textContent = `Showing ${visibleCount} of ${totalCount} bottles`
    }
  }
}

function showNoResultsMessage ( searchTerm )
{
  let noResultsMsg = document.querySelector( ".no-results-message" )
  if ( !noResultsMsg && productsContainer )
  {
    noResultsMsg = document.createElement( "div" )
    noResultsMsg.className = "no-results-message"
    productsContainer.parentNode.insertBefore( noResultsMsg, productsContainer.nextSibling )
  }
  if ( noResultsMsg )
  {
    noResultsMsg.innerHTML = `🔍 No bottles found matching "${searchTerm}". Try another search!`
    noResultsMsg.style.display = "block"
  }
}

function hideNoResultsMessage ()
{
  const noResultsMsg = document.querySelector( ".no-results-message" )
  if ( noResultsMsg ) noResultsMsg.style.display = "none"
}

function performSearch ()
{
  if ( !searchInputField ) return

  const searchValue = searchInputField.value.toLowerCase().trim()
  let visibleCount = 0

  if ( searchValue === "" )
  {
    allCards.forEach( card => { card.style.display = "block"; visibleCount++ } )
    updateResultCount( visibleCount, allCards.length )
    hideNoResultsMessage()
    return
  }

  allCards.forEach( card =>
  {
    const text = card.innerText.toLowerCase()
    if ( text.includes( searchValue ) )
    {
      card.style.display = "block"
      visibleCount++
    } else
    {
      card.style.display = "none"
    }
  } )

  updateResultCount( visibleCount, allCards.length )
  if ( visibleCount === 0 ) showNoResultsMessage( searchValue )
  else hideNoResultsMessage()
}

// Attach search button click event
if ( searchButton )
{
  searchButton.addEventListener( 'click', function ( e )
  {
    e.preventDefault()
    performSearch()
  } )
}

// Attach Enter key event
if ( searchInputField )
{
  searchInputField.addEventListener( 'keypress', function ( e )
  {
    if ( e.key === 'Enter' )
    {
      e.preventDefault()
      performSearch()
    }
  } )

  searchInputField.addEventListener( 'input', function ()
  {
    if ( this.value === "" ) performSearch()
  } )
}

if ( productsContainer && allCards.length )
{
  updateResultCount( allCards.length, allCards.length )
}

// ========== BUY BUTTONS ==========
document.getElementById( 'orderNowBtn' )?.addEventListener( 'click', ( e ) =>
{
  const el = e.currentTarget
  if ( el instanceof HTMLAnchorElement )
  {
    const href = el.getAttribute( 'href' ) || ''
    if ( href && !href.startsWith( '#' ) ) return
  }
  e.preventDefault()
  scrollToOrder()
} )

if ( productsContainer )
{
  productsContainer.addEventListener( 'click', function ( e )
  {
    const btn = e.target.closest( '.buy-card-btn' )
    if ( !btn || !productsContainer.contains( btn ) ) return
    e.preventDefault()
    const card = btn.closest( '.card' )
    const sku = card?.dataset?.product
    if ( typeof openOrderModal === 'function' )
    {
      openOrderModal( { productId: sku || '' } )
      return
    }
    scrollToOrder()
  } )
}

// ========== SMOOTH SCROLLING FOR NAVIGATION (same-page #anchors only) ==========
document.querySelectorAll( 'nav a[href^="#"]' ).forEach( anchor =>
{
  anchor.addEventListener( 'click', function ( e )
  {
    const targetId = this.getAttribute( 'href' )
    const targetElement = document.querySelector( targetId )
    if ( !targetElement ) return
    e.preventDefault()
    targetElement.scrollIntoView( { behavior: 'smooth' } )
  } )
} )

