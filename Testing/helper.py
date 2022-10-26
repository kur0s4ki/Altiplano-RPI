def get_letter_by_center(center, reference):
    pass


def if_inside(rect, pt):
    (rectX , rectY, width, height) = rect
    (ptX, ptY) = pt

    if (rectX < ptX < rectX+width and rectY < ptY < rectY + height):
        return True
    else:
        return False



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



rect = (217 , 0 , 145 , 145)
pt1 = (348 , 74) # G
pt2 = (347,  364) # H
pt3 = (55 , 658) # X
pt4 = (635 , 662) # E

points =  [pt1 , pt2 , pt3 , pt4]

# for pt in points:
#     for i in reference.keys(): 
#         if(if_inside(i , pt)):
#             print( "rect = ", i)
#             print(reference[i])

# rectE = (565, 585, 145, 145)
# print(if_inside(rectE , pt4))

mylist = [reference[i] for pt in points for i in reference.keys()  if if_inside(i,pt)]
print(mylist)
