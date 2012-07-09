/*jslint vars: false, browser: true */
/*global Em */

var Yith = Em.Application.create();

Yith.passwordList = [];

Yith.Password = Em.Object.extend({
    service: null,
    account: null,
    secret: null,
    expiration: 0,
    notes: null,
    tags: []
});

Yith.ListPassordsView = Em.View.extend({
    passwordList: Yith.passwordList
});

Yith.passwordList.push(Yith.Password.create({
    service: "Nyarly",
    account: "Cultist",
    secret: "this_should_be_ciphered"
}));

Yith.passwordList.push(Yith.Password.create({
    service: "Cthulhu",
    account: "Cultist",
    secret: "this_should_be_ciphered",
    tags: ["scary"]
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

