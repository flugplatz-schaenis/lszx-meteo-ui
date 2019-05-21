import { Component, Prop, State, Element } from "@stencil/core";
import ResizeObserver from "resize-observer-polyfill";

const mobileModeWidthThreshold: number = 600;

@Component({
  tag: "lszx-emagram",
  styleUrl: "lszx-emagram.css",
  shadow: false
})
export class LszxEmagram {

  @Prop() datasrc: string;

  @Element() el: HTMLElement;
  @State() w: number = 500;
  @State() regions: any;
  @State() snapshots: any[];
  @State() selectedRegion: string;
  @State() selectedSnapshot: any;
  @State() chartData: any;

  stations: any[];
  ro: ResizeObserver;

  componentWillLoad() {
    fetch(this.datasrc)
      .then((response: Response) => response.json())
      .then(response => {
        this.stations = response.stations;
        this.regions = response.regions;
        this.snapshots = response.snapshots;
        if(this.regions && this.snapshots) {
          this.regionSelected(Object.keys(this.regions)[0]);
          this.snapshotSelected(this.snapshots[this.snapshots.length-1].url);
        }
      });
  }

  componentDidLoad() {
    this.ro = new ResizeObserver(entries => {
      const bounds = entries[0].contentRect;
      this.w = bounds.width;
    });
    this.ro.observe(this.el);
  }

  regionSelected(region: string) {
    this.selectedRegion = region;
    this.getChartData();
  }

  snapshotSelected(snapshot: any) {
    this.selectedSnapshot = snapshot;
    this.getChartData();
  }

  getChartData() {
    if(!this.selectedRegion || !this.selectedSnapshot)
      return;

    fetch(this.selectedSnapshot)
      .then((response: Response) => response.json())
      .then(response => {
        this.chartData = this.regions[this.selectedRegion].stations.map(station => ({
          station: station,
          stationName: this.stations[station].name,
          alt: this.stations[station].alt,
          temperature: response[station].temperature,
          dewpoint: response[station].dewpoint,
          windDirection: response[station].windDirection,
          windSpeed: response[station].windSpeed,
          windGusts: response[station].windGusts,
          qnh: response[station].qnh
        }));
      });
  }

  render() {
    if(!this.snapshots || !this.regions || !this.chartData)
      return (<div>Loading...</div>);

    const xsScreen = this.w <= mobileModeWidthThreshold;
    console.log("mobile mode", this.w, xsScreen);

    return (
        <div>
          <lszx-emagram-region-selector regions={this.regions} onRegionSelected={r => this.regionSelected(r.detail)}></lszx-emagram-region-selector>
          <lszx-emagram-time-selector width={this.w} snapshots={this.snapshots} onSnapshotSelected={s => this.snapshotSelected(s.detail)}></lszx-emagram-time-selector>
          <lszx-emagram-chart data={this.chartData} width={this.w} showCaptions={!xsScreen}></lszx-emagram-chart>
          {(xsScreen && (<lszx-emagram-data-table data={this.chartData}></lszx-emagram-data-table>))}
        </div>
    );
  }
}
