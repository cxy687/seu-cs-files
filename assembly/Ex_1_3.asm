; 从键盘输入一个字符串，然后换行后将该字符串输出到屏幕。
.8086
.MODEL SMALL
.STACK
.DATA
    N EQU 50
    MAXLEN DB N
    ACTLEN DB ?
    STRING DB N DUP(?)
    CR DB 0AH,0DH,'$'
.CODE
START:
    MOV AX, @DATA
    MOV DS,AX
    LEA DX,MAXLEN
    MOV AH,0AH
    INT 21H;输入字符串
    LEA DX,CR
    MOV AH,09H
    INT 21H;输出换行
    LEA BX,STRING
    MOV BYTE PTR ACTLEN[BX],'$'; 在字符串后添加$
    LEA DX,STRING
    MOV AH,09H
    INT 21H;输出字符串
    MOV AH,4CH
    INT 21H
END START