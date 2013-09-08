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

    Yith.Password = DS.Model.extend({
        account: DS.attr(),
        creation: DS.attr(),
        expiration: DS.attr(),
        lastModification: DS.attr(),
        notes: DS.attr(),
        owner: DS.attr(),
        secret: DS.attr(),
        service: DS.attr(),
        tags: DS.attr()
    });

    Yith.PasswordAdapter = DS.RESTAdapter.extend({
        host: yithServerHost,
        ajax: function (url, type, hash) {
            // Prepare the adapter for the oAuth stuff
            url += "?client_id=" + yithClientId;
            if (hash === undefined) {
                hash = {};
            }
            hash.headers = {
                "Authorization": "Bearer " + yithAccessCode
            };
            return this._super(url, type, hash);
        },

        didError: function() {
            $("#error").modal({ keyboard: false, backdrop: "static" });
            $("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
            this._super.apply(this, arguments);
        }
    });
}());
