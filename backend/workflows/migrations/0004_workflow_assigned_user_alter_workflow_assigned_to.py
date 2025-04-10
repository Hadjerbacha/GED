# Generated by Django 5.2 on 2025-04-07 22:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0003_workflow_assigned_to_alter_workflow_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='workflow',
            name='assigned_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_workflows', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='workflow',
            name='assigned_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_to_workflows', to=settings.AUTH_USER_MODEL),
        ),
    ]
