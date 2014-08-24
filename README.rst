Yith Library web client
=======================

.. image:: https://travis-ci.org/ablanco/yith-library-web-client.png?branch=master
  :target: https://travis-ci.org/ablanco/yith-library-web-client

.. image:: https://badge.fury.io/py/yith-web-client.png
  :target: http://badge.fury.io/py/yith-web-client

.. image:: https://codeclimate.com/github/ablanco/yith-library-web-client.png
  :target: https://codeclimate.com/github/ablanco/yith-library-web-client

.. image:: https://david-dm.org/ablanco/yith-library-web-client/dev-status.svg
  :target: https://david-dm.org/ablanco/yith-library-web-client#info=devDependencies

Web client for Yith Library server. Written on top of Pyramid and Ember.js

Server code: https://github.com/lorenzogil/yith-library-server

This web client lets the user access to his passwords and secrets, safely
stored at the Yith Library server. View, editing and deleting are supported.

There is an instance running at http://yithlibrary.com/

Development
-----------

It's recommended to use virtualenv. To know how to create an isolated
enviroment with virtualenv read this http://www.virtualenv.org

Requirements
~~~~~~~~~~~~

* Python 2.7 or Python 3.2
* Node.js 10 or higher

Deployment
~~~~~~~~~~

After loading your virtualenv (you should be using one!), run this command::

    python setup.py develop

This will install all the dependencies needed. After the installation is
completed, you can execute the server with this command::

    pserve development.ini

And then the web client will be available at http://localhost:6543/

Build the JavaScript bundle
~~~~~~~~~~~~~~~~~~~~~~~~~~~

We use Grunt.js to build the minified javascript bundle. So you will need
to install the grunt client in you system. Execute this as root::

    npm install -g grunt-cli
    npm install -g bower

Then you'll need to install the dependencies, run these commands::

    npm install -d
    bower install

Once this has finished, then you can execute the main task that will build
the bundle::

    grunt

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
