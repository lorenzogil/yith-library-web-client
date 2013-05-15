/*jslint browser: true, nomen: true */
/*global Ember, $, Yith, sjcl */

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

    Yith.ViewsUtils = {
        askMasterPassword: function (callback, changeMaster) {
            var firstTime = Yith.ViewsUtils.masterModal === undefined,
                $master,
                $newMaster;

            // Initialize the modal only once
            if (firstTime) {
                Yith.ViewsUtils.masterModal = $("#master");
                Yith.ViewsUtils.masterModal.modal({
                    show: false
                });
            }

            $master = Yith.ViewsUtils.masterModal.find("#master-password");
            $newMaster = Yith.ViewsUtils.masterModal.find("#new-master-password");

            if (firstTime) {
                $master.keypress(function (evt) {
                    var code = (evt.keyCode || evt.which);
                    Yith.ViewsUtils.masterModal.find("#master-error").hide();
                    if (code === 13) { // The "Enter" key
                        Yith.ViewsUtils.masterModal.find("#master-done").trigger("click");
                    }
                });

                Yith.ViewsUtils.masterModal.on("shown", function (evt) {
                    Yith.ViewsUtils.masterModal.find("#master-error").hide().end()
                                               .find("#master-password").focus();
                });

                Yith.ViewsUtils.masterModal.on("hidden", function (evt) {
                    $master.val("");
                    $newMaster.val("");
                });
            }

            Yith.ViewsUtils.masterModal.find("#master-done")
                .off("click")
                .on("click", function () {
                    var success = callback(
                        $master.val(),
                        $newMaster.val()
                    );

                    if (success) {
                        if (Yith.settings.get("rememberMaster") && $master.val() !== "") {
                            Yith.settings.set("masterPassword", $master.val());
                            setTimeout(function () {
                                Yith.settings.set("masterPassword", undefined);
                            }, 300000); // 5 min
                        }
                        Yith.ViewsUtils.masterModal.modal("hide");
                        $master.val("");
                        $newMaster.val("");
                    } else {
                        Yith.ViewsUtils.masterModal.find("#master-error").show().end()
                                                   .find("#master-password").focus().select();
                    }
                });

            if (changeMaster) {
                Yith.ViewsUtils.masterModal.find(".change-master").show();
            } else {
                Yith.ViewsUtils.masterModal.find(".change-master").hide();
                if (Yith.settings.get("rememberMaster") && Yith.settings.get("masterPassword") !== undefined) {
                    callback(Yith.settings.get("masterPassword"));
                    return;
                }
            }

            Yith.ViewsUtils.masterModal.modal("show");
        },

        decipher: function (masterPassword, cipheredSecret) {
            var result = null;
            if (cipheredSecret !== null) {
                result = sjcl.decrypt(masterPassword, cipheredSecret);
            }
            masterPassword = null;
            return result;
        }
    };

    // GLOBAL VIEWS

    Yith.DisableCountdownButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn"],

        click: function (evt) {
            var $target = $(evt.target);
            $target.toggleClass("active");
            Yith.settings.set("disableCountdown", $target.hasClass("active"));
        }
    });

    Yith.RememberMasterButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn"],

        click: function (evt) {
            var $target = $(evt.target);
            $target.toggleClass("active");
            Yith.settings.set("rememberMaster", $target.hasClass("active"));
            if (!Yith.settings.get("rememberMaster")) {
                Yith.settings.set("masterPassword", undefined);
            }
        }
    });

    Yith.ShowAdvancedButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn"],

        click: function (evt) {
            // TODO
        }
    });

    // LIST PASSWORDS' ITEMS VIEWS

    Yith.ServiceButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn btn-info"],

        click: function (evt) {
            Yith.ViewsUtils.askMasterPassword(function (masterPassword) {
                var $node = $(evt.target).parents("tr"),
                    $input = $node.find("td:first-child input"),
                    $countdown = $node.find("td:first-child span"),
                    $close = $countdown.next(),
                    secret = Yith.Password.find($node.attr("id")),
                    timer;

                try {
                    secret = Yith.ViewsUtils.decipher(masterPassword, secret.get("secret"));
                } catch (err) {
                    return false;
                }
                masterPassword = null;
                $input.val(secret).show().focus().select();
                secret = null;

                if (Yith.settings.get("disableCountdown")) {
                    $close.off("click");
                    $close.click(function (evt) {
                        $input.hide().attr("value", "");
                        $close.hide();
                    });
                    $close.show();
                } else {
                    $countdown.text("5");
                    $countdown.show();
                    timer = setInterval(function () {
                        $countdown.text(parseInt($countdown.text(), 10) - 1);
                    }, 1000);
                    setTimeout(function () {
                        clearInterval(timer);
                        $input.hide().attr("value", "");
                        $countdown.hide();
                    }, 5500);
                }
                return true;
            });
        }
//
//         filterByTag: function (evt) {
//             // TODO controller.activateFilter($(evt.target).text());
//         },
//
//         removeFilter: function (evt) {
//             var target = evt.target;
//             if (target.tagName === "I") {
//                 target = target.parentNode;
//             }
//             // TODO controller.deactivateFilter($(target).text().trim());
//         },
//
//         notes: function (evt) {
//             var node = $(evt.target),
//                 _id,
//                 passwordList,
//                 password,
//                 content;
//
//             if (node.data().popover === undefined) {
//                 _id = node.parent().parent().attr("id");
//                 passwordList = Yith.listPasswdView.get("passwordList");
//                 password = passwordList.filter(function (item) {
//                     return item.get("_id") === _id;
//                 })[0];
//                 content = password.get("notes");
//
//                 if (content !== "" && content !== null) {
//                     node.popover({
//                         placement: "left",
//                         content: content,
//                         title: password.get("service"),
//                         trigger: "hover"
//                     });
//                     node.popover("show");
//                 }
//             }
//         },
//
//         edit: function (evt) {
//             var password = evt.context;
//             Yith.initEditModal();
//             password.set("provisionalTags", password.get("tags"));
//             Yith.editView.set("password", password);
//             Yith.editView.set("isnew", false);
//             Yith.editView.set("isExpirationDisabled", password.get("expiration") <= 0);
//             Yith.editModal.modal("show");
//         }
    });

}());
