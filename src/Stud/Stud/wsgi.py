"""
WSGI config for Stud project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

# import os

# from django.core.wsgi import get_wsgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Stud.settings')

# application = get_wsgi_application()
# app = application


# import os
# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.core.asgi import get_wsgi_application
# from room import routing

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Stud.settings')
# django_asgi_app = get_wsgi_application()

# application = ProtocolTypeRouter({
#     "http": django_asgi_app,
#     "websocket": URLRouter(
#         routing.websocket_urlpatterns
#     )
# })
# app = application

"""
WSGI config for Stud project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Stud.settings')

application = get_wsgi_application()
app = application