// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt
'use strict';

const assert = require('assert');
const Symbols = require('./symbols.js');
const Type = require('./type.js');

class Entity {
  constructor() {
    this[Symbols.identifier] = undefined;
  }
  get data() {
    return undefined;
  }

  isIdentified() {
    return this[Symbols.identifier] !== undefined;
  }
  identify(identifier) {
    assert(!this.isIdentified());
    this[Symbols.identifier] = identifier;
  }
  toLiteral() {
    return this.rawData;
  }

  get debugString() {
    return JSON.stringify(this.rawData);
  }

  static get type() {
    return new Type(this.key);
  }
}

module.exports = Entity;
