/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import type { ValidationContext } from '../index';
import { GraphQLError } from '../../error';
import type { GraphQLType } from '../../type/definition';


export function unknownTypeMessage(type: GraphQLType): string {
  return `Unknown type "${type}".`;
}

/**
 * Known type names
 *
 * A GraphQL document is only valid if referenced types (specifically
 * variable definitions and fragment conditions) are defined by the type schema.
 */
export function KnownTypeNames(context: ValidationContext): any {
  return {
    // TODO: when validating IDL, re-enable these. Experimental version does not
    // add unreferenced types, resulting in false-positive errors. Squelched
    // errors for now.
    ObjectTypeDefinition: () => false,
    InterfaceTypeDefinition: () => false,
    UnionTypeDefinition: () => false,
    InputObjectTypeDefinition: () => false,
    NamedType(node) {
      const typeName = node.name.value;
      const type = context.getSchema().getType(typeName);
      if (!type) {
        context.reportError(
          new GraphQLError(unknownTypeMessage(typeName), [ node ])
        );
      }
    }
  };
}
