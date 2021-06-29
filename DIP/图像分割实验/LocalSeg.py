'''
实验四 图像分割
设计图像分割算法完成SegImg.bmp图像的分割，分割结果“米粒”像素标记为255，“背景”像素标记为0
'''
import cv2
import numpy as np

# 读取输入图像
image = cv2.imread("SegImg.bmp", cv2.IMREAD_GRAYSCALE)
# cv2.imshow('SegIn.png', image)
# cv2.waitKey(0)

img_row = image.shape[0]
img_col = image.shape[1]

image2 = np.zeros([img_row, img_col], np.int)

temp = image.astype(np.int)
sum = 0
for i in range(0,img_row):
    for j in range(0,img_col):
        sum += temp[i][j]
m_g = sum/(img_row*img_col)
print(m_g)
a = 4
b = 0.9
for i in range(1, img_row-1):
    for j in range(1, img_col-1):
        m_ij = (temp[i-1][j-1]+temp[i-1][j]+temp[i-1][j+1]+temp[i][j-1]+temp[i][j]\
              +temp[i][j+1]+temp[i+1][j-1]+temp[i+1][j]+temp[i+1][j+1])/9
        sigma_ij = np.sqrt((np.square(temp[i-1][j-1]-m_ij)+np.square(temp[i-1][j]-m_ij)\
                 +np.square(temp[i-1][j+1] - m_ij)+np.square(temp[i][j-1]-m_ij)\
                 +np.square(temp[i][j]-m_ij)+np.square(temp[i][j+1]-m_ij)\
                 +np.square(temp[i+1][j-1]-m_ij)+np.square(temp[i+1][j]-m_ij)\
                 +np.square(temp[i+1][j+1]-m_ij))/9)
        T_ij = a*sigma_ij+b*m_g
        if image[i][j] > T_ij:
            image2[i][j] = 255
        else:
            image2[i][j] = 0

image2 = image2.astype(np.uint8)

cv2.imshow('SegOut.png', image2)
cv2.waitKey(0)
cv2.imwrite('4-09.bmp', image2)