import React from "react";

import { Typography, TableCell, TableRow } from "@mui/material";

import { formatExp, formatNumberNoSuffix } from "../formatNumber";
import { characterOverviewStyles as useStyles } from "./CharacterOverview";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

interface ITableRowData {
  content?: string;
  level?: number;
  exp?: number;
}

interface IProps {
  name: string;
  color: string;
  classes?: ClassNameMap;
  data?: ITableRowData;
  children?: React.ReactElement;
}

export const StatsRow = ({ name, color, classes = useStyles(), children, data }: IProps): React.ReactElement => {
  let content = "";

  if (data) {
    if (data.content !== undefined) {
      content = data.content;
    } else if (data.level !== undefined && data.exp !== undefined) {
      content = `${formatNumberNoSuffix(data.level, 0)} (${formatExp(data.exp)} exp)`;
    } else if (data.level !== undefined && data.exp === undefined) {
      content = `${formatNumberNoSuffix(data.level, 0)}`;
    }
  }

  return (
    <TableRow>
      <TableCell classes={{ root: classes.cellNone }}>
        <Typography style={{ color: color }}>{name}</Typography>
      </TableCell>
      <TableCell align="right" classes={{ root: classes.cellNone }}>
        {content ? <Typography style={{ color: color }}>{content}</Typography> : <></>}
        {children}
      </TableCell>
    </TableRow>
  );
};
