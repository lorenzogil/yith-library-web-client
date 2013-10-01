/*jslint browser: true, nomen: true */
/*global Ember, $, Yith, sjcl, yithServerHost */

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
                keyHandler,
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
                keyHandler = function (evt) {
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
            }

            Yith.ViewsUtils.masterModal.find("#master-done")
                .off("click")
                .on("click", function (evt) {
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

        cipher: function (masterPassword, secret, notEnforce) {
            // TODO This shouldn't use the __container__ API
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
            // TODO To delete
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
            // TODO We shouldn't be using the __container__ API which is
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

    // LIST PASSWORDS' ITEMS VIEWS

    Yith.ServiceButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn btn-info"],

        click: function (evt) {
            var that = this;

            Yith.ViewsUtils.askMasterPassword(function (masterPassword) {
                var $node = $(evt.target).parents("tr"),
                    $input = $node.find("td:first-child input"),
                    $countdown = $node.find("td:first-child span"),
                    $close = $countdown.next(),
                    secret = that.get("controller").get("secret"),
                    timer;

                try {
                    secret = Yith.ViewsUtils.decipher(masterPassword, secret);
                } catch (err) {
                    return false;
                }
                masterPassword = null;
                $input.val(secret).show().focus().select();
                secret = null;

                if (Yith.settings.get("disableCountdown")) {
                    $close.off("click");
                    $close.click(function () {
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
    });

    Yith.TagButton = Ember.View.extend({
        tagName: "span",
        classNames: ["label", "pointer"],

        click: function () {
            var controller = this.get("controller");
            if (!controller.activateFilter) {
                controller = controller.get("list_controller");
            }
            controller.activateFilter(this.$().text().trim());
        }
    });

    Yith.FilterButton = Yith.TagButton.extend({
        click: function () {
            this.get("controller").deactivateFilter(this.$().text().trim());
        }
    });

    Yith.NotesButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn", "notes"],

        didInsertElement: function () {
            var notes = this.get("controller").get("notes");

            if (notes) {
                this.$().popover({
                    placement: "left",
                    title: "Notes",
                    content: notes
                });
            } else {
                this.$().addClass("disabled");
            }
        }
    });

    Yith.SecretGroup = Ember.View.extend({
        templateName: "secret-group",
        checkerList: [],

        validateSecret: function () {
            var $form = this.$().parents("form"),
                that = this;
            while (this.get("checkerList").length > 0) {
                clearTimeout(this.get("checkerList").pop());
            }
            this.get("checkerList").push(setTimeout(function () {
                that.get("controller").validateSecretChecker($form);
            }, 500));
        },

        initStrengthMeter: function (insist) {
            var input = this.$().find("#edit-secret1"),
                that = this;
            if (input.length > 0) {
                input.pwstrength({
                    viewports: {
                        progress: this.$().find("#strength-meter .progressbar"),
                        verdict: this.$().find("#strength-meter .verdict")
                    }
                });
            } else if (insist) {
                setTimeout(function () {
                    that.initStrengthMeter(true);
                }, 100);
            }
        },

        bindValidation: function (insist) {
            var inputs = this.$().find(".edit-secret"),
                that = this;
            if (inputs.length > 0) {
                inputs.on("keyup", function () {
                    that.validateSecret();
                });
            } else if (insist) {
                setTimeout(function () {
                    that.bindValidation(true);
                }, 100);
            }
        },

        didInsertElement: function () {
            var that = this;

            this.initStrengthMeter(false);

            // This cannot be done with ember and handlebars' actions because
            // an unknown reason, I couldn't make it work
            this.bindValidation(false);
            this.$().find("#show-secret-group").on("click", function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                that.get("controller").set("modifySecret", true);
                that.bindValidation(true);
                that.initStrengthMeter(true);
            });
        }
    });

    Yith.GenerateSecretButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn"],

        click: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var password = "",
                charset = Yith.settings.get("passGenCharset"),
                length = Yith.settings.get("passGenLength"),
                aux,
                i;

            for (i = 0; i < length; i += 1) {
                aux = Math.floor(Math.random() * charset.length);
                password += charset.charAt(aux);
            }

            this.$().parent()
                .find("#edit-secret2").val(password).end()
                .find("#edit-secret1").val(password).trigger("keyup");
            password = null;
        }
    });

    Yith.TagsInput = Ember.View.extend({
        templateName: "tags-input",

        addTag: function () {
            var tags = this.$().find("input").val().split(',');
            this.get("controller").addProvisionalTags(tags);
            this.$().find("input").val("");
        },

        didInsertElement: function () {
            var that = this;

            this.$().find("input").typeahead({
                items: 3,
                source: function () {
                    var controller = Yith.ViewsUtils.passwordIndexController();
                    // TODO We shouldn't be using the __container__ API which is
                    // private, this should use the dependency system: "needs"
                    // var controller = that.get("controller").get("controllers.PasswordsIndex");
                    // But for some reason it doesn't work:
                    //   https://github.com/emberjs/ember.js/pull/2131
                    // That should have fixed it, but the problem persists.
                    return controller.get("allTags");
                }
            });

            // This cannot be done with ember and handlebars' actions because
            // an unknown reason, I couldn't make it work
            this.$().find("button").on("click", function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                that.addTag();
            });
        }
    });

    Yith.SaveButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn", "btn-primary"],

        click: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.get("controller").save(this.$().parents("form"));
        }
    });
}());
