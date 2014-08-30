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

window.Yith = Ember.Application.create();

(function (Yith, Ember) {
    "use strict";
    // Wait until we have the access code
    Yith.deferReadiness();

    Yith.Router.map(function () {
        this.resource('passwords', { path: '/' }, function () {
            this.route('new');
            this.route('edit', { path: ':password_id' });
        });
    });

    Yith.PasswordsIndexRoute = Ember.Route.extend({
        model: function () {
            return this.store.find('password');
        },

        setupController: function (controller, passwords) {
            controller.set('model', passwords);
            controller.initMasterModal();
        }
    });

    Yith.PasswordsNewRoute = Ember.Route.extend({
        model: function () {
            return this.store.createRecord('password');
        },

        setupController: function (controller, password) {
            controller.set('model', password);
            controller.initMasterModal();
        }
    });

    Yith.PasswordsEditRoute = Ember.Route.extend({
        model: function (params) {
            return this.store.find('password', params.password_id);
        },

        setupController: function (controller, password) {
            controller.set('model', password);
            controller.set('modifySecret', false);
            controller.initMasterModal();
        }
    });

    // INITIALIZATION CODE
    Ember.$(document).ready(function () {
        var creditsModal,
            setProgressBar;

        setProgressBar = function (width) {
            Ember.$("#loading .progress .bar").css("width", width + "%");
        };

        Ember.$.ajax("/token", {
            success: function (data) {
                window.yithAccessCode = data.access_code;
                setProgressBar(100);
                Yith.advanceReadiness();
                Ember.$("#loading").remove();
            },
            error: function () {
                Ember.$("#error").find(".access").removeClass("hide");
                Ember.$("#error").modal({ keyboard: false, backdrop: "static" });
                setTimeout(function () {
                    window.open("/", "_self");
                }, 4000);
            }
        });

        creditsModal = Ember.$("#credits");
        creditsModal.modal({ show: false });
        Ember.$("#creditsButton").click(function () {
            creditsModal.modal("show");
        });

        setProgressBar(60);
    });
}(Yith, Ember));
;// Source: yithwebclient/static/js/objects.js


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

(function (Yith, Ember) {
    "use strict";

    Yith.SettingsObject = Ember.Object.extend({
        disableCountdown: false,
        rememberMaster: false,
        masterPassword: undefined,
        showAdvancedOptions: false,
        passGenUseSymbols: true,
        passGenUseNumbers: true,
        passGenUseChars: true,
        passGenLength: 20,

        passGenCharset: Ember.computed("passGenUseChars", "passGenUseNumbers", "passGenUseSymbols", function () {
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
        })
    });

    Yith.settings = Yith.SettingsObject.create();
}(Yith, Ember));
;// Source: yithwebclient/static/js/models.js


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

(function (Yith, Ember, DS, host, clientId) {
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
        host: host,
        ajax: function (url, type, hash) {
            // Prepare the adapter for the oAuth stuff
            url += "?client_id=" + clientId;
            if (hash === undefined) {
                hash = {};
            }
            hash.headers = {
                "Authorization": "Bearer " + yithAccessCode
            };
            return this._super(url, type, hash);
        },

        didError: function () {
            Ember.$("#error").modal({ keyboard: false, backdrop: "static" });
            Ember.$("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
            this._super.apply(this, arguments);
        }
    });
}(Yith, Ember, DS, yithServerHost, yithClientId));
;// Source: yithwebclient/static/js/controllers.js


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
        daysLeft: Ember.computed("creation", "expiration", function () {
            return Yith.ControllersUtils.daysLeft(this.get("creation"), this.get("expiration"));
        }),

        expirationClass: Ember.computed("daysLeft", function () {
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
        })
    });

    Yith.PasswordsIndexController = Ember.ArrayController.extend({
        activeFilters: [],

        masterModalView: null,
        changeMasterModalView: null,

        initMasterModal: function () {
            this.set('masterModalView', Yith.MasterModal.create());
            this.set('changeMasterModalView', Yith.MasterModal.extend({
                ident: 'change-master',
                isChangeForm: true
            }).create());
        },

        processedPasswordList: Ember.computed("@each", "activeFilters.@each", function () {
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
        }),

        allTags: Ember.computed("@each.tags", function () {
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
        }),

        activateFilter: function (filter) {
            var filters = new Ember.Set(this.activeFilters);
            filters.push(filter);
            this.set("activeFilters", filters.toArray());
        },

        deactivateFilter: function (filter) {
            var filters = new Ember.Set(this.activeFilters);
            filters.remove(filter);
            this.set("activeFilters", filters.toArray());
        },

        isCountdownActive: Ember.computed("Yith.settings.disableCountdown", function () {
            return Yith.settings.get("disableCountdown");
        }),

        isRememberMasterActive: Ember.computed("Yith.settings.rememberMaster", function () {
            return Yith.settings.get("rememberMaster");
        }),

        showAdvancedOptions: Ember.computed("Yith.settings.showAdvancedOptions", function () {
            return Yith.settings.get("showAdvancedOptions");
        }),

        actions: {
            toggleCountdown: function () {
                Yith.settings.set("disableCountdown", !Yith.settings.get('disableCountdown'));
            },

            toggleRememberMaster: function () {
                var remember = !Yith.settings.get("rememberMaster");
                Yith.settings.set("rememberMaster", remember);
                if (!remember) {
                    Yith.settings.set("masterPassword", undefined);
                }
            },

            toggleAdvancedOptions: function () {
                Yith.settings.set("showAdvancedOptions", !Yith.settings.get('showAdvancedOptions'));
            }
        }
    });
}(Yith, Ember));
;// Source: yithwebclient/static/js/edit-controllers.js


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
        needs: ['passwordsIndex'],

        masterModalView: null,

        initMasterModal: function () {
            this.set('masterModalView', Yith.MasterModal.create());
        },

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
                    modal,
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

                if (!Ember.isNone(data.secret)) {
                    modal = this.get('masterModalView');
                    modal.show(function (masterPassword) {
                        var cipheredSecret;

                        try {
                            cipheredSecret = Yith.ViewsUtils.cipher(masterPassword, data.secret, modal, that.get('controllers.passwordsIndex'));
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

    Yith.PasswordsEditController = Yith.PasswordsNewController.extend({
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
;// Source: yithwebclient/static/js/views.js


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


(function (Yith, Ember, sjcl, host) {
    "use strict";

    Yith.ViewsUtils = {
        cipher: function (masterPassword, secret, masterModal, indexCtrl, notEnforce) {
            var model = indexCtrl.get("model"),
                result;

            if (!model.get('isLoaded')) {
                masterModal.hide();
                Ember.$("#error").modal({ keyboard: false, backdrop: "static" });
                Ember.$("#error").find(".failure").removeClass("hide");
                setTimeout(function () {
                    window.open("/list", "_self");
                }, 4000);
                throw "The model isn't loaded";
            }

            if (model.get('firstObject') && model.get('firstObject.id') &&
                    !notEnforce) {
                // Enforce unique master password, it crashes if the master
                // password is different from the one already used
                sjcl.decrypt(masterPassword, model.get('firstObject.secret'));
            }
            result = sjcl.encrypt(masterPassword, secret);
            masterPassword = null;
            return result;
        },

        decipher: function (masterPassword, cipheredSecret) {
            var result = null;
            if (!Ember.isNone(cipheredSecret)) {
                result = sjcl.decrypt(masterPassword, cipheredSecret);
            }
            masterPassword = null;
            return result;
        }
    };

    Yith.MasterModal = Ember.View.extend({
        templateName: 'master-modal',
        ident: 'master',
        isChangeForm: false,
        $root: null,
        callback: null,

        initModal: Ember.on('didInsertElement', function () {
            var masterModal = this.$('#' + this.get('ident')).modal({
                    show: false
                }),
                that = this;

            masterModal.on('shown', function () {
                that.cleanup();
                that.$('input').first().focus();
            });
            masterModal.on('hidden', function () {
                that.cleanup();
                that.set('callback', null);
            });
            this.set('$root', masterModal);
        }),

        hide: function () {
            this.get('$root').modal('hide');
        },

        cleanup: function () {
            this.$('.alert-error').hide();
            this.$('input').val('');
        },

        show: function (callback) {
            this.set('callback', callback);
            if (!this.get('isChangeForm') && Yith.settings.get('rememberMaster')
                    && !Ember.isNone(Yith.settings.get('masterPassword'))) {
                this.done(Yith.settings.get('masterPassword'));
            } else {
                this.get('$root').modal('show');
            }
        },

        done: function (masterPassword) {
            var values = [],
                success;

            if (Ember.isNone(masterPassword)) {
                this.$('input').each(function (idx, input) {
                    values[idx] = Ember.$(input).val();
                });
            } else {
                values.push(masterPassword);
            }

            success = this.get('callback').apply(window, values);
            if (success) {
                if (Yith.settings.get('rememberMaster') && Ember.isNone(masterPassword) && values[0] !== '') {
                    Yith.settings.set('masterPassword', values[0]);
                    setTimeout(function () {
                        Yith.settings.set('masterPassword', undefined);
                    }, 300000); // 5 min
                }
                this.get('$root').modal('hide');
            } else {
                this.$('.alert-error').show();
                this.$('input').first().focus().select();
            }
            values = null;
        },

        keyPress: function (evt) {
            var code = (evt.keyCode || evt.which);

            if (this.$(evt.target).is('.main')) {
                this.$('.alert-error').hide();
            }
            if (code === 13) { // The "Enter" key
                evt.preventDefault();
                this.done();
            }
        },

        click: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (this.$(evt.target).is('.done')) {
                this.done();
            }
        }
    });

    Yith.ServerPreferencesButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn", "pull-right"],

        click: function () {
            window.open(host + "/preferences", "_blank");
        }
    });

    Yith.ChangeMasterButton = Ember.View.extend({
        tagName: "button",
        classNames: ["btn"],

        click: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var controller = this.get('controller'),
                modal;

            if (controller.get('firstObject')) {
                modal = controller.get('changeMasterModalView');
                modal.show(function (masterPassword, newMasterPassword) {
                    try {
                        Yith.ViewsUtils.decipher(masterPassword, controller.get('firstObject.secret'));
                    } catch (err) {
                        return false;
                    }

                    controller.forEach(function (password) {
                        var secret = Yith.ViewsUtils.decipher(masterPassword, password.get("secret"));
                        secret = Yith.ViewsUtils.cipher(newMasterPassword, secret, modal, controller, true);
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
            Yith.settings.set("passGenLength", parseInt(Ember.$(evt.target).val(), 10));
        }
    });
}(Yith, Ember, sjcl, yithServerHost));
;// Source: yithwebclient/static/js/list-views.js


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

            this.get('controller.list_controller.masterModalView').show(function (masterPassword) {
                var secret = that.get("controller.secret"),
                    ui;

                try {
                    secret = Yith.ViewsUtils.decipher(masterPassword, secret);
                } catch (err) {
                    return false;
                }
                masterPassword = null;
                ui = that.getUIElems(Ember.$(evt.target));
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
}(Yith, Ember));
;// Source: yithwebclient/static/js/edit-views.js


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
                    return that.get('controller.controllers.passwordsIndex.allTags');
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
}(Yith, Ember));
