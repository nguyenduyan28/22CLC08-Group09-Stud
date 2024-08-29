from django.core.management.base import BaseCommand
from room.task import reset_weekly

class Command(BaseCommand):
    help = 'Schedule weekly reset of tracking_time statistics'

    def handle(self, *args, **kwargs):
        reset_weekly()
        self.stdout.write(self.style.SUCCESS('Successfully scheduled weekly stats reset'))