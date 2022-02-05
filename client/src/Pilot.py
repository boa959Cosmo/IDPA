import RPi.GPIO as GPIO
import time
import socket
import threading
import json
from matplotlib import pyplot as plt


Telemetrie = {}
Befehle = {}
servo1 = 0
servo2 = 0

def Servo_Function():
    global servo1, servo2
    MIN_DUTY = 2.25
    MAX_DUTY = 12.25

    servo_signal_pin1 = 13
    servo_signal_pin2 = 14
    esc_pin = 15

    def deg_to_duty(deg):
        deg += 30
        return deg * (MAX_DUTY- MIN_DUTY) / 60 + MIN_DUTY


    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(servo_signal_pin1, GPIO.OUT)
    GPIO.setup(servo_signal_pin2, GPIO.OUT)
    GPIO.setup(esc_pin, GPIO.OUT)
        # set pwm signal to 50Hz
    servo1_obj = GPIO.PWM(servo_signal_pin1, 50)
    servo2_obj = GPIO.PWM(servo_signal_pin2, 50)
    esc_obj = GPIO.PWM(esc_pin, 50)
    servo1_obj.start(0)
    servo2_obj.start(0)
    while True:
        servo1_obj.ChangeDutyCycle(deg_to_duty(servo1))
        servo2_obj.ChangeDutyCycle(deg_to_duty(servo2))
        esc_obj.ChangeDutyCycle(0)

def socketHandler(socket, size):
    global Telemetrie
    while True:
        data, addr = socket.recvfrom(size)
        inp = json.loads(data.decode().replace("'", '"'))
        Telemetrie = {key:float(inp[key]) if not isinstance(inp[key], dict) else {ik:float(inp[key][ik]) for ik in inp[key].keys()} for key in inp.keys()}


TelemetrieSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
TelemetrieSocket.bind(("127.0.0.1", 2088))

PWM_thread = threading.Thread(target=Servo_Function)
TelemetrieThread = threading.Thread(target = socketHandler, args=(TelemetrieSocket, 1024))
TelemetrieThread.start()
PWM_thread.start()
l1, l2, l3 = [], [], []
k = 0
time.sleep(.5)
while True:
    k += 1
    print(Telemetrie["MAGNET"])
    if k<0:
        plt.plot(l1)
        plt.plot(l2) 
        plt.plot(l3)
        plt.show()
        break
    l1.append(Telemetrie["MAGNET"]['magnet0']); l2.append(Telemetrie["MAGNET"]['magnet1']); l3.append(Telemetrie["MAGNET"]['magnet2']); 
    #if Befehle["Modus"] == 'Autopilot':
     #   delta_Lon = Befehle['Waypoint']['Longitude'] - Telemetrie['GPS']['longitude'] #Nord-Süd
      #  delta_Lat = Befehle['Waypoint']['Latitude'] - Telemetrie['GPS']['latitude']  #West-Ost
