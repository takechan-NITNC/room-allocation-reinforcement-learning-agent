import { Action, assertStrictEquals, ImpressionStat } from "./deps.ts";
import { Rule } from "./rule.ts";
Deno.test({
  name: "constructor",
  fn: function () {
    const state = [[new ImpressionStat(9, 0)]];
    const action = new Action(5, 6);
    const got = new Rule(state, action);
    assertStrictEquals(got.state, state);
    assertStrictEquals(got.action, action);
  },
});
