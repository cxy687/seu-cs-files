import cv2
import numpy as np
import  math

# 生成题中RGB图像
bgr_img = np.zeros([500, 500, 3], np.uint8)
# B G R
for i in range(0, 500):
    for j in range(0, 500):
        if i in range(0, 250) and j in range(0, 250):
            color = [0, 255, 0]
            bgr_img[i][j] = color
        if i in range(0, 250) and j in range(250, 500):
            color = [0, 0, 255]
            bgr_img[i][j] = color
        if i in range(250, 500) and j in range(0, 250):
            color = [255, 0, 0]
            bgr_img[i][j] = color
        if i in range(250, 500) and j in range(250, 500):
            color = [0, 255, 0]
            bgr_img[i][j] = color

cv2.imwrite('rgb_img.png', bgr_img)

def rgb2hsi(rgb_lwpImg):
    rows = int(rgb_lwpImg.shape[0])
    cols = int(rgb_lwpImg.shape[1])
    B, G, R = cv2.split(rgb_lwpImg)
    # 归一化到[0,1]
    B = B / 255.0
    G = G / 255.0
    R = R / 255.0
    hsi_lwpImg = rgb_lwpImg.copy()
    H, S, I = cv2.split(hsi_lwpImg)
    for i in range(rows):
        for j in range(cols):
            num = 0.5 * ((R[i, j] - G[i, j]) + (R[i, j] - B[i, j]))
            den = np.sqrt((R[i, j] - G[i, j]) ** 2 + (R[i, j] - B[i, j]) * (G[i, j] - B[i, j]))
            theta = float(np.arccos(num / den))

            if den == 0:
                H = 0
            elif B[i, j] <= G[i, j]:
                H = theta
            else:
                H = 2 * 3.14169265 - theta

            min_RGB = min(min(B[i, j], G[i, j]), R[i, j])
            sum = B[i, j] + G[i, j] + R[i, j]
            if sum == 0:
                S = 0
            else:
                S = 1 - 3 * min_RGB / sum

            H = H / (2 * 3.14159265)
            I = sum / 3.0
            # 输出HSI图像，扩充到255以方便显示，一般H分量在[0,2pi]之间，S和I在[0,1]之间
            hsi_lwpImg[i, j, 0] = H * 255
            hsi_lwpImg[i, j, 1] = S * 255
            hsi_lwpImg[i, j, 2] = I * 255
    return hsi_lwpImg

def hsi2rgb(hsi_img):
    h = int(hsi_img.shape[0])
    w = int(hsi_img.shape[1])
    H, S, I = cv2.split(hsi_img)
    H = H / 255.0
    S = S / 255.0
    I = I / 255.0
    bgr_img = hsi_img.copy()
    B, G, R = cv2.split(bgr_img)
    for i in range(h):
        for j in range(w):
            if S[i, j] < 1e-6:
                R = I[i, j]
                G = I[i, j]
                B = I[i, j]
            else:
                H[i, j] *= 360
                if H[i, j] > 0 and H[i, j] <= 120:
                    B = I[i, j] * (1 - S[i, j])
                    R = I[i, j] * (1 + (S[i, j] * math.cos(H[i, j]*math.pi/180)) / math.cos((60 - H[i, j])*math.pi/180))
                    G = 3 * I[i, j] - (R + B)
                elif H[i, j] > 120 and H[i, j] <= 240:
                    H[i, j] = H[i, j] - 120
                    R = I[i, j] * (1 - S[i, j])
                    G = I[i, j] * (1 + (S[i, j] * math.cos(H[i, j]*math.pi/180)) / math.cos((60 - H[i, j])*math.pi/180))
                    B = 3 * I[i, j] - (R + G)
                elif H[i, j] > 240 and H[i, j] <= 360:
                    H[i, j] = H[i, j] - 240
                    G = I[i, j] * (1 - S[i, j])
                    B = I[i, j] * (1 + (S[i, j] * math.cos(H[i, j]*math.pi/180)) / math.cos((60 - H[i, j])*math.pi/180))
                    R = 3 * I[i, j] - (G + B)
            bgr_img[i, j, 0] = B * 255
            bgr_img[i, j, 1] = G * 255
            bgr_img[i, j, 2] = R * 255
    return bgr_img

hsi_img = rgb2hsi(bgr_img)
cv2.imwrite('hsi_img.png', hsi_img)

h_img, s_img, i_img = cv2.split(hsi_img)
h_blur = cv2.blur(h_img, (250, 250))
cv2.imwrite('blur.png', h_blur)

for i in range(0, 500):
    for j in range(0, 500):
        hsi_img[i, j, 0] = h_blur[i][j]

rgb_blur = hsi2rgb(hsi_img)
cv2.imwrite('rgb_blur.png', rgb_blur)
cv2.imwrite('h_blur.png', hsi_img)
cv2.imwrite('h_img.png',h_img)
cv2.imwrite('s_img.png',s_img)
cv2.imwrite('i_img.png',i_img)

