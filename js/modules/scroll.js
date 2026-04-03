/**
 * scrollToOrder — open order modal on products, else go to products?order=1
 */
// ========== SCROLL FUNCTIONS ==========
function scrollToOrder ()
{
  if ( typeof openOrderModal === 'function' && document.getElementById( 'orderModal' ) )
  {
    openOrderModal( {} )
    return
  }
  const el = document.getElementById( 'order' )
  if ( el )
  {
    el.scrollIntoView( { behavior: 'smooth' } )
    return
  }
  window.location.href = 'products.html?order=1'
}

