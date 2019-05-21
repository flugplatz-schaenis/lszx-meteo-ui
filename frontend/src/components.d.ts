/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface LszxEmagramChart {
    'data': any;
    'showCaptions': boolean;
    'width': number;
  }
  interface LszxEmagramChartAttributes extends StencilHTMLAttributes {
    'data'?: any;
    'showCaptions'?: boolean;
    'width'?: number;
  }

  interface LszxEmagramDataTable {
    'data': any;
  }
  interface LszxEmagramDataTableAttributes extends StencilHTMLAttributes {
    'data'?: any;
  }

  interface LszxEmagramRegionSelector {
    'regions': any[];
  }
  interface LszxEmagramRegionSelectorAttributes extends StencilHTMLAttributes {
    'onRegionSelected'?: (event: CustomEvent) => void;
    'regions'?: any[];
  }

  interface LszxEmagramTimeSelector {
    'snapshots': any[];
    'width': number;
  }
  interface LszxEmagramTimeSelectorAttributes extends StencilHTMLAttributes {
    'onSnapshotSelected'?: (event: CustomEvent) => void;
    'snapshots'?: any[];
    'width'?: number;
  }

  interface LszxEmagram {
    'datasrc': string;
  }
  interface LszxEmagramAttributes extends StencilHTMLAttributes {
    'datasrc'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'LszxEmagramChart': Components.LszxEmagramChart;
    'LszxEmagramDataTable': Components.LszxEmagramDataTable;
    'LszxEmagramRegionSelector': Components.LszxEmagramRegionSelector;
    'LszxEmagramTimeSelector': Components.LszxEmagramTimeSelector;
    'LszxEmagram': Components.LszxEmagram;
  }

  interface StencilIntrinsicElements {
    'lszx-emagram-chart': Components.LszxEmagramChartAttributes;
    'lszx-emagram-data-table': Components.LszxEmagramDataTableAttributes;
    'lszx-emagram-region-selector': Components.LszxEmagramRegionSelectorAttributes;
    'lszx-emagram-time-selector': Components.LszxEmagramTimeSelectorAttributes;
    'lszx-emagram': Components.LszxEmagramAttributes;
  }


  interface HTMLLszxEmagramChartElement extends Components.LszxEmagramChart, HTMLStencilElement {}
  var HTMLLszxEmagramChartElement: {
    prototype: HTMLLszxEmagramChartElement;
    new (): HTMLLszxEmagramChartElement;
  };

  interface HTMLLszxEmagramDataTableElement extends Components.LszxEmagramDataTable, HTMLStencilElement {}
  var HTMLLszxEmagramDataTableElement: {
    prototype: HTMLLszxEmagramDataTableElement;
    new (): HTMLLszxEmagramDataTableElement;
  };

  interface HTMLLszxEmagramRegionSelectorElement extends Components.LszxEmagramRegionSelector, HTMLStencilElement {}
  var HTMLLszxEmagramRegionSelectorElement: {
    prototype: HTMLLszxEmagramRegionSelectorElement;
    new (): HTMLLszxEmagramRegionSelectorElement;
  };

  interface HTMLLszxEmagramTimeSelectorElement extends Components.LszxEmagramTimeSelector, HTMLStencilElement {}
  var HTMLLszxEmagramTimeSelectorElement: {
    prototype: HTMLLszxEmagramTimeSelectorElement;
    new (): HTMLLszxEmagramTimeSelectorElement;
  };

  interface HTMLLszxEmagramElement extends Components.LszxEmagram, HTMLStencilElement {}
  var HTMLLszxEmagramElement: {
    prototype: HTMLLszxEmagramElement;
    new (): HTMLLszxEmagramElement;
  };

  interface HTMLElementTagNameMap {
    'lszx-emagram-chart': HTMLLszxEmagramChartElement
    'lszx-emagram-data-table': HTMLLszxEmagramDataTableElement
    'lszx-emagram-region-selector': HTMLLszxEmagramRegionSelectorElement
    'lszx-emagram-time-selector': HTMLLszxEmagramTimeSelectorElement
    'lszx-emagram': HTMLLszxEmagramElement
  }

  interface ElementTagNameMap {
    'lszx-emagram-chart': HTMLLszxEmagramChartElement;
    'lszx-emagram-data-table': HTMLLszxEmagramDataTableElement;
    'lszx-emagram-region-selector': HTMLLszxEmagramRegionSelectorElement;
    'lszx-emagram-time-selector': HTMLLszxEmagramTimeSelectorElement;
    'lszx-emagram': HTMLLszxEmagramElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
