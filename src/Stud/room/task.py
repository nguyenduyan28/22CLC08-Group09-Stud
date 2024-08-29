from django_q.tasks import schedule
from django_q.models import Schedule
from django.utils import timezone
from room.models import tracking_time
from datetime import timedelta

def reset_weekly():
    tracking_time.objects.all().update(total_time=timezone.timedelta(0), num_sessions=0)


def get_next_monday():
    today = timezone.now()
   
    days_until_monday = (7 - today.weekday()) % 7
    if days_until_monday == 0:  
        days_until_monday = 7
    next_monday = today + timedelta(days=days_until_monday)
    next_monday = next_monday.replace(hour=0, minute=0, second=0, microsecond=0)
    return next_monday

# Schedule the reset
schedule(
    'room.task.reset_weekly',
    schedule_type=Schedule.WEEKLY,
    next_run=get_next_monday(),  
    repeats=-1, 
    timeout=60  
)