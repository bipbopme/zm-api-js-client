import { Entity } from '.';
export declare type RenamedKey = string;
export declare type RenamedEntity = [string, Entity];
export declare type EntityMappingValue = RenamedKey | RenamedEntity | Entity | {};
export interface EntityMapping {
    [key: string]: EntityMappingValue;
}
export interface NormalizedKey {
    key: string;
    nestedSchema?: Entity;
}
