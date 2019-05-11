import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "lszx-emagram",
  styleUrl: "lszx-emagram.css",
  shadow: false
})
export class LszxEmagram {

  @Prop() datasrc: string;

  stations: any[];
  @State() regions: any;
  @State() snapshots: any[];
  @State() selectedRegion: string;
  @State() selectedSnapshot: any;
  @State() chartData: any;

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

    return (
        <div>
          <select onChange={e => this.regionSelected((e.target as HTMLSelectElement).value)}>
            {Object.keys(this.regions).map(k =>
              (<option value={k}>{this.regions[k].title}</option>))}
          </select>
          <lszx-emagram-time-selector snapshots={this.snapshots} onSnapshotSelected={s => this.snapshotSelected(s.detail)}></lszx-emagram-time-selector>
          <lszx-emagram-chart data={this.chartData}></lszx-emagram-chart>
        </div>
    );
  }
}
