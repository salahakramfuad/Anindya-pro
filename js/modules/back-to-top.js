/**
 * Back to top FAB
 */
// ========== BACK TO TOP BUTTON FUNCTIONALITY ==========
const backToTopBtn = document.getElementById( 'backToTopBtn' )

window.addEventListener( 'scroll', function ()
{
  if ( !backToTopBtn ) return
  if ( window.scrollY > 300 )
  {
    backToTopBtn.classList.add( 'show' )
  } else
  {
    backToTopBtn.classList.remove( 'show' )
  }
} )

if ( backToTopBtn )
{
  backToTopBtn.addEventListener( 'click', function ()
  {
    window.scrollTo( {
      top: 0,
      behavior: 'smooth'
    } )
  } )
}

