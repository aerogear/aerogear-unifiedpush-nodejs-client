'use strict';

const test = require('tape');
const helpers = require('../lib/helpers');

test('test camelToDash Helper', (t) => {
    const camelString = 'simplePush';

    const parsedString = helpers.camelToDash(camelString);

    t.equal(parsedString, 'simple-push', 'should be dasherized');
    t.end();
});

test('test removeEmptyArrays helper', (t) => {
    const criteria = {
        variants: [],
        categories: ['1234', 'other']
    };

    const parsedCriteria = helpers.removeEmptyArrays(criteria);
    t.equal(parsedCriteria.categories.length, 2, 'categories should be unchanged');
    t.equal(parsedCriteria.variants, undefined, 'variants should no longer be here');
    t.end();
});
