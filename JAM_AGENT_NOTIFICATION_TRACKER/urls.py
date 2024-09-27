from django.contrib import admin
from django.urls import path, include, re_path
from mycontroller.views import CreateUserView, LoggedInUserView, CurrentUserView, UserCreatedRequest, FrontendAppView
from mycontroller.serve_files import serve_css, serve_footer, serve_js, serve_logo, serve_ico
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
    path('api/users/all-users/', LoggedInUserView.as_view(), name="all_user"),
    path('api/users/current/', CurrentUserView.as_view(), name='current_user'),
    # path('api/users/<int:pk>/', CurrentUserView.as_view(), name='current_user'),
    path('api/users/request/', UserCreatedRequest.as_view(), name='user_request'),
    path('api_auth/', include("rest_framework.urls")),
    path("api/", include("mycontroller.urls")),
    path('assets/VXIFooter-wDuAYXk4.png', serve_footer), 
    path('assets/VXI_Logo 1-BsslRYVi.png', serve_logo), 
    path('assets/index-C8AJcfwy.css', serve_css), 
    path('assets/index-CIs1qtcz.js', serve_js), 
    path('assets/VXI-DfDsUEYA.ico', serve_ico), 
    re_path(r'', FrontendAppView.as_view()),



]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

