.8086           ;使用8086/8088处理器
.MODEL SMALL    ;内存模型
.DATA
    STRING DB 'INPUT:','$'
    N EQU 8
    BUF DB N DUP(30H),'$'
    STRING1 DB 'You must input 0-9, or ''q'' or ''Q''','$'
    CR DB 0AH,0DH,'$'
.STACK
.CODE
MAIN:
    MOV AX,@DATA
    MOV DS,AX
AGAIN:
    MOV AH,09H
    LEA DX,STRING
    INT 21H;输出提示字符串
    MOV AH,01H
    INT 21H;输入字符,存在AL中
    CALL CRLF
    SUB AL,30H
    JB WRONG;小于0
    CMP AL,9
    JA Qq;大于9
    CBW;入口参数AX
    CALL OUTPUT
    CALL CRLF
    JMP AGAIN
WRONG:
    LEA DX,STRING1
    MOV AH,09H
    INT 21H;输出错误提示字符串
    CALL CRLF
    JMP AGAIN
Qq:
    CMP AL,21H;是否为Q
    JE EXIT
    CMP AL,41H;是否为q
    JE EXIT
    JMP WRONG;Qq都不是，输出错误提示字符
EXIT:
    MOV AH,4CH
    INT 21H
;----------------------
CRLF PROC NEAR
    PUSH AX
    PUSH DX
    MOV AH,09H
    LEA DX,CR
    INT 21H;输出换行
    POP DX
    POP AX
    RET
CRLF ENDP
;----------------------
OUTPUT PROC NEAR;入口参数AX,0-9转成八位二进制数
    PUSH BX
    PUSH CX
    PUSH DX
    MOV BX,7;设置偏移量
    MOV CL,4;设置循环次数
    MOV DL,2
RE:
    DIV DL 
    ADD AH,30H
    MOV BUF[BX],AH
    MOV AH,0
    DEC BX
    DEC CL
    JNZ RE  
    MOV AH,09H
    LEA DX,BUF
    INT 21H;输出结果
    POP DX
    POP CX
    POP BX
    RET
OUTPUT ENDP
END MAIN