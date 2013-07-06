/*jslint browser: true */
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

    Yith.PasswordInListController = Ember.ObjectController.extend({
        daysLeft: Ember.computed(function () {
            // One day milliseconds: 86400000
            var now = (new Date()).getTime(),
                diff = now - this.get("creation"),
                diffDays = Math.round(diff / 86400000);

            return this.get("expiration") - diffDays;
        }).property("creation", "expiration"),

        expirationClass: Ember.computed(function () {
            var cssClass = "badge ",
                daysLeft = this.get("daysLeft");

            if (daysLeft > 30) {
                cssClass += "badge-success";
            } else if (daysLeft > 7) {
                cssClass += "badge-warning";
            } else {
                cssClass += "badge-important";
            }

            return cssClass;
        }).property("daysLeft")
    });

    Yith.PasswordsIndexController = Ember.ArrayController.extend({
        activeFilters: [],

        processedPasswordList: Ember.computed(function () {
            var filters = this.activeFilters,
                that = this,
                result;

            result = this.toArray().sort(function (pass1, pass2) {
                var a = pass1.get("service").toLowerCase(),
                    b = pass2.get("service").toLowerCase(),
                    result = 0;

                if (a > b) {
                    result = 1;
                } else if (a < b) {
                    result = -1;
                }

                return result;
            });

            if (filters.length > 0) {
                result = result.filter(function (password) {
                    var tags = password.get("tags");
                    tags = tags || [];
                    return filters.every(function (f) {
                        return tags.some(function (t) {
                            return f === t;
                        });
                    });
                });
            }

            return result.map(function(password) {
                var controller = Yith.PasswordInListController.create();
                controller.set("model", password);
                controller.set("container", that.container);
                controller.set("list_controller", that);
                return controller;
            });
        }).property("@each", "activeFilters.@each"),

        allTags: Ember.computed(function() {
            var allTags = new Ember.Set();
            this.forEach(function (password) {
                var tags = password.get("tags");
                if (tags !== undefined && tags !== null) {
                    allTags.addEach(tags);
                }
            });
            allTags = allTags.toArray().sort(function (a, b) {
                return a.localeCompare(b);
            });
            return allTags;
        }).property("@each.tags"),

        activateFilter: function (filter) {
            var filters = new Ember.Set(this.activeFilters);
            filters.push(filter);
            this.set("activeFilters", filters.toArray());
        },

        deactivateFilter: function (filter) {
            var filters = new Ember.Set(this.activeFilters);
            filters.remove(filter);
            this.set("activeFilters", filters.toArray());
        }
    });

    Yith.PasswordsNewController = Ember.ObjectController.extend({
        modifySecret: true,
        expirationActive: false,
        provisionalTags: [],

        expirationDisabled: Ember.computed(function () {
            return !this.get("expirationActive");
        }).property("expirationActive"),

        expirationToggle: function () {
            this.set("expirationActive", !this.get("expirationActive"));
        },

        addProvisionalTags: function (newTags) {
            var tags = new Ember.Set(this.get("provisionalTags"));
            tags.addEach(newTags);
            this.set("provisionalTags", tags.toArray());
        },

        validateSecretChecker: function ($form) {
            var input1 = $form.find("#edit-secret1"),
                equal = input1.val() === $form.find("#edit-secret2").val(),
                notEmpty = false;

            if (input1.val() !== "") {
                input1.parents("#secret-group")
                    .removeClass("error")
                    .find(".help-block.req").hide();
                notEmpty = true;
            } else {
                input1.parents("#secret-group")
                    .addClass("error")
                    .find(".help-block.req").show();
            }

            if (equal) {
                input1.parents("#secret-group")
                    .find(".help-block.match").hide();
                if (notEmpty) {
                    input1.parents("#secret-group").removeClass("error");
                }
            } else {
                input1.parents("#secret-group")
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

        checkEmptiness: function () {
            this.validateRequired($("#edit-service"));
        },

        validate: function ($form) {
            var valid = this.validateSecretChecker($form);
            return this.validateRequired($form.find("#edit-service")) && valid;
        },

        getFormData: function ($form, creation) {
            var enableExpiration = $form.find("#edit-enable-expiration:checked").length > 0,
                now = new Date(),
                data = { creation: creation };

            data.service = $form.find("#edit-service").val();
            data.account = $form.find("#edit-account").val().trim();
            data.lastModification = now.getTime();
            if (enableExpiration) {
                data.expiration = now.getTime() + (parseInt($form.find("#edit-expiration").val(), 10) * 86400000);
                data.expiration = Math.round((data.expiration - creation) / 86400000);
            } else {
                data.expiration = 0;
            }
            data.notes = $form.find("#edit-notes").val();
            data.tags = this.get("provisionalTags");
            data.secret = $form.find("#edit-secret1").val();

            return data;
        },

        save: function ($form) {
            if (this.validate($form)) {
                var data = this.getFormData($form, (new Date()).getTime()),
                    that = this,
                    callback;

                callback = function (cipheredSecret) {
                    var password;

                    delete data.secret;
                    if (cipheredSecret) {
                        data.secret = cipheredSecret;
                    }
                    password = Yith.Password.createRecord(data);
                    password.save();

                    data = null;
                    that.transitionToRoute('/');
                };

                if (data.secret !== "") { // TODO remove these checks if overwritten in subclass
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
        }
    });

    Yith.PasswordController = Yith.PasswordsNewController.extend({
        modifySecret: false,

        deletePassword: function () {
            alert("TODO"); // TODO
            return false;
        }
    });
}());
