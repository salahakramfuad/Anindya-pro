/**
 * Custom bottle color picker state + modal
 * Loads after: custom-alert
 */
// ========== CUSTOM COLOR MODAL ==========
let selectedCustomColor = null
let isCustomColorSelected = false

function showCustomColorModal ()
{
  const existingModal = document.querySelector( '.custom-color-modal' )
  if ( existingModal ) existingModal.remove()

  const modal = document.createElement( 'div' )
  modal.className = 'custom-color-modal'
  modal.innerHTML = `
  <div class="custom-color-modal-content">
      <span class="close-modal">&times;</span>
      <h2>Customize Your Bottle Color</h2>
      <p style="text-align: center; color: #94a3b8; margin-bottom: 20px;">Additional $1 charge applies</p>

      <div class="color-preview-container">
          <div class="custom-color-preview" id="colorPreview"></div>
      </div>

      <div class="color-input-group">
          <label>🎨 Upload Color Image</label>
          <input type="file" id="customColorImage" accept="image/*">
          <p style="font-size: 12px; color: #94a3b8; margin-top: 5px;">Upload a reference image of your desired color</p>
      </div>

      <div class="color-input-group">
          <label>🎨 Enter Color Code</label>
          <input type="text" id="customColorCode" placeholder="e.g., #FF5733, rgb(255,87,51), blue">
          <p style="font-size: 12px; color: #94a3b8; margin-top: 5px;">Enter hex code, RGB, or color name</p>
      </div>

      <div class="color-input-group">
          <label>🎨 Color Picker</label>
          <input type="color" id="customColorPicker" value="#38bdf8">
      </div>

      <button id="applyCustomColor">Apply Custom Color</button>
      <button id="cancelCustomColor" class="secondary">Cancel</button>
  </div>
    `

  document.body.appendChild( modal )

  const style = document.createElement( 'style' )
  style.textContent = `
  .custom-color-modal {
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
  .custom-color-modal-content {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      padding: 40px;
      border-radius: 20px;
      width: 90%;
      max-width: 500px;
      position: relative;
      border: 1px solid rgba(56, 189, 248, 0.3);
      animation: modalPop 0.3s ease;
  }
  .custom-color-modal-content .close-modal {
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 30px;
      cursor: pointer;
      color: #94a3b8;
      transition: 0.3s;
  }
  .custom-color-modal-content .close-modal:hover {
      color: #38bdf8;
      transform: rotate(90deg);
  }
  .custom-color-modal-content h2 {
      margin-bottom: 20px;
      font-size: 1.8rem;
      text-align: center;
  }
  .custom-color-preview {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin: 20px auto;
      border: 3px solid #38bdf8;
      background: #1e293b;
      transition: all 0.3s ease;
  }
  .color-input-group {
      margin-bottom: 20px;
  }
  .color-input-group label {
      display: block;
      margin-bottom: 8px;
      color: #38bdf8;
      font-weight: 500;
  }
  .custom-color-modal-content input[type="text"],
  .custom-color-modal-content input[type="color"] {
      width: 100%;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 14px;
  }
  .custom-color-modal-content input[type="color"] {
      height: 50px;
      cursor: pointer;
  }
  .custom-color-modal-content input[type="file"] {
      width: 100%;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
  }
  .custom-color-modal-content input[type="file"]::file-selector-button {
      background: linear-gradient(90deg, #38bdf8, #22c55e);
      border: none;
      padding: 8px 15px;
      border-radius: 20px;
      color: white;
      cursor: pointer;
      margin-right: 10px;
  }
  .custom-color-modal-content button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 25px;
      background: linear-gradient(90deg, #38bdf8, #22c55e);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
      margin-top: 10px;
  }
  .custom-color-modal-content button:hover {
      transform: scale(1.02);
      box-shadow: 0 5px 20px rgba(56, 189, 248, 0.4);
  }
  .custom-color-modal-content button.secondary {
      background: rgba(255, 255, 255, 0.1);
      margin-top: 10px;
  }
  .custom-color-modal-content button.secondary:hover {
      background: rgba(255, 255, 255, 0.2);
  }
    `
  document.head.appendChild( style )

  const colorPreview = modal.querySelector( '#colorPreview' )
  const colorPicker = modal.querySelector( '#customColorPicker' )
  const colorCode = modal.querySelector( '#customColorCode' )
  const colorImage = modal.querySelector( '#customColorImage' )

  function updatePreview ( color )
  {
    colorPreview.style.background = color
    colorPreview.style.boxShadow = `0 0 20px ${color}`
  }

  colorPicker.addEventListener( 'input', function ()
  {
    updatePreview( this.value )
    colorCode.value = this.value
  } )

  colorCode.addEventListener( 'input', function ()
  {
    updatePreview( this.value )
    colorPicker.value = this.value
  } )

  colorImage.addEventListener( 'change', function ( e )
  {
    const file = e.target.files[ 0 ]
    if ( file )
    {
      const reader = new FileReader()
      reader.onload = function ( event )
      {
        colorPreview.style.background = `url(${event.target.result}) center/cover`
        colorPreview.style.border = '3px solid #38bdf8'
      }
      reader.readAsDataURL( file )
    }
  } )

  modal.querySelector( '#applyCustomColor' ).addEventListener( 'click', function ()
  {
    const imageFile = colorImage.files[ 0 ]
    const colorCodeValue = colorCode.value
    const pickerValue = colorPicker.value

    if ( imageFile )
    {
      const reader = new FileReader()
      reader.onload = function ( event )
      {
        selectedCustomColor = {
          type: 'image',
          name: imageFile.name,
          data: event.target.result,
          colorCode: colorCodeValue || pickerValue
        }
        isCustomColorSelected = true
        const bottleColorSelect = document.getElementById( 'bottleColor' )
        if ( bottleColorSelect ) bottleColorSelect.value = 'Custom Color'
        showMessage( `✓ Custom color applied!`, 'success' )
        modal.remove()
      }
      reader.readAsDataURL( imageFile )
    } else if ( colorCodeValue )
    {
      selectedCustomColor = {
        type: 'code',
        value: colorCodeValue,
        colorCode: colorCodeValue
      }
      isCustomColorSelected = true
      const bottleColorSelect = document.getElementById( 'bottleColor' )
      if ( bottleColorSelect ) bottleColorSelect.value = 'Custom Color'
      showMessage( `✓ Custom color "${colorCodeValue}" applied!`, 'success' )
      modal.remove()
    } else if ( pickerValue )
    {
      selectedCustomColor = {
        type: 'picker',
        value: pickerValue,
        colorCode: pickerValue
      }
      isCustomColorSelected = true
      const bottleColorSelect = document.getElementById( 'bottleColor' )
      if ( bottleColorSelect ) bottleColorSelect.value = 'Custom Color'
      showMessage( `✓ Custom color applied!`, 'success' )
      modal.remove()
    } else
    {
      showMessage( 'Please select a color by image, color code, or color picker!', 'error' )
    }
  } )

  modal.querySelector( '#cancelCustomColor' ).addEventListener( 'click', () =>
  {
    modal.remove()
    if ( !isCustomColorSelected )
    {
      const bottleColorSelect = document.getElementById( 'bottleColor' )
      if ( bottleColorSelect ) bottleColorSelect.value = ''
    }
  } )

  modal.querySelector( '.close-modal' ).addEventListener( 'click', () =>
  {
    modal.remove()
    if ( !isCustomColorSelected )
    {
      const bottleColorSelect = document.getElementById( 'bottleColor' )
      if ( bottleColorSelect ) bottleColorSelect.value = ''
    }
  } )

  modal.addEventListener( 'click', ( e ) =>
  {
    if ( e.target === modal )
    {
      modal.remove()
      if ( !isCustomColorSelected )
      {
        const bottleColorSelect = document.getElementById( 'bottleColor' )
        if ( bottleColorSelect ) bottleColorSelect.value = ''
      }
    }
  } )
}

