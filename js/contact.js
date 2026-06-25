/* ============================================
   CONTACT FORM VALIDATION — Angelo S. Enriquez
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  // Real-time validation on blur
  nameInput.addEventListener('blur', () => validateField(nameInput, errorName, validateName));
  emailInput.addEventListener('blur', () => validateField(emailInput, errorEmail, validateEmail));
  messageInput.addEventListener('blur', () => validateField(messageInput, errorMessage, validateMessage));

  // Clear error on input
  nameInput.addEventListener('input', () => clearError(nameInput, errorName));
  emailInput.addEventListener('input', () => clearError(emailInput, errorEmail));
  messageInput.addEventListener('input', () => clearError(messageInput, errorMessage));

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: "wCxlPqlQjhZx48bIN" });
  }

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = document.getElementById('honeypot-website');
    if (honeypot && honeypot.value !== "") {
        return; // silently return if bot fills the honeypot
    }

    const isNameValid = validateField(nameInput, errorName, validateName);
    const isEmailValid = validateField(emailInput, errorEmail, validateEmail);
    const isMessageValid = validateField(messageInput, errorMessage, validateMessage);

    if (isNameValid && isEmailValid && isMessageValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
      successMsg.classList.remove('visible'); // Hide any previous messages

      const companyInput = document.getElementById('contact-company');
      const typeInput = document.getElementById('contact-type');
      
      const companyVal = companyInput ? companyInput.value : '';
      const typeVal = typeInput ? typeInput.value : '';

      const fullMessage = (companyVal || typeVal)
        ? `Company: ${companyVal}\nProject Type: ${typeVal}\n\nMessage:\n${messageInput.value}`
        : messageInput.value;

      const templateParams = {
        from_name: nameInput.value,
        from_email: emailInput.value,
        subject: typeVal || "New Contact Submission",
        message: fullMessage
      };

      try {
        await emailjs.send(
            "service_c21luwn",
            "template_iobtnsh",
            templateParams
        );

        form.style.display = 'none';
        successMsg.textContent = "✓ Message sent successfully! I'll get back to you soon.";
        successMsg.style.color = "#34d399"; // Success color
        successMsg.classList.add('visible');

        // Reset after 5 seconds
        setTimeout(() => {
          form.reset();
          form.style.display = '';
          successMsg.classList.remove('visible');
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            Send Message
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
          `;
        }, 5000);

      } catch (error) {
        console.error("EmailJS Error:", error);
        successMsg.textContent = "Unable to send message. Please try again later.";
        successMsg.style.color = "#ef4444"; // Error color
        successMsg.classList.add('visible');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          Send Message
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
        `;
      }
    }
  });

  // --- Validators ---
  function validateName(value) {
    return value.trim().length >= 2;
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }

  function validateMessage(value) {
    return value.trim().length >= 10;
  }

  function validateField(input, errorEl, validatorFn) {
    const isValid = validatorFn(input.value);
    if (!isValid) {
      input.classList.add('error');
      errorEl.classList.add('visible');
    } else {
      input.classList.remove('error');
      errorEl.classList.remove('visible');
    }
    return isValid;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.classList.remove('visible');
  }
});
