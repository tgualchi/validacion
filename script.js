const CONFIG = {
  certificateDomain: "https://www.informespsicologicos.com",
  contactEmail: "sistemadevalidacionelectronica@gmail.com",
  whatsapp: "5491124028499"
};

function normalizeCertificateCode(value) {
  const clean = value.trim().toUpperCase();
  const match = clean.match(/^CERT[\s-]?(\d{4})[\s-]?(\d{3})$/);
  if (!match) return null;
  return `CERT-${match[1]}-${match[2]}`;
}

function setMessage(element, text, type = "") {
  element.textContent = text;
  element.className = `form-message ${type}`.trim();
}

function redirectToCertificate(code) {
  const slug = code.toLowerCase();
  window.location.href = `${CONFIG.certificateDomain}/${slug}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const validatorForm = document.getElementById("validatorForm");
  const certInput = document.getElementById("certCode");
  const validatorMessage = document.getElementById("validatorMessage");
  const validationPreview = document.getElementById("validationPreview");
  const previewCode = document.getElementById("previewCode");

  if (validatorForm && certInput && validatorMessage) {
    certInput.addEventListener("input", () => {
      const normalized = normalizeCertificateCode(certInput.value);

      if (normalized) {
        validationPreview.hidden = false;
        previewCode.textContent = normalized;
        setMessage(validatorMessage, "Formato reconocido. Puede validar el documento.", "success");
      } else {
        validationPreview.hidden = true;
        previewCode.textContent = "";
        if (certInput.value.trim().length > 0) {
          setMessage(validatorMessage, "Ingrese un código con formato CERT-2026-045.", "error");
        } else {
          setMessage(validatorMessage, "");
        }
      }
    });

    validatorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const normalized = normalizeCertificateCode(certInput.value);

      if (!normalized) {
        setMessage(validatorMessage, "Formato inválido. Use un código como CERT-2026-045.", "error");
        certInput.focus();
        return;
      }

      setMessage(validatorMessage, "Código válido. Redirigiendo al documento oficial...", "success");

      setTimeout(() => redirectToCertificate(normalized), 700);
    });
  }

  const contactForm = document.getElementById("contactForm");
  const contactMessage = document.getElementById("contactMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = new FormData(contactForm);
      const name = String(form.get("name") || "").trim();
      const email = String(form.get("email") || "").trim();
      const phone = String(form.get("phone") || "").trim();
      const message = String(form.get("message") || "").trim();

      if (!name || !email || !message) {
        setMessage(contactMessage, "Complete nombre, email y mensaje.", "error");
        return;
      }

      const subject = encodeURIComponent("Consulta - SVE Sistema de Validación Electrónica");
      const body = encodeURIComponent(
        `Nombre: ${name}\nEmail: ${email}\nTeléfono / WhatsApp: ${phone}\n\nMensaje:\n${message}`
      );

      setMessage(contactMessage, "Abriendo su cliente de correo...", "success");
      window.location.href = `mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
    });
  }

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
});
