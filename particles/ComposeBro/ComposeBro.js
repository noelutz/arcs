/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

"use strict";

let bro = 'data:image/png;base64,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';

defineParticle(({DomParticle}) => {

  let template = `
<style>
  [composebro] {
    background-color: #dddddd;
  }
  [composebro] button {
    margin: 15px;
    background-image: url('data:image/png;base64,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');
    background-size: 60px 60px;
    height: 60px;  
    width: 60px;
)
  }
</style>
<div composebro>
  <button events on-click="_onSendClick"></button>
</div>
  `.trim();

  return class ComposeBro extends DomParticle {
    get template() {
      return template;
    }
    _getInitialState() {
      return {size: 50};
    }
    _willReceiveProps(props) {
      this._setState({
        // TODO(noelutz): figure out why person isn't set properly when
        // it's defined as a singleton.
        me: props.me[0].name,
        chats: props.chats,
      });
    }
    _render(props, state) {
      if (state.chats) {
        return {
        };
      }
    }
    _onSendClick(e, state) {
      const Chat = this._views.get('chats').entityClass;
      this._views.get('chats').store(new Chat({
          name: state.me,
          type: 'bro',
          content: JSON.stringify({msg: bro, height: state.size, width: state.size}),
      }));
      this._setState({
        size: Math.min(350, state.size * 1.2)
      });
    }
  };
});