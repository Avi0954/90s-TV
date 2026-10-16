const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const Channel = require('../src/models/Channel');
const Show = require('../src/models/Show');

describe('Database Schema & Type Consistency Tests', () => {
    test('Channel schema normalizes legacy types Main and Optional', () => {
        const channel1 = new Channel({
            name: 'Cartoon Network',
            slug: 'cn-test',
            type: 'Main'
        });
        assert.equal(channel1.type, 'Cartoon', 'Main should be normalized to Cartoon');

        const channel2 = new Channel({
            name: 'Doordarshan',
            slug: 'dd-test',
            type: 'Optional'
        });
        assert.equal(channel2.type, 'IndianTV', 'Optional should be normalized to IndianTV');

        const channel3 = new Channel({
            name: 'Sonic',
            slug: 'sonic-test',
            type: 'Cartoon'
        });
        assert.equal(channel3.type, 'Cartoon', 'Standard Cartoon type preserved');
    });

    test('Show schema supports season, episodeNumber, and duration fields', () => {
        const show = new Show({
            title: 'Doraemon Ep 1',
            slug: 'doraemon-ep-1',
            franchise: 'Doraemon',
            season: 2,
            episodeNumber: 14,
            duration: '22m',
            era: '90s',
            genre: 'classic'
        });

        assert.equal(show.season, 2);
        assert.equal(show.episodeNumber, 14);
        assert.equal(show.duration, '22m');
        assert.equal(show.franchise, 'Doraemon');
    });

    test('Show schema defaults season to 1 and episodeNumber to 1 when omitted', () => {
        const show = new Show({
            title: 'Tom and Jerry Classic',
            slug: 'tj-classic',
            era: '90s'
        });

        assert.equal(show.season, 1);
        assert.equal(show.episodeNumber, 1);
        assert.equal(show.duration, '22m');
    });
});
