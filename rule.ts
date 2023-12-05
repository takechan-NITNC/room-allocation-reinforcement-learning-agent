import { Action, ImpressionStat } from "./deps.ts";
export class Rule {
  readonly state: ImpressionStat[][];
  readonly action: Action;
  constructor(state: ImpressionStat[][], action: Action) {
    this.state = state;
    this.action = action;
  }
}
