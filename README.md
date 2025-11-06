Nero CSS Framework
Un framework CSS moderno, leggero e reattivo, basato su utility e componenti, con supporto integrato per il dark mode.

Nero CSS è progettato per essere un punto di partenza snello per progetti web moderni. Combina la velocità dello sviluppo basato su utility (simile a Tailwind) con la praticità di componenti pronti all'uso (simile a Bootstrap), il tutto costruito su una base logica di variabili CSS per una facile personalizzazione.

✨ Caratteristiche Principali
Mobile-First: Progettato da zero per essere reattivo. Il layout della sidebar e della griglia si adatta automaticamente ai breakpoint.

Utility-First: Un set completo di utility responsive per spaziatura (p-md, md:mt-lg), dimensionamento (w-full, lg:w-1/2), flexbox, grid, bordi e ombre.

Componenti Pronti: Include stili e script per Bottoni, Card, Modali (standard e glass), Dropdown, Alert, Badge, Form (input, select, checkbox, radio, switch), Paginazione e Tabelle.

Dark Mode Integrato: Aggiungi la classe .theme-dark al <body> per attivare il tema scuro.

Basato su Variabili CSS: L'intero framework è personalizzabile modificando le variabili CSS nel file nero.css.

JavaScript Leggero: Script vanilla (zero dipendenze) per gestire l'interattività dei componenti tramite data-attributes.

🚀 Iniziare
Per utilizzare Nero CSS nel tuo progetto, includi i file nero.css e nero.js nel tuo file HTML. Assicurati di includere anche la libreria di icone (Lucide) se vuoi utilizzare le icone predefinite.

HTML

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Il Mio Progetto con Nero</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <link rel="stylesheet" href="nero.css">
</head>
<body>

    <script src="nero.js"></script>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
🎨 Style Guide
Per una panoramica visiva completa di tutti i componenti, le utility e i campioni di codice, apri il file styleguide.html nel tuo browser.

Questo file è la documentazione fondamentale per lo sviluppo e l'utilizzo di Nero CSS.

⚙️ Concetti di Base
Design Responsivo
Usa i prefissi sm:, md:, e lg: per applicare stili a breakpoint specifici.

HTML

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
    <div>...</div>
    <div>...</div>
    <div>...</div>
    <div>...</div>
</div>

<div class="hidden md:flex">
    ...
</div>
Utility di Spaziatura
Usa m (margin) o p (padding) con i suffissi t, r, b, l, x, y e le dimensioni (xs, sm, md, lg, xl, 2xl).

HTML

<div class="card p-lg mb-md">
    ...
</div>

<div class="px-md py-sm">
    ...
</div>
Componenti Interattivi (JS)
I componenti JavaScript sono attivati tramite data-attributes.

Modale
HTML

<button class="btn btn-primary" data-toggle="modal" data-target="#myModal">
    Apri Modale
</button>

<div class="modal" id="myModal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2>Titolo</h2>
            <button class="modal-close-btn" data-dismiss="modal">
                <i data-lucide="x"></i>
            </button>
        </div>
        <div class="modal-body">
            Contenuto...
        </div>
    </div>
</div>
Dropdown
HTML

<div class="dropdown">
    <button class="btn btn-secondary" data-toggle="dropdown">
        Menu Dropdown
        <i data-lucide="chevron-down"></i>
    </button>
    <div class="dropdown-menu">
        <a href="#" class="dropdown-item">Azione 1</a>
        <a href="#" class="dropdown-item">Azione 2</a>
    </div>
</div>
Tabs
HTML

<ul class="tabs-nav">
    <li><a href="#tab1" class="tab-link active">Tab 1</a></li>
    <li><a href="#tab2" class="tab-link">Tab 2</a></li>
</ul>

<div class="tabs-content">
    <div id="tab1" class="tab-pane active">
        Contenuto del Tab 1...
    </div>
    <div id="tab2" class="tab-pane">
        Contenuto del Tab 2...
    </div>
</div>
Dark Mode
Aggiungi la classe .theme-dark al tag <body> o a qualsiasi contenitore. nero.js non gestisce il toggle automatico; dovrai aggiungere la tua logica per attivare/disattivare questa classe (vedi styleguide.html per un esempio).

HTML

<body class="theme-dark">
    </body>
