
export function calcWindParts(windInKph: number): any {

  let windInKnots = windInKph / 1.852;

  let triangles = Math.floor(windInKnots / 50);
  windInKnots -= triangles * 50;

  let largeDashes = Math.floor(windInKnots / 10);
  windInKnots -= largeDashes * 10;

  let smallDashes = Math.floor(windInKnots / 5);

  return {
    triangles,
    largeDashes,
    smallDashes,
    symbols: (triangles + largeDashes + smallDashes)
  };
}

export function calcGradient(upper: any, lower: any) {
  return calcGradientByValues(upper.temperature, lower.temperature, upper.alt, lower.alt);
}

export function calcGradientByValues(upperTemp: number, lowerTemp: number, upperAlt: number, lowerAlt: number) {
  return Math.round(100 * 100 * (lowerTemp - upperTemp) / (upperAlt - lowerAlt)) / 100;;
}
