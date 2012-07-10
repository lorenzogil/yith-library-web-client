/*jslint vars: false, browser: true, nomen: true */
/*global Em, $, sjcl */

var Yith = Em.Application.create();

// ******
// MODELS
// ******

Yith.Password = Em.Object.extend({
    id: -1,
    _id: null,
    service: null,
    account: null,
    secret: null,
    expiration: 0,
    notes: null,
    tags: [],
    provisionalTags: []
});

// *****
// VIEWS
// *****

Yith.ListPasswordsView = Em.View.extend({
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

Yith.EditPasswordView = Em.View.extend({
    templateName: "password-edit",
    password: null,
    isnew: false,
    isExpirationDisabled: false,

    isExpirationEnabled: Em.computed(function () {
        "use strict";
        return !this.get("isExpirationDisabled");
    }).property("isExpirationDisabled"),

    decipheredSecret: Em.computed(function () {
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
        Yith.editModal.modal("hide");
    },

    createPassword: function (evt) {
        "use strict";
        var password = evt.view.get("password"),
            passwordList = Yith.cloneList(Yith.listPasswdView.get("passwordList"));

        Yith.saveChangesInPassword(password);
        passwordList.push(password);
        Yith.listPasswdView.set("passwordList", passwordList);
        Yith.editModal.modal("hide");
    },

    deletePassword: function (evt) {
        "use strict";
        var password = evt.view.get("password");

        Yith.listPasswdView.set("passwordList", Yith.listPasswdView.get("passwordList").filter(function (item, idx, self) {
            return item.get("id") !== password.get("id");
        }));
        password.destroy();
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

// **********
// INIT VIEWS
// **********

Yith.listPasswdView = Yith.ListPasswordsView.create().appendTo("#page");

Yith.editView = Yith.EditPasswordView.create().appendTo("#edit");

// *********************************************************

Yith.listPasswdView.get("passwordList").push(Yith.Password.create({
    id: 0,
    service: "Nyarly",
    account: "Cultist",
    expiration: 200
}));

Yith.listPasswdView.get("passwordList").push(Yith.Password.create({
    id: 1,
    service: "Cthulhu",
    account: "cultist@rlyeh.com",
    tags: ["scary"],
    notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae erat tortor, ac tincidunt felis. Donec ac libero nunc, eget semper ante. Sed at sapien tellus, nec porttitor nisl. Integer consectetur, risus scelerisque tempus tincidunt, nibh metus sagittis eros, non interdum magna ligula vitae massa. Vestibulum gravida vestibulum diam. Donec sodales, nisi quis ultrices tincidunt, metus turpis scelerisque odio, at feugiat justo urna quis urna. Nullam blandit vehicula urna et vestibulum. Maecenas viverra sem at mauris tincidunt eu laoreet sem ultricies. Cras tincidunt sagittis massa, quis ultricies orci rhoncus ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed nunc turpis, consequat eget lacinia pretium, volutpat ac ante. Fusce euismod est ac sapien posuere tristique dignissim justo vehicula. Suspendisse tristique mollis purus, quis vulputate odio ullamcorper id."
}));

Yith.listPasswdView.get("passwordList").push(Yith.Password.create({
    id: 2,
    service: "Yog",
    account: "Cultist",
    secret: '{"iv":"E7W8jXE6KRxef8+LncwsfA","v":1,"iter":1000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"0X1758AMhE4","ct":"qgVhOmUj0fldZULnH4GEjLmCfQ"}',
    tags: ["dimension"]
}));

Yith.listPasswdView.get("passwordList").push(Yith.Password.create({
    id: 3,
    service: "Hastur",
    account: "Cultist",
    tags: ["unspeakable", "scary"]
}));

