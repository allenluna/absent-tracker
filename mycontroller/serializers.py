from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserAbsentRequestData, UserProfile
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        
        # Check if user with the same username already exists
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User with this username already exists.")
        
        user = User.objects.create_user(username=username, password=password)
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['nt_account', 'dateHired', 'hrid', 'firstName', 'lastName', 'middleName', 'position', 'team', 'employeeStatus', 'userStatus', 'country']
        extra_kwargs = {
            'dateHired': {'write_only': True}
        }

    def create(self, validated_data):
        nt_account = validated_data.get('nt_account')
        date_hired = validated_data.get('dateHired')
        hrid = validated_data.get("hrid")

        #format dateHired
        date_obj  = datetime.strptime(date_hired, '%m%d%Y')
        formatted_date = date_obj.strftime('%m/%d/%Y')

        if UserProfile.objects.filter(nt_account=nt_account).exists():
            raise serializers.ValidationError("User profile with this nt_account already exists.")
        

        validated_data.pop('dateHired', None)
        
        # Create User object
        user_data = {"id": hrid, 'username': nt_account, 'password': date_hired}
        user = User.objects.create_user(**user_data)
        
        # Create UserProfile object
        user_profile = UserProfile.objects.create(user=user, id=hrid, username=nt_account, password=date_hired, dateHired=str(formatted_date), **validated_data)
        return user_profile
    
class SSOUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'nt_account', 'dateHired', 'hrid', 'firstName', 'lastName', 'middleName', 'position', 'team', 'employeeStatus', 'userStatus', 'country']

class AbsentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAbsentRequestData
        fields = ["id" ,"date_request", "category", "reason" , "number", "start_shift", "end_shift", "remarks", "created_date", "author"]
        extra_kwargs = {
            "author": {"read_only": True}
        }

    def get_author(self, obj):
        author_id = obj.author_id
        try:
            author = User.objects.get(id=author_id)
            serializer = UserSerializer(author)
            return serializer.data
        except User.DoesNotExist:
            return None


class AbsentGetRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAbsentRequestData
        fields = ["id", "team", "name" ,"date_request", "category", "reason", "number", "start_shift", "end_shift", "remarks", "created_date", "author"]
        extra_kwargs = {
            "author": {"read_only": True}
        }