.8086           ;使用8086/8088处理器
.MODEL SMALL    ;内存模型
.DATA
    BUFF DB 10,0,1,2,3,4,5,6,7,8,9;升序字节数组,第一个数存放数组长度
    LOW_INDEX DW ?
    HIGH_INDEX DW ?
    N DB 11
    FAIL DB 'NOT FOUND','$'
    SUCC DB 'FOUND','$'
.STACK
.CODE
START:
    MOV AX,@DATA
    MOV DS,AX
    MOV LOW_INDEX,1
    MOV AH,0
    MOV AL,BUFF
    MOV HIGH_INDEX,AX;初始化二分查找首尾index
SEARCH:    
    MOV AX,LOW_INDEX
    MOV DX,HIGH_INDEX
    CMP AX,DX
    JA EXIT;首比尾大，没找到
    MOV SI,LOW_INDEX
    ADD SI,HIGH_INDEX
    SHR SI,1;折半
    MOV AL,N
    CMP AL,BUFF[SI]
    JE FOUND;相等，找到了
    JB SMALLER;比中间数小
    JA BIGGER;比中间数大
SMALLER:
    DEC SI
    MOV HIGH_INDEX,SI
    JMP SEARCH
BIGGER:
    INC SI
    MOV LOW_INDEX,SI
    JMP SEARCH
FOUND:
    CLC;CF置0,此时SI是找到数的偏移地址
    LEA DX,SUCC
    MOV AH,09H
    INT 21H
    MOV CH,0
    MOV CL,BUFF;CX获得数组长度,也就是最后一个元素的偏移地址
    SUB CX,SI;
ADJUST:
    MOV AL,BUFF[SI+1]
    MOV BUFF[SI],AL
    INC SI
    LOOP ADJUST
    MOV AH,4CH
    INT 21H
EXIT:
    STC;CF置1
    LEA DX,FAIL
    MOV AH,09H
    INT 21H
    MOV AH,4CH
    INT 21H
END START