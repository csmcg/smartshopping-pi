import sys

filename = sys.argv[1]

f = open(sys.argv[1], "r")

count = 0
sum = 0

for line in f:
	count += 1
	sum += int(line)

avg = sum / count

print(avg)
print(count)
