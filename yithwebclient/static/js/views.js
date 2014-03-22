/*jslint browser: true, nomen: true */
/*global Ember, $, Yith, sjcl, yithServerHost */

// Yith Library web client
// Copyright (C) 2012 - 2014  Alejandro Blanco <alejandro.b.e@gmail.com>
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
        _initMasterPasswordModal: function ($master, $newMaster) {
            var keyHandler = function (evt) {
                var code = (evt.keyCode || evt.which);
                if (code === 13) { // The "Enter" key
                    Yith.ViewsUtils.masterModal.find("#master-done").trigger("click");
                }
            };

            $master.keypress(function (evt) {
                Yith.ViewsUtils.masterModal.find("#master-error").hide();
                keyHandler(evt);
            });

            $newMaster.keypress(function (evt) {
                keyHandler(evt);
            });

            Yith.ViewsUtils.masterModal.on("shown", function () {
                Yith.ViewsUtils.masterModal.find("#master-error").hide().end()
                                            .find("#master-password").focus();
            });

            Yith.ViewsUtils.masterModal.on("hidden", function () {
                $master.val("");
                $newMaster.val("");
            });
        },

        _getMasterPasswordCallback: function ($master, $newMaster, callback) {
            return function (evt) {
                evt.preventDefault();
                evt.stopPropagation();

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
            };
        },

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
                Yith.ViewsUtils._initMasterPasswordModal($master, $newMaster);
            }

            Yith.ViewsUtils.masterModal.find("#master-done")
                .off("click")
                .on("click", Yith.ViewsUtils._getMasterPasswordCallback($master, $newMaster, callback));

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

        cipher: function (masterPassword, secret, notEnforce) {
            // FIXME This shouldn't use the __container__ API
            var model = Yith.ViewsUtils.passwordIndexController().get("model"),
                result;

            if (!model.isLoaded) {
                Yith.ViewsUtils.masterModal.modal("hide");
                $("#error").modal({ keyboard: false, backdrop: "static" });
                $("#error").find(".failure").removeClass("hide");
                setTimeout(function () {
                    window.open("/list", "_self");
                }, 4000);
                throw "The model isn't loaded";
            }

            if (model.objectAt(0) && model.objectAt(0).get("id") && !notEnforce) {
                // Enforce unique master password
                sjcl.decrypt(masterPassword, model.objectAt(0).get("secret"));
            }
            result = sjcl.encrypt(masterPassword, secret);
            masterPassword = null;
            return result;
        },

        decipher: function (masterPassword, cipheredSecret) {
            var result = null;
            if (cipheredSecret !== null && cipheredSecret !== undefined) {
                result = sjcl.decrypt(masterPassword, cipheredSecret);
            }
            masterPassword = null;
            return result;
        },

        passwordIndexController: function () {
            // FIXME To delete
            return Yith.__container__.lookup('controller:passwords.index');
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
            var $advanced = $("#advanced-options");
            $(evt.target).toggleClass("active");
            if ($advanced.hasClass("hide")) {
                $advanced.removeClass("hide").addClass("row");
            } else {
                $advanced.removeClass("row").addClass("hide");
            }
        }
    });

    Yith.ServerPreferencesButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn", "pull-right"],

        click: function () {
            window.open(yithServerHost + "/preferences", "_blank");
        }
    });

    Yith.ChangeMasterButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn"],

        click: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var controller = Yith.ViewsUtils.passwordIndexController();
            // FIXME We shouldn't be using the __container__ API which is
            // private, this should use the dependency system: "needs"
            if (controller.objectAt(0)) {
                Yith.ViewsUtils.askMasterPassword(function (masterPassword, newMasterPassword) {
                    try {
                        Yith.ViewsUtils.decipher(masterPassword, controller.objectAt(0).get("secret"));
                    } catch (err) {
                        return false;
                    }

                    controller.forEach(function (password) {
                        var secret = Yith.ViewsUtils.decipher(masterPassword, password.get("secret"));
                        secret = Yith.ViewsUtils.cipher(newMasterPassword, secret, true);
                        password.set("secret", secret);
                        secret = null;
                        password.save();
                    });
                    masterPassword = null;
                    newMasterPassword = null;

                    return true;
                }, true);
            }
        }
    });

    Yith.PasswordLengthInput = Ember.View.extend({
        tagName: "input",
        attributeBindings: ["type", "min", "step", "value"],
        type: "number",
        min: 0,
        step: 1,
        value: 20,
        classNames: ["span2"],

        change: function (evt) {
            Yith.settings.set("passGenLength", parseInt($(evt.target).val(), 10));
        }
    });
}());
