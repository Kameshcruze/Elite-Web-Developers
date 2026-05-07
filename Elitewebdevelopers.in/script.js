const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const parallaxImages = document.querySelectorAll(".scroll-image");
const tiltCards = document.querySelectorAll(".service-card, .work-card, .plan-card");
const cursorLight = document.querySelector(".cursor-light");
const contactForm = document.querySelector("[data-contact-form]");

const whatsappNumber = "917339472219";
const mobileMotionQuery = window.matchMedia("(max-width: 760px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    header.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      header.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => observer.observe(item));

const imageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-image-visible", entry.isIntersecting);
    });
  },
  {
    threshold: 0.22,
    rootMargin: "0px 0px -6% 0px",
  }
);

parallaxImages.forEach((image) => imageObserver.observe(image));

let ticking = false;

const updateParallax = () => {
  if (reducedMotionQuery.matches) {
    ticking = false;
    return;
  }

  const viewportHeight = window.innerHeight;
  const isMobile = mobileMotionQuery.matches;
  const multiplier = isMobile ? -0.28 : -0.16;
  const scale = isMobile ? 1.075 : 1.04;
  const movementLimit = isMobile ? 44 : 70;

  parallaxImages.forEach((image) => {
    const speed = Number(image.dataset.speed || 0);
    const rect = image.getBoundingClientRect();
    const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
    const rawMovement = distanceFromCenter * speed * multiplier;
    const movement = Math.max(-movementLimit, Math.min(movementLimit, rawMovement));
    image.style.transform = `translate3d(0, ${movement.toFixed(2)}px, 0) scale(${scale})`;
  });

  ticking = false;
};

const requestParallax = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
};

requestParallax();
window.addEventListener("scroll", requestParallax, { passive: true });
window.addEventListener("resize", requestParallax);

tiltCards.forEach((card) => {
  card.classList.add("tilt-card");

  card.addEventListener("pointermove", (event) => {
    if (reducedMotionQuery.matches) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = ((y / rect.height) - 0.5) * -5;

    card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });

  card.addEventListener(
    "touchstart",
    () => {
      if (!reducedMotionQuery.matches) {
        card.classList.add("is-touch-active");
      }
    },
    { passive: true }
  );

  ["touchend", "touchcancel"].forEach((eventName) => {
    card.addEventListener(eventName, () => {
      card.classList.remove("is-touch-active");
    });
  });
});

if (cursorLight) {
  window.addEventListener("pointermove", (event) => {
    if (mobileMotionQuery.matches) {
      cursorLight.style.opacity = "0";
      return;
    }

    cursorLight.style.opacity = "1";
    cursorLight.style.transform = `translate3d(${event.clientX - 90}px, ${event.clientY - 90}px, 0)`;
  });

  document.addEventListener("mouseleave", () => {
    cursorLight.style.opacity = "0";
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name") || "";
    const business = formData.get("business") || "";
    const need = formData.get("need") || "";
    const message = formData.get("message") || "";

    const text = [
      "Hi Elite Web Developers, I want to start a project.",
      `Name: ${name}`,
      `Business type: ${business}`,
      `Project need: ${need}`,
      `Message: ${message}`,
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });
}
