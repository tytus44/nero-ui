/* =============================================
   NeRO.js - Core Framework JavaScript
   ============================================= */

(function () {
    'use strict';

    /**
     * Gestisce l'inizializzazione di tutti i componenti del framework
     * quando il DOM è completamente caricato.
     */
    function initializeFramework() {

        // --- GESTIONE SIDEBAR (Mobile & Desktop) ---
        function setupSidebar() {
            const sidebar = document.querySelector('.sidebar');
            const sidebarOverlay = document.querySelector('.sidebar-overlay');
            const mobileToggleBtn = document.querySelector('.site-nav .sidebar-toggle-btn');
            const desktopToggleBtn = document.querySelector('.sidebar-header .sidebar-toggle-btn');

            // Toggle per la sidebar mobile
            if (mobileToggleBtn) {
                mobileToggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('show');
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.toggle('show');
                    }
                });
            }

            // Chiusura sidebar mobile cliccando sull'overlay
            if (sidebarOverlay) {
                sidebarOverlay.addEventListener('click', () => {
                    sidebar.classList.remove('show');
                    sidebarOverlay.classList.remove('show');
                });
            }

            // Toggle per il collasso desktop
            if (desktopToggleBtn) {
                desktopToggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('collapsed');
                });
            }
        }

        // --- GESTIONE MODALI ---
        function setupModals() {
            const modalToggles = document.querySelectorAll('[data-toggle="modal"]');
            
            // Apertura modale
            modalToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const targetSelector = toggle.getAttribute('data-target');
                    const modal = document.querySelector(targetSelector);
                    if (modal) {
                        modal.classList.add('show');
                    }
                });
            });

            // Funzione di chiusura
            const closeModal = (modal) => {
                if (!modal) return;
                
                modal.classList.add('is-closing');
                
                modal.addEventListener('animationend', () => {
                    modal.classList.remove('show');
                    modal.classList.remove('is-closing');
                }, { once: true }); // 'once: true' rimuove l'listener dopo l'esecuzione
            };

            // Chiusura modale (click su backdrop, close button)
            document.querySelectorAll('.modal').forEach(modal => {
                const backdrop = modal.querySelector('.modal-backdrop');
                const closeButtons = modal.querySelectorAll('.modal-close-btn, [data-dismiss="modal"]');

                if (backdrop) {
                    backdrop.addEventListener('click', () => closeModal(modal));
                }

                closeButtons.forEach(btn => {
                    btn.addEventListener('click', () => closeModal(modal));
                });
            });
        }

        // --- GESTIONE TABS ---
        function setupTabs() {
            const tabLinks = document.querySelectorAll('.tab-link');

            tabLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    const targetPaneId = link.getAttribute('href');
                    const targetPane = document.querySelector(targetPaneId);
                    
                    if (!targetPane) {
                        console.warn(`Tab pane ${targetPaneId} non trovato.`);
                        return;
                    }

                    const tabsNav = link.closest('.tabs-nav');
                    const tabContentContainer = targetPane.closest('.tabs-content'); // Assumiamo un container

                    // 1. Disattiva tutti i link e i pannelli nello stesso gruppo
                    tabsNav.querySelectorAll('.tab-link').forEach(tl => {
                        tl.classList.remove('active');
                    });
                    
                    // Assumiamo che i pannelli siano fratelli nel '.tabs-content'
                    if (tabContentContainer) {
                         Array.from(tabContentContainer.children).forEach(pane => {
                            if (pane.classList.contains('tab-pane')) { // Assumiamo classe .tab-pane
                                pane.classList.remove('active');
                            }
                        });
                    } else {
                        // Fallback se non c'è .tabs-content: cerca i fratelli del targetPane
                         Array.from(targetPane.parentNode.children).forEach(pane => {
                            if (pane.classList.contains('tab-pane')) {
                                pane.classList.remove('active');
                            }
                        });
                    }


                    // 2. Attiva il link cliccato e il pannello target
                    link.classList.add('active');
                    targetPane.classList.add('active');
                });
            });
            
            // Attiva il primo tab di ogni gruppo, se presente
            document.querySelectorAll('.tabs-nav').forEach(nav => {
                const firstLink = nav.querySelector('.tab-link.active');
                if (firstLink) {
                    const targetPaneId = firstLink.getAttribute('href');
                    const targetPane = document.querySelector(targetPaneId);
                    if(targetPane) {
                        targetPane.classList.add('active');
                    }
                } else {
                    // Se nessuno è attivo, attiva il primo
                    const first = nav.querySelector('.tab-link');
                    if(first) {
                        first.classList.add('active');
                        const targetPaneId = first.getAttribute('href');
                        const targetPane = document.querySelector(targetPaneId);
                        if(targetPane) {
                            targetPane.classList.add('active');
                        }
                    }
                }
            });

            // Nascondi tutti i tab-pane non attivi all'avvio
            // (Il CSS dovrebbe già farlo, ma questo è un fallback JS)
            document.querySelectorAll('.tab-pane:not(.active)').forEach(pane => {
                 pane.classList.remove('active');
            });
        }


        // --- GESTIONE DROPDOWNS ---
        function setupDropdowns() {
            const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');

            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Impedisce al click di chiudere subito il menu

                    const menu = toggle.closest('.dropdown').querySelector('.dropdown-menu');
                    
                    // Chiudi tutti gli altri dropdown aperti
                    closeAllDropdowns(menu);

                    if (menu) {
                        menu.classList.toggle('show');
                    }
                });
            });

            // Chiusura cliccando fuori
            window.addEventListener('click', (e) => {
                // Se il click non è su un toggle, chiudi tutto
                if (!e.target.matches('[data-toggle="dropdown"]')) {
                    closeAllDropdowns();
                }
            });

            function closeAllDropdowns(excludeMenu = null) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    if (menu !== excludeMenu) {
                        menu.classList.remove('show');
                    }
                });
            }
        }


        // --- INIZIALIZZAZIONE ---
        setupSidebar();
        setupModals();
        setupTabs();
        setupDropdowns();
    }

    // Avvia tutto quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFramework);
    } else {
        // DOM già pronto
        initializeFramework();
    }

})();