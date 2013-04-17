/*jslint browser: true */
/*global Ember, $, Yith: true, DS, yithAccessCode: true */

// Yith Library web client
// Copyright (C) 2012 - 2013  Alejandro Blanco <alejandro.b.e@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

(function () {
    "use strict";

    // TODO this should be part of the loading process
    $.ajax("/token", {
        success: function (data, textStatus, XHR) {
            window.yithAccessCode = data.access_code;
//             Yith.setProgressBar(70);
//             callback();
        },
        error: function (XHR, textStatus, errorThrown) {
            $("#error").find(".access").removeClass("hide");
            $("#error").modal({ keyboard: false, backdrop: "static" });
            setTimeout(function () {
                window.open("/", "_self");
            }, 4000);
        }
    });

    window.Yith = Ember.Application.create();

    Yith.Router.map(function() {
        this.resource('secret',  function () {
            this.route('new');
        });
    });

    Yith.ApplicationController = Ember.Controller.extend({
        initialized: false
    });

    Yith.IndexController = Ember.ArrayController.extend({
        appName: 'Yith Library web client'
    });
}());
