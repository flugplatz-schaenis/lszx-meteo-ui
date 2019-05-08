import { Component, Element, Prop } from '@stencil/core';
import { Selection, select } from 'd3-selection';
import ResizeObserver from "resize-observer-polyfill";

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
