from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from rest_framework import status
from django.contrib.auth import authenticate
from django.conf import settings
import os
import razorpay
import hmac
import hashlib
import secrets

@api_view(['GET', 'POST'])
def signup_view(request):
    if request.method == 'GET':
        return Response({'info': 'Signup endpoint ready'})

    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not username or not email or not password or not phone:
        return Response({'error': 'All fields are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    # Create new user
    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )

    # Create or update profile safely
    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.phone = phone
    profile.save()

    profile_image_url = None
    if profile.profile_image:
        profile_image_url = request.build_absolute_uri(profile.profile_image.url)

    return Response({
        'message': 'User registered successfully!',
        'username': user.username,
        'email': user.email,
        'phone': profile.phone or '',
        'profile_image': profile_image_url,
    })


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile_image_url = None
        if profile.profile_image:
            profile_image_url = request.build_absolute_uri(profile.profile_image.url)
        
        return Response({
            'message': 'Login successful',
            'username': user.username,
            'email': user.email,
            'phone': profile.phone or '',
            'profile_image': profile_image_url,
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'PUT'])
def profile_view(request):
    """Get or update user profile"""
    username = request.data.get('username') or request.query_params.get('username')
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(username=username)
        profile, created = UserProfile.objects.get_or_create(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        profile_image_url = None
        if profile.profile_image:
            profile_image_url = request.build_absolute_uri(profile.profile_image.url)
        
        return Response({
            'username': user.username,
            'email': user.email,
            'phone': profile.phone or '',
            'profile_image': profile_image_url,
        })
    
    elif request.method == 'PUT':
        # Update profile fields
        if 'phone' in request.data:
            profile.phone = request.data['phone']
        
        if 'email' in request.data:
            user.email = request.data['email']
            user.save()
        
        if 'username' in request.data and request.data['username'] != username:
            if User.objects.filter(username=request.data['username']).exclude(pk=user.pk).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
            user.username = request.data['username']
            user.save()
        
        profile.save()
        
        profile_image_url = None
        if profile.profile_image:
            profile_image_url = request.build_absolute_uri(profile.profile_image.url)
        
        return Response({
            'message': 'Profile updated successfully',
            'username': user.username,
            'email': user.email,
            'phone': profile.phone or '',
            'profile_image': profile_image_url,
        })


@api_view(['POST'])
def upload_profile_image(request):
    """Upload or update profile picture"""
    username = request.data.get('username')
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(username=username)
        profile, created = UserProfile.objects.get_or_create(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if 'profile_image' not in request.FILES:
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    image_file = request.FILES['profile_image']
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if image_file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Only images are allowed.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate file size (5MB max)
    if image_file.size > 5 * 1024 * 1024:
        return Response({'error': 'File size too large. Maximum size is 5MB.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete old image if exists
    if profile.profile_image:
        old_image_path = profile.profile_image.path
        if os.path.exists(old_image_path):
            os.remove(old_image_path)
    
    # Save new image
    profile.profile_image = image_file
    profile.save()
    
    profile_image_url = request.build_absolute_uri(profile.profile_image.url)
    
    return Response({
        'message': 'Profile image uploaded successfully',
        'profile_image': profile_image_url,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def change_password_view(request):
    """Change user password"""
    username = request.data.get('username')
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not username or not current_password or not new_password:
        return Response({
            'error': 'Username, current password, and new password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate new password length
    if len(new_password) < 6:
        return Response({
            'error': 'New password must be at least 6 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Verify current password
    if not user.check_password(current_password):
        return Response({
            'error': 'Current password is incorrect'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if new password is same as current password
    if user.check_password(new_password):
        return Response({
            'error': 'New password must be different from current password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Update password
    user.set_password(new_password)
    user.save()
    
    return Response({
        'message': 'Password changed successfully. Please login with your new password.'
    }, status=status.HTTP_200_OK)


# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(
    getattr(settings, 'RAZORPAY_KEY_ID', ''),
    getattr(settings, 'RAZORPAY_KEY_SECRET', '')
))


@api_view(['POST'])
def create_payment_order(request):
    """Create a Razorpay order for payment"""
    try:
        amount = float(request.data.get('amount', 0))
        
        if amount <= 0:
            return Response({
                'error': 'Invalid amount. Amount must be greater than 0.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert amount to paise (Razorpay expects amount in smallest currency unit)
        amount_in_paise = int(amount * 100)
        
        # Create order
        order_data = {
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': secrets.token_hex(10),
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        return Response({
            'id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'receipt': order['receipt'],
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Something went wrong: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_payment(request):
    """Verify Razorpay payment signature"""
    try:
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({
                'error': 'Missing payment details'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create signature string
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        
        # Generate expected signature
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        generated_signature = hmac.new(
            key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Verify signature
        if hmac.compare_digest(generated_signature, razorpay_signature):
            return Response({
                'status': 'success',
                'message': 'Payment verified successfully',
                'payment_id': razorpay_payment_id,
                'order_id': razorpay_order_id
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'failed',
                'error': 'Payment verification failed. Invalid signature.'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'error': f'Payment verification error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)