#JSON Mapper

### What is it?
Small mapper for JSONs. It allows you to convert one object to another with minimal effort.
It's similar to [Ember-json-mapper](https://github.com/onechiporenko/ember-json-mapper), but without any dependencies.

### Installing
````
bower i json-mapper
````


### Usage examples
Basic
````javascript
var map = { a: 'a', c: 'b' };
var source = { a: 1, b: 2 };
var mapped = jsonMapper.map(source, map); // { a: 1, c: 2 }
````

Nested objects
````javascript
var map = { a: 'a', d: 'b.c' };
var source = { a: 1, b: { c: 2 } };
var mapped = jsonMapper.map(source, map); // { a: 1, d: 2 }
````

Nested keys
````javascript
var map = { a: 'a', 'd.e': 'b' };
var source = { a: 1, b: 2 };
var mapped = jsonMapper.map(source, map); // { a: 1, d: { e: 2 } }
````

Nested objects and nested keys
````javascript
var map = { a: 'a', 'd.e': 'b.c' };
var source = { a: 1, b: { c: 2 } };
var mapped = jsonMapper.map(source, map); // { a: 1, d: { e: 2 } }
````

Objects as keys
````javascript
var map = { a: 'a', c: { key: 'b' } };
var source = { a: 1, b: 2 };
var mapped = jsonMapper.map(source, map); // { a: 1, c: 2 }
````

With default value
````javascript
var map = { a: 'a', c: { key: 'b', default: 3 } };
var source = { a: 1, b: 2 };
var mapped = jsonMapper.map(source, map); // { a: 1, c: 2 }
````

Set value without mapping from source
````javascript
var map = { a: 'a', c: { default: 3 } };
var source = { a: 1, b: 2 };
var mapped = jsonMapper.map(source, map); // { a: 1, c: 3 }
````

Custom getter
````javascript
var map = { a: 'a', 'b': { custom: function (source) {
  return source.b.c + 1;
} } };
var source = { a: 1, b: { c: 2 } };
var mapped = jsonMapper.map(source, map); // { a: 1, b: 3 }
````

Array-properties mapping
````javascript
var map = { a: 'a', d: { key: 'b', map: { c: 'c' } } };
var source = { a: 1, b: [
  {c: 1, d: 1},
  {c: 2, d: 2}
] };
var mapped = jsonMapper.map(source, map); // { a: 1, d: [ {c: 1}, {c: 2} ] }
````

````javascript
var map = { a: 'a', d: { key: 'b', map: { c: 'c', f: { default: 2 } } } };
var source = { a: 1, b: [
  {c: 1, d: 1},
  {c: 2, d: 2}
] };
var mapped = jsonMapper.map(source, map); // { a: 1, d: [ {c: 1, f: 2}, {c: 2, f: 2} ] }
````

Multi-nesting
````javascript
var map = { a: 'a', d: { key: 'b', map: { c: 'c', v: { key: 'd', map: { e1: 'e', f1: 'f' } } } } };
var source = { a: 1, b: [
  {c: 1, d: [
    { e: 3, f: 4 }
  ] },
  {c: 2, d: [
    { e: 5, f: 6 }
  ] }
] };
var mapped = jsonMapper.map(source, map); // { a: 1, d: [ {c: 1, v: [ { e1: 3, f1: 4 } ] }, {c: 2, v: [ { e1: 5, f1: 6 } ] } ] }
````

Custom getter for nested objects
````javascript
var map = { a: 'a', d: { key: 'b', map: { c: 'c', v: { key: 'd', map: { e1: 'e', f1: { custom: function(source) {
  return source.f + 1;
} } } } } } };
var source = { a: 1, b: [
  {c: 1, d: [
    { e: 3, f: 4 }
  ] },
  {c: 2, d: [
    { e: 5, f: 6 }
  ] }
] };
var mapped = jsonMapper.map(source, map); // { a: 1, d: [ {c: 1, v: [ { e1: 3, f1: 5 } ] }, {c: 2, v: [ { e1: 5, f1: 7 } ] } ] }
````