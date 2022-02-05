import cv2
import base64
import socket
from PIL import Image
import skimage
from io import BytesIO
import time
import numpy

def encode(image):
    # convert image to bytes
    with BytesIO() as output_bytes:
        #retval, buffer = cv2.imencode('.jpg', image)
        #jpg_as_text = base64.b64encode(buffer)
        PIL_image = Image.fromarray(skimage.img_as_ubyte(image))
        PIL_image.save(output_bytes, 'JPEG') # Note JPG is not a vaild type here
        bytes_data = output_bytes.getvalue()

    # encode bytes to base64 string
    base64_str = str(base64.b64encode(bytes_data), 'utf-8').encode()

    return base64_str


LOOPBACK_IP = "127.0.0.1"
UDP_PORT = 5005


vid = cv2.VideoCapture(0)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
k = 0
while True:
    k = time.time()
    _, frame = vid.read()
    encoded = encode(numpy.array(frame))#base64.b64encode(str(frame).encode("utf-8"))
    print(int(1/(time.time()-k)))
    sock.sendto(encoded, (LOOPBACK_IP, UDP_PORT))

    

