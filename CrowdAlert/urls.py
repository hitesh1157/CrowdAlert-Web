"""CrowdAlert Web  URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='CrowdAlert APIs')

urlpatterns = [
    re_path(r'api-docs/', schema_view),
    path('admin/', admin.site.urls),
    # API paths
    path('api/events/', include('api.events.urls')),
    path('api/images/', include('api.images.urls')),
    path('api/location/', include('api.location.urls')),
    path('api/users/', include('api.users.urls')),
    path('api/comments/', include('api.comments.urls')),
    path('api/upvote/', include('api.upvote.urls')),
    path('api/spam/', include('api.spam.urls')),
    path('api/notifications/', include('api.notifications.urls')),
    # Static files that needs to be on the project root so that 
    # Chrome recognizes our app as a PWA
    re_path(r'^service-worker.js', TemplateView.as_view(
        template_name="service-worker.js",
        content_type='application/javascript',
    ), name='service-worker.js'),
    re_path(r'^firebase-messaging-sw.js', TemplateView.as_view(
        template_name="firebase-messaging-sw.js",
        content_type='application/javascript',
    ), name='firebase-messaging-sw.js'),
    re_path(r'^manifest.json', TemplateView.as_view(
        template_name="manifest.json",
    ), name='manifest.json'),
    re_path('/', TemplateView.as_view(
        template_name='index.html')),
    re_path('', TemplateView.as_view(
        template_name='index.html')),
]
