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
                {{outlet}}
            </div>
        </script>

        <script type="text/x-handlebars" data-template-name="passwords">
            <div class="row">
                <div class="span3">
                    <a class="btn" href="/new"><i class="icon-plus"></i> Add new password</a>
                </div>
                <div class="span9"><div class="pull-right">
                    {{#view Yith.DisableCountdownButton}}Disable countdown{{/view}}
                    {{#view Yith.RememberMasterButton}}Remember master password{{/view}}
                    {{#view Yith.ShowAdvancedButton}}<i class="icon-wrench"></i> Show advanced options{{/view}}
                </div></div>
            </div>
            <div id="advanced-options" class="hide">
                <div class="span12"><div class="well">
                    <div class="row">
                        <div class="span5 alert alert-info nomb">
                            <p>We use cookies to collect anonymous statistics
                            about the usage of Yith Library to help us improve.
                            You can choose to allow this or not:</p>
                            {{#view Yith.ServerPreferencesButton}}Open preferences{{/view}}
                        </div>
                        <div id="settingsRight" class="span5">
                            <p>{{#view Yith.ChangeMasterButton}}Change master password{{/view}}</p>
                            <b>Password generation</b>
                            <div class="row">
                                <div class="span3">
                                    <label class="checkbox">
                                        {{view Ember.Checkbox checkedBinding="Yith.settings.passGenUseSymbols"}} Use symbols
                                    </label>
                                    <label class="checkbox">
                                        {{view Ember.Checkbox checkedBinding="Yith.settings.passGenUseNumbers"}} Use numbers
                                    </label>
                                    <label class="checkbox">
                                        {{view Ember.Checkbox checkedBinding="Yith.settings.passGenUseChars"}} Use characters
                                    </label>
                                </div>
                                <div class="span2">
                                    <label>Password length</label>
                                    {{view Yith.PasswordLengthInput}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div></div>
            </div>
            {{outlet}}
        </script>

        <script type="text/x-handlebars" data-template-name="passwords/index">
            <div>
                <b>All tags (filter by):</b>
                <ul id="tag-list" class="unstyled">
                    {{#each allTags}}
                    <li>{{#view Yith.TagButton}}{{this}}{{/view}}</li>
                    {{/each}}
                </ul>
            </div>
            <div class="row password-list">
            {{#if content}}
                <div class="span12">
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
                        {{#each controller}}
                            <tr {{bindAttr id="id"}}>
                                <td>
                                    {{#view Yith.ServiceButton}}{{service}}{{/view}}
                                    <input type="text" style="display: none;" class="unambiguous input-xlarge" /> <span style="display: none;" ></span><i style="display: none;" class="pointer icon-remove" >&times;</i>
                                </td>
                                <td>{{account}}</td>
                                <td>{{#each tags}}
                                <span class="label pointer" {{action "filterByTag"}}>{{this}}</span>
                                {{/each}}</td>
                                <td>
                                    {{#if expiration}}
                                    <span {{bindAttr class="expirationClass"}}>{{daysLeft}}</span>
                                    {{else}}
                                    <span class="badge">Never</span>
                                    {{/if}}
                                </td>
                                <td>{{#view Yith.NotesButton}}<i class="icon-exclamation-sign"></i> Notes{{/view}}</td>
                                <td><button class="btn btn-warning" {{action "edit"}}><i class="icon-white icon-edit"></i> Edit</button></td>
                            </tr>
                        {{/each}}
                    </tbody>
                    </table>
                </div>
            {{else}}
                <div class="span6 offset3">
                    <div class="alert alert-info">
                        <h3>No passwords stored yet</h3>
                        <p>Please, add a password using the button.</p>
                    </div>
                </div>
            {{/if}}
            </div>
        </script>
    </%text>

    <div class="modal hide" id="master">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">&times;</button>
            <h3>Master Password</h3>
        </div>
        <div class="modal-body">
            <form>
                <label for="master-password" class="change-master">Old password</label>
                <input type="password" id="master-password"/>
                <label for="new-master-password" class="change-master">New password</label>
                <input type="password" id="new-master-password" class="change-master" style="display: none;"/>
            </form>
            <div class="alert alert-error" id="master-error" style="display: none;">
                <h4>Wrong password!</h4>
                That's not your master password, try another.
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal">Cancel</a>
            <a href="#" class="btn btn-primary" id="master-done">Accept</a>
        </div>
    </div>

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
    <script src="${request.static_path('yithwebclient:static/js/libs/handlebars-1.0.0-rc.4.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/ember-1.0.0-rc.4.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/ember-data-0.13.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/pwstrength.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/sjcl.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/app.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/objects.js')}"></script>
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
