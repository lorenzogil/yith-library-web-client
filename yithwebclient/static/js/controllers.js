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

    Yith.ControllersUtils = {
        oneDayInMilliseconds: 86400000,

        daysLeft: function (creation, expiration) {
            var now = (new Date()).getTime(),
                diff = now - creation,
                diffDays = Math.round(diff / Yith.ControllersUtils.oneDayInMilliseconds);

            return expiration - diffDays;
        }
    };

    Yith.PasswordInListController = Ember.ObjectController.extend({
        daysLeft: Ember.computed(function () {
            return Yith.ControllersUtils.daysLeft(this.get("creation"), this.get("expiration"));
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
            var valid = this.validateRequired($form.find("#edit-service"));
            if (this.get("modifySecret")) {
                valid = this.validateSecretChecker($form) && valid;
            }
            return valid;
        },

        getFormData: function ($form, creation) {
            var enableExpiration = $form.find("#edit-enable-expiration:checked").length > 0,
                now = new Date(),
                data = { creation: creation };

            data.service = $form.find("#edit-service").val();
            data.account = $form.find("#edit-account").val().trim();
            data.lastModification = now.getTime();
            if (enableExpiration) {
                data.expiration = now.getTime() + (parseInt($form.find("#edit-expiration").val(), 10) * Yith.ControllersUtils.oneDayInMilliseconds);
                data.expiration = Math.round((data.expiration - creation) / Yith.ControllersUtils.oneDayInMilliseconds);
            } else {
                data.expiration = 0;
            }
            data.notes = $form.find("#edit-notes").val();
            data.tags = this.get("provisionalTags");
            if (this.get("modifySecret")) {
                data.secret = $form.find("#edit-secret1").val();
            }

            return data;
        },

        saveData: function (data) {
            var password = Yith.Password.createRecord(data);
            password.save();
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
                    that.transitionToRoute('/');
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
        }
    });

    Yith.PasswordController = Yith.PasswordsNewController.extend({
        modifySecret: false,

        init: function () {
            var handler;
            this._super();

            handler = function (sender) {
                if (sender.get("expiration") > 0) {
                    sender.set("expirationActive", true);
                } else {
                    sender.set("expirationActive", false);
                }
            };
            this.addObserver("expiration", this, handler);
        },

        daysLeft: Ember.computed(function () {
            var days = '';
            if (this.get("expirationActive")) {
                days = Yith.ControllersUtils.daysLeft(this.get("creation"), this.get("expiration"));
            }
            return days;
        }).property("creation", "expiration"),

        saveData: function (data) {
            var model = this.get("model");
            model.setProperties(data);
            model.save();
        },

        deletePassword: function () {
            var model = this.get("model");
            model.deleteRecord();
            model.save();
            this.transitionToRoute('/');
            return false;
        }
    });
}());
