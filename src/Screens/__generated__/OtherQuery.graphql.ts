/**
 * @generated SignedSource<<f1077a6496a06d77389d57eb42056f96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OtherQuery$variables = Record<PropertyKey, never>;
export type OtherQuery$data = {
  readonly viewer: {
    readonly " $fragmentSpreads": FragmentRefs<"Other_name">;
  } | null | undefined;
};
export type OtherQuery = {
  response: OtherQuery$data;
  variables: OtherQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OtherQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Other_name"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OtherQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9608d95fc7f2bc8a4b64dbae0fb2b3b7",
    "id": null,
    "metadata": {},
    "name": "OtherQuery",
    "operationKind": "query",
    "text": "query OtherQuery {\n  viewer {\n    ...Other_name\n  }\n}\n\nfragment Other_name on User {\n  id\n}\n"
  }
};

(node as any).hash = "06c783a33888ec88bf6af778c6c30669";

export default node;
