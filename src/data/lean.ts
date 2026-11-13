// Contenu Duel Lean 4.0 – lexiques de démonstration fournis par Chiheb Ghalleb (seed de son application .NET)
// + le lexique Yamazumi (vidéo, article et quiz du webinaire NSAYEF SA3AA LEAN). Généré le 2026-11-13.
// Code d'un lexique : AA.BB.CC.DD.EE (5 niveaux, comme l'application de Chiheb – niveau « ceinture » à confirmer).
export interface LeanOption { t: string; x: string }
export interface LeanQuiz { q: string; data?: string; ok: number; why: string; options: LeanOption[] }
export type LexiconStatus = 'brouillon' | 'relu' | 'valide' | 'publie';
export interface Lexicon { code: string; title: string; definition: string; status: LexiconStatus; video: string; article: string; quizzes: LeanQuiz[] }

export const LABELS: Record<string, string> = {
  "01": "LM — Lean Manufacturing 4.0",
  "02": "LSC — Lean Supply Chain 4.0",
  "03": "LIT — Lean IT 4.0",
  "04": "LCS — Lean Change & Sustainability",
  "05": "LSS — Lean Six Sigma",
  "06": "LPR — Lean Project Management",
  "07": "LIN — Lean Innovation",
  "01.01": "Fondamentaux et standards",
  "01.02": "Flexibilité et changements de série",
  "01.03": "Performance des équipements",
  "02.01": "Flux tirés",
  "01.01.01": "Organisation du poste de travail",
  "01.01.02": "Analyse des flux",
  "01.02.01": "Réduction des temps de changement",
  "01.03.01": "Mesure de la performance",
  "02.01.01": "Pilotage par la consommation",
  "01.01.01.01": "Management visuel",
  "01.01.02.01": "Cartographie",
  "01.02.01.01": "SMED",
  "01.03.01.01": "Indicateurs machine",
  "02.01.01.01": "Systèmes à cartes",
  "01.01.02.02": "Équilibrage des postes"
};

export const LEXICONS: Lexicon[] = [
 {
  "code": "01.01.01.01.01",
  "title": "Les 5S",
  "definition": "Méthode d'organisation du poste de travail en cinq étapes (Trier, Ranger, Nettoyer, Standardiser, Respecter) qui rend les anomalies visibles et crée la discipline de base du Lean.",
  "status": "publie",
  "video": "/lean/videos/01.01.01.01.01.mp4",
  "article": "/lean/articles/01.01.01.01.01.pdf",
  "quizzes": [
   {
    "q": "Que signifie le premier S, « Seiri » ?",
    "ok": 0,
    "why": "Seiri = Trier : on ne garde au poste que ce qui est utile, en quantité juste nécessaire.",
    "options": [
     {
      "t": "Trier",
      "x": "Exact : on sépare l'utile de l'inutile et on élimine ce qui n'a rien à faire au poste."
     },
     {
      "t": "Ranger",
      "x": "C'est le 2e S, « Seiton » : une place pour chaque chose, chaque chose à sa place."
     },
     {
      "t": "Nettoyer",
      "x": "C'est le 3e S, « Seiso » : nettoyer pour inspecter."
     },
     {
      "t": "Standardiser",
      "x": "C'est le 4e S, « Seiketsu » : formaliser les règles des trois premiers S."
     }
    ]
   },
   {
    "q": "Pendant l'étape « Trier », que fait-on d'un objet dont personne ne sait s'il est encore utile ?",
    "ok": 1,
    "why": "La zone « étiquettes rouges » est une quarantaine : on y dépose les objets douteux, et ce qui n'est pas réclamé dans le délai fixé est éliminé.",
    "options": [
     {
      "t": "On le jette immédiatement",
      "x": "Risqué : on peut détruire un outil rare ou coûteux. Le tri se fait avec une règle, pas dans l'urgence."
     },
     {
      "t": "On lui pose une étiquette rouge et on le place en zone de quarantaine pour une durée définie",
      "x": "Exact : la quarantaine laisse le temps de réclamer l'objet, puis on décide (garder, déplacer, éliminer)."
     },
     {
      "t": "On le garde au poste, au cas où",
      "x": "C'est précisément ce réflexe « au cas où » qui encombre les postes et cache les gaspillages."
     },
     {
      "t": "On le range dans une armoire fermée",
      "x": "Cela déplace l'encombrement sans le traiter : le problème devient invisible, pas résolu."
     }
    ]
   },
   {
    "q": "Quel temps de recherche quotidien récupère-t-on si un bon « Ranger » supprime 80 % des recherches ?",
    "data": "Un opérateur cherche en moyenne 6 min par heure ses outils. Temps effectif : 7 h par poste, 2 postes par jour.",
    "ok": 2,
    "why": "6 min/h × 7 h × 2 postes = 84 min/jour de recherche ; 80 % de 84 = 67,2 min ≈ 67 min récupérées.",
    "options": [
     {
      "t": "34 min",
      "x": "C'est environ 40 % du temps de recherche : le pourcentage appliqué est faux."
     },
     {
      "t": "84 min",
      "x": "C'est le temps total de recherche, pas les 80 % supprimés."
     },
     {
      "t": "67 min",
      "x": "Exact : 84 min × 0,8 = 67,2 min par jour, soit plus d'une heure de travail utile."
     },
     {
      "t": "48 min",
      "x": "Calcul erroné (6 × 8) : il faut compter 7 h effectives sur 2 postes."
     }
    ]
   },
   {
    "q": "Le 3e S, « Seiso » (Nettoyer), vise avant tout à :",
    "ok": 3,
    "why": "Dans le Lean, nettoyer c'est inspecter : en touchant la machine, on détecte fuites, jeux, usures et vibrations avant la panne.",
    "options": [
     {
      "t": "Rendre l'atelier agréable pour les visites clients",
      "x": "C'est un effet secondaire bienvenu, pas l'objectif."
     },
     {
      "t": "Remplacer l'équipe de ménage",
      "x": "Le nettoyage 5S est fait par les opérateurs parce qu'il sert à l'inspection, pas à économiser un prestataire."
     },
     {
      "t": "Réduire le nombre d'outils au poste",
      "x": "C'est l'objectif de l'étape Trier (Seiri)."
     },
     {
      "t": "Nettoyer pour inspecter et détecter les anomalies (fuites, usures, desserrages)",
      "x": "Exact : le nettoyage est une inspection qui prépare la maintenance autonome (TPM)."
     }
    ]
   },
   {
    "q": "Quel outil illustre le mieux le 2e S, « Seiton » (Ranger) ?",
    "ok": 0,
    "why": "Le tableau à ombres (silhouettes des outils) donne une place unique et visible à chaque outil : un manque se voit d'un coup d'œil.",
    "options": [
     {
      "t": "Le tableau d'outils à silhouettes (« shadow board »)",
      "x": "Exact : chaque outil a sa place matérialisée ; l'absence d'un outil saute aux yeux."
     },
     {
      "t": "La grille d'audit 5S",
      "x": "Elle sert à mesurer et maintenir (4e et 5e S)."
     },
     {
      "t": "L'étiquette rouge",
      "x": "Elle sert à l'étape Trier."
     },
     {
      "t": "Le planning de nettoyage",
      "x": "Il sert à l'étape Nettoyer."
     }
    ]
   },
   {
    "q": "Le 4e S, « Seiketsu » (Standardiser), consiste à :",
    "ok": 2,
    "why": "Standardiser = transformer les bonnes pratiques des 3 premiers S en règles visuelles simples (marquages, photos de référence, routines) pour qu'elles tiennent dans le temps.",
    "options": [
     {
      "t": "Acheter le même mobilier pour tous les ateliers",
      "x": "Uniformiser le mobilier ne crée pas de standard de travail."
     },
     {
      "t": "Refaire un grand tri chaque semaine",
      "x": "Si l'on doit trier sans cesse, c'est que rien n'a été standardisé."
     },
     {
      "t": "Formaliser les 3 premiers S en standards visuels et en routines pour qu'ils se maintiennent",
      "x": "Exact : photos de l'état de référence, marquages au sol, check-lists de fin de poste…"
     },
     {
      "t": "Faire des audits surprises sanctionnés",
      "x": "L'audit relève du 5e S, et la sanction n'est pas l'esprit Lean."
     }
    ]
   },
   {
    "q": "Comment se traduit concrètement le 5e S, « Shitsuke » (Respecter / Être rigoureux) ?",
    "ok": 1,
    "why": "La pérennité vient des rituels : audits réguliers, affichage des résultats, implication visible du management sur le terrain.",
    "options": [
     {
      "t": "Par une sanction systématique des écarts",
      "x": "Une culture punitive pousse à cacher les problèmes, l'inverse du Lean."
     },
     {
      "t": "Par des audits réguliers, des rituels et l'exemplarité du management",
      "x": "Exact : la discipline se construit par l'habitude et l'exemple."
     },
     {
      "t": "Par un grand nettoyage annuel",
      "x": "Une action ponctuelle ne crée pas d'habitude."
     },
     {
      "t": "En confiant les 5S à un consultant externe",
      "x": "Les 5S appartiennent à l'équipe qui travaille au poste."
     }
    ]
   },
   {
    "q": "Quel est le score global de cet audit 5S, en pourcentage ?",
    "data": "Audit d'une cellule (barème sur 5 par S) : Trier 4, Ranger 3, Nettoyer 2, Standardiser 2, Respecter 1.",
    "ok": 0,
    "why": "Somme : 4 + 3 + 2 + 2 + 1 = 12 points sur 25 possibles, soit 12 / 25 = 48 %.",
    "options": [
     {
      "t": "48 %",
      "x": "Exact : 12 / 25 = 0,48."
     },
     {
      "t": "60 %",
      "x": "C'est 3/5 : on a pris le score d'une seule étape, pas le total."
     },
     {
      "t": "12 %",
      "x": "12 est le nombre de points, pas un pourcentage."
     },
     {
      "t": "52 %",
      "x": "Erreur de calcul : 13/25 ; le total des points est 12."
     }
    ]
   },
   {
    "q": "Pourquoi les 5S sont-ils souvent le premier chantier Lean d'une usine ?",
    "ok": 3,
    "why": "Les 5S rendent visibles les écarts et installent la discipline (standards, rituels) sans laquelle les outils plus avancés ne tiennent pas.",
    "options": [
     {
      "t": "Parce que c'est un chantier coûteux qui montre l'engagement de la direction",
      "x": "Les 5S coûtent peu ; leur intérêt n'est pas budgétaire."
     },
     {
      "t": "Parce qu'ils suppriment le besoin de maintenance",
      "x": "Ils facilitent la maintenance (détection), ils ne la remplacent pas."
     },
     {
      "t": "Parce qu'ils remplacent la formation des opérateurs",
      "x": "Ils s'appuient au contraire sur la formation et l'implication."
     },
     {
      "t": "Parce qu'ils rendent les anomalies visibles et créent la discipline nécessaire aux autres outils",
      "x": "Exact : SMED, TPM ou flux tiré reposent sur un poste organisé et des standards respectés."
     }
    ]
   },
   {
    "q": "Lean 4.0 : comment le numérique peut-il renforcer les 5S ?",
    "ok": 2,
    "why": "Le numérique sert la boucle d'amélioration : audits horodatés avec photos, tendances par zone, alertes de dérive — sans remplacer la présence terrain.",
    "options": [
     {
      "t": "En remplaçant les audits terrain par une simple photo hebdomadaire",
      "x": "La photo ne remplace pas l'échange avec l'équipe au poste."
     },
     {
      "t": "En supprimant le marquage au sol grâce à la géolocalisation",
      "x": "Le management visuel physique reste indispensable au poste."
     },
     {
      "t": "Par des audits sur tablette avec photos horodatées, tendances et alertes de dérive",
      "x": "Exact : on gagne en traçabilité et en réactivité, tout en gardant le Gemba."
     },
     {
      "t": "Par des caméras qui identifient et sanctionnent les écarts",
      "x": "La surveillance punitive détruit la confiance nécessaire au Lean."
     }
    ]
   }
  ]
 },
 {
  "code": "01.01.02.01.01",
  "title": "VSM — Cartographie de la chaîne de valeur",
  "definition": "Représentation sur une page des flux de matières et d'informations d'une famille de produits, du fournisseur au client, pour distinguer la valeur ajoutée des gaspillages et dessiner l'état futur.",
  "status": "publie",
  "video": "/lean/videos/01.01.02.01.01.mp4",
  "article": "/lean/articles/01.01.02.01.01.pdf",
  "quizzes": [
   {
    "q": "Que représente une VSM (Value Stream Mapping) ?",
    "ok": 1,
    "why": "La VSM suit une famille de produits de bout en bout et superpose flux physiques et flux d'information, avec une ligne de temps VA / NVA.",
    "options": [
     {
      "t": "L'organigramme de l'usine",
      "x": "L'organigramme décrit des responsabilités, pas un flux de valeur."
     },
     {
      "t": "Les flux de matières ET d'informations d'une famille de produits, du fournisseur au client",
      "x": "Exact : c'est la vue d'ensemble qui montre où le temps se perd."
     },
     {
      "t": "Le plan d'implantation des machines",
      "x": "C'est un layout ou un diagramme spaghetti, pas une VSM."
     },
     {
      "t": "La gamme opératoire détaillée d'un seul poste",
      "x": "La VSM est une vue de bout en bout, pas un zoom sur un poste."
     }
    ]
   },
   {
    "q": "Par où commence-t-on généralement le relevé de l'état actuel ?",
    "ok": 0,
    "why": "On part du client (demande, rythme, conditionnement) puis on remonte le flux depuis l'expédition : c'est le client qui définit la valeur.",
    "options": [
     {
      "t": "Par le client : sa demande et son rythme",
      "x": "Exact : la demande client fixe le takt time et la référence de tout le flux."
     },
     {
      "t": "Par le fournisseur de matière première",
      "x": "On le dessine, mais on démarre côté client pour rester orienté valeur."
     },
     {
      "t": "Par le poste le plus lent",
      "x": "On l'identifiera, mais seulement après avoir posé la demande client."
     },
     {
      "t": "Par le service des ressources humaines",
      "x": "Il n'est pas un processus du flux de valeur produit."
     }
    ]
   },
   {
    "q": "Quel est le takt time ?",
    "data": "Demande client : 460 pièces/jour. Temps d'ouverture net : 2 postes × 7,5 h = 54 000 s.",
    "ok": 2,
    "why": "Takt = temps d'ouverture disponible / demande client = 54 000 s / 460 ≈ 117 s par pièce.",
    "options": [
     {
      "t": "235 s",
      "x": "On a compté deux fois le temps disponible (108 000 s)."
     },
     {
      "t": "59 s",
      "x": "On n'a pris qu'un seul poste (27 000 s)."
     },
     {
      "t": "117 s",
      "x": "Exact : 54 000 / 460 = 117,4 s ; il faut sortir une pièce toutes les 117 s environ."
     },
     {
      "t": "460 s",
      "x": "460 est la demande en pièces, pas un temps."
     }
    ]
   },
   {
    "q": "Quel délai (lead time) ces stocks représentent-ils ?",
    "data": "Stocks entre processus : 2 400 pièces au total. Demande : 600 pièces/jour.",
    "ok": 3,
    "why": "Délai d'un stock = quantité en stock / consommation quotidienne = 2 400 / 600 = 4 jours.",
    "options": [
     {
      "t": "0,25 jour",
      "x": "Calcul inversé : 600 / 2 400."
     },
     {
      "t": "2,4 jours",
      "x": "On a confondu le nombre de pièces (en milliers) et des jours."
     },
     {
      "t": "6 jours",
      "x": "Résultat sans rapport avec les données."
     },
     {
      "t": "4 jours",
      "x": "Exact : une pièce attend en moyenne 4 jours dans les stocks avant d'être livrée."
     }
    ]
   },
   {
    "q": "Quel est le ratio de valeur ajoutée (temps VA / lead time) ?",
    "data": "Temps de valeur ajoutée total : 320 s. Lead time total : 5 jours (journées de 24 h).",
    "ok": 0,
    "why": "Lead time = 5 × 86 400 s = 432 000 s ; 320 / 432 000 ≈ 0,074 % : la pièce ne reçoit de valeur que pendant une infime partie de son séjour.",
    "options": [
     {
      "t": "Environ 0,07 %",
      "x": "Exact : c'est typique d'un flux non maîtrisé ; l'essentiel est attente et stock."
     },
     {
      "t": "Environ 7,4 %",
      "x": "Erreur d'un facteur 100 dans la conversion."
     },
     {
      "t": "Environ 0,7 %",
      "x": "Erreur d'un facteur 10 dans la conversion."
     },
     {
      "t": "Environ 74 %",
      "x": "Un tel ratio serait exceptionnel ; ici le calcul est faux."
     }
    ]
   },
   {
    "q": "Dans une VSM, que représente le symbole du triangle contenant la lettre « I » ?",
    "ok": 1,
    "why": "Le triangle « I » (Inventory) signale un stock entre deux processus, avec sa quantité et sa couverture en jours.",
    "options": [
     {
      "t": "Une inspection qualité",
      "x": "L'inspection n'a pas ce symbole ; elle se dessine comme un processus."
     },
     {
      "t": "Un stock (inventaire)",
      "x": "Exact : on note dessous la quantité et sa conversion en jours."
     },
     {
      "t": "Un flux d'information électronique",
      "x": "Il se dessine par une flèche en éclair."
     },
     {
      "t": "Un poste d'information client",
      "x": "Ce n'est pas un symbole VSM."
     }
    ]
   },
   {
    "q": "Sur une VSM de l'état futur, que signifie un « éclair kaizen » (kaizen burst) ?",
    "ok": 3,
    "why": "L'éclair kaizen marque une amélioration précise à mener (SMED, 5S, flux continu…) pour passer de l'état actuel à l'état futur.",
    "options": [
     {
      "t": "Une panne machine récurrente",
      "x": "Une panne se note dans les données du processus, pas par un éclair."
     },
     {
      "t": "Un flux poussé à supprimer",
      "x": "Le flux poussé a sa propre flèche rayée."
     },
     {
      "t": "Un incident de sécurité",
      "x": "Ce n'est pas un symbole VSM."
     },
     {
      "t": "Une amélioration ciblée à réaliser pour atteindre l'état futur",
      "x": "Exact : chaque éclair devient une action du plan d'amélioration."
     }
    ]
   },
   {
    "q": "Dans l'état futur, qu'est-ce que le « processus stimulateur » (pacemaker) ?",
    "ok": 2,
    "why": "C'est l'unique point qui reçoit l'ordonnancement client ; en aval, le flux doit être continu ou FIFO, en amont il est tiré.",
    "options": [
     {
      "t": "Toujours le goulot d'étranglement",
      "x": "Le goulot n'est pas forcément le point d'ordonnancement."
     },
     {
      "t": "Le poste le plus rapide",
      "x": "La vitesse n'est pas le critère de choix."
     },
     {
      "t": "Le seul point qui reçoit l'ordonnancement, en aval duquel le flux est continu ou FIFO",
      "x": "Exact : il donne le rythme à toute la chaîne."
     },
     {
      "t": "Toujours le premier poste de la chaîne",
      "x": "Planifier le premier poste revient souvent à pousser le flux."
     }
    ]
   },
   {
    "q": "Comment choisit-on la famille de produits à cartographier ?",
    "ok": 0,
    "why": "Une famille = des produits qui passent par des étapes et des équipements similaires (matrice produits × processus).",
    "options": [
     {
      "t": "Produits passant par des étapes et équipements similaires",
      "x": "Exact : on construit une matrice produits / processus pour les regrouper."
     },
     {
      "t": "Produits de la même couleur",
      "x": "La couleur ne dit rien du parcours dans l'usine."
     },
     {
      "t": "Produits vendus au même client",
      "x": "Deux produits d'un même client peuvent suivre des flux très différents."
     },
     {
      "t": "Tous les produits de l'usine sur une seule carte",
      "x": "La carte deviendrait illisible et inexploitable."
     }
    ]
   },
   {
    "q": "Lean 4.0 : quel est l'apport d'une VSM numérique alimentée par le MES et l'ERP ?",
    "ok": 1,
    "why": "La VSM numérique affiche en continu temps de cycle, stocks et TRS : on suit l'évolution du flux au lieu d'une photo figée — le Gemba reste indispensable.",
    "options": [
     {
      "t": "Elle supprime la nécessité d'aller sur le terrain",
      "x": "Le Gemba reste la base : les données n'expliquent pas tout."
     },
     {
      "t": "Des données en temps réel qui montrent l'évolution du flux au lieu d'une photo figée",
      "x": "Exact : on mesure l'effet des améliorations jour après jour."
     },
     {
      "t": "Elle génère automatiquement les kaizens sans l'équipe",
      "x": "Les améliorations restent conçues et menées par les équipes."
     },
     {
      "t": "Elle remplace la VSM de l'état futur",
      "x": "L'état futur reste une vision construite par l'équipe."
     }
    ]
   }
  ]
 },
 {
  "code": "01.01.02.02.01",
  "title": "Yamazumi — Équilibrage des postes",
  "definition": "Le Yamazumi (« empiler ») compare le temps de travail de chaque opérateur au takt time pour équilibrer la ligne : chaque poste doit tourner au takt ou juste en dessous.",
  "status": "publie",
  "video": "/lean/videos/01.01.02.02.01.mp4",
  "article": "/lean/articles/01.01.02.02.01.pdf",
  "quizzes": [
   {
    "q": "Un atelier travaille 8 h par jour avec deux pauses de 15 min et un déjeuner de 30 min. La demande est de 360 pièces par jour. Quel est le takt time ?",
    "data": "Poste de 8 h = 480 min · Pauses : 2 × 15 min + déjeuner 30 min · Demande : 360 pièces / jour",
    "ok": 1,
    "why": "Temps disponible = 480 − 30 − 30 = 420 min = 25 200 s ; 25 200 ÷ 360 = 70 s.",
    "options": [
     {
      "t": "60 s",
      "x": "Résultat de l’exemple de l’article (420 pièces) : ici la demande est différente."
     },
     {
      "t": "70 s",
      "x": "Exact : 25 200 s ÷ 360 pièces."
     },
     {
      "t": "80 s",
      "x": "Oubli des pauses : 28 800 s ÷ 360."
     },
     {
      "t": "1,17 s",
      "x": "Mélange minutes et secondes : toujours calculer en secondes."
     }
    ]
   },
   {
    "q": "Dix personnes produisent 100 unités par jour ; une amélioration permet 120 unités avec les mêmes dix personnes, mais le client veut toujours 100 unités. Quelle est la vraie efficacité ?",
    "ok": 2,
    "why": "Produire 120 unités sans demande, c’est de la surproduction. Le vrai gain : 100 unités avec huit personnes.",
    "options": [
     {
      "t": "+20 % : la production passe de 100 à 120 unités",
      "x": "Gain « apparent » : il ne correspond à aucune demande."
     },
     {
      "t": "Produire 120 unités et stocker les 20 en plus",
      "x": "Inventaire et surproduction : deux gaspillages."
     },
     {
      "t": "Produire les mêmes 100 unités avec huit personnes",
      "x": "Exact : l’exemple d’Ohno."
     },
     {
      "t": "Faire travailler les dix personnes plus vite",
      "x": "Aller plus vite ne réduit pas les ressources nécessaires."
     }
    ]
   },
   {
    "q": "Quatre opérations pour un takt de 60 s : A 40 s, B 55 s, C 72 s, D 38 s. Quelle affirmation est correcte ?",
    "data": "A 40 s · B 55 s · C 72 s · D 38 s · total 205 s",
    "ok": 0,
    "why": "Seul C dépasse le takt ; 205 ÷ 60 = 3,42 ; avec 3 opérateurs il faut ≤ 180 s, donc supprimer ~25 s de gaspillage.",
    "options": [
     {
      "t": "C bloque la ligne ; 3 opérateurs possibles si l’on élimine ~25 s de gaspillage",
      "x": "Exact."
     },
     {
      "t": "D est le goulot car c’est la barre la plus courte",
      "x": "Le goulot est le poste le plus lent, pas le plus rapide."
     },
     {
      "t": "La ligne tient le takt car la moyenne (51 s) est sous 60 s",
      "x": "La moyenne ne compte pas : chaque poste doit être ≤ takt."
     },
     {
      "t": "Il faut obligatoirement un cinquième opérateur",
      "x": "On rééquilibre et on élimine le gaspillage d’abord."
     }
    ]
   },
   {
    "q": "Le total des temps de cycle est de 230 s et le takt de 60 s. Quelle est la conclusion la plus réaliste ?",
    "data": "ΣCT = 230 s · Takt = 60 s",
    "ok": 3,
    "why": "230 ÷ 60 = 3,83 : la décimale est trop élevée pour retirer un opérateur ; il faudrait éliminer 50 s d’un coup.",
    "options": [
     {
      "t": "3 opérateurs : on arrondit toujours à l’inférieur",
      "x": "3 opérateurs ne tiennent pas 230 s sous 60 s chacun."
     },
     {
      "t": "5 opérateurs, avec un de marge",
      "x": "Une marge cache les problèmes au lieu de les résoudre."
     },
     {
      "t": "2 opérateurs en rééquilibrant",
      "x": "120 s de capacité, bien loin de 230 s."
     },
     {
      "t": "4 opérateurs aujourd’hui ; passer à 3 imposerait de supprimer 50 s d’un coup",
      "x": "Exact."
     }
    ]
   },
   {
    "q": "Une pièce attend 3 heures dans une file avant le poste suivant. Où ce temps apparaît-il ?",
    "ok": 1,
    "why": "L’attente n’est dans le temps de cycle d’aucun poste : elle est dans le lead time. VCT < CT < PLT.",
    "options": [
     {
      "t": "Dans le temps de cycle du poste amont",
      "x": "L’attente entre postes n’y figure pas."
     },
     {
      "t": "Dans le production lead time (PLT) : c’est un gaspillage caché",
      "x": "Exact."
     },
     {
      "t": "Dans le value-creating time (VCT)",
      "x": "Le VCT ne contient que le travail payé par le client."
     },
     {
      "t": "Nulle part : une pièce qui attend ne coûte rien",
      "x": "L’attente immobilise du stock et cache les problèmes."
     }
    ]
   },
   {
    "q": "Un opérateur se dépêche 20 minutes puis attend 10 minutes, toute la journée. Quel terme décrit ce déséquilibre ?",
    "ok": 2,
    "why": "Le mura est l’irrégularité : tantôt on se dépêche, tantôt on attend.",
    "options": [
     {
      "t": "Muda",
      "x": "L’attente est du muda, mais le schéma décrit surtout l’irrégularité."
     },
     {
      "t": "Muri",
      "x": "Le muri est une surcharge permanente."
     },
     {
      "t": "Mura",
      "x": "Exact."
     },
     {
      "t": "Kaizen",
      "x": "Le kaizen est l’amélioration continue."
     }
    ]
   },
   {
    "q": "Trois machines : M1 = 2,5 s, M2 = 6 s, M3 = 2,5 s, takt 5 s. On améliore M1 de 2,5 s à 2 s. Effet sur le débit ?",
    "data": "M1 2,5 s → 2 s · M2 6 s (goulot) · M3 2,5 s · Takt 5 s",
    "ok": 0,
    "why": "La ligne ne sort pas plus vite que son poste le plus lent (M2) : le stock grossit devant M2.",
    "options": [
     {
      "t": "Aucun gain : le stock s’accumule devant M2",
      "x": "Exact."
     },
     {
      "t": "Le débit augmente de 20 %",
      "x": "Le gain local de M1 n’est pas un gain global."
     },
     {
      "t": "Le débit atteint le takt de 5 s",
      "x": "Le débit reste fixé par M2 (6 s)."
     },
     {
      "t": "M3 produit plus vite",
      "x": "M3 reçoit les pièces au rythme de M2."
     }
    ]
   },
   {
    "q": "Une file FIFO limitée à 5 pièces est pleine. Que doit faire le processus fournisseur ?",
    "ok": 3,
    "why": "Une file FIFO limitée empêche la surproduction : quand elle est pleine, le fournisseur s’arrête.",
    "options": [
     {
      "t": "Continuer à produire",
      "x": "C’est précisément de la surproduction."
     },
     {
      "t": "Produire et stocker à côté de la file",
      "x": "Cela recrée un stock caché."
     },
     {
      "t": "Accélérer pour être prêt",
      "x": "La production est tirée par le client."
     },
     {
      "t": "S’arrêter jusqu’à ce que le client retire une pièce",
      "x": "Exact."
     }
    ]
   },
   {
    "q": "Le takt est de 45 s et la quantité par conteneur de 20 pièces. Quel est le pitch ?",
    "data": "Takt 45 s · Pack-out 20 pièces · Pitch = takt × pack-out",
    "ok": 1,
    "why": "45 s × 20 = 900 s = 15 minutes.",
    "options": [
     {
      "t": "2,25 s",
      "x": "Division au lieu d’une multiplication."
     },
     {
      "t": "15 min",
      "x": "Exact."
     },
     {
      "t": "20 min",
      "x": "Résultat de l’exemple de l’article (60 s × 20)."
     },
     {
      "t": "65 s",
      "x": "Addition au lieu d’une multiplication."
     }
    ]
   },
   {
    "q": "Dans la méthode 5S, quel « S » correspond à « une place pour chaque chose et chaque chose à sa place » ?",
    "ok": 2,
    "why": "Seiton (Ranger) : une place pour chaque chose et chaque chose à sa place.",
    "options": [
     {
      "t": "Seiri (Trier)",
      "x": "Trier et éliminer l’inutile."
     },
     {
      "t": "Seiso (Nettoyer)",
      "x": "Nettoyer et inspecter."
     },
     {
      "t": "Seiton (Ranger)",
      "x": "Exact."
     },
     {
      "t": "Shitsuke (Maintenir)",
      "x": "La discipline qui maintient les trois premiers S."
     }
    ]
   }
  ]
 },
 {
  "code": "01.02.01.01.01",
  "title": "SMED — Changement rapide de série",
  "definition": "Méthode de Shigeo Shingo pour réduire le temps de changement de série à moins de 10 minutes, en séparant puis en externalisant et en simplifiant les opérations.",
  "status": "publie",
  "video": "/lean/videos/01.02.01.01.01.mp4",
  "article": "/lean/articles/01.02.01.01.01.pdf",
  "quizzes": [
   {
    "q": "Que signifie l'acronyme SMED ?",
    "ok": 2,
    "why": "Single Minute Exchange of Die : un changement d'outil dont la durée tient en un seul chiffre de minutes, donc moins de 10 min.",
    "options": [
     {
      "t": "Standard Method for Equipment Design",
      "x": "Acronyme inventé : SMED ne parle pas de conception."
     },
     {
      "t": "Changement d'outil en exactement une minute",
      "x": "Piège classique : « single minute » veut dire un nombre de minutes à un chiffre."
     },
     {
      "t": "Single Minute Exchange of Die : changement en moins de 10 minutes",
      "x": "Exact : l'objectif est un temps à un seul chiffre."
     },
     {
      "t": "Single Machine Efficiency Data",
      "x": "Acronyme inventé, sans rapport avec la méthode."
     }
    ]
   },
   {
    "q": "Qui a développé la méthode SMED ?",
    "ok": 0,
    "why": "Shigeo Shingo l'a formalisée chez Toyota et chez des fournisseurs japonais dans les années 1950-1970.",
    "options": [
     {
      "t": "Shigeo Shingo",
      "x": "Exact : ingénieur conseil associé au Système de Production Toyota."
     },
     {
      "t": "Taiichi Ohno",
      "x": "Père du Système de Production Toyota et du kanban, mais pas l'auteur du SMED."
     },
     {
      "t": "W. Edwards Deming",
      "x": "Connu pour la qualité et le cycle PDCA."
     },
     {
      "t": "Henry Ford",
      "x": "Pionnier de la production de masse, à l'opposé des petits lots."
     }
    ]
   },
   {
    "q": "Comment mesure-t-on correctement le temps de changement de série ?",
    "ok": 3,
    "why": "On mesure de la dernière bonne pièce de la série A à la première bonne pièce de la série B produite à cadence nominale : réglages et rebuts de démarrage compris.",
    "options": [
     {
      "t": "De l'arrêt de la machine à son redémarrage",
      "x": "On oublierait les ajustements et les rebuts après redémarrage."
     },
     {
      "t": "La seule durée de démontage de l'outil",
      "x": "C'est une petite partie du changement."
     },
     {
      "t": "Le temps de réglage uniquement",
      "x": "On oublierait l'arrêt, le démontage et le montage."
     },
     {
      "t": "De la dernière bonne pièce A à la première bonne pièce B, à cadence nominale",
      "x": "Exact : c'est la seule mesure qui reflète la perte réelle de capacité."
     }
    ]
   },
   {
    "q": "Quelle est la différence entre opérations internes et externes ?",
    "ok": 1,
    "why": "Internes : impossibles machine en marche (démonter le moule). Externes : réalisables pendant que la machine produit (préparer, préchauffer, approvisionner).",
    "options": [
     {
      "t": "Internes : faites par l'équipe ; externes : faites par un sous-traitant",
      "x": "La distinction porte sur l'état de la machine, pas sur qui intervient."
     },
     {
      "t": "Internes : machine obligatoirement arrêtée ; externes : réalisables machine en marche",
      "x": "Exact : tout l'enjeu est de basculer le maximum d'opérations en externe."
     },
     {
      "t": "Internes : dans l'atelier ; externes : hors de l'atelier",
      "x": "Le lieu ne définit pas la catégorie."
     },
     {
      "t": "Il n'y a pas de différence pratique",
      "x": "C'est au contraire le cœur de la méthode SMED."
     }
    ]
   },
   {
    "q": "Après la seule étape « externaliser », quelle sera la durée d'arrêt ?",
    "data": "Changement actuel : 90 min, dont 35 min d'opérations réalisables machine en marche (préparer les outils, préchauffer le moule, chercher la fiche de réglage).",
    "ok": 2,
    "why": "On retire du temps d'arrêt tout ce qui peut se faire machine en marche : 90 − 35 = 55 min.",
    "options": [
     {
      "t": "35 min",
      "x": "C'est la durée des opérations externalisées, pas l'arrêt restant."
     },
     {
      "t": "90 min",
      "x": "Rien n'aurait changé : l'externalisation n'est pas prise en compte."
     },
     {
      "t": "55 min",
      "x": "Exact : 90 − 35 = 55 min d'arrêt, avant même de simplifier l'interne."
     },
     {
      "t": "125 min",
      "x": "On a additionné au lieu de soustraire."
     }
    ]
   },
   {
    "q": "Lequel de ces exemples convertit une opération interne en opération externe ?",
    "ok": 0,
    "why": "Préchauffer le moule hors machine, avant l'arrêt, supprime ce temps du changement.",
    "options": [
     {
      "t": "Préchauffer le moule suivant hors machine pendant la production",
      "x": "Exact : la chauffe se fait pendant que la machine produit encore la série A."
     },
     {
      "t": "Serrer les vis plus fort",
      "x": "Cela ne change pas la nature de l'opération."
     },
     {
      "t": "Supprimer le contrôle de la première pièce",
      "x": "Dangereux : on gagne du temps en perdant la qualité."
     },
     {
      "t": "Faire tous les changements la nuit",
      "x": "On déplace le problème sans réduire la durée."
     }
    ]
   },
   {
    "q": "Quelle technique réduit le plus les opérations internes restantes ?",
    "ok": 3,
    "why": "Fixations rapides (quart de tour, brides, goupilles) et suppression des réglages grâce à des butées et gabarits.",
    "options": [
     {
      "t": "Ajouter des contrôles supplémentaires",
      "x": "Cela allonge le changement."
     },
     {
      "t": "Augmenter la taille des lots",
      "x": "On réduit la fréquence des changements, pas leur durée : c'est l'inverse du Lean."
     },
     {
      "t": "Sous-traiter le changement",
      "x": "La durée d'arrêt reste la même."
     },
     {
      "t": "Fixations rapides et suppression des réglages par butées et gabarits",
      "x": "Exact : on élimine vissages longs et réglages par tâtonnement."
     }
    ]
   },
   {
    "q": "Combien de temps machine libère-t-on chaque jour ?",
    "data": "Temps de changement réduit de 60 à 15 min. 4 changements par jour.",
    "ok": 1,
    "why": "(60 − 15) min × 4 changements = 180 min = 3 h de capacité par jour.",
    "options": [
     {
      "t": "45 min",
      "x": "C'est le gain sur un seul changement."
     },
     {
      "t": "3 h",
      "x": "Exact : 45 min × 4 = 180 min."
     },
     {
      "t": "4 h",
      "x": "Il faut multiplier le gain unitaire (45 min), pas les 60 min initiales."
     },
     {
      "t": "1 h",
      "x": "C'est le temps de 4 changements de 15 min, pas le gain."
     }
    ]
   },
   {
    "q": "Pourquoi réduire le temps de changement est-il stratégique ?",
    "ok": 2,
    "why": "Des changements courts permettent des lots plus petits et plus fréquents : moins de stock, délais plus courts, plus de flexibilité face à la demande.",
    "options": [
     {
      "t": "Pour pouvoir augmenter la taille des lots",
      "x": "C'est l'inverse : on veut produire plus souvent en plus petites quantités."
     },
     {
      "t": "Uniquement pour réduire l'effectif de maintenance",
      "x": "Ce n'est pas l'objectif et ce n'est souvent pas le résultat."
     },
     {
      "t": "Pour produire en petits lots fréquents : moins de stock, délais réduits, plus de flexibilité",
      "x": "Exact : le SMED est un levier du flux tiré et du juste-à-temps."
     },
     {
      "t": "Cela ne concerne que les presses à emboutir",
      "x": "La méthode s'applique à tout changement : injection, usinage, conditionnement, laboratoire…"
     }
    ]
   },
   {
    "q": "Lean 4.0 : quelle assistance numérique est la plus pertinente pour le changement de série ?",
    "ok": 3,
    "why": "Instructions numériques pas à pas, vérification du bon outil par RFID et chronométrage automatique rendent le standard fiable et mesurable.",
    "options": [
     {
      "t": "Remplacer l'opérateur par une vidéo en ligne",
      "x": "La vidéo aide à former, elle ne remplace pas un standard maîtrisé."
     },
     {
      "t": "Supprimer le standard écrit grâce à l'expérience des anciens",
      "x": "Sans standard, chaque changement dépend de la personne."
     },
     {
      "t": "Régler « au jugé » avec une IA sans données de référence",
      "x": "Sans données fiables, l'IA ne peut rien apprendre."
     },
     {
      "t": "Instructions numériques pas à pas, contrôle RFID du bon outil et chronométrage automatique",
      "x": "Exact : le numérique sécurise et mesure le standard SMED."
     }
    ]
   }
  ]
 },
 {
  "code": "01.03.01.01.01",
  "title": "TRS — Taux de Rendement Synthétique",
  "definition": "Indicateur (OEE en anglais) qui mesure la part du temps requis réellement transformée en pièces bonnes à cadence nominale : TRS = Disponibilité × Performance × Qualité.",
  "status": "publie",
  "video": "/lean/videos/01.03.01.01.01.mp4",
  "article": "/lean/articles/01.03.01.01.01.pdf",
  "quizzes": [
   {
    "q": "Quelle est la formule du TRS ?",
    "ok": 0,
    "why": "Le TRS est le produit des trois taux : chaque perte (arrêt, vitesse, défaut) réduit le résultat.",
    "options": [
     {
      "t": "Disponibilité × Performance × Qualité",
      "x": "Exact : un produit, pas une somme ni une moyenne."
     },
     {
      "t": "Disponibilité + Performance + Qualité",
      "x": "Une somme dépasserait 100 %."
     },
     {
      "t": "(Disponibilité × Performance) / Qualité",
      "x": "Diviser par la qualité ferait monter le TRS quand la qualité baisse : absurde."
     },
     {
      "t": "Moyenne de la disponibilité, de la performance et de la qualité",
      "x": "Une moyenne masque les pertes ; le TRS les cumule."
     }
    ]
   },
   {
    "q": "Quel est le taux de disponibilité ?",
    "data": "Temps requis : 480 min. Arrêts (pannes + changements) : 60 min.",
    "ok": 2,
    "why": "Disponibilité = temps de fonctionnement / temps requis = (480 − 60) / 480 = 87,5 %.",
    "options": [
     {
      "t": "12,5 %",
      "x": "C'est le taux d'arrêt, pas la disponibilité."
     },
     {
      "t": "90 %",
      "x": "Arrondi sans calcul : 420/480 ne fait pas 90 %."
     },
     {
      "t": "87,5 %",
      "x": "Exact : 420 / 480 = 0,875."
     },
     {
      "t": "80 %",
      "x": "Résultat qui correspondrait à 96 min d'arrêt."
     }
    ]
   },
   {
    "q": "Quel est le taux de performance ?",
    "data": "Temps de fonctionnement : 420 min. Temps de cycle théorique : 1 min/pièce. Pièces produites : 357.",
    "ok": 1,
    "why": "Performance = (pièces produites × temps de cycle théorique) / temps de fonctionnement = 357 × 1 / 420 = 85 %.",
    "options": [
     {
      "t": "100 %",
      "x": "Il aurait fallu produire 420 pièces."
     },
     {
      "t": "85 %",
      "x": "Exact : 357 / 420 = 0,85 ; 15 % perdus en micro-arrêts et ralentissements."
     },
     {
      "t": "74 %",
      "x": "C'est 357 / 480 : on a utilisé le temps requis au lieu du temps de fonctionnement."
     },
     {
      "t": "98 %",
      "x": "C'est l'ordre de grandeur de la qualité, pas de la performance."
     }
    ]
   },
   {
    "q": "Quel est le taux de qualité ?",
    "data": "357 pièces produites, dont 7 non conformes.",
    "ok": 3,
    "why": "Qualité = pièces bonnes / pièces produites = (357 − 7) / 357 = 350 / 357 ≈ 98 %.",
    "options": [
     {
      "t": "2 %",
      "x": "C'est le taux de non-qualité."
     },
     {
      "t": "93 %",
      "x": "Calcul erroné, sans rapport avec 350/357."
     },
     {
      "t": "100 %",
      "x": "Les 7 pièces non conformes doivent être déduites."
     },
     {
      "t": "98 %",
      "x": "Exact : 350 / 357 = 0,980."
     }
    ]
   },
   {
    "q": "Quel est le TRS ?",
    "data": "Disponibilité 87,5 % ; Performance 85 % ; Qualité 98 %.",
    "ok": 0,
    "why": "TRS = 0,875 × 0,85 × 0,98 ≈ 0,729, soit 72,9 %.",
    "options": [
     {
      "t": "72,9 %",
      "x": "Exact : le produit des trois taux."
     },
     {
      "t": "90,2 %",
      "x": "C'est la moyenne des trois taux : elle masque les pertes."
     },
     {
      "t": "85 %",
      "x": "C'est seulement la performance."
     },
     {
      "t": "74,4 %",
      "x": "C'est Disponibilité × Performance : la qualité a été oubliée."
     }
    ]
   },
   {
    "q": "Les micro-arrêts et les ralentissements dégradent surtout quel taux ?",
    "ok": 2,
    "why": "Micro-arrêts et baisses de cadence ne sont souvent pas enregistrés comme arrêts : ils apparaissent comme un écart de performance.",
    "options": [
     {
      "t": "La disponibilité",
      "x": "Elle mesure les arrêts longs, enregistrés (pannes, changements)."
     },
     {
      "t": "La qualité",
      "x": "Elle mesure les pièces non conformes."
     },
     {
      "t": "La performance",
      "x": "Exact : la machine tourne, mais produit moins que sa cadence nominale."
     },
     {
      "t": "Aucun : ils ne comptent pas dans le TRS",
      "x": "Ils pèsent souvent lourd, d'où l'intérêt de les mesurer."
     }
    ]
   },
   {
    "q": "Lequel de ces éléments ne fait PAS partie des « 6 grandes pertes » du TRS ?",
    "ok": 3,
    "why": "Les 6 pertes : pannes, changements/réglages, micro-arrêts, ralentissements, défauts en production, rebuts au démarrage.",
    "options": [
     {
      "t": "Les pannes",
      "x": "Perte de disponibilité, fait partie des 6."
     },
     {
      "t": "Les changements de série et réglages",
      "x": "Perte de disponibilité, fait partie des 6."
     },
     {
      "t": "Les rebuts au démarrage",
      "x": "Perte de qualité, fait partie des 6."
     },
     {
      "t": "L'absentéisme du personnel administratif",
      "x": "Exact : c'est hors du périmètre équipement mesuré par le TRS."
     }
    ]
   },
   {
    "q": "Une ligne passe de 60 % à 75 % de TRS. Quel gain de capacité cela représente-t-il ?",
    "ok": 1,
    "why": "Gain relatif = (75 − 60) / 60 = 25 % de pièces bonnes en plus, sans investissement.",
    "options": [
     {
      "t": "15 %",
      "x": "C'est l'écart en points, pas le gain relatif de capacité."
     },
     {
      "t": "25 %",
      "x": "Exact : 15 points rapportés à la base de 60 font 25 % de production en plus."
     },
     {
      "t": "75 %",
      "x": "C'est le nouveau TRS, pas le gain."
     },
     {
      "t": "20 %",
      "x": "C'est 15/75 : on a divisé par la nouvelle valeur au lieu de l'ancienne."
     }
    ]
   },
   {
    "q": "Pourquoi un TRS de 100 % est-il quasi impossible ?",
    "ok": 1,
    "why": "100 % exigerait zéro arrêt, zéro perte de vitesse, zéro défaut : c'est une référence théorique ; on cite souvent 85 % comme niveau « classe mondiale ».",
    "options": [
     {
      "t": "Parce que la formule plafonne à 85 %",
      "x": "Aucun plafond : 85 % est un repère de benchmark, pas une limite."
     },
     {
      "t": "Parce qu'il faudrait zéro arrêt, zéro ralentissement et zéro défaut",
      "x": "Exact : c'est un idéal qui guide l'amélioration continue."
     },
     {
      "t": "Parce que la qualité n'est pas prise en compte",
      "x": "Elle est prise en compte : c'est l'un des trois facteurs."
     },
     {
      "t": "Parce que le temps requis inclut toujours les week-ends",
      "x": "Le temps requis exclut les arrêts planifiés hors production."
     }
    ]
   },
   {
    "q": "Lean 4.0 : quelle est la bonne pratique de mesure du TRS ?",
    "ok": 0,
    "why": "Collecte automatique des états machine (automates, capteurs IoT) + qualification des causes d'arrêt par l'opérateur = données fiables et actionnables.",
    "options": [
     {
      "t": "Collecte automatique par capteurs/automates et qualification des arrêts par l'opérateur",
      "x": "Exact : l'automate dit « quand », l'opérateur dit « pourquoi »."
     },
     {
      "t": "Saisie papier en fin de semaine",
      "x": "Trop tardif et imprécis : les micro-arrêts disparaissent."
     },
     {
      "t": "Supprimer le TRS au profit du seul chiffre d'affaires",
      "x": "On perdrait la vue sur les pertes des équipements."
     },
     {
      "t": "Calcul uniquement à partir de l'ERP comptable",
      "x": "L'ERP ne voit ni les micro-arrêts ni les causes."
     }
    ]
   }
  ]
 },
 {
  "code": "02.01.01.01.01",
  "title": "Kanban",
  "definition": "Système de pilotage en flux tiré : une carte (ou un signal) autorise la production ou le réapprovisionnement uniquement de ce qui a été consommé, en limitant l'en-cours.",
  "status": "publie",
  "video": "/lean/videos/02.01.01.01.01.mp4",
  "article": "/lean/articles/02.01.01.01.01.pdf",
  "quizzes": [
   {
    "q": "Quelle est la meilleure définition du Kanban ?",
    "ok": 3,
    "why": "Le kanban est un signal de consommation : on ne produit ou ne réapprovisionne que ce qui a été retiré par l'aval.",
    "options": [
     {
      "t": "Un planning poussé calculé par le MRP",
      "x": "Le MRP pousse selon des prévisions ; le kanban tire selon la consommation."
     },
     {
      "t": "Un tableau de bord des ressources humaines",
      "x": "Sans rapport avec le pilotage des flux."
     },
     {
      "t": "Un outil de comptabilité analytique",
      "x": "Sans rapport avec le pilotage des flux."
     },
     {
      "t": "Un système tiré où une carte autorise à produire ou réapprovisionner ce qui a été consommé",
      "x": "Exact : c'est l'aval qui déclenche l'amont."
     }
    ]
   },
   {
    "q": "D'où vient le système Kanban ?",
    "ok": 0,
    "why": "Taiichi Ohno l'a développé chez Toyota, inspiré du réassort des rayons des supermarchés américains.",
    "options": [
     {
      "t": "De Toyota (Taiichi Ohno), inspiré des supermarchés américains",
      "x": "Exact : le rayon vide déclenche le réassort, comme le bac vide déclenche la production."
     },
     {
      "t": "Des usines Ford des années 1920",
      "x": "Ford produisait en masse et en flux poussé."
     },
     {
      "t": "De Motorola, avec le Six Sigma",
      "x": "Six Sigma porte sur la réduction de la variabilité."
     },
     {
      "t": "De General Electric",
      "x": "Sans lien historique avec le kanban."
     }
    ]
   },
   {
    "q": "Quelle est la différence entre kanban de production et kanban de transfert (retrait) ?",
    "ok": 2,
    "why": "Le kanban de production autorise à fabriquer ; le kanban de transfert autorise à déplacer des pièces du supermarché vers le poste client.",
    "options": [
     {
      "t": "Aucune, ce sont deux noms pour la même carte",
      "x": "Les deux cartes ont des rôles distincts dans la boucle."
     },
     {
      "t": "Le kanban de transfert est réservé aux fournisseurs étrangers",
      "x": "Il est utilisé aussi en interne entre ateliers."
     },
     {
      "t": "Production : autorise à fabriquer ; transfert : autorise à déplacer des pièces vers le poste client",
      "x": "Exact : deux boucles qui s'enchaînent autour du supermarché."
     },
     {
      "t": "Le kanban de production sert à facturer le client",
      "x": "Le kanban ne sert pas à la facturation."
     }
    ]
   },
   {
    "q": "Combien de cartes kanban faut-il ?",
    "data": "Consommation : 400 pièces/jour. Délai de réapprovisionnement : 2 jours. Stock de sécurité : 10 %. Contenance d'un bac : 50 pièces.",
    "ok": 2,
    "why": "N = (consommation × délai × (1 + sécurité)) / contenance = 400 × 2 × 1,1 / 50 = 17,6 → arrondi supérieur : 18 cartes.",
    "options": [
     {
      "t": "16 cartes",
      "x": "On a oublié le stock de sécurité de 10 %."
     },
     {
      "t": "17 cartes",
      "x": "On a arrondi à l'inférieur : risque de rupture."
     },
     {
      "t": "18 cartes",
      "x": "Exact : 17,6 arrondi à l'entier supérieur."
     },
     {
      "t": "88 cartes",
      "x": "On a oublié de diviser par la contenance du bac (ou multiplié au lieu de diviser)."
     }
    ]
   },
   {
    "q": "Laquelle de ces règles est une règle fondamentale du Kanban ?",
    "ok": 1,
    "why": "Règles clés : rien sans kanban, l'aval vient retirer, quantités exactes de la carte, aucune pièce défectueuse envoyée, réduire progressivement le nombre de cartes.",
    "options": [
     {
      "t": "Produire en avance pour occuper les opérateurs",
      "x": "C'est de la surproduction, le premier des gaspillages."
     },
     {
      "t": "Ne rien produire ni déplacer sans kanban, et ne jamais envoyer de pièce défectueuse",
      "x": "Exact : le kanban limite l'en-cours et protège le client aval."
     },
     {
      "t": "Le fournisseur décide des quantités à livrer",
      "x": "La quantité est fixée par la carte, donc par la consommation."
     },
     {
      "t": "On peut ajouter des cartes sans limite quand il y a un problème",
      "x": "Ajouter des cartes cache les problèmes au lieu de les résoudre."
     }
    ]
   },
   {
    "q": "Que se passe-t-il quand on retire volontairement des cartes du circuit ?",
    "ok": 3,
    "why": "Moins de cartes = moins d'en-cours : les problèmes (pannes, délais, défauts) apparaissent, comme les rochers quand le niveau de la rivière baisse.",
    "options": [
     {
      "t": "Le stock augmente",
      "x": "C'est l'inverse : le stock maximal diminue."
     },
     {
      "t": "Rien ne change",
      "x": "Le niveau d'en-cours change directement."
     },
     {
      "t": "La production s'arrête définitivement",
      "x": "Elle continue, mais les dysfonctionnements deviennent visibles."
     },
     {
      "t": "L'en-cours baisse et les problèmes cachés deviennent visibles",
      "x": "Exact : c'est un levier d'amélioration continue."
     }
    ]
   },
   {
    "q": "Comment fonctionne le système « deux bacs » (Two-Bin) ?",
    "ok": 0,
    "why": "Quand le premier bac est vide, il part en réapprovisionnement (c'est le signal) pendant qu'on consomme le second.",
    "options": [
     {
      "t": "Le bac vide devient le signal de réapprovisionnement pendant qu'on consomme le second",
      "x": "Exact : simple, visuel, sans saisie, idéal pour la visserie."
     },
     {
      "t": "On remplit les deux bacs chaque matin, quoi qu'il arrive",
      "x": "C'est un réassort poussé, pas un système tiré."
     },
     {
      "t": "Le second bac est une réserve qu'on n'utilise jamais",
      "x": "Il est consommé pendant le réapprovisionnement du premier."
     },
     {
      "t": "On commande quand les deux bacs sont vides",
      "x": "Trop tard : on est déjà en rupture."
     }
    ]
   },
   {
    "q": "Dans quel cas le Kanban classique est-il le MOINS adapté ?",
    "ok": 1,
    "why": "Le kanban suppose une consommation assez régulière et répétitive ; pour de l'unitaire ou du très irrégulier, on préfère d'autres modes (ordonnancement, CONWIP…).",
    "options": [
     {
      "t": "Pièces standards à consommation régulière",
      "x": "C'est le cas idéal du kanban."
     },
     {
      "t": "Produits unitaires, sur mesure ou à demande très irrégulière",
      "x": "Exact : des cartes permanentes n'ont pas de sens pour des articles qui ne se répètent pas."
     },
     {
      "t": "Visserie et petites fournitures",
      "x": "Cas typique du système deux bacs."
     },
     {
      "t": "Composants répétitifs d'une ligne d'assemblage",
      "x": "Très bon cas d'usage du kanban."
     }
    ]
   },
   {
    "q": "Quelle est la couverture maximale de cette boucle ?",
    "data": "Boucle de 12 cartes de 25 pièces. Consommation : 150 pièces/jour.",
    "ok": 2,
    "why": "Stock maximal = 12 × 25 = 300 pièces ; couverture = 300 / 150 = 2 jours.",
    "options": [
     {
      "t": "12 jours",
      "x": "On a compté une carte par jour."
     },
     {
      "t": "0,5 jour",
      "x": "Calcul inversé : 150 / 300."
     },
     {
      "t": "2 jours",
      "x": "Exact : 300 pièces / 150 par jour."
     },
     {
      "t": "6 jours",
      "x": "Calcul erroné, sans rapport avec la consommation."
     }
    ]
   },
   {
    "q": "Lean 4.0 : qu'apporte l'e-kanban ?",
    "ok": 3,
    "why": "Le scan (code-barres, RFID) du contenant vide déclenche automatiquement l'ordre dans l'ERP ou chez le fournisseur, avec un suivi en temps réel des boucles.",
    "options": [
     {
      "t": "Il remplace le kanban par des prévisions MRP",
      "x": "On reviendrait au flux poussé."
     },
     {
      "t": "Il permet d'imprimer plus de cartes",
      "x": "Le but n'est pas d'augmenter l'en-cours."
     },
     {
      "t": "Il supprime les supermarchés",
      "x": "Les supermarchés restent les tampons de la boucle."
     },
     {
      "t": "Le scan du contenant vide déclenche l'ordre automatiquement, avec suivi en temps réel",
      "x": "Exact : moins de cartes perdues, délais visibles, boucles pilotées."
     }
    ]
   }
  ]
 }
];
