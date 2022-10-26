from pandas.io.parsers import read_csv
import pytesseract
from pytesseract import Output
import cv2
pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract.exe'

filename = "alpha.jpg"
img = cv2.imread(filename)
#img = cv2.resize(img, (1960, 1540))

h, w, _ = img.shape

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
boxes = pytesseract.image_to_boxes(gray)

print(boxes)

# draw the bounding boxes on the image
for b in boxes.splitlines():
    b = b.split(' ')
    img = cv2.rectangle(img, (int(b[1]), h - int(b[2])), (int(b[3]), h - int(b[4])), (0, 255, 0), 2)
    img = cv2.putText(img, b[0], (int(b[1]), h - int(b[2]) - 10), cv2.FONT_HERSHEY_SIMPLEX,1.2, (0, 0, 255), 3)
# show annotated image and wait for keypress
cv2.imwrite("modified.png", img)
cv2.imshow("Image", img)
cv2.waitKey(0)


