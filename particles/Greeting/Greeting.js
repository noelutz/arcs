// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

// Greeting defines a particle that displays "You're an {{animal}}" for a
// person. The animal is chosen based on the first letter of the person's
// name.
defineParticle(({DomParticle}) => {

  let template = `
    <span>You're <span>{{prefix}}</span>&nbsp;<span>{{animal}}</span>!</span>
  `.trim();

  let animals = {
    'A': 'alligator',
    'B': 'bear',
    'C': 'cat',
    'D': 'dolphin',
    // ...
    'Z': 'zebra',
    '': 'alian',
  };

  let vowels = ['a', 'e', 'i', 'o', 'u'];

  return class extends DomParticle {
    get template() {
      return template;
    }

    // Render gets called whenever props change or _setState() gets called.
    // Rather than copying the name into the particle's state (as in
    // HelloWorld.js) we skip that step and render the name from the props
    // directly to keep things simpler.
    _render(props, state) {
      if (props.person && props.person.name.length) {
        let name = props.person.name;
        let animal = animals[name.toUpperCase()[0]] || animals[''];
      	return {
          name: name,
          animal: animal,
          prefix: vowels.includes(animal[0]) ? 'an' : 'a'
      	};
      }
    }
  };
});
