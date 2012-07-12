# Yith Library web client
# Copyright (C) 2012  Yaco Sistemas S.L.

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
