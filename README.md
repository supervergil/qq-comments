# qq-comments

功能已开发完成，有兴趣的同学可以看下demo的代码。demo地址：https://supervergil.github.io/qq-comments/

## 静态方法

| 静态方法              | 方法说明     |
| ------------------------- | ---------------- |
| QQComment.onClickPost     | 点击发布文章 |
| QQComment.onClickLoadMore | 点击加载更多按钮 |
| QQComment.onClickRemove   | 点击删除按钮 |
| QQComment.onClickLogout   | 点击注销按钮 |

## 实例方法

| 实例方法                            | 方法说明          | 传入参数                                                                                                                                                      |
| --------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QQComment.prototype.addComments         | 添加评论          | [{id:"评论id",user:{open_id:"用户openid",name:"用户昵称",avatar:"用户头像链接",admin:true//是否为当前登录用户的评论},created_date:"创建日期",content:"评论内容"}] |
| QQComment.prototype.hideLoadMore        | 隐藏加载按钮    |                                                                                                                                                                   |
| QQComment.prototype.showLoadMore        | 显示加载按钮    |                                                                                                                                                                   |
| QQComment.prototype.showLoadMoreLoading | 显示加载按钮的loading |                                                                                                                                                                   |
| QQComment.prototype.hideLoadMoreLoading | 隐藏加载按钮的loading |                                                                                                                                                                   |
| QQComment.prototype.clearCommentList    | 清空评论列表    |                                                                                                                                                                   |
| QQComment.prototype.isPosting           | 是否正在发送评论 |                                                                                                                                                                   |
| QQComment.prototype.getCommentContent   | 获取评论内容    |                                                                                                                                                                   |
| QQComment.prototype.clearCommentContent | 清空评论框内容 |                                                                                                                                                                   |
| QQComment.prototype.showCommentLoading  | 显示评论按钮的loading |                                                                                                                                                                   |
|                                         | 隐藏评论按钮的loading |                                                                                                                                                                   |

## 初始化

```
var qqComment = new QQComment("whole-container", {
    appId: "你的appId",
    redirectURI: "qq登录回调页面",
    userInfo: {
        avatar: "头像路径",
        nick_name: "账号昵称"
    },
    openId: "授权登录后的openid",
    token: "令牌"
});
```

## 使用方法

具体请参考index.html