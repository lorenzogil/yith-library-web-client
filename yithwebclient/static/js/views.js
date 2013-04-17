/*jslint browser: true, nomen: true */
/*global Ember, $, Yith */

// Yith Library web client
// Copyright (C) 2012 - 2013  Alejandro Blanco <alejandro.b.e@gmail.com>
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


(function () {
    "use strict";

    if (window.Yith === undefined) {
        window.Yith = Ember.Application.create();
    }

    Yith.PasswordListView = Ember.View.extend({
        templateName: "password-list",

        passwordListClass: Ember.computed(function () {
            if (this.passwordList.length > 0) {
                return "span12";
            }
            return "hide";
        }).property("passwordList"),

        noPasswordsClass: Ember.computed(function () {
            if (this.initialized && this.passwordList.length === 0) {
                return "span6 offset3";
            }
            return "hide";
        }).property("initialized", "passwordList"),

        getPassword: function (evt) {
            Yith.askMasterPassword(function (masterPassword) {
                var secret = evt.context.get("secret"),
                    node = $(evt.target),
                    countdown = node.next().next(),
                    close = countdown.next(),
                    timer;
                try {
                    secret = Yith.decipher(masterPassword, secret);
                } catch (err) {
                    return false;
                }
                masterPassword = null;
                node.next().val(secret).show().focus().select();
                secret = null;

                if (Yith.settings.get("disableCountdown")) {
                    close.off("click");
                    close.click(function (evt) {
                        node.next().hide().attr("value", "");
                        close.hide();
                    });
                    close.show();
                } else {
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
                }
                return true;
            });
        },

        filterByTag: function (evt) {
            // TODO controller.activateFilter($(evt.target).text());
        },

        removeFilter: function (evt) {
            var target = evt.target;
            if (target.tagName === "I") {
                target = target.parentNode;
            }
            // TODO controller.deactivateFilter($(target).text().trim());
        },

        notes: function (evt) {
            var node = $(evt.target),
                _id,
                passwordList,
                password,
                content;

            if (node.data().popover === undefined) {
                _id = node.parent().parent().attr("id");
                passwordList = Yith.listPasswdView.get("passwordList");
                password = passwordList.filter(function (item) {
                    return item.get("_id") === _id;
                })[0];
                content = password.get("notes");

                if (content !== "" && content !== null) {
                    node.popover({
                        placement: "left",
                        content: content,
                        title: password.get("service"),
                        trigger: "hover"
                    });
                    node.popover("show");
                }
            }
        },

        edit: function (evt) {
            var password = evt.context;
            Yith.initEditModal();
            password.set("provisionalTags", password.get("tags"));
            Yith.editView.set("password", password);
            Yith.editView.set("isnew", false);
            Yith.editView.set("isExpirationDisabled", password.get("expiration") <= 0);
            Yith.editModal.modal("show");
        }
    });

}());
