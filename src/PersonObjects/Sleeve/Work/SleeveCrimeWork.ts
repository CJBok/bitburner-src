import { Player } from "@player";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applySleeveGains, Work, WorkType } from "./Work";
import { CrimeType, CrimeTypes } from "../../../Enums";
import { Crimes } from "../../../Crime/Crimes";
import { Crime } from "../../../Crime/Crime";
import { scaleWorkStats, WorkStats } from "../../../Work/WorkStats";
import { CONSTANTS } from "../../../Constants";
import { calculateCrimeWorkStats } from "../../../Work/Formulas";
import { findCrime } from "../../../Crime/CrimeHelpers";

export const isSleeveCrimeWork = (w: Work | null): w is SleeveCrimeWork => w !== null && w.type === WorkType.CRIME;

export class SleeveCrimeWork extends Work {
  crimeType: CrimeType;
  cyclesWorked = 0;
  constructor(crimeType?: CrimeType) {
    super(WorkType.CRIME);
    this.crimeType = crimeType ?? CrimeTypes.shoplift;
  }

  getCrime(): Crime {
    if (!CrimeTypes.has(this.crimeType)) throw new Error("crime should not be undefined");
    return Crimes[this.crimeType];
  }

  getExp(sleeve: Sleeve): WorkStats {
    return scaleWorkStats(calculateCrimeWorkStats(sleeve, this.getCrime()), sleeve.shockBonus(), false);
  }

  cyclesNeeded(): number {
    return this.getCrime().time / CONSTANTS._idleSpeed;
  }

  process(sleeve: Sleeve, cycles: number) {
    this.cyclesWorked += cycles;
    if (this.cyclesWorked < this.cyclesNeeded()) return;

    const crime = this.getCrime();
    const gains = this.getExp(sleeve);
    const success = Math.random() < crime.successRate(sleeve);
    if (success) Player.karma -= crime.karma * sleeve.syncBonus();
    else gains.money = 0;
    applySleeveGains(sleeve, gains, success ? 1 : 0.25);
    this.cyclesWorked -= this.cyclesNeeded();
  }

  APICopy() {
    return {
      type: WorkType.CRIME as "CRIME",
      crimeType: this.crimeType,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveCrimeWork", this);
  }

  /** Initializes a RecoveryWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): SleeveCrimeWork {
    const crimeWork = Generic_fromJSON(SleeveCrimeWork, value.data);
    crimeWork.crimeType = findCrime(crimeWork.crimeType)?.type ?? CrimeTypes.shoplift;
    return crimeWork;
  }
}

Reviver.constructors.SleeveCrimeWork = SleeveCrimeWork;
