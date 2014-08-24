/*jslint browser: true */
/*global Ember, Yith */

// Yith Library web client
// Copyright (C) 2012 - 2014  Alejandro Blanco <alejandro.b.e@gmail.com>
// Copyright (C) 2012  Yaco Sistemas S.L.
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

(function (Yith, Ember) {
    "use strict";

    Yith.ControllersUtils = {
        oneDayInMilliseconds: 86400000,

        daysLeft: function (creation, expiration) {
            var now = (new Date()).getTime(),
                diff = now - creation,
                diffDays = Math.round(diff / Yith.ControllersUtils.oneDayInMilliseconds);

            return expiration - diffDays;
        }
    };

    Yith.PasswordInListController = Ember.ObjectController.extend({
        daysLeft: Ember.computed("creation", "expiration", function () {
            return Yith.ControllersUtils.daysLeft(this.get("creation"), this.get("expiration"));
        }),

        expirationClass: Ember.computed("daysLeft", function () {
            var cssClass = "badge ",
                daysLeft = this.get("daysLeft");

            if (daysLeft > 30) {
                cssClass += "badge-success";
            } else if (daysLeft > 7) {
                cssClass += "badge-warning";
            } else {
                cssClass += "badge-important";
            }

            return cssClass;
        })
    });

    Yith.PasswordsIndexController = Ember.ArrayController.extend({
        activeFilters: [],

        processedPasswordList: Ember.computed("@each", "activeFilters.@each", function () {
            var filters = this.activeFilters,
                that = this,
                result;

            result = this.toArray().sort(function (pass1, pass2) {
                var a = pass1.get("service"),
                    b = pass2.get("service"),
                    order = 0;

                if (!a) { return -1; }
                if (!b) { return 1; }

                a = a.toLowerCase();
                b = b.toLowerCase();

                if (a > b) {
                    order = 1;
                } else if (a < b) {
                    order = -1;
                }

                return order;
            });

            if (filters.length > 0) {
                result = result.filter(function (password) {
                    var tags = password.get("tags");
                    tags = tags || [];
                    return filters.every(function (f) {
                        return tags.some(function (t) {
                            return f.trim() === t.trim();
                        });
                    });
                });
            }

            return result.map(function (password) {
                var controller = Yith.PasswordInListController.create();
                controller.set("model", password);
                controller.set("container", that.container);
                controller.set("list_controller", that);
                return controller;
            });
        }),

        allTags: Ember.computed("@each.tags", function () {
            var allTags = new Ember.Set();
            this.forEach(function (password) {
                var tags = password.get("tags");
                if (tags !== undefined && tags !== null) {
                    allTags.addEach(tags);
                }
            });
            allTags = allTags.toArray().sort(function (a, b) {
                return a.localeCompare(b);
            });
            return allTags;
        }),

        activateFilter: function (filter) {
            var filters = new Ember.Set(this.activeFilters);
            filters.push(filter);
            this.set("activeFilters", filters.toArray());
        },

        deactivateFilter: function (filter) {
            var filters = new Ember.Set(this.activeFilters);
            filters.remove(filter);
            this.set("activeFilters", filters.toArray());
        }
    });
}(Yith, Ember));
