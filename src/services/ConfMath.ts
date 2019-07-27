import kmpp from 'kmpp';

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
  tables: number
): Groups {
  // const numAssigned = assignments.length;

  const dgroups: Groups = Array(tables);
  var l = len;
  var rb = 0;
  var rb2 = 0;
  while (l > 0) {
    // console.log(rb, groups.length);
    var pnt = groups[rb].pop();
    if (!pnt) {
      rb = ++rb % k;
      continue;
    }

    if (!dgroups[rb2]) dgroups[rb2] = [];
    dgroups[rb2] = dgroups[rb2].concat([pnt]);
    if (dgroups[rb2].length % 2 === 0) rb2 = ++rb2 % tables;
    --l;
    rb = ++rb % k;
  }

  // remove single person groups
  // const removeSingleUserGroups: Groups = [];
  for (var i = dgroups.length; i >= 0; i--) {
    if (!dgroups[i]) {
      dgroups[i] = [];
      continue; // group is empty
    }
    if (dgroups[i].length === 1 && i !== 0) {
      dgroups[i - 1].push(dgroups[i].pop()!);
    }
  }

  return dgroups;
}

// Basically just convert data types
export function match2(getAllData: any, maxGroups: number = 2) {
  const data = getAllData;
  if (data.length === 0) return [];

  let rawListOfAnswersIds: string[] = [];

  data.map(x => {
    x.answersHash = x.answers;
    // stable sorting answers
    const sortedKeys: string[] = Object.keys(x.answersHash).sort();
    x.answers = sortedKeys.map(k => x.answersHash![k]) as number[][];
    // if not set, set the keys
    if (rawListOfAnswersIds.length === 0)
      rawListOfAnswersIds = sortedKeys.concat([]);
    return x;
  });

  const rawListOfAnswers = data.map(x => x.answers);
  const names = data.map(x => x.user);

  // console.log('rawListOfAnswers', JSON.stringify(rawListOfAnswers));
  const result = match(maxGroups, rawListOfAnswers, names).filter(
    x => x.length !== 0
  );

  console.log('result', JSON.stringify(result));

  // unwrangle into user[] = [answers]
  const obj = result.map(g =>
    g.reduce((acc, x) => {
      // check if group is null
      if (x.user)
        acc[x.user] = x.answers.reduce((acc, x, index) => {
          const key = rawListOfAnswersIds[index];
          acc[key] = x;
          return acc;
        }, {});
      return acc;
    }, {})
  );

  return obj;
}

export function findMyGroup(
  user: string,
  match2Data: Array<any>
): any[] | null {
  const findGroup = match2Data
    .map((g, index) => {
      g = Object.assign({}, g);
      g.gid = index;
      return g;
    })
    .filter(group => !!group[user]);

  if (findGroup.length === 0) return null;
  return findGroup[0];
}

export function match(
  clusters: number,
  people: Array<Array<number>>,
  names?: Array<string>
): Person[][] {
  // K clusters
  var k = clusters;

  const p = people;
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

  const tables = 3;
  // Diversify them into new groups!
  var r2 = diversify(groups, r.assignments.length, counts, tables);

  // console.log('-diversified table-');
  // console.log(r2);

  return r2;
}
