/* eslint no-loop-func: "off" */
import kmpp from 'kmpp';
import { UserRow, UserRows } from './ConfService';
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

  console.log('minGroupUserPairs', minGroupUserPairs, k, tables);

  const rotateModBy = minGroupUserPairs * 2;

  // Origin group is clustered, and we're trying to diversify them.
  // Pull out a user from each source group and assign to target group
  while (l > 0) {
    // Pull out a user from source group.
    let pnt = groups[rb].pop();

    // If no point in this group, go to another group
    if (!pnt) {
      // only when group is exhauted, don't combine below
      // safety from inf loop
      // if (groups[rb].length === 0) emptyGroups++;
      // if (emptyGroups === k) break;
      if (groups.find(g => g.length > 0) === undefined) break;

      rb = ++rb % k;
      continue;
    }

    // if target group doesnt exist, create it
    if (!dgroups[rb2]) dgroups[rb2] = [];
    // Add pnt to group
    dgroups[rb2] = dgroups[rb2].concat([pnt]);
    --l;
    // If curent target has X mod users, change the target group to next group
    // If target group pnter is even, increament the point. This will 'wait' to get two points from two different origin cycles.
    if (dgroups[rb2].length % rotateModBy === 0) {
      // move target group
      rb2 = ++rb2 % tables;

      // Move source group
      /// Doing this causes bug!!
      /// rb = ++rb % k;
      /// continue;
    }

    // Move onto next point
    // find next farthest member
    const sourcePointAnswers =
      pnt!.answers.length < 2 ? pnt!.answers.concat([0]) : pnt!.answers;

    const distToGroupMember = groups
      // record index for to preserve post filters
      .map((xs, i) => ({ xs, i }))
      // remove groups that are same index as current group inspected
      .filter(x => x.i !== rb)
      // get last element or ignore group
      .filter(x => x.xs.length > 0)
      .map(x => ({ x: x.xs[x.xs.length - 1], gi: x.i }))
      // map to distance from origin point
      .map(lastGroupItem => {
        // if (!x.answers) return undefined;

        // make sure a minimum for two dim for the Distance lib
        const lastGroupItemAns = lastGroupItem.x.answers;
        const a1 =
          lastGroupItemAns.length < 2
            ? lastGroupItemAns.concat([0])
            : lastGroupItemAns;

        // console.log('a1', a1, a2);
        const dist = distance(a1, sourcePointAnswers);
        // console.log('dist', dist);
        return { x: dist, i: lastGroupItem.gi };
      });

    // sort descending
    const distToGroupMemberSorted = 
      distToGroupMember.sort((a, b) => b.x - a.x)
      .filter(y=>y.i > 1); // remove similar groups

    // console.log('distToGroupMemberSorted', distToGroupMemberSorted);
    // throw new Error('a');

    // Get mid point group to choose from (dont exhaust the extremes)
    let m = Math.floor(distToGroupMemberSorted.length / 2);
    // jitter
    // m += Math.round(Math.random() * 1) % k;
    // console.log('distToGroupMemberSorted', distToGroupMemberSorted);

    // get middle group index
    let r = distToGroupMemberSorted[m];
    // No diff in view, chose from most diff
    /// if(r && r.x <= 1) r = distToGroupMemberSorted[0];

    // if Distance is 0, just round robin
    if(!r) {
      console.log('round robin');
      rb = ++rb % k;
    } else {
      rb = r.i;
    }

    // console.log('r', rb, m, r);

    // use ideal index, otherwise roundrobin
    

    /*  const nextIndex = aa
      .reduce(
        (acc: number[], x: number, i: number) => (x > acc[1] ? [i, x] : acc),
        [-1, -100]
      )[0];*/

    // use nextIndex unless no pick was found, then roundrobin
    // rb = nextIndex !== -1 ? nextIndex : ++rb % k;
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
    // Less than 2 get merged to last group
    if (dgroups[i].length < 2 && i !== 0) {
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
    throw new Error(`groupByIndex ${groupIndex} >= ${findGroup.length}`);
    // return groupIndex + 1; // give fallback numeric value
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
    maxIterations: 60
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
