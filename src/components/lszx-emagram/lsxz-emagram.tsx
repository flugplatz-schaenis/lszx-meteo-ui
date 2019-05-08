import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'lsxz-emagram',
  styleUrl: 'lsxz-emagram.css',
  shadow: true
})
export class LszxEmagram {

  @Prop() datasrc: string;

  render() {
    const data = {
        x: 2,
        y: 3
    };
    return (
        <div id="lsxz-emagram-root">
            <lsxz-emagram-chart data={data}></lsxz-emagram-chart>
        </div>
    );
  }
}
