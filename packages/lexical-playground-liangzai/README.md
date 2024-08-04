这个readme是我自己创建的。

应用层来说，这个代码质量挺普通的，但还是有很多值得学习的地方。

好的地方：
这个项目 造了好几个轮子，比如 colorPicker。但我感觉比antd的colorPicker体验上还是要差一些，所以我直接用的antd。当然了这并不是编辑器的核心，甚至可以说和编辑器没有半毛钱关系，毫无关系可言。

# 梁仔的基于lexical的富文本编辑器
- copy from lexical-playground

我的基本思路就是 在这个分支 定期的和 lexical-playground 同步代码，然后在这个分支上进行一些自己的修改，这样可以保持和 lexical-playground 的代码同步，又可以在这个分支上进行自己的修改。

diff

本文件夹下之前没有的文件：
- .eslintrc.js 我是从项目根目录copy过来修改的 主要是 有几个报错我实在看不下去。比如不让我删除文件顶部的注释。
  - 但因此也学了一招，知道 可以做到强制项目里在文件顶部强制插入一段注释，说不定以后会用到。

## UI交互上
富文本编辑器交互方式上还有很多值得思考优化的地方。不断追求最佳实践。
目前我主要参考两个
- https://templates.tiptap.dev/9rHgQWnJ7F
- https://platejs.org/


这玩意如果想要体验最佳，还是得自己亲自编码实现各种功能，过程中当然可以
## 关于富文本编辑器开发的基本心智模型
> 强大的富文本编辑器完全就可以是一个低代码平台啊，从交互上来说，https://templates.tiptap.dev/9rHgQWnJ7F 的交互方式感觉更好。可以多参考。

行业内一些优秀的项目
- https://github.com/ianstormtaylor/slate
- https://github.com/udecode/plate
- https://quilljs.com/