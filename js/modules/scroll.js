/**
 * scrollToOrder — same page #order or go to order.html#order
 */
// ========== SCROLL FUNCTIONS ==========
function scrollToOrder ()
{
  const el = document.getElementById( 'order' )
  if ( el )
  {
    el.scrollIntoView( { behavior: 'smooth' } )
  } else
  {
    window.location.href = 'order.html#order'
  }
}

