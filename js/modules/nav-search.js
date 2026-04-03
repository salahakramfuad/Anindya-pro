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
let allCards = Array.from( document.querySelectorAll( "#productsGrid .card" ) )

function isOnProductsCatalogPage ()
{
  return !!document.getElementById( 'productsGrid' )
}

/** Same-folder products page URL with optional query ?q=… and hash to the catalog block */
function hrefToProductsSearch ( rawQuery )
{
  const u = new URL( 'products.html', window.location.href )
  const trimmed = ( rawQuery || '' ).trim()
  if ( trimmed ) u.searchParams.set( 'q', trimmed )
  u.hash = 'product'
  return u.pathname + u.search + u.hash
}

function refreshProductSearchCards ()
{
  allCards = Array.from( document.querySelectorAll( "#productsGrid .card" ) )
  if ( productsContainer && allCards.length )
  {
    updateResultCount( allCards.length, allCards.length )
  }
}

/** After catalog cards exist, run ?q= from URL (shared link or redirect from header search). */
function applySearchQueryFromUrl ()
{
  if ( !isOnProductsCatalogPage() || !searchInputField ) return
  const qParam = new URLSearchParams( window.location.search ).get( 'q' )
  if ( qParam === null ) return
  searchInputField.value = qParam
  performSearch()
}

/* Event is dispatched on window in products-catalog.js — listen on window */
window.addEventListener( 'hydro:productsCatalogRendered', () =>
{
  refreshProductSearchCards()
  applySearchQueryFromUrl()
} )

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
    allCards.forEach( card => { card.style.display = ""; visibleCount++ } )
    updateResultCount( visibleCount, allCards.length )
    hideNoResultsMessage()
    try
    {
      const url = new URL( window.location.href )
      url.searchParams.delete( 'q' )
      window.history.replaceState( {}, '', url.pathname + url.search + window.location.hash )
    } catch ( _ ) { /* ignore */ }
    return
  }

  allCards.forEach( card =>
  {
    const text = card.innerText.toLowerCase()
    if ( text.includes( searchValue ) )
    {
      card.style.display = ""
      visibleCount++
    } else
    {
      card.style.display = "none"
    }
  } )

  updateResultCount( visibleCount, allCards.length )
  if ( visibleCount === 0 ) showNoResultsMessage( searchValue )
  else hideNoResultsMessage()

  if ( isOnProductsCatalogPage() )
  {
    try
    {
      const url = new URL( window.location.href )
      url.searchParams.set( 'q', searchInputField.value.trim() )
      window.history.replaceState( {}, '', url.pathname + url.search + window.location.hash )
    } catch ( _ ) { /* ignore */ }
  }
}

/** From header: always open the products catalog with the current box as ?q= (or all bottles if empty). */
function submitHeaderSearch ()
{
  if ( !searchInputField ) return
  const q = searchInputField.value
  if ( !isOnProductsCatalogPage() )
  {
    window.location.href = hrefToProductsSearch( q )
    return
  }
  refreshProductSearchCards()
  performSearch()
}

// Attach search button click event
if ( searchButton )
{
  searchButton.addEventListener( 'click', function ( e )
  {
    e.preventDefault()
    submitHeaderSearch()
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
      submitHeaderSearch()
    }
  } )

  searchInputField.addEventListener( 'input', function ()
  {
    if ( this.value === "" && isOnProductsCatalogPage() ) performSearch()
  } )
}

/* Catalog may render synchronously (e.g. from storage) before this script runs */
if ( isOnProductsCatalogPage() && document.querySelector( '#productsGrid .card' ) )
{
  refreshProductSearchCards()
  applySearchQueryFromUrl()
} else if ( productsContainer && allCards.length )
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

