/*
1.create by gjj 2018-06-21
2.未能找到选择单日期的控件，所以自己写了一个，基于jquery ui slider
思路：
1.只采用默认的slider，在设置最大值最小值的时候，计算最大最小日期间的天数，设置为slider的长度
2.未找到如何在slider上显示所选的数字，解决思路：在slider的上方放一个label，其像素位置根据所选的位置变化
3.未找到如何自定义slider的样式，解决思路：将slider的宽度设为最小，然后使用canvas自己画一个所需的样式（例如刻度尺之类的）
4.关于刻度尺的思路：刻度之间的间隔是根据每个月的天数决定的，其位置也是通过像素进行定位的
*/

var mindate='2017-09-02';
var maxdate='2018-08-31';
var dateLength=getDays(mindate,maxdate);
var rulerWidth=$("#content").width();
$(function() {
    var today=getDays(mindate,'2018-06-20');
    var length=$("#slider").width();
    $("#slider").slider({
        value:today-1,
        min: 0,
        max: dateLength,
        step: 1,
        create:function(){
            $("#date-label").css("margin-left",length*(today/dateLength));
            $("#date-label").text(getAfterDate(mindate,today));
        },
        slide: function( event, ui ) {
            $("#date-label").css("margin-left",length*(ui.value/dateLength));
            $("#date-label").text(getAfterDate(mindate,ui.value));
        },
        change: function( event, ui ) {
            //这边定义拖拽日期结束后的事件
            console.log(getAfterDate(mindate,ui.value));
        }
    });
    //绘制时间刻度尺
    $("#content").append('<canvas id="ruler" width='+rulerWidth+' height="60" style="position: relative"></canvas>');
    drawRuler();
});
//获取某个日期之后N天的日期
function getAfterDate(minDate,days){
    let defaultDate = new Date(minDate);
    defaultDate.setTime(defaultDate.getTime()+864e5*days);
    let year=defaultDate.getFullYear(),month=defaultDate.getMonth()+1,day=defaultDate.getDate();
    return year+"年"+(month<10?'0'+month:month)+"月"+(day<10?'0'+day:day)+"日";
}
//计算两个日期之间相差多少天
function getDays(minDate , maxDate){
    let minDateObj = new Date(minDate),maxDateObj = new Date(maxDate)
        ,minTime = minDateObj.getTime(),maxTime = maxDateObj.getTime()
        ,minusDays = Math.floor(((maxTime-minTime)/864e5));//计算出两个日期的天数差
    return Math.abs(minusDays);//取绝对值
}
//计算某年的某月一共有多少天
function getDaysInMonth(year, month) {
    let date = new Date(year, month, 1);
    return new Date(date.getTime() - 864e5).getDate();
}
//绘制刻度尺
function drawRuler(){
    let ruler=document.getElementById("ruler");
    let context=ruler.getContext("2d");
    context.font="lighter 12px 宋体";
    context.strokeStyle="white";
    context.fillStyle="white";
    context.textAlign="center";
    context.textBaseline="middle";

    //初始化最小日期
    let min_date=new Date(mindate);
    //获取最小日期的年份月份信息
    let min_year=min_date.getFullYear();
    let min_month=min_date.getMonth();

    //最小日期月一共多少天
    let thisMonthDays=getDaysInMonth(min_year,min_month+1);
    //最小日期是几号
    let min_day=min_date.getDate();

    //1天对应的直尺上的像素间隔,rulerWidth-100是因为头和尾各占用了50px
    let oneDayInterval=1/dateLength*(rulerWidth-100);

    //初始化的第一个月份对应的像素位置
    let j=(thisMonthDays-min_day)*oneDayInterval+50;
    //如果最小日期是1号，那么当月的那个月份也是需要标记的
    if(min_day===1){
        context.beginPath();
        //画刻度线
        context.moveTo(50,0);
        context.lineTo(50,10);
        //写月份
        context.fillText(min_month+1+'月',50+10,20);
        context.stroke();
        context.closePath();
    }

    while(j<(rulerWidth-51)){
        //当前月是几月
        let thisMonth=(min_date.getMonth()+1)%12;
        context.beginPath();
        //画刻度线
        context.moveTo(j,0);
        context.lineTo(j,10);
        //写月份
        context.fillText(thisMonth+1+'月',j+10,20);
        //设置月份
        min_date.setMonth(thisMonth);
        //如果月份加到12了，说明进入下一年了
        if(thisMonth===11){
            min_year+=1;
        }
        j+=getDaysInMonth(min_year,thisMonth+1)*oneDayInterval;
        if(thisMonth===11){
            context.save();
            context.font="lighter 15px 宋体";
            context.fillText(min_year+'年',j+50,10);
            context.restore();
        }
        context.stroke();
        context.closePath();
    }
}