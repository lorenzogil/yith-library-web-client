<%inherit file="base.mak"/>

<%def name="title()">Welcome!</%def>

<%def name="mainbody()">
    <div id="page" class="container">
        <div class="row">
            <div class="span7">
                <div class="hero-unit">
                    <h1>Yith Library</h1>
                    <p>Secure service to store your passwords ciphered under a master password.</p>
                    <p>
                        <a href="${server_authorization_endpoint}" class="btn btn-primary btn-large pull-right">Enter</a>
                    </p>
                </div>
                <blockquote>
                    <p>I couldn't live a week without a private library.</p>
                    <small>H. P. Lovecraft</small>
                </blockquote>
            </div>
            <div class="span4 offset1">
                <img src="${request.static_path('yithwebclient:static/img/yithian.png')}" alt="Yithian" title="Yithian"/>
            </div>
        </div>
    </div>

    <div class="modal hide" id="credits">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">&times;</button>
            <h3>Credits</h3>
        </div>
        <div class="modal-body">
            <p>Yith Library is copyright of:
                <ul>
                    <li><a href="http://mensab.com" target="_blank">Alejandro Blanco</a> &lt;alejandro.b.e at gmail.com&gt;</li>
                    <li><a href="http://lorenzogil.com/" target="_blank">Lorenzo Gil</a> &lt;lorenzo.gil.sanchez at gmail.com&gt;</li>
                    <li><a href="http://www.yaco.es" target="_blank">Yaco Sistemas S.L.</a></li>
                </ul>
                And is licensed under the terms of the <a href="http://www.gnu.org/licenses/agpl.html" target="_blank">GNU Affero General Public License</a>.
            </p>
            <hr />
            <p>Yithian image is copyright of <a href="http://narizpuntiaguda.com/" target="_blank">Isaac (Ismurg)</a> &lt;ismurg at gmail.com&gt; under the terms of the <a href="http://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC BY-SA 3.0</a></p>
            <hr />
            <p>Icons from <a href="http://glyphicons.com" target="_blank">Glyphicons Free</a> - <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a></p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" data-dismiss="modal">Close</a>
        </div>
    </div>
</%def>

<%def name="extrabody()">
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