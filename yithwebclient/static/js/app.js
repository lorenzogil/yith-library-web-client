/*jslint vars: false, browser: true, nomen: true */
/*global Ember, $, sjcl, yithServerHost */

// Yith Library web client
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

var Yith = Ember.Application.create();

// ******
// MODELS
// ******

Yith.Password = Ember.Object.extend({
    id: -1,
    _id: null,
    service: null,
    account: null,
    secret: null,
    creation: null,
    last_modification: null,
    expiration: 0,
    notes: null,
    tags: [],
    provisionalTags: [],

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
                "last_modification", "expiration", "notes", "tags"),

    daysLeft: Ember.computed(function () {
        "use strict";
        // One day milliseconds: 86400000
        var now = (new Date()).getTime(),
            diff = now - this.creation,
            diffDays = Math.round(diff / 86400000);

        return this.expiration - diffDays;
    }).property("creation", "expiration")
});

// *****
// VIEWS
// *****

Yith.ListPasswordsView = Ember.View.extend({
    templateName: "password-list",
    passwordList: [],

    allTags: Ember.computed(function () {
        "use strict";
        var allTags = new Ember.Set();
        this.passwordList.forEach(function (item) {
            allTags.addEach(item.get("tags"));
        });
        return allTags;
    }).property("passwordList"),

    getPassword: function (evt) {
        "use strict";
        Yith.askMasterPassword(function (masterPassword) {
            var secret = evt.context.get("secret"),
                node = $(evt.target),
                countdown = node.next().next(),
                timer;
            try {
                secret = Yith.decipher(masterPassword, secret);
            } catch (err) {
                return false;
            }
            masterPassword = null;
            node.next().val(secret).show().focus().select();
            secret = null;

            countdown.text("5");
            countdown.show();
            timer = setInterval(function () {
                countdown.text(parseInt(countdown.text(), 10) - 1);
            }, 1000);
            setTimeout(function () {
                clearInterval(timer);
                node.next().hide().attr("value", "");
                countdown.hide();
            }, 5500);
            return true;
        });
    },

    notes: function (evt) {
        "use strict";
        var notes = evt.context.get("notes");

        if (typeof Yith.notesModal === "undefined") {
            Yith.notesModal = $("#notes");
            Yith.notesModal.modal({ show: false });
        }
        Yith.notesModal.find("p.viewport").text(notes);
        Yith.notesModal.modal("show");
    },

    edit: function (evt) {
        "use strict";
        var password = evt.context;
        Yith.initEditModal();
        password.set("provisionalTags", password.get("tags"));
        Yith.editView.set("password", password);
        Yith.editView.set("isnew", false);
        Yith.editView.set("isExpirationDisabled", password.get("expiration") <= 0);
        Yith.editModal.modal("show");
    }
});

Yith.EditPasswordView = Ember.View.extend({
    templateName: "password-edit",
    password: null,
    isnew: false,
    isExpirationDisabled: false,

    isExpirationEnabled: Ember.computed(function () {
        "use strict";
        return !this.get("isExpirationDisabled");
    }).property("isExpirationDisabled"),

    validateSecret: function (evt) {
        "use strict";
        var equal = $("#edit-secret1").val() === $("#edit-secret2").val();

        if ($("#edit-secret1").val() !== "") {
            $("#edit-secret1").parent().parent().removeClass("error");
            $("#edit-secret1").parent().parent().find(".help-block.req").hide();
        }

        if (equal) {
            $("#edit-secret1").parent().parent().removeClass("error");
            $("#edit-secret1").parent().parent().find(".help-block.match").hide();
        } else {
            $("#edit-secret1").parent().parent().addClass("error");
            $("#edit-secret1").parent().parent().find(".help-block.match").show();
        }

        return equal;
    },

    enableExpiration: function (evt) {
        "use strict";
        var enable = evt.target.checked;
        Yith.editView.set("isExpirationDisabled", !enable);
    },

    addTag: function (evt) {
        "use strict";
        evt.stopPropagation();
        evt.preventDefault();

        var tag = $("#edit-tags").val(),
            password = evt.context.get("password"),
            provisionalTags = Yith.cloneList(password.get("provisionalTags"));

        provisionalTags.push(tag);
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
                return item.get("id") !== password.get("id");
            }
        ));
        password.destroy();
        Yith.ajax.deletePassword(password);
        Yith.editModal.modal("hide");
    },

    checkEmptiness: function (evt) {
        "use strict";
        if ($("#edit-service").val() !== "") {
            $("#edit-service").parent().removeClass("error");
            $("#edit-service").next().hide();
        }
    },

    validateForm: function () {
        "use strict";
        var valid = true,
            aux;

        if (this.isnew) {
            valid = valid && this.validateSecret();
            aux = $("#edit-secret1").val() !== "";
            if (!aux) {
                $("#edit-secret1").parent().parent().addClass("error");
                $("#edit-secret1").parent().parent().find(".help-block.req").show();
            }
            valid = valid && aux;
        }

        aux = $("#edit-service").val() !== "";
        if (!aux) {
            $("#edit-service").parent().addClass("error");
            $("#edit-service").next().show();
        }
        valid = valid && aux;

        if (!valid) {
            throw "Not valid";
        }
    }
});

// *********
// UTILITIES
// *********

Yith.initEditModal = function () {
    "use strict";
    if (typeof Yith.editModal === "undefined") {
        Yith.editModal = $("#edit");
        Yith.editModal.modal({ show: false, keyboard: false });
        Yith.editModal.on("shown", function (evt) {
            var tags = Yith.listPasswdView.get("allTags");
            $("#edit-tags").typeahead({
                items: 3
            });
            // Force update on typehead source array
            $("#edit-tags").data("typeahead").source = tags.copy();
        });
        Yith.editModal.on("hidden", function (evt) {
            $("#edit-secret1").attr("value", "");
            $("#edit-secret2").attr("value", "");
        });
    }
};

Yith.addNewPassword = function () {
    "use strict";
    var now = new Date();
    Yith.initEditModal();
    Yith.editView.set("password", Yith.Password.create({
        id: Yith.getNewID(),
        creation: now.getTime(),
        last_modification: now.getTime()
    }));
    Yith.editView.set("isnew", true);
    Yith.editView.set("isExpirationDisabled", true);
    Yith.editModal.modal("show");
};

Yith.saveChangesInPassword = function (password, savePassword, callback) {
    "use strict";
    var enableExpiration = $("#edit-enable-expiration:checked").length > 0,
        now = new Date(),
        secret,
        expiration;

    password.set("service", $("#edit-service").val());
    password.set("account", $("#edit-account").val());
    password.set("last_modification", now.getTime());
    if (enableExpiration) {
        expiration = password.get("creation") + (password.get("expiration") * 86400000);
        expiration = Math.round((expiration - now.getTime()) / 86400000);
        expiration = parseInt($("#edit-expiration").val(), 10) - expiration;
        password.set("expiration", expiration);
    } else {
        password.set("expiration", 0);
    }
    password.set("notes", $("#edit-notes").val());
    password.set("tags", password.get("provisionalTags"));

    if (savePassword) {
        Yith.askMasterPassword(function (masterPassword) {
            secret = $("#edit-secret1").val();
            secret = Yith.cipher(masterPassword, secret);
            password.set("secret", secret);
            secret = null;
            masterPassword = null;
            callback();
            return true;
        });
    } else {
        callback();
    }
};

Yith.getNewID = function () {
    "use strict";
    var max = -1;
    Yith.listPasswdView.get("passwordList").forEach(function (item, idx, self) {
        if (item.get("id") > max) {
            max = item.get("id");
        }
    });
    return max + 1;
};

Yith.cloneList = function (list) {
    "use strict";
    var newlist = [];
    list.forEach(function (item) {
        newlist.push(item);
    });
    return newlist;
};

Yith.cipher = function (masterPassword, secret) {
    "use strict";
    var result = sjcl.encrypt(masterPassword, secret);
    masterPassword = null;
    return result;
};

Yith.decipher = function (masterPassword, cipheredSecret) {
    "use strict";
    var result = null;
    if (cipheredSecret !== null) {
        result = sjcl.decrypt(masterPassword, cipheredSecret);
    }
    masterPassword = null;
    return result;
};

Yith.askMasterPassword = function (callback) {
    "use strict";
    if (typeof Yith.masterModal === "undefined") {
        Yith.masterModal = $("#master");
        Yith.masterModal.modal({
            show: false,
            keyboard: false
        });
        $("#master-password").keypress(function () {
            $("#master-error").hide();
        });
        Yith.masterModal.on("shown", function (evt) {
            var backdrops = $(".modal-backdrop"),
                backdrop = $(backdrops[backdrops.length - 1]);

            backdrop.unbind("click");
            backdrop.css("z-index", 1060);
            $("#master-error").hide();
            $("#master-password").focus();
        });
        Yith.masterModal.on("hidden", function (evt) {
            $("#master-password").attr("value", "");
        });
    }
    $("#master-done").unbind("click");
    $("#master-done").click(function () {
        var success = callback($("#master-password").val());
        if (success) {
            Yith.masterModal.modal("hide");
        } else {
            $("#master-error").show();
        }
    });
    Yith.masterModal.modal("show");
};

// ****
// AJAX
// ****

Yith.ajax = {};

Yith.ajax.host = yithServerHost + "/passwords";

Yith.ajax.getAccessToken = function (callback) {
    "use strict";
    $.getJSON("/token", function (data) {
        Yith.ajax.accessCode = data.access_code;
        callback();
    });
};

Yith.ajax.getPasswordList = function () {
    "use strict";
    $.ajax(Yith.ajax.host, {
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + Yith.ajax.accessCode
        },
        success: function (data) {
            data.forEach(function (item) {
                var password = Yith.Password.create(item),
                    passwordList = Yith.cloneList(Yith.listPasswdView.get("passwordList"));
                passwordList.push(password);
                Yith.listPasswdView.set("passwordList", passwordList);
            });
        }
    });
};

Yith.ajax.createPassword = function (password) {
    "use strict";
    $.ajax(Yith.ajax.host, {
        type: "POST",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + Yith.ajax.accessCode
        },
        data: password.get("json")
    });
};

Yith.ajax.updatePassword = function (password) {
    "use strict";
    var _id = password.get("_id");
    $.ajax(Yith.ajax.host + '/' + _id, {
        data: password.get("json"),
        dataType: "json",
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + Yith.ajax.accessCode
        }
    });
};

Yith.ajax.deletePassword = function (password) {
    "use strict";
    var _id = password.get("_id");
    $.ajax(Yith.ajax.host + '/' + _id, {
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + Yith.ajax.accessCode
        }
    });
};

// **************
// INITIALIZATION
// **************

$(document).ready(function () {
    "use strict";

    // **********
    // INIT VIEWS
    // **********

    Yith.listPasswdView = Yith.ListPasswordsView.create().appendTo("#page");

    Yith.editView = Yith.EditPasswordView.create().appendTo("#edit");

    // *********
    // LOAD DATA
    // *********

    Yith.ajax.getAccessToken(Yith.ajax.getPasswordList);
});
