'''
实验一 图像几何变换和插值
1. 读取给定的图像文件；
2. 以图像几何中心为参考点，对图像做顺时针方向旋转45度并放大3倍，输出图像尺寸与输入图像相同，参考点在输出图像中仍位于图像几何中心位置。其中，插值采用双线性插值算法；
3. 输出图像以BITMAP格式文件保存；
'''
import cv2
import numpy as np
import math

image = cv2.imread("img.tif", cv2.IMREAD_GRAYSCALE)
cv2.imshow('image', image)
cv2.waitKey(1000)

img_row = image.shape[0]
img_col = image.shape[1]
img_center = [int(img_row/2), int(img_col/2)]


def scale(img, rows, cols, center, fractor):
    img1 = np.zeros((rows, cols))
    for i in range(rows):
        for j in range(cols):
            x1 = i-center[0]
            y1 = j-center[1]
            x0 = x1/fractor
            y0 = y1/fractor
            m = int(x0)
            n = int(y0)
            a = abs(x0-m)
            b = abs(y0-n)
            i0 = m+center[0]
            j0 = n+center[1]
            img1[i][j] = img[i0][j0]*(1-a)*(1-b)+img[i0+1][j0]*a*(1-b)+img[i0][j0+1]*(1-a)*b+img[i0+1][j0+1]*a*b
    return img1

def rotate(img, rows, cols, center, degree):
    sin_degree = math.sin(degree)
    cos_degree = math.cos(degree)
    img1 = np.zeros((rows, cols))
    for i in range(rows):
        for j in range(cols):
            x1 = i-center[0]
            y1 = j-center[1]
            x0 = x1*cos_degree + y1*sin_degree
            y0 = y1*cos_degree-x1*sin_degree
            m = int(x0)
            n = int(y0)
            a = abs(x0-m)
            b = abs(y0-n)
            i0 = m+center[0]
            j0 = n+center[1]
            if 0 <= i0 < rows-1 and 0 <= j0 < cols-1:
                img1[i][j] = img[i0][j0]*(1-a)*(1-b)+img[i0+1][j0]*a*(1-b)+img[i0][j0+1]*b*(1-a)+img[i0+1][j0+1]*a*b
    return img1

num = 2
degree = -math.pi/4
image1 = scale(image, img_row, img_col, img_center, num)
# image1 = rotate(image, img_row, img_col, img_center, -math.pi/4)
image1 = image1.astype(np.uint8)
cv2.imshow('image1', image1)
cv2.waitKey(1000)

img_row1 = image1.shape[0]
img_col1 = image1.shape[1]
img_center1 = [int(img_row1/2), int(img_col1/2)]

image2 = rotate(image1, img_row1, img_col1, img_center1, degree)
# image2 = scale(image1, img_row1, img_col1, img_center1, num)
image2 = image2.astype(np.uint8)
cv2.imshow('image2', image2)
cv2.waitKey(1000)

#cv2.imwrite('processImg.bmp', image2)