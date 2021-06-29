'''
实验二 灰度映射实验（直方图均衡）
1. 读取给定的图像文件；
2. 统计图像的灰度直方图，实现直方图均衡算法生成灰度映射表，完成图像的灰度变换；
3. 输出以BITMAP格式文件保存的处理结果图像；
'''
import cv2
import numpy as np
import matplotlib.pyplot as plt

# 读取输入图像
image = cv2.imread("img.tif", cv2.IMREAD_GRAYSCALE)
cv2.imshow('grayImg.png', image)
cv2.waitKey(1000)

# 获取图像的最大灰度，则灰度范围为[0,L-1]
L = image.max() + 1
# 创建长度为L的数组
n = np.zeros(L)
# 记录图像中不同灰度出现的次数
for row in range(0, len(image)):
    for col in range(0, len(image[0])):
        r = image[row][col]
        n[r] += 1

#计算总次数
n_sum = np.sum(n)
#归一化
p = n/n_sum

# #归一化输入图像灰度直方图
# plt.plot(range(L)/(L-1), p)
# plt.show()
# plt.close()

plt.hist(image.ravel(), L, [0, L])
#plt.savefig('输入图像灰度直方图')
plt.show()

#均衡后的图像矩阵
uni_image = np.zeros((len(image), len(image[0])))

for row in range(0, len(image)):
    for col in range(0, len(image[0])):
        #原图像灰度值
        r = image[row][col]
        #该灰度值在原图像中的灰度概率
        p_r = p[r]
        tmp = 0
        for i in range(0, r + 1):
            tmp += p[i]
        s = tmp*(L-1)
        uni_image[row][col] = s

uni_image = uni_image.astype(np.uint8)
cv2.imshow('HEimg', uni_image)
cv2.waitKey(1000)
cv2.imwrite('HEImg1.bmp', uni_image)

# # 记录变换后的新图像不同灰度出现次数
# m = []
# for row in range(0, len(uni_image)):
#     for col in range(0, len(uni_image[0])):
#         s = uni_image[row][col]
#         m.append(s)
# # 将数组去重又排序
# dupli_m = list(set(m))
# dupli_m.sort()
# # 计算灰度值出现的频率
# p_s = []
# for i in dupli_m:
#     p_s.append(m.count(i)/n_sum)
#
# plt.plot(dupli_m, p_s)
# plt.show()
# plt.close()

plt.hist(uni_image.ravel(), L, [0, L-1])
#plt.savefig('输出图像灰度直方图')
plt.show()
