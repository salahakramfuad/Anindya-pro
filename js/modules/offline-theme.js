/**
 * Offline banner + dark/light mode
 */
// ========== OFFLINE MODE ==========
const offlineMsg = document.createElement( 'div' )
offlineMsg.className = 'offline-message'
offlineMsg.setAttribute( 'role', 'status' )
offlineMsg.textContent = '⚠️ You are offline! Some features may not work.'
document.body.appendChild( offlineMsg )

window.addEventListener( 'offline', () =>
{
  offlineMsg.classList.add( 'show' )
  setTimeout( () => offlineMsg.classList.remove( 'show' ), 3000 )
} )

window.addEventListener( 'online', () =>
{
  offlineMsg.textContent = '✅ You are back online!'
  offlineMsg.classList.add( 'show' )
  setTimeout( () => offlineMsg.classList.remove( 'show' ), 3000 )
} )

// ========== DARK/LIGHT MODE TOGGLE ==========
const modeToggle = document.getElementById( 'modeToggle' )
const body = document.body

function syncModeToggleUi ( isLight )
{
  if ( !modeToggle ) return
  modeToggle.textContent = isLight ? '☀️' : '🌙'
  modeToggle.setAttribute( 'aria-pressed', isLight ? 'true' : 'false' )
  modeToggle.setAttribute( 'aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode' )
}

// Check for saved preference
const savedMode = localStorage.getItem( 'mode' )
if ( savedMode === 'light' )
{
  body.classList.add( 'light-mode' )
}
syncModeToggleUi( body.classList.contains( 'light-mode' ) )

modeToggle?.addEventListener( 'click', () =>
{
  body.classList.toggle( 'light-mode' )
  const isLight = body.classList.contains( 'light-mode' )
  syncModeToggleUi( isLight )
  try
  {
    localStorage.setItem( 'mode', isLight ? 'light' : 'dark' )
  } catch ( _ ) { /* private mode / blocked */ }
} )

