import { ZimbraSchemaOptions } from './types';
import { ZimbraBatchClient } from '../batch-client';
import { GraphQLSchema } from 'graphql';
import schema from './schema.graphql';
export declare function createZimbraSchema(options: ZimbraSchemaOptions): {
    client: ZimbraBatchClient;
    schema: GraphQLSchema;
};
export { schema };
