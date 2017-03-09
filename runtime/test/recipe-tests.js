/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

var data = require("../data-layer.js");
var Arc = require("../arc.js");
var Resolver = require("../resolver.js");
var recipe = require("../recipe.js");
let assert = require('chai').assert;


var Foo = data.testing.testEntityClass('Foo');
var Bar = data.testing.testEntityClass('Bar');

describe('recipe', function() {

  it('recipes can load', function() {
    let scope = new data.Scope();
    var arc = new Arc(scope);
    var suggestion = new recipe.RecipeBuilder()
        .suggest("TestParticle")
            .connect("foo", data.testing.viewFor(Foo, scope))
            .connect("bar", data.testing.viewFor(Bar, scope))
        .build();

    suggestion.instantiate(arc);
    scope.commit([new Foo("not a Bar")]);
    arc.tick();
    assert.equal(data.testing.viewFor(Bar, scope).data.length, 1);
    assert.equal(data.testing.viewFor(Bar, scope).data[0].data, "not a Bar1");
  });
});