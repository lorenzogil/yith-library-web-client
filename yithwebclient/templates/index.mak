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
</head>
<body>
    <a href="${server_authorization_endpoint}" class="btn btn-primary btn-large">Login</a>
</body>
</html>