import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { format } from "date-fns";

@Component({
  tag: "lszx-emagram-time-selector",
  styleUrl: "lszx-emagram-time-selector.css",
  shadow: false
})
export class LszxEmagramTimeSelector {

  @Prop() snapshots: any[];
  @Event() snapshotSelected: EventEmitter;

  componentWillLoad() {
    console.log("load");
  }

  fireSnapshotSelected(url) {
    // TODO: URL only?
    this.snapshotSelected.emit(url);
  }

  render() {
    if(!this.snapshots)
      return (<div></div>);

    return (
        <div>
          <select onChange={e => this.fireSnapshotSelected((e.target as HTMLSelectElement).value)}>
            {this.snapshots.map(s =>
              (<option value={s.url}>{format(s.dt, "D.M. HH:mm")}</option>))}
          </select>
        </div>
    );
  }
}
