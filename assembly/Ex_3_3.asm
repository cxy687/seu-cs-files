.8086           ;使用8086/8088处理器
.MODEL SMALL    ;内存模型
.DATA
    NUM  WORD  3570
    STRING  BYTE 5 DUP(20H),'$'  ; 20H为空格的ASCII码
.STACK
.CODE
START:
    MOV AX,@DATA
    MOV DS,AX
    MOV AX,NUM;将NUM赋值给AX
    MOV CX,4;设置循环次数
AGAIN:
    MOV DX,0;DX:AX
    MOV BX,10
    DIV BX;AX中存放商，DX中存放余数
    MOV BX,CX
    ADD DL,30H;转成ASC码
    MOV BYTE PTR STRING[BX],DL
    LOOP AGAIN
    LEA DX,STRING
    MOV AH,09H
    INT 21H
    MOV AH,4CH
    INT 21H
END START