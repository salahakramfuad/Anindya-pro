/**
 * Responsive navigation drawer
 */
// ========== MOBILE MENU FUNCTIONALITY ==========
const mobileMenuBtn = document.getElementById( 'mobileMenuBtn' )
const mainNav = document.getElementById( 'mainNav' )
const navOverlay = document.getElementById( 'navOverlay' )

function closeMobileMenu ()
{
  if ( mainNav )
  {
    mainNav.querySelectorAll( 'details.nav-details[open]' ).forEach( d => d.removeAttribute( 'open' ) )
    mainNav.classList.remove( 'active' )
  }
  if ( mobileMenuBtn )
  {
    mobileMenuBtn.classList.remove( 'active' )
    mobileMenuBtn.setAttribute( 'aria-expanded', 'false' )
    mobileMenuBtn.setAttribute( 'aria-label', 'Open menu' )
  }
  if ( navOverlay ) navOverlay.classList.remove( 'active' )
  document.body.classList.remove( 'nav-drawer-open' )
  document.body.style.overflow = ''
}

function openMobileMenu ()
{
  if ( mainNav ) mainNav.classList.add( 'active' )
  if ( mobileMenuBtn )
  {
    mobileMenuBtn.classList.add( 'active' )
    mobileMenuBtn.setAttribute( 'aria-expanded', 'true' )
    mobileMenuBtn.setAttribute( 'aria-label', 'Close menu' )
  }
  if ( navOverlay ) navOverlay.classList.add( 'active' )
  document.body.classList.add( 'nav-drawer-open' )
  document.body.style.overflow = 'hidden'
}

if ( mobileMenuBtn )
{
  mobileMenuBtn.addEventListener( 'click', function ( e )
  {
    e.stopPropagation()
    if ( mainNav && mainNav.classList.contains( 'active' ) )
    {
      closeMobileMenu()
    } else
    {
      openMobileMenu()
    }
  } )
}

// Close menu when clicking overlay
if ( navOverlay )
{
  navOverlay.addEventListener( 'click', closeMobileMenu )
}

// Close menu when clicking a navigation link
document.querySelectorAll( 'nav a' ).forEach( link =>
{
  link.addEventListener( 'click', function ( e )
  {
    link.closest( 'details.nav-details' )?.removeAttribute( 'open' )
    if ( window.innerWidth <= 1024 )
    {
      closeMobileMenu()
    }
  } )
} )

// Close “More” panel when clicking outside (desktop)
document.addEventListener( 'click', function ( e )
{
  if ( window.innerWidth <= 1024 ) return
  const t = e.target
  if ( t.closest?.( '.nav-details' ) ) return
  document.querySelectorAll( 'details.nav-details[open]' ).forEach( d => d.removeAttribute( 'open' ) )
} )

// Close menu on window resize if screen becomes larger
window.addEventListener( 'resize', function ()
{
  if ( window.innerWidth > 1024 )
  {
    closeMobileMenu()
  }
} )

// Close menu on Escape key
document.addEventListener( 'keydown', function ( e )
{
  if ( e.key === 'Escape' )
  {
    document.querySelectorAll( 'details.nav-details[open]' ).forEach( d => d.removeAttribute( 'open' ) )
    if ( mainNav && mainNav.classList.contains( 'active' ) ) closeMobileMenu()
  }
} )

