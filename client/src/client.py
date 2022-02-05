import socket
import json
import threading
import time


Data = {}
LOOPBACK_IP = "127.0.0.1"
SERVER_IP = "188.63.53.11"
SERVER_PORT = 6969
CAMERA_PORT = 5005
TELEMETRIE_PORT =5006


sockCamera = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sockTelemetrie = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sockSender = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

sockCamera.bind((LOOPBACK_IP, CAMERA_PORT))
sockTelemetrie.bind((LOOPBACK_IP, TELEMETRIE_PORT))


def socketHandler(socket, name, size):
    while True:
        data, addr = socket.recvfrom(size)
        Data[name] = data


camera_thread = threading.Thread(target = socketHandler, args=(sockCamera, "camera", 2**25))

telemetrie_thread = threading.Thread(target = socketHandler, args=(sockTelemetrie,  "telemetry", 1024))

camera_thread.start()
telemetrie_thread.start()

while True:
    sockSender.sendto(str(Data).encode(), (SERVER_IP, SERVER_PORT))

        
    
 