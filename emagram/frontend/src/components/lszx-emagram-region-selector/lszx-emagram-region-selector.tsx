import { Component, Prop, State, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "lszx-emagram-region-selector",
  styleUrl: "lszx-emagram-region-selector.css",
  shadow: false
})
export class LszxEmagramRegionSelector {

  @Prop() regions: any[];
  @Prop() twoLines: boolean = false;

  @State() selectedRegion: any;
  @Event() regionSelected: EventEmitter;

  componentDidLoad() {
    this.emitRegionSelected(this.regions[0].key);
  }

  emitRegionSelected(key) {
    this.selectedRegion = key;
    this.regionSelected.emit(key);
  }

  render() {
    return (
      <ul class="regions">
        {this.regions.map(region => {
          return (
            <li class={this.selectedRegion == region.key ? "selected" : ""}>
              <a href="javascript:;" onClick={() => this.emitRegionSelected(region.key)}>
                <strong>{region.title}</strong>{(this.twoLines ? <br /> : (<span>&nbsp;&nbsp;&nbsp;</span>))}
                &#9660; {region.minAlt}m &#9650; {region.maxAlt}m
                &#9708;	{region.gradient}°C/100m
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}
