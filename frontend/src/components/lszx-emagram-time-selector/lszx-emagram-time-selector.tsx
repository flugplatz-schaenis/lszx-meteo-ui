import { Component, Prop, Event, Element, EventEmitter, State } from "@stencil/core";
import { Selection, select } from "d3-selection";
import ResizeObserver from "resize-observer-polyfill";
import { scaleTime, ScaleTime, axisTop, range } from "d3";
import { format } from "date-fns";

const margin: any = { left: 10, right: 10, top: 5, bottom: 5 };
const hourWidth: number = 35;

@Component({
  tag: "lszx-emagram-time-selector",
  styleUrl: "lszx-emagram-time-selector.css",
  shadow: false
})
export class LszxEmagramTimeSelector {

  @Element() element: HTMLElement;
  svgElementRef: SVGSVGElement;
  svg: Selection<Element, any, HTMLElement, any>;
  timeScale: ScaleTime<number, number>;
  ro: ResizeObserver;
  w: number;

  @Prop() snapshots: any[];
  @State() selectedSnapshot: any;
  @Event() snapshotSelected: EventEmitter;

  componentDidLoad() {
    this.ro = new ResizeObserver(entries => {
      const bounds = entries[0].contentRect;
      this.w = bounds.width;

      this.svg = select(this.svgElementRef);
      this.svgElementRef.setAttribute("width", `${this.w}`);
      this.svgElementRef.setAttribute("height", `55`);

      this.drawTimeSelector();
    });
    this.checkSetDefaultSelectedSnapshot();
    this.ro.observe(this.element);
  }

  componentDidUpdate() {
    this.drawTimeSelector();
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
    this.svg.selectAll("*").remove();

    if(!this.snapshots || this.snapshots.length == 0)
      return;

    // get bounds
    let from = new Date(this.snapshots[0].dt);
    let to = new Date(this.snapshots[this.snapshots.length - 1].dt);

    // floor / ceil to full hour
    from.setTime(Math.floor(from.getTime() / 3600000) * 3600000);
    to.setTime(Math.ceil(to.getTime() / 3600000) * 3600000);

    const totalHours = (to.getTime() - from.getTime()) / 1000 / 3600;

    this.timeScale = scaleTime()
      .domain([ from, to ])
      .range([margin.left, (totalHours * hourWidth) + margin.left]);

    const parent = this.svg.append("g")
      .attr("class", "parent");

    this.drawTimeline(parent, from, to);
    this.drawCurrentSnapshotMarker(parent);
  }

  drawTimeline(parent, from, to) {
    const timeline = parent.append("g")
      .attr("class", "timeline");

    const axis = timeline.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, 45)")
      .call(axisTop(this.timeScale)
        .tickValues(range(from.getTime(), to.getTime(), 1800000))
        .tickFormat((d: number) => format(d, 'HH:mm')));

    axis.selectAll("text")
        .attr("y", -6)
        .attr("x", -35)
        .attr("dy", ".35em")
        .attr("transform", "rotate(70)")
        .style("text-anchor", "start");
  }

  drawCurrentSnapshotMarker(parent) {
    const currentSnapshotMarker = parent.append("g")
      .attr("class", "currentSnapshotMarker");

    const curX = this.timeScale(new Date(this.selectedSnapshot.dt));

    currentSnapshotMarker.append("rect")
      .attr("width", 8)
      .attr("height", 8)
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", `translate(${curX}, 40) rotate(45)`);

    const shift = curX - this.w / 2;
    parent.attr("transform", `translate(${-shift}, 0)`);
  }

  fireSnapshotSelected(url) {
    // TODO: URL only?
    this.snapshotSelected.emit(url);
  }

  render() {
    if(!this.snapshots)
      return (<div></div>);

    const descriptionText = `Zeitauswahl aus Snapshots: ${this.snapshots}`;
    return (
        <svg className="container" width="100%" height="1" aria-label={descriptionText}
           ref={(ref: SVGSVGElement) => this.svgElementRef = ref}>
        </svg>
    );
    /* <select onChange={e => this.fireSnapshotSelected((e.target as HTMLSelectElement).value)}>
      {this.snapshots.map(s =>
        (<option value={s.url}>{format(s.dt, "D.M. HH:mm")}</option>))}
    </select> */
  }
}
