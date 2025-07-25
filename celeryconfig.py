#how celery works:
    #there are two kinds of agents .1:broker url and 2. result backend

#using redis database(indexed database) for the two agents
broker_url = "redis://localhost:6379/1"  #where the task(which take lonk time) which is queued is stored ,1 is database with index 1
result_backend = "redis://localhost:6379/2" #once the task is complete the result of that task is stored , database with index 2
timezone = "Asia/kolkata"
broker_connection_retry_on_startup= True