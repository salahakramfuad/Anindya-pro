/**
 * Visitor counter, wishlist, viewers, parallax, compare bottles
 */
// ========== 1. LIVE VISITOR COUNTER ==========
let visitorCount = Math.floor( Math.random() * 50 ) + 100
const visitorElement = document.getElementById( 'visitorCount' )
if ( visitorElement )
{
  visitorElement.textContent = visitorCount
  setInterval( () =>
  {
    const change = Math.floor( Math.random() * 5 ) - 2
    visitorCount = Math.max( 50, visitorCount + change )
    visitorElement.textContent = visitorCount
  }, 10000 )
}

// ========== 3. DAILY HYDRATION FACT ==========
const facts = [
  "💧 Your brain is 73% water! Stay hydrated for better focus.",
  "💧 Drinking water boosts your metabolism by 24-30% for 1.5 hours!",
  "💧 Water helps you study better - dehydration reduces concentration by 14%.",
  "💧 Drinking cold water can help you burn 8 extra calories per glass!",
  "💧 Water makes up 60% of your body weight.",
  "💧 You should drink water before feeling thirsty - thirst means you're already dehydrated!",
  "💧 Water helps carry oxygen to your brain cells.",
  "💧 Drinking water before meals can help with weight management."
]

let lastFactIndex = -1
function refreshFact ()
{
  const factText = document.getElementById( 'factText' )
  if ( !factText || facts.length === 0 ) return
  let i = Math.floor( Math.random() * facts.length )
  if ( facts.length > 1 )
  {
    while ( i === lastFactIndex ) i = Math.floor( Math.random() * facts.length )
  }
  lastFactIndex = i
  factText.textContent = facts[ i ]
}
refreshFact()

// ========== PRINTABLE SIZE CHART (FIXED) ==========
function printSizeChart ()
{
  const chartHTML = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>HydroSmart Size Chart</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              padding: 40px;
              background: white;
              color: black;
          }
          h1 {
              color: #38bdf8;
              text-align: center;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 30px;
          }
          th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: center;
          }
          th {
              background: #38bdf8;
              color: white;
          }
          .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
          }
      </style>
  </head>
  <body>
      <h1>💧 HydroSmart Bottle Size Guide</h1>
      <table>
          <thead>
              <tr><th>Size</th><th>Capacity</th><th>Height</th><th>Diameter</th><th>Best For</th><th>Price</th></tr>
          </thead>
          <tbody>
              <tr><td>Small</td><td>500ml</td><td>20cm</td><td>6.5cm</td><td>Kids, Light hydration</td><td>$7.99</td></tr>
              <tr style="background:#f0f9ff;"><td>Medium (Most Popular)</td><td>750ml</td><td>25cm</td><td>7cm</td><td>Daily use, Students</td><td>$9.99</td></tr>
              <tr><td>Large</td><td>1000ml</td><td>30cm</td><td>7.5cm</td><td>Athletes, Heavy drinkers</td><td>$12.99</td></tr>
          </tbody>
      </table>
      <div class="footer">
          <p>📧 Visit: www.hydrosmart.com | 📞 Call: +880 1234 567890</p>
          <p>© 2026 HydroSmart - Smart Hydration Solutions</p>
      </div>
      <script>window.print();<\/script>
  </body>
  </html>
    `

  const printWindow = window.open( '', '_blank' )
  if ( !printWindow )
  {
    showMessage( 'Please allow pop-ups to print the size chart.', 'error' )
    return
  }
  printWindow.document.write( chartHTML )
  printWindow.document.close()
}
// ========== 5. SAVE FOR LATER (WISHLIST) ==========
let wishlist = []
try
{
  wishlist = JSON.parse( localStorage.getItem( 'wishlist' ) || '[]' ) || []
  if ( !Array.isArray( wishlist ) ) wishlist = []
} catch ( _ )
{
  wishlist = []
}
function updateWishlistCount ()
{
  const countEl = document.getElementById( 'wishlistCount' )
  if ( countEl ) countEl.textContent = wishlist.length
}
updateWishlistCount()

function showWishlistPopup ( message )
{
  const popup = document.createElement( 'div' )
  popup.className = 'wishlist-popup'
  popup.textContent = message
  document.body.appendChild( popup )
  setTimeout( () => popup.remove(), 2000 )
}

// ========== 19. 3D BOTTLE VIEWER ==========
function open3DViewer ()
{
  const v = document.getElementById( 'bottleViewer' )
  if ( v ) v.style.display = 'flex'
}
function closeViewer ()
{
  const v = document.getElementById( 'bottleViewer' )
  if ( v ) v.style.display = 'none'
}
// ========== 31. ANIMATED WATER FILL ==========
document.querySelectorAll( '.water-fill' ).forEach( fill =>
{
  fill.addEventListener( 'click', function ()
  {
    const level = this.querySelector( '.water-level' )
    const currentHeight = parseInt( level.style.height ) || 60
    const newHeight = currentHeight === 60 ? 90 : 60
    level.style.height = `${newHeight}%`
  } )
} )

// ========== 33. 360° VIEWER (FIXED) ==========
let currentAngle = 0
let rotationInterval = null

function openRotateViewer ()
{
  const viewer = document.getElementById( 'rotateViewer' )
  if ( viewer ) viewer.style.display = 'flex'
  currentAngle = 0
  const img = document.getElementById( 'rotateImg' )
  if ( img ) img.style.transform = 'rotateY(0deg)'
}

function closeRotateViewer ()
{
  const viewer = document.getElementById( 'rotateViewer' )
  if ( viewer ) viewer.style.display = 'none'
  if ( rotationInterval ) clearInterval( rotationInterval )
}

function rotateLeft ()
{
  currentAngle -= 15
  const img = document.getElementById( 'rotateImg' )
  if ( img ) img.style.transform = `rotateY(${currentAngle}deg)`
}

function rotateRight ()
{
  currentAngle += 15
  const img = document.getElementById( 'rotateImg' )
  if ( img ) img.style.transform = `rotateY(${currentAngle}deg)`
}

// Auto-rotate feature
function startAutoRotate ()
{
  if ( rotationInterval ) clearInterval( rotationInterval )
  rotationInterval = setInterval( () =>
  {
    currentAngle += 5
    const img = document.getElementById( 'rotateImg' )
    if ( img ) img.style.transform = `rotateY(${currentAngle}deg)`
  }, 50 )
}

function stopAutoRotate ()
{
  if ( rotationInterval ) clearInterval( rotationInterval )
}
// ========== 34. PARALLAX SCROLL ==========
let parallaxFrame = null
window.addEventListener( 'scroll', () =>
{
  if ( parallaxFrame ) return
  parallaxFrame = requestAnimationFrame( () =>
  {
    parallaxFrame = null
    const scrolled = window.pageYOffset
    const hero = document.querySelector( '.heroImage img' )
    if ( hero ) hero.style.transform = `translateY(${scrolled * 0.25}px)`
  } )
}, { passive: true } )

// ========== 41. COMPARE BOTTLES (unified catalog cards) ==========
const MAX_COMPARE = 3
let selectedProductIds = []

function findProductCard ( productId )
{
  for ( const el of document.querySelectorAll( '.card[data-product]' ) )
  {
    if ( el.getAttribute( 'data-product' ) === productId ) return el
  }
  return null
}

function displayNameForCard ( card )
{
  return card?.querySelector( 'h3' )?.textContent?.trim() || ''
}

function specForProductId ( productId )
{
  const card = findProductCard( productId )
  if ( !card ) return null
  const tier = card.dataset.tier === 'special' ? 'special' : 'standard'
  const priceEl = card.querySelector( 'p' )
  const price = priceEl?.textContent?.trim() || '—'
  if ( tier === 'special' )
  {
    return {
      title: displayNameForCard( card ),
      price,
      edition: 'Special edition',
      capacity: '500 ml (compact)',
      smart: 'Yes',
      selfClean: 'Included in SE bundle',
      tempDisplay: 'Yes',
      warranty: '3 months'
    }
  }
  return {
    title: displayNameForCard( card ),
    price,
    edition: 'Standard',
    capacity: '750 ml',
    smart: 'Yes',
    selfClean: 'Optional add-on (+$7)',
    tempDisplay: 'Yes',
    warranty: '6 months'
  }
}

const COMPARE_ROWS = [
  { key: 'price', label: 'Price' },
  { key: 'edition', label: 'Line' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'smart', label: 'Smart features' },
  { key: 'selfClean', label: 'UV self-cleaning' },
  { key: 'tempDisplay', label: 'Temperature display' },
  { key: 'warranty', label: 'Warranty' }
]

function syncCompareChrome ()
{
  const statusEl = document.getElementById( 'compareStatus' )
  const clearBtn = document.getElementById( 'compareClearBtn' )
  const emptyEl = document.getElementById( 'compareEmpty' )
  const tableWrap = document.getElementById( 'compareTable' )
  const n = selectedProductIds.length

  if ( clearBtn ) clearBtn.hidden = n === 0
  if ( emptyEl ) emptyEl.hidden = n > 0
  if ( tableWrap )
  {
    tableWrap.hidden = n === 0
    if ( n === 0 ) tableWrap.textContent = ''
  }

  if ( statusEl )
  {
    if ( n === 0 )
    {
      statusEl.textContent = 'Select up to 3 bottles using Compare on each card.'
    } else
    {
      const labels = selectedProductIds.map( id => specForProductId( id )?.title || id )
      statusEl.textContent =
        `Comparing ${n} of ${MAX_COMPARE}: ${labels.join( ', ' )}.`
    }
  }

  document.querySelectorAll( '.card-compare-toggle' ).forEach( btn =>
  {
    const card = btn.closest( '.card' )
    const id = card?.dataset?.product
    if ( !id ) return
    const on = selectedProductIds.includes( id )
    const name = displayNameForCard( card ) || id
    btn.setAttribute( 'aria-pressed', on ? 'true' : 'false' )
    btn.textContent = on ? 'In compare' : 'Compare'
    btn.setAttribute( 'aria-label', on ? `Remove ${name} from compare` : `Add ${name} to compare` )
  } )

  document.querySelectorAll( '.card' ).forEach( card =>
  {
    const id = card.dataset?.product
    if ( id && selectedProductIds.includes( id ) ) card.classList.add( 'card--compare-selected' )
    else card.classList.remove( 'card--compare-selected' )
  } )
}

function updateCompareTable ()
{
  const tableWrap = document.getElementById( 'compareTable' )
  if ( !tableWrap || selectedProductIds.length === 0 ) return

  tableWrap.textContent = ''
  const table = document.createElement( 'table' )
  table.className = 'compare-spec-table'

  const thead = document.createElement( 'thead' )
  const headTr = document.createElement( 'tr' )
  const corner = document.createElement( 'th' )
  corner.textContent = 'Feature'
  corner.scope = 'col'
  headTr.appendChild( corner )
  selectedProductIds.forEach( id =>
  {
    const th = document.createElement( 'th' )
    th.scope = 'col'
    const spec = specForProductId( id )
    th.textContent = spec?.title || id
    headTr.appendChild( th )
  } )
  thead.appendChild( headTr )

  const tbody = document.createElement( 'tbody' )
  COMPARE_ROWS.forEach( row =>
  {
    const tr = document.createElement( 'tr' )
    const th = document.createElement( 'th' )
    th.scope = 'row'
    th.textContent = row.label
    tr.appendChild( th )

    selectedProductIds.forEach( id =>
    {
      const td = document.createElement( 'td' )
      const spec = specForProductId( id )
      td.textContent = spec ? spec[ row.key ] : '—'
      tr.appendChild( td )
    } )
    tbody.appendChild( tr )
  } )

  table.appendChild( thead )
  table.appendChild( tbody )
  tableWrap.appendChild( table )
}

function toggleCompareForCard ( card )
{
  const productId = card?.dataset?.product
  if ( !productId ) return

  if ( selectedProductIds.includes( productId ) )
  {
    selectedProductIds = selectedProductIds.filter( id => id !== productId )
  } else if ( selectedProductIds.length < MAX_COMPARE )
  {
    selectedProductIds.push( productId )
  } else
  {
    if ( typeof showMessage === 'function' )
    {
      showMessage( 'You can compare up to 3 bottles at a time.', 'info' )
    }
    return
  }

  syncCompareChrome()
  updateCompareTable()
}

function clearCompare ()
{
  selectedProductIds = []
  syncCompareChrome()
  updateCompareTable()
}

document.getElementById( 'compareClearBtn' )?.addEventListener( 'click', clearCompare )

function initProductsPageCardWidgets ()
{
  document.querySelectorAll( '.card[data-popular="true"]' ).forEach( card =>
  {
    if ( card.querySelector( '.popular-badge' ) ) return
    card.style.position = 'relative'
    const badge = document.createElement( 'div' )
    badge.className = 'popular-badge'
    badge.innerHTML = '🔥 MOST POPULAR'
    card.appendChild( badge )
  } )

  document.querySelectorAll( '.card' ).forEach( ( card, index ) =>
  {
    if ( card.querySelector( '.wishlist-btn' ) ) return
    const productName = card.querySelector( 'h3' )?.innerText || `Product ${index}`
    const wishBtn = document.createElement( 'button' )
    wishBtn.type = 'button'
    wishBtn.innerHTML = wishlist.includes( productName ) ? '❤️ Saved' : '🤍 Save for Later'
    wishBtn.className = 'wishlist-btn'
    wishBtn.addEventListener( 'click', () =>
    {
      if ( wishlist.includes( productName ) )
      {
        wishlist = wishlist.filter( p => p !== productName )
        wishBtn.innerHTML = '🤍 Save for Later'
        showWishlistPopup( `Removed ${productName} from wishlist` )
      } else
      {
        wishlist.push( productName )
        wishBtn.innerHTML = '❤️ Saved'
        showWishlistPopup( `Added ${productName} to wishlist` )
      }
      localStorage.setItem( 'wishlist', JSON.stringify( wishlist ) )
      updateWishlistCount()
    } )
    card.appendChild( wishBtn )
  } )

  document.querySelectorAll( '.card img' ).forEach( img =>
  {
    img.replaceWith( img.cloneNode( true ) )
  } )
  document.querySelectorAll( '.card img' ).forEach( img =>
  {
    img.addEventListener( 'click', open3DViewer )
  } )

  document.querySelectorAll( '.card' ).forEach( card =>
  {
    if ( card.querySelector( '.price-alert' ) ) return
    const alertDiv = document.createElement( 'div' )
    alertDiv.className = 'price-alert'
    alertDiv.style.display = 'none'
    const emailInput = document.createElement( 'input' )
    emailInput.type = 'email'
    emailInput.placeholder = 'Email for price alert'
    const notifyBtn = document.createElement( 'button' )
    notifyBtn.type = 'button'
    notifyBtn.className = 'buyBtn'
    notifyBtn.style.padding = '5px'
    notifyBtn.style.fontSize = '12px'
    notifyBtn.style.marginTop = '5px'
    notifyBtn.textContent = 'Notify Me'
    notifyBtn.addEventListener( 'click', () =>
    {
      alert( '✅ You will be notified when price drops!' )
      alertDiv.style.display = 'none'
    } )
    alertDiv.appendChild( emailInput )
    alertDiv.appendChild( notifyBtn )
    card.appendChild( alertDiv )
    card.addEventListener( 'mouseenter', () => { alertDiv.style.display = 'block' } )
    card.addEventListener( 'mouseleave', () => { alertDiv.style.display = 'none' } )
  } )

  document.querySelectorAll( '.card-compare-toggle' ).forEach( btn =>
  {
    btn.replaceWith( btn.cloneNode( true ) )
  } )
  document.querySelectorAll( '.card-compare-toggle' ).forEach( btn =>
  {
    btn.addEventListener( 'click', () =>
    {
      const card = btn.closest( '.card' )
      if ( card ) toggleCompareForCard( card )
    } )
  } )

  syncCompareChrome()
}

document.addEventListener( 'hydro:productsCatalogRendered', () =>
{
  clearCompare()
  initProductsPageCardWidgets()
} )

syncCompareChrome()
