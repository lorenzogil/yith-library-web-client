<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Yith Library - Your passwords</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="${request.static_path('yithwebclient:static/favicon.ico')}" />
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/css/bootstrap.min.css')}">
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/css/style.css')}">

    <!--[if lt IE 9]>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <script type="text/javascript">
        var yithServerHost = "${server_host}";
    </script>
</head>
<body>
    <%text>
    <script type="text/x-handlebars" data-template-name="password-list">
        {{#if passwordListLength }}
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
                {{#each sortedPasswordList}}
                    <tr {{bindAttr id="_id"}}>
                        <td>
                            <button class="btn btn-info" {{action "getPassword"}}>{{service}}</button>
                            <input type="text" style="display: none;" class="input-medium" /> <span style="display: none;" ></span>
                        </td>
                        <td>{{account}}</td>
                        <td>{{#each tags}}
                        <span class="label">{{this}}</span>
                        {{/each}}</td>
                        <td>
                            {{#if expiration}}
                            <span {{bindAttr class="expirationClass"}}>{{daysLeft}}</span>
                            {{else}}
                            <span class="badge">Never</span>
                            {{/if}}
                        </td>
                        <td><button {{bindAttr class="notesClass"}} {{action "notes" on="mouseEnter"}} ><i class="icon-exclamation-sign"></i> Notes</button></td>
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
    </script>
    <script type="text/x-handlebars" data-template-name="password-edit">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">&times;</button>
            {{#if isnew}}
            <h3>Add new password</h3>
            {{else}}
            <h3>Edit password</h3>
            {{/if}}
        </div>
        <div class="modal-body" id="edit-body">
            <form>
                <div class="control-group">
                    <label class="control-label" for="edit-service"><span class="red">*</span> Service</label>
                    <input type="text" id="edit-service" {{bindAttr value="password.service"}} {{action "checkEmptiness" on="change"}}/>
                    <span class="help-block" style="display: none;">This field is required</span>
                </div>
                <label for="edit-account">Account</label>
                <input type="text" id="edit-account" {{bindAttr value="password.account"}}/>
                <div class="control-group">
                    <label class="control-label" for="edit-secret1">{{#if isnew}}<span class="red">*</span> {{/if}}Secret</label>
                    <div class="controls form-inline">
                        <input type="password" id="edit-secret1" class="input-small" {{action "validateSecret" on="keyUp"}}/> <input type="password" id="edit-secret2" class="input-small" {{action "validateSecret" on="keyUp"}} placeholder="Repeat"/> <button class="btn hide"><i class="icon icon-cog"></i> Generate</button>
                    </div>
                    <span class="help-block match" style="display: none;">The passwords don't match</span>
                    <span class="help-block req" style="display: none;">This field is required</span>
                </div>
                <div class="control-group">
                    <div class="controls form-inline">
                        <label class="checkbox">
                            <input type="checkbox" id="edit-enable-expiration" {{bindAttr checked="isExpirationEnabled"}} {{action "enableExpiration" on="change"}}/> Expirate in
                        </label> <input type="number" id="edit-expiration" class="input-mini" min="0" {{bindAttr disabled="isExpirationDisabled"}} {{bindAttr value="password.daysLeft"}} /> days
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="edit-tags">Tags</label>
                    <div class="controls">
                        <div class="input-append">
                            <input type="text" id="edit-tags" autocomplete="off" /><button class="btn" {{action "addTag"}}><i class="icon icon-plus"></i> Add</button>
                        </div>
                        <ul>
                        {{#each tag in password.provisionalTags}}
                            <li>{{tag}} <i class="icon-remove pointer" {{action "removeTag" context="tag"}}></i></li>
                        {{/each}}
                        </ul>
                    </div>
                </div>
                <label for="edit-notes">Notes</label>
                <textarea id="edit-notes" class="input-xlarge" rows="3" {{bindAttr value="password.notes"}}></textarea>
            </form>
        </div>
        <div class="modal-footer">
            {{#unless isnew}}
            <a href="#" class="btn btn-danger pull-left" {{action "deletePassword"}}>Delete</a>
            {{/unless}}
            <a href="#" class="btn" data-dismiss="modal">Close</a>
            {{#if isnew}}
            <a href="#" class="btn btn-primary" {{action "createPassword"}}>Create</a>
            {{else}}
            <a href="#" class="btn btn-primary" {{action "saveChanges"}}>Save changes</a>
            {{/if}}
        </div>
    </script>
    </%text>

    <div id="page" class="container">
        <div class="row">
            <div class="span12">
                <h1>Yith Library</h1>
            </div>
        </div>
        <div class="row">
            <div class="span7">
                <button class="btn" onclick="Yith.addNewPassword();"><i class="icon-plus"></i> Add new password</button>
            </div>
            <div class="span4">
                <button class="btn pull-right" id="change-master">Change master password</button>
            </div>
            <div class="span1">
                <button class="btn btn-inverse pull-right" id="logout">Logout</button>
            </div>
        </div>
        <div class="row password-list"></div>
        <div class="row">
            <div class="span4 offset4 progress progress-striped active">
                <div class="bar" style="width: 30%;"></div>
            </div>
        </div>
    </div>

    <div class="modal fade hide" id="edit"></div>

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

    <footer class="container">
        <ul class="pull-left">
            <li><a href="https://github.com/Yaco-Sistemas/yith-library-web-client" target="_blank">Fork us in GitHub!</a></li>
        </ul>
        <ul class="pull-right">
            <li>Icons from <a href="http://glyphicons.com" target="_blank">Glyphicons Free</a> - <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a></li>
        </ul>
    </footer>

    <!-- The missing protocol means that it will match the current protocol, either http or https. If running locally, we use the local jQuery. -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src=\'${request.static_path("yithwebclient:static/js/libs/jquery-1.7.2.min.js")}\'><\/script>')</script>
    <script src="${request.static_path('yithwebclient:static/js/libs/ember-0.9.8.1.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/bootstrap.min.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/libs/sjcl.js')}"></script>
    <script src="${request.static_path('yithwebclient:static/js/app.js')}"></script>
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
</body>
</html>