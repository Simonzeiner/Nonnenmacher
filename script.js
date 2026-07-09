const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const galleryTiles = document.querySelectorAll("[data-gallery] .project-tile");
const mailForm = document.querySelector("[data-mail-form]");
const legalDialog = document.getElementById("legal");
const lightbox = document.getElementById("lightbox");

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navToggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    header?.classList.remove("is-open");
  }
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -70px" })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) {
    revealObserver.observe(element);
  } else {
    element.classList.add("is-visible");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter ?? "all";
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    galleryTiles.forEach((tile) => {
      const visible = filter === "all" || tile.dataset.category === filter;
      tile.classList.toggle("is-hidden", !visible);
    });
  });
});

galleryTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const image = lightbox?.querySelector("img");
    const caption = lightbox?.querySelector("p");
    const full = tile.dataset.full;

    if (!lightbox || !image || !caption || !full) {
      return;
    }

    image.src = full;
    image.alt = tile.querySelector("img")?.alt ?? "Referenzbild";
    caption.textContent = tile.dataset.caption ?? "";
    lightbox.showModal();
  });
});

document.querySelector("[data-lightbox-close]")?.addEventListener("click", () => {
  lightbox?.close();
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

document.querySelector("[data-dialog-open='legal']")?.addEventListener("click", () => {
  legalDialog?.showModal();
});

document.querySelector("[data-dialog-close]")?.addEventListener("click", () => {
  legalDialog?.close();
});

legalDialog?.addEventListener("click", (event) => {
  if (event.target === legalDialog) {
    legalDialog.close();
  }
});

mailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(mailForm);
  const name = String(data.get("name") || "").trim();
  const type = String(data.get("type") || "").trim();
  const location = String(data.get("location") || "").trim();
  const message = String(data.get("message") || "").trim();
  const subject = `Projektanfrage: ${type || "Baudekoration"}`;
  const body = [
    "Guten Tag Herr Nonnenmacher,",
    "",
    "ich interessiere mich für folgendes Projekt:",
    "",
    `Name: ${name || "-"}`,
    `Projektart: ${type || "-"}`,
    `Ort: ${location || "-"}`,
    "",
    "Nachricht:",
    message || "-",
    "",
    "Bitte nehmen Sie Kontakt mit mir auf.",
    "",
    "Viele Grüße"
  ].join("\n");

  window.location.href = `mailto:info@baudekoration-nonnenmacher.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
