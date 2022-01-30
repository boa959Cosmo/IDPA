import socket
import time
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('localhost', 6969))
while True:
    s.sendall(b'Hello, world')
    data = s.recv(1024)
    print(data)
    time.sleep(0.01)
s.close()
print('Received', repr(data))