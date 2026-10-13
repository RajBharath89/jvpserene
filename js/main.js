"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const enquiryModal = document.querySelector(".enquiry-modal");
const modalFormContainer = document.querySelector(".modal-form-container");
const modalClose = document.querySelector(".modal-close");
const enquiryCard = document.querySelector(".hero .enquiry-card");

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

  document.querySelectorAll('a[href="#enquiry"]').forEach((link) => {
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
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();
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
