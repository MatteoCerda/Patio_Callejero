// ========================================
// CONTENEDOR PRINCIPAL
// ========================================

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
    throw new Error("No se encontró el contenedor #app");
}


// ========================================
// RUTAS DE LAS PÁGINAS
// ========================================

const pages: Record<string, string> = {

    // Quiénes somos
    "nuestra-historia":
        "pages/quienes-somos/nuestra-historia.html",

    "nuestra-mision":
        "pages/quienes-somos/nuestra-mision.html",

    "nuestro-equipo":
        "pages/quienes-somos/nuestro-equipo.html",


    // Nuestra labor
    "nuestra-labor":
        "pages/nuestra-labor.html",


    // Donaciones
    "transparencia":
        "pages/dona/transparencia.html",


    // Voluntariado
    "formulario":
        "pages/hazte-voluntario/voluntarios.html",

    "requisitos":
        "pages/hazte-voluntario/requisitos.html",


    // FAQ
    "preguntas-frecuentes":
        "pages/faq.html"
};


// ========================================
// CARGAR PÁGINA
// ========================================
async function loadPage(page: string): Promise<void> {
    const app = document.querySelector<HTMLElement>("#app");

    if (!app) {
        throw new Error("No se encontró el contenedor #app");
    }

    const pagePath = pages[page];

    if (!pagePath) {
        console.error(`Página no encontrada: ${page}`);
        return;
    }

    try {

        const response = await fetch(pagePath);

        if (!response.ok) {
            throw new Error(
                `Error ${response.status}: ${response.statusText}`
            );
        }

        const html = await response.text();

        app.innerHTML = html;

        // Volver arriba después de cambiar de página
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

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

    const target = event.target as HTMLElement;

    const link = target.closest<HTMLAnchorElement>(
        "[data-page]"
    );

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

const dropdownButtons =
    document.querySelectorAll<HTMLButtonElement>(
        ".navdropdown-button"
    );

const dropdownItems =
    document.querySelectorAll<HTMLElement>(
        ".navitem--dropdown"
    );

const closeAllDropdowns = (
    except?: HTMLElement
): void => {
    dropdownItems.forEach((dropdown) => {
        if (dropdown === except) {
            return;
        }

        dropdown.classList.remove("is-open");

        const button = dropdown.querySelector<HTMLButtonElement>(
            ".navdropdown-button"
        );

        if (button) {
            button.setAttribute("aria-expanded", "false");
        }
    });
};

const isDesktop = (): boolean => {
    return window.innerWidth > 900;
};

let dropdownTimeout: ReturnType<typeof setTimeout> | null = null;

// Agregar event listeners para hover en desktop
dropdownItems.forEach((dropdown) => {
    const submenu = dropdown.querySelector<HTMLElement>(
        ".navsubmenu"
    );

    dropdown.addEventListener("mouseenter", () => {
        if (!isDesktop() || dropdownTimeout) {
            return;
        }

        if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
            dropdownTimeout = null;
        }

        dropdown.classList.add("is-open");
    });

    dropdown.addEventListener("mouseleave", () => {
        if (!isDesktop()) {
            return;
        }

        if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
        }

        dropdownTimeout = setTimeout(() => {
            dropdown.classList.remove("is-open");
            dropdownTimeout = null;
        }, 200);
    });
});

dropdownButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        const dropdown = button.closest<HTMLElement>(
            ".navitem--dropdown"
        );

        if (!dropdown) {
            return;
        }

        // En desktop, no hacer nada (el hover controla el dropdown)
        if (isDesktop()) {
            return;
        }

        // En mobile, alternar el estado
        const willOpen = !dropdown.classList.contains("is-open");

        closeAllDropdowns(dropdown);

        dropdown.classList.toggle("is-open", willOpen);

        button.setAttribute(
            "aria-expanded",
            String(willOpen)
        );
    });
});

document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    // Solo cerrar en mobile
    if (isDesktop()) {
        return;
    }

    if (!target.closest(".navitem--dropdown")) {
        closeAllDropdowns();
    }
});


// ========================================
// MENÚ MÓVIL
// ========================================

const navToggle =
    document.querySelector<HTMLButtonElement>(
        ".navtoggle"
    );

const nav =
    document.querySelector<HTMLElement>(".nav");

const updateSubmenuBounds = (): void => {
    if (!nav || !isDesktop()) {
        return;
    }

    const navBounds = nav.getBoundingClientRect();

    dropdownItems.forEach((dropdown) => {
        const submenu = dropdown.querySelector<HTMLElement>(
            ".navsubmenu"
        );

        submenu?.style.setProperty(
            "--submenu-left",
            `${navBounds.left}px`
        );

        submenu?.style.setProperty(
            "--submenu-width",
            `${navBounds.width}px`
        );
    });
};

updateSubmenuBounds();
window.addEventListener("resize", updateSubmenuBounds);


navToggle?.addEventListener("click", () => {

    if (!nav) {
        return;
    }

    const isOpen =
        nav.classList.toggle("is-open");

    navToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});
