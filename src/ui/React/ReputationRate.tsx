import React from "react";
import { nFormat } from "../numeralFormat";
import { Reputation } from "./Reputation";

export function ReputationRate({ reputation }: { reputation: number }): React.ReactElement {
  return <Reputation reputation={`${nFormat(reputation)} / sec`} />;
}
