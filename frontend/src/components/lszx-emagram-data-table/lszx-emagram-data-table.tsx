import { Component, Prop } from "@stencil/core";

@Component({
  tag: "lszx-emagram-data-table",
  styleUrl: "lszx-emagram-data-table.css",
  shadow: false
})
export class LszxEmagramDataTable {

  @Prop() data: any;

  componentDidLoad() {
  }

  componentDidUpdate() {
  }

  render() {
    let dataOrdered = this.data.sort((a, b) => a.alt < b.alt ? -1 : b.alt > a.alt ? 1 : 0);
    return (
      <table>
        <thead>
          <tr>
            <th>Station</th>
            <th class="numeric">H&ouml;he</th>
            <th class="numeric">Temp.</th>
            <th class="numeric">TP</th>
            <th>Wind (° / km/h)</th>
          </tr>
        </thead>
        <tbody>
          {dataOrdered.map(d => (
            <tr>
              <td>{d.stationName}</td>
              <td class="numeric">{d.alt}m</td>
              <td class="numeric">{d.temperature}</td>
              <td class="numeric">{d.dewpoint}</td>
              <td>{d.windDirection}° / {d.windSpeed} / {d.windGusts}</td>
            </tr>
          ))}
        </tbody>
      </table>);
  }
}
