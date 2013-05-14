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
