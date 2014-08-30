/*jslint browser: true */
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
