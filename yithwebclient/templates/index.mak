<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Yith Library - Welcome!</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="shortcut icon" href="${request.static_path('yithwebclient:static/favicon.ico')}" />
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/css/bootstrap.css')}">
    <link rel="stylesheet" href="${request.static_path('yithwebclient:static/css/style.css')}">

    <!--[if lt IE 9]>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body>
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

    <div id="footer">
        <ul class="pull-left">
            <li><a href="https://github.com/Yaco-Sistemas/yith-library-web-client" target="_blank">Fork us in GitHub!</a></li>
        </ul>
        <ul class="pull-right">
            <li>Icons from <a href="http://glyphicons.com" target="_blank">Glyphicons Free</a> - <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a></li>
        </ul>
    </div>

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