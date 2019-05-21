import { Component, Prop, State, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "lszx-emagram-region-selector",
  styleUrl: "lszx-emagram-region-selector.css",
  shadow: false
})
export class LszxEmagramRegionSelector {

  @Prop() regions: any[];

  @State() selectedRegion: any;
  @Event() regionSelected: EventEmitter;

  render() {
    return (
      <select onChange={e => {
          this.selectedRegion = (e.target as HTMLSelectElement).value;
          this.regionSelected.emit(this.selectedRegion);
        }}>
        {Object.keys(this.regions).map(k =>
          (<option value={k}>{this.regions[k].title}</option>))}
      </select>
    );
  }

}
