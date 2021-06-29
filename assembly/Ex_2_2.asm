.8086           ;使用8086/8088处理器
.MODEL SMALL    ;内存模型
.DATA
    TABLE DB 0,1,4,9,16,25,36,49,64,81
    XX DB ?
    YY DB ?
    STRING DB 'INPUT A NUMBER BETWEEN 0-9:','$'
    STRING2 DB 'INPUT ERROR!','$'
    CR DB 0AH,0DH,'$'
.STACK
.CODE
START:
    MOV AX,@DATA
    MOV DS,AX;数据段赋给DS
    LEA DX,STRING
    MOV AH,09H
    INT 21H;输出提示字符串
    MOV AH,01H
    INT 21H;键盘输入
    LEA DX,CR
    MOV AH,09H
    INT 21H;输出换行
    SUB AL,30H;将ASC码转成真实数字
    CMP AL,00H
    JC EXIT;若比0小，转移
    CMP AL,0AH
    JNC EXIT;若比9大，转移
    LEA BX,TABLE
    XLAT;查表
    MOV YY,AL;将结果存至YY
    ADD AL,30H;将结果转成ASC码
    MOV AH,02H 
    MOV DL,AL
    INT 21H;将查表所得结果输出
    MOV AH,4CH
    INT 21H
EXIT:
    LEA DX,STRING2
    MOV AH,09H
    INT 21H;输出错误提示信息
    MOV AH,4CH
    INT 21H
END START