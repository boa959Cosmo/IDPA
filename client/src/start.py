import multiprocessing as mp
import os

processes_pool = ("Pilot.py", "client.py", "sensor_reader.py", "cam2.py")

def execute(prozess):
    os.system(f"python {prozess}")
    
pool = mp.Pool(processes = 4)
pool.map(execute, processes_pool)