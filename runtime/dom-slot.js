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

//const assert = require('assert');
const Slot = require('./slot.js');
const Template = require('./browser/xenon-template.js');

// TODO(sjmiles): using Node syntax to import custom-elements (which only happens in browser context)
if (global.document) {
  require('./browser/x-list.js');
  require('./browser/model-select.js');
}

let templates = new Map();

class DomSlot extends Slot {
  constructor(slotid) {
    super(slotid);
    this.dom = null;
  }
  initialize(context, exposedView) {
    this.dom = context;
    this.exposedView = exposedView;
  }
  isInitialized() {
    return Boolean(this.dom);
  }
  uninitialize() {
    this.dom = null;
    this.exposedView = null;
  }
  // TODO(sjmiles): name is weird, maybe `teardown` or something
  derender() {
    var infos = this._findInnerSlotInfos();
    this._setContent('');
    return infos;
  }
  // TODO(sjmiles): SlotManager calls here
  render(content, eventHandler) {
    if (this.isInitialized()) {
      this._setContent(content, eventHandler);
      return this._findInnerSlotInfos();
    }
  }
  _setContent(content, eventHandler) {
    // TODO(sjmiles): these signals are ad hoc
    // falsey content is a request to teardown rendering
    if (!content) {
      this.dom.textContent = '';
      this._liveDom = null;
    } else if (typeof content === 'string') {
      // legacy html content
      this.dom.innerHTML = content;
    } else {
      // handle multiplexed content object
      let templateName = content.name || 'main';
      if (content.template) {
        templates[templateName] = Object.assign(document.createElement('template'), {
          innerHTML: content.template
        });
      }
      if (content.model) {
        if (!this._liveDom) {
          this._stampTemplate(templates[templateName], eventHandler);
        }
        this._liveDom.set(content.model);
      }
      /*
      if (content.html) {
        // legacy html content (unused?)
        html = content.html;
      }
      */
    }
  }
  _stampTemplate(template, eventHandler) {
    let eventMapper = this._eventMapper.bind(this, eventHandler);
    // TODO(sjmiles): hack to allow subtree elements (e.g. x-list) to marshal events
    this.dom._eventMapper = eventMapper;
    // TODO(sjmiles): _liveDom needs new name
    this._liveDom = Template.stamp(template);
    this._liveDom.mapEvents(eventMapper);
    this._liveDom.appendTo(this.dom);
  }
  _eventMapper(eventHandler, node, eventName, handlerName) {
    node.addEventListener(eventName, e => {
      eventHandler({
        handler: handlerName,
        data: {
          key: node.key,
          value: node.value
        }
      });
    });
  }
  _findInnerSlotInfos() {
    return Array.from(this.dom.querySelectorAll("[slotid]")).map(s => {
      return {
        context: s,
        id: s.getAttribute('slotid')
      };
    });
  }
}

class MockDomSlot extends DomSlot {
  _setContent(content) {
    let html = content.html || content;
    this.dom.innerHTML = this.dom._cachedContent = html;
  }
  _findInnerSlotInfos() {
    let slots = [];
    let slot;
    let RE = /slotid="([^"]*)"/g;
    while ((slot = RE.exec(this.dom.innerHTML))) {
      slots.push({
        context: {}, 
        id: slot[1]
      });
    }
    return slots;
  }
  _findEventGenerators() {
    // TODO(mmandlis): missing mock-DOM version
    // TODO(sjmiles): mock-DOM is ill-defined, but one possibility is that it never generates events 
    return [];
  }
}

// TODO(sjmiles): this decision should be elsewhere
module.exports = global.document ? DomSlot : MockDomSlot;