<%inherit file="base.mak"/>

<%def name="title()">Your passwords</%def>

<%def name="extraheader()">
    <link href='//fonts.googleapis.com/css?family=Source+Code+Pro' rel='stylesheet' type='text/css'>
    <script type="text/javascript">
        var yithServerHost = "${server_host}",
            yithClientId = "${client_id}";
    </script>
</%def>

<%def name="mainbody()">
    <div class="navbar container"><div class="navbar-inner">
        <a class="brand" href="/list">Yith Library Web Client</a>
        <ul class="nav pull-right">
            <li><a href="${server_host}/profile">Profile</a></li>
            <li><a href="/logout">Log out</a></li>
        </ul>
    </div></div>

    <div id="loading" class="container"><div class="row">
        <div class="span4 offset4 progress progress-striped active">
            <div class="bar" style="width: 10%;"></div>
        </div>
    </div></div>

    <%text>
        <script type="text/x-handlebars">
            <div id="page" class="container">
                <div id="settings"></div>
                <div class="row password-list">
                    {{outlet}}
                </div>
            </div>
        </script>

        <script type="text/x-handlebars" data-template-name="passwords">
            {{outlet}}
        </script>

        <script type="text/x-handlebars" data-template-name="passwords/index">
            <div {{bindAttr class="passwordListClass"}}>
                <table class="table table-striped passwords">
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Account</th>
                        <th>Tags</th>
                        <th>Expiration</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {{#each content}}
                        a
                    {{/each}}
                </tbody>
                </table>
            </div>
            <div {{bindAttr class="noPasswordsClass"}}>
                <div class="alert alert-info">
                    <h3>No passwords stored yet</h3>
                    <p>Please, add a password using the button.</p>
                </div>
            </div>
        </script>
    </%text>

    <div class="modal hide" id="error">
        <div class="modal-header">
            <h3 class="access hide">Session expired</h3>
            <h3 class="failure hide">Something failed</h3>
        </div>
        <div class="modal-body">
            <div class="alert alert-error access hide">
                <h4>You are about to logout</h4>
                In a few seconds you'll be redirected to the welcome page to login again.
            </div>
            <div class="alert alert-error failure hide">
                <h4>Don't panic!</h4>
                The page will refresh in a few seconds. Everything will be ok, you may loose the lastest changes though.
            </div>
        </div>
    </div>
</%def>

<%def name="extrabody()">
    % if debug:
    <script src="${request.static_path('yithwebclient:static/js/libs/jquery-1.9.1.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/bootstrap.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/handlebars-1.0.0-rc.3.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/ember-1.0.0-rc.2.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/ember-data.ef6f7534ae8a4070a3caa334eb366c79702118a5.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/pwstrength.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/sjcl.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/app.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/models.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/controllers.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/views.js')}"></script>
    % else:
    <script src="${request.static_path('yithwebclient:static/js/yith.min.js')}"></script>
    % endif

    % if google_analytics is not None:
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', '${google_analytics}']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    </script>
    % endif
</%def>
