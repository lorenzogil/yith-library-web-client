<%inherit file="base.mak"/>

<%def name="title()">Welcome!</%def>

<%def name="mainbody()">
    <a href="https://github.com/ablanco/yith-library-web-client" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" alt="Fork me on GitHub"></a>
    <div id="page" class="container">
        <div class="row">
            <div class="span7">
                <div class="hero-unit">
                    <h1>Yith Library</h1>
                    <p>Secure service to store your passwords ciphered under a master password.</p>
                    <p>
                        <a href="${server_authorization_endpoint}" class="btn btn-primary btn-large"><strong>Enter</strong></a>
                        <a href="${server_host}" class="btn btn-large">How it works</a>
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
    <!-- The missing protocol means that it will match the current protocol, either http or https. If running locally, we use the local jQuery. -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src=\'${request.static_path("yithwebclient:static/vendor/jquery/jquery.js")}\'><\/script>')</script>
    <script src="${request.static_path('yithwebclient:static/vendor/bootstrap/bootstrap.js')}"></script>
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
