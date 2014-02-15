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
            <div class="row" id="top-bar">
                <div class="span3">
                    {{#link-to 'passwords.new' class="btn"}}<i class="icon-plus"></i> Add new password{{/link-to}}
                </div>
                <div class="span9"><div class="pull-right">
                    {{#view Yith.DisableCountdownButton}}Disable countdown{{/view}}
                    {{#view Yith.RememberMasterButton}}Remember master password{{/view}}
                    {{#view Yith.ShowAdvancedButton}}<i class="icon-wrench"></i> Show advanced options{{/view}}
                </div></div>
            </div>
            <div id="advanced-options" class="hide">
                <div class="span12"><div class="well nomb">
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
            <div id="tags-and-filters">
                {{#if allTags.length}}
                    <b>All tags (filter by):</b>
                    <ul id="tag-list" class="unstyled">
                        {{#each allTags}}
                            <li>{{#view Yith.TagButton}}{{this}}{{/view}}</li>
                        {{/each}}
                    </ul>
                {{/if}}
                {{#if activeFilters.length}}
                    <div id="filter">
                        <b>Active filters:</b>
                        {{#each activeFilters}}
                            {{#view Yith.FilterButton}}<i class="icon-remove"></i> {{this}}{{/view}}
                        {{/each}}
                    </div>
                {{/if}}
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
                        {{#each pass in processedPasswordList}}
                            <tr>
                                <td>
                                    {{#view Yith.ServiceButton}}{{pass.service}}{{/view}}
                                    <input type="text" style="display: none;" class="unambiguous input-xlarge" /> <span style="display: none;" ></span><i style="display: none;" class="pointer icon-remove" ></i>
                                </td>
                                <td>{{pass.account}}</td>
                                <td>{{#each pass.tags}}
                                    {{#view Yith.TagButton}}{{this}}{{/view}}
                                {{/each}}</td>
                                <td>
                                    {{#if pass.expiration}}
                                        <span {{bindAttr class="expirationClass"}}>{{pass.daysLeft}}</span>
                                    {{else}}
                                        <span class="badge">Never</span>
                                    {{/if}}
                                </td>
                                <td>
                                    {{#view Yith.NotesButton}}<i class="icon-exclamation-sign"></i> Notes{{/view}}
                                </td>
                                <td>
                                    {{#link-to 'password' pass class="btn btn-warning"}}<i class="icon-white icon-edit"></i> Edit{{/link-to}}
                                </td>
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

        <script type="text/x-handlebars" data-template-name="passwords/new">
            <div class="row"><div class="span12">
                <h3>Add a new password</h3>
                <form class="form-horizontal edit-password">
                    {{partial "edit-password"}}
                    <div class="form-actions">
                        {{#view Yith.SaveButton}}Create{{/view}}
                        <button class="btn" {{action cancelNewPassword}}>Cancel</button>
                    </div>
                </form>
            </div></div>
        </script>

        <script type="text/x-handlebars" data-template-name="password">
            <div class="row"><div class="span12">
                <h3>Edit password</h3>
                <form class="form-horizontal edit-password">
                    {{partial "edit-password"}}
                    <div class="form-actions">
                        {{#view Yith.SaveButton}}Save changes{{/view}}
                        <button class="btn btn-danger" {{action deletePassword}}>Delete password</button>
                        {{#link-to 'passwords' class="btn" activeClass=""}}Cancel{{/link-to}}
                    </div>
                </form>
            </div></div>
        </script>

        <script type="text/x-handlebars" data-template-name="_edit-password">
            <div class="control-group">
                <label class="control-label" for="edit-service">
                    <span class="red">*</span> Service
                </label>
                <div class="controls">
                    <input type="text" id="edit-service" {{bindAttr value="service"}} {{action checkEmptiness on="change"}}/>
                    <span class="help-block" style="display: none;">This field is required</span>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="edit-account">Account</label>
                <div class="controls">
                    <input type="text" id="edit-account" {{bindAttr value="account"}}/>
                </div>
            </div>

            {{view Yith.SecretGroup}}

            <div class="control-group">
                <div class="controls form-inline">
                    <label class="checkbox">
                        <input type="checkbox" id="edit-enable-expiration" {{bindAttr checked="expirationActive"}} {{action expirationToggle on="change"}} /> Expirate in
                    </label> <input type="number" id="edit-expiration" class="input-mini" min="0" {{bindAttr disabled="expirationDisabled"}} {{bindAttr value="daysLeft"}} /> days
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="edit-tags">Tags</label>
                <div class="controls">
                    {{view Yith.TagsInput}}
                    <ul>
                        {{#each tag in provisionalTags}}
                            <li>{{tag}} <i class="icon-remove pointer" {{action "removeTag" tag}}></i></li>
                        {{/each}}
                    </ul>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="edit-notes">Notes</label>
                <div class="controls">
                    {{view Ember.TextArea id="edit-notes" class="input-xlarge" rows="3" valueBinding="notes"}}
                </div>
            </div>
        </script>

        <script type="text/x-handlebars" data-template-name="secret-group">
            {{#if modifySecret}}
                <div class="control-group" id="secret-group">
                    <label class="control-label" for="edit-secret1">
                        <span class="red">*</span> Secret</label>
                    </label>
                    <div class="controls form-inline">
                        <input type="password" id="edit-secret1" class="input-small edit-secret" /> <input type="password" id="edit-secret2" class="input-small edit-secret" placeholder="Repeat"/>
                        {{#view Yith.GenerateSecretButton}}<i class="icon icon-cog"></i> Generate{{/view}}

                        <span class="help-block match" style="display: none;">The passwords don't match</span>
                        <span class="help-block req" style="display: none;">This field is required</span>
                        <div id="strength-meter">
                            <div class="progressbar"></div><div class="verdict"></div>
                        </div>
                    </div>
                </div>
            {{else}}
                <div class="control-group"><div class="controls">
                    <button class="btn" id="show-secret-group">Modify password</button>
                </div></div>
            {{/if}}
        </script>

        <script type="text/x-handlebars" data-template-name="tags-input">
            <div class="input-append">
                <input type="text" autocomplete="off" /><button class="btn"><i class="icon icon-plus"></i> Add</button>
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
    <script src="${request.static_path('yithwebclient:static/js/libs/jquery-2.0.3.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/bootstrap-2.3.3.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/handlebars-1.0.0.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/ember-1.0.0.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/ember-data-1.0.0-beta.2.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/pwstrength-bootstrap-1.1.0.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/sjcl.min.js')}"></script>
    % if debug_js:
        <script src="${request.static_path('yithwebclient:static/js/app.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/objects.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/models.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/controllers.js')}"></script>
        <script src="${request.static_path('yithwebclient:static/js/views.js')}"></script>
    % else:
        <script src="${request.static_path('yithwebclient:static/js/prod/yith-1.0.0.min.js')}"></script>
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
