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