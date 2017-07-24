import { JSDOM } from 'jsdom';

// setup the simplest document possible
const dom = new JSDOM('<!doctype html><html><body><div id="root">\n' +
  '        <div class="area">\n' +
  '            <div id="statistic">\n' +
  '                <h2>Sea battle</h2>\n' +
  '                <p class="action"></p>\n' +
  '                <div class="flex-wrap">\n' +
  '                    <div class="left-block">\n' +
  '                        <h3 class="title">Attempts</h3>\n' +
  '                        <ul class="simple-list attempt">\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">All</span>\n' +
  '                                <span class="value" data-key="all"></span>\n' +
  '                            </li>\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">Success</span>\n' +
  '                                <span class="value" data-key="success"></span>\n' +
  '                            </li>\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">Failed</span>\n' +
  '                                <span class="value" data-key="failed"></span>\n' +
  '                            </li>\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">Percent of successful</span>\n' +
  '                                <span class="value" data-key="percent"></span>\n' +
  '                            </li>\n' +
  '                        </ul>\n' +
  '                    </div>\n' +
  '                    <div class="right-block">\n' +
  '                        <h3 class="title">Alive/damaged opponent ships</h3>\n' +
  '                        <ul class="simple-list ships">\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">4 cells ship</span>\n' +
  '                                <span class="value" data-key="4">2</span>\n' +
  '                            </li>\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">3 cells ships</span>\n' +
  '                                <span class="value" data-key="3"></span>\n' +
  '                            </li>\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">2 cells ships</span>\n' +
  '                                <span class="value" data-key="2"></span>\n' +
  '                            </li>\n' +
  '                            <li class="item">\n' +
  '                                <span class="label">1 cell ships</span>\n' +
  '                                <span class="value" data-key="1"></span>\n' +
  '                            </li>\n' +
  '                        </ul>\n' +
  '                    </div>\n' +
  '                </div>\n' +
  '            </div>\n' +
  '\n' +
  '            <div class="sea-blocks">\n' +
  '                <div class="user grid"></div>\n' +
  '                <div class="computer grid"></div>\n' +
  '            </div>\n' +
  '\n' +
  '            <div id="controls">\n' +
  '                <button class="btn start"></button>\n' +
  '                <button class="btn pause"></button>\n' +
  '                <button class="btn random"></button>\n' +
  '                <button class="btn clear"></button>\n' +
  '            </div>\n' +
  '        </div>\n' +
  '    </div></body></html>');


global.document = dom.window.document;
global.window = dom.window;

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(dom.window);


function propagateToGlobal (window) {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (global[key]) {
      if (process.env.JSDOM_VERBOSE) {
        console.warn("[jsdom] Warning: skipping cleanup of global['" + key + "']")
      }
      continue
    }

    global[key] = window[key]
  }
}