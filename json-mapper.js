+(function () {

  /**
   * Determine if val is object
   * @param {*} val
   * @returns {boolean}
   * @method isObject
   */
  function isObject(val) {
    return 'object' === typeOf(val);
  }

  /**
   * Determine if val is not set
   * @param {*} val
   * @returns {boolean}
   * @method isNone
   */
  function isNone(val) {
    return val === null || val === undefined;
  }

  /**
   * Get list of object keys
   * @param {object} obj
   * @returns {Array}
   * @method keys
   */
  function keys(obj) {
    var ret = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        ret.push(k);
      }
    }
    return ret;
  }

  /**
   * Check if test is not false
   * Throw error if test is false
   * @param {string} desc
   * @param {*} test checked value
   * @method assert
   */
  function assert(desc, test) {
    if (!test) {
      throw new Error("Assertion Failed: " + desc);
    }
  }

  /**
   * Get value from root by key
   * If value is not defined, return defaultValue
   * @param {object} root
   * @param {string} key
   * @param {*} defaultValue
   * @returns {*}
   * @method getWithDefaults
   */
  function getWithDefaults(root, key, defaultValue) {
    var value = get(root, key);
    if (value === undefined) {
      return defaultValue;
    }
    return value;
  }

  /**
   * Get value from obj by key
   * @param {object} obj
   * @param {string} keyName
   * @returns {*}
   * @method get
   */
  function get(obj, keyName) {

    assert("Cannot call get with " + keyName + " key.", !!keyName);
    assert("Cannot call get with '" + keyName + "' on an undefined object.", obj !== undefined);

    if (keyName.indexOf('.') !== -1) {
      return _getPath(obj, keyName);
    }
    return obj[keyName];
  }

  /**
   * Get value from root by path (nested objects allowed)
   * @param {object} root
   * @param {string} path
   * @returns {*}
   * @method _getPath
   */
  function _getPath(root, path) {
    var parts = path.split("."),
      len = parts.length,
      idx;

    for (idx = 0; root != null && idx < len; idx++) {
      root = get(root, parts[idx]);
    }
    return root;
  }

  /**
   * Set value to obj by keyName
   * @param {object} obj
   * @param {string} keyName
   * @param {*} value
   * @param {boolean} tolerant*
   * @returns {*}
   * @method set
   */
  function set(obj, keyName, value, tolerant) {
    assert("Cannot call set with " + keyName + " key.", !!keyName);

    if (keyName.indexOf('.') !== -1) {
      return _setPath(obj, keyName, value, tolerant);
    }

    assert("You need to provide an object and key to `set`.", !!obj && keyName !== undefined);

    obj[keyName] = value;
    return value;
  }

  /**
   * Set value to root by path (nested objects allowed)
   * @param {object} root
   * @param {string} path
   * @param {string} value
   * @param {boolean} tolerant
   * @returns {*}
   * @method _setPath
   */
  function _setPath(root, path, value, tolerant) {
    var keyName = path.slice(path.lastIndexOf('.') + 1);

    path = (path === keyName) ? keyName : path.slice(0, path.length - (keyName.length + 1));

    if (!keyName || keyName.length === 0) {
      throw new Error('Property set failed: You passed an empty path');
    }
    root = _getPath(root, path);
    if (!root) {
      if (tolerant) {
        return;
      }
      else {
        throw new Error('Property set failed: object in path "' + path + '" could not be found or was destroyed.');
      }
    }

    return set(root, keyName, value);
  }

  var TYPE_MAP = {},
    toString = Object.prototype.toString,
    t = "Boolean Number String Function Array Date RegExp Object".split(" "),
    len = t.length,
    indx;
  for (indx = 0; indx < len; indx++) {
    TYPE_MAP[ "[object " + t[indx] + "]" ] = t[indx].toLowerCase();
  }

  /**
   * Get type of item
   * @param {*} item
   * @returns {string}
   * @method typeOf
   */
  function typeOf(item) {
    var ret = (item === null || item === undefined) ? String(item) : TYPE_MAP[toString.call(item)] || 'object';

    if (ret === 'object') {
      if (item instanceof Error) ret = 'error';
      else if (item instanceof Date) ret = 'date';
    }

    return ret;
  }

  /**
   * Get value from source using key (object with key, default, custom properties)
   * If `custom` (function) is provided, use it to get value
   * If `default` is provided, it'll be return if value undefined
   * `key` used to get value from source without any additional moves
   * @param {object} source
   * @param {object} key
   * @returns {*}
   * @method getFromObject
   */
  function getFromObject(source, key) {
    var _sub_k = get(key, 'key'),
      _default = get(key, 'default'),
      _custom_get = get(key, 'custom'),
      _v;
    assert('`key` or `default` should be defined', !(isNone(_custom_get)) || !(isNone(_default) && isNone(_sub_k)));
    if (isNone(_custom_get)) {
      if (isNone(_default)) {
        _v = get(source, _sub_k);
      }
      else {
        if (isNone(_sub_k)) {
          _v = _default;
        }
        else {
          _v = getWithDefaults(source, _sub_k, _default);
        }
      }
    }
    else {
      _v = _custom_get(source);
    }
    return _v;
  }

  /**
   * Set value to obj by path
   * Create nested objects if needed (this is main diff from _setPath)
   * @param {object} obj
   * @param {string} path
   * @param {*} value
   * @method setPath
   */
  function setPath(obj, path, value) {
    var parts = path.split('.'),
      sub_path = '';
    parts.forEach(function (_path, _index) {
      assert('path parts can\'t be empty', _path.length);
      if (sub_path.length) {
        sub_path += '.' + _path;
      }
      else {
        sub_path = _path;
      }
      if (_index === parts.length - 1) {
        set(obj, sub_path, value);
        return;
      }
      if (isNone(get(obj, sub_path))) {
        set(obj, sub_path, {});
      }
    });
  }

  var jsonMapper = {};

  jsonMapper.map = function mapper(source, map) {

    if (!isObject(source)) assert('`source` should be an object', false);
    if (!isObject(map)) assert('`map` should be an object', false);

    var mapped = {},
      k = keys(map);

    k.forEach(function (key) {
      var _k = map[key],
        _v = isObject(_k) ? getFromObject(source, _k) : get(source, _k);

      if ('undefined' !== typeOf(_v)) {
        if ('array' === typeOf(_v)) {
          _v = _v.map(function (_sub_v) {
            var _map = get(_k, 'map');
            if (isNone(_map)) return _sub_v;
            return mapper(_sub_v, _map);
          });
        }
        setPath(mapped, key, _v);
      }

    });

    return mapped;
  };

  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return jsonMapper;
    });
  }
  else
    if (typeof exports !== 'undefined') {
      module.exports = jsonMapper;
    }
    else {
      window.jsonMapper = jsonMapper;
    }

}).call(this);