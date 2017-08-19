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

defineParticle(({DomParticle}) => {

  let template = `
<style>
  [compose] {
    background-color: #dddddd;
  }
  [compose] input {
    color: #666666;
    font-size: 1.1em;
    font-family: inherit;
    margin: 15px 3px 15px 15px;
  }
  [compose] button {
    margin: 15px 15px 15px 3px;
    height: 25px;
  }
</style>
<div compose>
  <input name="msg" type="text" id="msg" size="32" value={{msg}} on-change="_onMessageChange" />
  <button events on-click="_onSendClick">Send</button>
</div>
  `.trim();

  return class Compose extends DomParticle {
    get template() {
      return template;
    }
    _getInitialState() {
      return {message: ''};
    }
    _willReceiveProps(props) {
      if (props.me && props.me.name) {
        this._setState({
          me: props.me.name,
          chats: props.chats,
        });
      }
    }
    _render(props, state) {
      if (state.chats) {
        return {
          msg: state.message,
        };
      }
    }
    _onMessageChange(e, state) {
      state.message = e.data.value;
    }
    _onSendClick(e, state) {
      const Chat = this._views.get('chats').entityClass;
      this._views.get('chats').store(new Chat({name: state.me, content: state.message}));
      state.message = '';
    }
  };
});