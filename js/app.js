/*jslint vars: false, browser: true, nomen: true */
/*global Ember, $, sjcl */

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
        result.expiration = this.expiration;
        result.notes = this.notes;
        result.tags = this.tags;
        return JSON.stringify(result);
    }).property("_id", "service", "account", "secret", "expiration", "notes", "tags")
});

// *****
// VIEWS
// *****

Yith.ListPasswordsView = Ember.View.extend({
    templateName: "password-list",
    passwordList: [],

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

    decipheredSecret: Ember.computed(function () {
        "use strict";
        var password = this.get("password"),
            result = null;
        if (password !== null) {
            result = Yith.decipher(password.get("secret"));
        }
        return result;
    }).property("password"),

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
        var password = evt.view.get("password");

        Yith.saveChangesInPassword(password);
        Yith.ajax.updatePassword(password);
        Yith.editModal.modal("hide");
    },

    createPassword: function (evt) {
        "use strict";
        var password = evt.view.get("password"),
            passwordList = Yith.cloneList(Yith.listPasswdView.get("passwordList"));

        Yith.saveChangesInPassword(password);
        passwordList.push(password);
        Yith.listPasswdView.set("passwordList", passwordList);
        Yith.ajax.createPassword(password);
        Yith.editModal.modal("hide");
    },

    deletePassword: function (evt) {
        "use strict";
        var password = evt.view.get("password");

        Yith.listPasswdView.set("passwordList", Yith.listPasswdView.get("passwordList").filter(function (item, idx, self) {
            return item.get("id") !== password.get("id");
        }));
        password.destroy();
        Yith.ajax.deletePassword(password);
        Yith.editModal.modal("hide");
    }
});

// *********
// UTILITIES
// *********

Yith.initEditModal = function () {
    "use strict";
    if (typeof Yith.editModal === "undefined") {
        Yith.editModal = $("#edit");
        Yith.editModal.modal({ show: false });
        Yith.editModal.on("hidden", function (evt) {
            $("#edit-secret1").attr("value", "");
            $("#edit-secret2").attr("value", "");
        });
    }
};

Yith.addNewPassword = function () {
    "use strict";
    Yith.initEditModal();
    Yith.editView.set("password", Yith.Password.create({
        id: Yith.getNewID()
    }));
    Yith.editView.set("isnew", true);
    Yith.editView.set("isExpirationDisabled", true);
    Yith.editModal.modal("show");
};

Yith.saveChangesInPassword = function (password) {
    "use strict";
    var enableExpiration = $("#edit-enable-expiration:checked").length > 0,
        secret;

    password.set("service", $("#edit-service").val());
    password.set("account", $("#edit-account").val());
    secret = $("#edit-secret1").val();
    secret = Yith.cipher(secret);
    password.set("secret", secret);
    secret = null;
    if (enableExpiration) {
        password.set("expiration", parseInt($("#edit-expiration").val(), 10));
    } else {
        password.set("expiration", 0);
    }
    password.set("notes", $("#edit-notes").val());
    password.set("tags", password.get("provisionalTags"));
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

Yith.cipher = function (secret) {
    "use strict";
    return sjcl.encrypt("password", secret); // TODO improve!!
};

Yith.decipher = function (cipheredSecret) {
    "use strict";
    var result = null;
    if (cipheredSecret !== null) {
        result = sjcl.decrypt("password", cipheredSecret); // TODO improve!
    }
    return result;
};

// ****
// AJAX
// ****

Yith.ajax = {};

Yith.ajax.host = "http://192.168.11.62:6543/passwords/cultist"; // TODO hardcoded!

Yith.ajax.getPasswordList = function () {
    "use strict";
    $.getJSON(Yith.ajax.host, function (data) {
        data.forEach(function (item) {
            var password = Yith.Password.create(item),
                passwordList = Yith.cloneList(Yith.listPasswdView.get("passwordList"));
            passwordList.push(password);
            Yith.listPasswdView.set("passwordList", passwordList);
        });
    });
};

Yith.ajax.createPassword = function (password) {
    "use strict";
    $.post(Yith.ajax.host, password.get("json"));
};

Yith.ajax.updatePassword = function (password) {
    "use strict";
    var _id = password.get("_id");
    $.ajax(Yith.ajax.host + '/' + _id, {
        data: password.get("json"),
        dataType: "json",
        type: "PUT"
    });
};

Yith.ajax.deletePassword = function (password) {
    "use strict";
    var _id = password.get("_id");
    $.ajax(Yith.ajax.host + '/' + _id, { type: "DELETE" });
};

// **********
// INIT VIEWS
// **********

Yith.listPasswdView = Yith.ListPasswordsView.create().appendTo("#page");

Yith.editView = Yith.EditPasswordView.create().appendTo("#edit");

// *********
// LOAD DATA
// *********

Yith.ajax.getPasswordList();
