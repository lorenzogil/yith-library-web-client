import os

#from paste.deploy import loadapp
from waitress import serve


def application(environ, start_response):
    start_response('301 Moved Permanently', [('Location','https://desktop.yithlibrary.com')])
    return ['']


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    scheme = os.environ.get("SCHEME", "https")
    #app = loadapp('config:production.ini', relative_to='.')

    serve(application, host='0.0.0.0', port=port, url_scheme=scheme)
