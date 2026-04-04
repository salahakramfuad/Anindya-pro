/**
 * Toast-style showMessage()
 * Loads after: products-engagement (optional)
 */
// ========== CUSTOM ALERT FUNCTION ==========
function showMessage ( message, type = 'success' )
{
  const existingMsg = document.querySelector( '.custom-alert' )
  if ( existingMsg ) existingMsg.remove()

  if ( !document.getElementById( 'hydro-custom-alert-base-css' ) )
  {
    const base = document.createElement( 'style' )
    base.id = 'hydro-custom-alert-base-css'
    base.textContent = `
    .custom-alert {
        position: fixed;
        top: 20px;
        right: max(20px, env(safe-area-inset-right));
        z-index: 10000;
        animation: hydroAlertIn 0.3s ease;
        max-width: min(360px, calc(100vw - 32px));
    }
    .custom-alert .alert-content {
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .custom-alert .alert-icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        flex-shrink: 0;
    }
    .custom-alert .alert-content p {
        margin: 0;
        color: white;
        font-size: 14px;
        line-height: 1.45;
    }
    @keyframes hydroAlertIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes hydroAlertOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    `
    document.head.appendChild( base )
  }

  const alert = document.createElement( 'div' )
  alert.className = `custom-alert ${type}`
  alert.setAttribute( 'role', 'status' )
  alert.setAttribute( 'aria-live', 'polite' )

  const isLight = document.documentElement.classList.contains( 'light-mode' )
  const content = document.createElement( 'div' )
  content.className = 'alert-content'
  content.style.background = isLight
    ? 'linear-gradient(165deg, #f8fafc 0%, #e0f2fe 100%)'
    : 'linear-gradient(135deg, #1e293b, #0f172a)'
  content.style.borderLeft = `4px solid ${type === 'success' ? '#22c55e' : '#38bdf8'}`
  content.style.boxShadow = isLight ? '0 12px 40px rgba(15, 23, 42, 0.12)' : ''

  const icon = document.createElement( 'span' )
  icon.className = 'alert-icon'
  icon.style.background = type === 'success' ? '#22c55e' : '#38bdf8'
  icon.textContent = type === 'success' ? '✓' : 'ℹ'

  const p = document.createElement( 'p' )
  p.textContent = message
  p.style.color = isLight ? '#0f172a' : 'white'

  content.appendChild( icon )
  content.appendChild( p )
  alert.appendChild( content )
  document.body.appendChild( alert )

  setTimeout( () =>
  {
    alert.style.animation = 'hydroAlertOut 0.3s ease forwards'
    setTimeout( () => alert.remove(), 300 )
  }, 4000 )
}

