import { Agent } from "./agent.ts";
import { Environment, Person } from "./deps.ts";
for (let i = 0; i < 100; i++) {
  const agent = new Agent(0.01, function (time) {
    return 3 / Math.log(time + 1.1);
  });
  for (let j = 0; j < 1000; j++) {
    const people = new Set<Person>();
    for (let k = 0; k < 12; k++) {
      people.add(new Person(k.toString()));
    }
    for (const from of people) {
      for (const to of people) {
        if (from === to) {
          continue;
        }
        const random = Math.random();
        if (random < 1 / 3) {
          from.likes(to);
        } else if (random < 2 / 3) {
          from.dislikes(to);
        }
      }
    }
    const environment = new Environment(
      people,
      1,
      -1,
      0,
      2,
      1,
      function (happinesses) {
        return happinesses.reduce(function (previous, current) {
          return previous + current;
        });
      },
    );
    const result = agent.learn(environment);
    console.log(`${(i * 1000 + j) / (1000 * 100) * 100}％完了`);
  }
}
