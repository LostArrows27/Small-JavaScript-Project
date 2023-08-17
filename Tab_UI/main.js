function getLine() {
    var activenowtab = document.querySelector('.tab-item.active')
    var myLine = document.querySelector('.line');
    myLine.style.left = activenowtab.offsetLeft + "px";
    myLine.style.width = activenowtab.offsetWidth + "px";
}

getLine();

var myTabList = document.querySelectorAll('.tab-item');

var myPane = document.querySelectorAll('.tab-pane');

myTabList.forEach((tab, index) => {
    tab.onclick = function () {
        var temp = document.querySelector('.tab-item.active')
        temp.classList.remove('active')
        this.classList.add('active')
        var tempPane = document.querySelector('.tab-pane.active')
        tempPane.classList.remove('active')
        myPane[index].classList.add('active')
        // border duoi
        getLine();
    }
})
