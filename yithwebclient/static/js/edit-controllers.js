/*jslint browser: true, nomen: true */
/*global Ember, Yith */

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

(function (Yith, Ember) {
    "use strict";

    Yith.PasswordsNewController = Ember.ObjectController.extend({
        modifySecret: true,
        expirationActive: false,
        provisionalTags: [],
        savingEvent: "didCreate",
        needs: ["PasswordsIndex"],

        init: function () {
            var expirationHandler,
                tagsHandler;

            this._super();

            expirationHandler = function (sender) {
                if (sender.get("expiration") > 0) {
                    sender.set("expirationActive", true);
                } else {
                    sender.set("expirationActive", false);
                }
            };
            this.addObserver("expiration", this, expirationHandler);

            tagsHandler = function (sender) {
                var tags = new Ember.Set(sender.get("tags"));
                sender.set("provisionalTags", tags.toArray());
            };
            this.addObserver("tags", this, tagsHandler);
        },

        expirationDisabled: Ember.computed("expirationActive", function () {
            return !this.get("expirationActive");
        }),

        addProvisionalTags: function (newTags) {
            var tags = new Ember.Set(this.get("provisionalTags"));
            newTags = newTags.map(function (tag) {
                return tag.trim();
            });
            tags.addEach(newTags.filter(function (tag) {
                return tag.length > 0;
            }));
            this.set("provisionalTags", tags.toArray());
        },

        validateSecretChecker: function ($form) {
            var input1 = $form.find("#edit-secret1"),
                secretGroup = input1.parents("#secret-group"),
                equal = input1.val() === $form.find("#edit-secret2").val(),
                notEmpty = input1.val() !== "";

            secretGroup.removeClass("error");
            if (notEmpty) {
                secretGroup.find(".help-block.req").hide();
            } else {
                secretGroup
                    .addClass("error")
                    .find(".help-block.req").show();
            }
            if (equal) {
                secretGroup.find(".help-block.match").hide();
            } else {
                secretGroup
                    .addClass("error")
                    .find(".help-block.match").show();
            }

            return equal && notEmpty;
        },

        validateRequired: function ($input) {
            if ($input.val() !== "") {
                $input.parents(".control-group").removeClass("error");
                $input.next().hide();
                return true;
            }
            $input.parents(".control-group").addClass("error");
            $input.next().show();
            return false;
        },

        validate: function ($form) {
            var valid = this.validateRequired($form.find("#edit-service"));
            if (this.get("modifySecret")) {
                valid = this.validateSecretChecker($form) && valid;
            }
            return valid;
        },

        _calculateExpiration: function (expiration, creation, now) {
            expiration = parseInt(expiration, 10);
            expiration *= Yith.ControllersUtils.oneDayInMilliseconds;
            expiration = expiration + now.getTime() - creation;
            expiration = Math.round(expiration / Yith.ControllersUtils.oneDayInMilliseconds);
            return expiration;
        },

        getFormData: function ($form, creation) {
            var enableExpiration = $form.find("#edit-enable-expiration:checked").length > 0,
                now = new Date(),
                data = { creation: creation, expiration: 0 };

            data.service = $form.find("#edit-service").val();
            data.account = $form.find("#edit-account").val().trim();
            data.lastModification = now.getTime();
            if (enableExpiration) {
                data.expiration = this._calculateExpiration(
                    $form.find("#edit-expiration").val(),
                    creation,
                    now
                );
            }
            data.notes = $form.find("#edit-notes").val().trim();
            if (data.notes === "") { delete data.notes; }
            data.tags = this.get("provisionalTags");
            if (this.get("modifySecret")) {
                data.secret = $form.find("#edit-secret1").val();
            }

            return data;
        },

        saveData: function (data) {
            var model = this.get("model");
            model.one(this.get("savingEvent"), this, function () {
                this.transitionToRoute('/');
            });
            model.setProperties(data);
            model.save();
        },

        save: function ($form) {
            if (this.validate($form)) {
                var data = this.getFormData($form, (new Date()).getTime()),
                    that = this,
                    callback;

                callback = function (cipheredSecret) {
                    delete data.secret;
                    if (cipheredSecret) {
                        data.secret = cipheredSecret;
                    }
                    that.saveData(data);
                    data = null;
                    // the saveData method will transition to the password list
                };

                if (data.secret !== undefined) {
                    Yith.ViewsUtils.askMasterPassword(function (masterPassword) {
                        var cipheredSecret;

                        try {
                            cipheredSecret = Yith.ViewsUtils.cipher(masterPassword, data.secret);
                        } catch (err) {
                            return false;
                        }

                        data.secret = null;
                        callback(cipheredSecret);
                        return true;
                    });
                } else {
                    callback();
                }
            }
        },

        actions: {
            checkEmptiness: function () {
                this.validateRequired(Ember.$("#edit-service"));
            },

            expirationToggle: function () {
                this.set("expirationActive", !this.get("expirationActive"));
            },

            removeTag: function (tag) {
                var tags = new Ember.Set(this.get("provisionalTags"));
                tags.remove(tag);
                this.set("provisionalTags", tags.toArray());
            },

            cancelNewPassword: function () {
                this.get("model").deleteRecord();
                this.transitionToRoute('/');
            }
        }
    });

    Yith.PasswordController = Yith.PasswordsNewController.extend({
        modifySecret: false,
        savingEvent: "didUpdate",

        daysLeft: Ember.computed("creation", "expiration", function () {
            var days = '';
            if (this.get("expirationActive")) {
                days = Yith.ControllersUtils.daysLeft(this.get("creation"), this.get("expiration"));
            }
            return days;
        }),

        actions: {
            deletePassword: function () {
                var that = this,
                    confirm = Ember.$("#confirm-modal");

                confirm.modal({ show: false });
                confirm.find("#confirm-delete")
                    .off("click")
                    .on("click", function (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        var model = that.get("model");
                        model.one("didDelete", that, function () {
                            this.transitionToRoute('/');
                        });
                        model.deleteRecord();
                        model.save();

                        confirm.modal("hide");
                    });

                confirm.modal("show");
                return false;
            }
        }
    });
}(Yith, Ember));
