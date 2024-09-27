from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import JsonResponse, HttpResponse
from .models import UserAbsentRequestData, UserProfile
import requests
from .serializers import SSOUserSerializer
from django.contrib.auth.models import User
import json
import os
from dotenv import load_dotenv


class SSO(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        load_dotenv()
        data = request.data

        username = data.get("username")
        domain = data.get("domain")
        if username == "" and domain == "":
            return JsonResponse({"message": "Empty"}, status=status.HTTP_400_BAD_REQUEST)

        if not username and not domain:
            return JsonResponse({"message": "Wrong Input Field"}, status=status.HTTP_400_BAD_REQUEST)

        
        if User.objects.filter(username=username).exists():
            return JsonResponse({"message": "User Exists."})
        else:
            response_data = self.user_domain(username, domain)
            return JsonResponse(response_data, status=status.HTTP_200_OK)

    def user_domain(self, username, domain):
        # https://itechapi.vxiusa.com/api/v1/employeesexistingformat/GetByWidOrHrid
        # https://api.vxiusa.com/api/GlobalHR/Employees/FindEEByWinIDDomain
        #https://vxicareers.com/srv2-api/api/v1/login/GetEmpDetailsOnGlobalAPI?nt=jtayag&domain=VXIPHP

        api_url = f'https://vxicareers.com/srv2-api/api/v1/login/GetEmpDetailsOnGlobalAPI?nt={username}&domain={domain}'
    
        # try:
        response = requests.get(api_url)
        if response.status_code == 500:
            return JsonResponse({"message": response.status_code})
        # print(response.json()["UserInfo"])
        response_data = response.json()["UserInfo"]
        hrid = response_data['ID']
        FirstName = response_data['FirstName']
        LastName = response_data['LastName']
        MiddleName = response_data['MiddleName']
        HireDate = response_data['HireDate']
        Team = response_data['Team']
        TitleName = response_data['TitleName']
        WindowsID = response_data['WindowsID']
        # Check if user already exists based on WindowsID (nt_account)
        if UserProfile.objects.filter(nt_account=WindowsID).exists():
            return {"status": "error", "message": "User already exists"}
        user_data = {
            "id": hrid,
            "nt_account": WindowsID,
            "dateHired": HireDate,
            "hrid": hrid,
            "firstName": FirstName,
            "lastName": LastName,
            "middleName": MiddleName,
            "position": TitleName,
            "team": Team,
            "employeeStatus": "ACTIVE",
            "userStatus": "user",
            "country": domain,
        }
        serializer = SSOUserSerializer(data=user_data)
        if serializer.is_valid():
            # Create User object
            user = User.objects.create_user(
                id=hrid,
                username=WindowsID,
                password=HireDate.replace("/", "").strip()
            )
            # Create UserProfile object linked to the User
            UserProfile.objects.create(
                id=hrid,
                user=user,
                username=WindowsID,
                password=HireDate.replace("/", "").strip(),
                nt_account=WindowsID,
                dateHired=HireDate,
                hrid=hrid,
                firstName=FirstName,
                lastName=LastName,
                middleName=MiddleName,
                position=TitleName,
                team=Team,
                employeeStatus="ACTIVE",
                userStatus="user",
                country=domain
            )

        return {"status": "success", "message": "User registered successfully"}
            # else:
            #     return {"status": "error", "message": "Error"}

        # except requests.exceptions.RequestException as e:
        #     return {"status": "error", "message": "500 Error"}