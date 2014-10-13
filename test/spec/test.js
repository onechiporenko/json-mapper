/* global describe, it */

(function () {
  'use strict';

  describe('Init', function () {
    it('jsonMapper should be defined', function () {
      expect(jsonMapper).to.be.object;
    });
  });

  describe('Basic', function () {

    it('Should trigger error if `source` isn\'t object (1)', function () {
      var map, source = [];
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });

    it('Should trigger error if `source` isn\'t object (2)', function () {
      var map, source = null;
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });

    it('Should trigger error if `source` isn\'t object (3)', function () {
      var map, source = '';
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });

    it('Should trigger error if `source` isn\'t object (4)', function () {
      var map, source = function () {
      };
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });
    it('Should trigger error if `map` isn\'t object (1)', function () {
      var map = [], source = {};
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });

    it('Should trigger error if `map` isn\'t object (2)', function () {
      var map = null, source = {};
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });

    it('Should trigger error if `map` isn\'t object (3)', function () {
      var map = '', source = {};
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });

    it('Should trigger error if `map` isn\'t object (4)', function () {
      var map = function () {
      }, source = {};
      expect(function () {
        jsonMapper.map(source, map);
      }).to.throw(Error);
    });

    it('Should return empty object if map is empty', function () {
      var map = {},
        source = { a: 1, b: 2, c: 3 },
        expected = {},
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should map simple keys', function () {
      var map = { a: 'b', b: 'c', c: 'a' },
        source = { a: 1, b: 2, c: 3 },
        expected = { a: 2, b: 3, c: 1 },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should skip missed keys in source', function () {
      var map = { a: 'a', d: 'd' },
        source = { a: 1 },
        expected = { a: 1 },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should skip missed keys in source (2)', function () {
      var map = { a: 'a', d: { key: 'd' } },
        source = { a: 1 },
        expected = { a: 1 },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should parse nested objects', function () {
      var map = { a: 'a', d: 'b.d' },
        source = { a: 1, b: {d: 2} },
        expected = { a: 1, d: 2 },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should skip missed keys in the nested objects', function () {
      var map = { a: 'a', d: 'b.d' },
        source = { a: 1, b: 2 },
        expected = { a: 1 },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

  });

  describe('`map` with objects as keys', function () {

    describe('`key`-tests', function () {

      it('Should trigger error if `key` isn\'t defined', function () {
        var map = { a: 'a', d: {} },
          source = { a: 1, b: 2 };
        expect(function () {
          jsonMapper.map(source, map);
        }).to.throw(Error);
      });

      it('Should use `key`', function () {
        var map = { a: 'a', d: { key: 'b' } },
          source = { a: 1, b: 2 },
          expected = { a: 1, d: 2 },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Should use nested `key`', function () {
        var map = { a: 'a', d: { key: 'b.c' } },
          source = { a: 1, b: { c: 2 } },
          expected = { a: 1, d: 2 },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Should set `key` with sub-objects', function () {
        var map = { a: 'a', 'd.e': { key: 'b.c' } },
          source = { a: 1, b: { c: 2 } },
          expected = { a: 1, d: { e: 2 } },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Should set `key` with sub-objects (2)', function () {
        var map = { a: 'a', 'd.e.f': { key: 'b.c' } },
          source = { a: 1, b: { c: 2 } },
          expected = { a: 1, d: { e: { f: 2 } } },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Should set `key` with sub-objects (3)', function () {
        var map = { a: 'a', 'd.e.f': { key: 'b.c.d' } },
          source = { a: 1, b: { c: { d: 2 } } },
          expected = { a: 1, d: { e: { f: 2 } } },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Should set `key` with sub-objects (4)', function () {
        var map = { a: 'a', 'd.e': { key: 'b' } },
          source = { a: 1, b: 2 },
          expected = { a: 1, d: { e: 2 } },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Should set `key` with sub-objects (5)', function () {
        var map = { a: 'a', 'd.e': { key: 'b.c' }, 'd.f': 'b.z' },
          source = { a: 1, b: { c: 2, z: 3 } },
          expected = { a: 1, d: { e: 2, f: 3 } },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Should trigger error if some `key`-parts are invalid', function () {
        var map = { a: 'a', 'd...e': { key: 'b' } },
          source = { a: 1, b: 2 };
        expect(function () {
          jsonMapper.map(source, map);
        }).to.throw(Error);
      });

    });

    describe('`default`-tests', function () {

      it('Should use `default` value', function () {
        var map = { a: 'a', d: { key: 'b.c', default: 2 } },
          source = { a: 1, b: { } },
          expected = { a: 1, d: 2 },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

      it('Shouldn\'t use `default` value', function () {
        var map = { a: 'a', d: { key: 'b.c', default: 4 } },
          source = { a: 1, b: { c: 2 } },
          expected = { a: 1, d: 2 },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

    });

    describe('`key`, `default` mix', function () {

      it('Should set `default`-value if `key` isn\'t provided', function () {
        var map = { a: 'a', d: { default: 4 } },
          source = { a: 1, b: { c: 2 } },
          expected = { a: 1, d: 4 },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

    });

    describe('`custom`-tests', function () {

      it('Should use `custom`', function () {
        var map = { a: 'a', 'b': { custom: function (source) {
            return source.b.c + 1;
          } } },
          source = { a: 1, b: { c: 2 } },
          expected = { a: 1, b: 3 },
          ret = jsonMapper.map(source, map);
        expect(ret).to.eql(expected);
      });

    });

  });

  describe('Array-mapping', function () {

    it('Should set array as value (`map` not provided)', function () {
      var map = { a: 'a', d: { key: 'b'} },
        source = { a: 1, b: [
          {c: 1},
          {c: 2}
        ] },
        expected = { a: 1, d: [
          {c: 1},
          {c: 2}
        ] },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should map array', function () {
      var map = { a: 'a', d: { key: 'b', map: { c: 'c' } } },
        source = { a: 1, b: [
          {c: 1, d: 1},
          {c: 2, d: 2}
        ] },
        expected = { a: 1, d: [
          {c: 1},
          {c: 2}
        ] },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should use `map` with objects as keys', function () {
      var map = { a: 'a', d: { key: 'b', map: { c: 'c', f: { default: 2 } } } },
        source = { a: 1, b: [
          {c: 1, d: 1},
          {c: 2, d: 2}
        ] },
        expected = { a: 1, d: [
          {c: 1, f: 2},
          {c: 2, f: 2}
        ] },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('Should map nested arrays', function () {
      var map = { a: 'a', d: { key: 'b', map: { c: 'c', v: { key: 'd', map: { e1: 'e', f1: 'f' } } } } },
        source = { a: 1, b: [
          {c: 1, d: [
            { e: 3, f: 4 }
          ] },
          {c: 2, d: [
            { e: 5, f: 6 }
          ] }
        ] },
        expected = { a: 1, d: [
          {c: 1, v: [
            { e1: 3, f1: 4 }
          ] },
          {c: 2, v: [
            { e1: 5, f1: 6 }
          ] }
        ] },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

    it('`custom` in nested', function () {
      var map = { a: 'a', d: { key: 'b', map: { c: 'c', v: { key: 'd', map: { e1: 'e', f1: { custom: function(source) {
          return source.f + 1;
        } } } } } } },
        source = { a: 1, b: [
          {c: 1, d: [
            { e: 3, f: 4 }
          ] },
          {c: 2, d: [
            { e: 5, f: 6 }
          ] }
        ] },
        expected = { a: 1, d: [
          {c: 1, v: [
            { e1: 3, f1: 5 }
          ] },
          {c: 2, v: [
            { e1: 5, f1: 7 }
          ] }
        ] },
        ret = jsonMapper.map(source, map);
      expect(ret).to.eql(expected);
    });

  });

})();