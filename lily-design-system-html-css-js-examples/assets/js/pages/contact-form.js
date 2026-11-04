// The page script of contact-form.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function() {
  'use strict';

  var form = document.querySelector('.form');
  var errorSummary = document.getElementById('error-summary');
  var errorList = document.getElementById('error-list');

  function clearErrors() {
    errorList.innerHTML = '';
    errorSummary.hidden = true;
    var msgs = document.querySelectorAll('.error-message');
    msgs.forEach(function(el) { el.hidden = true; el.textContent = ''; });
    var inputs = document.querySelectorAll('[aria-invalid]');
    inputs.forEach(function(el) { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-errormessage'); });
  }

  function addError(fieldId, message) {
    var errorEl = document.getElementById(fieldId + '-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
    var input = document.getElementById(fieldId);
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-errormessage', fieldId + '-error');
    }
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + fieldId;
    a.textContent = message;
    li.appendChild(a);
    errorList.appendChild(li);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();
    var hasErrors = false;

    if (!name) { addError('name', 'Name is required'); hasErrors = true; }
    if (!email) { addError('email', 'Email is required'); hasErrors = true; }
    else if (email.indexOf('@') === -1) { addError('email', 'Enter a valid email address'); hasErrors = true; }
    if (!message) { addError('message', 'Message is required'); hasErrors = true; }

    if (hasErrors) {
      errorSummary.hidden = false;
      errorSummary.focus();
      return;
    }

    document.getElementById('form-container').hidden = true;
    document.getElementById('success-name').textContent = name;
    document.getElementById('success-message').hidden = false;
  });
})();
