import React from "react";

import { Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";

import { CONSTANTS } from "../../../Constants";

import { formatInt, nFormat } from "../../../ui/numeralFormat";
import { Settings } from "../../../Settings/Settings";
import { StatsRow } from "../../../ui/React/StatsRow";
import { characterOverviewStyles as useStyles } from "../../../ui/React/CharacterOverview";
import { Money } from "../../../ui/React/Money";
import { MoneyRate } from "../../../ui/React/MoneyRate";
import { ReputationRate } from "../../../ui/React/ReputationRate";

import { Sleeve } from "../Sleeve";
import { isSleeveClassWork } from "../Work/SleeveClassWork";
import { isSleeveFactionWork } from "../Work/SleeveFactionWork";
import { isSleeveCompanyWork } from "../Work/SleeveCompanyWork";
import { isSleeveCrimeWork } from "../Work/SleeveCrimeWork";

const CYCLES_PER_SEC = 1000 / CONSTANTS.MilliPerCycle;

interface IProps {
  sleeve: Sleeve;
}

export function StatsElement(props: IProps): React.ReactElement {
  const classes = useStyles();

  return (
    <Table sx={{ display: "table", mb: 1, width: "100%" }}>
      <TableBody>
        <StatsRow name="City" color={Settings.theme.primary} data={{ content: props.sleeve.city }} />
        <StatsRow
          name="HP"
          color={Settings.theme.hp}
          data={{
            content: `${formatInt(props.sleeve.hp.current)} / ${formatInt(props.sleeve.hp.max)}`,
          }}
        />
        <StatsRow
          name="Hacking"
          color={Settings.theme.hack}
          data={{ level: props.sleeve.skills.hacking, exp: props.sleeve.exp.hacking }}
        />
        <StatsRow
          name="Strength"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.strength, exp: props.sleeve.exp.strength }}
        />
        <StatsRow
          name="Defense"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.defense, exp: props.sleeve.exp.defense }}
        />
        <StatsRow
          name="Dexterity"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.dexterity, exp: props.sleeve.exp.dexterity }}
        />
        <StatsRow
          name="Agility"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.agility, exp: props.sleeve.exp.agility }}
        />
        <StatsRow
          name="Charisma"
          color={Settings.theme.cha}
          data={{ level: props.sleeve.skills.charisma, exp: props.sleeve.exp.charisma }}
        />
        <TableRow>
          <TableCell classes={{ root: classes.cellNone }}>
            <br />
          </TableCell>
        </TableRow>
        <StatsRow name="Shock" color={Settings.theme.primary} data={{ content: nFormat(props.sleeve.shock) }} />
        <StatsRow name="Sync" color={Settings.theme.primary} data={{ content: nFormat(props.sleeve.sync) }} />
        <StatsRow name="Memory" color={Settings.theme.primary} data={{ content: formatInt(props.sleeve.memory) }} />
      </TableBody>
    </Table>
  );
}

export function EarningsElement(props: IProps): React.ReactElement {
  const classes = useStyles();

  let data: (string | JSX.Element)[][] = [];
  if (isSleeveCrimeWork(props.sleeve.currentWork)) {
    const gains = props.sleeve.currentWork.getExp(props.sleeve);
    data = [
      [`Money:`, <Money money={gains.money} />],
      [`Hacking Exp:`, `${nFormat(gains.hackExp)}`],
      [`Strength Exp:`, `${nFormat(gains.strExp)}`],
      [`Defense Exp:`, `${nFormat(gains.defExp)}`],
      [`Dexterity Exp:`, `${nFormat(gains.dexExp)}`],
      [`Agility Exp:`, `${nFormat(gains.agiExp)}`],
      [`Charisma Exp:`, `${nFormat(gains.chaExp)}`],
    ];
  }
  if (isSleeveClassWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.calculateRates(props.sleeve);
    data = [
      [`Money:`, <MoneyRate money={CYCLES_PER_SEC * rates.money} />],
      [`Hacking Exp:`, `${nFormat(CYCLES_PER_SEC * rates.hackExp)} / sec`],
      [`Strength Exp:`, `${nFormat(CYCLES_PER_SEC * rates.strExp)} / sec`],
      [`Defense Exp:`, `${nFormat(CYCLES_PER_SEC * rates.defExp)} / sec`],
      [`Dexterity Exp:`, `${nFormat(CYCLES_PER_SEC * rates.dexExp)} / sec`],
      [`Agility Exp:`, `${nFormat(CYCLES_PER_SEC * rates.agiExp)} / sec`],
      [`Charisma Exp:`, `${nFormat(CYCLES_PER_SEC * rates.chaExp)} / sec`],
    ];
  }
  if (isSleeveFactionWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.getExpRates(props.sleeve);
    const repGain = props.sleeve.currentWork.getReputationRate(props.sleeve);
    data = [
      [`Hacking Exp:`, `${nFormat(CYCLES_PER_SEC * rates.hackExp)} / sec`],
      [`Strength Exp:`, `${nFormat(CYCLES_PER_SEC * rates.strExp)} / sec`],
      [`Defense Exp:`, `${nFormat(CYCLES_PER_SEC * rates.defExp)} / sec`],
      [`Dexterity Exp:`, `${nFormat(CYCLES_PER_SEC * rates.dexExp)} / sec`],
      [`Agility Exp:`, `${nFormat(CYCLES_PER_SEC * rates.agiExp)} / sec`],
      [`Charisma Exp:`, `${nFormat(CYCLES_PER_SEC * rates.chaExp)} / sec`],
      [`Reputation:`, <ReputationRate reputation={CYCLES_PER_SEC * repGain} />],
    ];
  }

  if (isSleeveCompanyWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.getGainRates(props.sleeve);
    data = [
      [`Money:`, <MoneyRate money={CYCLES_PER_SEC * rates.money} />],
      [`Hacking Exp:`, `${nFormat(CYCLES_PER_SEC * rates.hackExp)} / sec`],
      [`Strength Exp:`, `${nFormat(CYCLES_PER_SEC * rates.strExp)} / sec`],
      [`Defense Exp:`, `${nFormat(CYCLES_PER_SEC * rates.defExp)} / sec`],
      [`Dexterity Exp:`, `${nFormat(CYCLES_PER_SEC * rates.dexExp)} / sec`],
      [`Agility Exp:`, `${nFormat(CYCLES_PER_SEC * rates.agiExp)} / sec`],
      [`Charisma Exp:`, `${nFormat(CYCLES_PER_SEC * rates.chaExp)} / sec`],
      [`Reputation:`, <ReputationRate reputation={CYCLES_PER_SEC * rates.reputation} />],
    ];
  }

  return (
    <Table sx={{ display: "table", mb: 1, width: "100%", lineHeight: 0 }}>
      <TableBody>
        <TableRow>
          <TableCell classes={{ root: classes.cellNone }}>
            <Typography variant="h6">Earnings {props.sleeve.storedCycles > 50 ? "(overclock)" : ""}</Typography>
          </TableCell>
        </TableRow>
        {data.map(([a, b]) => (
          <TableRow key={a.toString() + b.toString()}>
            <TableCell classes={{ root: classes.cellNone }}>
              <Typography>{a}</Typography>
            </TableCell>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography>{b}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
