/* =============================================
   Nero.js - Core Framework JavaScript
   (Versione con formato data dd-mm-yyyy e fix overflow)
   ============================================= */

(function () {
    'use strict';

    function initializeFramework() {

        // =================================================================
        // === HELPERS GLOBALI (Accessibili a tutti i setup) ===
        // =================================================================

        /**
         * Chiude tutti i pannelli dropdown aperti e li rimette nel loro wrapper.
         * @param {HTMLElement} [excludePanel=null] - Il pannello da non chiudere.
         */
        function closeAllDropdowns(excludePanel = null) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== excludePanel) {
                    menu.classList.remove('show');
                    // Riposiziona il menu nel suo contenitore originale
                    if (menu._neroWrapper) {
                        menu._neroWrapper.appendChild(menu);
                        menu.style.position = '';
                        menu.style.top = '';
                        menu.style.left = '';
                    }
                }
            });
        }

        /**
         * Chiude tutti i pannelli datepicker aperti e li rimette nel loro wrapper.
         * @param {HTMLElement} [excludePanel=null] - Il pannello da non chiudere.
         */
        function closeAllDatepickers(excludePanel = null) {
            document.querySelectorAll('.datepicker-panel.show').forEach(panel => {
                if (panel !== excludePanel) {
                    panel.classList.remove('show');
                    // Riposiziona il pannello nel suo contenitore originale
                    if (panel._neroWrapper) {
                        panel._neroWrapper.appendChild(panel);
                        panel.style.position = '';
                        panel.style.top = '';
                        panel.style.left = '';
                    }
                }
            });
        }
        
        /**
         * Calcola la posizione assoluta di un pannello (dropdown/datepicker)
         * rispetto al suo elemento "trigger" (un bottone o un input).
         */
        function positionPanel(triggerElement, panelElement) {
            const rect = triggerElement.getBoundingClientRect();
            panelElement.style.position = 'absolute'; // Usiamo absolute rispetto al body
            panelElement.style.top = `${window.scrollY + rect.bottom + 4}px`; // 4px di offset
            panelElement.style.left = `${window.scrollX + rect.left}px`;
        }

        // =================================================================
        // === SETUP DEI COMPONENTI ===
        // =================================================================

        // --- GESTIONE SIDEBAR (Mobile & Desktop) ---
        function setupSidebar() {
            const sidebar = document.querySelector('.sidebar');
            const sidebarOverlay = document.querySelector('.sidebar-overlay');
            const mobileToggleBtn = document.querySelector('.site-nav .sidebar-toggle-btn');
            const desktopToggleBtn = document.querySelector('.sidebar-header .sidebar-toggle-btn');

            if (mobileToggleBtn) {
                mobileToggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('show');
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.toggle('show');
                    }
                });
            }

            if (sidebarOverlay) {
                sidebarOverlay.addEventListener('click', () => {
                    sidebar.classList.remove('show');
                    sidebarOverlay.classList.remove('show');
                });
            }

            if (desktopToggleBtn) {
                desktopToggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('collapsed');
                });
            }
        }

        // --- GESTIONE MODALI ---
        function setupModals() {
            const modalToggles = document.querySelectorAll('[data-toggle="modal"]');

            modalToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const targetSelector = toggle.getAttribute('data-target');
                    const modal = document.querySelector(targetSelector);
                    if (modal) {
                        modal.classList.add('show');
                    }
                });
            });

            const closeModal = (modal) => {
                if (!modal) return;
                modal.classList.add('is-closing');
                modal.addEventListener('animationend', () => {
                    modal.classList.remove('show');
                    modal.classList.remove('is-closing');
                }, {
                    once: true
                });
            };

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
                    const tabContentContainer = targetPane.closest('.tabs-content');

                    tabsNav.querySelectorAll('.tab-link').forEach(tl => {
                        tl.classList.remove('active');
                    });

                    if (tabContentContainer) {
                        Array.from(tabContentContainer.children).forEach(pane => {
                            if (pane.classList.contains('tab-pane')) {
                                pane.classList.remove('active');
                            }
                        });
                    } else {
                        Array.from(targetPane.parentNode.children).forEach(pane => {
                            if (pane.classList.contains('tab-pane')) {
                                pane.classList.remove('active');
                            }
                        });
                    }

                    link.classList.add('active');
                    targetPane.classList.add('active');
                });
            });

            document.querySelectorAll('.tabs-nav').forEach(nav => {
                const firstLink = nav.querySelector('.tab-link.active');
                if (firstLink) {
                    const targetPaneId = firstLink.getAttribute('href');
                    const targetPane = document.querySelector(targetPaneId);
                    if (targetPane) {
                        targetPane.classList.add('active');
                    }
                } else {
                    const first = nav.querySelector('.tab-link');
                    if (first) {
                        first.classList.add('active');
                        const targetPaneId = first.getAttribute('href');
                        const targetPane = document.querySelector(targetPaneId);
                        if (targetPane) {
                            targetPane.classList.add('active');
                        }
                    }
                }
            });

            document.querySelectorAll('.tab-pane:not(.active)').forEach(pane => {
                pane.classList.remove('active');
            });
        }

        // --- GESTIONE DROPDOWNS (CON LOGICA PORTAL) ---
        function setupDropdowns() {
            const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');

            dropdownToggles.forEach(toggle => {
                const wrapper = toggle.closest('.dropdown');
                if (!wrapper) return;
                const menu = wrapper.querySelector('.dropdown-menu');
                if (!menu) return;

                // Salva un riferimento al wrapper originale per rimetterlo a posto
                menu._neroWrapper = wrapper;

                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Impedisce al click di chiudere subito il menu

                    const isOpening = !menu.classList.contains('show');

                    // Chiudi tutti gli altri componenti
                    closeAllDatepickers();
                    closeAllDropdowns();

                    if (isOpening) {
                        // Sposta il menu nel body e posizionalo
                        document.body.appendChild(menu);
                        positionPanel(toggle, menu);
                        menu.classList.add('show');
                    }
                });
            });
        }

        // --- GESTIONE DATEPICKER (CON LOGICA PORTAL E FORMATO DATA) ---
        function setupDatepickers() {
            const inputs = document.querySelectorAll('[data-toggle="datepicker"]');
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalizza la data odierna

            /**
             * Converte una data in stringa 'dd-mm-YYYY'
             * @param {Date} date - L'oggetto data
             * @returns {string}
             */
            const formatDisplayDate = (date) => {
                // Formato DD-MM-YYYY
                return [
                    ('0' + date.getDate()).slice(-2),
                    ('0' + (date.getMonth() + 1)).slice(-2),
                    date.getFullYear()
                ].join('-');
            };
            
            /**
             * Converte una stringa 'dd-mm-YYYY' in un oggetto Date
             * @param {string} displayDate - La stringa data
             * @returns {Date}
             */
            const parseDisplayDate = (displayDate) => {
                if (!displayDate || !/^\d{2}-\d{2}-\d{4}$/.test(displayDate)) return new Date();
                const parts = displayDate.split('-').map(Number);
                // Attenzione: i mesi in JS sono 0-based
                // Formato: new Date(Anno, Mese-1, Giorno)
                return new Date(parts[2], parts[1] - 1, parts[0]);
            };

            const renderCalendar = (panel, date) => {
                const input = panel._neroWrapper.querySelector('input'); // Trova l'input tramite il wrapper salvato
                const selectedDateStr = input.value;
                const selectedDate = selectedDateStr && /^\d{2}-\d{2}-\d{4}$/.test(selectedDateStr) ? parseDisplayDate(selectedDateStr) : null;

                const year = date.getFullYear();
                const month = date.getMonth(); // 0-11

                panel.dataset.currentYear = year;
                panel.dataset.currentMonth = month;

                const monthYearEl = panel.querySelector('.datepicker-month-year');
                if (monthYearEl) {
                    monthYearEl.textContent = new Date(year, month).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric'
                    });
                }

                const firstDayOfMonth = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const startDayIndex = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

                const daysGrid = panel.querySelector('.datepicker-days-grid');
                if (!daysGrid) return;
                daysGrid.innerHTML = '';

                const daysInPrevMonth = new Date(year, month, 0).getDate();
                for (let i = startDayIndex; i > 0; i--) {
                    const day = daysInPrevMonth - i + 1;
                    const el = document.createElement('div');
                    el.className = 'datepicker-day other-month';
                    el.textContent = day;
                    el.dataset.date = formatDisplayDate(new Date(year, month - 1, day));
                    daysGrid.appendChild(el);
                }

                for (let i = 1; i <= daysInMonth; i++) {
                    const el = document.createElement('div');
                    el.className = 'datepicker-day';
                    el.textContent = i;
                    const currentDate = new Date(year, month, i);
                    currentDate.setHours(0, 0, 0, 0);
                    el.dataset.date = formatDisplayDate(currentDate);

                    if (today.getTime() === currentDate.getTime()) {
                        el.classList.add('today');
                    }
                    if (selectedDate && selectedDate.getTime() === currentDate.getTime()) {
                        el.classList.add('selected');
                    }
                    daysGrid.appendChild(el);
                }

                const totalCells = startDayIndex + daysInMonth;
                const nextDays = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
                for (let i = 1; i <= nextDays; i++) {
                    const el = document.createElement('div');
                    el.className = 'datepicker-day other-month';
                    el.textContent = i;
                    el.dataset.date = formatDisplayDate(new Date(year, month + 1, i));
                    daysGrid.appendChild(el);
                }
            };

            inputs.forEach(input => {
                const wrapper = input.closest('.datepicker-wrapper');
                if (!wrapper) {
                    console.warn('Input [data-toggle="datepicker"] deve essere dentro un .datepicker-wrapper');
                    return;
                }
                const panel = wrapper.querySelector('.datepicker-panel');
                if (!panel) {
                     console.warn('.datepicker-wrapper non ha un .datepicker-panel al suo interno');
                    return;
                }

                // Salva un riferimento al wrapper originale per rimetterlo a posto
                panel._neroWrapper = wrapper;

                const initialDate = input.value ? parseDisplayDate(input.value) : new Date();
                panel.dataset.currentYear = initialDate.getFullYear();
                panel.dataset.currentMonth = initialDate.getMonth();

                // Mostra pannello al focus
                input.addEventListener('focus', (e) => {
                    e.stopPropagation(); // Impedisci al click globale di chiuderlo subito
                    closeAllDropdowns();
                    closeAllDatepickers(panel);
                    
                    const dateToShow = input.value ? parseDisplayDate(input.value) : new Date();
                    
                    // Sposta il pannello nel body e posizionalo
                    document.body.appendChild(panel);
                    positionPanel(input, panel);
                    renderCalendar(panel, dateToShow);
                    panel.classList.add('show');
                });

                // Impedisci ai click interni al pannello di chiuderlo
                panel.addEventListener('click', (e) => e.stopPropagation());

                const prevBtn = panel.querySelector('.datepicker-prev');
                const nextBtn = panel.querySelector('.datepicker-next');

                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        let year = parseInt(panel.dataset.currentYear);
                        let month = parseInt(panel.dataset.currentMonth);
                        month--;
                        if (month < 0) {
                            month = 11;
                            year--;
                        }
                        renderCalendar(panel, new Date(year, month));
                    });
                }

                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        let year = parseInt(panel.dataset.currentYear);
                        let month = parseInt(panel.dataset.currentMonth);
                        month++;
                        if (month > 11) {
                            month = 0;
                            year++;
                        }
                        renderCalendar(panel, new Date(year, month));
                    });
                }

                const daysGrid = panel.querySelector('.datepicker-days-grid');
                if (daysGrid) {
                    daysGrid.addEventListener('click', (e) => {
                        const dayEl = e.target.closest('.datepicker-day');
                        if (dayEl && dayEl.dataset.date) {
                            input.value = dayEl.dataset.date;
                            const selected = parseDisplayDate(dayEl.dataset.date);
                            panel.dataset.currentYear = selected.getFullYear();
                            panel.dataset.currentMonth = selected.getMonth();
                            closeAllDatepickers(); // Chiude e rimette a posto il pannello
                            input.blur();
                        }
                    });
                }
            });
        }
        
        // --- GESTIONE CHIUSURA GLOBALE ---
        function setupGlobalClick() {
             window.addEventListener('click', (e) => {
                // Se il click non è su un toggle dropdown O un wrapper datepicker, chiudi entrambi
                if (!e.target.closest('[data-toggle="dropdown"]') && !e.target.closest('[data-toggle="datepicker"]')) {
                    closeAllDropdowns();
                    closeAllDatepickers();
                }
            });
        }

        // --- INIZIALIZZAZIONE ---
        setupSidebar();
        setupModals();
        setupTabs();
        setupDropdowns();
        setupDatepickers();
        setupGlobalClick(); // Gestisce la chiusura cliccando fuori
    }

    // Avvia tutto quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFramework);
    } else {
        // DOM già pronto
        initializeFramework();
    }

})();