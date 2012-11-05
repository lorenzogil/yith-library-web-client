Yith Library web client
=======================

Web client for Yith Library server. Written on top of Pyramid and Ember.js

Server code: https://github.com/Yaco-Sistemas/yith-library-server

This web client lets the user access to his passwords and secrets, safely
stored at the Yith Library server. View, editing and deleting are supported.

There is an instance running at https://yithlibrary-webclient.herokuapp.com/

Development
-----------

It's recommended to use virtualenv. To know how to create an isolated
enviroment with virtualenv read this http://www.virtualenv.org

Requirements
~~~~~~~~~~~~

* Python 2.7 or Python 3.2

Deployment
~~~~~~~~~~

After loading your virtualenv (you should be using one!), run this command::

    python setup.py develop

This will install all the dependencies needed. After the installation is
completed, you can execute the server with this command::

    pserve development.ini

And then the web client will be available at http://localhost:6543/

Boring legal stuff
------------------

Yith Library Webclient
~~~~~~~~~~~~~~~~~~~~~~

| Copyright (C) 2012 Yaco Sistemas S.L.
| Copyright (C) 2012 Alejandro Blanco <alejandro.b.e@gmail.com>
| Copyright (C) 2012 Lorenzo Gil <lorenzo.gil.sanchez@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Yithian Image
~~~~~~~~~~~~~

Copyright (C) 2012 Isaac <ismurg@gmail.com>

Licensed under Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)

For a copy of this license see
<http://creativecommons.org/licenses/by-sa/3.0/legalcode>

Browser Icon
~~~~~~~~~~~~

Browser designed by Alexandre Lachèze from The Noun Project

Licensed under Attribution 3.0 Unported (CC BY 3.0)

For a copy of this license see
<http://creativecommons.org/licenses/by/3.0/legalcode>
