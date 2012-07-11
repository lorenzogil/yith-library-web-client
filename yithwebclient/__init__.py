from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """

    # Session
    session_factory = UnencryptedCookieSessionFactoryConfig('necronomicon')

    config = Configurator(settings=settings, session_factory=session_factory)
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Routes
    config.add_route('index', '/')
    config.add_route('oauth2cb', '/oauth2cb')
    config.add_route('token', '/token')
    config.add_route('list', '/list')

    config.scan()
    return config.make_wsgi_app()
