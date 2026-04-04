/**
 * Visitor counter, viewers, parallax, compare bottles
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
const MAX_COMPARE = 12
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

/** Single product from loaded catalog JSON */
function catalogProduct ( productId )
{
  return window.__productsCatalogData?.products?.find( p => p.id === productId )
}

/**
 * Build compare rows: core catalog fields plus one row per card bullet (aligned to selected columns).
 */
function compareRowsForProductIds ( productIds )
{
  if ( !productIds?.length ) return []

  const products = productIds.map( id => catalogProduct( id ) )

  const rows = [
    {
      label: 'Price',
      values: products.map( p => ( p ? ( p.price?.trim() || '—' ) : '—' ) )
    },
    {
      label: 'Edition',
      values: products.map( p =>
        ( !p ? '—' : ( p.tier === 'special' ? 'Special edition' : 'Standard' ) )
      )
    },
    {
      label: 'Popular on site',
      values: products.map( p => ( p?.popular ? 'Yes' : '—' ) )
    },
    {
      label: 'Product image (file)',
      values: products.map( p => ( p?.image || '—' ) )
    },
    {
      label: 'Image description (alt)',
      values: products.map( p => ( p?.imageAlt?.trim() || '—' ) )
    },
    {
      label: 'Catalog ID',
      values: products.map( p => ( p?.id || '—' ) )
    }
  ]

  const maxBullets = Math.max( 0, ...products.map( p => p?.items?.length || 0 ) )
  for ( let i = 0; i < maxBullets; i++ )
  {
    rows.push( {
      label: `Card feature ${i + 1}`,
      values: products.map( p => ( p?.items?.[ i ]?.trim() || '—' ) )
    } )
  }

  return rows
}

function syncCompareChrome ()
{
  const statusEl = document.getElementById( 'compareStatus' )
  const clearBtn = document.getElementById( 'compareClearBtn' )
  const emptyEl = document.getElementById( 'compareEmpty' )
  const tableWrap = document.getElementById( 'compareTable' )
  const n = selectedProductIds.length
  const showTable = n >= 2

  if ( clearBtn ) clearBtn.hidden = n === 0
  if ( emptyEl )
  {
    emptyEl.hidden = showTable
    if ( n === 1 )
    {
      emptyEl.textContent =
        'One bottle selected—add at least one more to see a comparison table.'
    } else if ( n === 0 )
    {
      emptyEl.textContent =
        'Select two or more bottles (Compare on each card) to see them side by side.'
    }
  }
  if ( tableWrap )
  {
    tableWrap.hidden = !showTable
    if ( !showTable ) tableWrap.textContent = ''
  }

  if ( statusEl )
  {
    if ( n === 0 )
    {
      statusEl.textContent =
        'Pick two or more bottles—tap Compare on each card (up to ' + MAX_COMPARE + ').'
    } else
    {
      const labels = selectedProductIds.map( id => catalogProduct( id )?.title || id )
      statusEl.textContent =
        `Comparing ${n}${n === MAX_COMPARE ? ' (max)' : ''}: ${labels.join( ', ' )}.`
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
  if ( !tableWrap || selectedProductIds.length < 2 ) return

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
    const p = catalogProduct( id )
    th.textContent = p?.title || id
    headTr.appendChild( th )
  } )
  thead.appendChild( headTr )

  const tbody = document.createElement( 'tbody' )
  compareRowsForProductIds( selectedProductIds ).forEach( row =>
  {
    const tr = document.createElement( 'tr' )
    const th = document.createElement( 'th' )
    th.scope = 'row'
    th.textContent = row.label
    tr.appendChild( th )

    row.values.forEach( cell =>
    {
      const td = document.createElement( 'td' )
      td.textContent = cell
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
      showMessage( `You can compare up to ${MAX_COMPARE} bottles at a time.`, 'info' )
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

  document.querySelectorAll( '.card img' ).forEach( img =>
  {
    img.replaceWith( img.cloneNode( true ) )
  } )
  document.querySelectorAll( '.card img' ).forEach( img =>
  {
    img.addEventListener( 'click', open3DViewer )
  } )

  syncCompareChrome()
}

function bindProductsGridCompareDelegation ()
{
  const grid = document.getElementById( 'productsGrid' )
  if ( !grid || grid.dataset.compareBound === '1' ) return
  grid.dataset.compareBound = '1'
  grid.addEventListener( 'click', e =>
  {
    const notifyBtn = e.target.closest( '.card-notify-btn' )
    if ( notifyBtn && grid.contains( notifyBtn ) )
    {
      e.preventDefault()
      e.stopPropagation()
      const card = notifyBtn.closest( '.card' )
      const id = card?.dataset?.product
      const title = card?.querySelector( '.card__title' )?.textContent?.trim()
        || card?.querySelector( 'h3' )?.textContent?.trim()
        || id
      if ( typeof window.openPriceAlertModal === 'function' )
      {
        window.openPriceAlertModal( { productId: id || '', title: title || '' } )
      }
      return
    }

    const btn = e.target.closest( '.card-compare-toggle' )
    if ( !btn || !grid.contains( btn ) ) return
    e.preventDefault()
    e.stopPropagation()
    const card = btn.closest( '.card' )
    if ( card ) toggleCompareForCard( card )
  } )
}

function initPriceAlertModal ()
{
  const modal = document.getElementById( 'priceAlertModal' )
  if ( !modal ) return

  const close = () =>
  {
    modal.hidden = true
    modal.classList.remove( 'is-open' )
    modal.setAttribute( 'aria-hidden', 'true' )
    document.body.style.overflow = ''
  }

  window.openPriceAlertModal = ( { productId = '', title = '' } = {} ) =>
  {
    const nameEl = document.getElementById( 'priceAlertProductName' )
    const emailEl = document.getElementById( 'priceAlertEmail' )
    if ( nameEl )
    {
      nameEl.textContent = title || productId || 'this bottle'
    }
    modal.dataset.productId = productId
    if ( emailEl ) emailEl.value = ''
    modal.hidden = false
    modal.classList.add( 'is-open' )
    modal.setAttribute( 'aria-hidden', 'false' )
    document.body.style.overflow = 'hidden'
    emailEl?.focus()
  }

  window.closePriceAlertModal = close

  modal.querySelector( '[data-close-price-alert-modal]' )?.addEventListener( 'click', close )
  modal.querySelector( '.price-alert-modal__close' )?.addEventListener( 'click', close )

  document.getElementById( 'priceAlertForm' )?.addEventListener( 'submit', e =>
  {
    e.preventDefault()
    const email = document.getElementById( 'priceAlertEmail' )?.value?.trim()
    if ( !email )
    {
      if ( typeof showMessage === 'function' ) showMessage( 'Please enter your email.', 'info' )
      return
    }
    if ( typeof showMessage === 'function' )
    {
      showMessage( 'You’re on the list—we’ll email you if this bottle’s price drops.', 'success' )
    } else
    {
      alert( 'You’re on the list!' )
    }
    close()
  } )

  document.addEventListener( 'keydown', e =>
  {
    if ( e.key !== 'Escape' ) return
    if ( !modal.classList.contains( 'is-open' ) ) return
    close()
  } )
}

window.addEventListener( 'hydro:productsCatalogRendered', () =>
{
  selectedProductIds = selectedProductIds.filter( id =>
    window.__productsCatalogData?.products?.some( p => p.id === id )
  )
  initProductsPageCardWidgets()
  syncCompareChrome()
  updateCompareTable()
} )

initPriceAlertModal()
bindProductsGridCompareDelegation()
syncCompareChrome()
