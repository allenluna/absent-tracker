from django.http import Http404, HttpResponse, JsonResponse
from django.views.generic import View
from rest_framework import generics, status
from .serializers import AbsentRequestSerializer, UserProfileSerializer, AbsentGetRequestSerializer, SSOUserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserAbsentRequestData, UserProfile
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
import os
from django.conf import settings
from .utils import get_user_info
import requests
import json
import pandas as pd
from io import BytesIO
from datetime import datetime
from pytz import timezone, UTC  # Import UTC from pytz for timezone conversion


################# userdomain ####################

def api_end(request):
    username, userdomain = get_user_info() 
    print(userdomain)
    api = f"https://vxicareers.com/smart-recruitv2-API/api/v1/login/GetUserInfoByHRIDNT?HRID={username}"

    try:
        response = requests.get(api)
        response.raise_for_status()
        

        result = response.json()
        

        return JsonResponse({"data": result})

    except requests.exceptions.RequestException as e:
        print(str(e)) 
        return HttpResponse({"error": str(e)}, status=500)
      

#################### get individual domain #############################
def get_domain(request):
    username, userdomain = get_user_info()
    return JsonResponse({'userdomain': f'{userdomain}'})

################### This function is to serve frontend #######################
class FrontendAppView(View):
    def get(self, request):
        try:
            with open(os.path.join(settings.STATIC_ROOT,'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            raise Http404("Frontend build not found")


################################# for creating absent request ########################
class AbsentListCreate(generics.ListCreateAPIView):
    serializer_class = AbsentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return UserAbsentRequestData.objects.filter(author=user)
    
    def perform_create(self, serializer):
        start_shift_str = self.request.data.get('start_shift')  # "2024-07-14T01:00:00Z"
        end_shift_str = self.request.data.get('end_shift')  # "2024-07-14T01:00:00Z"

        # Parse datetime string and convert to datetime object in UTC
        start_shift = datetime.fromisoformat(start_shift_str.replace('Z', '')).replace(tzinfo=UTC)
        end_shift = datetime.fromisoformat(end_shift_str.replace('Z', '')).replace(tzinfo=UTC)

        print(start_shift)
        print(end_shift)

        # Continue with serializer validation and saving
        if serializer.is_valid():
            user_profile = self.request.user.userprofile
            serializer.save(
                author=self.request.user,
                team=user_profile.team,
                name=f"{user_profile.firstName} {user_profile.middleName} {user_profile.lastName}",
                start_shift=start_shift,
                end_shift=end_shift,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


 ################################## Genereted csv or excel file class #########################       
class AbsentGetRequest(generics.ListAPIView):
    serializer_class = AbsentGetRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.userprofile
        return UserAbsentRequestData.objects.filter(team=user.team)
    
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        to_csv = data.get("file_type")
        
        if to_csv == "csv" or to_csv == "excel":
            queryset = self.get_queryset()
            if not queryset.exists():
                return Response({"data": "No Date Request."}, status=status.HTTP_404_NOT_FOUND)
            
            # Generate CSV response
            csv_response = self.generate_csv_response(queryset, to_csv)
            return csv_response

        return Response({"data": "Invalid file_type specified."}, status=status.HTTP_400_BAD_REQUEST)
    
    def generate_csv_response(self, queryset, file_type):
        df = pd.DataFrame.from_dict(list(queryset.values()))
        
        # Remove 'id' column
        df = df.drop(columns=['id'])
        
        # File header
        df.columns = ["Date Request", "Category", "Reason", "Start Shift", "Name", "Team", "End Shift", "Remarks", "Number", "Created Date", "HRID"]
        
        # Convert timezone-aware datetimes to timezone-unaware
        datetime_columns = ["Date Request", "Start Shift", "End Shift", "Created Date"]
        for column in datetime_columns:
            df[column] = pd.to_datetime(df[column]).dt.tz_localize(None)

        # Prepare CSV or Excel file
        if file_type == "excel":
            with BytesIO() as b:
                with pd.ExcelWriter(b, engine='openpyxl') as writer:
                    df.to_excel(writer, index=False)
                response = HttpResponse(b.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename="VXI_ABSENT_REQUEST.xlsx"'
        else:
            response = HttpResponse(df.to_csv(index=False), content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="VXI_ABSENT_REQUEST.csv"'

        return response
    
        
class AbsentUpdate(generics.UpdateAPIView):
    serializer_class = AbsentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        query_set =  UserAbsentRequestData.objects.filter(author=user)
        return query_set
    
    def perform_update(self, serializer):
        serializer.save(author=self.request.user)


class AbsentDelete(generics.DestroyAPIView):
    serializer_class = AbsentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return UserAbsentRequestData.objects.filter(author=user)


##############################for creating a user#################################
class CreateUserView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]


######################## for updating the user ##########################
class UpdateAddedUser(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs["pk"]
        try:
            user_profile = UserProfile.objects.get(user_id=pk)
            return user_profile
        except UserProfile.DoesNotExist:
            raise Http404("UserProfile does not exist for the given pk.")

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)



################################### Delete User #######################################
class DeleteUserProfileView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs["pk"]
        try:
            user_profile = UserProfile.objects.get(user_id=pk)
            return user_profile
        except UserProfile.DoesNotExist:
            raise Http404("UserProfile does not exist for the given pk.")

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete() 

class LoggedInUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        records = UserProfile.objects.all()
        serializer = UserProfileSerializer(records, many=True)
        return Response(serializer.data)
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the current authenticated user using request.user
        user = request.user
        
        try:
            profile = UserProfile.objects.get(user=user)
            if not profile:
                Response({"Error": "Not Found"})
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found."})
        
        serializer = UserProfileSerializer(profile)
        
        return Response(serializer.data)


class UserCreatedRequest(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the current authenticated user's profile
        user_profile = request.user.userprofile
        
        # Filter UserAbsentRequestData objects based on the user's position
        requested_data = UserAbsentRequestData.objects.filter(team=user_profile.position)

        # Serialize the filtered data
        serializer = AbsentRequestSerializer(requested_data, many=True)
        
        return Response(serializer.data)
    

class FilterByDateRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))

        filter_type = data.get('filter_type')
        file_type = data.get("file_type")

        if file_type:
            filter_requested_date = UserAbsentRequestData.objects.all()

            if filter_type == "all":
                filter_requested_date = filter_requested_date.filter(date_request__range=[data.get('from'), data.get('to')])
                
                if not filter_requested_date.exists():
                    return JsonResponse({"data": "No Date Request."})
                
                file_response = self.generate_csv_response(filter_requested_date, file_type)
                serializer = AbsentGetRequestSerializer(filter_requested_date, many=True)
                return file_response  # Return the file response directly

            elif filter_type == "my bucket":
                filter_requested_date = filter_requested_date.filter(date_request__range=[data.get('from'), data.get('to')], author=request.user)
                
                if not filter_requested_date.exists():
                    return JsonResponse({"data": "No Date Request."})
                
                file_response = self.generate_csv_response(filter_requested_date, file_type)
                serializer = AbsentGetRequestSerializer(filter_requested_date, many=True)
                return file_response  # Return the file response directly

        from_date = data.get('from')
        to_date = data.get('to')
        if filter_type == "all":
            filter_requested_date = UserAbsentRequestData.objects.filter(date_request__range=[from_date, to_date])
            if not filter_requested_date.exists():
                return JsonResponse({"data": "No Date Request."})
            serializer = AbsentGetRequestSerializer(filter_requested_date, many=True)
            return JsonResponse({"data": serializer.data})
        
        elif filter_type == "my bucket":
            current_user = request.user
            filter_requested_date = UserAbsentRequestData.objects.filter(
                date_request__range=[from_date, to_date],
                author=current_user
            )
            if not filter_requested_date.exists():
                return JsonResponse({"data": "No Date Request."})
            serializer = AbsentGetRequestSerializer(filter_requested_date, many=True)
            return JsonResponse({"data": serializer.data})
        
        return JsonResponse({"data": "Invalid Request"})

    def generate_csv_response(self, queryset, file_type):
        df = pd.DataFrame.from_dict(list(queryset.values()))
        
        # Remove 'id' column
        df = df.drop(columns=['id'])
        
        # File header
        df.columns = ["Date Request", "Category", "Reason", "Start Shift", "Name", "Team", "End Shift", "Remarks", "Number", "Created Date", "HRID"]
        
        # Convert timezone-aware datetimes to timezone-unaware
        datetime_columns = ["Date Request", "Start Shift", "End Shift", "Created Date"]
        for column in datetime_columns:
            df[column] = pd.to_datetime(df[column]).dt.tz_localize(None)

        # Prepare CSV or Excel file
        if file_type == "excel":
            with BytesIO() as b:
                with pd.ExcelWriter(b, engine='openpyxl') as writer:
                    df.to_excel(writer, index=False)
                response = HttpResponse(b.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename="VXI_ABSENT_REQUEST.xlsx"'
        else:
            response = HttpResponse(df.to_csv(index=False), content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="VXI_ABSENT_REQUEST.csv"'

        return response