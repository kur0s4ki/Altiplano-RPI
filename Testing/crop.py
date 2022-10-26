import cv2
import pytesseract
import cv2
import numpy as np
from pytesseract import Output
pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract.exe'

def apply_threshold(img, argument):
    switcher = {
        1: cv2.threshold(cv2.GaussianBlur(img, (9, 9), 0), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        2: cv2.threshold(cv2.GaussianBlur(img, (7, 7), 0), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        3: cv2.threshold(cv2.GaussianBlur(img, (5, 5), 0), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        4: cv2.threshold(cv2.medianBlur(img, 5), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        5: cv2.threshold(cv2.medianBlur(img, 3), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
        6: cv2.adaptiveThreshold(cv2.GaussianBlur(img, (5, 5), 0), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2),
        7: cv2.adaptiveThreshold(cv2.medianBlur(img, 3), 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2),
    }
    return switcher.get(argument, "Invalid method")


filename = "combined1.png"
img = cv2.imread(filename)
h, w, _ = img.shape

crop_img = img[915:h-620,1550:w-1450]

h, w, _ = crop_img.shape


# Convert to gray
gray = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)

#gray = crop_img

#Apply dilation and erosion to remove some noise
kernel = np.ones((1, 1), np.uint8)
gray = cv2.dilate(gray, kernel, iterations=1)
gray = cv2.erode(gray, kernel, iterations=1)
# Apply blur to smooth out the edges
#gray = cv2.GaussianBlur(gray, (5, 5), 0)

# Apply threshold to get image with only b&w (binarization)
gray = apply_threshold(gray,2)

boxes = pytesseract.image_to_boxes(gray)
print(boxes)

# draw the bounding boxes on the image
for b in boxes.splitlines():
    b = b.split(' ')
    gray = cv2.rectangle(gray, (int(b[1]), h - int(b[2])), (int(b[3]), h - int(b[4])), (0, 255, 0), 2)
    gray = cv2.putText(gray, b[0], (int(b[1]), h - int(b[2]) - 10), cv2.FONT_HERSHEY_SIMPLEX,1.2, (0, 0, 255), 3)
# show annotated image and wait for keypress
cv2.imwrite("modified.png", gray)
cv2.imshow("Image", gray)
cv2.waitKey(0)


# cv2.imwrite("cropped.png", gray)
# cv2.imshow("cropped", gray)
# cv2.waitKey(0)


