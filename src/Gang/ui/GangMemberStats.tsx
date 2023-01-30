/**
 * React Component for the first part of a gang member details.
 * Contains skills and exp.
 */
import React from "react";
import { useGang } from "./Context";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

import { nFormat } from "../../ui/numeralFormat";
import { GangMember } from "../GangMember";
import { Settings } from "../../Settings/Settings";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { StatsRow } from "../../ui/React/StatsRow";
import { characterOverviewStyles as useStyles } from "../../ui/React/CharacterOverview";

interface IProps {
  member: GangMember;
}

export function GangMemberStats(props: IProps): React.ReactElement {
  const classes = useStyles();

  const asc = {
    hack: props.member.calculateAscensionMult(props.member.hack_asc_points),
    str: props.member.calculateAscensionMult(props.member.str_asc_points),
    def: props.member.calculateAscensionMult(props.member.def_asc_points),
    dex: props.member.calculateAscensionMult(props.member.dex_asc_points),
    agi: props.member.calculateAscensionMult(props.member.agi_asc_points),
    cha: props.member.calculateAscensionMult(props.member.cha_asc_points),
  };

  const gang = useGang();
  const data = [
    [`Money:`, <MoneyRate money={5 * props.member.calculateMoneyGain(gang)} />],
    [`Respect:`, `${nFormat(5 * props.member.calculateRespectGain(gang), 5)} / sec`],
    [`Wanted Level:`, `${nFormat(5 * props.member.calculateWantedLevelGain(gang), 5)} / sec`],
    [`Total Respect:`, `${nFormat(props.member.earnedRespect, 5)}`],
  ];

  return (
    <>
      <Tooltip
        title={
          <Typography>
            Hk: x{nFormat(props.member.hack_mult * asc.hack, 2)}(x
            {nFormat(props.member.hack_mult, 2)} Eq, x{nFormat(asc.hack, 2)} Asc)
            <br />
            St: x{nFormat(props.member.str_mult * asc.str, 2)}
            (x{nFormat(props.member.str_mult, 2)} Eq, x{nFormat(asc.str, 2)} Asc)
            <br />
            Df: x{nFormat(props.member.def_mult * asc.def, 2)}
            (x{nFormat(props.member.def_mult, 2)} Eq, x{nFormat(asc.def, 2)} Asc)
            <br />
            Dx: x{nFormat(props.member.dex_mult * asc.dex, 2)}
            (x{nFormat(props.member.dex_mult, 2)} Eq, x{nFormat(asc.dex, 2)} Asc)
            <br />
            Ag: x{nFormat(props.member.agi_mult * asc.agi, 2)}
            (x{nFormat(props.member.agi_mult, 2)} Eq, x{nFormat(asc.agi, 2)} Asc)
            <br />
            Ch: x{nFormat(props.member.cha_mult * asc.cha, 2)}
            (x{nFormat(props.member.cha_mult, 2)} Eq, x{nFormat(asc.cha, 2)} Asc)
          </Typography>
        }
      >
        <Table sx={{ display: "table", mb: 1, width: "100%" }}>
          <TableBody>
            <StatsRow
              name="Hacking"
              color={Settings.theme.hack}
              data={{ level: props.member.hack, exp: props.member.hack_exp }}
            />
            <StatsRow
              name="Strength"
              color={Settings.theme.combat}
              data={{ level: props.member.str, exp: props.member.str_exp }}
            />
            <StatsRow
              name="Defense"
              color={Settings.theme.combat}
              data={{ level: props.member.def, exp: props.member.def_exp }}
            />
            <StatsRow
              name="Dexterity"
              color={Settings.theme.combat}
              data={{ level: props.member.dex, exp: props.member.dex_exp }}
            />
            <StatsRow
              name="Agility"
              color={Settings.theme.combat}
              data={{ level: props.member.agi, exp: props.member.agi_exp }}
            />
            <StatsRow
              name="Charisma"
              color={Settings.theme.cha}
              data={{ level: props.member.cha, exp: props.member.cha_exp }}
            />
            <TableRow>
              <TableCell classes={{ root: classes.cellNone }}>
                <br />
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
      </Tooltip>
    </>
  );
}
