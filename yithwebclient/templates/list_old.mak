<div class="control-group">
    <div class="controls form-inline">
        <label class="checkbox">
            <input type="checkbox" id="edit-enable-expiration" {{bindAttr checked="isExpirationEnabled"}} {{action "enableExpiration" on="change"}}/> Expirate in
        </label> <input type="number" id="edit-expiration" class="input-mini" min="0" {{bindAttr disabled="isExpirationDisabled"}} {{bindAttr value="password.daysLeft"}} /> days
    </div>
</div>
