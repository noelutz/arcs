// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

"use strict";

defineParticle(({DomParticle}) => {

  let template = `
<style>
  [list-view] {
    /*border: 1px solid silver;*/
    /*padding: 4px;*/
    background-color: #EEEEEE;
  }
  [list-view] [head] {
    background-color: #bae698;
    display: flex;
    align-items: center;
    padding: 8px 16px;
  }
  [list-view] [msg] {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #bae698;
    border-radius: 5px;
    margin: 3px 15px 3px 15px;
    box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
  }
  [list-view] [msg].friend {
    background-color: #ebffdc;
  }
  [list-view] [msg].first {
    margin: 15px 15px 3px 15px;    
  }
  [list-view] [author] {
    visibility: hidden;

  }
  [list-view] [msg].friend.first:before {
    content: ' ';
    float: left;
    margin-left: -30px;
    margin-top: -8px;
  	border: 15px solid;
	  border-color: #ebffdc transparent transparent transparent;
  }
  [list-view] [msg]:not(.friend).first:after {
    content: ' ';
    right: 0px;
    margin-top: -2px;
  	border: 15px solid;
    border-color: #bae698 transparent transparent transparent;
    position: absolute;
  }
  [list-view] [msg].friend [author] {
    visibility: visible;
    font-size: 0.5em;
    font-style: italic;
    color: grey;
  }
</style>

<div list-view>
  <div>
    <div slotid="preamble"></div>
    <div head>
      <span>Chat</span>
    </div>
    <x-list items="{{chats}}">
      <template>
        <div>
          <div msg class="{{classes}}">
            <span>{{content}}</span>
            <div mustache style="{{brostyle}}">
              <img src="{{bromsg}}" height="{{broheight}}" width="{{browidth}}"></img>
            </div>
            <span author>@<span>{{name}}</span></span>
          </div>
        </div>
      </template>
    </x-list>
  </div>
  <x-list items="{{compose}}">
    <template>
      <div slotid$="{{slot}}"></div>   
    </template>
  </x-list>
</div>
    `.trim();

  return class RenderTranscript extends DomParticle {
    get template() {
      return template;
    } 
    _willReceiveProps(props) {
      // TODO(noelutz): figure out why person isn't set properly when
      // it's defined as a singleton.
      let me = props.me[0].name

      // Create new composition slots of a chat talks about a certain keyword.
      let composeSlots = new Set(['compose']);
      props.chats.forEach(function(chat) {
        ['moustache', 'bro'].forEach(function(elt) {
          if (chat.content.toLowerCase().indexOf(elt) >= 0) {
            composeSlots.add(elt);
          }
        });
      });

      this._setState({
        // TODO(sjmiles): arcana: translates object-with-name-getter to POJO-with-name-property
        // TODO(noelutz): why is person not set in the props?
        chats: props.chats.map(({name, content, type}, i) => {
          // Annotate the first chat in a sequence of chat messages from the same author.
          let styles = [];
          if (i == 0 || name != props.chats[i -1].name) {
            styles.push('first');
          }
          // Annotate chat messages authored by the other participant in the conversation.
          if (name != me) {
            styles.push('friend');
          }
          let classes = styles.join(' ');

          let tmpl = {name, content, classes, bromsg: ''};
          // Display BRO messages. move this over to a particle that stitched together.
          tmpl.brostyle = 'display: none';
          if (type == 'bro') {
            let {msg, height, width} = JSON.parse(content);
            tmpl.bromsg = msg;
            tmpl.broheight = height;
            tmpl.browidth = width;
            tmpl.brostyle = '';
            tmpl.content = '';
          }
          return tmpl;
        }),
        compose: Array.from(composeSlots).map(s => {return {slot: s}}),
      });
    }
    _render(props, state) {
      if (state.chats && state.chats.length) {
        return {
          chats: state.chats,
          compose: state.compose
        };
      }
    }
  };

});
