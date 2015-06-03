# Yith Library Server is a password storage server.
# Copyright (C) 2015 Lorenzo Gil Sanchez <lorenzo.gil.sanchez@gmail.com>
#
# This file is part of Yith Library Server.
#
# Yith Library Server is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Yith Library Server is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Yith Library Server.  If not, see <http://www.gnu.org/licenses/>.

import os
import os.path

from paste.deploy import loadapp
from waitress import serve

basedir= os.path.dirname(os.path.realpath(__file__))
conf_file = os.path.join(basedir, 'production.ini')

application = loadapp('config:%s' % conf_file)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    scheme = os.environ.get("SCHEME", "https")

    serve(application, host='0.0.0.0', port=port, url_scheme=scheme)
