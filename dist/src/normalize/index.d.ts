import { EntityMapping, EntityMappingValue } from './types';
export declare class Entity {
    private inverseMapping;
    private mapping;
    constructor(mapping: EntityMapping);
    addMapping(mapping: EntityMapping): void;
    initInverseMapping(mapping: EntityMapping, accumulator?: {}): EntityMapping;
    inverseKey(k: string): EntityMappingValue;
    key(k: string): EntityMappingValue;
}
export declare function normalize(schema: Entity): (data: any | Array<any>) => any | Array<any>;
export declare function denormalize(schema: Entity): (data: any | Array<any>) => any | Array<any>;
