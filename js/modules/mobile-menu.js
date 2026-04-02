/**
 * Responsive navigation drawer
 */
// ========== MOBILE MENU FUNCTIONALITY ==========
const mobileMenuBtn = document.getElementById( 'mobileMenuBtn' )
const mainNav = document.getElementById( 'mainNav' )
const navOverlay = document.getElementById( 'navOverlay' )

function closeMobileMenu ()
{
  if ( mainNav ) mainNav.classList.remove( 'active' )
  if ( mobileMenuBtn ) mobileMenuBtn.classList.remove( 'active' )
  if ( navOverlay ) navOverlay.classList.remove( 'active' )
  document.body.style.overflow = 'auto'
}

function openMobileMenu ()
{
  if ( mainNav ) mainNav.classList.add( 'active' )
  if ( mobileMenuBtn ) mobileMenuBtn.classList.add( 'active' )
  if ( navOverlay ) navOverlay.classList.add( 'active' )
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
    if ( window.innerWidth <= 1024 )
    {
      closeMobileMenu()
    }
  } )
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
  if ( e.key === 'Escape' && mainNav && mainNav.classList.contains( 'active' ) )
  {
    closeMobileMenu()
  }
} )

