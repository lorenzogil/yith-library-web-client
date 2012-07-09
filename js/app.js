/*jslint vars: false, browser: true */
/*global Em */

var App = Em.Application.create();

App.MyView = Em.View.extend({
    mouseDown: function () {
        "use strict";
        window.alert("hello world!");
    }
});
