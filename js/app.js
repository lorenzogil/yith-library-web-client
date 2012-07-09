/*jslint vars: false, browser: true */
/*global Em */

var Yith = Em.Application.create();

Yith.passwordList = [];

Yith.Password = Em.Object.extend({
    service: null,
    account: null,
    password: null,
    expiration: false,
    notes: null,
    tags: []
});

Yith.ListPassordsView = Em.View.extend({
    passwordList: Yith.passwordList
});

Yith.passwordList.push(Yith.Password.create({
    service: "Nyarly",
    account: "Cultist",
    password: "this_should_be_ciphered"
}));

Yith.passwordList.push(Yith.Password.create({
    service: "Cthulhu",
    account: "Cultist",
    password: "this_should_be_ciphered"
}));

Yith.passwordList.push(Yith.Password.create({
    service: "Yog",
    account: "Cultist",
    password: "this_should_be_ciphered"
}));

Yith.passwordList.push(Yith.Password.create({
    service: "Hastur",
    account: "Cultist",
    password: "this_should_be_ciphered"
}));

