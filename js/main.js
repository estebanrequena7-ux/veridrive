/**
 * VERIDRIVE — Script principal
 * Interactions d'interface : animations d'entrée, comportement du header
 */

'use strict';


/* ============================================================
   1. ANIMATIONS D'ENTRÉE — IntersectionObserver
   Révèle les éléments [data-animate] en cascade au scroll
   ============================================================ */

const initAnimations = () => {
    const elements = document.querySelectorAll('[data-animate]');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                /* Délai progressif en cascade : chaque élément attend
                   son propre délai (assigné plus bas) avant d'apparaître */
                const delay = parseInt(entry.target.dataset.animateDelay, 10) || 0;

                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                /* On arrête d'observer une fois l'animation jouée */
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        }
    );

    /* Assigner un délai progressif à chaque élément du hero */
    elements.forEach((el, index) => {
        /* Si un délai personnalisé existe, le respecter */
        if (!el.dataset.animateDelay) {
            el.dataset.animateDelay = index * 130; /* 130ms entre chaque élément */
        }
        observer.observe(el);
    });
};


/* ============================================================
   2. HEADER — Effet au défilement
   Ajoute la classe .is-scrolled quand la page défile
   ============================================================ */

const initHeader = () => {
    const header = document.getElementById('header');

    if (!header) return;

    const SCROLL_THRESHOLD = 12; /* pixels avant déclenchement */

    const handleScroll = () => {
        const isScrolled = window.scrollY > SCROLL_THRESHOLD;
        header.classList.toggle('is-scrolled', isScrolled);
    };

    /* Écouter le scroll avec passive:true pour les performances */
    window.addEventListener('scroll', handleScroll, { passive: true });

    /* Vérification au chargement (si la page arrive déjà défilée) */
    handleScroll();
};


/* ============================================================
   3. INITIALISATION
   Lance tous les modules au chargement complet du DOM
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initHeader();
});
