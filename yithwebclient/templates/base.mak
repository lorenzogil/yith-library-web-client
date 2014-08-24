<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Yith Library - ${self.title()}</title>
    <meta name="description" content="A free online secure password manager">
    <meta name="author" content="Alejandro Blanco">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="${request.static_path('yithwebclient:static/favicon.ico')}" />
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/vendor/bootstrap/bootstrap.css')}">
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/vendor/fontawesome/font-awesome.css')}">
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/css/style-dd5ea40f32fa4078dc47abccaecfe986.css')}">

    <!--[if lt IE 9]>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    ${self.extraheader()}
</head>
<body>
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
            <p>Icons from <a href="http://fontawesome.io/" target="_blank">Font Awesome</a> - <a href="http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&amp;id=OFL" target="_blank">SIL OFL 1.1</a> &amp; <a href="http://opensource.org/licenses/mit-license.html">MIT License</a></p>
            <hr />
            <p><a href="http://thenounproject.com/noun/browser/#icon-No4038" target="_blank">Browser</a> designed by <a href="http://thenounproject.com/alexstrat" target="_blank">Alexandre Lachèze</a> from The Noun Project - <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a></p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" data-dismiss="modal">Close</a>
        </div>
    </div>

    <footer class="container">
        <ul class="pull-left">
            <li><a href="${server_host}/faq" target="_blank">FAQ</a> |</li>
            <li><a href="/tos">Terms of service</a> |</li>
            <li><a href="${server_host}/contact" target="_blank">Contact</a> |</li>
            <li><a href="#" id="creditsButton">Credits</a></li>
        </ul>
        <ul class="pull-right">
            <li><a href="https://twitter.com/YithLibrary" target="_blank">Follow me on Twitter</a> |</li>
            <li><a href="https://github.com/Yaco-Sistemas/yith-library-web-client" target="_blank">Fork me on GitHub</a></li>
        </ul>
    </footer>

    ${self.extrabody()}
</body>
</html>

<%def name="title()"/>
<%def name="extraheader()"/>
<%def name="mainbody()"/>
<%def name="extrabody()"/>
