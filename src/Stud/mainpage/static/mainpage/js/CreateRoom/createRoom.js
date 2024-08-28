function nextStep(currentStep) {
    document.getElementById(currentStep).classList.add('hidden');
    if (currentStep === 'form__roomName') {
      document.getElementById('form__roomDescription').classList.remove('hidden');
    } else if (currentStep === 'form__roomDescription') {
      document.getElementById('form__roomType').classList.remove('hidden');
    } else if (currentStep === 'form__roomType') {
      document.getElementById('form__welcome').classList.remove('hidden');
    }
  }
  
  function prevStep(currentStep) {
    document.getElementById(currentStep).classList.add('hidden');
    if (currentStep === 'form__roomDescription') {
      document.getElementById('form__roomName').classList.remove('hidden');
    } else if (currentStep === 'form__roomType') {
      document.getElementById('form__roomDescription').classList.remove('hidden');
    } else if (currentStep === 'form__welcome') {
      document.getElementById('form__roomType').classList.remove('hidden');
    }
  }