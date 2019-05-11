import { Component, Element, Prop } from "@stencil/core";
import { Selection, select } from "d3-selection";
import ResizeObserver from "resize-observer-polyfill";
import { scaleLinear, axisBottom, axisLeft, line, curveMonotoneX, range, ScaleLinear } from "d3";

const margin: any = { left: 40, right: 10, top: 10, bottom: 20 };
const minTemp: number = -25;
const maxTemp: number = 30;
const maxAlt: number = 4000;
const dryAdiabateFactor: number = 0.01;
const dryAdiabateStep: number = 5;

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
    this.drawTemperature();
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

  render() {
    if(!this.data)
      return (<span>No data</span>);

    // this is not only for accessability, it's also to enforce component update.
    // otherwise, when no dom element is changed, component will not update.
    const descriptionText = `Emagramm der Messstationen: ${this.data.map(d => d.station)}`;

    return (
      <svg className="container" width="100%" height="1" aria-label={descriptionText}
           ref={(ref: SVGSVGElement) => this.svgElementRef = ref}>
      </svg>
    );
  }
}
