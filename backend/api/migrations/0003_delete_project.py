# Generated by Django 5.0.7 on 2024-08-07 12:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_porject_project'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Project',
        ),
    ]
