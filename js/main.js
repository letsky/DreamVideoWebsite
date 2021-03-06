var get={// 低版本IE不支持byClassName方法，需要进行兼容
    byClass:function(aclass,parent){
        if(document.getElementsByClassName){
            return document.getElementsByClassName(aclass)
        }else{
            var Oparents=parent?document.getElementById(parent):document,
                    eles=[],elems=Oparents.getElementsByTagName("*");
            for(var i=0;i<elems.length;i++){
                if(elems[i].className == aclass){
                    eles.push(elems[i])
                }
            }
            return eles
        }
    }
};
window.onload=function(){
    //注释感觉写的有点混乱，大家看懂思路就好 ♪(´▽｀)
    //因时间有限，暂未添加触屏滑动效果 后面抽时间再补吧 另外在最新版谷歌  火狐 已经IE8下都是没问题的
    var list=document.getElementById("list");
    var image=list.getElementsByTagName("div");
    var next=get.byClass("next")[0];//这里注意通过兼容方法获得的class要加个数值【0】，不然识别不了
    var back=get.byClass("back")[0];
    var arrow=get.byClass("arrow");
    var len=3;//需要轮播的图片数量 ，注意这里减去回滚用的
    var imgWidth=document.documentElement.clientWidth || document.body.clientWidth;//获取当前屏幕的宽度,第二个属性为兼容IE
    var buttons=get.byClass("buttons")[0];
    var node=[];// li标签的容器
    var index=1;// 用于计算显示小圈圈的样式
    var anima=false;//防止熊孩子疯狂按箭头和小圈圈
    var timer=null;//用于定时器
    for(var i=0;i<image.length -2;i++){//注意这里我减去 2 ！！！！！！！！！！！！！
        node[i]=document.createElement("li");//为node数组添加li标签
        node[i].setAttribute("index",i+1);//为每个li标签添加自定义标签 index，属性为i+1,即1,2,3
        buttons.appendChild(node[i]); //将承载li标签的数组添加到ul里面去
    }
    window.onresize=function(){
        //每次屏幕尺寸变化将当前宽度重新赋值给imgwidth，并且调用changeList
        imgWidth=document.documentElement.clientWidth || document.body.clientWidth;
        changeList()
    };
    function changeList(){
        //将当前屏幕的宽度的负值赋值给list，这时你就看到css设置的left:-100%变成具体数值啦！
        list.style.left= -imgWidth + "px";
    }
    changeList();
    /*讲解下面的流程前 先解释imageWidth，不然可能有些同学看不懂
     因为图片宽度是全屏的，所以 屏幕的宽度 = 图片的宽度 = list的left值（绝对值）
     */
    next.onclick=function(){
        // 右箭头每点一下就是在当前list的left值上再加上需要滚动的值 使图片整体继续往左移动一个屏幕宽度
        // list需要移动的left值 = 当前屏幕宽度（imgWidth）

        if(anima == true){//当animaa为true时，不执行
            return
        }
        if(index == 3){//每点一次，index自加1 为3时则恢复为1 重新开始 这个是影响小圈圈的
            index = 1
        }else{
            index += 1
        }
        animate(-imgWidth);
        showButtons(); //计算当前index后调用为指定小圈圈添加样式
    };
    back.onclick=function(){
        if(anima == true){
            return
        }
        if(index == 1){
            index=3
        }else{
            index -= 1
        }
        animate(imgWidth);
        showButtons()
    };
    function animate (offset) {
        var interval=10;//动画播放间隔
        var timer=300;//动画时长
        var speed=offset/(timer/interval);//动画速度
        var left=parseInt(list.style.left)+offset;//获取需要到底的目标值
        anima=true;//动画执行过程使anima值为true 防止重复动画
        function go(){
            if ( (speed > 0 && parseInt(list.style.left) < left) || (speed < 0 && parseInt(list.style.left) > left)) {
                /*当speed>0 即为正  代表的是往左方向移动
                  那么此时的 parseInt(list.style.left) 与 left 是什么关系呢? parseInt(list.style.left) 是出发点   left是目的地
                  充分想象一下，往左移动，假如 图片一位置是 -1000px 图片二位置是-2000px
                  此时位于图片二,需要移动到图片一
                  明显是图片一 的数值 大于 图片二 的数值
                  即list.style.left < left 告诉浏览器 快点让它向左滚 */
                list.style.left = parseInt(list.style.left) + speed + 'px';//在原来位置的基础上将计算出来的speed加到当中进行向左（右）移动
                setTimeout(go, 10);//不断的自我调用，直到不满足if条件（这段其实可以用setInterval带代替）
            }else{
                anima=false;//动画执行完毕后变更anima的值 不然没法继续点
                list.style.left=left+"px";
                if(left > -imgWidth){  //当计算后的left值大于默认的 list的left值，图片轮播到img[0]的时候 重置
                    list.style.left= (-imgWidth * len)+"px"
                }
                if(left < -(imgWidth*len)){//去掉回滚用的图，list总的left值为 图片的数量 * 当前屏幕宽度
                    //即 list.style.left 最小的值= -1400px * 3，超过就重置
                    // list.style.left 最大的值= -1400px * 1，超过就重置
                    list.style.left= -imgWidth+"px"
                }
            }
        }
        go(); //记得调用
    }
    if(node.length >0){
        node[0].className=node[0].className==""?" on":node.className+" on" ;//为第一个小圈圈设置样式
    }
    function showButtons(){
        //调用小圈圈样式前，循环检查是否有on这个class存在
        //为什么不直接用 node[i].className=“” this.className=“on”;
        //主要是觉得太简单粗暴了
        for(var i=0;i<node.length;i++){
            node[i].className=node[i].className==""?"":node[i].className.replace(/\son|on/,"");
        }
            node[index-1].className=node[index-1].className==""?" on":node[index-1].className+" on";
    }
    for(var j=0;j<node.length;j++){
        node[j].onmouseover=stop;//鼠标移入时清除自动播放
        node[j].onclick=function(){
            if(anima == true){//同样，如果移动动画正在执行，点击失效
                return
            }
            if(this.className == " on"){//防止熊孩子对着同一个小圈圈不停的点
                return
            }
            var myIndex = parseInt(this.getAttribute("index")); //获取前面添加的自定义的值 作为索引
            //因为每张图片移动的值是固定的，都是当前屏幕的值，即-imgWidth；myIndex - index是计算间隔多少跟屏幕
            //如第一个跟第二个圈圈间隔为1,1*-imgWidth，与第三个圈圈间隔为2,2*-imgWidth
            var offset=(myIndex - index) * -Math.abs(imgWidth);//这里加个绝对值主要是起保险作用，可以直接 -imgWidth
           animate(offset);
            index=myIndex;//将当前点击的索引值赋值到index，不然会出现混乱
            showButtons()
        }
    }
    function play(){//自动播放
        timer=setInterval(function(){
            next.onclick()
        },3000)
    }
    play();
    function stop(){//停止自动播放
        clearInterval(timer)
    }
    for(var k=0;k<arrow.length;k++){
        arrow[k].onmouseover=stop
    }
    //因为箭头和小圈圈是浮云图片上方的，因而有时会造成移入箭头或小圈圈会判断为鼠标移出，执行自动播放
    list.onmouseover=stop;//鼠标移入停止自动播放
    list.onmouseout=play;//鼠标移出调用自动播放  注意stop play它们都是没有（）的
}