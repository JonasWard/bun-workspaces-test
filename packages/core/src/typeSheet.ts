// this file is created using a config file on jonasward.eu/doc-configer using the following config string:

// named enums
export enum MaterialCategory {
  Timber = 'Timber',
  Concrete = 'Concrete'
}

export enum VisualConditionCategory {
  Good = 'Good',
  Fair = 'Fair',
  Discard = 'Discard'
}

export enum UserCategory {
  Admin = 'Admin',
  Tester = 'Tester',
  Manufacturer = 'Manufacturer',
  Buyer = 'Buyer'
}

export enum ComponentCategory {
  Column = 'Column',
  Slab = 'Slab'
}

export enum CrossSectionCategory {
  Column = 'Column',
  Slab = 'Slab',
  HollowCore = 'HollowCore'
}

// union type of all defined types
export type TypeLabelUnion =
  | 'BuildingType'
  | 'LocationType'
  | 'UserType'
  | 'GPRTestType'
  | 'ChemicalTestType'
  | 'ComponentType'
  | 'CoreTestType'
  | 'CrossSectionType'
  | 'DestructiveTestType'
  | 'GeometryType'
  | 'MaterialType'
  | 'PreStressStrandType'
  | 'RebarEntry'
  | 'RebarType'
  | 'ReboundTestType'
  | 'VisualInspectionType';

// types
export type BuildingType = {
  _id: string;
  type: 'BuildingType';
  location: LocationType;
  address: string;
  ownerId: string;
  formerUse: string;
  gfa: number;
  complexity: number;
  img: string;
};

export type LocationType = {
  type: 'LocationType';
  longitude: number;
  latitude: number;
  height: number;
};

export type UserType = {
  _id: string;
  type: 'UserType';
  name: string;
  address: string;
  company: string;
  mail: string;
  userCategory: UserCategory;
};

export type GPRTestType = {
  type: 'GPRTestType';
  rebarDiameter: number;
  coverDepth: number;
  rebarAmount: number;
  date: string;
  userId: string;
  location: LocationType;
};

export type ChemicalTestType = {
  type: 'ChemicalTestType';
  carbonationDepth: number;
  chlorideContent: number;
  alkaliReactivity: number;
  date: string;
  userId: string;
  location: LocationType;
};

export type ComponentType = {
  _id: string;
  type: 'ComponentType';
  buildingId: string;
  img: string[];
  manufacturerId: string;
  condition: VisualConditionCategory;
  noHarmfulSubstance: boolean;
  availableFrom: string;
  buyer: string;
  price: number;
  loadingCondition: string;
  planReference: string;
  yaw: number;
  geometryTypeId: string;
  floor: number;
  location: LocationType;
  visualInspection: VisualInspectionType[];
  liveload: number;
  destructiveTest?: DestructiveTestType;
  coreTest?: CoreTestType;
  chemicalTest?: ChemicalTestType;
  gprTest?: GPRTestType;
  reboundTest: ReboundTestType[];
};

export type CoreTestType = {
  type: 'CoreTestType';
  coreDiameter: number;
  coreCompressiveStrength: number;
  date: string;
  userId: string;
  location: LocationType;
};

export type CrossSectionType = {
  _id: string;
  type: 'CrossSectionType';
  crossSectionCategory: CrossSectionCategory;
  width: number;
  height: number;
  moment: number;
  shear: number;
  normal: number;
  rebarTypeId: string;
  concreteMaterialTypeId: string;
  preStressStrandType: PreStressStrandType;
};

export type DestructiveTestType = {
  type: 'DestructiveTestType';
  geometryTypeId: string;
  imgLongitudinal: string;
  imgTransverse: string;
  userId: string;
  date: string;
  shearStrength: number;
  compressiveStrength: number;
  tensileStrength: number;
  youngsModulus: number;
  momentCapacity: number;
  shearCapacity: number;
  normalCapacity: number;
  density: number;
};

export type GeometryType = {
  _id: string;
  type: 'GeometryType';
  crossSectionId: string;
  componentCategory: ComponentCategory;
  length?: number;
  height?: number;
  originalGeometryId?: string;
};

export type MaterialType = {
  _id: string;
  type: 'MaterialType';
  crossSectionId: string;
  materialCategory: MaterialCategory;
  compressiveStrength: number;
  tensileStrength: number;
  elasticModulus: number;
  density: number;
  exposureClass: string;
  fc0k: number;
  ft0k: number;
  fc90k: number;
  ft90k: number;
};

export type PreStressStrandType = {
  type: 'PreStressStrandType';
  force: number;
  steelClass: string;
  steelDiameter: number;
  amount: number;
  date: string;
  location: LocationType;
  manufacturerId: string;
};

export type RebarEntry = {
  type: 'RebarEntry';
  rebarDiameter: number;
  rebarAmount: number;
};

export type RebarType = {
  _id: string;
  type: 'RebarType';
  rebarMaterialId: string;
  rebarEntries: RebarEntry[];
};

export type ReboundTestType = {
  type: 'ReboundTestType';
  reboundValue: number[];
  reboundDate: string;
  userId: string;
  location: LocationType;
};

export type VisualInspectionType = {
  type: 'VisualInspectionType';
  img: string;
  damageType: string;
  date: string;
  userId: string;
  location: LocationType;
};

// this type defines the collections that should be defined
export type DatabaseType = {
  buildings: BuildingType[];
  users: UserType[];
  components: ComponentType[];
  crossSections: CrossSectionType[];
  geometries: GeometryType[];
  materials: MaterialType[];
  rebars: RebarType[];
};

// union type
export type UnionType =
  | BuildingType
  | LocationType
  | UserType
  | GPRTestType
  | ChemicalTestType
  | ComponentType
  | CoreTestType
  | CrossSectionType
  | DestructiveTestType
  | GeometryType
  | MaterialType
  | PreStressStrandType
  | RebarEntry
  | RebarType
  | ReboundTestType
  | VisualInspectionType;
