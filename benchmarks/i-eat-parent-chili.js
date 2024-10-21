// findings:
// - removing `excludeTags`
//   - forEachWay: stays same
//   - forWay: decreases ms/ops by 10ms (50 -> 40)
//
// - having more complex objects in getOffers
//   - forEachWay: stays same
//   - forWay: stays same
//
// - terms seems to be the only reason any of these two
//   perform slow. Removing terms (foreach and for clauses)
//   - forEachWay: 9,384 ops & 0.1017 ms/ops
//   - forWay: 36,889 ops & 0.02711 ms/ops
//
// - terms: When I change the term's title to `title+${i}`
//  - forEachWay: slows it down by 1ms/op (28.03 -> 29.03)
//  - forWay: makes it faster by 10ms/op (50ms -> 40ms)

const populateData = (searchEntries, excludeTags, terms) => {
  const se = (i) => ({
    getOffers: () => [
      i
    ],
  });
  for (let i = 0; i < 10000; i++) {
    const seInstance = se(i);
    searchEntries.push(seInstance);
    excludeTags.push('tag' + i);
    terms.push('title'+i);
  }
};

const forEachWay = (searchEntries, excludeTags, terms) => {
  searchEntries.forEach((se) => {
    const offers = se.getOffers([], excludeTags);
    offers.forEach((o) => {
      terms.forEach((t) => {
        // something here
      });
    });
  });
};

const forWay = (searchEntries, excludeTags, terms) => {
  for (let sid = 0; sid < searchEntries.length; sid++) {
    const se = searchEntries[sid];
    const offers = se.getOffers([], excludeTags);
    for (let i = 0; i < offers.length; i++) {
      for (let j = 0; j < terms.length; j++) {
        // something here
      }
    }
  }
};


const iterations = 1

export default {
  blocks: [
    {
      id: 'forEachWay',
      setup: () => {
        let searchEntries = [];
        let excludeTags = [];
        let terms = [];
        populateData(searchEntries, excludeTags, terms)

        return () => {
          let result = 0
          for (let i = 0; i < iterations; i++) {
            forEachWay(searchEntries, excludeTags, terms);
          }
          return result
        }
      }
    },
    {
      id: 'forWay',
      setup: () => {
        let searchEntries = [];
        let excludeTags = [];
        let terms = [];
        populateData(searchEntries, excludeTags, terms)

        return () => {
          let result = 0
          for (let i = 0; i < iterations; i++) {
            forWay(searchEntries, excludeTags, terms);
          }
          return result
        }
      }
    },
  ]
}
