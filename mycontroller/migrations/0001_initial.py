# Generated by Django 5.0.6 on 2024-10-21 03:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAbsentRequestData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_request', models.DateField()),
                ('category', models.CharField(max_length=100)),
                ('reason', models.CharField(max_length=100)),
                ('start_shift', models.CharField()),
                ('name', models.CharField(default='', max_length=100)),
                ('team', models.CharField(max_length=100)),
                ('end_shift', models.CharField()),
                ('remarks', models.TextField()),
                ('number', models.CharField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userabsentrequest', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField()),
                ('password', models.CharField()),
                ('nt_account', models.CharField(null=True, unique=True)),
                ('dateHired', models.CharField()),
                ('hrid', models.IntegerField()),
                ('firstName', models.CharField(max_length=100)),
                ('lastName', models.CharField(max_length=100)),
                ('middleName', models.CharField(max_length=100)),
                ('position', models.CharField(max_length=100)),
                ('team', models.CharField(max_length=100)),
                ('employeeStatus', models.CharField(max_length=100)),
                ('userStatus', models.CharField(max_length=100)),
                ('country', models.CharField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
