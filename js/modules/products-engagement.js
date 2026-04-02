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

// ========== 2. MOST POPULAR BADGE ==========
const popularBottles = [ 'Ocean Blue', 'Energy Green' ]
document.querySelectorAll( '.card' ).forEach( card =>
{
  const title = card.querySelector( 'h3' )?.innerText || ''
  if ( popularBottles.includes( title ) )
  {
    const badge = document.createElement( 'div' )
    badge.className = 'popular-badge'
    badge.innerHTML = '🔥 MOST POPULAR'
    card.style.position = 'relative'
    card.appendChild( badge )
  }
} )

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

document.querySelectorAll( '.card' ).forEach( ( card, index ) =>
{
  const productName = card.querySelector( 'h3' )?.innerText || `Product ${index}`
  const wishBtn = document.createElement( 'button' )
  wishBtn.innerHTML = wishlist.includes( productName ) ? '❤️ Saved' : '🤍 Save for Later'
  wishBtn.className = 'wishlist-btn'
  wishBtn.onclick = () =>
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
  }
  card.appendChild( wishBtn )
} )

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
document.querySelectorAll( '.card img' ).forEach( img =>
{
  img.addEventListener( 'click', open3DViewer )
} )

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

// ========== 32. PRICE DROP ALERT (ON HOVER ONLY) ==========
document.querySelectorAll( '.card' ).forEach( card =>
{
  const price = card.querySelector( 'p' )?.innerText || '$9.99'
  const alertDiv = document.createElement( 'div' )
  alertDiv.className = 'price-alert'
  alertDiv.style.display = 'none'
  alertDiv.innerHTML = `
  <input type="email" placeholder="Email for price alert">
  <button class="buyBtn" style="padding: 5px; font-size: 12px; margin-top: 5px;">Notify Me</button>
    `
  alertDiv.querySelector( 'button' ).onclick = () =>
  {
    alert( '✅ You will be notified when price drops!' )
    alertDiv.style.display = 'none'
  }
  card.appendChild( alertDiv )

  card.addEventListener( 'mouseenter', () => alertDiv.style.display = 'block' )
  card.addEventListener( 'mouseleave', () => alertDiv.style.display = 'none' )
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

// ========== 41. COMPARE BOTTLES ==========
function escapeHtml ( str )
{
  const d = document.createElement( 'div' )
  d.textContent = str
  return d.innerHTML
}

let selectedBottles = []
function toggleCompare ( bottleName, element )
{
  if ( selectedBottles.includes( bottleName ) )
  {
    selectedBottles = selectedBottles.filter( b => b !== bottleName )
    element.classList.remove( 'selected' )
  } else if ( selectedBottles.length < 3 )
  {
    selectedBottles.push( bottleName )
    element.classList.add( 'selected' )
  } else
  {
    alert( 'You can compare up to 3 bottles at a time!' )
  }
  updateCompareTable()
}

function updateCompareTable ()
{
  const tableDiv = document.getElementById( 'compareTable' )
  if ( !tableDiv ) return

  if ( selectedBottles.length === 0 )
  {
    tableDiv.style.display = 'none'
    tableDiv.innerHTML = ''
    return
  }

  tableDiv.style.display = 'block'
  const features = [ 'Price', 'Smart Features', 'Self-Cleaning', 'Temperature Display', 'Warranty' ]
  const values = [ '$9.99', '✓', '✓ (+$7)', '✓', '6 months' ]

  let tableHTML = '<table><thead><tr><th>Feature</th>'
  selectedBottles.forEach( b => { tableHTML += `<th>${escapeHtml( b )}</th>` } )
  tableHTML += '</tr></thead><tbody>'

  features.forEach( ( feature, i ) =>
  {
    tableHTML += `<tr><td>${escapeHtml( feature )}</td>`
    selectedBottles.forEach( () => { tableHTML += `<td>${escapeHtml( values[ i ] )}</td>` } )
    tableHTML += '</tr>'
  } )
  tableHTML += '</tbody></table>'
  tableDiv.innerHTML = tableHTML
}

// Add compare section HTML
const compareSection = document.createElement( 'section' )
compareSection.className = 'compare-section'
compareSection.innerHTML = `
    <h2>Compare Bottles</h2>
    <p class="section-subtitle">Select up to 3 bottles to compare</p>
    <div class="compare-grid" id="compareGrid"></div>
    <div class="compare-table" id="compareTable"></div>
`
const productGrid = document.querySelector( '.products' )
if ( productGrid )
{
  productGrid.parentNode.insertBefore( compareSection, productGrid.nextSibling )
}

// Populate compare grid
const compareGrid = document.getElementById( 'compareGrid' )
if ( compareGrid )
{
  document.querySelectorAll( '.card' ).forEach( ( card, idx ) =>
  {
    const name = card.querySelector( 'h3' )?.innerText?.trim() || `Bottle ${idx + 1}`
    const imgSrc = card.querySelector( 'img' )?.src || ''
    const compareCard = document.createElement( 'div' )
    compareCard.className = 'compare-card'

    const imgEl = document.createElement( 'img' )
    imgEl.src = imgSrc
    imgEl.alt = ''
    imgEl.width = 100
    imgEl.style.width = '100px'
    imgEl.style.marginBottom = '10px'

    const h4 = document.createElement( 'h4' )
    h4.textContent = name

    const btn = document.createElement( 'button' )
    btn.type = 'button'
    btn.className = 'buyBtn'
    btn.style.padding = '5px 10px'
    btn.style.fontSize = '12px'
    btn.textContent = 'Compare'
    btn.addEventListener( 'click', () => toggleCompare( name, compareCard ) )

    compareCard.appendChild( imgEl )
    compareCard.appendChild( h4 )
    compareCard.appendChild( btn )
    compareGrid.appendChild( compareCard )
  } )
}

