/*jslint browser: true */
/*global Ember, $, Yith */

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

    Yith.ServiceButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn btn-info"],

        getUIElems: function ($button) {
            var ui = {
                $node: $button.parents("tr")
            };

            ui.$input = ui.$node.find("td:first-child input");
            ui.$countdown = ui.$node.find("td:first-child span");
            ui.$close = ui.$countdown.next();
            return ui;
        },

        showCloseButton: function (ui) {
            ui.$close.off("click");
            ui.$close.click(function () {
                ui.$input.hide().attr("value", "");
                ui.$close.hide();
            });
            ui.$close.show();
        },

        showCountDown: function (ui) {
            var timer;

            ui.$countdown.text("5");
            ui.$countdown.show();
            timer = setInterval(function () {
                ui.$countdown.text(parseInt(ui.$countdown.text(), 10) - 1);
            }, 1000);
            setTimeout(function () {
                clearInterval(timer);
                ui.$input.hide().attr("value", "");
                ui.$countdown.hide();
            }, 5500);
        },

        click: function (evt) {
            var that = this;

            Yith.ViewsUtils.askMasterPassword(function (masterPassword) {
                var secret = that.get("controller").get("secret"),
                    ui;

                try {
                    secret = Yith.ViewsUtils.decipher(masterPassword, secret);
                } catch (err) {
                    return false;
                }
                masterPassword = null;
                ui = that.getUIElems($(evt.target));
                ui.$input.val(secret).show().focus().select();
                secret = null;

                if (Yith.settings.get("disableCountdown")) {
                    that.showCloseButton(ui);
                } else {
                    that.showCountDown(ui);
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
                    ui: {
                        viewports: {
                            progress: this.$().find("#strength-meter .progressbar"),
                            verdict: this.$().find("#strength-meter .verdict")
                        },
                        bootstrap2: true
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
                    // FIXME We shouldn't be using the __container__ API which is
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
