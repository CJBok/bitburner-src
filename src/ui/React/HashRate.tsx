import React from "react";
import { nFormat } from "../numeralFormat";
import { Hashes } from "./Hashes";

export function HashRate({ hashes }: { hashes: number }): React.ReactElement {
  return <Hashes hashes={`${nFormat(hashes)} h / s`} />;
}
