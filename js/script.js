"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !isOpen);
    });
    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  const slider = document.querySelector("[data-slider]");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-slide-to]"));
    let activeIndex = 0;
    let timerId;
    const showSlide = (nextIndex) => {
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, index) => {
        const active = index === activeIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", String(active));
      });
    };
    const restartTimer = () => {
      window.clearInterval(timerId);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timerId = window.setInterval(() => showSlide(activeIndex + 1), 6000);
      }
    };
    document.querySelector("[data-slide-prev]")?.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      restartTimer();
    });
    document.querySelector("[data-slide-next]")?.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      restartTimer();
    });
    dots.forEach((dot) => dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideTo));
      restartTimer();
    }));
    slider.addEventListener("mouseenter", () => window.clearInterval(timerId));
    slider.addEventListener("mouseleave", restartTimer);
    restartTimer();
  }

  const calculator = document.querySelector("#trip-calculator");
  if (calculator instanceof HTMLFormElement) {
    const result = document.querySelector("#calculator-result");
    const prices = { bali: 180, japan: 260, italy: 290, "new-zealand": 240 };
    const multipliers = { budget: 0.8, standard: 1, luxury: 1.65 };
    const currency = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 });
    calculator.addEventListener("submit", (event) => {
      event.preventDefault();
      const destination = calculator.elements.namedItem("destination").value;
      const travellers = Number(calculator.elements.namedItem("travellers").value);
      const days = Number(calculator.elements.namedItem("days").value);
      const style = calculator.querySelector('input[name="style"]:checked')?.value;
      const destinationInput = calculator.elements.namedItem("destination");
      const travellersInput = calculator.elements.namedItem("travellers");
      const daysInput = calculator.elements.namedItem("days");
      const invalid = !Object.hasOwn(prices, destination) || !Number.isInteger(travellers) || travellers < 1 || travellers > 20 || !Number.isInteger(days) || days < 1 || days > 90 || !Object.hasOwn(multipliers, style);
      if (invalid) {
        calculator.reportValidity();
        const missing = !destination || !travellers || !days || !style;
        if (missing) {
          if (!destination) destinationInput.reportValidity();
          else if (!travellers || !Number.isInteger(travellers) || travellers < 1 || travellers > 20) travellersInput.reportValidity();
          else if (!days || !Number.isInteger(days) || days < 1 || days > 90) daysInput.reportValidity();
          else calculator.querySelector('input[name="style"]').focus();
        } else {
          result.hidden = false;
          result.textContent = "Please choose a valid destination, traveller count, trip length and travel style.";
        }
        return;
      }
      const total = prices[destination] * travellers * days * multipliers[style];
      result.innerHTML = `<span class="eyebrow">YOUR ILLUSTRATIVE ESTIMATE</span><strong>${currency.format(total)}</strong><p>${travellers} traveller${travellers === 1 ? "" : "s"} · ${days} day${days === 1 ? "" : "s"} · ${style.charAt(0).toUpperCase() + style.slice(1)} style. This is an estimate, not a confirmed quotation.</p>`;
      result.hidden = false;
    });
    calculator.addEventListener("reset", () => {
      window.setTimeout(() => {
        if (result) {
          result.hidden = true;
          result.replaceChildren();
        }
      }, 0);
    });
  }

  document.querySelectorAll("form[data-form]").forEach((form) => {
    if (!(form instanceof HTMLFormElement)) return;
    const feedback = form.querySelector(".form-feedback");
    if (!(feedback instanceof HTMLElement)) return;
    const dateField = form.querySelector('input[type="date"]');
    if (dateField instanceof HTMLInputElement) {
      dateField.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }
    const phoneField = form.querySelector('input[type="tel"]');
    const validatePhone = () => {
      if (phoneField instanceof HTMLInputElement) {
        const digitCount = phoneField.value.replace(/\D/g, "").length;
        phoneField.setCustomValidity(phoneField.value && (digitCount < 8 || digitCount > 15)
          ? "Enter a phone number containing 8 to 15 digits."
          : "");
      }
    };
    if (phoneField instanceof HTMLInputElement) {
      phoneField.addEventListener("input", validatePhone);
    }
    form.addEventListener("input", () => {
      feedback.hidden = true;
      feedback.classList.remove("is-error");
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      validatePhone();
      if (!form.checkValidity()) {
        form.reportValidity();
        feedback.textContent = "Please check the highlighted fields and complete the form before continuing.";
        feedback.classList.add("is-error");
        feedback.hidden = false;
        form.querySelector(":invalid")?.focus();
        return;
      }

      const sendButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);
      formData.set("_replyto", String(formData.get("email")));
      formData.set("_subject", form.dataset.form === "appointment"
        ? "WanderLux appointment request"
        : `WanderLux enquiry: ${String(formData.get("subject"))}`);
      sendButton.disabled = true;
      sendButton.textContent = "Sending…";
      feedback.hidden = true;
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        if (!response.ok) {
          let detail = "";
          try {
            const payload = await response.json();
            detail = Array.isArray(payload.errors)
              ? ` ${payload.errors.map((item) => item.message).filter(Boolean).join(" ")}`
              : "";
          } catch (error) {
            console.warn("Could not read the Formspree error response:", error);
          }
          throw new Error(`Formspree rejected the submission (${response.status}).${detail}`);
        }
        feedback.textContent = form.dataset.form === "appointment"
          ? "Your appointment request has been sent to the agency. It is not a confirmed booking; the agency will need to contact you to confirm availability."
          : "Your message has been sent successfully. Thank you for getting in touch.";
        feedback.classList.remove("is-error");
        feedback.hidden = false;
        feedback.focus();
        form.reset();
      } catch (error) {
        console.error(`Formspree ${form.dataset.form} form submission failed:`, error);
        feedback.textContent = "We couldn't send your request. Please check your connection and try again, or contact the agency by phone.";
        feedback.classList.add("is-error");
        feedback.hidden = false;
        feedback.focus();
      } finally {
        sendButton.disabled = false;
        sendButton.innerHTML = form.dataset.form === "appointment"
          ? 'Send appointment request <span aria-hidden="true">↗</span>'
          : 'Send your message <span aria-hidden="true">↗</span>';
      }
    });
  });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});
