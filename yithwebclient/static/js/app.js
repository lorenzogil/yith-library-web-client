/*jslint browser: true */
/*global Ember, Yith: true */

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

window.Yith = Ember.Application.create();

(function (Yith, Ember) {
    "use strict";
    // Wait until we have the access code
    Yith.deferReadiness();

    Yith.Router.map(function () {
        this.resource('passwords', { path: '/' }, function () {
            this.route('new');
            this.route('edit', { path: ':password_id' });
        });
    });

    Yith.PasswordsIndexRoute = Ember.Route.extend({
        model: function () {
            return this.store.find('password');
        }
    });

    Yith.PasswordsNewRoute = Ember.Route.extend({
        model: function () {
            return this.store.createRecord('password');
        }
    });

    Yith.PasswordsEditRoute = Ember.Route.extend({
        model: function (params) {
            return this.store.find('password', params.password_id);
        },

        enter: function () {
            var controller = this.get("controller");
            if (controller) {
                // If the controller has already been created then it's
                // possible that it is showing the modify-secret controls
                controller.set("modifySecret", false);
            }
        }
    });

    // INITIALIZATION CODE
    Ember.$(document).ready(function () {
        var creditsModal,
            setProgressBar;

        setProgressBar = function (width) {
            Ember.$("#loading .progress .bar").css("width", width + "%");
        };

        Ember.$.ajax("/token", {
            success: function (data) {
                window.yithAccessCode = data.access_code;
                setProgressBar(100);
                Yith.advanceReadiness();
                Ember.$("#loading").remove();
            },
            error: function () {
                Ember.$("#error").find(".access").removeClass("hide");
                Ember.$("#error").modal({ keyboard: false, backdrop: "static" });
                setTimeout(function () {
                    window.open("/", "_self");
                }, 4000);
            }
        });

        creditsModal = Ember.$("#credits");
        creditsModal.modal({ show: false });
        Ember.$("#creditsButton").click(function () {
            creditsModal.modal("show");
        });

        setProgressBar(60);
    });
}(Yith, Ember));
