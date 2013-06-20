/*jslint browser: true */
/*global Ember, $, Yith */

// Yith Library web client
// Copyright (C) 2012 - 2013  Alejandro Blanco <alejandro.b.e@gmail.com>
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

(function () {
    "use strict";

    Yith.PasswordController = Ember.Controller.extend({
//         provisionalTags: [],
//
//         daysLeft: Ember.computed(function () {
//             // One day milliseconds: 86400000
//             var now = (new Date()).getTime(),
//                 diff = now - this.creation,
//                 diffDays = Math.round(diff / 86400000);
//
//             return this.expiration - diffDays;
//         }).property("creation", "expiration"),
//
//         expirationClass: Ember.computed(function () {
//             var cssClass = "badge ";
//
//             if (this.get("daysLeft") > 30) {
//                 cssClass += "badge-success";
//             } else if (this.get("daysLeft") > 7) {
//                 cssClass += "badge-warning";
//             } else {
//                 cssClass += "badge-important";
//             }
//
//             return cssClass;
//         }).property("daysLeft"),
//
    });

    Yith.PasswordsIndexController = Ember.ArrayController.extend({
        activeFilters: [],

        processedPasswordList: Ember.computed(function () {
            var filters = this.activeFilters,
                result;

            result = this.toArray().sort(function (pass1, pass2) {
                var a = pass1.get("service").toLowerCase(),
                    b = pass2.get("service").toLowerCase(),
                    result = 0;

                if (a > b) {
                    result = 1;
                } else if (a < b) {
                    result = -1;
                }

                return result;
            });

            if (filters.length > 0) {
                result = result.filter(function (password) {
                    var tags = password.get("tags");
                    tags = tags || [];
                    return filters.every(function (f) {
                        return tags.some(function (t) {
                            return f === t;
                        });
                    });
                });
            }

            return result;
        }).property("@each", "activeFilters.@each"),

        allTags: Ember.computed(function() {
            var allTags = new Ember.Set();
            this.forEach(function (password) {
                var tags = password.get("tags");
                if (tags !== undefined) {
                    allTags.addEach(tags);
                }
            });
            allTags = allTags.toArray().sort(function (a, b) {
                return a.localeCompare(b);
            });
            return allTags;
        }).property("@each.tags"),

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
}());
