"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const enquiryModal = document.querySelector(".enquiry-modal");
const modalFormContainer = document.querySelector(".modal-form-container");
const modalClose = document.querySelector(".modal-close");
const enquiryCard = document.querySelector(".overview-section .enquiry-card");

if (enquiryModal && modalFormContainer && enquiryCard) {
  const modalCard = enquiryCard.cloneNode(true);
  modalCard.removeAttribute("id");

  const idMap = new Map();
  modalCard.querySelectorAll("[id]").forEach((element) => {
    const originalId = element.id;
    const modalId = `modal-${originalId}`;
    idMap.set(originalId, modalId);
    element.id = modalId;
  });
  modalCard.querySelectorAll("label[for]").forEach((label) => {
    const modalId = idMap.get(label.htmlFor);
    if (modalId) label.htmlFor = modalId;
  });
  modalFormContainer.append(modalCard);

  document.querySelectorAll("a.button, a.footer-contact-link, a[href=\"#enquiry\"]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (!enquiryModal.open) enquiryModal.showModal();
      enquiryModal.querySelector('input[name="name"]').focus();
    });
  });

  modalClose?.addEventListener("click", () => enquiryModal.close());
  enquiryModal.addEventListener("click", (event) => {
    if (event.target === enquiryModal) enquiryModal.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && enquiryModal.open) enquiryModal.close();
  });
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    mainNav.classList.toggle("is-open", !isExpanded);
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      mainNav.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      mainNav.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

document.querySelectorAll(".enquiry-form").forEach((enquiryForm) => {
  const formMessage = enquiryForm.querySelector(".form-message");
  if (!formMessage) return;

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;

    formMessage.textContent = "Form preview only: connect an enquiry service to receive this request.";
  });
});

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const header = document.querySelector(".site-header");
if (header) {
  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", header.getBoundingClientRect().top <= 0);
  };

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();
}

const turbulence = document.querySelector("#hero-water-turbulence");
if (turbulence && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const cycleDuration = 40000;
  let animationStart = null;

  const animateTurbulence = (timestamp) => {
    if (animationStart === null) animationStart = timestamp;

    const cycleProgress = ((timestamp - animationStart) % cycleDuration) / cycleDuration;
    const progress = (1 - Math.cos(cycleProgress * Math.PI * 2)) / 2;
    const frequencyX = 0.015 + progress * 0.005;
    const frequencyY = 0.1 + progress * 0.05;
    turbulence.setAttribute("baseFrequency", `${frequencyX} ${frequencyY}`);

    window.requestAnimationFrame(animateTurbulence);
  };

  window.requestAnimationFrame(animateTurbulence);
}
const navLinks = document.querySelectorAll(".main-nav a");
const sections = [...document.querySelectorAll("main section[id]")];

const updateActiveNav = () => {
  const scrollPosition = window.scrollY + 140;
  let currentId = sections[0]?.id;

  for (const section of sections) {
    if (section.offsetTop <= scrollPosition) currentId = section.id;
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
};

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

const galleryTrack = document.querySelector(".gallery-track");
const gallerySlides = document.querySelectorAll(".gallery-slide");
const galleryDots = document.querySelector(".gallery-dots");
const galleryButtons = document.querySelectorAll(".gallery-arrow");

if (galleryTrack && gallerySlides.length) {
  const dotCount = gallerySlides.length;
  const dots = [];

  for (let i = 0; i < dotCount; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => {
      const slideWidth = gallerySlides[0].getBoundingClientRect().width + 16;
      galleryTrack.scrollTo({ left: slideWidth * i, behavior: "smooth" });
    });
    galleryDots.appendChild(dot);
    dots.push(dot);
  }

  const updateGalleryState = () => {
    const slideWidth = gallerySlides[0].getBoundingClientRect().width + 16;
    const index = Math.round(galleryTrack.scrollLeft / slideWidth);
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  };

  galleryTrack.addEventListener("scroll", updateGalleryState, { passive: true });
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const slideWidth = gallerySlides[0].getBoundingClientRect().width + 16;
      const direction = button.dataset.direction === "next" ? 1 : -1;
      galleryTrack.scrollBy({ left: direction * slideWidth, behavior: "smooth" });
    });
  });

  updateGalleryState();
}

const faqItems = document.querySelectorAll(".faq-list details");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const plotViewer = document.querySelector("#plot-viewer");
const plotImageTrigger = document.querySelector(".plot-plan-image-trigger");
if (plotViewer instanceof HTMLDialogElement && plotImageTrigger) {
  plotImageTrigger.addEventListener("click", () => plotViewer.showModal());
  plotViewer.querySelector(".viewer-close")?.addEventListener("click", () => plotViewer.close());
  plotViewer.addEventListener("click", (event) => {
    if (event.target === plotViewer) plotViewer.close();
  });
}

const galleryViewer = document.querySelector("#gallery-viewer");
const galleryViewerImage = galleryViewer?.querySelector("img");
const galleryViewerCaption = galleryViewer?.querySelector("#gallery-viewer-caption");
if (
  galleryViewer instanceof HTMLDialogElement &&
  galleryViewerImage instanceof HTMLImageElement &&
  galleryViewerCaption
) {
  const openGalleryImage = (image) => {
    galleryViewerImage.src = image.currentSrc || image.src;
    galleryViewerImage.alt = image.alt;
    galleryViewerCaption.textContent = image.closest(".gallery-slide")?.querySelector("figcaption")?.textContent.trim() || image.alt;
    galleryViewer.showModal();
  };

  document.querySelectorAll(".gallery-slide img").forEach((image) => {
    image.setAttribute("role", "button");
    image.tabIndex = 0;
    image.setAttribute("aria-label", `View full-size image: ${image.alt}`);
    image.addEventListener("click", () => openGalleryImage(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGalleryImage(image);
      }
    });
  });

  galleryViewer.querySelector(".viewer-close")?.addEventListener("click", () => galleryViewer.close());
  galleryViewer.addEventListener("click", (event) => {
    if (event.target === galleryViewer) galleryViewer.close();
  });
  galleryViewer.addEventListener("close", () => {
    galleryViewerImage.removeAttribute("src");
  });
}
