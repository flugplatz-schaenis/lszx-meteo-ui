import { Component, Element, Prop } from '@stencil/core';
import { Selection, select } from 'd3-selection';
import ResizeObserver from "resize-observer-polyfill";
import { scaleLinear, axisBottom, axisLeft } from 'd3';

const margin: any = {
  left: 40, 
  right: 10,
  top: 10,
  bottom: 20
};

@Component({
  tag: 'lsxz-emagram-chart',
  styleUrl: 'lsxz-emagram-chart.css',
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
      .domain([ 30, -20 ])
      .rangeRound([margin.left, w - margin.right]);

    let yScale = scaleLinear()
      .domain([ 4000, 0 ])
      .rangeRound([margin.top, h - margin.bottom]);

    const grid = this.svg.append("g").attr("class", "grid");

    // x axis
    grid.append("g") // x legend
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(axisBottom(xScale).ticks(10).tickSize(-h + margin.top + margin.bottom));

    // y axis
    grid.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axisLeft(yScale).ticks(8).tickSize(-w + margin.right + margin.left));

    const g = this.svg.append("g");
      g.append("circle")
        .attr("r", 5)
        .attr("cx", w / 10)
        .attr("cy", h / 10)
        .attr("fill", "red");

  }

  render() {
    return (
      <svg className="container" width="100%" height="1"
           ref={(ref: SVGSVGElement) => this.svgElementRef = ref}>
      </svg>
    );
  }
}
