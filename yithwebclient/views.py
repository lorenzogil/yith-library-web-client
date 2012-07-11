from pyramid.view import view_config

@view_config(route_name='home', renderer='templates/mytemplate.pt')
def my_view(request):
    return {'project':'yith-web-client'}

@view_config(route_name='list', renderer='list.mak')
def list_passwords(request):
    return {}
