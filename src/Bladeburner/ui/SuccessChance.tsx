import React from "react";
import { StealthIcon } from "./StealthIcon";
import { KillIcon } from "./KillIcon";
import { Action } from "../Action";
import { Bladeburner } from "../Bladeburner";
import { Player } from "@player";
import { nFormat } from "../../ui/numeralFormat";

interface IProps {
  bladeburner: Bladeburner;
  action: Action;
}

export function SuccessChance(props: IProps): React.ReactElement {
  const estimatedSuccessChance = props.action.getEstSuccessChance(props.bladeburner, Player);

  let chance = <></>;
  if (estimatedSuccessChance[0] === estimatedSuccessChance[1]) {
    chance = <>{nFormat(estimatedSuccessChance[0] * 100, 1)}%</>;
  } else {
    chance = (
      <>
        {nFormat(estimatedSuccessChance[0] * 100, 1)}% ~ {nFormat(estimatedSuccessChance[1] * 100, 1)}%
      </>
    );
  }

  return (
    <>
      Estimated success chance: {chance} {props.action.isStealth ? <StealthIcon /> : <></>}
      {props.action.isKill ? <KillIcon /> : <></>}
    </>
  );
}
