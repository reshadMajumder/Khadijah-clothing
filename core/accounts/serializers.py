from rest_framework import serializers
from django.contrib.auth import authenticate



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        required=True,
        error_messages={'required': 'Username is required'}
    )
    password = serializers.CharField(
        required=True,
        error_messages={'required': 'Password is required'},
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            if not user.is_superuser:
                raise serializers.ValidationError('User is not authorized to access admin panel')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include "username" and "password"')
