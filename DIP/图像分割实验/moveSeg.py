import cv2
import numpy as np

image = cv2.imread("SegImg.bmp", cv2.IMREAD_GRAYSCALE)
img_row = image.shape[0]
img_col = image.shape[1]
size = img_row * img_col

#按Z字形扫描图像
arr = np.zeros(size)
for i in range(0, img_row):
    for j in range(0, img_col):
        if img_row/2 is 0:
            arr[img_col*i+j] = image[i][j]
        else:
            arr[img_col*i+img_col-1-j] = image[i][j]

n = 20
m = np.zeros(size)
for k in range(n-1, size):
    sum = 0
    for i in range(k+1-n, k+1):
        sum += arr[i]
    m[k] = sum/n

b = 1.2
image2 = np.zeros([img_row, img_col], np.int)
for i in range(0, img_row):
    for j in range(0, img_col):
        if img_row/2 is 0:
            T_ij = b * m[img_col*i+j]
        else:
            T_ij = b * m[img_col*i+img_col-1-j]
        if image[i][j] > T_ij:
            image2[i][j] = 255
        else:
            image2[i][j] = 0

image2 = image2.astype(np.uint8)
cv2.imshow('SegOut.png', image2)
cv2.waitKey(0)
cv2.imwrite('SegOut2.bmp', image2)