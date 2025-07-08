import { ReservedStrings } from '../../enums';
import { DataType, FieldDefinition, TypeDefinition } from '../../types';

const forceCamelCase = (string: string): string =>
  string
    .split(' ')
    .map((s) => s.split('_'))
    .flat()
    .map((s) => s.split('-'))
    .flat()
    .filter((s) => s.length)
    .map((s, i) => (i === 0 ? s.charAt(0).toLowerCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1)))
    .join('');

const typeNameStripType = (typeName: string): string => {
  if (typeName.endsWith('yType')) return typeName.replace('yType', 'ies');
  if (typeName.endsWith('Type')) return typeName.replace('Type', 's');
  return typeName;
};

export const getFieldNameFromType = (typeName: string) => typeNameStripType(forceCamelCase(typeName));

const getFieldDefinitionFromReferencableType = (def: TypeDefinition): FieldDefinition => [
  getFieldNameFromType(def.label),
  def.label,
  false,
  true,
  false
];

export const getDatabaseFieltNames = (data: DataType) =>
  data.types.filter((t) => t.canReference).map((def) => getFieldNameFromType(def.label));

/**
 * All the elements that are referencable, should be stored in a database. The type representing this data is called the `DatabaseType`
 * @param dataType - DataType definition
 */
export const getDatabaseType = (dataType: DataType): TypeDefinition => ({
  label: ReservedStrings.DatabaseType,
  fields: dataType.types.filter((t) => t.canReference).map(getFieldDefinitionFromReferencableType),
  canReference: false
});
