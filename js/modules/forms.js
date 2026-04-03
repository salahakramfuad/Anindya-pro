/**
 * Order form, contact form, membership plan buttons
 * Loads after: custom-alert, custom-color-modal, scroll
 */
// ========== ORDER FORM HANDLING WITH CUSTOM COLOR ==========
const bottleColorSelect = document.getElementById( 'bottleColor' )
if ( bottleColorSelect )
{
  bottleColorSelect.addEventListener( 'change', function ( e )
  {
    if ( this.value === 'Custom Color' )
    {
      showCustomColorModal()
    }
  } )
}

const orderFormElement = document.getElementById( 'orderForm' )
if ( orderFormElement )
{
  orderFormElement.addEventListener( 'submit', function ( e )
  {
    e.preventDefault()

    const fullName = document.getElementById( 'fullName' )?.value || ''
    const email = document.getElementById( 'email' )?.value || ''
    const bottleColor = document.getElementById( 'bottleColor' )?.value || ''
    const quantity = document.getElementById( 'quantity' )?.value || ''
    const membershipPlan = document.getElementById( 'membershipPlan' )?.value?.trim() || ''
    const membershipHolderName = document.getElementById( 'membershipHolderName' )?.value?.trim() || ''

    if ( !fullName )
    {
      showMessage( 'Please enter your full name!', 'error' )
      return
    }
    if ( !email )
    {
      showMessage( 'Please enter your email address!', 'error' )
      return
    }
    if ( !bottleColor )
    {
      showMessage( 'Please select a bottle color!', 'error' )
      return
    }
    if ( !quantity )
    {
      showMessage( 'Please enter the quantity!', 'error' )
      return
    }

    if ( bottleColor === 'Custom Color' && !isCustomColorSelected && !selectedCustomColor )
    {
      showMessage( 'Please select a custom color first!', 'error' )
      showCustomColorModal()
      return
    }

    let colorMessage = bottleColor
    if ( bottleColor === 'Custom Color' && selectedCustomColor )
    {
      colorMessage = selectedCustomColor.type === 'image' ?
        `Custom Color (${selectedCustomColor.name})` :
        `Custom Color (${selectedCustomColor.value || selectedCustomColor.colorCode})`
    }

    let thankYou = `Thank you ${fullName}! Your order for ${quantity} ${colorMessage} bottle(s) has been received. We'll contact you at ${email} within 24 hours.`
    if ( membershipPlan )
    {
      thankYou += ` Membership: ${membershipPlan}.`
      if ( membershipHolderName ) thankYou += ` Name on membership: ${membershipHolderName}.`
    }
    showMessage( thankYou, 'success' )
    orderFormElement.reset()
    selectedCustomColor = null
    isCustomColorSelected = false
    if ( typeof closeOrderModal === 'function' ) closeOrderModal()
  } )
}

// ========== CONTACT FORM HANDLING ==========
const contactForm = document.getElementById( 'contactForm' )
if ( contactForm )
{
  contactForm.addEventListener( 'submit', function ( e )
  {
    e.preventDefault()
    const name = this.querySelector( 'input[placeholder="Name"]' )?.value || ''
    const email = this.querySelector( 'input[placeholder="Email"]' )?.value || ''
    const message = this.querySelector( 'textarea' )?.value || ''

    if ( !name || !email || !message )
    {
      showMessage( 'Please fill in all contact fields!', 'error' )
      return
    }

    showMessage( `Thank you ${name}! Your message has been sent. We'll respond within 24 hours.`, 'success' )
    this.reset()
  } )
}

// ========== MEMBERSHIP BUTTONS ==========
document.querySelectorAll( '.membership-btn' ).forEach( button =>
{
  button.addEventListener( 'click', function ( e )
  {
    e.preventDefault()
    const plan = this.getAttribute( 'data-plan' )
    showMembershipModal( plan )
  } )
} )
