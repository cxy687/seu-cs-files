'''
实验三 图像锐化
1. 读取给定的图像文件；
2. 实现unsharp masking算法，其中，滤波器和算法中的参数根据图像特性自主选择；
3. 输出以BITMAP格式文件保存的处理结果图像；
'''

import cv2
import numpy as np

img = cv2.imread("sharp.bmp", cv2.IMREAD_GRAYSCALE)
# cv2.imshow('img', img)
# cv2.waitKey(1000)

img_row = img.shape[0]
img_col = img.shape[1]
rows = img_row + 2
cols = img_col + 2
image = np.zeros([rows, cols], np.int)

# 在图像周围加一圈灰度值为0的边界
for i in range(1, rows-1):
    for j in range(1, cols-1):
        image[i][j] = img[i-1][j-1]

# 使用加权平滑滤波器，邻域大小为3×3
def weightSF(Img, Rows, Cols):
    for ii in range(1, Rows - 1):
        for jj in range(1, Cols - 1):
            temp = 4 * Img[ii][jj] + 2 * (Img[ii - 1][jj] + Img[ii + 1][jj] + Img[ii][jj - 1] + Img[ii][jj + 1]) + \
                   (Img[ii - 1][jj - 1] + Img[ii + 1][jj - 1] + Img[ii - 1][jj + 1] + Img[ii + 1][jj + 1])
            Img[ii][jj] = int(temp / 16)

SFimage = image.copy()
weightSF(SFimage, rows, cols)# 模糊后的图像
Gimage = np.zeros([rows, cols], np.int)
Gimage = image - SFimage# 获得模板
sharpedImg = np.zeros([rows, cols], np.int)
sharpedImg = image + 10*Gimage
for i in range(0, rows):
    for j in range(0, cols):
        if sharpedImg[i][j] < 0:
            sharpedImg[i][j] = 0
        if sharpedImg[i][j] > 255:
            sharpedImg[i][j] = 255
SFimage = SFimage.astype(np.uint8)
Gimage = Gimage.astype(np.uint8)
sharpedImg = sharpedImg.astype(np.uint8)
cv2.imwrite('blur.bmp', SFimage)
cv2.imwrite('template.bmp', Gimage)
cv2.imwrite('weightedSharp.bmp', sharpedImg)



