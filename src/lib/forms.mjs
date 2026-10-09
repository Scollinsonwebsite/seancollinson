// Accessible form builder. Labels are always visible, hints and errors are
// linked with aria-describedby, and the submit flow is handled in site.js.
import { forms } from '../config.mjs';
import { esc } from './render.mjs';

export const NON_CONFIDENTIAL_WARNING =
  'Do not submit confidential, privileged, or time-sensitive information through this form. Submitting this form does not create an attorney-client relationship or confirm acceptance of your matter.';

export function field({ name, label, type = 'text', required = false, autocomplete = '', hint = '', options = [], rows = 5, maxlength = '', width = '', idPrefix = 'f' }) {
  const id = `${idPrefix}-${name}`;
  const hintId = hint ? `${id}-hint` : '';
  const errId = `${id}-error`;
  const describedby = [hintId, errId].filter(Boolean).join(' ');
  const req = required ? ' required aria-required="true"' : '';
  const reqLabel = required ? ' <span class="field__req">(required)</span>' : ' <span class="field__opt">(optional)</span>';
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : '';
  const ml = maxlength ? ` maxlength="${maxlength}"` : '';
  const wrapCls = `field${width ? ' field--' + width : ''}`;
  const hintHtml = hint ? `<p class="field__hint" id="${hintId}">${hint}</p>` : '';
  const errHtml = `<p class="field__error" id="${errId}" hidden></p>`;

  if (type === 'radio') {
    return `<fieldset class="${wrapCls} field--choices"${required ? ' data-required-group' : ''} aria-describedby="${describedby}">
  <legend class="field__label">${esc(label)}${reqLabel}</legend>
  ${hintHtml}
  <div class="choices">${options
    .map(
      (o, i) => `<label class="choice"><input type="radio" name="${name}" value="${esc(o)}"${required && i === 0 ? ' required' : ''}> <span>${esc(o)}</span></label>`
    )
    .join('')}</div>
  ${errHtml}
</fieldset>`;
  }
  if (type === 'checkbox') {
    return `<div class="${wrapCls} field--consent">
  <label class="choice choice--consent"><input id="${id}" type="checkbox" name="${name}" value="yes"${req} aria-describedby="${errId}"> <span>${label}</span></label>
  ${errHtml}
</div>`;
  }
  let control;
  if (type === 'select') {
    control = `<select id="${id}" name="${name}"${req}${ac} aria-describedby="${describedby}">
    <option value="">Choose one</option>
    ${options.map((o) => `<option>${esc(o)}</option>`).join('')}
  </select>`;
  } else if (type === 'textarea') {
    control = `<textarea id="${id}" name="${name}" rows="${rows}"${req}${ml} aria-describedby="${describedby}"></textarea>`;
  } else {
    const inputmode = type === 'tel' ? ' inputmode="tel"' : '';
    control = `<input id="${id}" name="${name}" type="${type}"${req}${ac}${ml}${inputmode} aria-describedby="${describedby}">`;
  }
  return `<div class="${wrapCls}">
  <label class="field__label" for="${id}">${esc(label)}${reqLabel}</label>
  ${hintHtml}
  ${control}
  ${errHtml}
</div>`;
}

export function formShell({ type, title, intro = '', fieldsHtml, submitLabel, successMessage }) {
  const disabled = !forms.enabled;
  const notice = disabled
    ? `<div class="form__notice" role="note"><p><strong>This form is not accepting submissions yet.</strong> The office is connecting it to a secure delivery service. Please check back soon.</p></div>`
    : '';
  return `<form class="form" data-form="${type}" action="${esc(forms.endpoint)}" method="post" novalidate data-success="${esc(successMessage)}"${disabled ? ' data-disabled' : ''} aria-labelledby="${type}-form-title">
  <h2 class="form__title" id="${type}-form-title">${title}</h2>
  ${intro ? `<p class="form__intro">${intro}</p>` : ''}
  ${notice}
  <div class="form__summary" data-error-summary tabindex="-1" hidden>
    <h3 class="form__summary-title">Please correct the following before sending:</h3>
    <ul></ul>
  </div>
  <input type="hidden" name="form_type" value="${type}">
  <input type="hidden" name="_t" value="" data-timestamp>
  <div class="hp" aria-hidden="true"><label for="${type}-website">Leave this field empty</label><input id="${type}-website" type="text" name="company_website" tabindex="-1" autocomplete="off"></div>
  <div class="form__grid">
  ${fieldsHtml}
  </div>
  <div class="form__actions">
    <button class="btn btn--primary" type="submit"${disabled ? ' disabled aria-disabled="true"' : ''}>${esc(submitLabel)}</button>
    <p class="form__privacy">Your details are used only to respond to your request. See the <a href="/privacy-policy/">Privacy Policy</a>.</p>
  </div>
  <div class="form__status" role="status" aria-live="polite" data-status></div>
</form>`;
}

export const warning = () => `<div class="field field--full"><p class="form__warning" role="note">${NON_CONFIDENTIAL_WARNING}</p></div>`;

export const consentField = (label = 'I understand this form is for general, non-confidential information only, and I agree to be contacted about my request as described in the Privacy Policy.') =>
  field({ name: 'consent', label, type: 'checkbox', required: true, width: 'full' });

// Short pop-up request: first name, phone, email. Posts as form_type "quick".
export function quickRequestDialog() {
  const disabled = !forms.enabled;
  const f = (o) => field({ ...o, required: true, idPrefix: 'q' });
  return `<dialog class="modal" id="consult-modal" aria-labelledby="quick-form-title" data-consult-modal>
  <div class="modal__panel">
    <button class="modal__close" type="button" data-modal-close aria-label="Close consultation request"><span aria-hidden="true">&times;</span></button>
    <form class="form modal__form" data-form="quick" action="${esc(forms.endpoint)}" method="post" novalidate data-success="Thank you. Your request has been sent. It is not yet an appointment: the office will contact you to arrange a time."${disabled ? ' data-disabled' : ''} aria-labelledby="quick-form-title">
      <h2 class="form__title" id="quick-form-title">Request a consultation</h2>
      <p class="form__intro">Share your contact details and the office will reach out to arrange a time.</p>
      ${disabled ? '<div class="form__notice" role="note"><p><strong>This form is not accepting submissions yet.</strong> Please check back soon.</p></div>' : ''}
      <div class="form__summary" data-error-summary tabindex="-1" hidden>
        <h3 class="form__summary-title">Please correct the following before sending:</h3>
        <ul></ul>
      </div>
      <input type="hidden" name="form_type" value="quick">
      <input type="hidden" name="_t" value="" data-timestamp>
      <div class="hp" aria-hidden="true"><label for="quick-website">Leave this field empty</label><input id="quick-website" type="text" name="company_website" tabindex="-1" autocomplete="off"></div>
      <div class="modal__fields">
        ${f({ name: 'first_name', label: 'First name', autocomplete: 'given-name', maxlength: 80 })}
        ${f({ name: 'phone', label: 'Phone number', type: 'tel', autocomplete: 'tel', maxlength: 40 })}
        ${f({ name: 'email', label: 'Email address', type: 'email', autocomplete: 'email', maxlength: 160 })}
      </div>
      <div class="form__actions">
        <button class="btn btn--primary" type="submit"${disabled ? ' disabled aria-disabled="true"' : ''}>Submit</button>
      </div>
      <p class="form__privacy">Please do not include confidential information. Submitting this form does not create an attorney-client relationship. See the <a href="/privacy-policy/">Privacy Policy</a>.</p>
      <div class="form__status" role="status" aria-live="polite" data-status></div>
    </form>
  </div>
</dialog>`;
}
