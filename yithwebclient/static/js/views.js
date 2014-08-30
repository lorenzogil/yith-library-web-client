/*jslint browser: true, nomen: true */
/*global Ember, Yith, sjcl, yithServerHost */

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
                this.done();
            } else {
                this.get('$root').modal('show');
            }
        },

        done: function () {
            var values = [],
                success;

            this.$('input').each(function (idx, input) {
                values[idx] = Ember.$(input).val();
            });
            success = this.get('callback').apply(window, values);
            if (success) {
                if (Yith.settings.get('rememberMaster') && values[0] !== '') {
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
