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

    Yith.Password = Ember.Object.extend({
        _id: null,
        service: null,
        account: null,
        secret: null,
        creation: null,
        last_modification: null,
        expiration: 0,
        notes: null,
        tags: [],

        json: Ember.computed(function () {
            "use strict";
            var result = {};
            if (this._id !== null) {
                result._id = this._id;
            }
            result.service = this.service;
            result.account = this.account;
            result.secret = this.secret;
            result.creation = this.creation;
            result.last_modification = this.last_modification;
            result.expiration = this.expiration;
            result.notes = this.notes;
            result.tags = this.tags;
            return JSON.stringify(result);
        }).property("_id", "service", "account", "secret", "creation",
                    "last_modification", "expiration", "notes", "tags")
    });
}())
