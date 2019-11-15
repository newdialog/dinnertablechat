import kmpp from 'kmpp';
import { UserRow, UserRows } from './ConfService';
// import { distance } from 'mathjs';
const distance = require('euclidean-distance');

interface Person {
  index: number;
  user?: string;
  answers: Array<number>;
}

type Group = Array<Person>;
type Groups = Array<Group>;

// Transform kmean idxs into real grouped points
function groupify(
  pnts: Array<Array<number>>,
  indexedNames: Array<string>,
  assignments: Array<number>,
  k: number
): Groups {
  const groups = Array(k);
  for (var i = 0; i < pnts.length; i++) {
    var pnt: Person = { index: i, answers: pnts[i], user: indexedNames[i] };
    // console.log('pnt', pnt);
    var g = assignments[i]; // group assigned

    if (!groups[g]) groups[g] = [];
    groups[g] = groups[g].concat([pnt]);
  }

  // console.log('groups', groups);
  return groups;
}

// takes in pnts and
function diversify(
  groups: Groups,
  len: number,
  k: number,
  tables: number,
  minGroupUserPairs: number = 1
): Groups {
  // if only ony group, return it
  if (groups.length < 2) return groups;
  // Target Group
  const dgroups: Groups = Array(tables);

  // Current pnt to work on
  let l = len;
  // Current group to get point
  let rb = 0;
  // Target diversified group to drop to
  let rb2 = 0;

  const rotateModBy = minGroupUserPairs * 2;

  // Origin group is clustered, and we're trying to diversify them.
  // Pull out a user from each source group and assign to target group
  let emptyGroups = 0;
  while (l > 0) {
    // Pull out a user from source group.
    let pnt = groups[rb].pop();

    // If no point in this group, go to another group
    if (!pnt) {
      // only when group is exhauted, don't combine below
      // safety from inf loop
      if (groups[rb].length === 0) emptyGroups++;
      if (emptyGroups === k) break;

      rb = ++rb % k;
      continue;
    }

    // if target group doesnt exist, create it
    if (!dgroups[rb2]) dgroups[rb2] = [];
    // Add pnt to group
    dgroups[rb2] = dgroups[rb2].concat([pnt]);

    // If curent target has X mod users, change the target group to next group
    // If target group pnter is even, increament the point. This will 'wait' to get two points from two different origin cycles.
    if (dgroups[rb2].length % rotateModBy === 0) rb2 = ++rb2 % tables;
    // Move onto next point
    --l;

    // Move onto next origin group
    // rb = ++rb % k;
    // No, find next farthest member

    // IS THIS GROUP EVEN VALID AFTER FILTER

    const nextIndex = groups
      // .filter(g => g.length > 0)
      .map(x => (x.length > 0 ? x[x.length - 1] : undefined)) // get last element
      // .filter(x => !!x) // node is valid
      .map(x => {
        if (!x || !x.answers) return undefined;
        const a1 = x.answers.length < 2 ? x.answers.concat([0]) : x.answers;
        const a2 =
          pnt!.answers.length < 2 ? pnt!.answers.concat([0]) : pnt!.answers;
        // console.log('a1', a1, a2);
        const dist = !!x ? distance(a1, a2) : undefined;
        // console.log('dist', dist);
        return dist;
      })
      .reduce(
        (acc: number[], x: number, i: number) => (x > acc[1] ? [i, x] : acc),
        [-1, -100]
      )[0];

    console.log('nextIndex', rb, nextIndex);

    // use nextIndex unless no pick was found, then roundrobin
    rb = nextIndex !== -1 ? nextIndex : ++rb % k;
  }

  // If there's only one or less groups, just end
  // Hrmm, already checked at top of dunc
  // if (groups.length < 2) return dgroups;

  // remove single person groups
  // const removeSingleUserGroups: Groups = [];
  for (var i = dgroups.length; i >= 0; i--) {
    if (!dgroups[i]) {
      dgroups[i] = [];
      continue; // group is empty
    }
    if (dgroups[i].length < rotateModBy && i !== 0) {
      // Add all members from smaller group to last group
      dgroups[i - 1] = dgroups[i - 1].concat(dgroups[i]);
      dgroups[i] = [];
      // dgroups[i - 1].push(dgroups[i].pop()!);
    }
  }

  return dgroups;
}

// Basically just convert data types
export function match2(
  data: UserRows,
  maxGroups: number = 2,
  minGroupUserPairs: number = 1
) {
  if (data.length === 0) return [];
  data = [...data]; // clone

  let rawListOfAnswersIds: string[] = [];

  data.map(x => {
    // x.answersHash = x.answers;
    // stable sorting answers
    const sortedKeys: string[] = Object.keys(x.answers).sort();
    x.answersArr = sortedKeys.map(k => x.answers[k]); // as number[][];
    // if not set, set the keys
    if (rawListOfAnswersIds.length === 0)
      rawListOfAnswersIds = sortedKeys.concat([]);
    return x;
  });

  const rawListOfAnswers = data.map(x => x.answersArr!);
  const names = data.map(x => x.user);

  // console.log('rawListOfAnswers', JSON.stringify(rawListOfAnswers));
  const result = match(
    maxGroups,
    minGroupUserPairs,
    rawListOfAnswers,
    names
  ).filter(x => x.length !== 0);

  // unwrangle into user[] = [answers]
  const obj = result.map(g =>
    g.reduce((acc, x) => {
      // check if group is null
      if (x.user)
        acc[x.user] = x.answers.reduce((acc2, y, index) => {
          const key = rawListOfAnswersIds[index];
          acc2[key] = y;
          return acc2;
        }, {});
      return acc;
    }, {})
  );

  return obj;
}

export function findMyGroup(user: string, match2Data: Array<any>): any | null {
  const findGroup = match2Data
    .map((g, index) => {
      g = { ...g };
      g.gid = index;
      return g;
    })
    .filter(group => !!group[user]);

  if (findGroup.length === 0) return null;
  return findGroup[0];
}

export function groupByIndex(
  groupIndex: number,
  match2Data: Array<any>
): any | null {
  const findGroup = match2Data.map((g, index) => {
    g = { ...g };
    g.gid = index;
    return g;
  });
  // .filter(group => !!group[user]);

  if (groupIndex >= findGroup.length) {
    return groupIndex + 1; // give fallback numeric value
    /* throw new Error(
      'invalid group index: ' + groupIndex + ' ' + findGroup.length
    ); */
  }
  return findGroup[groupIndex];
}

export function match(
  clusters: number,
  minGroupUserPairs: number,
  people: Array<Array<number>>,
  names?: Array<string>
): Person[][] {
  // K clusters
  var k = clusters;

  let p = [...people];

  // Run k-means
  var r = kmpp(p, {
    k: k,
    maxIterations: 30
  });

  // console.log('p', JSON.stringify(p), names);

  names = names || p.map(x => 'user' + x);

  // console.log('k', k);

  // Get the count of non-empty kmean clusters
  var counts = r.counts.filter(x => x > 0).reduce((a, b) => ++a, 0);
  // console.log('counts', counts);

  // Group the actual points of the kmeans pass
  var groups = groupify(p, names, r.assignments, counts);
  // console.log('k-means clusters');
  // console.log('groups', JSON.stringify(groups));

  const tables = k;
  // Diversify them into new groups!
  var r2 = diversify(groups, names.length, counts, tables, minGroupUserPairs);

  // console.log('-diversified table-');
  // console.log(r2);

  return r2;
}
