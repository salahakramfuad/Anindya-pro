/**
 * Policies overlay render + open/close
 * Loads after: data/policies-data.js
 */
// ========== SERVICES AND POLICIES PAGE ==========
// Data: ../data/policies-data.js → window.policiesData

// Function to render policies content
function renderPolicies ()
{
  const contentDiv = document.getElementById( 'policiesContent' )
  if ( !contentDiv || !window.policiesData ) return

  contentDiv.innerHTML = `
    <div class="policies-category">
<h3>🛡️ Service Policies</h3>
${window.policiesData.servicePolicies.map( rule => `
  <div class="rule-item">
    <div class="rule-title">${rule.title}</div>
    <div class="rule-description">${rule.description}</div>
  </div>
`).join( '' )}
    </div>

    <div class="policies-category">
<h3>🚚 Shipping & Delivery</h3>
${window.policiesData.shippingDelivery.map( rule => `
  <div class="rule-item">
    <div class="rule-title">${rule.title}</div>
    <div class="rule-description">${rule.description}</div>
  </div>
`).join( '' )}
    </div>

    <div class="policies-category">
<h3>🔄 Returns & Refunds</h3>
${window.policiesData.returnRefund.map( rule => `
  <div class="rule-item">
    <div class="rule-title">${rule.title}</div>
    <div class="rule-description">${rule.description}</div>
  </div>
`).join( '' )}
    </div>

    <div class="policies-category">
<h3>🔒 Privacy & Security</h3>
${window.policiesData.privacySecurity.map( rule => `
  <div class="rule-item">
    <div class="rule-title">${rule.title}</div>
    <div class="rule-description">${rule.description}</div>
  </div>
`).join( '' )}
    </div>

    <div class="policies-category">
<h3>📋 Cancellation Terms</h3>
${window.policiesData.cancellationTerms.map( rule => `
  <div class="rule-item">
    <div class="rule-title">${rule.title}</div>
    <div class="rule-description">${rule.description}</div>
  </div>
`).join( '' )}
    </div>

    <div class="policies-category">
<h3>📞 Contact Support</h3>
${window.policiesData.contactSupport.map( rule => `
  <div class="rule-item">
    <div class="rule-title">${rule.title}</div>
    <div class="rule-description">${rule.description}</div>
  </div>
`).join( '' )}
    </div>
  `
}

// Open policies page
function openPoliciesPage ()
{
  const overlay = document.getElementById( 'policiesOverlay' )
  if ( overlay )
  {
    renderPolicies()
    overlay.style.display = 'flex'
    document.body.style.overflow = 'hidden'
  }
}

// Close policies page
function closePoliciesPage ()
{
  const overlay = document.getElementById( 'policiesOverlay' )
  if ( overlay )
  {
    overlay.style.display = 'none'
    document.body.style.overflow = 'auto'
  }
}

// Wait for DOM to be fully loaded
document.addEventListener( 'DOMContentLoaded', function ()
{
  // Get elements
  const openBtn = document.getElementById( 'openPoliciesBtn' )
  const closeBtn = document.getElementById( 'closePoliciesBtn' )
  const overlay = document.getElementById( 'policiesOverlay' )

  // Open button click
  if ( openBtn )
  {
    openBtn.addEventListener( 'click', function ( e )
    {
      e.preventDefault()
      e.stopPropagation()
      openPoliciesPage()
    } )
  }

  // Close button click (X button)
  if ( closeBtn )
  {
    closeBtn.addEventListener( 'click', function ( e )
    {
      e.preventDefault()
      e.stopPropagation()
      closePoliciesPage()
    } )
  }

  // Click outside overlay to close
  if ( overlay )
  {
    overlay.addEventListener( 'click', function ( e )
    {
      if ( e.target === overlay )
      {
        closePoliciesPage()
      }
    } )
  }

  // Close with Escape key
  document.addEventListener( 'keydown', function ( e )
  {
    if ( e.key === 'Escape' && overlay && overlay.style.display === 'flex' )
    {
      closePoliciesPage()
    }
  } )
} )

