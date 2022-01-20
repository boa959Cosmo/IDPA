import socket

UDP_IP = "127.0.0.1"
UDP_PORT = 6969
with open('howItshouldbe.json') as f:
    MESSAGE = f.read()

print("UDP target IP: %s" % UDP_IP)
print("UDP target port: %s" % UDP_PORT)
#print("message: %s" % MESSAGE)

sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
sock.sendto(bytes(MESSAGE, 'utf-8'), (UDP_IP, UDP_PORT))