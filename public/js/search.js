window.onload = function () {
    addSearchAnimation();
}
var search = document.getElementById('search');
var searchBtn = document.getElementById('search-btn');
//搜索框变大变小的动画操作
function addSearchAnimation() {
    search.onblur = function () {
        search.id = 'search-blur';
        searchBtn.id = 'search-btn-blur';
    }
    search.onfocus = function () {
        search.id = 'search-focus';
        searchBtn.id = 'search-btn-focus';
    }
}
//TODO:
//SERVER ROUTE
searchBtn.onclick = function () {
    $.get("/search?search=" + search.value, function (data, status) {
        console.log(data + " " + status);
    })
    console.log(search.value);
    console.log('test: searchBtn');
}