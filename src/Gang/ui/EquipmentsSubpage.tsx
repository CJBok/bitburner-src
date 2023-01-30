import React, { useState } from "react";
import { useGang } from "./Context";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem, Table, TableBody, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { formatPercent, nFormat } from "../../ui/numeralFormat";
import { GangMemberUpgrades } from "../GangMemberUpgrades";
import { GangMemberUpgrade } from "../GangMemberUpgrade";
import { Money } from "../../ui/React/Money";
import { GangMember } from "../GangMember";
import { UpgradeType } from "../data/upgrades";
import { Player } from "@player";
import { Settings } from "../../Settings/Settings";
import { StatsRow } from "../../ui/React/StatsRow";

interface INextRevealProps {
  upgrades: string[];
  type: UpgradeType;
}

function NextReveal(props: INextRevealProps): React.ReactElement {
  const gang = useGang();
  const upgrades = Object.keys(GangMemberUpgrades)
    .filter((upgName: string) => {
      const upg = GangMemberUpgrades[upgName];
      if (Player.money > gang.getUpgradeCost(upg)) return false;
      if (upg.type !== props.type) return false;
      if (props.upgrades.includes(upgName)) return false;
      return true;
    })
    .map((upgName: string) => GangMemberUpgrades[upgName]);

  if (upgrades.length === 0) return <></>;
  return (
    <Typography>
      Next at <Money money={upgrades[0].cost} />
    </Typography>
  );
}

function PurchasedUpgrade({ upgName }: { upgName: string }): React.ReactElement {
  const upg = GangMemberUpgrades[upgName];
  return (
    <Paper sx={{ p: 1 }}>
      <Tooltip title={<Typography dangerouslySetInnerHTML={{ __html: upg.desc }} />}>
        <Typography>{upg.name}</Typography>
      </Tooltip>
    </Paper>
  );
}

interface IUpgradeButtonProps {
  upg: GangMemberUpgrade;
  rerender: () => void;
  member: GangMember;
}

function UpgradeButton(props: IUpgradeButtonProps): React.ReactElement {
  const gang = useGang();
  function onClick(): void {
    props.member.buyUpgrade(props.upg);
    props.rerender();
  }
  return (
    <Tooltip title={<Typography dangerouslySetInnerHTML={{ __html: props.upg.desc }} />}>
      <span>
        <Button onClick={onClick} sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
          <Typography sx={{ display: "block" }}>{props.upg.name}</Typography>
          <Money money={gang.getUpgradeCost(props.upg)} />
        </Button>
      </span>
    </Tooltip>
  );
}

interface IPanelProps {
  member: GangMember;
}

function GangMemberUpgradePanel(props: IPanelProps): React.ReactElement {
  const gang = useGang();
  const setRerender = useState(false)[1];
  const [currentCategory, setCurrentCategory] = useState("Weapons");

  function rerender(): void {
    setRerender((old) => !old);
  }

  function filterUpgrades(list: string[], type: UpgradeType): GangMemberUpgrade[] {
    return Object.keys(GangMemberUpgrades)
      .filter((upgName: string) => {
        const upg = GangMemberUpgrades[upgName];
        if (Player.money < gang.getUpgradeCost(upg)) return false;
        if (upg.type !== type) return false;
        if (list.includes(upgName)) return false;
        return true;
      })
      .map((upgName: string) => GangMemberUpgrades[upgName]);
  }

  const onChange = (event: SelectChangeEvent<string>): void => {
    setCurrentCategory(event.target.value);
    rerender();
  };

  const weaponUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Weapon);
  const armorUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Armor);
  const vehicleUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Vehicle);
  const rootkitUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Rootkit);
  const augUpgrades = filterUpgrades(props.member.augmentations, UpgradeType.Augmentation);

  const categories: { [key: string]: (GangMemberUpgrade[] | UpgradeType)[] } = {
    Weapons: [weaponUpgrades, UpgradeType.Weapon],
    Armor: [armorUpgrades, UpgradeType.Armor],
    Vehicles: [vehicleUpgrades, UpgradeType.Vehicle],
    Rootkits: [rootkitUpgrades, UpgradeType.Rootkit],
    Augmentations: [augUpgrades, UpgradeType.Augmentation],
  };

  const asc = {
    hack: props.member.calculateAscensionMult(props.member.hack_asc_points),
    str: props.member.calculateAscensionMult(props.member.str_asc_points),
    def: props.member.calculateAscensionMult(props.member.def_asc_points),
    dex: props.member.calculateAscensionMult(props.member.dex_asc_points),
    agi: props.member.calculateAscensionMult(props.member.agi_asc_points),
    cha: props.member.calculateAscensionMult(props.member.cha_asc_points),
  };
  return (
    <Paper>
      <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", m: 1, gap: 1 }}>
        <span>
          <Typography variant="h5" color="primary">
            {props.member.name} ({props.member.task})
          </Typography>
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
            <Table>
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
              </TableBody>
            </Table>
          </Tooltip>
        </span>

        <span>
          <Select onChange={onChange} value={currentCategory} sx={{ width: "100%", mb: 1 }}>
            {Object.keys(categories).map((k, i) => (
              <MenuItem key={i + 1} value={k}>
                <Typography variant="h6">{k}</Typography>
              </MenuItem>
            ))}
          </Select>

          <Box sx={{ width: "100%" }}>
            {(categories[currentCategory][0] as GangMemberUpgrade[]).length === 0 && (
              <Typography>All upgrades owned!</Typography>
            )}
            <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr" }}>
              {(categories[currentCategory][0] as GangMemberUpgrade[]).map((upg) => (
                <UpgradeButton key={upg.name} rerender={rerender} member={props.member} upg={upg} />
              ))}
            </Box>
            <NextReveal type={categories[currentCategory][1] as UpgradeType} upgrades={props.member.upgrades} />
          </Box>
        </span>
      </Box>

      <Typography sx={{ mx: 1 }}>Purchased Upgrades: </Typography>
      <Box display="grid" sx={{ gridTemplateColumns: "repeat(4, 1fr)", m: 1 }}>
        {props.member.upgrades.map((upg: string) => (
          <PurchasedUpgrade key={upg} upgName={upg} />
        ))}
        {props.member.augmentations.map((upg: string) => (
          <PurchasedUpgrade key={upg} upgName={upg} />
        ))}
      </Box>
    </Paper>
  );
}

/** React Component for the popup that manages gang members upgrades */
export function EquipmentsSubpage(): React.ReactElement {
  const gang = useGang();
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(event.target.value.toLowerCase());
  };

  const members = gang.members.filter((member) => member && member.name.toLowerCase().includes(filter));

  return (
    <>
      <Tooltip
        title={
          <Typography>
            You get a discount on equipment and upgrades based on your gang's respect and power. More respect and power
            leads to more discounts.
          </Typography>
        }
      >
        <Typography sx={{ m: 1 }}>Discount: -{formatPercent(1 - 1 / gang.getDiscount())}</Typography>
      </Tooltip>

      <TextField
        value={filter}
        onChange={handleFilterChange}
        autoFocus
        InputProps={{
          startAdornment: <SearchIcon />,
          spellCheck: false,
        }}
        placeholder="Filter by member name"
        sx={{ m: 1, width: "15%" }}
      />

      <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", width: "100%" }}>
        {members.map((member: GangMember) => (
          <GangMemberUpgradePanel key={member.name} member={member} />
        ))}
      </Box>
    </>
  );
}
