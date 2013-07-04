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
    secretGroupClass: Ember.computed(function () {
        "use strict";
        var cssClass = "control-group";
        if (!this.isnew) {
            cssClass += " hide";
        }
        return cssClass;
    }).property("isnew"),

    showSecretGroup: function () {
        "use strict";
        $("#secret-group").removeClass("hide");
        $("#modify-secret-group").addClass("hide");
    },

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

    saveChanges: function (evt) {
        "use strict";
        var password = evt.view.get("password"),
            savePassword = ($("#edit-secret1").val() !== "");

        try {
            this.validateForm();
        } catch (err) {
            return;
        }

        Yith.saveChangesInPassword(password, savePassword, function () {
            Yith.ajax.updatePassword(password);
            Yith.editModal.modal("hide");
        });
    },

    createPassword: function (evt) {
        "use strict";
        var password = evt.view.get("password"),
            passwordList = Yith.cloneList(Yith.listPasswdView.get("passwordList"));

        try {
            this.validateForm();
        } catch (err) {
            return;
        }

        Yith.saveChangesInPassword(password, true, function () {
            passwordList.push(password);
            Yith.listPasswdView.set("passwordList", passwordList);
            Yith.ajax.createPassword(password);
            Yith.editModal.modal("hide");
        });
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

Yith.ajax.host = yithServerHost + "/passwords";
Yith.ajax.client_id_suffix = '?client_id=' + yithClientId;

Yith.ajax.createPassword = function (password) {
    "use strict";
    $.ajax(Yith.ajax.host + Yith.ajax.client_id_suffix, {
        type: "POST",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + Yith.ajax.accessCode
        },
        data: password.get("json"),
        success: function (data, textStatus, XHR) {
            password.set("_id", data._id);
        },
        error: function (XHR, textStatus, errorThrown) {
            $("#error").modal({ keyboard: false, backdrop: "static" });
            $("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
        }
    });
};

Yith.ajax.updatePassword = function (password) {
    "use strict";
    var _id = password.get("_id");
    $.ajax(Yith.ajax.host + '/' + _id + Yith.ajax.client_id_suffix, {
        data: password.get("json"),
        dataType: "json",
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + Yith.ajax.accessCode
        },
        error: function (XHR, textStatus, errorThrown) {
            $("#error").modal({ keyboard: false, backdrop: "static" });
            $("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
        }
    });
};

Yith.ajax.deletePassword = function (password) {
    "use strict";
    var _id = password.get("_id");
    $.ajax(Yith.ajax.host + '/' + _id + Yith.ajax.client_id_suffix, {
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + Yith.ajax.accessCode
        },
        error: function (XHR, textStatus, errorThrown) {
            $("#error").modal({ keyboard: false, backdrop: "static" });
            $("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
        }
    });
};
