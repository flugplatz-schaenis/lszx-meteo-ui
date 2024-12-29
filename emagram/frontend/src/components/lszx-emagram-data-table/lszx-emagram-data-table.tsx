import { Component, Prop } from "@stencil/core";
import { calcGradient } from "../../utils/utils";

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
    // TODO: FIX ORDER
    let dataOrdered = this.data.sort((a, b) => (a.alt < b.alt) ? 1 : (a.alt > b.alt ? -1 : 0));
    for(let i=0; i<dataOrdered.length-1; i++) {
      let upper = dataOrdered[i],
          lower = dataOrdered[i+1];
      let gradient = calcGradient(upper, lower);
      upper.gradient = gradient;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Station</th>
            <th class="numeric">
              Temp.<br/>
              TP
            </th>
            <th class="numeric">
              Wind<br />
              (km/h)
            </th>
            <th class="numeric">
              Grad.<br />
              (100m)
            </th>
          </tr>
        </thead>
        <tbody>
          {dataOrdered.map(d => (
            <tr>
              <td>
                {d.stationName}<br />
                {d.alt}m
              </td>
              <td class="numeric">
                {d.temperature}°C<br />
                {d.dewpoint}°C
              </td>
              <td class="numeric">
                {d.windDirection}°<br />
                {d.windSpeed} / {d.windGusts}
              </td>
              <td class="numeric noborder">
                <span class="gradient">{d.gradient ? `${d.gradient}°C` : ""}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>);
  }
}
