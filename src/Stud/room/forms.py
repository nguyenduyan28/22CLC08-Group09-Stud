from django import forms

from .models import Image , Message


class ImageForm(forms.ModelForm):
  class Meta:
    model = Image
    fields = ['title', 'image']
    widgets = {
        'title': forms.TextInput(attrs={'class': 'title-field'}),
    }

class MessageForm(forms.ModelForm):
  class Meta:
    model = Message
    fields = ['message']