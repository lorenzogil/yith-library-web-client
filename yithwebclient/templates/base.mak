<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Yith Library - ${self.title()}</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="${request.static_path('yithwebclient:static/favicon.ico')}" />
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/css/bootstrap.min.css')}">
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/css/style.css')}">

    <!--[if lt IE 9]>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    ${self.extraheader()}
</head>
<body>
    <a href="https://github.com/Yaco-Sistemas/yith-library-web-client" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" alt="Fork me on GitHub"></a>

    ${self.mainbody()}

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
            <hr />
            <p><a href="http://thenounproject.com/noun/browser/#icon-No4038" target="_blank">Browser</a> designed by <a href="http://thenounproject.com/alexstrat" target="_blank">Alexandre Lachèze</a> from The Noun Project - <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a></p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" data-dismiss="modal">Close</a>
        </div>
    </div>

    <footer class="container">
        <ul class="pull-left">
            <li><a href="/tos">Terms of service</a></li>
        </ul>
        <ul class="pull-right">
            <li><a href="${server_host}/contact">Contact</a> |</li>
            <li><a href="#" id="creditsButton">Credits</a></li>
        </ul>
    </footer>

    <!-- The missing protocol means that it will match the current protocol, either http or https. If running locally, we use the local jQuery. -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src=\'${request.static_path("yithwebclient:static/js/libs/jquery-1.7.2.min.js")}\'><\/script>')</script>
    <script src="${request.static_path('yithwebclient:static/js/libs/bootstrap.min.js')}"></script>

    ${self.extrabody()}
</body>
</html>

<%def name="title()"/>
<%def name="extraheader()"/>
<%def name="mainbody()"/>
<%def name="extrabody()"/>