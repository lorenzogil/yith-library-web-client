<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title></title>
    <meta name="description" content="">
    <meta name="author" content="">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="${request.static_url('yithwebclient:static/favicon.ico')}" />
    <link rel="stylesheet" href="${request.static_url('yithwebclient:static/css/bootstrap.css')}">
    <link rel="stylesheet" href="${request.static_url('yithwebclient:static/css/style.css')}">

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
        <table class="table table-striped">
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
            {{#each passwordList}}
                <tr>
                    <td><button class="btn btn-info" {{action "getPassword"}}>{{service}}</button></td>
                    <td>{{account}}</td>
                    <td>{{#each tags}}
                    <span class="label">{{this}}</span>
                    {{/each}}</td>
                    <td><span class="badge badge-success">{{daysLeft}}</span></td>
                    <td><button class="btn" {{action "notes"}}><i class="icon-exclamation-sign"></i> Notes</button></td>
                    <td><button class="btn btn-warning" {{action "edit"}}><i class="icon-white icon-edit"></i> Edit</button></td>
                </tr>
            {{/each}}
        </tbody>
        </table>
    </script>
    <script type="text/x-handlebars" data-template-name="password-edit">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">&times;</button>
            <h3>Edit password</h3>
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
                    <label class="control-label" for="edit-secret1"><span class="red">*</span> Secret</label>
                    <div class="controls form-inline">
                        <input type="password" id="edit-secret1" class="input-small" {{action "validateSecret" on="change"}}/> <input type="password" id="edit-secret2" class="input-small" {{action "validateSecret" on="change"}} placeholder="Repeat"/> <button class="btn"><i class="icon icon-cog"></i> Generate</button>
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
                            <input type="text" id="edit-tags" /><button class="btn" {{action "addTag"}}><i class="icon icon-plus"></i> Add</button>
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
            <a href="#" class="btn btn-danger left" {{action "deletePassword"}}>Delete</a>
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
        <h1>Yith Library</h1>
        <button class="btn" onclick="Yith.addNewPassword();"><i class="icon-plus"></i> Add new password</button>
    </div>

    <div class="modal fade hide" id="notes">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">&times;</button>
            <h3>Notes</h3>
        </div>
        <div class="modal-body">
            <p class="viewport"></p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal">Close</a>
        </div>
    </div>

    <div class="modal fade hide" id="edit"></div>

    <div class="modal hide" id="master">
        <div class="modal-header">
            <h3>Master Password</h3>
        </div>
        <div class="modal-body">
            <form>
                <input type="password" id="master-password"/>
            </form>
            <div class="alert alert-error" id="master-error" style="display: none;">
                <h4>Wrong password!</h4>
                That's not the master password used to cipher this password, try another.
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" id="master-done">Accept</a>
        </div>
    </div>

    <!-- The missing protocol means that it will match the current protocol, either http or https. If running locally, we use the local jQuery. -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src=\'${request.static_url("yithwebclient:static/js/libs/jquery-1.7.2.min.js")}\'><\/script>')</script>
    <script src="${request.static_url('yithwebclient:static/js/libs/ember-0.9.8.1.min.js')}"></script>
    <script src="${request.static_url('yithwebclient:static/js/libs/bootstrap.min.js')}"></script>
    <script src="${request.static_url('yithwebclient:static/js/libs/sjcl.js')}"></script>
    <script src="${request.static_url('yithwebclient:static/js/app.js')}"></script>
</body>
</html>
