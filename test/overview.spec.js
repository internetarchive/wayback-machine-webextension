const expect = require("chai").expect;
const getTotal = require("../scripts/overview").getTotal;
describe('overview', () => {
    it('should get total number of captures', () => {
        var captures = {
            '2001': {
                'text/html': 1,
            },
            '2002': {
                'text/html': 4
            }
        }
        expect(getTotal(captures)).to.equal(5);
    });
});