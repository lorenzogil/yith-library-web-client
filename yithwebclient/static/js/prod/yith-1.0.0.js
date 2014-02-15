// Source: yithwebclient/static/js/app.js


// Yith Library web client
// Copyright (C) 2012 - 2013  Alejandro Blanco <alejandro.b.e@gmail.com>
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
    window.Yith = Ember.Application.create({});
    // Wait until we have the access code
    Yith.deferReadiness();

    Yith.Router.map(function () {
        this.resource('passwords', { path: '/' }, function () {
            this.route('new');
            this.resource('password', {
                path: ':password_id'
            });
        });
    });

    Yith.PasswordsIndexRoute = Ember.Route.extend({
        model: function () {
            return this.store.find('password');
        },

        enter: function () {
            $("#top-bar").removeClass("hide");
        }
    });

    Yith.PasswordsNewRoute = Ember.Route.extend({
        model: function () {
            return this.store.createRecord('password');
        },

        enter: function () {
            $("#top-bar").addClass("hide");
            $("#advanced-options").addClass("hide");
        }
    });

    Yith.PasswordRoute = Ember.Route.extend({
        model: function (params) {
            return this.store.find('password', params.password_id);
        },

        enter: function () {
            $("#top-bar").addClass("hide");
            $("#advanced-options").addClass("hide");
            var controller = this.get("controller");
            if (controller) {
                // If the controller has already been created then it's
                // possible that it is showing the modify-secret controls
                controller.set("modifySecret", false);
            }
        }
    });

    // INITIALIZATION CODE
    $(document).ready(function () {
        var creditsModal,
            setProgressBar;

        setProgressBar = function (width) {
            $("#loading .progress .bar").css("width", width + "%");
        };

        $.ajax("/token", {
            success: function (data) {
                window.yithAccessCode = data.access_code;
                setProgressBar(100);
                Yith.advanceReadiness();
                $("#loading").remove();
            },
            error: function () {
                $("#error").find(".access").removeClass("hide");
                $("#error").modal({ keyboard: false, backdrop: "static" });
                setTimeout(function () {
                    window.open("/", "_self");
                }, 4000);
            }
        });

        creditsModal = $("#credits");
        creditsModal.modal({ show: false });
        $("#creditsButton").click(function () {
            creditsModal.modal("show");
        });

        setProgressBar(60);
    });
}());

// Source: yithwebclient/static/js/objects.js


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

    Yith.SettingsObject = Ember.Object.extend({
        disableCountdown: false,
        rememberMaster: false,
        masterPassword: undefined,
        passGenUseSymbols: true,
        passGenUseNumbers: true,
        passGenUseChars: true,
        passGenLength: 20,

        passGenCharset: Ember.computed(function () {
            // 33 start symbols
            // 48 start numbers
            // 58 start symbols again
            // 65 start chars
            // 91 start symbols again
            // 97 start chars again
            // 123 start symbols again
            // 126 end (included)

            var charset = "",
                i;

            for (i = 33; i < 127; i += 1) {
                if (i >= 33 && i < 48 && this.passGenUseSymbols) {
                    charset += String.fromCharCode(i);
                } else if (i >= 48 && i < 58 && this.passGenUseNumbers) {
                    charset += String.fromCharCode(i);
                } else if (i >= 58 && i < 65 && this.passGenUseSymbols) {
                    charset += String.fromCharCode(i);
                } else if (i >= 65 && i < 91 && this.passGenUseChars) {
                    charset += String.fromCharCode(i);
                } else if (i >= 91 && i < 97 && this.passGenUseSymbols) {
                    charset += String.fromCharCode(i);
                } else if (i >= 97 && i < 123 && this.passGenUseChars) {
                    charset += String.fromCharCode(i);
                } else if (i >= 123 && i < 127 && this.passGenUseSymbols) {
                    charset += String.fromCharCode(i);
                }
            }

            return charset;
        }).property("passGenUseChars", "passGenUseNumbers", "passGenUseSymbols")
    });

    Yith.settings = Yith.SettingsObject.create();
}());

// Source: yithwebclient/static/js/models.js


// Yith Library web client
// Copyright (C) 2013  Alejandro Blanco <alejandro.b.e@gmail.com>
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

    Yith.Password = DS.Model.extend({
        account: DS.attr(),
        creation: DS.attr(),
        expiration: DS.attr(),
        lastModification: DS.attr(),
        notes: DS.attr(),
        owner: DS.attr(),
        secret: DS.attr(),
        service: DS.attr(),
        tags: DS.attr()
    });

    Yith.PasswordAdapter = DS.RESTAdapter.extend({
        host: yithServerHost,
        ajax: function (url, type, hash) {
            // Prepare the adapter for the oAuth stuff
            url += "?client_id=" + yithClientId;
            if (hash === undefined) {
                hash = {};
            }
            hash.headers = {
                "Authorization": "Bearer " + yithAccessCode
            };
            return this._super(url, type, hash);
        },

        didError: function () {
            $("#error").modal({ keyboard: false, backdrop: "static" });
            $("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
            this._super.apply(this, arguments);
        }
    });
}());

// Source: yithwebclient/static/js/controllers.js


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
                var a = pass1.get("service"),
                    b = pass2.get("service"),
                    order = 0;

                if (!a) { return -1; }
                if (!b) { return 1; }

                a = a.toLowerCase();
                b = b.toLowerCase();

                if (a > b) {
                    order = 1;
                } else if (a < b) {
                    order = -1;
                }

                return order;
            });

            if (filters.length > 0) {
                result = result.filter(function (password) {
                    var tags = password.get("tags");
                    tags = tags || [];
                    return filters.every(function (f) {
                        return tags.some(function (t) {
                            return f.trim() === t.trim();
                        });
                    });
                });
            }

            return result.map(function (password) {
                var controller = Yith.PasswordInListController.create();
                controller.set("model", password);
                controller.set("container", that.container);
                controller.set("list_controller", that);
                return controller;
            });
        }).property("@each", "activeFilters.@each"),

        allTags: Ember.computed(function () {
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

        expirationDisabled: Ember.computed(function () {
            return !this.get("expirationActive");
        }).property("expirationActive"),

        expirationToggle: function () {
            this.set("expirationActive", !this.get("expirationActive"));
        },

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

        removeTag: function (tag) {
            var tags = new Ember.Set(this.get("provisionalTags"));
            tags.remove(tag);
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
            if (data.notes === "") {
                delete data.notes;
            }
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

        cancelNewPassword: function () {
            this.get("model").deleteRecord();
            this.transitionToRoute('/');
        }
    });

    Yith.PasswordController = Yith.PasswordsNewController.extend({
        modifySecret: false,
        savingEvent: "didUpdate",

        daysLeft: Ember.computed(function () {
            var days = '';
            if (this.get("expirationActive")) {
                days = Yith.ControllersUtils.daysLeft(this.get("creation"), this.get("expiration"));
            }
            return days;
        }).property("creation", "expiration"),

        deletePassword: function () {
            var that = this,
                confirm = $("#confirm-modal");

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
    });
}());

// Source: yithwebclient/static/js/views.js


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
