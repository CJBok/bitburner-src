import React, { useState } from "react";
import { SkillList } from "./SkillList";
import { BladeburnerConstants } from "../data/Constants";
import { Bladeburner } from "../Bladeburner";
import { nFormat } from "../../ui/numeralFormat";
import Typography from "@mui/material/Typography";
interface IProps {
  bladeburner: Bladeburner;
}

export function SkillPage(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  const mults = props.bladeburner.skillMultipliers;

  function valid(mult: number | undefined): boolean {
    return mult !== undefined && mult !== 1;
  }

  return (
    <>
      <Typography>
        <strong>Skill Points: {nFormat(props.bladeburner.skillPoints)}</strong>
      </Typography>
      <Typography>
        You will gain one skill point every {BladeburnerConstants.RanksPerSkillPoint} ranks.
        <br />
        Note that when upgrading a skill, the benefit for that skill is additive. However, the effects of different
        skills with each other is multiplicative.
      </Typography>
      {valid(mults["successChanceAll"]) && (
        <Typography>Total Success Chance: x{nFormat(mults["successChanceAll"])}</Typography>
      )}
      {valid(mults["successChanceStealth"]) && (
        <Typography>Stealth Success Chance: x{nFormat(mults["successChanceStealth"])}</Typography>
      )}
      {valid(mults["successChanceKill"]) && (
        <Typography>Retirement Success Chance: x{nFormat(mults["successChanceKill"])}</Typography>
      )}
      {valid(mults["successChanceContract"]) && (
        <Typography>Contract Success Chance: x{nFormat(mults["successChanceContract"])}</Typography>
      )}
      {valid(mults["successChanceOperation"]) && (
        <Typography>Operation Success Chance: x{nFormat(mults["successChanceOperation"])}</Typography>
      )}
      {valid(mults["successChanceEstimate"]) && (
        <Typography>Synthoid Data Estimate: x{nFormat(mults["successChanceEstimate"])}</Typography>
      )}
      {valid(mults["actionTime"]) && <Typography>Action Time: x{nFormat(mults["actionTime"])}</Typography>}
      {valid(mults["effHack"]) && <Typography>Hacking Skill: x{nFormat(mults["effHack"])}</Typography>}
      {valid(mults["effStr"]) && <Typography>Strength: x{nFormat(mults["effStr"])}</Typography>}
      {valid(mults["effDef"]) && <Typography>Defense: x{nFormat(mults["effDef"])}</Typography>}
      {valid(mults["effDex"]) && <Typography>Dexterity: x{nFormat(mults["effDex"])}</Typography>}
      {valid(mults["effAgi"]) && <Typography>Agility: x{nFormat(mults["effAgi"])}</Typography>}
      {valid(mults["effCha"]) && <Typography>Charisma: x{nFormat(mults["effCha"])}</Typography>}
      {valid(mults["effInt"]) && <Typography>Intelligence: x{nFormat(mults["effInt"])}</Typography>}
      {valid(mults["stamina"]) && <Typography>Stamina: x{nFormat(mults["stamina"])}</Typography>}
      {valid(mults["money"]) && <Typography>Contract Money: x{nFormat(mults["money"])}</Typography>}
      {valid(mults["expGain"]) && <Typography>Exp Gain: x{nFormat(mults["expGain"])}</Typography>}
      <SkillList bladeburner={props.bladeburner} onUpgrade={() => setRerender((old) => !old)} />
    </>
  );
}

/*




var multKeys = Object.keys(this.skillMultipliers);
for (var i = 0; i < multKeys.length; ++i) {
    var mult = this.skillMultipliers[multKeys[i]];
    if (mult && mult !== 1) {
        mult = nFormat(mult, 3);
        switch(multKeys[i]) {

        }
    }
}
*/
