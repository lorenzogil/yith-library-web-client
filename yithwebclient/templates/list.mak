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

    <script type="text/x-handlebars" data-template-name="passwords/index">
        <%include file="passwordsIndex.hbs"/>
    </script>
    <script type="text/x-handlebars" data-template-name="passwords/new">
        <%include file="passwordsNew.hbs"/>
    </script>
    <script type="text/x-handlebars" data-template-name="passwords/edit">
        <%include file="passwordsEdit.hbs"/>
    </script>
    <script type="text/x-handlebars" data-template-name="_edit-password">
        <%include file="passwordsEditForm.hbs"/>
    </script>
    <script type="text/x-handlebars" data-template-name="secret-group">
        <%include file="secretGroup.hbs"/>
    </script>
    <script type="text/x-handlebars" data-template-name="master-modal">
        <%include file="masterModal.hbs"/>
    </script>

    <%text>
        <script type="text/x-handlebars">
            <div id="page" class="container">
                {{outlet}}
            </div>
        </script>

        <script type="text/x-handlebars" data-template-name="tags-input">
            <div class="input-append">
                <input type="text" autocomplete="off" /><button class="btn"><i class="fa fa-plus"></i> Add</button>
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

    <div class="modal hide" id="confirm-modal">
        <div class="modal-header">
            <h3>Are you sure?</h3>
        </div>
        <div class="modal-body">
            <p>This action can not be reversed. If you delete the password, you won't be able to restore it.</p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal">Cancel</a>
            <a href="#" class="btn btn-danger" id="confirm-delete">Delete</a>
        </div>
    </div>

    <div class="contribute">
        <a href="${server_host}/contribute" target="_blank">Contribute</a>
    </div>
</%def>

<%def name="extrabody()">
    % if debug_js:
        <script src="${request.static_path('yithwebclient:static/vendor/jquery/jquery.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/vendor/bootstrap/bootstrap.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/vendor/handlebars/handlebars.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/vendor/ember/ember.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/vendor/ember-data/ember-data.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/vendor/pwstrength-bootstrap/pwstrength-bootstrap-1.2.1.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/vendor/sjcl/sjcl.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/app.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/objects.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/views.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/models.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/controllers.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/edit-controllers.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/list-views.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/edit-views.js')}"></script>
    % else:
        <script src="${request.static_path('yithwebclient:static/js/prod/vendor.min.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/vendor/ember-data/ember-data.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/prod/yith-1.1.3.min.js')}"></script>
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
