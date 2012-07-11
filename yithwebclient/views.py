from pyramid.httpexceptions import HTTPFound
from pyramid.view import view_config

import requests

@view_config(route_name='index', renderer='index.mak')
def index(request):
    url = request.registry.settings['yith.server'] + "/oauth2/endpoints/authorization?response_type=code&client_id=" + request.registry.settings['yith.client_id']
    return {'server_authorization_endpoint': url}

@view_config(route_name='oauth2cb')
def oauth2cb(request):
    url = request.registry.settings['yith.server'] + "/oauth2/endpoints/token"
    payload = 'grant_type=authorization_code&code=' + request.GET.get('code')
    basic_auth = (request.registry.settings['yith.client_id'], request.registry.settings['yith.client_secret'])
    response = requests.post(url, data=payload, auth=basic_auth)

    data = response.json

    session = request.session
    session['access_code'] = data['access_code']
    return HTTPFound(location=request.route_url('list'))

@view_config(route_name='token', renderer='json')
def get_token(request):
    access_code = request.session['access_code']
    return {'access_code': access_code}

@view_config(route_name='list', renderer='list.mak')
def list_passwords(request):
    return {'server_host': request.registry.settings['yith.server']}
