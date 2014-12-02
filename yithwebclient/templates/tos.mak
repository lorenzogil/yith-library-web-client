<%inherit file="base.mak"/>

<%def name="title()">Terms of service</%def>

<%def name="mainbody()">
    <div class="navbar container"><div class="navbar-inner">
        <a class="brand" href="/list">Yith Library Web Client</a>
    </div></div>

    <div id="page" class="container">
        <h1>Terms of service</h1>

        <div class="row">
            <div class="span6">

            <h2>Free software</h2>

            <p>Yith Library Web Client is free software: you can redistribute it and/or modify
            it under the terms of the GNU Affero General Public License as published by
            the Free Software Foundation, either version 3 of the License, or
            (at your option) any later version.</p>

            <p>Among many things being free software means Yith Library users have four
            essential freedoms:</p>

            <ul>
                <li>The freedom to run the program, for any purpose (freedom 0).</li>
                <li>The freedom to study how the program works, and change it so it
                does your computing as you wish (freedom 1). Access to the
                <a href="https://github.com/ablanco/yith-library-web-client">source
                    code</a> is a precondition for this.</li>
                <li>The freedom to redistribute copies so you can help your
                neighbor (freedom 2).</li>
                <li>The freedom to distribute copies of your modified versions to
                others (freedom 3). By doing this you can give the whole community a
                chance to benefit from your changes. Access to the
                <a href="https://github.com/ablanco/yith-library-web-client">source
                    code</a> is a precondition for this.</li>
            </ul>

            <p>You can read the GNU Affero General Public License at
            <a href="http://www.gnu.org/licenses/agpl.html">http://www.gnu.org/licenses/agpl.html</a>
            </p>

            <h2>Data ownership</h2>

            <p>You own your personal data and all the passwords stored in your account
            belongs only to you.</p>

            <p>You can export such data in a machine readable format any time you want. If
            you want, we will send you a backup of your passwords once a month.</p>

            </div>
            <div class="span6">

            <h2>No warranty</h2>

            <p>Yith Library Web Client is distributed in the hope that it will be useful,
            but WITHOUT ANY WARRANTY; without even the implied warranty of
            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
            GNU General Public License for more details.</p>

            <h2>Cookies usage. No tracking</h2>

            <p>We use cookies for the sole purpose of managing a session for you
            (<em>beaker.session.id</em>) and remembering your identity after you
            succesfully finish the authentication process (<em>auth_tkt</em>).</p>

            <p>Optionally and if you allow it, we use Google Analytics to learn more about
            our users. This way we can optimize Yith Library and priorize our changes
            so you are served better. Knowing our users habits also helps us to
            scale our infrastructure better.</p>

            <h2>Account termination</h2>

            <p>You are free to remove your account and all the data associated with it
            whenever you want. It's a sad event for us but you must have the rights
            to make that decission.</p>

            <h2>We won't sell your data, ever</h2>

            <p>We don't sell your data to any third party company. We do this just for
            fun and because we believe a web password manager is needed to make the
            Internet a safer place.</p>

            </div>
        </div>

        <p class="well">Sorry if some of these terms are a little imprecise and
            sloppy. We are hackers, not lawyers. If in doubt,
            <a href="${server_host}/contact">just drop us a line</a>.</p>

    </div>
</%def>

<%def name="extrabody()">
    <!-- The missing protocol means that it will match the current protocol, either http or https. If running locally, we use the local jQuery. -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src=\'${request.static_path("yithwebclient:static/vendor/jquery/jquery.js")}\'><\/script>')</script>
    <script src="${request.static_path('yithwebclient:static/vendor/bootstrap/bootstrap.js')}"></script>
    <script type="text/javascript">
        Yith = {};
        $(document).ready(function () {
            Yith.creditsModal = $("#credits");
            Yith.creditsModal.modal({ show: false });
            $("#creditsButton").click(function () {
                Yith.creditsModal.modal("show");
            });
        });
    </script>
</%def>
