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

import sys
PY3 = sys.version_info[0] == 3

if PY3:
    from urllib.parse import urlencode
else:
    from urllib import urlencode

from pyramid.httpexceptions import HTTPFound, HTTPUnauthorized
from pyramid.view import view_config

import requests

from yithwebclient.tlsadapter import TLSv1Adapter

requests_session = requests.Session()
requests_session.mount('https://', TLSv1Adapter())


@view_config(route_name='index', renderer='index.mak')
def index(request):
    params = urlencode({
        'response_type': 'code',
        'client_id': request.registry.settings['yith_client_id'],
        'scope': 'read-passwords write-passwords read-userinfo',
    })
    server_host = request.registry.settings['yith_server']
    url = "%s/oauth2/endpoints/authorization" % server_host
    return {
        'server_authorization_endpoint': url + '?' + params,
        'server_host': server_host,
    }


@view_config(route_name='oauth2cb')
def oauth2cb(request):
    url = ("%s/oauth2/endpoints/token" %
           request.registry.settings['yith_server'])
    payload = 'grant_type=authorization_code&code=%s' % request.GET.get('code')
    basic_auth = (request.registry.settings['yith_client_id'],
                  request.registry.settings['yith_client_secret'])
    ssl_verify = request.registry.settings['ssl_verify']
    response = requests_session.post(url, data=payload, auth=basic_auth, verify=ssl_verify)
    data = response.json()

    # backwards compatible since the server changed this attribute
    # from 'access_code' to 'access_token'
    request.session['access_code'] = data.get('access_token',
                                              data.get('access_code'))

    return HTTPFound(location=request.route_path('list'))


@view_config(route_name='token', renderer='json')
def get_token(request):
    if 'access_code' in request.session:
        return {'access_code': request.session['access_code']}
    else:
        return HTTPUnauthorized()


@view_config(route_name='logout', renderer='json')
def logout(request):
    request.session['access_code'] = None
    return HTTPFound(location='%s/logout' %
                     request.registry.settings['yith_server'])


@view_config(route_name='list', renderer='list.mak')
def list_passwords(request):
    google_analytics = None
    if 'yith_google_analytics' in request.registry.settings:
        if (not 'allow_google_analytics' in request.session and
                'access_code' in request.session):
            url = "%s/user" % request.registry.settings['yith_server']
            headers = {
                'Authorization': "Bearer %s" % request.session['access_code']}
            ssl_verify = request.registry.settings['ssl_verify']
            response = requests_session.get(url, headers=headers, verify=ssl_verify)
            request.session['allow_google_analytics'] = (
                response.json().get('allow_google_analytics', False))
        if ('allow_google_analytics' in request.session and
                request.session['allow_google_analytics']):
            google_analytics = (
                request.registry.settings['yith_google_analytics'])
    return {'server_host': request.registry.settings['yith_server'],
            'client_id': request.registry.settings['yith_client_id'],
            'google_analytics': google_analytics,
            'debug_js': request.registry.settings['yith_debug'] }


@view_config(route_name='tos', renderer='tos.mak')
def tos(request):
    return {'server_host': request.registry.settings['yith_server'], }
