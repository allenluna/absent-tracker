from django.contrib import admin
from django.urls import path, include, re_path
from mycontroller.views import CreateUserView, LoggedInUserView, CurrentUserView, UserCreatedRequest, FrontendAppView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from django.views.generic import TemplateView
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
    re_path(r'', TemplateView.as_view(template_name="index.html")),

]

