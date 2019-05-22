import { Component, Prop, Event, Element, EventEmitter, State } from "@stencil/core";
import { Selection, select } from "d3-selection";
import ResizeObserver from "resize-observer-polyfill";
import { scaleTime, ScaleTime, axisTop, range, event, timeFormat } from "d3";

const margin: any = { left: 10, right: 10, top: 5, bottom: 5 };
const minHourWidth: number = 35;
const height: number = 55;

@Component({
  tag: "lszx-emagram-time-selector",
  styleUrl: "lszx-emagram-time-selector.css",
  shadow: false
})
export class LszxEmagramTimeSelector {

  @Element() element: HTMLElement;
  svgElementRef: SVGSVGElement;
  svg: Selection<Element, any, HTMLElement, any>;
  parent: Selection<Element, any, HTMLElement, any>;
  timeScale: ScaleTime<number, number>;
  ro: ResizeObserver;
  w: number;
  from: Date;
  to: Date;
  shift: number;

  @Prop() snapshots: any[];
  @Prop() width: number;
  @State() selectedSnapshot: any;
  @Event() snapshotSelected: EventEmitter;

  componentDidLoad() {
    this.svg = select(this.svgElementRef);
    this.checkSetDefaultSelectedSnapshot();
    this.setBounds();
    this.drawTimeSelector();
  }

  componentDidUpdate() {
    if(this.w != this.width)
      this.setBounds();
    this.drawTimeSelector();
  }

  setBounds() {
    this.w = this.width;
    this.svgElementRef.setAttribute("width", `${this.w}`);
    this.svgElementRef.setAttribute("height", `${height}`);
  }

  checkSetDefaultSelectedSnapshot() {
    if(this.selectedSnapshot)
      return;
    if(!this.snapshots || this.snapshots.length == 0)
      return;

    for(let i=this.snapshots.length - 1; i>=0; i--) {
      if(new Date(this.snapshots[i].dt).getHours() <= 7) {
        this.selectedSnapshot = this.snapshots[i];
        break;
      }
    }

    if(!this.selectedSnapshot)
      this.selectedSnapshot = this.snapshots[this.snapshots.length - 1];
  }

  drawTimeSelector() {
    if(!this.svg)
      return;

    this.svg.selectAll("*").remove();

    if(!this.snapshots || this.snapshots.length == 0)
      return;

    // get bounds
    this.from = new Date(this.snapshots[0].dt);
    this.to = new Date(this.snapshots[this.snapshots.length - 1].dt);

    // floor / ceil to full hour
    this.from.setTime(Math.floor(this.from.getTime() / 3600000) * 3600000);
    this.to.setTime(Math.ceil(this.to.getTime() / 3600000) * 3600000);

    const totalHours = (this.to.getTime() - this.from.getTime()) / 1000 / 3600;
    const totalWidth = Math.max(this.w - margin.left - margin.right, (totalHours * minHourWidth));

    this.timeScale = scaleTime()
      .domain([ this.from, this.to ])
      .range([margin.left, totalWidth + margin.left]);

    this.parent = this.svg.append("g")
      .attr("class", "parent");

    this.drawTimeline();
    this.drawSnapshotMarkers();
    this.shiftToCurrentShapshot();

    this.parent.append("rect")
      .attr("class", "clickTgt")
      .attr("x", 0).attr("y", 0)
      .attr("width", totalWidth + margin.left + margin.right).attr("height", height)
      .on("click", this.clickTargetHit.bind(this));
  }

  clickTargetHit() {
    const clickTime = this.timeScale.invert(this.shift + event.offsetX).getTime();

    // get closest snapshot
    let closest = this.snapshots
      .reduce((prev, curr) =>
        (Math.abs(new Date(curr.dt).getTime() - clickTime) < Math.abs(new Date(prev.dt).getTime() - clickTime) ? curr : prev));

    this.selectedSnapshot = closest;
    this.snapshotSelected.emit(closest.url);
  }

  drawTimeline() {
    const timeline = this.parent.append("g")
      .attr("class", "timeline");

    const axis = timeline.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, 45)")
      .call(axisTop(this.timeScale)
        .tickValues(range(this.from.getTime(), this.to.getTime() + 1, 1800000))
        .tickFormat((d: number) => timeFormat("%H:%M")(new Date(d))));

    axis.selectAll("text")
        .attr("y", -6)
        .attr("x", -35)
        .attr("dy", ".35em")
        .attr("transform", "rotate(70)")
        .style("text-anchor", "start");
  }

  drawSnapshotMarkers() {
    const snapshotMarker = this.parent.append("g")
      .attr("class", "snapshotMarker");

    this.snapshots.forEach(s => {
      const current = this.selectedSnapshot.dt == s.dt;
      snapshotMarker.append("rect")
        .attr("width", 8)
        .attr("height", 8)
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", current ? "current" : null)
        .attr("transform", `translate(${this.timeScale(new Date(s.dt))+0.5}, 40) rotate(45)`);
    });
  }

  shiftToCurrentShapshot() {
    const curX = this.timeScale(new Date(this.selectedSnapshot.dt));
    const seriesWidth = this.timeScale(this.to);
    this.shift = curX - this.w / 2;
    this.shift = Math.max(0, Math.min(this.shift, seriesWidth - this.w + margin.left));
    this.parent.attr("transform", `translate(${-this.shift}, 0)`);
  }

  render() {
    if(!this.snapshots)
      return (<div></div>);

    const descriptionText = `Zeitauswahl aus Snapshots: ${this.snapshots.map(s => s.dt)}`;
    return (
        <svg className="container" width="100%" height="1" aria-label={descriptionText}
           ref={(ref: SVGSVGElement) => this.svgElementRef = ref}>
        </svg>
    );
  }
}
