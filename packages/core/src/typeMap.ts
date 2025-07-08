// this file is created using a config file on jonasward.eu/doc-configer using the following config string:
import { MaterialCategory, VisualConditionCategory, UserCategory, ComponentCategory, CrossSectionCategory } from ./typeSheet.ts; // importing all the types

// types
export const BuildingType = {
  _id: "string",
  type: "'BuildingType'",
  location: "LocationType",
  address: "string",
  ownerId: "UserType",
  formerUse: "string",
  gfa: "number",
  complexity: "number",
  img: "string";
};

export const LocationType = {
  longitude: "number",
  latitude: "number",
  height: "number";
};

export const UserType = {
  _id: "string",
  type: "'UserType'",
  name: "string",
  address: "string",
  company: "string",
  mail: "string",
  userCategory: "UserCategory";
};

export const GPRTestType = {
  rebarDiameter: "number",
  coverDepth: "number",
  rebarAmount: "number",
  date: "string",
  userId: "string",
  location: "LocationType";
};

export const ChemicalTestType = {
  carbonationDepth: "number",
  chlorideContent: "number",
  alkaliReactivity: "number",
  date: "string",
  userId: "string",
  location: "LocationType";
};

export const ComponentType = {
  _id: "string",
  type: "'ComponentType'",
  buildingId: "BuildingType",
  img: "string[]",
  manufacturerId: "UserType",
  condition: "VisualConditionCategory",
  noHarmfulSubstance: "boolean",
  availableFrom: "string",
  buyer: "UserType",
  price: "number",
  loadingCondition: "string",
  planReference: "string",
  yaw: "number",
  geometryTypeId: "GeometryType",
  floor: "number",
  location: "LocationType",
  visualInspection: "VisualInspectionType[]",
  liveload: "number",
  destructiveTest?: "DestructiveTestType",
  coreTest?: "CoreTestType",
  chemicalTest?: "ChemicalTestType",
  gprTest?: "GPRTestType",
  reboundTest: "ReboundTestType[]";
};

export const CoreTestType = {
  coreDiameter: "number",
  coreCompressiveStrength: "number",
  date: "string",
  userId: "UserType",
  location: "LocationType";
};

export const CrossSectionType = {
  _id: "string",
  type: "'CrossSectionType'",
  crossSectionCategory: "CrossSectionCategory",
  width: "number",
  height: "number",
  moment: "number",
  shear: "number",
  normal: "number",
  rebarTypeId: "string",
  concreteMaterialTypeId: "MaterialType",
  preStressStrandType: "PreStressStrandType";
};

export const DestructiveTestType = {
  geometryTypeId: "GeometryType",
  imgLongitudinal: "string",
  imgTransverse: "string",
  userId: "UserType",
  date: "string",
  shearStrength: "number",
  compressiveStrength: "number",
  tensileStrength: "number",
  youngsModulus: "number",
  momentCapacity: "number",
  shearCapacity: "number",
  normalCapacity: "number",
  density: "number";
};

export const GeometryType = {
  _id: "string",
  type: "'GeometryType'",
  crossSectionId: "CrossSectionType",
  componentCategory: "ComponentCategory",
  length?: "number",
  height?: "number",
  originalGeometryId?: "GeometryType";
};

export const MaterialType = {
  _id: "string",
  type: "'MaterialType'",
  crossSectionId: "CrossSectionType",
  materialCategory: "MaterialCategory",
  compressiveStrength: "number",
  tensileStrength: "number",
  elasticModulus: "number",
  density: "number",
  exposureClass: "string",
  fc0k: "number",
  ft0k: "number",
  fc90k: "number",
  ft90k: "number";
};

export const PreStressStrandType = {
  force: "number",
  steelClass: "string",
  steelDiameter: "number",
  amount: "number",
  date: "string",
  location: "LocationType",
  manufacturerId: "UserType";
};

export const RebarEntry = {
  rebarDiameter: "number",
  rebarAmount: "number";
};

export const RebarType = {
  _id: "string",
  type: "'RebarType'",
  rebarMaterialId: "MaterialType",
  rebarEntries: "RebarEntry[]";
};

export const ReboundTestType = {
  reboundValue: "number[]",
  reboundDate: "string",
  userId: "UserType",
  location: "LocationType";
};

export const VisualInspectionType = {
  img: "string",
  damageType: "string",
  date: "string",
  userId: "UserType",
  location: "LocationType";
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
