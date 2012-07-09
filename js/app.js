/*jslint vars: false, browser: true, nomen: true */
/*global Em, $ */

var Yith = Em.Application.create();

Yith.passwordList = [];

Yith.Password = Em.Object.extend({
    _id: null,
    service: null,
    account: null,
    secret: null,
    expiration: 0,
    notes: null,
    tags: []
});

Yith.ListPasswordsView = Em.View.extend({
    templateName: "password-list",
    passwordList: Yith.passwordList,

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

        if (typeof Yith.editModal === "undefined") {
            Yith.editModal = $("#edit");
            Yith.editModal.modal({ show: false });
        }
        Yith.editView.set("password", password);
        Yith.editView.set("isnew", false);
        // Call rerender because the properties are dom nodes attributes and
        // the unbound helper is involved
        Yith.editView.rerender();
        Yith.editModal.modal("show");
    }
});

Yith.ListPasswordsView.create().appendTo("#page");

Yith.EditPasswordView = Em.View.extend({
    templateName: "password-edit",
    password: null,
    isnew: false
});

Yith.editView = Yith.EditPasswordView.create().appendTo("#edit-body");

// *********************************************************

Yith.passwordList.push(Yith.Password.create({
    service: "Nyarly",
    account: "Cultist",
    secret: "this_should_be_ciphered"
}));

Yith.passwordList.push(Yith.Password.create({
    service: "Cthulhu",
    account: "cultist@rlyeh.com",
    secret: "this_should_be_ciphered",
    tags: ["scary"],
    notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae erat tortor, ac tincidunt felis. Donec ac libero nunc, eget semper ante. Sed at sapien tellus, nec porttitor nisl. Integer consectetur, risus scelerisque tempus tincidunt, nibh metus sagittis eros, non interdum magna ligula vitae massa. Vestibulum gravida vestibulum diam. Donec sodales, nisi quis ultrices tincidunt, metus turpis scelerisque odio, at feugiat justo urna quis urna. Nullam blandit vehicula urna et vestibulum. Maecenas viverra sem at mauris tincidunt eu laoreet sem ultricies. Cras tincidunt sagittis massa, quis ultricies orci rhoncus ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed nunc turpis, consequat eget lacinia pretium, volutpat ac ante. Fusce euismod est ac sapien posuere tristique dignissim justo vehicula. Suspendisse tristique mollis purus, quis vulputate odio ullamcorper id."
}));

Yith.passwordList.push(Yith.Password.create({
    service: "Yog",
    account: "Cultist",
    secret: "this_should_be_ciphered",
    tags: ["dimension"]
}));

Yith.passwordList.push(Yith.Password.create({
    service: "Hastur",
    account: "Cultist",
    secret: "this_should_be_ciphered",
    tags: ["unspeakable", "scary"]
}));

