.8086           ;使用8086/8088处理器
.MODEL SMALL    ;内存模型
.DATA
    N EQU 50
    MAXLEN DB N
    ACTLEN DB ?
    INPUT DB N DUP(?);开辟空间
    RIGHT DB 'It is a palindrome','$'
    WRONG DB 'It is NOT a palindrome','$'
    STRING DB 'INPUT A STRING:','$'
    CR DB 0AH,0DH,'$'
.STACK
.CODE
START:
    MOV AX,@DATA
    MOV DS,AX
    LEA DX,STRING
    MOV AH,09H
    INT 21H;输出提示字符串
    LEA DX,MAXLEN
    MOV AH,0AH
    INT 21H;输入字符串
    MOV AH,09H
    LEA DX,CR
    INT 21H;输出换行
    MOV SI,0FFFFH
    MOV BH,00H
    MOV BL,ACTLEN
PALI:
    INC SI
    DEC BX;SI指向字符串首，BX指向字符串尾
    CMP SI,BX
    JAE EXIT
    MOV AL,INPUT[SI]
    MOV DL,INPUT[BX]
    CMP AL,DL
    JZ PALI
    LEA DX,WRONG;不是回文串
    JMP OUTPUT
EXIT:
    LEA DX,RIGHT;是回文串
OUTPUT:
    MOV AH,09H
    INT 21H
    MOV AH,4CH
    INT 21H
END START