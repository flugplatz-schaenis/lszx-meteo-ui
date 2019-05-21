import { Component, Element, Prop } from "@stencil/core";
import { Selection, select } from "d3-selection";
import { scaleLinear, axisBottom, axisLeft, line, curveMonotoneX, range, ScaleLinear } from "d3";
import { calcWindParts, calcGradient } from "../../utils/utils";

const margin: any = { left: 40, right: 10, top: 10, bottom: 20 };
const minTemp: number = -40;
const maxTemp: number = 40;
const maxAlt: number = 4000;
const dryAdiabateFactor: number = 0.01;
const dryAdiabateStep: number = 5;
const stationTextOffset: number = 50;
const stationTextPadding: number = 3;
const windArrowMinSize: number = 15;
const windArrowTempX: number = 37.5;
const windArrowTextOffsetTempX: number = 1.8;
const gradientLineOffsetTempX: number = 1;

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
  w: number;
  h: number;

  @Prop() data: any;
  @Prop() width: number;
  @Prop() showCaptions: boolean = true;

  componentDidLoad() {
    this.svg = select(this.svgElementRef);
    this.setBounds();
    this.drawChartBase();
    this.drawChartData();
  }

  componentDidUpdate() {
    if(this.width != this.w) {
      this.setBounds();
      this.drawChartBase();
    }
    this.drawChartData();
  }

  setBounds() {
    this.w = this.width;
    this.h = 2*this.w/3;
    this.svgElementRef.setAttribute("width", `${this.w}`);
    this.svgElementRef.setAttribute("height", `${this.h}`);
  }

  drawChartBase() {
    this.svg.selectAll(".base").remove();
    this.svg.selectAll(".data").remove();

    this.xScale = scaleLinear()
      .domain([ minTemp, maxTemp ])
      .rangeRound([margin.left, this.w - margin.right]);

    this.yScale = scaleLinear()
      .domain([ maxAlt, 0 ])
      .rangeRound([margin.top, this.h - margin.bottom]);

    this.drawGrid();
    this.drawDryAdiabates();
  }

  drawGrid() {
    const grid = this.svg.append("g").attr("class", "base grid");

    grid.append("g") // x legend
      .attr("transform", `translate(0, ${this.h - margin.bottom})`)
      .call(axisBottom(this.xScale).ticks(10).tickSize(-this.h + margin.top + margin.bottom));

    grid.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axisLeft(this.yScale).ticks(8).tickSize(-this.w + margin.right + margin.left));
  }

  drawDryAdiabates() {
    const dryAdiabateGrid = this.svg.append("g")
      .attr("class", "base dryAdiabateGrid");

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
    if(!this.data) return;
    this.svg.selectAll(".data").remove();
    this.drawTemperature();
    this.drawDewpoint();
    this.drawWindArrows();
    if(this.showCaptions) {
      this.drawWindData();
      this.drawStationNames();
      this.drawGradientValues();
    }
  }

  drawStationNames() {
    const stationNames = this.svg.append("g")
      .attr("class", "data stationtexts");

    this.data.forEach(s => {
      let text = stationNames.append("text")
        .attr("x", stationTextOffset)
        .attr("y", this.yScale(s.alt) + 5)
        .text(`${s.stationName} (${s.alt}m)`);
      let textBBox = text.node().getBBox();
      stationNames.insert("rect", "text")
        .attr("class", "textbg")
        .attr("x", textBBox.x - stationTextPadding).attr("y", textBBox.y - stationTextPadding)
        .attr("width", textBBox.width + (2 * stationTextPadding)).attr("height", textBBox.height + (2 * stationTextPadding))
        .attr("filter", "url(#blur1)");
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
      let x = this.xScale(windArrowTempX);
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
        let windArrowSize = Math.max(this.xScale(2) - this.xScale(0), windArrowMinSize); // width: around 2°C ;)
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
    const windData = this.svg.append("g")
    .attr("class", "data winddata");

    this.data.forEach(s => {
      windData.append("text")
        .attr("x", this.xScale(windArrowTempX - windArrowTextOffsetTempX))
        .attr("y", this.yScale(s.alt) + 4)
        .html(`${s.windDirection}° / ${s.windSpeed} / ${s.windGusts}`);
      });
  }

  drawGradientValues() {
    const gradientValues = this.svg.append("g")
      .attr("class", "data gradientValues");

    let dataOrdered = this.data.sort((a, b) => a.alt < b.alt ? -1 : a.alt > b.alt ? 1 : 0);

    for(let i=0; i<dataOrdered.length-1; i++) {
      let lower = dataOrdered[i],
          upper = dataOrdered[i+1];
      let gradient = calcGradient(upper, lower);

      gradientValues.append("text")
        .attr("x", this.xScale(lower.temperature + ((upper.temperature - lower.temperature) / 2) + gradientLineOffsetTempX))
        .attr("y", this.yScale(lower.alt + ((upper.alt - lower.alt) / 2)))
        .html(`${gradient}°C / 100m`);
    }
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
        <defs>
          <filter id="blur1" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>
      </svg>
    );
  }
}
