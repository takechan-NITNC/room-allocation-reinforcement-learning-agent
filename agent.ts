import { Action, Environment } from "./deps.ts";
import { Rule } from "./rule.ts";
export class Agent {
  readonly #bettingRate: number;
  readonly #temperature: (time: number) => number;
  #time = 0;
  readonly #values = new Map<string, number>();
  constructor(bettingRate: number, temperature: (time: number) => number) {
    this.#bettingRate = bettingRate;
    this.#temperature = temperature;
  }
  #choose(environment: Environment): Action {
    const exps = new Map<string, number>();
    for (const action of environment.allowedActions) {
      exps.set(
        JSON.stringify(action),
        Math.exp(
          (this.#values.get(JSON.stringify(action)) ?? 0) /
            this.#temperature(this.#time),
        ),
      );
    }
    let random = Math.random();
    const denominator = [...exps.values()].reduce(function (previous, current) {
      return previous + current;
    });
    for (const action of environment.allowedActions) {
      random -= exps.get(JSON.stringify(action))! / denominator;
      if (random < 0) {
        return action;
      }
    }
    throw new Error("到達されないはずのプログラムが実行されました。");
  }
  learn(environment: Environment): number {
    let previousRuleString: string | undefined;
    for (let i = 0; i < 1000; i++) {
      const state = environment.getState();
      const action = this.#choose(environment);
      const ruleString = JSON.stringify(new Rule(state, action));
      const bid = (this.#values.get(ruleString) ?? 0) * this.#bettingRate;
      this.#values.set(
        ruleString,
        (this.#values.get(ruleString) ?? 0) - bid,
      );
      if (previousRuleString !== undefined) {
        this.#values.set(
          previousRuleString!,
          this.#values.get(previousRuleString)! + bid,
        );
      }
      const reward = environment.receive(action);
      previousRuleString = ruleString;
      this.#values.set(
        previousRuleString,
        (this.#values.get(previousRuleString) ?? 0) + reward,
      );
      this.#time++;
    }
    return environment.getEvaluationValue();
  }
}
