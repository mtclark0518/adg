export interface FilterQuery {
  filtered: boolean;
  requester: number;
  byColor: boolean;
  bySmell: boolean;
  byTexture: boolean;
  ColorFilter?: Array<string>;
  SmellFilter?: Array<string>;
  TextureFilter?: Array<string>;
}
