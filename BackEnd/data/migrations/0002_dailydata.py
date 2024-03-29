# Generated by Django 4.2.4 on 2023-08-23 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('goldValue', models.FloatField()),
                ('unit', models.CharField(max_length=10)),
                ('dollarRate', models.FloatField()),
            ],
        ),
    ]
