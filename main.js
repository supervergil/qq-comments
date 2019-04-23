import "./main.scss";
import { format } from "timeago.js";
import nunjucks from "nunjucks";
import marked from "marked";
import commentLayout from "./views/comment-layout.njk";
import comment from "./views/comment.njk";

class QQComment {
  constructor(id, opts) {
    this.container = document.getElementById(id);
    this.appId = opts.appId;
    this.redirectURI = opts.redirectURI;
    this.userInfo = opts.userInfo;
    this.openId = opts.openId;
    this.token = opts.token;
    this.commentCount = opts.commentCount;
    this.listening();
    this.init();
  }

  // 监听事件
  listening() {
    document.body.onclick = e => {
      switch (e.target.id || e.target.parentNode.id) {
        case "qqLoginBtn":
          localStorage.setItem("redirect_url", window.location.href);
          QC.Login.showPopup({
            appId: this.appId,
            redirectURI: this.redirectURI
          });
          break;
        case "gt-user-name":
          document.getElementById("name-dropdown").style.display =
            document.getElementById("name-dropdown").style.display === "none"
              ? "block"
              : "none";
          break;
        case "gt-user-name-icon":
          document.getElementById("name-dropdown").style.display =
            document.getElementById("name-dropdown").style.display === "none"
              ? "block"
              : "none";
          break;
        case "gt-header-textarea":
          e.stopPropagation();
          break;
        case "preview-markdown":
          document.getElementById("markdown-body").innerHTML = marked(
            document.getElementById("gt-header-textarea").value
          );
          document.getElementById("gt-header-textarea").className =
            "gt-header-textarea hide";
          document.getElementById("preview-markdown").className =
            "gt-btn gt-btn-preview hide";
          document.getElementById("edit-markdown").className =
            "gt-btn gt-btn-preview";
          document.getElementById("markdown-body").className =
            "gt-header-preview markdown-body";
          break;
        case "edit-markdown":
          document.getElementById("gt-header-textarea").className =
            "gt-header-textarea";
          document.getElementById("preview-markdown").className =
            "gt-btn gt-btn-preview";
          document.getElementById("edit-markdown").className =
            "gt-btn gt-btn-preview hide";
          document.getElementById("markdown-body").className =
            "gt-header-preview markdown-body hide";
          break;
        default:
          if (document.getElementById("name-dropdown")) {
            document.getElementById("name-dropdown").style.display = "none";
          }
          break;
      }
    };
  }

  // 初始化qq评论
  init() {
    const renderedTpl = nunjucks.renderString(commentLayout, {
      openId: this.openId,
      isQQLogin: !!(this.userInfo && this.openId && this.token),
      userInfo: this.userInfo,
      draft: localStorage.getItem("comment-draft") || "",
      commentCount: this.commentCount
    });
    this.container.innerHTML = renderedTpl;
    this.changeTextareaStyle();
  }

  // 设置评论数量
  setCommentCount(count) {
    this.commentCount = count;
    document.getElementById("comment-count").innerHTML = count;
  }

  // 添加评论
  addComments(comments, sort) {
    const renderedCommentTpl = nunjucks.renderString(comment, {
      comments: comments.map(item => {
        item.bodyHtml = marked(item.content);
        item.created_date = format(
          new Date(item.created_date.replace(/\-/g, "/")),
          "zh_CN"
        );
        return item;
      }),
      openId: this.openId,
      isQQLogin: !!(this.userInfo && this.openId && this.token),
      userInfo: this.userInfo,
      draft: localStorage.getItem("comment-draft") || ""
    });
    if (sort) {
      document.getElementById("gt-comments").innerHTML =
        renderedCommentTpl + document.getElementById("gt-comments").innerHTML;
    } else {
      document.getElementById("gt-comments").innerHTML += renderedCommentTpl;
    }
  }

  // 隐藏加载按钮
  hideLoadMore() {
    document.getElementsByClassName("gt-btn-loadmore")[0].className =
      "gt-btn gt-btn-loadmore hide";
  }

  // 显示加载按钮
  showLoadMore() {
    document.getElementsByClassName("gt-btn-loadmore")[0].className =
      "gt-btn gt-btn-loadmore";
  }

  // 显示加载按钮的loading
  showLoadMoreLoading() {
    document.getElementById("load-more-spinner").style.display = "inline";
  }

  // 隐藏加载按钮的loading
  hideLoadMoreLoading() {
    document.getElementById("load-more-spinner").style.display = "none";
  }

  // 清空评论列表
  clearCommentList() {
    document.getElementById("gt-comments").innerHTML = "";
  }

  // 文本框样式调节
  changeTextareaStyle() {
    const textarea = document.getElementById("gt-header-textarea");
    const rows = textarea.value.split(/\r?\n/).length;
    textarea.style.height = rows <= 3 ? "72px" : (rows - 3) * 16 + 72 + "px";
    if (rows > 12) {
      textarea.style.overflow = "hidden scroll";
    } else {
      textarea.style.overflow = "hidden";
    }
    localStorage.setItem("comment-draft", textarea.value);
  }

  // 是否正在发送评论
  isPosting() {
    return document.getElementById("post-spinner").style.display != "none";
  }

  // 获取评论内容
  getCommentContent() {
    return document.getElementById("gt-header-textarea").value;
  }

  // 清空评论框内容
  clearCommentContent() {
    document.getElementById("gt-header-textarea").value = "";
    localStorage.removeItem("comment-draft");
  }

  // 显示评论按钮的loading
  showCommentLoading() {
    document.getElementById("post-spinner").style.display = "inline";
  }

  // 隐藏评论按钮的loading
  hideCommentLoading() {
    document.getElementById("post-spinner").style.display = "none";
  }

  // 静态方法
  static onClickPost() {}
  static onClickLoadMore() {}
  static onClickRemove() {}
  static onClickLogout() {}
  static onClickReply() {
    var string =
      "> [@" +
      this.getAttribute("data-user") +
      "](javascript:void(0))  \n> " +
      this.getAttribute("data-content").replace(/\n/g, "\n> ") +
      "\n\n";
    document.getElementById("gt-header-textarea").value = string;
    document.getElementById("markdown-body").innerHTML = marked(
      document.getElementById("gt-header-textarea").value
    );
    document.getElementById("gt-header-textarea").focus();
    QQComment.prototype.changeTextareaStyle();
  }
  static onFocusTextarea() {
    QQComment.prototype.changeTextareaStyle();
  }
}

if (!!window) {
  window.QQComment = QQComment;
}

export default QQComment;
