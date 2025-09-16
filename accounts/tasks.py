from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


@shared_task
def send_otp_task(email, otp_code):
    subject = 'رمز التحقق من بريدك الإلكتروني'
    html_message = render_to_string('emails/email_code.html', {
        'otp_code': otp_code
    })
    plain_message = strip_tags(html_message)
    from_email = 'fazaa56153@gmail.com'
    recipient_list = [email]

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=from_email,
        recipient_list=recipient_list,
        html_message=html_message,
        fail_silently=False
    )