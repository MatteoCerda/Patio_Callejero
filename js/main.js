"use strict";
// ========================================
// CONTENEDOR PRINCIPAL
// ========================================
const app = document.querySelector("#app");
if (!app) {
    throw new Error("No se encontró el contenedor #app");
}
// ========================================
// RUTAS DE LAS PÁGINAS
// ========================================
const pages = {
    // Quiénes somos
    "nuestra-historia": "pages/quienes-somos/nuestra-historia.html",
    "nuestra-mision": "pages/quienes-somos/nuestra-mision.html",
    "nuestro-equipo": "pages/quienes-somos/nuestro-equipo.html",
    // Nuestra labor
    "nuestra-labor": "pages/nuestra-labor.html",
    // Donaciones
    "transparencia": "pages/dona/transparencia.html",
    // Voluntariado
    "formulario": "pages/hazte-voluntario/voluntarios.html",
    "requisitos": "pages/hazte-voluntario/requisitos.html",
    // FAQ
    "preguntas-frecuentes": "pages/faq.html"
};
// ========================================
// CARGAR PÁGINA
// ========================================
async function loadPage(page) {
    const pagePath = pages[page];
    if (!pagePath) {
        console.error(`Página no encontrada: ${page}`);
        return;
    }
    try {
        const response = await fetch(pagePath);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const html = await response.text();
        app.innerHTML = html;
        // Volver arriba después de cambiar de página
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    catch (error) {
        console.error("Error al cargar la página:", error);
        app.innerHTML = `
            <section class="error-page">
                <h1>Ocurrió un error</h1>
                <p>
                    No pudimos cargar esta sección.
                    Inténtalo nuevamente.
                </p>
            </section>
        `;
    }
}
// ========================================
// NAVEGACIÓN
// ========================================
document.addEventListener("click", (event) => {
    const target = event.target;
    const link = target.closest("[data-page]");
    if (!link) {
        return;
    }
    event.preventDefault();
    const page = link.dataset.page;
    if (!page) {
        return;
    }
    loadPage(page);
});
// ========================================
// MENÚS DESPLEGABLES
// ========================================
const dropdownButtons = document.querySelectorAll(".navdropdown-button");
const dropdownItems = document.querySelectorAll(".navitem--dropdown");
const closeAllDropdowns = (except) => {
    dropdownItems.forEach((dropdown) => {
        if (dropdown === except) {
            return;
        }
        dropdown.classList.remove("is-open");
        const button = dropdown.querySelector(".navdropdown-button");
        if (button) {
            button.setAttribute("aria-expanded", "false");
        }
    });
};
dropdownButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        const dropdown = button.closest(".navitem--dropdown");
        if (!dropdown) {
            return;
        }
        const willOpen = !dropdown.classList.contains("is-open");
        closeAllDropdowns(dropdown);
        dropdown.classList.toggle("is-open", willOpen);
        button.setAttribute("aria-expanded", String(willOpen));
    });
});
document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest(".navitem--dropdown")) {
        closeAllDropdowns();
    }
});
// ========================================
// MENÚ MÓVIL
// ========================================
const navToggle = document.querySelector(".navtoggle");
const nav = document.querySelector(".nav");
navToggle?.addEventListener("click", () => {
    if (!nav) {
        return;
    }
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
});
//# sourceMappingURL=main.js.map