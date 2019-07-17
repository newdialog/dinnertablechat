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
    var g = assignments[i]; // group assigned

    if (!groups[g]) groups[g] = [];
    groups[g] = groups[g].concat([pnt]);
  }

  console.log('groups', groups);
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

  return dgroups;
}

var pnts_old_test_case = [
  [0, 1, 0],
  [0, 1, 0],
  [1, 0, 0],
  [1, 0, 1],
  [0, 0, 1],
  [0, 0, 0],
  [0, 0, 1]
];

var pnts = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

export function match2() {}

export function match(
  clusters?: number,
  people?: Array<Array<Number>>,
  names?: Array<string>
): Person[][] {
  // K clusters
  var k = clusters || 3;

  const p = people || pnts;
  // Run k-means
  var r = kmpp(p, {
    k: k,
    maxIterations: 30
  });

  console.log('p', JSON.stringify(p), names);

  names = names || p.map(x => 'user' + x);

  console.log('k', k);

  // Get the count of non-empty kmean clusters
  var counts = r.counts.filter(x => x > 0).reduce((a, b) => ++a, 0);
  console.log('counts', counts);

  // Group the actual points of the kmeans pass
  var groups = groupify(pnts, names, r.assignments, counts);
  console.log('k-means clusters');
  console.log(JSON.stringify(groups));

  const tables = 3;
  // Diversify them into new groups!
  var r2 = diversify(groups, r.assignments.length, counts, tables);

  console.log('-diversified table-');
  console.log(r2);

  return r2;
}
