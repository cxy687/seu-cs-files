import cv2
import numpy as np
import matplotlib.pyplot as plt

# 生成两幅80*80图像
img1 = np.zeros([80, 80], np.uint8)
img2 = np.zeros([80, 80], np.uint8)
L = 256

for i in range(0, 80):
    for j in range(0, 80):
        if j in range(0, 40):
            img1[i][j] = 255
        else:
            img1[i][j] = 0

for i in range(0, 80):
    m = i//10
    for j in range(0, 80):
        n = j//10
        if not (m+n) % 2:
            img2[i][j] = 255
        else:
            img2[i][j] = 0

# 显示图像
img1 = img1.astype(np.uint8)
cv2.imshow('img1', img1)
cv2.waitKey(1000)
cv2.imwrite('left.png', img1)

img2 = img2.astype(np.uint8)
cv2.imshow('img2', img2)
cv2.waitKey(1000)
cv2.imwrite('right.png', img2)

#显示两幅图像的直方图
plt.hist(img1.ravel(), L, [0, L-1])
plt.show()

plt.hist(img2.ravel(), L, [0, L-1])
plt.show()

img1 = img1.astype(np.int)
img2 = img2.astype(np.int)

#3*3均值模板
def he33(image, row, col):
    for i in range(0, row):
        for j in range(0, col):
            if i in range(1, row-1) and j in range(1, col-1):
                image[i][j] = int((image[i-1][j-1]+image[i-1][j]+image[i-1][j+1]+image[i][j-1]+image[i][j]+image[i][j+1]+image[i+1][j-1]+image[i+1][j]+image[i+1][j+1])/9)
            if i is 0:
                if j is 0:
                    image[i][j] = int((image[i][j]+image[i][j+1]+image[i+1][j]+image[i+1][j+1])/9)
                if j is col-1:
                    image[i][j] = int((image[i][j] + image[i][j-1] + image[i+1][j-1] + image[i+1][j])/9)
                else:
                    image[i][j] = int((image[i][j-1]+image[i][j]+image[i][j+1]+image[i+1][j-1]+image[i+1][j]+image[i+1][j+1])/9)
            else:
                if j is 0:
                    image[i][j] =int((image[i][j]+image[i][j+1]+image[i-1][j]+image[i-1][j+1])/9)

                if j is col-1:
                    image[i][j]=int((image[i][j]+image[i][j-1]+image[i-1][j]+image[i-1][j-1])/9)
                else:
                    image[i][j]=int((image[i][j]+image[i-1][j]+image[i][j-1]+image[i][j+1]+image[i-1][j-1]+image[i-1][j+1])/9)

he33(img1, 80, 80)
he33(img2, 80, 80)

img1 = img1.astype(np.uint8)
cv2.imshow('img1', img1)
cv2.waitKey(1000)
cv2.imwrite('img1.png',img1)

img2 = img2.astype(np.uint8)
cv2.imshow('img2', img2)
cv2.waitKey(1000)
cv2.imwrite('img2.png', img2)

plt.hist(img1.ravel(), L, [0, L-1])
plt.show()

plt.hist(img2.ravel(), L, [0, L-1])
plt.show()





