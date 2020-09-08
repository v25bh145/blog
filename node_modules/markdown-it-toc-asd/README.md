# markdown-it-toc-asd

> markdown-it 用于向markdown文档添加目录的插件
>
> 基于:[markdown-it-toc-gb](https://www.npmjs.com/package/markdown-it-toc-gb)

## 用法Usage

#### 启用插件Enable plugin

```js
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-toc-asd')); // <-- this use(package_name) is required
```

#### 例子Example

```md
[toc]
```

Adding this tag with add anchors to each ```<h[n]>``` tag on your document, and will add a ```<ul>``` of hyperlinks pointing to these places on the page.

The end results looks like:

```html
<p>
     <ul>
	<li><a href="#asd_title_...">h1 Heading</a></li>
	...
	... 
     </ul> 
</p>
...
...
<h1><a id="asd_title_..." href="#asd_title_..."></a>h1 Heading</h1>
```

还可以通过css样式为标题添加头部触角：

```css
a[id*=asd_title_]::before{
		content:'¶';
		text-decoration:none;
		color:#409EFF;
	}
```

效果：

![实例图片](https://raw.githubusercontent.com/lanlingnian/asd_npm/master/markdown-it-toc-asd/img/head.png)



### Testing

To run the tests use:
```bash
make test
```