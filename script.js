const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const tabs = document.querySelectorAll('.tab');
const panels = {
  code: document.getElementById('codePanel'),
  qr: document.getElementById('qrPanel')
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.tab;

    tabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');

    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle('active', key === selected);
    });
  });
});

function normalizeCode(value) {
  return value.trim().replace(/\s+/g, '').toUpperCase();
}

function getValidationStatus(code) {
  if (!code) {
    return {
      type: 'warning',
      icon: '!',
      title: 'Código requerido',
      text: 'Ingrese un código de validación para consultar el estado del documento.'
    };
  }

  if (code.includes('REV') || code.includes('ANUL')) {
    return {
      type: 'danger',
      icon: '×',
      title: 'Documento revocado',
      text: `El código ${code} figura como revocado o anulado en el sistema.`
    };
  }

  if (code.includes('VEN') || code.includes('EXP')) {
    return {
      type: 'warning',
      icon: '!',
      title: 'Documento vencido',
      text: `El código ${code} existe, pero su vigencia se encuentra vencida.`
    };
  }

  return {
    type: 'success',
    icon: '✓',
    title: 'Documento válido',
    text: `El código ${code} corresponde a un documento verificable y vigente.`
  };
}

function renderResult(target, status) {
  target.classList.remove('result-success', 'result-warning', 'result-danger');
  target.classList.add(`result-${status.type}`);
  target.innerHTML = `
    <span class="result-icon">${status.icon}</span>
    <div>
      <strong>${status.title}</strong>
      <p>${status.text}</p>
    </div>
  `;
}

const validationForm = document.getElementById('validationForm');
const validationCode = document.getElementById('validationCode');
const resultBox = document.getElementById('resultBox');
const simulateQr = document.getElementById('simulateQr');

validationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const code = normalizeCode(validationCode.value);
  renderResult(resultBox, getValidationStatus(code));
});

simulateQr?.addEventListener('click', () => {
  const simulatedCode = 'QR-DOC-2026-000123';
  renderResult(resultBox, getValidationStatus(simulatedCode));
});

const heroForm = document.getElementById('heroValidationForm');
const heroCode = document.getElementById('heroCode');
const heroResult = document.getElementById('heroResult');

heroForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = getValidationStatus(normalizeCode(heroCode.value));
  heroResult.classList.remove('result-success', 'result-warning', 'result-danger');
  heroResult.classList.add(`result-${status.type}`);
  heroResult.innerHTML = `
    <span class="check-icon">${status.icon}</span>
    <div>
      <strong>${status.title}</strong>
      <p>${status.text}</p>
    </div>
  `;
});

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  contactStatus.textContent = 'Solicitud registrada. Este formulario puede integrarse con email, CRM o backend propio.';
  contactForm.reset();
});
