import { Agent } from "./agent.ts";
import { Environment, Person } from "./deps.ts";
const learningProgressData: number[][] = [];
const allocationProgressData: number[][] = [];
for (let i = 0; i < 100; i++) {
  const agent = new Agent(0.01, function (time) {
    return 4 / Math.log(time + 1.1);
  });
  learningProgressData.push([]);
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
    learningProgressData[learningProgressData.length - 1].push(
      result[result.length - 1],
    );
    if (i === 0) {
      allocationProgressData.push(result);
    }
    console.log(`${(i * 1000 + j) / (1000 * 100) * 100}％完了`);
  }
}
for (let j = 0; j < 1000; j++) {
  for (let i = 0; i < learningProgressData.length; i++) {
    Deno.writeTextFileSync(
      "学習進捗データ.csv",
      `"${learningProgressData[i][j]}"`,
      {
        append: true,
      },
    );
    if (i < learningProgressData.length - 1) {
      Deno.writeTextFileSync("学習進捗データ.csv", ",", {
        append: true,
      });
    }
  }
  Deno.writeTextFileSync("学習進捗データ.csv", "\n", {
    append: true,
  });
}
for (let j = 0; j < 1001; j++) {
  for (let i = 0; i < allocationProgressData.length; i++) {
    Deno.writeTextFileSync(
      "部屋割り進捗データ.csv",
      `"${allocationProgressData[i][j]}"`,
      {
        append: true,
      },
    );
    if (i < allocationProgressData.length - 1) {
      Deno.writeTextFileSync("部屋割り進捗データ.csv", ",", {
        append: true,
      });
    }
  }
  Deno.writeTextFileSync("部屋割り進捗データ.csv", "\n", {
    append: true,
  });
}
