/**
 * Product cards from JSON (file + optional localStorage override).
 * Bundled data: js/data/products-catalog.json
 * Save downloads a file to replace that JSON in the project; also writes localStorage for instant reloads.
 */
const CATALOG_STORAGE_KEY = 'hydroProductsCatalogV1'
const CATALOG_URL = 'js/data/products-catalog.json'

function normalizeCatalog ( raw )
{
  if ( !raw || typeof raw !== 'object' || !Array.isArray( raw.products ) ) return null
  return {
    version: typeof raw.version === 'number' ? raw.version : 1,
    products: raw.products.map( p => ( {
      id: String( p.id || '' ).trim(),
      title: String( p.title || p.id || 'Product' ).trim(),
      price: String( p.price || '' ).trim(),
      tier: p.tier === 'special' ? 'special' : 'standard',
      image: String( p.image || '' ).trim(),
      imageAlt: String( p.imageAlt || p.title || '' ).trim(),
      popular: !!p.popular,
      items: Array.isArray( p.items ) ? p.items.map( x => String( x ).trim() ).filter( Boolean ) : []
    } ) ).filter( p => p.id && p.title )
  }
}

function loadFromStorage ()
{
  try
  {
    const raw = localStorage.getItem( CATALOG_STORAGE_KEY )
    if ( !raw ) return null
    return normalizeCatalog( JSON.parse( raw ) )
  } catch ( _ )
  {
    return null
  }
}

async function loadFromFile ()
{
  const res = await fetch( CATALOG_URL, { cache: 'no-store' } )
  if ( !res.ok ) throw new Error( 'Could not load products-catalog.json' )
  return normalizeCatalog( await res.json() )
}

function saveToStorage ( data )
{
  localStorage.setItem( CATALOG_STORAGE_KEY, JSON.stringify( data, null, 2 ) )
}

function downloadJsonFile ( data )
{
  const blob = new Blob( [ JSON.stringify( data, null, 2 ) ], { type: 'application/json' } )
  const a = document.createElement( 'a' )
  a.href = URL.createObjectURL( blob )
  a.download = 'products-catalog.json'
  a.rel = 'noopener'
  document.body.appendChild( a )
  a.click()
  a.remove()
  URL.revokeObjectURL( a.href )
}

function renderProductCards ( container, data )
{
  if ( !container || !data?.products?.length ) return

  container.replaceChildren()

  data.products.forEach( product =>
  {
    const card = document.createElement( 'div' )
    card.className = 'card'
    card.setAttribute( 'role', 'listitem' )
    card.dataset.product = product.id
    card.dataset.tier = product.tier
    if ( product.popular ) card.dataset.popular = 'true'

    const media = document.createElement( 'div' )
    media.className = 'card__media'
    const img = document.createElement( 'img' )
    img.src = product.image
    img.alt = product.imageAlt || product.title
    media.appendChild( img )
    card.appendChild( media )

    const h3 = document.createElement( 'h3' )
    h3.textContent = product.title
    card.appendChild( h3 )

    const priceEl = document.createElement( 'p' )
    priceEl.textContent = product.price
    card.appendChild( priceEl )

    if ( product.items?.length )
    {
      const ul = document.createElement( 'ul' )
      ul.className = 'card__items'
      product.items.forEach( line =>
      {
        const li = document.createElement( 'li' )
        li.textContent = line
        ul.appendChild( li )
      } )
      card.appendChild( ul )
    }

    const actions = document.createElement( 'div' )
    actions.className = 'card__actions'

    const cmp = document.createElement( 'button' )
    cmp.type = 'button'
    cmp.className = 'card-compare-toggle'
    cmp.setAttribute( 'aria-pressed', 'false' )
    cmp.setAttribute( 'aria-label', `Add ${product.title} to compare` )
    cmp.textContent = 'Compare'

    const buy = document.createElement( 'button' )
    buy.type = 'button'
    buy.className = 'buy-card-btn'
    buy.textContent = 'Buy'

    actions.appendChild( cmp )
    actions.appendChild( buy )
    card.appendChild( actions )
    container.appendChild( card )
  } )
}

function fillEditorForm ( form, product )
{
  if ( !form || !product ) return
  form.querySelector( '[name="catalogId"]' ).value = product.id
  form.querySelector( '[name="catalogTitle"]' ).value = product.title
  form.querySelector( '[name="catalogPrice"]' ).value = product.price
  form.querySelector( '[name="catalogTier"]' ).value = product.tier
  form.querySelector( '[name="catalogImage"]' ).value = product.image
  form.querySelector( '[name="catalogImageAlt"]' ).value = product.imageAlt
  form.querySelector( '[name="catalogPopular"]' ).checked = product.popular
  form.querySelector( '[name="catalogItems"]' ).value = ( product.items || [] ).join( '\n' )
}

function productFromForm ( form )
{
  const id = form.querySelector( '[name="catalogId"]' )?.value?.trim()
  const title = form.querySelector( '[name="catalogTitle"]' )?.value?.trim()
  const price = form.querySelector( '[name="catalogPrice"]' )?.value?.trim()
  const tier = form.querySelector( '[name="catalogTier"]' )?.value === 'special' ? 'special' : 'standard'
  const image = form.querySelector( '[name="catalogImage"]' )?.value?.trim()
  const imageAlt = form.querySelector( '[name="catalogImageAlt"]' )?.value?.trim()
  const popular = !!form.querySelector( '[name="catalogPopular"]' )?.checked
  const itemsRaw = form.querySelector( '[name="catalogItems"]' )?.value || ''
  const items = itemsRaw.split( /\r?\n/ ).map( s => s.trim() ).filter( Boolean )
  if ( !id || !title ) return null
  return { id, title, price: price || '—', tier, image: image || 'Logo.png', imageAlt: imageAlt || title, popular, items }
}

function updateEditorSelect ( select, products, selectedIndex )
{
  if ( !select ) return
  const cur = selectedIndex >= 0 ? selectedIndex : parseInt( select.value, 10 )
  select.innerHTML = ''
  const opt0 = document.createElement( 'option' )
  opt0.value = '-1'
  opt0.textContent = '— New product —'
  select.appendChild( opt0 )
  products.forEach( ( p, i ) =>
  {
    const o = document.createElement( 'option' )
    o.value = String( i )
    o.textContent = `${p.title} (${p.id})`
    select.appendChild( o )
  } )
  select.value = String( Number.isFinite( cur ) && cur >= 0 && cur < products.length ? cur : -1 )
}

function initCatalogEditor ( grid, getData, setData, rerender )
{
  const root = document.getElementById( 'catalogEditor' )
  const form = document.getElementById( 'catalogEditorForm' )
  const select = document.getElementById( 'catalogEditorPick' )
  if ( !root || !form || !select ) return

  const syncSelect = () =>
  {
    const d = getData()
    const idx = parseInt( select.value, 10 )
    updateEditorSelect( select, d.products, idx )
  }

  select.addEventListener( 'change', () =>
  {
    const d = getData()
    const i = parseInt( select.value, 10 )
    if ( i >= 0 && d.products[ i ] ) fillEditorForm( form, d.products[ i ] )
    else
    {
      form.reset()
      form.querySelector( '[name="catalogTier"]' ).value = 'standard'
    }
  } )

  form.querySelector( '#catalogAddBtn' )?.addEventListener( 'click', e =>
  {
    e.preventDefault()
    const p = productFromForm( form )
    if ( !p )
    {
      if ( typeof showMessage === 'function' ) showMessage( 'ID and title are required.', 'info' )
      return
    }
    const d = getData()
    const dup = d.products.findIndex( x => x.id === p.id )
    if ( dup >= 0 )
    {
      if ( typeof showMessage === 'function' ) showMessage( 'A product with this ID already exists. Choose another ID or use Update.', 'info' )
      return
    }
    d.products.push( p )
    setData( d )
    rerender()
    syncSelect()
    select.value = String( d.products.length - 1 )
    if ( typeof showMessage === 'function' ) showMessage( 'Product added. Cards updated.', 'success' )
  } )

  form.querySelector( '#catalogUpdateBtn' )?.addEventListener( 'click', e =>
  {
    e.preventDefault()
    const i = parseInt( select.value, 10 )
    if ( i < 0 )
    {
      if ( typeof showMessage === 'function' ) showMessage( 'Select a product to update.', 'info' )
      return
    }
    const p = productFromForm( form )
    if ( !p )
    {
      if ( typeof showMessage === 'function' ) showMessage( 'ID and title are required.', 'info' )
      return
    }
    const d = getData()
    const oldId = d.products[ i ]?.id
    const idClash = d.products.some( ( x, j ) => x.id === p.id && j !== i )
    if ( idClash )
    {
      if ( typeof showMessage === 'function' ) showMessage( 'Another product already uses this ID.', 'info' )
      return
    }
    d.products[ i ] = p
    setData( d )
    rerender()
    syncSelect()
    select.value = String( i )
    if ( typeof showMessage === 'function' ) showMessage( 'Product updated on all cards.', 'success' )
  } )

  form.querySelector( '#catalogDeleteBtn' )?.addEventListener( 'click', e =>
  {
    e.preventDefault()
    const i = parseInt( select.value, 10 )
    if ( i < 0 ) return
    const d = getData()
    d.products.splice( i, 1 )
    setData( d )
    rerender()
    form.reset()
    form.querySelector( '[name="catalogTier"]' ).value = 'standard'
    syncSelect()
    if ( typeof showMessage === 'function' ) showMessage( 'Product removed.', 'success' )
  } )

  form.querySelector( '#catalogSaveDownloadBtn' )?.addEventListener( 'click', e =>
  {
    e.preventDefault()
    const d = getData()
    saveToStorage( d )
    downloadJsonFile( d )
    if ( typeof showMessage === 'function' )
    {
      showMessage( 'Saved in this browser. Replace js/data/products-catalog.json with the downloaded file to publish.', 'success' )
    }
  } )

  form.querySelector( '#catalogImportBtn' )?.addEventListener( 'click', () =>
  {
    document.getElementById( 'catalogFileInput' )?.click()
  } )

  document.getElementById( 'catalogFileInput' )?.addEventListener( 'change', ev =>
  {
    const file = ev.target.files?.[ 0 ]
    ev.target.value = ''
    if ( !file ) return
    const reader = new FileReader()
    reader.onload = () =>
    {
      try
      {
        const next = normalizeCatalog( JSON.parse( reader.result ) )
        if ( !next?.products?.length ) throw new Error( 'Invalid file' )
        setData( next )
        saveToStorage( next )
        rerender()
        syncSelect()
        select.value = '-1'
        form.reset()
        form.querySelector( '[name="catalogTier"]' ).value = 'standard'
        if ( typeof showMessage === 'function' ) showMessage( 'Catalog imported from file.', 'success' )
      } catch ( err )
      {
        if ( typeof showMessage === 'function' ) showMessage( 'Could not read JSON file.', 'info' )
      }
    }
    reader.readAsText( file )
  } )

  form.querySelector( '#catalogResetBtn' )?.addEventListener( 'click', e =>
  {
    e.preventDefault()
    localStorage.removeItem( CATALOG_STORAGE_KEY )
    if ( typeof showMessage === 'function' ) showMessage( 'Cleared saved catalog. Reloading…', 'success' )
    setTimeout( () => location.reload(), 400 )
  } )

  syncSelect()
}

function rebuildOrderBottleOptions ()
{
  const sel = document.getElementById( 'bottleColor' )
  const catalog = window.__productsCatalogData
  if ( !sel || !catalog?.products?.length ) return
  const previous = sel.value
  sel.replaceChildren()
  const placeholder = document.createElement( 'option' )
  placeholder.value = ''
  placeholder.textContent = 'Select bottle color'
  sel.appendChild( placeholder )
  catalog.products.forEach( p =>
  {
    const o = document.createElement( 'option' )
    o.value = p.id
    o.textContent = p.title
    sel.appendChild( o )
  } )
  const custom = document.createElement( 'option' )
  custom.value = 'Custom Color'
  custom.textContent = '🎨 Custom Color (+$1)'
  sel.appendChild( custom )
  if ( previous && [ ...sel.options ].some( opt => opt.value === previous ) )
  {
    sel.value = previous
  }
}

window.rebuildOrderBottleOptions = rebuildOrderBottleOptions

async function bootstrap ()
{
  const grid = document.getElementById( 'productsGrid' )
  if ( !grid ) return

  let data = loadFromStorage()
  if ( !data )
  {
    try
    {
      data = await loadFromFile()
    } catch ( err )
    {
      console.error( err )
      grid.innerHTML = '<p class="catalog-load-error" role="alert">Could not load the product catalog. Check that js/data/products-catalog.json is available.</p>'
      return
    }
  }

  if ( !data?.products?.length )
  {
    grid.innerHTML = '<p class="catalog-load-error" role="alert">The catalog has no products.</p>'
    return
  }

  window.__productsCatalogData = data

  const rerender = () =>
  {
    renderProductCards( grid, window.__productsCatalogData )
    rebuildOrderBottleOptions()
    window.dispatchEvent( new CustomEvent( 'hydro:productsCatalogRendered', {
      detail: { count: window.__productsCatalogData.products.length }
    } ) )
  }

  renderProductCards( grid, data )
  rebuildOrderBottleOptions()
  initCatalogEditor(
    grid,
    () => window.__productsCatalogData,
    d => { window.__productsCatalogData = d },
    rerender
  )

  window.dispatchEvent( new CustomEvent( 'hydro:productsCatalogRendered', {
    detail: { count: data.products.length }
  } ) )
}

bootstrap()
