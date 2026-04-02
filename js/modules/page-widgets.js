/**
 * Filters, calculators, share, stock badges, delivery, gift, keyboard
 */
// ========== FAQ ACCORDION ==========
document.querySelectorAll( '.accordion-question' ).forEach( question =>
{
  question.addEventListener( 'click', () =>
  {
    const item = question.parentElement
    item.classList.toggle( 'active' )
  } )
} )

// ========== PRODUCT FILTER ==========
const filterBtns = document.querySelectorAll( '.filter-btn' )

filterBtns.forEach( btn =>
{
  btn.addEventListener( 'click', () =>
  {
    filterBtns.forEach( b => b.classList.remove( 'active' ) )
    btn.classList.add( 'active' )

    const filter = btn.dataset.filter
    const productCards = document.querySelectorAll( '.products .card' )

    productCards.forEach( card =>
    {
      const price = card.querySelector( 'p' )?.innerText || ''
      if ( filter === 'all' )
      {
        card.style.display = 'block'
      } else if ( filter === 'standard' && price === '$9.99' )
      {
        card.style.display = 'block'
      } else if ( filter === 'special' && price === '$7.99' )
      {
        card.style.display = 'block'
      } else
      {
        card.style.display = 'none'
      }
    } )
  } )
} )

// ========== SHIPPING CALCULATOR ==========
document.getElementById( 'calculateShipping' )?.addEventListener( 'click', () =>
{
  const countryEl = document.getElementById( 'shippingCountry' )
  const typeEl = document.getElementById( 'shippingType' )
  const resultDiv = document.getElementById( 'shippingResult' )
  const costEl = document.getElementById( 'shippingCost' )
  const timeEl = document.getElementById( 'deliveryTime' )
  if ( !countryEl || !typeEl || !resultDiv || !costEl || !timeEl ) return

  const country = countryEl.value
  const type = typeEl.value

  if ( !country || !type )
  {
    alert( 'Please select both country and shipping type' )
    return
  }

  let cost = 0
  let time = ''

  if ( type === 'standard' )
  {
    cost = country === 'us' ? 4.99 : country === 'bd' ? 2.99 : 9.99
    time = '3-5 business days'
  } else
  {
    cost = country === 'us' ? 9.99 : country === 'bd' ? 5.99 : 14.99
    time = '1-2 business days'
  }

  if ( country === 'bd' ) cost = 0

  costEl.textContent = `$${cost.toFixed( 2 )}`
  timeEl.textContent = time
  resultDiv.classList.add( 'show' )
} )

// ========== HYDRATION CALCULATOR ==========
document.getElementById( 'calculateHydration' )?.addEventListener( 'click', () =>
{
  const age = parseInt( document.getElementById( 'age' )?.value, 10 )
  const weight = parseInt( document.getElementById( 'weight' )?.value, 10 )
  const activity = document.getElementById( 'activity' )?.value

  if ( Number.isNaN( age ) || Number.isNaN( weight ) || age < 1 || weight < 1 )
  {
    alert( 'Please enter valid age and weight' )
    return
  }

  let water = weight * 30

  if ( activity === 'moderate' ) water += 300
  if ( activity === 'active' ) water += 600
  if ( age > 65 ) water -= 200

  document.getElementById( 'waterAmount' ).textContent = water
  document.getElementById( 'hydrationResult' ).style.display = 'block'
} )

// ========== COLOR PREVIEW GALLERY ==========
const colorSwatches = document.querySelectorAll( '.color-swatch' )
const previewCircle = document.querySelector( '.color-preview-circle' )
const previewText = document.querySelector( '.color-preview-large p' )

colorSwatches.forEach( swatch =>
{
  swatch.addEventListener( 'click', () =>
  {
    colorSwatches.forEach( s => s.classList.remove( 'selected' ) )
    swatch.classList.add( 'selected' )
    if ( previewCircle ) previewCircle.style.background = swatch.style.background
    if ( previewText && swatch.dataset.color ) previewText.textContent = swatch.dataset.color
  } )
} )

// ========== SHARE FUNCTIONS ==========
function shareOnWhatsApp ()
{
  window.open( `https://wa.me/?text=Check out HydroSmart! The smartest water bottle ever created! ${window.location.href}`, '_blank' )
}

function shareOnFacebook ()
{
  window.open( `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank' )
}

function shareOnTwitter ()
{
  window.open( `https://twitter.com/intent/tweet?text=Check out HydroSmart! The smartest water bottle ever created!&url=${window.location.href}`, '_blank' )
}

function copyLink ()
{
  const url = window.location.href
  if ( navigator.clipboard?.writeText )
  {
    navigator.clipboard.writeText( url ).then( () =>
    {
      alert( 'Link copied to clipboard! 📋' )
    } ).catch( () =>
    {
      window.prompt( 'Copy this link:', url )
    } )
  } else
  {
    window.prompt( 'Copy this link:', url )
  }
}

// ========== STOCK BADGES (Add to product cards) ==========
document.querySelectorAll( '.card' ).forEach( ( card, index ) =>
{
  const badge = document.createElement( 'div' )
  if ( index < 5 )
  {
    badge.className = 'stock-badge in-stock'
    badge.textContent = '✓ In Stock'
  } else
  {
    badge.className = 'stock-badge limited'
    badge.textContent = '⚠️ Limited Stock'
  }
  card.appendChild( badge )
} )

// Back-in-stock signup (must run after stock badges exist)
document.querySelectorAll( '.card' ).forEach( card =>
{
  const stockBadge = card.querySelector( '.stock-badge.limited' )
  if ( !stockBadge ) return

  const alertDiv = document.createElement( 'div' )
  alertDiv.className = 'back-in-stock'
  const emailInput = document.createElement( 'input' )
  emailInput.type = 'email'
  emailInput.placeholder = 'Email when back in stock'
  emailInput.setAttribute( 'aria-label', 'Email for back in stock alerts' )
  const notifyBtn = document.createElement( 'button' )
  notifyBtn.type = 'button'
  notifyBtn.className = 'buyBtn'
  notifyBtn.style.padding = '5px'
  notifyBtn.style.fontSize = '12px'
  notifyBtn.style.marginTop = '5px'
  notifyBtn.textContent = 'Notify Me'
  notifyBtn.addEventListener( 'click', () =>
  {
    if ( !emailInput.value.trim() )
    {
      alert( 'Please enter your email.' )
      emailInput.focus()
      return
    }
    alert( '✅ We will email you when this bottle is back in stock!' )
  } )
  alertDiv.appendChild( emailInput )
  alertDiv.appendChild( notifyBtn )
  card.appendChild( alertDiv )
} )

// ========== ESTIMATED DELIVERY (FIXED - Shows below order form) ==========
function updateDeliveryEstimate ()
{
  let existingDiv = document.querySelector( '.delivery-estimate' )

  // Get selected shipping type if available
  const shippingType = document.getElementById( 'shippingType' )?.value || 'standard'

  // Calculate delivery days based on shipping type
  let deliveryDays = 5 // default standard
  if ( shippingType === 'express' )
  {
    deliveryDays = 2
  } else if ( shippingType === 'standard' )
  {
    deliveryDays = 5
  }

  // Calculate delivery date
  const today = new Date()
  const deliveryDate = new Date( today )
  deliveryDate.setDate( today.getDate() + deliveryDays )

  // Format date
  const formattedDate = deliveryDate.toLocaleDateString( 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  } )

  // Update or create delivery div
  if ( existingDiv )
  {
    existingDiv.innerHTML = `📦 Estimated Delivery: ${formattedDate} (${deliveryDays} business days)`
  } else
  {
    const orderSection = document.querySelector( '.order form' )
    if ( orderSection )
    {
      const deliveryDiv = document.createElement( 'div' )
      deliveryDiv.className = 'delivery-estimate'
      deliveryDiv.innerHTML = `📦 Estimated Delivery: ${formattedDate} (${deliveryDays} business days)`
      orderSection.appendChild( deliveryDiv )
    }
  }
}

// Call function when page loads
document.addEventListener( 'DOMContentLoaded', function ()
{
  updateDeliveryEstimate()

  // Update delivery estimate when shipping type changes
  const shippingTypeSelect = document.getElementById( 'shippingType' )
  if ( shippingTypeSelect )
  {
    shippingTypeSelect.addEventListener( 'change', updateDeliveryEstimate )
  }
} )

// Also add delivery estimate to the order summary
const style = document.createElement( 'style' )
style.textContent = `
    .delivery-estimate {
  margin-top: 15px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(34, 197, 94, 0.1));
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  animation: fadeIn 0.5s ease;
    }
`
document.head.appendChild( style )

// ========== GIFT MESSAGE OPTION (FIXED) ==========
const orderFormElement2 = document.getElementById( 'orderForm' )
if ( orderFormElement2 )
{
  // Check if gift option already exists to avoid duplicate
  if ( !document.querySelector( '.gift-option' ) )
  {
    const giftDiv = document.createElement( 'div' )
    giftDiv.className = 'gift-option'
    giftDiv.innerHTML = `
      <label class="gift-checkbox">
          <input type="checkbox" id="giftCheckbox"> 🎁 This is a gift (+$2)
      </label>
      <textarea id="giftMessage" class="gift-message-input" placeholder="Enter your gift message..." rows="3"></textarea>
  `

    // Insert before the submit button
    const submitBtn = orderFormElement2.querySelector( 'button[type="submit"]' )
    if ( submitBtn )
    {
      orderFormElement2.insertBefore( giftDiv, submitBtn )
    } else
    {
      orderFormElement2.appendChild( giftDiv )
    }

    // Add event listener for checkbox
    const giftCheckbox = document.getElementById( 'giftCheckbox' )
    const giftMessage = document.getElementById( 'giftMessage' )

    if ( giftCheckbox && giftMessage )
    {
      giftCheckbox.addEventListener( 'change', function ()
      {
        if ( this.checked )
        {
          giftMessage.classList.add( 'show' )
        } else
        {
          giftMessage.classList.remove( 'show' )
        }
      } )
    }
  }
}

// ========== KEYBOARD SHORTCUTS (FIXED - No interference with typing) ==========
const shortcutsBtn = document.getElementById( 'shortcutsBtn' )
const shortcutsPopup = document.getElementById( 'shortcutsPopup' )

if ( shortcutsBtn && shortcutsPopup )
{
  shortcutsBtn.addEventListener( 'click', ( ev ) =>
  {
    ev.stopPropagation()
    shortcutsPopup.classList.toggle( 'show' )
  } )
}

// Close popup when clicking outside
document.addEventListener( 'click', ( e ) =>
{
  if ( shortcutsPopup && shortcutsBtn )
  {
    if ( !shortcutsPopup.contains( e.target ) && !shortcutsBtn.contains( e.target ) )
    {
      shortcutsPopup.classList.remove( 'show' )
    }
  }
} )

// Keyboard shortcuts - ONLY work when NOT typing in input/textarea
document.addEventListener( 'keydown', ( e ) =>
{
  // Check if user is typing in an input, textarea, or select
  const activeElement = document.activeElement
  const isTyping = activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.tagName === 'SELECT'

  // If typing, do nothing (let normal typing happen)
  if ( isTyping )
  {
    return
  }

  // Only trigger shortcuts when NOT typing
  if ( e.key === 's' || e.key === 'S' )
  {
    e.preventDefault()
    const searchInput = document.getElementById( 'searchInput' )
    if ( searchInput ) searchInput.focus()
  }
  else if ( e.key === 'h' || e.key === 'H' )
  {
    e.preventDefault()
    const homeEl = document.getElementById( 'home' )
    if ( homeEl ) homeEl.scrollIntoView( { behavior: 'smooth' } )
    else window.location.href = 'index.html#home'
  }
  else if ( e.key === 'o' || e.key === 'O' )
  {
    e.preventDefault()
    if ( typeof scrollToOrder === 'function' ) scrollToOrder()
  }
  else if ( ( e.key === '?' || e.key === '/' ) && shortcutsPopup )
  {
    e.preventDefault()
    shortcutsPopup.classList.toggle( 'show' )
  }
  else if ( e.key === 'Escape' && shortcutsPopup )
  {
    shortcutsPopup.classList.remove( 'show' )
  }
} )

