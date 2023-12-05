import { Agent } from "./agent.ts";
import { assertStrictEquals, Environment, Person } from "./deps.ts";
function gcd(a: number, b: number): number {
  if (a < b) {
    const tmp = a;
    a = b;
    b = tmp;
  }
  const r = a % b;
  if (r === 0) {
    return b;
  }
  return gcd(b, r);
}
Deno.test({
  name: "constructor",
  fn: function () {
    new Agent(0.01, function (t) {
      return 1 / Math.log(t + 1.1);
    });
  },
});
Deno.test({
  name: "learn",
  fn: function () {
    const people = [
      new Person("人間１"),
      new Person("人間２"),
      new Person("人間３"),
      new Person("人間４"),
      new Person("人間５"),
      new Person("人間６"),
      new Person("人間７"),
      new Person("人間８"),
      new Person("人間９"),
      new Person("人間10"),
      new Person("人間11"),
      new Person("人間12"),
    ];
    for (let i = 0; i < people.length; i++) {
      for (let j = 0; j < people.length; j++) {
        if (i === j) {
          continue;
        }
        const d = gcd(i + 1, j + 1);
        if (d === i || d === j) {
          people[i].likes(people[j]);
          people[j].likes(people[i]);
        } else if (d === 1) {
          people[i].dislikes(people[j]);
          people[j].dislikes(people[i]);
        }
      }
    }
    const got = new Agent(0.01, function (t) {
      return 1 / Math.log(t + 1.1);
    }).learn(
      new Environment(
        new Set(people),
        1,
        -1,
        0,
        2,
        1,
        function (_happinesses) {
          return 5;
        },
      ),
    );
    for (const element of got) {
      assertStrictEquals(element, 5);
    }
  },
});
