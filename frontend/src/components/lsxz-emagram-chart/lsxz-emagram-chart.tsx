import { Component, Element, Prop } from "@stencil/core";
import { Selection, select } from "d3-selection";
import ResizeObserver from "resize-observer-polyfill";
import { scaleLinear, axisBottom, axisLeft, line, curveMonotoneX, range } from "d3";

const margin: any = { left: 40, right: 10, top: 10, bottom: 20 };
const minTemp: number = -25;
const maxTemp: number = 30;
const maxAlt: number = 4000;
const dryAdiabateFactor: number = 0.01;
const dryAdiabateStep: number = 5;

@Component({
  tag: "lsxz-emagram-chart",
  styleUrl: "lsxz-emagram-chart.css",
  shadow: false
})
export class LszxEmagramChart {

  @Element() element: HTMLElement;
  svgElementRef: SVGSVGElement;
  svg: Selection<Element, any, HTMLElement, any>;
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
  
      this.drawChart(w, h);
    });
    this.ro.observe(this.element);
  }

  drawChart(w, h) {
    this.svg.selectAll("*").remove();

    let xScale = scaleLinear()
      .domain([ minTemp, maxTemp ])
      .rangeRound([margin.left, w - margin.right]);

    let yScale = scaleLinear()
      .domain([ maxAlt, 0 ])
      .rangeRound([margin.top, h - margin.bottom]);

    this.drawGrid(w, h, xScale, yScale);
    this.drawDryAdiabates(xScale, yScale);
  }

  drawGrid(w, h, xScale, yScale) {
    const grid = this.svg.append("g").attr("class", "grid");

    grid.append("g") // x legend
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(axisBottom(xScale).ticks(10).tickSize(-h + margin.top + margin.bottom));

    grid.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axisLeft(yScale).ticks(8).tickSize(-w + margin.right + margin.left));
  }

  drawDryAdiabates(xScale, yScale) {
    const dryAdiabateGrid = this.svg.append("g")
      .attr("class", "dryAdiabateGrid");

    const xyLine = line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
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

  render() {
    return (
      <svg className="container" width="100%" height="1"
           ref={(ref: SVGSVGElement) => this.svgElementRef = ref}>
      </svg>
    );
  }
}
