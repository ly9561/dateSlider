# dateSlider
本控件是基于jquery ui slider做的一个日期拖动选择的控件

传入最小日期和最大日期，生成日期拖动时间轴，拖动选择具体的某个日期
实现效果：

![Alt text](https://git@github.com/ly9561/dateSlider/img/effect.png)

思路：

  1.只采用默认的slider，在设置最大值最小值的时候，计算最大最小日期间的天数，设置为slider的长度
  
  2.未找到如何在slider上显示所选的数字，解决思路：在slider的上方放一个label，其像素位置根据所选的位置变化
  
  3.未找到如何自定义slider的样式，解决思路：将slider的宽度设为最小，然后使用canvas自己画一个所需的样式（例如刻度尺之类的）
  
  4.关于刻度尺的思路：刻度之间的间隔是根据每个月的天数决定的，其位置也是通过像素进行定位的
  
