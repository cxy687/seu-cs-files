.8086           ;使用8086/8088处理器
.MODEL SMALL    ;内存模型
.DATA
    STRING DB 'INPUT A DAY BETWEEN 1-7:','$'
    STRING1 DB 'MONDAY','$'
    STRING2 DB 'TUESDAY','$'
    STRING3 DB 'WEDNESDAY','$'
    STRING4 DB 'THURSDAY','$'
    STRING5 DB 'FRIDAY','$'
    STRING6 DB 'SATURDAY','$'
    STRING7 DB 'SUNDAY','$'
    ERRMESS DB 'INPUTERROR!','$'
    TABLE WORD DAY1
          WORD DAY2
          WORD DAY3
          WORD DAY4
          WORD DAY5
          WORD DAY6
          WORD DAY7
.STACK
.CODE
START:
    MOV AX,@DATA
    MOV DS,AX
    LEA DX,STRING
    MOV AH,09H
    INT 21H;输出提示字符串
    MOV AH,01H
    INT 21H;键盘输入
    AND AL,0FH;将输入数字由ASCⅡ码转成数字
    CMP AL,01H
    JB ERR
    CMP AL,07H
    JA ERR;小于1或大于7的异常处理
    MOV AH,00H
    SHL AL,1;每个地址占2个单元
    SUB AL,2;调整偏移量
    MOV SI,AX
    JMP TABLE[SI];跳转到相应程序段入口地址
DAY1:
    LEA DX,STRING1
    JMP EXIT
DAY2:
    LEA DX,STRING2
    JMP EXIT
DAY3:
    LEA DX,STRING3
    JMP EXIT
DAY4:
    LEA DX,STRING4
    JMP EXIT
DAY5:
    LEA DX,STRING5
    JMP EXIT
DAY6:
    LEA DX,STRING6
    JMP EXIT
DAY7:
    LEA DX,STRING7
    JMP EXIT
ERR:
    LEA DX,ERRMESS
EXIT:
    MOV AH,09H
    INT 21H;输出结果
    MOV AH,4CH
    INT 21H
END START