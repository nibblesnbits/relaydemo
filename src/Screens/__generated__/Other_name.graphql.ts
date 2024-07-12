/**
 * @generated SignedSource<<fd382d5cd2052083013256541c951083>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Other_name$data = {
  readonly id: string;
  readonly " $fragmentType": "Other_name";
};
export type Other_name$key = {
  readonly " $data"?: Other_name$data;
  readonly " $fragmentSpreads": FragmentRefs<"Other_name">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Other_name",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "ad5958fe075ad3e2aa136a7d4e473533";

export default node;
