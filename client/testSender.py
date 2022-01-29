import socket

UDP_IP = "188.63.53.11" #fe80::7d7d:4800:fddf:f4f
UDP_PORT = 6969
with open('howItshouldbe.json') as f:
    MESSAGE = f.read()
MSG = b'test'

print("UDP target IP: %s" % UDP_IP)
print("UDP target port: %s" % UDP_PORT)
#print("message: %s" % MESSAGE)

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # UDP
sock.sendto(MSG, (UDP_IP, UDP_PORT))
