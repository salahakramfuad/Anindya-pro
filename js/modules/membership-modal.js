/**
 * Membership signup modal
 * Loads after: custom-alert, scroll
 */
// ========== MEMBERSHIP MODAL FUNCTION ==========
function showMembershipModal ( plan )
{
  const existingModal = document.querySelector( '.membership-modal' )
  if ( existingModal ) existingModal.remove()

  const modal = document.createElement( 'div' )
  modal.className = 'membership-modal'
  modal.innerHTML = `
  <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Complete Your ${plan} Membership</h2>
      <form id="membershipForm">
          <input type="text" id="memName" placeholder="Full Name" required>
          <input type="email" id="memEmail" placeholder="Email" required>
          <input type="tel" id="memPhone" placeholder="Phone Number" required>
          <select id="memPayment" required>
              <option value="">Select Payment Method</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="apple_pay">Apple Pay</option>
          </select>
          <div class="plan-summary">
              <h3>Selected Plan: ${plan}</h3>
              <p>7-day free trial included!</p>
              <p class="price-info">No charges during trial period</p>
          </div>
          <button type="submit">Start Free Trial</button>
      </form>
  </div>
    `

  document.body.appendChild( modal )

  const style = document.createElement( 'style' )
  style.textContent = `
  .membership-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
  }
  .modal-content {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      padding: 40px;
      border-radius: 20px;
      width: 90%;
      max-width: 500px;
      position: relative;
      border: 1px solid rgba(56, 189, 248, 0.3);
      animation: modalPop 0.3s ease;
  }
  @keyframes modalPop {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
  }
  .close-modal {
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 30px;
      cursor: pointer;
      color: #94a3b8;
      transition: 0.3s;
  }
  .close-modal:hover {
      color: #38bdf8;
      transform: rotate(90deg);
  }
  .modal-content h2 {
      margin-bottom: 30px;
      font-size: 1.8rem;
  }
  .modal-content input,
  .modal-content select {
      width: 100%;
      padding: 12px;
      margin-bottom: 15px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
  }
  .modal-content select option {
      background: #1e293b;
      color: white;
  }
  .plan-summary {
      background: rgba(56, 189, 248, 0.1);
      padding: 15px;
      border-radius: 10px;
      margin: 20px 0;
      text-align: center;
  }
  .plan-summary h3 {
      color: #38bdf8;
      margin-bottom: 10px;
  }
  .price-info {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 5px;
  }
  .modal-content button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 25px;
      background: linear-gradient(90deg, #38bdf8, #22c55e);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
  }
  .modal-content button:hover {
      transform: scale(1.02);
      box-shadow: 0 5px 20px rgba(56, 189, 248, 0.4);
  }
    `
  document.head.appendChild( style )

  modal.querySelector( '.close-modal' ).addEventListener( 'click', () => modal.remove() )
  modal.querySelector( '#membershipForm' ).addEventListener( 'submit', ( e ) =>
  {
    e.preventDefault()
    const name = document.getElementById( 'memName' ).value
    const email = document.getElementById( 'memEmail' ).value
    showMessage( `🎉 Welcome ${name}! Your membership has been activated. Check your email at ${email} for details.`, 'success' )
    modal.remove()
  } )
  modal.addEventListener( 'click', ( e ) => { if ( e.target === modal ) modal.remove() } )
}

