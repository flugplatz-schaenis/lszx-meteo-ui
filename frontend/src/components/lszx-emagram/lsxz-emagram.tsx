import { Component, Prop } from "@stencil/core";

@Component({
  tag: "lsxz-emagram",
  styleUrl: "lsxz-emagram.css",
  shadow: true
})
export class LszxEmagram {

  @Prop() datasrc: string;
  data: any;

  componentWillLoad() {
    fetch(this.datasrc)
      .then((response: Response) => response.json())
      .then(response => {
        this.data = response;
      });
  }

  render() {
    return (
        <div id="lsxz-emagram-root">
            <lsxz-emagram-chart data={this.data}></lsxz-emagram-chart>
        </div>
    );
  }
}
