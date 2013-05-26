
    <script type="text/x-handlebars" data-template-name="password-list">
            <b>All tags (filter by):</b>
            <ul id="tag-list" class="unstyled">
                {{#each allTags}}
                <li><span class="label pointer" {{action "filterByTag"}}>{{this}}</span></li>
                {{/each}}
            </ul>
            {{#if activeFiltersLength}}
            <div id="filter">
                <b>Active filters:</b>
                {{#each activeFilters}}
                <span class="label pointer" {{action "removeFilter"}}><i class="icon-remove" {{action "removeFilter"}}></i> {{this}}</span>
                {{/each}}
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
                <div {{bindAttr class="isnew:hide :control-group"}} id="modify-secret-group">
                    <a href="#" class="btn" {{action "showSecretGroup"}}>Modify password</a>
                </div>
                <div {{bindAttr class="secretGroupClass"}} id="secret-group">
                    <label class="control-label" for="edit-secret1">{{#if isnew}}<span class="red">*</span> {{/if}}Secret</label>
                    <div class="controls form-inline">
                        <input type="password" id="edit-secret1" class="input-small" {{action "validateSecret" on="keyUp"}}/> <input type="password" id="edit-secret2" class="input-small" {{action "validateSecret" on="keyUp"}} placeholder="Repeat"/> <button class="btn" {{action "generatePassword"}}><i class="icon icon-cog"></i> Generate</button>
                    </div>
                    <span class="help-block match" style="display: none;">The passwords don't match</span>
                    <span class="help-block req" style="display: none;">This field is required</span>
                    <div id="strength-meter">
                        <div class="progressbar"></div><div class="verdict"></div>
                    </div>
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
