from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class UserAbsentRequestData(models.Model):
    date_request = models.DateField()
    category = models.CharField(max_length=100)
    reason = models.CharField(max_length=100)
    start_shift = models.CharField()
    name = models.CharField(max_length=100, default="")
    team = models.CharField(max_length=100)
    end_shift = models.CharField()
    remarks = models.TextField()
    number = models.CharField()
    created_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userabsentrequest")


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField()
    password = models.CharField()
    nt_account = models.CharField(unique=True, null=True)
    dateHired = models.CharField()
    hrid = models.IntegerField() 
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    middleName = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    employeeStatus = models.CharField(max_length=100)
    userStatus = models.CharField(max_length=100)
    country = models.CharField()

    def __str__(self):
        return self.nt_account
    
