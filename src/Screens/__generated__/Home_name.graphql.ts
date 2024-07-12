/**
 * @generated SignedSource<<8ca3195cfb29f84e66603ea185e1eef9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Home_name$data = {
  readonly id: string;
  readonly " $fragmentType": "Home_name";
};
export type Home_name$key = {
  readonly " $data"?: Home_name$data;
  readonly " $fragmentSpreads": FragmentRefs<"Home_name">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_name",
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

(node as any).hash = "37aefc138490f965bba586b2936a0bfa";

export default node;
