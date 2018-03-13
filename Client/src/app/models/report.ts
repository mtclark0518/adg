export interface Report {
  texture: texture;
  color: color;
  smell: smell;
  lat: number;
  lng: number;
}
export enum color {
  'brown',
  'greenish black',
  'rainbow brown',
  'yellow green',
  'dark red black',
  'grey'
}

export enum smell {
  'odorless',
  'my normal brand',
  'bad',
  'concerning'
}

export enum texture {
  'hard-pebbles',
  'firm-grape-cluster',
  'corn-on-the-cob',
  'plump-sausage',
  'soft-blob-nuggets',
  'mushy-fluff',
  'liquid-gravy'
}

