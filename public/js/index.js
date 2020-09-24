//加载好再显示
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        document.body.style.display = "block";
    } else {
        document.body.style.display = "none";
    };
};

//页面总宽度
var offsetW = document.body.offsetWidth;
//浏览器可显示高度 宽度
var clientH = document.documentElement.clientHeight;
var clientW = document.documentElement.clientWidth;
window.onresize = function () {
    clientH = document.documentElement.clientHeight;
    clientW = document.documentElement.clientWidth;
    adjustFontSize();
};
var header = document.getElementById('header');
var title = document.getElementById('title');
var subtitle = document.getElementById('subtitle');
var down = document.getElementById('down');
var search = document.getElementById('search');
var searchBtn = document.getElementById('search-btn');
var authorName = document.getElementById('author-name');
var authorNameSpan = document.getElementById('author-name-span');
var authorUrlGithub = document.getElementById('author-url-github');
var authorUrlBilibili = document.getElementById('author-url-bilibili');

down.onclick = function () {
    var headerH = 0;
    var scrollH = document.body.scrollHeight;
    var offsetH = document.body.offsetHeight
    if (document.getElementById('header')) {
        headerH = document.getElementById('header').scrollHeight;
    }
    else if (document.getElementById('header-focus')) {
        headerH = document.getElementById('header-focus').scrollHeight;
    }
    else if (document.getElementById('header-blur')) {
        headerH = document.getElementById('header-blur').scrollHeight;
    }
    clearInterval(down.timer);
    var dir = document.documentElement.scrollTop > headerH ? -1 : 1;
    down.timer = setInterval(function () {
        document.documentElement.scrollTop = document.documentElement.scrollTop + dir * Math.ceil(Math.abs(document.documentElement.scrollTop - headerH) / 10);
        if (Math.abs(document.documentElement.scrollTop - headerH) <= 10 || document.documentElement.scrollTop + offsetH + 20 >= scrollH) {
            clearInterval(down.timer);
        }
    }, 10);
};
function progressCalculate() {
    var result = 0;
    //滚动事件
    window.addEventListener('scroll', function (e) {
        //滚动高度
        //scrollT(full) + clientH = strollH
        //滚动百分比
        //(scrollT - headerH) / (scrollH - clientH - headerH)
        var scrollT = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollH = document.body.scrollHeight;
        var headerH = 0;
        if (document.getElementById('header')) {
            headerH = document.getElementById('header').scrollHeight;
        }
        else if (document.getElementById('header-focus')) {
            headerH = document.getElementById('header-focus').scrollHeight;
        }
        else if (document.getElementById('header-blur')) {
            headerH = document.getElementById('header-blur').scrollHeight;
        }
        result = (scrollT - headerH) * offsetW / (scrollH - clientH - headerH);
        result = result <= 0 ? 0 : result;
        document.getElementById('progress-bar-completed').style.width = result + "px";
    });
};
//字体适配
function adjustFontSize() {
    if (clientW <= 1200 && clientW > 500) {
        header.style.fontSize = "25px";
        title.style.fontSize = "40px";
        subtitle.style.fontSize = "35px";
        authorNameSpan.style.display = "inline";
        authorName.style.fontSize = authorUrlGithub.style.fontSize = authorUrlBilibili.style.fontSize = "20px";
    } else if (clientW <= 500) {
        header.style.fontSize = "15px";
        title.style.fontSize = "30px";
        subtitle.style.fontSize = "25px";
        authorNameSpan.style.display = "block";
        authorName.style.fontSize = authorUrlGithub.style.fontSize = authorUrlBilibili.style.fontSize = "5px";
    } else {
        header.style.fontSize = "20px";
        title.style.fontSize = "50px";
        subtitle.style.fontSize = "40px";
        authorNameSpan.style.display = "inline";
        authorName.style.fontSize = authorUrlGithub.style.fontSize = authorUrlBilibili.style.fontSize = "20px";
    }
    header.style.color = "rgba(255, 251, 240, 0.8)";
}
//搜索框变大变小的动画操作
function addSearchAnimation() {
    search.onblur = function () {
        search.id = 'search-blur';
        header.id = 'header-blur';
        searchBtn.id = 'search-btn-blur';
    }
    search.onfocus = function () {
        search.id = 'search-focus';
        header.id = 'header-focus';
        searchBtn.id = 'search-btn-focus';
    }
}

window.onload = function () {
    var body = document.body;
    body.style.textAlign = 'center';
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.position = "absolute";
    var archive = document.getElementById('archive');
    archive.style.textAlign = 'left';
    adjustFontSize();
    progressCalculate();
    addSearchAnimation();
};

var admin = document.getElementById('admin');
//TODO:
//SERVER ROUTE
admin.onclick = function () {
    console.log('test: admin');
}
var searchBtn = document.getElementById('search-btn');
var search = document.getElementById('search');
//TODO:
//SERVER ROUTE
searchBtn.onclick = function () {
    $.get("/search?search=" + search.value, function(data, status) {
        console.log(data + " " + status);
    });
    console.log(search.value);
    console.log('test: searchBtn');
}