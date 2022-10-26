from skimage import metrics
import imutils
import cv2


def draw_contours(imageA, height, width, thickness):
    _w = 125
    _h = 145
    # cv2.circle(imageA, (0,0), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (125,0), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (275,0), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (420,0), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (565,0), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (710,0), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (840,0), 8, (255, 0, 0), -1)

    # cv2.circle(imageA, (0,145), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (125,145), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (275,145), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (420,145), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (565,145), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (710,145), 8, (255, 0, 0), -1)
    # cv2.circle(imageA, (840,145), 8, (255, 0, 0), -1)

    # # column 1
    # cv2.rectangle(imageA, (0, 0), (0 + _w, 0 + _h),
    #               (0, 0, 255), 2)  # POINT 1 ==> (0,0,125,145)
    # cv2.rectangle(imageA, (0, 145), (0 + _w, 145 + _h),
    #               (0, 0, 255), 2)  # POINT 2 ==> (0,145,125,145)
    # cv2.rectangle(imageA, (0, 290), (0 + _w, 290 + _h),
    #               (0, 0, 255), 2)  # POINT 3 ==> (0,290,125,145)
    # cv2.rectangle(imageA, (0, 440), (0 + _w, 440 + _h),
    #               (0, 0, 255), 2)  # POINT 4 ==> (0,440,125,145)
    # cv2.rectangle(imageA, (0, 585), (0 + _w, 585 + _h),
    #               (0, 0, 255), 2)  # POINT 5 ==> (0,585,125,145)
    # cv2.rectangle(imageA, (0, 730), (0 + _w, 730 + _h),
    #               (0, 0, 255), 2)  # POINT 6 ==> (0,730,125,145)

    # # column 2
    # cv2.rectangle(imageA, (125, 0), (125 + _h, 0 + _h),
    #               (0, 0, 255), 2)  # POINT 1.1 ==> (125,0,145,145)
    # cv2.rectangle(imageA, (125, 145), (125 + _h, 145 + _h),
    #               (0, 0, 255), 2)  # POINT 2 ==> (125,145,145,145)
    # cv2.rectangle(imageA, (125, 290), (125 + _h, 290 + _h),
    #               (0, 0, 255), 2)  # POINT 3 ==> (125,290,145,145)
    # cv2.rectangle(imageA, (125, 440), (125 + _h, 440 + _h),
    #               (0, 0, 255), 2)  # POINT 4 ==> (125,440,145,145)
    # cv2.rectangle(imageA, (125, 585), (125 + _h, 585 + _h),
    #               (0, 0, 255), 2)  # POINT 5 ==> (125,585,145,145)
    # cv2.rectangle(imageA, (125, 730), (125 + _h, 730 + _h),
    #               (0, 0, 255), 2)  # POINT 6 ==> (125,730,145,145)

    # # column 3
    # cv2.rectangle(imageA, (275, 0), (275 + _h, 0 + _h),
    #               (0, 0, 255), 2)  # POINT 1.1 ==> (275,0,145,145)
    # cv2.rectangle(imageA, (275, 145), (275 + _h, 145 + _h),
    #               (0, 0, 255), 2)  # POINT 2 ==> (275,145,145,145)
    # cv2.rectangle(imageA, (275, 290), (275 + _h, 290 + _h),
    #               (0, 0, 255), 2)  # POINT 3 ==> (275,290,145,145)
    # cv2.rectangle(imageA, (275, 440), (275 + _h, 440 + _h),
    #               (0, 0, 255), 2)  # POINT 4 ==> (275,440,145,145)
    # cv2.rectangle(imageA, (275, 585), (275 + _h, 585 + _h),
    #               (0, 0, 255), 2)  # POINT 5 ==> (275,585,145,145)
    # cv2.rectangle(imageA, (275, 730), (275 + _h, 730 + _h),
    #               (0, 0, 255), 2)  # POINT 6 ==> (275,730,145,145)

    # # column 4
    # cv2.rectangle(imageA, (420, 0), (420 + _h, 0 + _h),
    #               (0, 0, 255), 2)  # POINT 1.1 ==> (420,0,145,145)
    # cv2.rectangle(imageA, (420, 145), (420 + _h, 145 + _h),
    #               (0, 0, 255), 2)  # POINT 2 ==> (420,145,145,145)
    # cv2.rectangle(imageA, (420, 290), (420 + _h, 290 + _h),
    #               (0, 0, 255), 2)  # POINT 3 ==> (420,290,145,145)
    # cv2.rectangle(imageA, (420, 440), (420 + _h, 440 + _h),
    #               (0, 0, 255), 2)  # POINT 4 ==> (420,440,145,145)
    # cv2.rectangle(imageA, (420, 585), (420 + _h, 585 + _h),
    #               (0, 0, 255), 2)  # POINT 5 ==> (420,585,145,145)
    # cv2.rectangle(imageA, (420, 730), (420 + _h, 730 + _h),
    #               (0, 0, 255), 2)  # POINT 6 ==> (420,730,145,145)

    # # column 5
    # cv2.rectangle(imageA, (565, 0), (565 + _h, 0 + _h),
    #               (0, 0, 255), 2)  # POINT 1.1 ==> (565,0,145,145)
    # cv2.rectangle(imageA, (565, 145), (565 + _h, 145 + _h),
    #               (0, 0, 255), 2)  # POINT 2 ==> (565,145,145,145)
    # cv2.rectangle(imageA, (565, 290), (565 + _h, 290 + _h),
    #               (0, 0, 255), 2)  # POINT 3 ==> (565,290,145,145)
    # cv2.rectangle(imageA, (565, 440), (565 + _h, 440 + _h),
    #               (0, 0, 255), 2)  # POINT 4 ==> (565,440,145,145)
    # cv2.rectangle(imageA, (565, 585), (565 + _h, 585 + _h),
    #               (0, 0, 255), 2)  # POINT 5 ==> (565,585,145,145)
    # cv2.rectangle(imageA, (565, 730), (565 + _h, 730 + _h),
    #               (0, 0, 255), 2)  # POINT 6 ==> (565,730,145,145)

    # # column 6
    # cv2.rectangle(imageA, (710, 0), (710 + _h, 0 + _h),
    #               (0, 0, 255), 2)  # POINT 1.1 ==> (710,0,145,145)
    # cv2.rectangle(imageA, (710, 145), (710 + _h, 145 + _h),
    #               (0, 0, 255), 2)  # POINT 2 ==> (710,145,145,145)
    # cv2.rectangle(imageA, (710, 290), (710 + _h, 290 + _h),
    #               (0, 0, 255), 2)  # POINT 3 ==> (710,290,145,145)
    # cv2.rectangle(imageA, (710, 440), (710 + _h, 440 + _h),
    #               (0, 0, 255), 2)  # POINT 4 ==> (710,440,145,145)
    # cv2.rectangle(imageA, (710, 585), (710 + _h, 585 + _h),
    #               (0, 0, 255), 2)  # POINT 5 ==> (710,585,145,145)
    # cv2.rectangle(imageA, (710, 730), (710 + _h, 730 + _h),
    #               (0, 0, 255), 2)  # POINT 6 ==> (710,730,145,145)

    cv2.line(imageA, (0, 0), (0, height), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (125, 0), (125, height), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (275, 0), (275, height), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (420, 0), (420, height), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (565, 0), (565, height), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (710, 0), (710, height), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (840, 0), (840, height), (255, 255 , 0), thickness=thickness)

    cv2.line(imageA, (0, 0), (width, 0), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (0, 145), (width, 145), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (0, 290), (width, 290), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (0, 440), (width, 440), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (0, 585), (width, 585), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (0, 730), (width, 730), (255, 255 , 0), thickness=thickness)
    cv2.line(imageA, (0, 860), (width, 860), (255, 255 , 0), thickness=thickness)

    return imageA


def distanceCalculate(p1, p2):
    dis = ((p2[0]-p1[0])**2+(p2[1]-p1[1])**2)**0.5
    dis = abs(dis)
    return dis


def detect_diff_region(img, c, x, y, w, h, threshold):
    if(distanceCalculate((x, y), (x+w, y+h)) > threshold):
        #print("real difference")
        center, _ = cv2.minEnclosingCircle(c)
        #print("C = ", center , radius)
        cv2.drawContours(img, [c], -1, (36, 255, 12), 2)
        cv2.circle(img, (int(center[0]), int(center[1])), 1, (0, 0, 255), 4)
        return img, center
    else:
        return img, (-1, -1)


def get_letter_by_center(points):
    return [reference[i] for pt in points for i in reference.keys()  if if_inside(i,pt)]


def if_inside(rect, pt):
    (rectX , rectY, width, height) = rect
    (ptX, ptY) = pt

    if (rectX < ptX < rectX+width and rectY < ptY < rectY + height):
        return True
    else:
        return False


def get_diff_centers(cnts , image):
    diff_centers = []
    for c in cnts:
        (x, y, w, h) = cv2.boundingRect(c)
        _ , center = detect_diff_region(image, c, x, y, w, h, 100)
        if(center != (-1, -1)):
            diff_centers.append(center)
    return diff_centers


reference = {
    (0, 0, 125, 145): "C",
    (125, 0, 145, 145) : "B" ,
    (275, 0, 145, 145) : "G" ,
    (420, 0, 145, 145) : "F",
    (565, 0, 145, 145) : "J" ,
    (710, 0, 145, 145) : "U" ,
    (0, 145, 125, 145) : "Q" ,
    (125, 145, 145, 145) : "T" ,
    (275, 145, 145, 145) : "E" ,
    (420, 145, 145, 145): "L" ,
    (565, 145, 145, 145) : "M" ,
    (710, 145, 145, 145) : "I" ,
    (0, 290, 125, 145) : "I"  ,
    (125, 290, 145, 145) : "A" ,
    (275, 290, 145, 145): "H"  ,
    (420, 290, 145, 145) : "O" ,
    (565, 290, 145, 145) : "P" ,
    (710, 290, 145, 145) : "S",
    (0, 440, 125, 145) :"F" ,
    (125, 440, 145, 145) : "V" ,
    (275, 440, 145, 145) : "S" ,
    (420, 440, 145, 145) : "N" ,
    (565, 440, 145, 145): "D" ,
    (710, 440, 145, 145) : "R" ,
    (0, 585, 125, 145) : "X" ,
    (125, 585, 145, 145) : "C" ,
    (275, 585, 145, 145) : "R" ,
    (420, 585, 145, 145) : "U" ,
    (565, 585, 145, 145) : "E" ,
    (710, 585, 145, 145) : "L" ,
    (0, 730, 125, 145) : "E" ,
    (125, 730, 145, 145) : "N" ,
    (275, 730, 145, 145) : "E" ,
    (420, 730, 145, 145) : "A" ,
    (565, 730, 145, 145) : "P" ,
    (710, 730, 145, 145) : "T" ,
}


# load the two input images
imageA = cv2.imread("upper_cropped.png")
imageB = cv2.imread("upper_cropped_noise.png")

h1, w1, v1 = imageA.shape
h2, w2, v2 = imageB.shape


# convert the images to grayscale
grayA = cv2.cvtColor(imageA, cv2.COLOR_BGR2GRAY)
grayB = cv2.cvtColor(imageB, cv2.COLOR_BGR2GRAY)

# compute the Structural Similarity Index (SSIM) between the two
# images, ensuring that the difference image is returned
(score, diff) = metrics.structural_similarity(grayA, grayB, full=True)
diff = (diff * 255).astype("uint8")
# print("SSIM: {}".format(score))

# threshold the difference image, followed by finding contours to
# obtain the regions of the two input images that differ
thresh = cv2.threshold(diff, 0, 255,
                       cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                        cv2.CHAIN_APPROX_SIMPLE)
cnts = imutils.grab_contours(cnts)


diff_centers = get_diff_centers(cnts , imageA)
letters = get_letter_by_center(diff_centers)
print(letters)

height, width, _ = imageA.shape
#imageA = draw_contours(imageA, height=height, width=width, thickness=2)


# show the output images
cv2.imshow("Original", imageA)
# cv2.imshow("Modified", imageB)
# cv2.imshow("Diff", diff)
# cv2.imshow("Thresh", thresh)
cv2.waitKey(0)
