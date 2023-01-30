/**
 * React Component for the content of the popup before the player confirms the
 * ascension of a gang member.
 */
import React, { useState, useEffect } from "react";
import { GangMember } from "../GangMember";
import { nFormat } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { useGang } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  member: GangMember;
  onAscend: () => void;
}

export function AscensionModal(props: IProps): React.ReactElement {
  const gang = useGang();
  const setRerender = useState(false)[1];

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 1000);
    return () => clearInterval(id);
  }, []);

  function confirm(): void {
    props.onAscend();
    const res = gang.ascendMember(props.member);
    dialogBoxCreate(
      <>
        You ascended {props.member.name}!<br />
        <br />
        Your gang lost {nFormat(res.respect, 5)} respect.
        <br />
        <br />
        {props.member.name} gained the following stat multipliers for ascending:
        <br />
        Hacking: x{nFormat(res.hack)}
        <br />
        Strength: x{nFormat(res.str)}
        <br />
        Defense: x{nFormat(res.def)}
        <br />
        Dexterity: x{nFormat(res.dex)}
        <br />
        Agility: x{nFormat(res.agi)}
        <br />
        Charisma: x{nFormat(res.cha)}
        <br />
      </>,
    );
    props.onClose();
  }

  // const ascendBenefits = props.member.getAscensionResults();
  const preAscend = props.member.getCurrentAscensionMults();
  const postAscend = props.member.getAscensionMultsAfterAscend();

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Are you sure you want to ascend this member? They will lose all of
        <br />
        their non-Augmentation upgrades and their stats will reset back to 1.
        <br />
        <br />
        Furthermore, your gang will lose {nFormat(props.member.earnedRespect, 5)} respect
        <br />
        <br />
        In return, they will gain the following permanent boost to stat multipliers:
        <br />
        Hacking: x{nFormat(preAscend.hack)} =&gt; x{nFormat(postAscend.hack)}
        <br />
        Strength: x{nFormat(preAscend.str)} =&gt; x{nFormat(postAscend.str)}
        <br />
        Defense: x{nFormat(preAscend.def)} =&gt; x{nFormat(postAscend.def)}
        <br />
        Dexterity: x{nFormat(preAscend.dex)} =&gt; x{nFormat(postAscend.dex)}
        <br />
        Agility: x{nFormat(preAscend.agi)} =&gt; x{nFormat(postAscend.agi)}
        <br />
        Charisma: x{nFormat(preAscend.cha)} =&gt; x{nFormat(postAscend.cha)}
        <br />
      </Typography>
      <Button onClick={confirm}>Ascend</Button>
    </Modal>
  );
}
