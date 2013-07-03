/*jslint browser: true, nomen: true */
/*global Ember, $, Yith, DS, yithServerHost, yithClientId, yithAccessCode */

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

    var YithRESTAdapter = DS.RESTAdapter.extend({
            url: yithServerHost,
            ajax: function (url, type, hash) {
                // Prepare the adapter for the oAuth stuff
                url += "?client_id=" + yithClientId;
                hash.headers = {
                    "Authorization": "Bearer " + yithAccessCode
                };
                return this._super(url, type, hash);
            }
        }),
        adapter;

    adapter = YithRESTAdapter.create({});
    adapter.registerTransform("stringarray", {
        serialize: function (value) { return value; },
        deserialize: function (value) { return value; }
    });

    Yith.Store = DS.Store.extend({
        adapter: adapter
    });

    Yith.Password = DS.Model.extend({
        account: DS.attr("string"),
        creation: DS.attr("number"),
        expiration: DS.attr("number"),
        lastModification: DS.attr("number"),
        notes: DS.attr("string"),
        owner: DS.attr("string"),
        secret: DS.attr("string"),
        service: DS.attr("string"),
        tags: DS.attr("stringarray")
    });
}());
