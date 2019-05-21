import { Component, Prop, State, Element } from "@stencil/core";
import ResizeObserver from "resize-observer-polyfill";
import { calcGradientByValues } from "../../utils/utils";

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
  @State() regionSelectorData: any[];

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
          this.snapshotSelected(this.snapshots[this.snapshots.length-1].url);
          this.regionSelected(Object.keys(this.regions)[0]);
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
    this.getSnapshotData();
  }

  snapshotSelected(snapshot: any) {
    this.selectedSnapshot = snapshot;
    this.getSnapshotData();
  }

  getSnapshotData() {
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

        this.regionSelectorData = Object.keys(this.regions).map(key => {
          let region = this.regions[key];
          let minAlt = 9999, maxAlt = 0,
              minAltTemp = 0, maxAltTemp = 0;

          for(let stationKey of region.stations) {
            let station = this.stations[stationKey];
            let stationSnapshot = response[stationKey];
            if(!stationSnapshot)
              continue;
            if(station.alt < minAlt) {
              minAlt = station.alt;
              minAltTemp = stationSnapshot.temperature;
            }
            if(station.alt > maxAlt) {
              maxAlt = station.alt;
              maxAltTemp = stationSnapshot.temperature;
            }
          }

          let gradient = calcGradientByValues(maxAltTemp, minAltTemp, maxAlt, minAlt);

          return {
            key,
            title: region.title,
            minAlt,
            maxAlt,
            gradient
          };
        });

      });
  }

  render() {
    if(!this.snapshots || !this.regions || !this.chartData)
      return (<div>Loading...</div>);

    const xsScreen = this.w <= mobileModeWidthThreshold;

    return (
        <div>
          <lszx-emagram-time-selector width={this.w} snapshots={this.snapshots} onSnapshotSelected={s => this.snapshotSelected(s.detail)}></lszx-emagram-time-selector>
          <lszx-emagram-region-selector regions={this.regionSelectorData} twoLines={xsScreen} onRegionSelected={r => this.regionSelected(r.detail)}></lszx-emagram-region-selector>
          <lszx-emagram-chart data={this.chartData} width={this.w} showCaptions={!xsScreen}></lszx-emagram-chart>
          {(xsScreen && (<lszx-emagram-data-table data={this.chartData}></lszx-emagram-data-table>))}
          <a href="https://www.meteoschweiz.admin.ch" target="_blank" class="copyright">Quelle: Bundesamt für Meteorologie und Klimatologie MeteoSchweiz</a>
        </div>
    );
  }
}
