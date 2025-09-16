from django.shortcuts import render, redirect


def page_not_found(request):
    return render(request, "erorrs/404.html", status=404)

def server_error(request):
    return render(request, "erorrs/500.html", status=500)
