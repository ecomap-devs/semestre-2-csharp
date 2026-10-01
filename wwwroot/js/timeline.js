document.addEventListener('DOMContentLoaded', function () {
    const items = Array.from(document.querySelectorAll('.timeline-modern-item'));
    if (!items.length) return;

    // anima entrada dos itens (já existente)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const idx = items.indexOf(el);
                el.style.transitionDelay = (idx * 80) + 'ms';
                el.classList.add('in-view');
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.18 });

    items.forEach(i => observer.observe(i));

    // --- Conector SVG entre pontos (mais visível com "bg" desfocado + traço principal) ---
    const container = document.querySelector('.timeline-modern');
    if (!container) return;

    let svgEl = null;
    function buildConnector() {
        if (svgEl) svgEl.remove();

        const dots = Array.from(container.querySelectorAll('.dot'));
        if (dots.length < 2) return;

        // usar dimensões que reflitam o conteúdo (evita container "colapsado" por float)
        const cRect = container.getBoundingClientRect();
        const rectWidth = Math.max(cRect.width, container.scrollWidth || 0);
        const rectHeight = Math.max(cRect.height, container.scrollHeight || 0);
        const rect = { left: cRect.left, top: cRect.top, width: rectWidth, height: rectHeight };

        const points = dots.map(d => {
            const r = d.getBoundingClientRect();
            return { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top };
        });

        svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('class', 'timeline-connector');
        svgEl.setAttribute('viewBox', `0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}`);
        svgEl.setAttribute('preserveAspectRatio', 'none');
        svgEl.style.position = 'absolute';
        svgEl.style.left = '0';
        svgEl.style.top = '0';
        svgEl.style.width = '100%';
        svgEl.style.height = rect.height + 'px'; // garantir altura real
        svgEl.style.pointerEvents = 'none';
        svgEl.style.zIndex = '1';

        // path suave
        let d = '';
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (i === 0) {
                d += `M ${p.x} ${p.y}`;
            } else {
                const prev = points[i - 1];
                const midX = (prev.x + p.x) / 2;
                d += ` C ${midX} ${prev.y} ${midX} ${p.y} ${p.x} ${p.y}`;
            }
        }

       // largura responsiva dos traços
        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        const mainStroke = isMobile ? 6 : 10;
        const bgStroke = Math.round(mainStroke * 1.9);

        // caminho de fundo (glow / soft)
        const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bgPath.setAttribute('d', d);
        bgPath.setAttribute('fill', 'none');
        bgPath.setAttribute('stroke', 'rgba(6,95,70,0.16)');
        bgPath.setAttribute('stroke-width', String(bgStroke));
        bgPath.setAttribute('stroke-linecap', 'round');
        bgPath.setAttribute('stroke-linejoin', 'round');
        bgPath.setAttribute('class', 'timeline-connector-path timeline-connector-bg');
        bgPath.style.opacity = '0';
        bgPath.style.filter = 'blur(6px)';
        svgEl.appendChild(bgPath);

        // caminho principal (visível)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'rgba(6,95,70,0.36)'); // mais opaco
        path.setAttribute('stroke-width', String(mainStroke));
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('class', 'timeline-connector-path timeline-connector-front');
        path.style.opacity = '0';
        svgEl.appendChild(path);

        container.insertBefore(svgEl, container.firstChild);

        // animação de traçado (bg + frente)
        try {
            const len = path.getTotalLength();
            path.style.strokeDasharray = `${len}`;
            path.style.strokeDashoffset = `${len}`;
            bgPath.style.strokeDasharray = `${len}`;
            bgPath.style.strokeDashoffset = `${len}`;

            requestAnimationFrame(() => {
                // primeiro desenha o bg (mais suave), depois a frente
                bgPath.style.transition = 'stroke-dashoffset 1000ms ease-out, opacity 600ms ease';
                bgPath.style.strokeDashoffset = '0';
                bgPath.style.opacity = '0.9';

                setTimeout(() => {
                    path.style.transition = 'stroke-dashoffset 900ms ease-out, opacity 500ms ease';
                    path.style.strokeDashoffset = '0';
                    path.style.opacity = '1';
                }, 80);
            });
        } catch (e) {
            // alguns navegadores podem falhar em getTotalLength em SVG não anexado; tentar rebuild simples
            setTimeout(() => {
                try {
                    const len = path.getTotalLength();
                    path.style.strokeDasharray = `${len}`;
                    path.style.strokeDashoffset = `${len}`;
                    bgPath.style.strokeDasharray = `${len}`;
                    bgPath.style.strokeDashoffset = `${len}`;
                    requestAnimationFrame(() => {
                        bgPath.style.transition = 'stroke-dashoffset 1000ms ease-out, opacity 600ms ease';
                        bgPath.style.strokeDashoffset = '0';
                        bgPath.style.opacity = '0.9';
                        setTimeout(() => {
                            path.style.transition = 'stroke-dashoffset 900ms ease-out, opacity 500ms ease';
                            path.style.strokeDashoffset = '0';
                            path.style.opacity = '1';
                        }, 80);
                    });
                } catch (_) { /* ignore */ }
            }, 50);
        }
    }

    // debounce + rebuild
    let resizeTimer = null;
    function scheduleRebuild() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildConnector, 120);
    }

    buildConnector();
    window.addEventListener('resize', scheduleRebuild);
    const ro = new ResizeObserver(scheduleRebuild);
    ro.observe(container);
});