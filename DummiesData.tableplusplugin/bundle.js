(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var randomSentence = require('random-sentence');

// Get table in opening tab
var table = Workspace.currentTable();

// Fetch table info
table.info(function(info) {

    // Get table columns listing
    var columns = info['columns'];
    
    for (var i = 0; i < 10; i++) {
        // Add empty row
        var row = table.addEmptyRow(columns); 

        var keys = Object.keys(columns);

        // Random value
        keys.forEach(function(key) {
            var dataType = columns[key]['typeString'];
            if (dataType == 'varchar' || dataType == 'text') {
                var sentence = randomSentence();
                row.update(key, sentence);
                row.setDefault(key, 0);            
            }
            if (dataType == 'int4' && key != 'id') {
                var number = Math.floor(Math.random() * 1000000);
                row.update(key, number);
                row.setDefault(key, 0);               
            }
            if (dataType == 'timestamp') {
                var t = new Date();
                var formatted = t.toISOString();
                row.update(key, formatted);
                row.setDefault(key, 0);               
            }
        });

        table.addToInsert(row);
    }

    // Reload workspace view
    Workspace.reload();  
});

},{"random-sentence":12}],2:[function(require,module,exports){
module.exports = clamp

function clamp(value, min, max) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value)
}

},{}],3:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function (obj) {

  return obj == null;
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],6:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

},{}],7:[function(require,module,exports){
'use strict';

module.exports = 9007199254740991;

},{}],8:[function(require,module,exports){
'use strict';

var isNil         = require('is-nil');
var isObject      = require('is-object');
var toString      = require('to-str');
var randomNatural = require('random-natural');

var pools = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  symbol: '~!@#$%^&()*_+-={}[]'
};

pools.alpha  = pools.lower + pools.upper;
pools['all'] = pools.lower + pools.upper + pools.number + pools.symbol;

module.exports = function (options) {

  if (!isObject(options)) {
    if (isNil(options)) {
      options = { pool: pools.all };
    } else {
      options = toString(options);
      options = { pool: pools[options] || options };
    }
  }

  var pool;

  if (options.pool) {
    pool = options.pool;
  } else if (options.lower) {
    pool = pools.lower;
  } else if (options.upper) {
    pool = pools.upper;
  } else if (options.alpha) {
    pool = pools.alpha;
  } else if (options.number) {
    pool = pools.number;
  } else if (options.symbol) {
    pool = pools.symbol;
  } else {
    pool = pools.all;
  }

  pool = toString(pool);

  return pool.charAt(randomNatural({
    min: 0,
    max: pool.length - 1,
    inspected: true
  }));
};

},{"is-nil":4,"is-object":5,"random-natural":11,"to-str":15}],9:[function(require,module,exports){
'use strict';

var clamp        = require('clamp');
var toInteger    = require('to-integer');
var MAX_SAFE_INT = require('max-safe-int');
var MIN_SAFE_INT = -MAX_SAFE_INT;

function fixme(val, min, max, isMin) {

  if (typeof val !== 'number') {
    val = toInteger(val);
  }

  if (isNaN(val) || !isFinite(val)) {
    return isMin ? min : max;
  }

  return clamp(val, min, max);
}

module.exports = function (options) {

  if (options) {
    // for speed up
    if (!options.inspected) {
      options.min = fixme(options.min, MIN_SAFE_INT, MAX_SAFE_INT, true);
      options.max = fixme(options.max, MIN_SAFE_INT, MAX_SAFE_INT, false);
    }
  } else {
    options = {
      min: MIN_SAFE_INT,
      max: MAX_SAFE_INT
    };
  }

  var min = options.min;
  var max = options.max;

  // swap to variables
  // ref: http://stackoverflow.com/a/16201688
  if (min > max) {
    min = min ^ max;
    max = min ^ max;
    min = min ^ max;
  }

  return Math.round(Math.random() * (max - min)) + min;
};

module.exports.fixme = fixme;

},{"clamp":2,"max-safe-int":7,"to-integer":14}],10:[function(require,module,exports){
'use strict';

var clamp          = require('clamp');
var randomNatural  = require('random-natural');
var randomSyllable = require('random-syllable');

var MIN_LEN = 2;
var MAX_LEN = 18;

module.exports = function (options) {

  options = options || {
      syllables: randomNatural({
        min: 1,
        max: 3,
        inspected: true
      })
    };

  var length    = options.length;
  var syllables = options.syllables;

  var result = '';

  if (syllables) {
    for (var i = 0; i < syllables; i++) {
      result += randomSyllable();
    }

    return result.substring(0, MAX_LEN);
  }


  if (!length && ( options.min || options.max)) {
    length = randomNatural({
      min: options.min || MIN_LEN,
      max: options.max || MAX_LEN
    });
  }

  length = length || randomNatural({
      min: MIN_LEN,
      max: MAX_LEN,
      inspected: true
    });


  length = clamp(length, MIN_LEN, MAX_LEN);


  while (result.length < length) {
    result += randomSyllable();
  }

  return result.substring(0, length);
};

},{"clamp":2,"random-natural":11,"random-syllable":13}],11:[function(require,module,exports){
'use strict';

var randomInt    = require('random-integral');
var MAX_SAFE_INT = require('max-safe-int');

module.exports = function (options) {

  if (options) {
    if (!options.inspected) {
      options.min = randomInt.fixme(options.min, 0, MAX_SAFE_INT, true);
      options.max = randomInt.fixme(options.max, 0, MAX_SAFE_INT, false);
    }
  } else {
    options = {
      min: 0,
      max: MAX_SAFE_INT
    };
  }

  options.inspected = true;

  return randomInt(options);
};

module.exports.fixme = randomInt.fixme;

},{"max-safe-int":7,"random-integral":9}],12:[function(require,module,exports){
'use strict';

var clamp         = require('clamp');
var randomLorem   = require('random-lorem');
var randomNatural = require('random-natural');

var MIN_LEN = 2;
var MAX_LEN = 18;

module.exports = function (options) {

  options = options || {
      words: randomNatural({
        min: 12,
        max: 18,
        inspected: true
      })
    };

  var length = options.words;

  if (!length && (options.min || options.max)) {
    length = randomNatural({
      min: options.min || MIN_LEN,
      max: options.max || MAX_LEN
    });
  }

  length = length || randomNatural({
      min: MIN_LEN,
      max: MAX_LEN,
      inspected: true
    });

  length = clamp(length, MIN_LEN, MAX_LEN);

  var words = [];

  while (length--) {
    words.push(randomLorem());
  }

  var firstWorld = words[0];

  words[0] = firstWorld[0].toUpperCase() + firstWorld.substr(1);

  return words.join(' ') + '.';
};

},{"clamp":2,"random-lorem":10,"random-natural":11}],13:[function(require,module,exports){
'use strict';

var clamp         = require('clamp');
var isObject      = require('is-object');
var toInteger     = require('to-integer');
var randomChar    = require('random-char');
var randomNatural = require('random-natural');

module.exports = function (options) {

  var length = isObject(options)
    ? options.length
    : options;

  if (length) {
    length = toInteger(length);
    length = clamp(length, 2, 3);
  } else {
    length = randomNatural({ min: 2, max: 3 });
  }

  var consonants = 'bcdfghjklmnprstvwz'; // consonants except hard to speak ones
  var vowels = 'aeiou';                  // vowels
  var all = consonants + vowels;         // all

  var text = '';
  var char;

  for (var i = 0; i < length; i++) {
    if (i === 0) {
      // First character can be anything
      char = randomChar({ pool: all });
    } else if (consonants.indexOf(char) === -1) {
      // Last character was a vowel, now we want a consonant
      char = randomChar({ pool: consonants });
    } else {
      // Last character was a consonant, now we want a vowel
      char = randomChar({ pool: vowels });
    }

    text += char;
  }

  return text;
};

},{"clamp":2,"is-object":5,"random-char":8,"random-natural":11,"to-integer":14}],14:[function(require,module,exports){
'use strict';

var isNil      = require('is-nil');
var isSymbol   = require('is-symbol');
var isObject   = require('is-object');
var isFunction = require('is-function');

var NAN = 0 / 0;

module.exports = function (value) {

  if (isNil(value)) {
    return 0;
  }

  var type = typeof value;

  if (type === 'number') {
    return value;
  } else if (type === 'boolean') {
    return value ? 1 : 0;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {

    var raw = isFunction(value.valueOf) ? value.valueOf() : value;

    value = isObject(raw) ? (raw + '') : raw;
  }


  type = typeof value;
  if (type !== 'string') {
    return type === 'number' ? value : parseInt(value, 10);
  }


  // trim
  value = value.replace(/^\s+|\s+$/g, '');


  if (/^0b[01]+$/i.test(value)) {
    return parseInt(value.slice(2), 2);
  } else if (/^0o[0-7]+$/i.test(value)) {
    return parseInt(value.slice(2), 8);
  } else if (/^0x[0-9a-f]+$/i.test(value)) {
    return parseInt(value.slice(2), 16);
  }

  if(/^0b/i.test(value)||/^0o/i.test(value)||/^[\+\-]?0x/i.test(value)){
    return NAN;
  }

  return parseInt(value, 10);
};

},{"is-function":3,"is-nil":4,"is-object":5,"is-symbol":6}],15:[function(require,module,exports){
'use strict';

/* global Symbol */

var isNil      = require('is-nil');
var isSymbol   = require('is-symbol');
var isObject   = require('is-object');
var isFunction = require('is-function');

module.exports = function (value) {

  if (typeof value === 'string') {
    return value;
  }

  if (isNil(value)) {
    return '';
  }

  if (isSymbol(value)) {
    return Symbol.prototype.toString.call(value);
  }

  if (isObject(value) && isFunction(value.toString)) {
    return value.toString();
  }

  var result = '' + value;

  return (result === '0' && (1 / value) === -1 / 0) ? '-0' : result;
};

},{"is-function":3,"is-nil":4,"is-object":5,"is-symbol":6}]},{},[1]);
