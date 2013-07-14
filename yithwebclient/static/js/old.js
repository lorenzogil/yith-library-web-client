/*jslint browser: true, nomen: true */
/*global Ember, $, sjcl, yithServerHost, yithClientId */

// Yith Library web client
// Copyright (C) 2012  Yaco Sistemas S.L.
// Copyright (C) 2012  Alejandro Blanco
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

// *****
// VIEWS
// *****

Yith.EditPasswordView = Ember.View.extend({
    addTag: function (evt) {
        "use strict";
        evt.stopPropagation();
        evt.preventDefault();

        var tags = $("#edit-tags").val().split(','),
            password = evt.context.get("password"),
            provisionalTags = Yith.cloneList(password.get("provisionalTags"));

        tags.forEach(function (tag) {
            tag = tag.trim();
            if (tag !== "" && provisionalTags.indexOf(tag) < 0) {
                provisionalTags.push(tag);
            }
        });
        password.set("provisionalTags", provisionalTags);
        $("#edit-tags").val("");
    },

    removeTag: function (evt) {
        "use strict";
        var password = evt.view.get("password"),
            provisionalTags = password.get("provisionalTags");

        provisionalTags = provisionalTags.filter(function (item, idx, self) {
            return item !== evt.context;
        });
        password.set("provisionalTags", provisionalTags);
    },

    deletePassword: function (evt) {
        "use strict";
        var password = evt.view.get("password");

        Yith.listPasswdView.set("passwordList", Yith.listPasswdView.get("passwordList").filter(
            function (item, idx, self) {
                return item.get("_id") !== password.get("_id");
            }
        ));
        password.destroy();
        Yith.ajax.deletePassword(password);
        Yith.editModal.modal("hide");
    }
});

// *********
// UTILITIES
// *********

Yith.changeMasterPassword = function () {
    "use strict";
    var passwordList = Yith.listPasswdView.get("passwordList");
    if (passwordList.length > 0) {
        Yith.askMasterPassword(function (masterPassword, newMasterPassword) {
            try {
                Yith.decipher(masterPassword, passwordList[0].get("secret"));
            } catch (err) {
                return false;
            }
            passwordList.forEach(function (password) {
                var secret = Yith.decipher(masterPassword, password.get("secret"));
                secret = Yith.cipher(newMasterPassword, secret, true);
                password.set("secret", secret);
                secret = null;
                Yith.ajax.updatePassword(password);
            });
            masterPassword = null;
            newMasterPassword = null;
            return true;
        }, true);
    }
};

// ****
// AJAX
// ****

Yith.ajax = {};
        error: function (XHR, textStatus, errorThrown) {
            $("#error").modal({ keyboard: false, backdrop: "static" });
            $("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
