import { h, Component, Element, Prop } from "@stencil/core";
import { Selection, select } from "d3-selection";
import ResizeObserver from "resize-observer-polyfill";
import { scaleLinear, axisBottom, axisLeft, line, curveMonotoneX, range, ScaleLinear } from "d3";
import { calcWindParts } from "../../utils/utils";

const margin: any = { left: 40, right: 10, top: 10, bottom: 20 };
const minTemp: number = -25;
const maxTemp: number = 30;
const maxAlt: number = 4000;
const dryAdiabateFactor: number = 0.01;
const dryAdiabateStep: number = 5;
const textTempOffset: number = 14;
const windArrowTempY: number = 27.5;
const windArrowTextOffset: number = -28;

@Component({
  tag: "lszx-emagram-chart",
  styleUrl: "lszx-emagram-chart.css",
  shadow: false
})
export class LszxEmagramChart {

  @Element() element: HTMLElement;
  svgElementRef: SVGSVGElement;
  svg: Selection<Element, any, HTMLElement, any>;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  ro: ResizeObserver;

  @Prop() data: any;

  componentDidLoad() {
    this.ro = new ResizeObserver(entries => {
      const bounds = entries[0].contentRect;
      const w = bounds.width;
      const h = 2*w/3;

      this.svg = select(this.svgElementRef);
      this.svgElementRef.setAttribute("width", `${w}`);
      this.svgElementRef.setAttribute("height", `${h}`);

      this.drawChartBase(w, h);
      this.drawChartData();
    });
    this.ro.observe(this.element);
  }

  componentDidUpdate() {
    this.drawChartData();
  }

  drawChartBase(w, h) {
    this.svg.selectAll("*").remove();

    this.xScale = scaleLinear()
      .domain([ minTemp, maxTemp ])
      .rangeRound([margin.left, w - margin.right]);

    this.yScale = scaleLinear()
      .domain([ maxAlt, 0 ])
      .rangeRound([margin.top, h - margin.bottom]);

    this.drawGrid(w, h);
    this.drawDryAdiabates();
  }

  drawGrid(w, h) {
    const grid = this.svg.append("g").attr("class", "grid");

    grid.append("g") // x legend
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(axisBottom(this.xScale).ticks(10).tickSize(-h + margin.top + margin.bottom));

    grid.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axisLeft(this.yScale).ticks(8).tickSize(-w + margin.right + margin.left));
  }

  drawDryAdiabates() {
    const dryAdiabateGrid = this.svg.append("g")
      .attr("class", "dryAdiabateGrid");

    const xyLine = line()
      .x(d => this.xScale(d[0]))
      .y(d => this.yScale(d[1]))
      .curve(curveMonotoneX);

    range(minTemp + dryAdiabateStep, (maxTemp + (maxTemp - minTemp)), dryAdiabateStep)
      .map(t => {
        let x0 = t, y0 = 0;
        let x1 = minTemp;
        let y1 = (t-minTemp) / dryAdiabateFactor;
        if(y1 > maxAlt) {
          let diff = y1 - maxAlt;
          x1 += diff * dryAdiabateFactor;
          y1 = maxAlt;
        }
        if(t > maxTemp) {
          let diff = t - maxTemp;
          y0 += diff / dryAdiabateFactor;
          x0 = maxTemp;
        }
        dryAdiabateGrid
          .append("path")
          .datum([[x0, y0], [x1, y1]])
          .attr("d", xyLine);
      });
  }

  drawChartData() {
    this.svg.selectAll(".data").remove();
    this.drawStationNames();
    this.drawTemperature();
    this.drawDewpoint();
    this.drawWindArrows();
    this.drawWindData();
  }

  drawStationNames() {
    const stationNames = this.svg.append("g")
      .attr("class", "data stationtexts");

      this.data.forEach(s => {
      stationNames.append("text")
        .attr("x", this.xScale(s.temperature) + textTempOffset)
        .attr("y", this.yScale(s.alt) + 5)
        .text(`${s.stationName} (${s.alt}m)`);
    });
  }

  drawTemperature() {
    const stations = this.svg.append("g")
      .attr("class", "data temperature");

    // temperature points
    this.data.forEach(s => {
      stations.append("circle")
        .attr("cx", this.xScale(s.temperature))
        .attr("cy", this.yScale(s.alt))
        .attr("r", 3);
    });

    // temperature line
    const xyLine = line()
      .x(d => this.xScale(d[0]))
      .y(d => this.yScale(d[1]));
    stations.append("path")
      .datum(this.data.map(d => [ d.temperature, d.alt ]))
      .attr("d", xyLine);
  }

  drawDewpoint() {
    const stations = this.svg.append("g")
      .attr("class", "data dewpoint");

    // dewpoint points
    this.data.forEach(s => {
      stations.append("circle")
        .attr("cx", this.xScale(s.dewpoint))
        .attr("cy", this.yScale(s.alt))
        .attr("r", 3);
    });

    // dewpoint line
    const xyLine = line()
      .x(d => this.xScale(d[0]))
      .y(d => this.yScale(d[1]));
    stations.append("path")
      .datum(this.data.map(d => [ d.dewpoint, d.alt ]))
      .attr("d", xyLine);
  }

  drawWindArrows() {
    const windArrows = this.svg.append("g")
      .attr("class", "data wind");

    this.data.forEach(s => {

      let windParts = calcWindParts(s.windSpeed);
      let x = this.xScale(windArrowTempY);
      let y = this.yScale(s.alt);

      let windArrow = windArrows.append("g")
        .attr("class", "arrow")
        .attr("transform", `translate(${x} ${y}) rotate(${-90 + s.windDirection})`);

      // base line

      // circle if < 5 knots
      if(windParts.symbols == 0) {
        windArrow.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 6);
      }
      else {
        let windArrowSize = this.xScale(2) - this.xScale(0); // width: around 2°C ;)
        let windArrowX = -windArrowSize/2;

        // base line
        windArrow.append("line")
          .attr("x1", windArrowX).attr("y1", "0")
          .attr("x2", -windArrowX).attr("y2", "0");

        // triangles (50knots)
        for(let i=0; i<windParts.triangles; i++) {
          windArrow.append("path")
            .attr("d", `M ${windArrowX},0 L ${windArrowX-(5/30 * windArrowSize)} 0 L ${windArrowX-(2/30 * windArrowSize)} ${(-1/3) * windArrowSize} L ${windArrowX+2} 0`);
          windArrowX += 8;
        }

        // large dashes (10knots)
        for(let i=0; i<windParts.largeDashes; i++) {
          windArrow.append("line")
            .attr("x1", windArrowX).attr("y1", "0")
            .attr("x2", windArrowX-(1/10 * windArrowSize)).attr("y2", (-12/30 * windArrowSize));
          windArrowX += 5;
        }

        // small dashes (5knots)
        for(let i=0; i<windParts.smallDashes; i++) {
          windArrow.append("line")
            .attr("x1", windArrowX).attr("y1", "0")
            .attr("x2", windArrowX-(2/30 * windArrowSize)).attr("y2", (-8/30 * windArrowSize));
          windArrowX += 5;
        }
      }
    });
  }

  drawWindData() {
    const stationNames = this.svg.append("g")
    .attr("class", "data winddata");

    this.data.forEach(s => {
      stationNames.append("text")
        .attr("x", this.xScale(windArrowTempY) + windArrowTextOffset)
        .attr("y", this.yScale(s.alt) - 4)
        .html(s.windDirection);
      stationNames.append("text")
        .attr("x", this.xScale(windArrowTempY) + windArrowTextOffset)
        .attr("y", this.yScale(s.alt) + 8)
        .html(`${s.windSpeed} / ${s.windGusts}`);
      });
  }

  render() {
    if(!this.data)
      return (<span>No data</span>);

    // this is not only for accessability, it's also to enforce component update.
    // otherwise, when no dom element is changed, component will not update.
    const descriptionText = `Emagramm der Messstationen: ${this.data.map(d => d.station)}`;

    return (
      <svg class="container" width="100%" height="1" aria-label={descriptionText}
           ref={el => this.svgElementRef = el}>
      </svg>
    );
  }
}
