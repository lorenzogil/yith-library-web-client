// Yith Library web client - GNU Affero General Public License version 3
// Copyright (C) 2012  Yaco Sistemas S.L.
// Copyright (C) 2012  Alejandro Blanco

Yith.ajax = {};
        error: function (XHR, textStatus, errorThrown) {
            $("#error").modal({ keyboard: false, backdrop: "static" });
            $("#error").find(".failure").removeClass("hide");
            setTimeout(function () {
                window.open("/list", "_self");
            }, 4000);
