import random


test = [1,2,3,4,5,6,7,8,9]
print(" Original List ", test)

for i in range(len(test)):

	j= random.randint(0,len(test)-1)

	element = test.pop(j)
	test.append(element)

print("Shuffled List ", test)