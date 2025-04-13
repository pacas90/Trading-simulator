
export class Curve {
    constructor(width, height,parentElement) {
        this.width = width;
        this.height = height;
        this.color = 'var(--text-accent)';
        this.gridColor = 'var(--semi-transparent-accent)';
        this.fillColor = 'var(--semi-transparent-accent)';
        this.parentElement = parentElement;
        this.points = [];


        // Margins to accommodate axis labels
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
        this.plotWidth = width - this.margin.left - this.margin.right;
        this.plotHeight = height - this.margin.top - this.margin.bottom;

        this.svgNS = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(this.svgNS, "svg");
        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);
        this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        this.svg.setAttribute('class', 'dashboard-curve');

        this.parentElement.appendChild(this.svg);



        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('tooltip');
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
        this.tooltip.style.color = 'white';
        this.tooltip.style.padding = '5px 8px';
        this.tooltip.style.borderRadius = '4px';
        this.tooltip.style.pointerEvents = 'none';
        this.tooltip.style.display = 'none';
        this.tooltip.style.fontFamily = 'Arial, sans-serif';
        this.tooltip.style.fontSize = '12px';
        this.parentElement.appendChild(this.tooltip);

        // Add mouse event listeners
        this.svg.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.svg.addEventListener('mouseleave', () => this.hideTooltip());

        this.trackingDot = document.createElementNS(this.svgNS, "circle");
        this.trackingDot.setAttribute("r", "4");
        this.trackingDot.setAttribute("fill", this.color);
        this.trackingDot.setAttribute("stroke", "white");
        this.trackingDot.setAttribute("stroke-width", "2");
        this.trackingDot.style.display = 'none';
        this.svg.appendChild(this.trackingDot);

    }

    drawGrid() {
        const gridSize = 20;
        // Vertical grid lines within plot area
        for (let x = this.margin.left; x <= this.margin.left + this.plotWidth; x += gridSize) {
            const line = document.createElementNS(this.svgNS, "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", this.margin.top);
            line.setAttribute("x2", x);
            line.setAttribute("y2", this.margin.top + this.plotHeight);
            line.setAttribute("stroke", this.gridColor);
            line.setAttribute("stroke-width", "1");
            this.svg.appendChild(line);
        }
        // Horizontal grid lines within plot area
        for (let y = this.margin.top; y <= this.margin.top + this.plotHeight; y += gridSize) {
            const line = document.createElementNS(this.svgNS, "line");
            line.setAttribute("x1", this.margin.left);
            line.setAttribute("y1", y);
            line.setAttribute("x2", this.margin.left + this.plotWidth);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", this.gridColor);
            line.setAttribute("stroke-width", "1");
            this.svg.appendChild(line);
        }
    }

    drawCurve(points) {

        const children = Array.from(this.svg.children);
        children.forEach(child => {
            if (child !== this.trackingDot) {
                this.svg.removeChild(child);
            }
        });


        // Reverse points to ensure chronological order (oldest -> newest)
        this.points = [...points].reverse();
    
        this.svg.innerHTML = "";
        this.drawGrid();
    
        if (this.points.length < 2) return;
    
        // Use index-based X values (0 to N-1)
        const xMin = 0;
        const xMax = this.points.length - 1;
        const yMin = Math.min(...this.points.map(d => d.y));
        const yMax = Math.max(...this.points.map(d => d.y));
    
        // Index-based scaling
        const scaleX = x => {
            if (xMax === 0) return this.margin.left;
            return this.margin.left + (x / xMax) * this.plotWidth;
        };
        
        const scaleY = y => this.margin.top + this.plotHeight - ((y - yMin) / (yMax - yMin)) * this.plotHeight;
    
        // Draw axes
        this.drawXAxis(scaleX);
        this.drawYAxis(scaleY, yMin, yMax);
    
        // Draw curve lines
        for (let i = 0; i < this.points.length - 1; i++) {
            const line = document.createElementNS(this.svgNS, "line");
            line.setAttribute("x1", scaleX(i));
            line.setAttribute("y1", scaleY(this.points[i].y));
            line.setAttribute("x2", scaleX(i + 1));
            line.setAttribute("y2", scaleY(this.points[i + 1].y));
            line.setAttribute("stroke", this.color);
            line.setAttribute("stroke-width", "1");
            this.svg.appendChild(line);
        }
        this.drawBackground(scaleX, scaleY);
    }
    drawXAxis(scaleX) {
        // X-axis line
        const axisLine = document.createElementNS(this.svgNS, 'line');
        axisLine.setAttribute('x1', this.margin.left);
        axisLine.setAttribute('y1', this.margin.top + this.plotHeight);
        axisLine.setAttribute('x2', this.margin.left + this.plotWidth);
        axisLine.setAttribute('y2', this.margin.top + this.plotHeight);
        axisLine.setAttribute('stroke', this.gridColor);
        axisLine.setAttribute('stroke-width', '2');
        this.svg.appendChild(axisLine);
    
        // Date calculation and tick generation
        const today = new Date();
        const numPoints = this.points.length;
        const numTicks = numPoints <= 7 ? numPoints : 15;
        
        // Calculate evenly spaced dates
        const dateIndices = [];
        const dates = [];
        
        // Generate dates array
        for (let i = 0; i < numPoints; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - (numPoints - 1 - i));
            dates.push(date);
        }
    
        // Calculate tick positions
        const step = Math.max(1, Math.floor(numPoints / numTicks));
        for (let i = 0; i < numPoints; i += step) {
            dateIndices.push(i);
            // Add last point if not included
            if (i + step >= numPoints && !dateIndices.includes(numPoints - 1)) {
                dateIndices.push(numPoints - 1);
            }
        }
    
        // Create ticks with dates
        dateIndices.forEach(index => {
            const xPos = scaleX(index);
            const date = dates[index];
            
            // Tick line
            const tickLine = document.createElementNS(this.svgNS, 'line');
            tickLine.setAttribute('x1', xPos);
            tickLine.setAttribute('y1', this.margin.top + this.plotHeight);
            tickLine.setAttribute('x2', xPos);
            tickLine.setAttribute('y2', this.margin.top + this.plotHeight + 5);
            tickLine.setAttribute('stroke', this.gridColor);
            this.svg.appendChild(tickLine);
    
            // Date label
            const label = document.createElementNS(this.svgNS, 'text');
            label.setAttribute('x', xPos);
            label.setAttribute('y', this.margin.top + this.plotHeight + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', 'var(--text-primary)');
            label.setAttribute('font-size', '10px');
            label.textContent = 
                `${String(date.getMonth() + 1).padStart(2, '0')}/${
                    String(date.getDate()).padStart(2, '0')}`;
            this.svg.appendChild(label);
        });
    
        // Add today's date explicitly to ensure alignment
        const lastLabel = this.svg.querySelector('text:last-child');
        if (lastLabel) {
            lastLabel.textContent = 
                `${String(today.getMonth() + 1).padStart(2, '0')}/${
                    String(today.getDate()).padStart(2, '0')}`;
        }
    }


    drawYAxis(scaleY, yMin, yMax) {
        // Y-axis line
        const axisLine = document.createElementNS(this.svgNS, 'line');
        axisLine.setAttribute('x1', this.margin.left);
        axisLine.setAttribute('y1', this.margin.top);
        axisLine.setAttribute('x2', this.margin.left);
        axisLine.setAttribute('y2', this.margin.top + this.plotHeight);
        axisLine.setAttribute('stroke', this.gridColor);
        axisLine.setAttribute('stroke-width', '2');
        this.svg.appendChild(axisLine);

        // Generate ticks
        const numTicks = 5;
        const yStep = (yMax - yMin) / (numTicks - 1);
        const yTicks = Array.from({ length: numTicks }, (_, i) => yMin + yStep * i);

        yTicks.forEach(tick => {
            const yPos = scaleY(tick);
            // Tick line
            const tickLine = document.createElementNS(this.svgNS, 'line');
            tickLine.setAttribute('x1', this.margin.left);
            tickLine.setAttribute('y1', yPos);
            tickLine.setAttribute('x2', this.margin.left - 5);
            tickLine.setAttribute('y2', yPos);
            tickLine.setAttribute('stroke', this.gridColor);
            this.svg.appendChild(tickLine);

            // Label
            const label = document.createElementNS(this.svgNS, 'text');
            label.setAttribute('x', this.margin.left - 10);
            label.setAttribute('y', yPos);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('fill', 'var(--text-primary)');
            label.setAttribute('font-size', '10px');
            label.textContent = tick.toFixed(2);
            this.svg.appendChild(label);
        });
    }

    drawBackground(scaleX, scaleY) {
        const polygon = document.createElementNS(this.svgNS, "polygon");
        
        // Use index-based positions for X coordinates
        const backgroundPoints = this.points.map((point, index) => 
            `${scaleX(index)},${scaleY(point.y)}`
        );
        
        // Add bottom corners using index-based X positions
        const lastIndex = this.points.length - 1;
        backgroundPoints.push(
            `${scaleX(lastIndex)},${this.margin.top + this.plotHeight}`,
            `${scaleX(0)},${this.margin.top + this.plotHeight}`
        );
        
        polygon.setAttribute("points", backgroundPoints.join(" "));
        polygon.setAttribute("fill", this.fillColor);
        this.svg.appendChild(polygon);
    }

    clear() {
        this.svg.innerHTML = "";
    }




    handleMouseMove(event) {
        if (!this.points.length) return;
    
        // Get precise coordinates
        const svgPoint = this.svg.createSVGPoint();
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;
        const cursorPoint = svgPoint.matrixTransform(this.svg.getScreenCTM().inverse());
    
        // Get plot area boundaries
        const plotLeft = this.margin.left;
        const plotRight = this.margin.left + this.plotWidth;
        const plotTop = this.margin.top;
        const plotBottom = this.margin.top + this.plotHeight;
    
        // Exit if outside plot area
        if (cursorPoint.x < plotLeft || cursorPoint.x > plotRight || 
            cursorPoint.y < plotTop || cursorPoint.y > plotBottom) {
            this.hideTooltip();
            return;
        }
    



        // Find nearest data point
        const xMax = this.points.length - 1;
        const plotX = cursorPoint.x - this.margin.left;
        const rawIndex = (plotX / this.plotWidth) * xMax;
        const index = Math.round(rawIndex);
        const point = this.points[Math.min(Math.max(index, 0), xMax)];
    


     

        // Calculate date
        const today = new Date();
        const pointDate = new Date(today);
        pointDate.setDate(today.getDate() - (this.points.length - 1 - index));
        const dateStr = `${String(pointDate.getMonth() + 1).padStart(2, '0')}/${
                        String(pointDate.getDate()).padStart(2, '0')}`;
    
        // Calculate Y position on curve
        const yMin = Math.min(...this.points.map(d => d.y));
        const yMax = Math.max(...this.points.map(d => d.y));
        // const yPos = this.margin.top + this.plotHeight - 
        //             ((point.y - yMin) / (yMax - yMin || 1)) * this.plotHeight;
    


                    const xPos = this.margin.left + (index / xMax) * this.plotWidth;
        const yPos = this.margin.top + this.plotHeight - 
                    ((point.y - yMin) / (yMax - yMin || 1)) * this.plotHeight;

        this.trackingDot.setAttribute("cx", xPos);
        this.trackingDot.setAttribute("cy", yPos);
        this.trackingDot.style.display = ''; // Correct SVG display
            
            


        // Update tooltip content first to measure its size
        this.tooltip.innerHTML = `Price: ${point.y.toFixed(2)}<br>Date: ${dateStr}`;
        this.tooltip.style.display = 'block';
        
        // Get tooltip dimensions after content update
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const parentRect = this.parentElement.getBoundingClientRect();
    
        // Calculate positions
        let left = cursorPoint.x + 10;
        let top = yPos - tooltipRect.height / 2;
    
        // Keep tooltip within container bounds
        if (left + tooltipRect.width > parentRect.width) {
            left = cursorPoint.x - tooltipRect.width - 10;
        }
        if (top < 0) top = 0;
        if (top + tooltipRect.height > parentRect.height) {
            top = parentRect.height - tooltipRect.height;
        }
    
        // Apply final positions
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }
    
    hideTooltip() {
        this.tooltip.style.display = 'none';
        this.trackingDot.style.display = 'none';
    }


}