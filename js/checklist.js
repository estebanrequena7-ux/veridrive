/**
 * VERIDRIVE — Module Checklist d'achat
 * Données, rendu dynamique, progression et verdict
 *
 * Architecture :
 *  1. DONNÉES — Les 6 étapes avec leurs items et conseils
 *  2. ÉTAT   — Suivi des cases cochées en mémoire de page
 *  3. RENDU  — Injection du HTML dans les sections squelettes
 *  4. UI     — Mise à jour de la barre de progression et du verdict
 *  5. INIT   — Point d'entrée
 */

'use strict';

/* ============================================================
   1. DONNÉES — Contenu de la checklist
   ============================================================ */

const CHECKLIST_DATA = [

    /* ── Étape 1 ─────────────────────────────────────────── */
    {
        id: 1,
        title: 'Avant de se déplacer',
        items: [
            {
                id: '1-1',
                text: 'Le prix est cohérent avec le marché',
                detail: 'Comparez sur La Centrale, LeBonCoin ou consultez la cote Argus. Un prix très en dessous du marché doit alerter autant qu\'un prix trop élevé : le vendeur compense peut-être un défaut caché ou cherche à vendre en urgence. Une différence de plus de 15 % avec la cote mérite explication.',
                critical: false
            },
            {
                id: '1-2',
                text: 'L\'annonce est complète et les photos semblent réelles',
                detail: 'Une annonce avec une seule photo ou des images floues/génériques est suspecte. Demandez des photos supplémentaires : intérieur, tableau de bord, carnet d\'entretien, contrôle technique. Un vendeur de bonne foi y répondra volontiers. Méfiez-vous aussi des annonces copiées-collées d\'une autre.',
                critical: false
            },
            {
                id: '1-3',
                text: 'Le vendeur accepte un rendez-vous en journée dans un lieu normal',
                detail: 'Insistez pour voir la voiture de jour, en pleine lumière. Les défauts de carrosserie, la rouille et les teintes de peinture se voient beaucoup moins la nuit. Un refus de rendez-vous en journée, un lieu inhabituel (parking désert, bord d\'autoroute) ou une pression pour décider vite sont des signaux d\'alarme sérieux.',
                critical: true
            },
            {
                id: '1-4',
                text: 'Vous avez consulté Histovec avant de vous déplacer',
                detail: 'Histovec (histovec.interieur.gouv.fr) est le service officiel GRATUIT du Ministère de l\'Intérieur. Avec la plaque d\'immatriculation, vous accédez à l\'historique administratif : changements de propriétaires, kilométrages relevés aux contrôles techniques successifs, procédures en cours. Demandez la plaque au vendeur avant de faire le déplacement.',
                critical: false
            },
            {
                id: '1-5',
                text: 'Le statut du vendeur (particulier ou professionnel) est clair',
                detail: 'Un particulier qui vend plusieurs voitures simultanément peut légalement être considéré comme un professionnel non déclaré. Vérifiez ses autres annonces sur LeBonCoin. Acheter à un faux particulier vous prive de la garantie légale de conformité (2 ans pour un pro, inexistante pour un particulier). C\'est aussi un indice de sérieux général.',
                critical: false
            },
            {
                id: '1-6',
                text: 'Le kilométrage est crédible pour l\'âge du véhicule',
                detail: 'Un conducteur français roule entre 12 000 et 15 000 km par an en moyenne. Une voiture de 8 ans à 40 000 km est suspecte (sauf utilisation très occasionnelle documentée). À l\'inverse, 200 000 km ne sont pas rédhibitoires si l\'entretien est rigoureux et tracé. Comparez avec les kilométrages relevés sur Histovec.',
                critical: false
            }
        ],
        tip: 'Avant de vous déplacer, notez les kilométrages relevés lors des contrôles techniques sur Histovec et comparez-les avec le compteur actuel. S\'ils ne concordent pas, vous avez immédiatement un argument solide — soit pour ne pas faire le déplacement, soit pour négocier fermement sur place.'
    },

    /* ── Étape 2 ─────────────────────────────────────────── */
    {
        id: 2,
        title: 'L\'extérieur',
        items: [
            {
                id: '2-1',
                text: 'Pas d\'ondulations visibles en regardant la carrosserie en contre-jour',
                detail: 'Placez-vous au niveau du flanc de la voiture et regardez la surface avec la lumière derrière vous. Des ondulations, des zones mates ou des reflets hétérogènes révèlent du mastic de carrosserie — signe d\'une réparation après accident. Ce n\'est pas forcément rédhibitoire, mais ça doit se négocier et mérite de demander les factures.',
                critical: false
            },
            {
                id: '2-2',
                text: 'Les jeux de carrosserie sont réguliers de tous les côtés',
                detail: 'Examinez les espaces entre les éléments : portières, capot, coffre, ailes. Ils doivent être réguliers et symétriques gauche/droite. Un jeu plus large d\'un côté ou un alignement imparfait signale un accident avec déformation ou remplacement d\'élément. Comparez systématiquement un côté avec l\'autre.',
                critical: false
            },
            {
                id: '2-3',
                text: 'Pas de rouille structurelle sur les bas de caisse et passages de roues',
                detail: 'La rouille sur les soubassements (bas de caisse, longerons, passages de roues) peut compromettre la sécurité du véhicule et entraîner un échec au contrôle technique. Elle est souvent coûteuse ou impossible à traiter durablement. Utilisez une lampe de poche et regardez sous le véhicule. Sur les autos de plus de 10 ans ou venant de régions salées, c\'est un point majeur.',
                critical: true
            },
            {
                id: '2-4',
                text: 'Les pneus sont en bon état et usés de manière régulière',
                detail: 'Vérifiez la profondeur des sculptures (minimum légal : 1,6 mm — témoin d\'usure affleurant ; recommandé : au moins 3 mm). Une usure plus marquée sur un bord qu\'un autre révèle un problème de géométrie ou de suspension. Des pneus de marques différentes sur un même essieu signalent un entretien négligé. Comptez 200 à 350 € pour refaire un essieu.',
                critical: false
            },
            {
                id: '2-5',
                text: 'Le pare-brise est intact, sans fissure dans le champ de vision',
                detail: 'Une fissure de plus de 30 cm ou dans le champ de vision du conducteur entraîne une contre-visite obligatoire au contrôle technique. Elle fragilise aussi la structure du toit en cas de tonneau. Le remplacement coûte entre 200 € (simple) et 800 € (avec ADAS calibrés). À vérifier systématiquement.',
                critical: true
            },
            {
                id: '2-6',
                text: 'Tous les feux fonctionnent (position, croisement, clignotants, recul)',
                detail: 'Testez chaque feu : feux de position, croisement, route, clignotants avant et arrière, feux de brouillard, feux de recul. Un feu hors service peut entraîner une contre-visite au CT. C\'est aussi un indicateur global d\'entretien courant : si le propriétaire ne change pas une ampoule, il ne change probablement pas l\'huile non plus.',
                critical: false
            }
        ],
        tip: 'Si vous repérez une zone réparée ou un jeu de carrosserie irrégulier, ne partez pas immédiatement. Demandez calmement au vendeur si la voiture a eu un accident. Sa réaction en dit souvent autant que sa réponse. S\'il admet une réparation, demandez la facture de carrossier — cela vous permet d\'évaluer la qualité et de négocier 10 à 20 % sur le prix.'
    },

    /* ── Étape 3 ─────────────────────────────────────────── */
    {
        id: 3,
        title: 'L\'intérieur',
        items: [
            {
                id: '3-1',
                text: 'L\'usure intérieure est cohérente avec le kilométrage affiché',
                detail: 'La fraude au compteur (remise à zéro ou modification) est l\'une des arnaques les plus répandues. À 50 000 km, un intérieur doit être quasi-neuf. À 150 000 km, le volant montre des traces d\'usure, les gommes de pédale sont marquées, le levier de vitesse est patiné. Une incohérence flagrante — intérieur très usé pour un faible kilométrage — doit stopper l\'achat.',
                critical: true
            },
            {
                id: '3-2',
                text: 'Aucun voyant ne reste allumé après le démarrage',
                detail: 'Après le démarrage à froid, tous les voyants s\'allument brièvement (autotest), puis s\'éteignent. Un voyant qui reste allumé — moteur, ABS, ESP, airbag, huile, température — signale un défaut enregistré par l\'électronique. Certains vendeurs effacent temporairement les codes défaut : ils reviennent sous quelques kilomètres. Un voyant airbag allumé peut signifier que le système est défaillant.',
                critical: true
            },
            {
                id: '3-3',
                text: 'Aucune odeur d\'humidité ou de moisissure dans l\'habitacle',
                detail: 'Une odeur de moisi persistante révèle une infiltration d\'eau : joint de pare-brise, joint de coffre, trappe de toit solaire ou joint de portière défectueux. Ces problèmes d\'étanchéité sont souvent longs et coûteux à résoudre, avec des risques de corrosion sous la moquette. Vérifiez aussi sous les tapis avant et dans le fond du coffre.',
                critical: false
            },
            {
                id: '3-4',
                text: 'La climatisation refroidit efficacement',
                detail: 'Lancez la climatisation au maximum et attendez 2 minutes. L\'air doit être franchement froid. Une clim qui souffle à peine frais nécessite une recharge de gaz (50 à 150 €). Si elle ne refroidit pas du tout, le compresseur peut être en cause (400 à 800 €). Vérifiez aussi que le chauffage monte en température normalement — un thermostat défaillant coûte 150 à 400 €.',
                critical: false
            },
            {
                id: '3-5',
                text: 'Tous les équipements électriques fonctionnent',
                detail: 'Testez méthodiquement : vitres électriques (toutes), rétroviseurs électriques et chauffants, verrouillage centralisé, radio/GPS, port USB, caméra de recul, capteurs de stationnement, régulateur/limiteur de vitesse. Une panne électronique peut rapidement chiffrer à plusieurs centaines d\'euros chez un électricien auto.',
                critical: false
            },
            {
                id: '3-6',
                text: 'L\'état général de l\'habitacle est cohérent avec l\'usage déclaré',
                detail: 'Un siège conducteur très affaissé, un volant poli jusqu\'à l\'os, des plastiques cassés ou des taches indélébiles révèlent un entretien négligé. C\'est un indicateur global du soin apporté au véhicule : quelqu\'un qui prend soin de l\'intérieur prend en général soin du moteur aussi, et inversement.',
                critical: false
            }
        ],
        tip: 'Si vous possédez un lecteur OBD2 (disponible à moins de 20 € sur Amazon), branchez-le sur la prise diagnostique sous le tableau de bord avant même de démarrer. Il lit les codes défaut actifs et — selon le modèle — ceux récemment effacés. C\'est particulièrement utile si vous avez un doute sur un voyant moteur qui s\'est mystérieusement éteint avant votre visite.'
    },

    /* ── Étape 4 ─────────────────────────────────────────── */
    {
        id: 4,
        title: 'Le moteur et sous le capot',
        items: [
            {
                id: '4-1',
                text: 'Pas de traces de fuite d\'huile sous le moteur ou sur le sol',
                detail: 'Avant d\'ouvrir le capot, regardez sur le sol là où est garée la voiture. Des traces d\'huile fraîches trahissent une fuite active. Sous le capot, des dépôts gras et noirs sur les flancs du bloc moteur ou sous les joints indiquent des fuites. Une petite fuite n\'est pas forcément grave si elle est connue et traitée, mais elle doit être diagnostiquée avant achat.',
                critical: false
            },
            {
                id: '4-2',
                text: 'Les niveaux sont corrects : huile, liquide de refroidissement, frein',
                detail: 'Vérifiez chaque niveau avec les repères Min/Max. Des niveaux trop bas révèlent un manque d\'entretien ou une fuite non avouée. Un liquide de refroidissement de couleur marron-rouille (au lieu de vert ou rose selon la marque) n\'a pas été changé depuis longtemps et peut signaler une corrosion interne du circuit.',
                critical: false
            },
            {
                id: '4-3',
                text: 'L\'huile sur la jauge est d\'une couleur normale (pas laiteuse)',
                detail: 'L\'huile moteur peut aller du doré (huile neuve) au noir (huile usée) — c\'est normal selon la date de la dernière vidange. En revanche, une huile de couleur grise ou laiteuse, ressemblant à du café au lait, est un signal d\'alarme majeur : elle indique un mélange d\'eau dans l\'huile, symptôme classique d\'un joint de culasse grillé. La réparation est généralement coûteuse (souvent entre 800 et 2 500 €, parfois davantage selon le moteur). À fuir.',
                critical: true
            },
            {
                id: '4-4',
                text: 'Pas de fumée bleue ou blanche persistante à l\'échappement',
                detail: 'Demandez à démarrer le moteur froid si possible — les défauts sont plus visibles. Une fumée blanche persistante (pas la buée du matin en hiver, qui disparaît en 30 secondes) indique de l\'eau brûlée : joint de culasse, fissure de bloc ou de culasse. Une fumée bleue-grise signale de l\'huile brûlée : segments ou guides de soupapes usés. Ces deux symptômes annoncent une réparation lourde.',
                critical: true
            },
            {
                id: '4-5',
                text: 'La courroie de distribution a été changée (ou c\'est une chaîne)',
                detail: 'La courroie de distribution est le point d\'entretien le plus sous-estimé. Selon le constructeur, elle doit être remplacée entre 60 000 et 120 000 km, ou tous les 5 à 10 ans. Si elle casse, le moteur est généralement détruit (casse moteur : souvent 1 500 à 4 500 €). Demandez la facture. Si le moteur est équipé d\'une chaîne de distribution, elle est en principe conçue pour durer la vie du moteur, mais certains modèles présentent des chaînes connues pour se détendre avec l\'âge — renseignez-vous sur le modèle spécifique avant l\'achat.',
                critical: true
            },
            {
                id: '4-6',
                text: 'Le carnet d\'entretien est présent avec des révisions régulières',
                detail: 'Un carnet d\'entretien tamponné par des garages avec des dates et kilométrages cohérents est un excellent indicateur de sérieux. Des factures jointes (changement de courroie, freins, révisions majeures) renforcent la confiance. L\'absence totale de carnet n\'est pas illégale, mais elle doit influencer le prix à la baisse et incite à plus de vigilance technique.',
                critical: false
            }
        ],
        tip: 'Insistez pour démarrer le moteur froid. Si le vendeur vous dit "il tourne déjà", demandez-vous pourquoi il l\'a chauffé avant votre arrivée. Certains défauts (fumée, bruits de démarrage, voyants) disparaissent une fois le moteur chaud. Un vendeur honnête n\'a aucune raison de chauffer la voiture avant votre arrivée.'
    },

    /* ── Étape 5 ─────────────────────────────────────────── */
    {
        id: 5,
        title: 'L\'essai routier',
        items: [
            {
                id: '5-1',
                text: 'Le freinage est efficace, sans vibration ni tirage de côté',
                detail: 'Sur une route dégagée, freinez franchement depuis environ 70 km/h. La voiture doit s\'arrêter droit, sans que le volant ne vibre (signe de disques voilés) et sans dériver d\'un côté (étrier grippé ou plaquette inégale). L\'ABS doit se déclencher naturellement sans sensation de défaillance. Des freins à réviser coûtent 200 à 500 € selon l\'état des disques et plaquettes.',
                critical: true
            },
            {
                id: '5-2',
                text: 'L\'embrayage fonctionne normalement, sans patinage ni point haut',
                detail: 'À environ 50 km/h en 4e rapport, accélérez brusquement. Si le régime moteur monte sans que la vitesse suive, l\'embrayage patine — il est en fin de vie. Vérifiez aussi le point de patinage : sur un embrayage sain, il se situe vers le milieu de la course de la pédale. S\'il est très haut (pédale presque entièrement relevée, à peine effleurée), le remplacement est imminent. Comptez 400 à 900 € selon le modèle.',
                critical: false
            },
            {
                id: '5-3',
                text: 'Tous les rapports de vitesse s\'engagent facilement',
                detail: 'Testez tous les rapports dans les deux sens, y compris la marche arrière. Des difficultés à engager un rapport, des craquements ou un passage en force signalent un synchroniseur usé ou une fourchette défaillante. Sur boîte automatique, les passages de rapport doivent être imperceptibles, sans à-coups ni chocs. Un problème de boîte auto est souvent onéreux (500 à 2 000 €).',
                critical: false
            },
            {
                id: '5-4',
                text: 'La direction est précise, sans jeu excessif ni vibration',
                detail: 'Sur une route droite, relâchez légèrement le volant : la voiture doit tenir sa trajectoire. Un tirage persistant d\'un côté signale un problème de géométrie, de pneu ou de frein. Des vibrations à une vitesse donnée (souvent entre 80 et 120 km/h) indiquent un équilibrage à refaire ou, plus grave, un cardan usé. Un bruit de craquement en virage au ralenti pointe vers un cardan défaillant (200 à 500 €).',
                critical: false
            },
            {
                id: '5-5',
                text: 'Aucun bruit anormal pendant l\'essai (cliquetis, grincements, sifflements)',
                detail: 'Faites l\'essai fenêtres ouvertes et moteur seul (radio coupée). Un cliquetis léger à froid qui disparaît n\'est pas rare. En revanche : cliquetis persistant à l\'accélération (distribution, hydrauliques), grincement en virage lent (rotules, cardans), sifflement constant (turbo, courroie accessoire), bruit de cognement au freinage (étrier) méritent tous un diagnostic avant achat.',
                critical: false
            },
            {
                id: '5-6',
                text: 'Aucun voyant ne s\'allume pendant l\'essai routier',
                detail: 'Certains défauts n\'apparaissent que sous charge ou en mouvement. Un voyant ESP, ABS, contrôle moteur, température ou pression d\'huile qui s\'allume pendant le roulage nécessite un diagnostic complet chez un garagiste de confiance avant de finaliser l\'achat. Ne vous contentez pas des explications du vendeur sur ce point.',
                critical: true
            }
        ],
        tip: 'Planifiez un itinéraire varié : quelques minutes en ville (embrayage, boîte, manœuvres), une route (bruits, direction, freinage appuyé) et si possible un tronçon à 90-110 km/h (tenue de cap, vibrations). Un vendeur qui cherche à limiter l\'essai à un tour de quartier protège quelque chose. Insistez, ou prenez cela comme un signal pour partir.'
    },

    /* ── Étape 6 ─────────────────────────────────────────── */
    {
        id: 6,
        title: 'Les papiers et l\'administratif',
        items: [
            {
                id: '6-1',
                text: 'La carte grise correspond bien au véhicule et au vendeur',
                detail: 'Le nom sur la carte grise doit être celui du vendeur (ou de son conjoint, avec justificatif). Vérifiez que la plaque d\'immatriculation, la couleur, la puissance fiscale et la date de première mise en circulation correspondent au véhicule devant vous. Méfiez-vous des procurations : achetez toujours au propriétaire réel inscrit sur la carte grise, ou exigez un mandat clair avec justificatif.',
                critical: true
            },
            {
                id: '6-2',
                text: 'Le contrôle technique est valide et sans contre-visite en suspens',
                detail: 'Pour les véhicules de plus de 4 ans, le contrôle technique doit dater de moins de 6 mois au moment de la vente (obligation légale pour le vendeur). Lisez le rapport en détail : les défaillances majeures (points rouges) imposent une contre-visite dans les 2 mois. Une contre-visite non levée rend la vente illicite. Demandez le rapport complet, pas seulement la vignette.',
                critical: true
            },
            {
                id: '6-3',
                text: 'Vérification Histovec : pas de gage, pas d\'opposition, pas de sinistre déclaré',
                detail: 'Histovec (histovec.interieur.gouv.fr) est gratuit et officiel. Il permet de détecter : un gage (la voiture sert de garantie à un crédit non remboursé — le créancier peut engager des poursuites sur le véhicule même après la vente, ce qui expose l\'acheteur à des complications juridiques sérieuses), une opposition (vol signalé, procédure judiciaire), ou un sinistre économique déclaré (voiture jugée "économiquement irréparable" après accident grave). L\'un de ces cas doit bloquer l\'achat.',
                critical: true
            },
            {
                id: '6-4',
                text: 'Le numéro VIN est identique sur la carte grise, le tableau de bord et le châssis',
                detail: 'Le VIN (Vehicle Identification Number) est le numéro de série unique du véhicule, composé de 17 caractères. Il figure sur une plaque rivetée sous le pare-brise côté conducteur, sur le châssis (sous le capot ou sous le plancher), et sur la carte grise. Si ces numéros ne concordent pas, ou si une plaque semble avoir été arrachée ou modifiée, arrêtez immédiatement : il peut s\'agir d\'un véhicule volé ou d\'une fraude grave.',
                critical: true
            },
            {
                id: '6-5',
                text: 'Le carnet d\'entretien et les factures importantes sont présents',
                detail: 'Un carnet d\'entretien avec tampons de garage, dates et kilométrages cohérents est un excellent signe de sérieux. Les factures de courroie de distribution, pneus, freins, révisions majeures apportent une preuve tangible de l\'entretien. Leur absence n\'est pas illégale, mais elle doit influencer le prix et vous incite à être plus vigilant sur les aspects mécaniques.',
                critical: false
            },
            {
                id: '6-6',
                text: 'Le certificat de cession (Cerfa 15776) sera rempli en double exemplaire',
                detail: 'Ce formulaire officiel (Cerfa n°15776) doit être rempli et signé par les deux parties en deux exemplaires originaux. L\'acheteur le conserve pour l\'immatriculation, le vendeur pour déclarer la cession à l\'ANTS dans les 15 jours (désormais obligatoirement en ligne sur ants.gouv.fr). La déclaration de cession dégage la responsabilité du vendeur pour toute infraction commise après la vente.',
                critical: false
            }
        ],
        tip: 'Prenez le temps de lire seul tous les documents, sans pression. Si le vendeur est pressé, c\'est son problème — pas le vôtre. Sur un achat de plusieurs milliers d\'euros, faire appel à un expert automobile indépendant (100 à 200 €) est souvent rentable. Ces professionnels établissent un rapport complet en 1 heure et peuvent débusquer des défauts cachés qui justifient une négociation importante.'
    }
];


/* ============================================================
   2. ÉTAT — Suivi des cases cochées en mémoire
   ============================================================ */

/* Calcule le nombre total d'items et d'items critiques */
const TOTAL_ITEMS    = CHECKLIST_DATA.reduce((acc, step) => acc + step.items.length, 0);
const TOTAL_CRITICAL = CHECKLIST_DATA.reduce(
    (acc, step) => acc + step.items.filter(i => i.critical).length, 0
);

/* Ensemble des IDs cochés (Set pour accès O(1)) */
const checkedItems = new Set();


/* ============================================================
   3. RENDU — Construction du DOM depuis les données
   ============================================================ */

/**
 * Génère le HTML d'un item de checklist
 */
function renderItem(item) {
    const criticalBadge = item.critical
        ? `<span class="badge-critical">
               <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                   <path d="M6 2V6.5M6 9V9.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
               </svg>
               Critique
           </span>`
        : '';

    return `
        <div class="check-item${item.critical ? ' check-item--critical' : ''}" data-id="${item.id}" data-critical="${item.critical}">
            <label class="check-item__label-row">
                <input
                    type="checkbox"
                    class="check-item__input"
                    id="item-${item.id}"
                    aria-label="${item.text}"
                >
                <div class="check-item__box" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="check-item__content">
                    <span class="check-item__text">
                        ${item.text}
                        ${criticalBadge}
                    </span>
                </div>
            </label>
            <details class="check-item__detail">
                <summary>
                    <svg class="detail-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Pourquoi c'est important ?
                </summary>
                <p class="check-item__explanation">${item.detail}</p>
            </details>
        </div>`;
}

/**
 * Génère le HTML d'une section d'étape complète
 */
function renderStep(step) {
    const stepNum    = String(step.id).padStart(2, '0');
    const itemsHTML  = step.items.map(renderItem).join('');

    return `
        <section class="step-section" id="step-${step.id}" data-step="${step.id}" scroll-margin-top>
            <div class="step-header">
                <div class="step-number">${stepNum}</div>
                <div class="step-header__content">
                    <h2 class="step-title">${step.title}</h2>
                    <p class="step-counter" id="step-counter-${step.id}">
                        <strong>0</strong> / ${step.items.length} points vérifiés
                    </p>
                </div>
                <div class="step-check" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            <div class="check-items-list" id="step-${step.id}-items">
                ${itemsHTML}
            </div>
            <div class="tip-card">
                <div class="tip-card__icon">💡</div>
                <div>
                    <p class="tip-card__title">Astuce</p>
                    <p class="tip-card__text">${step.tip}</p>
                </div>
            </div>
        </section>`;
}

/**
 * Injecte toutes les étapes dans le conteneur principal
 */
function renderChecklist() {
    const container = document.getElementById('checklist-container');
    if (!container) return;

    container.innerHTML = CHECKLIST_DATA.map(renderStep).join('');
}


/* ============================================================
   4. UI — Mise à jour en temps réel
   ============================================================ */

/**
 * Met à jour la barre de progression globale et les dots par étape
 */
function updateProgress() {
    const count   = checkedItems.size;
    const percent = TOTAL_ITEMS > 0 ? (count / TOTAL_ITEMS) * 100 : 0;

    /* Barre principale */
    const fill  = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');
    if (fill)  fill.style.width = `${percent}%`;
    if (label) label.innerHTML  = `<strong>${count}</strong> / ${TOTAL_ITEMS} points vérifiés`;

    /* Dots par étape */
    CHECKLIST_DATA.forEach(step => {
        const dot   = document.getElementById(`dot-step-${step.id}`);
        const done  = step.items.filter(i => checkedItems.has(i.id)).length;
        const total = step.items.length;

        if (!dot) return;
        dot.classList.remove('is-complete', 'is-partial');
        if (done === total)  dot.classList.add('is-complete');
        else if (done > 0)   dot.classList.add('is-partial');

        /* Compteur dans l'en-tête de l'étape */
        const counter = document.getElementById(`step-counter-${step.id}`);
        if (counter) {
            counter.innerHTML = `<strong>${done}</strong> / ${total} points vérifiés`;
        }

        /* Classe is-complete sur la section */
        const section = document.getElementById(`step-${step.id}`);
        if (section) section.classList.toggle('is-complete', done === total);
    });

    updateVerdict(count, percent);
}

/**
 * Calcule et affiche le verdict final
 */
function updateVerdict(count, percent) {
    const score = Math.round(percent);

    /* Identifier les points critiques non cochés */
    const uncheckedCriticals = CHECKLIST_DATA
        .flatMap(step => step.items)
        .filter(item => item.critical && !checkedItems.has(item.id));

    const hasCriticalIssues = uncheckedCriticals.length > 0;

    /* Choisir le niveau de verdict */
    let level, title, message;

    if (count === 0) {
        /* État initial — neutre */
        level   = 'neutral';
        title   = 'Votre verdict apparaîtra ici';
        message = 'Commencez à cocher les points au fur et à mesure de votre inspection. Le verdict se met à jour en temps réel.';
    } else if (hasCriticalIssues) {
        level   = 'critical';
        title   = 'Points critiques non validés';
        message = `${uncheckedCriticals.length} point${uncheckedCriticals.length > 1 ? 's' : ''} critique${uncheckedCriticals.length > 1 ? 's restent' : ' reste'} à vérifier. Ne finalisez pas l\'achat avant de les avoir contrôlés.`;
    } else if (score === 100) {
        level   = 'excellent';
        title   = 'Excellent bilan !';
        message = 'Tous les points ont été vérifiés et validés. Cette voiture semble saine et l\'achat peut être sérieusement envisagé.';
    } else if (score >= 75) {
        level   = 'good';
        title   = 'Bon bilan';
        message = 'Les points essentiels sont validés. Discutez avec le vendeur des quelques points restants avant de conclure.';
    } else if (score >= 50) {
        level   = 'average';
        title   = 'Bilan partiel';
        message = 'Plusieurs points n\'ont pas encore été vérifiés. Prenez le temps de compléter l\'inspection avant de vous décider.';
    } else {
        level   = 'poor';
        title   = 'Inspection incomplète';
        message = 'Moins de la moitié des points ont été vérifiés. Continuez l\'inspection pour avoir un verdict fiable.';
    }

    /* Mettre à jour le DOM */
    const section = document.getElementById('verdict');
    if (!section) return;

    section.dataset.level = level;

    /* Score dans la jauge SVG */
    const gaugeFill = document.getElementById('gauge-fill');
    const scoreNum  = document.getElementById('verdict-score-number');
    if (gaugeFill) {
        const circumference = 314; /* 2π × 50 */
        const offset = circumference - (score / 100) * circumference;
        gaugeFill.style.strokeDashoffset = offset;
    }
    if (scoreNum) scoreNum.textContent = `${score}%`;

    /* Titre et message */
    const titleEl   = document.getElementById('verdict-title');
    const messageEl = document.getElementById('verdict-message');
    if (titleEl)   titleEl.textContent   = title;
    if (messageEl) messageEl.textContent = message;

    /* Liste des critiques non cochés */
    const criticalList = document.getElementById('verdict-critical-list');
    if (criticalList) {
        if (hasCriticalIssues && count > 0) {
            criticalList.style.display = 'flex';
            const listItems = uncheckedCriticals
                .map(item => `<span class="verdict-critical-item">${item.text}</span>`)
                .join('');
            criticalList.innerHTML = `
                <span class="verdict-critical-label">⚠ À vérifier absolument</span>
                ${listItems}`;
        } else {
            criticalList.style.display = 'none';
        }
    }
}

/**
 * Gère le clic sur une case à cocher
 */
function handleCheck(event) {
    /* Remonter jusqu'à l'élément .check-item */
    const row  = event.target.closest('.check-item__label-row');
    if (!row) return;

    const item   = row.closest('.check-item');
    if (!item) return;

    const id     = item.dataset.id;
    const input  = item.querySelector('.check-item__input');
    const isChecked = input && input.checked;

    if (isChecked) {
        checkedItems.add(id);
        item.classList.add('is-checked');
    } else {
        checkedItems.delete(id);
        item.classList.remove('is-checked');
    }

    updateProgress();
}


/* ============================================================
   5. INIT — Point d'entrée
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* Rendu de la checklist */
    renderChecklist();

    /* Attacher les événements sur le conteneur (délégation) */
    const container = document.getElementById('checklist-container');
    if (container) {
        container.addEventListener('change', handleCheck);
    }

    /* État initial du verdict */
    updateVerdict(0, 0);

    /* Header scroll (réutilisé depuis main.js) */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('is-scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    /* Marquer le lien "Checklist" comme actif */
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        if (link.href.includes('checklist.html')) {
            link.classList.add('is-active');
        }
    });
});
