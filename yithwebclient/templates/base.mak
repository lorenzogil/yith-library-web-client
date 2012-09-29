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
    ${self.mainbody()}

    <footer class="container">
        <ul class="pull-left">
            <li><a href="https://github.com/Yaco-Sistemas/yith-library-web-client" target="_blank">Fork us in GitHub!</a></li>
        </ul>
        <ul class="pull-right">
            <li><a href="#" id="creditsButton">Credits</a></li>
        </ul>
    </footer>

    <!-- The missing protocol means that it will match the current protocol, either http or https. If running locally, we use the local jQuery. -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src=\'${request.static_path("yithwebclient:static/js/libs/jquery-1.7.2.min.js")}\'><\/script>')</script>
    <script src="${request.static_path('yithwebclient:static/js/libs/bootstrap.min.js')}"></script>

    ${self.extrabody()}

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

<%def name="title()"/>
<%def name="extraheader()"/>
<%def name="mainbody()"/>
<%def name="extrabody()"/>