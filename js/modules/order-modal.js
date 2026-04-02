/**
 * Order form in a modal on products page (replaces standalone order.html)
 */
function openOrderModal ( opts = {} )
{
  if ( typeof window.rebuildOrderBottleOptions === 'function' ) window.rebuildOrderBottleOptions()

  const modal = document.getElementById( 'orderModal' )
  if ( !modal )
  {
    window.location.href = 'products.html?order=1'
    return
  }

  modal.hidden = false
  modal.classList.add( 'is-open' )
  modal.setAttribute( 'aria-hidden', 'false' )
  document.body.style.overflow = 'hidden'

  const sel = document.getElementById( 'bottleColor' )
  const id = opts.productId
  if ( sel && id && [ ...sel.options ].some( o => o.value === id ) )
  {
    sel.value = id
  }

  if ( Object.prototype.hasOwnProperty.call( opts, 'membershipPlan' ) )
  {
    const memSel = document.getElementById( 'membershipPlan' )
    const plan = opts.membershipPlan
    if ( memSel && plan && [ ...memSel.options ].some( o => o.value === plan ) )
    {
      memSel.value = plan
    } else if ( memSel && !plan )
    {
      memSel.value = ''
    }
  }

  document.getElementById( 'fullName' )?.focus()
}

function closeOrderModal ()
{
  const modal = document.getElementById( 'orderModal' )
  if ( !modal ) return
  modal.hidden = true
  modal.classList.remove( 'is-open' )
  modal.setAttribute( 'aria-hidden', 'true' )
  document.body.style.overflow = ''
}

window.openOrderModal = openOrderModal
window.closeOrderModal = closeOrderModal

function bindOrderModalUi ()
{
  const modal = document.getElementById( 'orderModal' )
  if ( !modal ) return

  modal.querySelector( '.order-modal__close' )?.addEventListener( 'click', closeOrderModal )
  modal.querySelectorAll( '[data-close-order-modal]' ).forEach( el =>
  {
    el.addEventListener( 'click', closeOrderModal )
  } )

  modal.querySelector( '.order-modal__dialog' )?.addEventListener( 'click', e => e.stopPropagation() )

  document.addEventListener( 'keydown', e =>
  {
    if ( e.key !== 'Escape' ) return
    if ( !modal.classList.contains( 'is-open' ) ) return
    closeOrderModal()
  } )

  document.querySelectorAll( '[data-open-order-modal]' ).forEach( btn =>
  {
    btn.addEventListener( 'click', e =>
    {
      e.preventDefault()
      openOrderModal( {} )
    } )
  } )

  document.getElementById( 'orderMembershipSignupBtn' )?.addEventListener( 'click', () =>
  {
    const plan = document.getElementById( 'membershipPlan' )?.value?.trim()
    if ( !plan )
    {
      if ( typeof showMessage === 'function' ) showMessage( 'Choose a membership plan first.', 'info' )
      return
    }
    if ( typeof showMembershipModal === 'function' ) showMembershipModal( plan )
  } )

  const params = new URLSearchParams( window.location.search )
  if ( params.get( 'order' ) === '1' )
  {
    const openWhenReady = () =>
    {
      openOrderModal( {} )
      try
      {
        const url = new URL( window.location.href )
        url.searchParams.delete( 'order' )
        window.history.replaceState( {}, '', url.pathname + url.search + url.hash )
      } catch ( _ ) { /* ignore */ }
    }
    if ( document.getElementById( 'bottleColor' )?.options?.length > 1 ) openWhenReady()
    else window.addEventListener( 'hydro:productsCatalogRendered', openWhenReady, { once: true } )
  }
}

if ( document.readyState === 'loading' )
{
  document.addEventListener( 'DOMContentLoaded', bindOrderModalUi )
} else
{
  bindOrderModalUi()
}
