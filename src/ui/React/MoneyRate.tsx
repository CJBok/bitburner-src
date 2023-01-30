import React from "react";
import { formatMoney } from "../numeralFormat";
import { Money } from "./Money";

export function MoneyRate({ money }: { money: number }): JSX.Element {
  return <Money money={`${formatMoney(money)} / sec`} />;
}
