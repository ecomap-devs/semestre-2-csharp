document.addEventListener('DOMContentLoaded', function () {
    const chart = document.getElementById('bioma-chart');
    const pieEl = document.getElementById('bioma-pie');
    const legendEl = document.getElementById('bioma-pie-legend');
    const lineEl = document.getElementById('bioma-line');
    const radarEl = document.getElementById('bioma-radar-chart');

    if (!chart) {
        console.warn('bioma-pie: contêiner #bioma-chart não encontrado');
        return;
    }

    const rows = Array.from(chart.querySelectorAll('.chart-row'));
    const data = rows.map(r => {
        const label = (r.querySelector('.label')?.textContent || '').trim();
        const val = Number(r.querySelector('.bar-fill')?.dataset.value || 0);
        return { label, val };
    }).filter(d => d.label && !isNaN(d.val));

    if (!data.length) {
        console.warn('bioma-pie: sem dados');
        return;
    }

    const colors = ['#065f46', '#16a34a', '#0ea5a4', '#f59e0b', '#2563eb'];
    const total = data.reduce((s, d) => s + d.val, 0) || 1;

    // donut (mantém comportamento anterior)
    if (pieEl && legendEl) {
        let start = 0;
        const parts = data.map((d, i) => {
            const pct = (d.val / total) * 100;
            const end = start + pct;
            const part = `${colors[i % colors.length]} ${start}% ${end}%`;
            start = end;
            return part;
        });
        pieEl.style.background = `conic-gradient(${parts.join(',')})`;

        legendEl.innerHTML = '';
        data.forEach((d, i) => {
            const pct = Math.round((d.val / total) * 100);
            const li = document.createElement('li');
            li.className = 'flex items-center';
            li.innerHTML = `
                <span class="swatch" style="background:${colors[i % colors.length]}"></span>
                <span class="ml-1">${d.label}</span>
                <span class="value">${d.val} mil <span class="text-gray-500">(${pct}%)</span></span>
            `;
            legendEl.appendChild(li);
        });

        try {
            const obsPie = new IntersectionObserver((entries, o) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        pieEl.classList.add('in-view');
                        o.disconnect();
                    }
                });
            }, { threshold: 0.15 });
            obsPie.observe(pieEl);
            setTimeout(() => { if (!pieEl.classList.contains('in-view')) pieEl.classList.add('in-view'); }, 700);
        } catch (e) { pieEl.classList.add('in-view'); }
    }

    // line chart builder (mantido)
    function drawLineChart() {
        if (!lineEl) return;
        lineEl.innerHTML = '';
        const containerWidth = Math.max(300, lineEl.clientWidth || 600);
        const height = 260;
        const margin = { left: 44, right: 20, top: 20, bottom: 46 };
        const plotW = Math.max(100, containerWidth - margin.left - margin.right);
        const plotH = Math.max(80, height - margin.top - margin.bottom);
        const maxVal = Math.max(...data.map(d => d.val), 1);

        const points = data.map((d, i) => {
            const x = margin.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
            const y = margin.top + (1 - (d.val / maxVal)) * plotH;
            return { x, y, val: d.val, label: d.label, color: colors[i % colors.length] };
        });

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${containerWidth} ${height}`);
        svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
        svg.classList.add('bioma-line-svg');
        svg.style.width = '100%';
        svg.style.height = `${height}px`;

        const gGrid = document.createElementNS(svgNS, 'g');
        gGrid.setAttribute('class', 'grid');
        const steps = 4;
        for (let i = 0; i <= steps; i++) {
            const gy = margin.top + (i / steps) * plotH;
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', margin.left);
            line.setAttribute('x2', margin.left + plotW);
            line.setAttribute('y1', gy);
            line.setAttribute('y2', gy);
            line.setAttribute('stroke', 'rgba(6,95,70,0.06)');
            line.setAttribute('stroke-width', '1');
            gGrid.appendChild(line);

            const yVal = Math.round(maxVal * (1 - i / steps));
            const t = document.createElementNS(svgNS, 'text');
            t.setAttribute('x', margin.left - 10);
            t.setAttribute('y', gy + 4);
            t.setAttribute('text-anchor', 'end');
            t.setAttribute('font-size', '11');
            t.setAttribute('fill', '#374151');
            t.textContent = yVal;
            gGrid.appendChild(t);
        }
        svg.appendChild(gGrid);

        const dStr = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', dStr);
        path.setAttribute('fill', 'none');
        path.setAttribute('class', 'bioma-line-path');
        path.setAttribute('stroke', 'rgba(6,95,70,0.8)');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);

        const gPoints = document.createElementNS(svgNS, 'g');
        gPoints.setAttribute('class', 'points');
        points.forEach((p, i) => {
            const c = document.createElementNS(svgNS, 'circle');
            c.setAttribute('cx', p.x);
            c.setAttribute('cy', p.y);
            c.setAttribute('r', 6);
            c.setAttribute('fill', p.color);
            c.setAttribute('stroke', '#ffffff');
            c.setAttribute('stroke-width', '2');
            c.setAttribute('class', 'bioma-point');
            gPoints.appendChild(c);

            const v = document.createElementNS(svgNS, 'text');
            v.setAttribute('x', p.x + 10);
            v.setAttribute('y', p.y - 10);
            v.setAttribute('font-size', '12');
            v.setAttribute('fill', '#065f46');
            v.textContent = `${p.val} mil`;
            gPoints.appendChild(v);

            const xl = document.createElementNS(svgNS, 'text');
            xl.setAttribute('x', p.x);
            xl.setAttribute('y', margin.top + plotH + 24);
            xl.setAttribute('text-anchor', 'middle');
            xl.setAttribute('font-size', '12');
            xl.setAttribute('fill', '#065f46');
            xl.textContent = p.label;
            gPoints.appendChild(xl);
        });
        svg.appendChild(gPoints);
        lineEl.appendChild(svg);

        try {
            const len = path.getTotalLength();
            path.style.strokeDasharray = `${len}`;
            path.style.strokeDashoffset = `${len}`;
            requestAnimationFrame(() => {
                path.style.transition = 'stroke-dashoffset 900ms ease-out, opacity 600ms ease';
                path.style.strokeDashoffset = '0';
                path.style.opacity = '1';
                gPoints.querySelectorAll('circle, text').forEach((el, idx) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(6px)';
                    el.style.transition = `opacity .35s ease ${0.14 + idx * 0.03}s, transform .35s ease ${0.14 + idx * 0.03}s`;
                    requestAnimationFrame(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                });
            });
        } catch (e) {
            path.style.opacity = '1';
        }
    }

    // --- Radar chart builder ---
    function drawRadarChart() {
        if (!radarEl) return;
        radarEl.innerHTML = '';
        const width = Math.max(220, radarEl.clientWidth || 320);
        const height = width;
        const svgNS = 'http://www.w3.org/2000/svg';
        const margin = 28;
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) / 2 - margin;
        const levels = 4;
        const maxVal = Math.max(...data.map(d => d.val), 1);
        const n = data.length;

        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.classList.add('bioma-radar-svg');

        // grid concentric polygons
        for (let level = levels; level >= 1; level--) {
            const rFactor = level / levels;
            const pts = [];
            for (let i = 0; i < n; i++) {
                const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                const x = cx + Math.cos(angle) * radius * rFactor;
                const y = cy + Math.sin(angle) * radius * rFactor;
                pts.push(`${x},${y}`);
            }
            const poly = document.createElementNS(svgNS, 'polygon');
            poly.setAttribute('points', pts.join(' '));
            poly.setAttribute('class', 'bioma-radar-grid');
            svg.appendChild(poly);
        }

        // axes and labels
        for (let i = 0; i < n; i++) {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
            const xOuter = cx + Math.cos(angle) * radius;
            const yOuter = cy + Math.sin(angle) * radius;

            const axis = document.createElementNS(svgNS, 'line');
            axis.setAttribute('x1', cx);
            axis.setAttribute('y1', cy);
            axis.setAttribute('x2', xOuter);
            axis.setAttribute('y2', yOuter);
            axis.setAttribute('class', 'bioma-radar-axis');
            svg.appendChild(axis);

            const lx = cx + Math.cos(angle) * (radius + 14);
            const ly = cy + Math.sin(angle) * (radius + 14);
            const t = document.createElementNS(svgNS, 'text');
            t.setAttribute('x', lx);
            t.setAttribute('y', ly + 4);
            // escolher alinhamento
            const dx = Math.cos(angle);
            if (Math.abs(dx) < 0.2) t.setAttribute('text-anchor', 'middle');
            else if (dx > 0) t.setAttribute('text-anchor', 'start');
            else t.setAttribute('text-anchor', 'end');
            t.setAttribute('class', 'bioma-radar-label');
            t.textContent = data[i].label;
            svg.appendChild(t);
        }

        // area path (values)
        const areaPts = data.map((d, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
            const factor = d.val / maxVal;
            const x = cx + Math.cos(angle) * radius * factor;
            const y = cy + Math.sin(angle) * radius * factor;
            return { x, y, color: colors[i % colors.length], val: d.val };
        });

        const areaPathD = areaPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        const areaPath = document.createElementNS(svgNS, 'path');
        areaPath.setAttribute('d', areaPathD);
        areaPath.setAttribute('class', 'bioma-radar-area');
        svg.appendChild(areaPath);

        // points + value labels
        const gp = document.createElementNS(svgNS, 'g');
        gp.setAttribute('class', 'bioma-radar-points');
        areaPts.forEach((p) => {
            const c = document.createElementNS(svgNS, 'circle');
            c.setAttribute('cx', p.x);
            c.setAttribute('cy', p.y);
            c.setAttribute('r', 5);
            c.setAttribute('fill', p.color);
            c.setAttribute('class', 'bioma-radar-point');
            gp.appendChild(c);

            const vt = document.createElementNS(svgNS, 'text');
            vt.setAttribute('x', p.x + 8);
            vt.setAttribute('y', p.y + 4);
            vt.setAttribute('font-size', '11');
            vt.setAttribute('fill', '#065f46');
            vt.textContent = `${p.val} mil`;
            gp.appendChild(vt);
        });
        svg.appendChild(gp);

        radarEl.appendChild(svg);

        // animação do preenchimento (stroke-dash para path)
        try {
            const len = areaPath.getTotalLength();
            areaPath.style.strokeDasharray = `${len}`;
            areaPath.style.strokeDashoffset = `${len}`;
            requestAnimationFrame(() => {
                areaPath.style.transition = 'stroke-dashoffset 900ms ease-out, opacity 450ms ease';
                areaPath.style.strokeDashoffset = '0';
                areaPath.style.opacity = '1';
            });
        } catch (e) {
            areaPath.style.opacity = '1';
        }
    }

    // inicializa charts existentes
    if (lineEl) drawLineChart();
    drawRadarChart();

    // debounce resize para desenhar line + radar
    let resizeTimer = null;
    const ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (lineEl) drawLineChart();
            drawRadarChart();
        }, 160);
    });
    // observar elementos se existirem
    if (lineEl) ro.observe(lineEl);
    if (radarEl) ro.observe(radarEl);
    ro.observe(chart);

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (lineEl) drawLineChart();
            drawRadarChart();
        }, 200);
    });

    // animação por viewport (garante que radar seja redesenhado ao ficar visível)
    try {
        if (radarEl) {
            const obsR = new IntersectionObserver((entries, o) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        drawRadarChart();
                        o.disconnect();
                    }
                });
            }, { threshold: 0.12 });
            obsR.observe(radarEl);
        }
    } catch (e) { /* ignore */ }
});