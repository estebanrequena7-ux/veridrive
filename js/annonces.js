'use strict';

/* ============================================================
   VERIDRIVE — MODULE ANNONCES
   Gère uniquement le widget "Test rapide de l'annonce" (Partie 3)
   et les effets de navigation.
   Aucun stockage navigateur : tout l'état est en mémoire de page.
   ============================================================ */


/* ──────────────────────────────────────────────────────────
   DONNÉES — Signaux du test rapide
   grave: true → signal rédhibitoire (rouge), false → vigilance (ambre)
────────────────────────────────────────────────────────── */

const TEST_SIGNALS = [
    {
        id: 'ts-1',
        label: 'Le vendeur est à l'étranger ou ne peut pas faire visiter',
        grave: true,
    },
    {
        id: 'ts-2',
        label: 'On me demande un acompte ou un virement avant la visite',
        grave: true,
    },
    {
        id: 'ts-3',
        label: 'Le prix est anormalement bas pour le modèle et le kilométrage',
        grave: true,
    },
    {
        id: 'ts-4',
        label: 'L'annonce est floue, sans photos, ou avec des photos génériques',
        grave: true,
    },
    {
        id: 'ts-5',
        label: 'Le vendeur insiste pour conclure rapidement',
        grave: false,
    },
    {
        id: 'ts-6',
        label: 'Le kilométrage semble très bas pour l'âge du véhicule',
        grave: false,
    },
    {
        id: 'ts-7',
        label: 'Plusieurs annonces identiques avec des numéros de contact différents',
        grave: false,
    },
    {
        id: 'ts-8',
        label: 'La description contient des formules de type "vendu en l'état", "sans garantie"',
        grave: false,
    },
    {
        id: 'ts-9',
        label: 'Le vendeur refuse de fournir le numéro de plaque ou le VIN à l'avance',
        grave: false,
    },
];

/* ──────────────────────────────────────────────────────────
   ÉTAT — Set en mémoire de page uniquement
────────────────────────────────────────────────────────── */

const checkedSignals = new Set();


/* ──────────────────────────────────────────────────────────
   RENDU — Widget test rapide
────────────────────────────────────────────────────────── */

function renderTestWidget() {
    const container = document.getElementById('test-signals-list');
    if (!container) return;

    const html = TEST_SIGNALS.map(signal => `
        <label
            class="test-signal-item${signal.grave ? ' is-grave' : ''}"
            id="label-${signal.id}"
            data-id="${signal.id}"
            data-grave="${signal.grave}"
        >
            <input
                type="checkbox"
                class="test-signal-input"
                id="${signal.id}"
                aria-label="${escapeHtml(signal.label)}"
            >
            <span class="test-signal-box" aria-hidden="true">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.8 7L9 1" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            ${signal.grave
                ? '<span class="test-signal-grave-dot" aria-hidden="true"></span>'
                : ''
            }
            <span class="test-signal-label">${escapeHtml(signal.label)}</span>
        </label>
    `).join('');

    container.innerHTML = html;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


/* ──────────────────────────────────────────────────────────
   LOGIQUE — Interactions
────────────────────────────────────────────────────────── */

function handleTestCheck(event) {
    if (event.target.type !== 'checkbox') return;

    const input = event.target;
    const label = input.closest('.test-signal-item');
    if (!label) return;

    const id = label.dataset.id;
    if (!id) return;

    if (input.checked) {
        checkedSignals.add(id);
        label.classList.add('is-checked');
    } else {
        checkedSignals.delete(id);
        label.classList.remove('is-checked');
    }

    updateTestVerdict();
}

function updateTestVerdict() {
    const verdictEl = document.getElementById('test-verdict');
    const levelEl   = document.getElementById('test-verdict-level');
    const messageEl = document.getElementById('test-verdict-message');
    if (!verdictEl || !levelEl || !messageEl) return;

    const total = checkedSignals.size;

    /* Compter les signaux graves cochés */
    let graveCount = 0;
    checkedSignals.forEach(id => {
        const signal = TEST_SIGNALS.find(s => s.id === id);
        if (signal && signal.grave) graveCount++;
    });

    let level, levelLabel, message;

    if (total === 0) {
        level      = 'neutral';
        levelLabel = 'Résultat';
        message    = 'Cochez les signaux présents dans l'annonce pour évaluer son niveau de risque.';
    } else if (graveCount >= 1) {
        level      = 'danger';
        levelLabel = 'Signal rouge — Risque élevé';
        message    = graveCount === 1
            ? 'L'un des signaux cochés est un signal grave. Ces situations correspondent souvent à des tentatives d'escroquerie. Ne versez aucun acompte et soyez très prudent avant de vous déplacer.'
            : `${graveCount} signaux graves sont présents. Cette annonce présente de forts indices d'arnaque. Il est fortement déconseillé de donner suite sans vérifications approfondies.`;
    } else if (total >= 3) {
        level      = 'caution';
        levelLabel = 'Vigilance accrue';
        message    = 'Plusieurs signaux de vigilance sont réunis. L'annonce n'est pas forcément frauduleuse, mais mérite des vérifications sérieuses avant tout déplacement.';
    } else if (total >= 1) {
        level      = 'watch';
        levelLabel = 'Point à surveiller';
        message    = 'Un ou deux signaux sont présents. Renseignez-vous davantage sur les points cochés avant de vous déplacer.';
    } else {
        level      = 'ok';
        levelLabel = 'Aucun signal détecté';
        message    = 'Aucun signal d'alerte n'a été détecté dans cette annonce. Cela ne garantit pas la fiabilité du vendeur, mais c'est un bon point de départ.';
    }

    verdictEl.setAttribute('data-level', level);
    levelEl.textContent   = levelLabel;
    messageEl.textContent = message;
}

function initReset() {
    const btn = document.getElementById('test-reset-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        checkedSignals.clear();

        document.querySelectorAll('.test-signal-item.is-checked').forEach(el => {
            el.classList.remove('is-checked');
        });

        document.querySelectorAll('.test-signal-input:checked').forEach(input => {
            input.checked = false;
        });

        updateTestVerdict();
    });
}

function initTestWidget() {
    const container = document.getElementById('test-signals-list');
    if (!container) return;

    container.addEventListener('change', handleTestCheck);
    updateTestVerdict();
}


/* ──────────────────────────────────────────────────────────
   HEADER — Effet de scroll (identique à main.js)
────────────────────────────────────────────────────────── */

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const THRESHOLD = 12;

    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > THRESHOLD);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}


/* ──────────────────────────────────────────────────────────
   NAVIGATION — Marque le lien actif
────────────────────────────────────────────────────────── */

function initNav() {
    document.querySelectorAll('.nav__link').forEach(link => {
        if (link.href.includes('annonces.html')) {
            link.classList.add('is-active');
        }
    });
}


/* ──────────────────────────────────────────────────────────
   ANIMATIONS — IntersectionObserver (identique à main.js)
────────────────────────────────────────────────────────── */

function initAnimations() {
    const STAGGER_MS = 100;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const delay = i * STAGGER_MS;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}


/* ──────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initNav();
    initAnimations();
    renderTestWidget();
    initTestWidget();
    initReset();
});
