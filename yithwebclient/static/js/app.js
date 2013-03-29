/*jslint browser: true */
/*global Ember, $ */

// Yith Library web client
// Copyright (C) 2013  Alejandro Blanco <alejandro.b.e@gmail.com>
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

    if (window.Yith === undefined) {
        window.Yith = Ember.Application.create();
    }

    Yith.ApplicationRoute = Ember.Route.extend({
        setupController: function (controller) {
            // `controller` is the instance of ApplicationController
            controller.set('title', "Hello world!");
        }
    });

    Yith.ApplicationController = Ember.Controller.extend({
        appName: 'Yith Library web client'
    });
}())
