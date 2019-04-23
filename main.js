import "./main.scss";
import { format } from "timeago.js";
import nunjucks from "nunjucks";
import marked from "marked";

const commentLayout = `
<div class="gt-container">
<div class="gt-meta">
    <span class="gt-counts">
        <a class="gt-link gt-link-counts" id="comment-count">{{commentCount}}</a> 
        条评论
    </span>
    <div class="gt-user">
        <div class="gt-user-inner">
            {%if not isQQLogin %}
                <span class="gt-user-name">未登录用户</span>
            {% else %}
                <span class="gt-user-name" id="gt-user-name">
                    {{userInfo.nick_name}}
                </span>
                <span class="gt-ico gt-ico-arrdown">
                    <span class="gt-svg">
                        <svg  id="gt-user-name-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" p-id="1619">
                            <path d="M511.872 676.8c-0.003 0-0.006 0-0.008 0-9.137 0-17.379-3.829-23.21-9.97l-251.277-265.614c-5.415-5.72-8.743-13.464-8.744-21.984 0-17.678 14.33-32.008 32.008-32.008 9.157 0 17.416 3.845 23.25 10.009l228.045 241.103 228.224-241.088c5.855-6.165 14.113-10.001 23.266-10.001 8.516 0 16.256 3.32 21.998 8.736 12.784 12.145 13.36 32.434 1.264 45.233l-251.52 265.6c-5.844 6.155-14.086 9.984-23.223 9.984-0.025 0-0.051 0-0.076 0z" p-id="1620"></path>
                        </svg>
                    </span>
                </span>
                <div class="name-dropdown" id="name-dropdown" style="display: none;">
                    <a id="logout" onclick="QQComment.onClickLogout()">注销</a>
                </div>
            {% endif %}
        </div>
    </div>
</div>
<div class="gt-header">
    <a class="gt-avatar-github">
        <span class="gt-ico gt-ico-github">
            {% if not isQQLogin %}
                <span class="gt-svg unlogin-avatar">
                    <svg viewBox="0 0 32 32">
                        <path d="M25.694,13.182c0.268-0.915,0.416-1.88,0.416-2.881C26.11,4.612,21.5,0,15.81,0c-5.688,0-10.3,4.611-10.3,10.301   c0,1.001,0.149,1.966,0.416,2.881c-1.297,1.042-6.331,5.557-4.26,11.412c0,0,1.752-0.15,3.191-2.811   c0.437,1.703,1.251,3.25,2.361,4.543c-1.626,0.479-2.729,1.408-2.729,2.474c0,1.556,2.348,2.817,5.243,2.817   c1.965,0,3.676-0.582,4.573-1.44c0.494,0.065,0.992,0.11,1.503,0.11c0.512,0,1.011-0.045,1.503-0.11   c0.899,0.858,2.609,1.44,4.574,1.44c2.896,0,5.245-1.262,5.245-2.817c0-1.065-1.104-1.995-2.73-2.474   c1.109-1.293,1.925-2.84,2.362-4.543c1.438,2.66,3.188,2.811,3.188,2.811C32.024,18.738,26.99,14.223,25.694,13.182z"                fill="#FFF"/>
                    </svg>
                </span>
            {% else %}
                <img src="{{userInfo.avatar}}" class="gt-svg unlogin-avatar"/>
            {% endif %}
        </span>
    </a>
    <div class="gt-header-comment">
        <textarea class="gt-header-textarea" id="gt-header-textarea" placeholder="说点什么" style="overflow: hidden; overflow-wrap: break-word; resize: none; height: 72px;" oninput="QQComment.onFocusTextarea()">{{draft}}</textarea>
        <div class="gt-header-preview markdown-body hide" id="markdown-body"></div>
        <div class="gt-header-controls">
            <a class="gt-header-controls-tip" style="cursor: pointer;">
                <span class="gt-ico gt-ico-tip">
                    <span class="gt-svg">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M512 366.949535c-16.065554 0-29.982212 13.405016-29.982212 29.879884l0 359.070251c0 16.167882 13.405016 29.879884 29.982212 29.879884 15.963226 0 29.879884-13.405016 29.879884-29.879884L541.879884 396.829419C541.879884 380.763865 528.474868 366.949535 512 366.949535L512 366.949535z" p-id="3083"></path>
                            <path d="M482.017788 287.645048c0-7.776956 3.274508-15.553912 8.80024-21.181973 5.525732-5.525732 13.302688-8.80024 21.181973-8.80024 7.776956 0 15.553912 3.274508 21.079644 8.80024 5.525732 5.62806 8.80024 13.405016 8.80024 21.181973 0 7.776956-3.274508 15.656241-8.80024 21.181973-5.525732 5.525732-13.405016 8.697911-21.079644 8.697911-7.879285 0-15.656241-3.274508-21.181973-8.697911C485.292295 303.301289 482.017788 295.524333 482.017788 287.645048L482.017788 287.645048z" p-id="3084"></path>
                            <path d="M512 946.844409c-239.8577 0-434.895573-195.037873-434.895573-434.895573 0-239.8577 195.037873-434.895573 434.895573-434.895573 239.755371 0 434.895573 195.037873 434.895573 434.895573C946.895573 751.806535 751.755371 946.844409 512 946.844409zM512 126.17088c-212.740682 0-385.880284 173.037274-385.880284 385.777955 0 212.740682 173.037274 385.777955 385.880284 385.777955 212.740682 0 385.777955-173.037274 385.777955-385.777955C897.777955 299.208154 724.740682 126.17088 512 126.17088z" p-id="3085"></path>
                        </svg>
                    </span>
                    <span class="gt-ico-text">支持 Markdown 语法</span></span></a>
            {% if isQQLogin %}
                <button class="gt-btn" id="post-comment" onclick="QQComment.onClickPost.call(this)">
                    <span class="gt-btn-text">评论</span>
                    <span class="gt-btn-loading gt-spinner" style="display: none;" id="post-spinner"></span>
                </button>
            {% endif %}
            <button class="gt-btn gt-btn-preview hide" id="edit-markdown">
                <span class="gt-btn-text">编辑</span>
            </button>
            <button class="gt-btn gt-btn-preview" id="preview-markdown">
                <span class="gt-btn-text">预览</span></button>
            {% if not isQQLogin %}
                <button class="gt-btn gt-btn-login" id="qqLoginBtn">
                    <svg viewBox="0 0 35 35" style="width: 20px;height: 13px;vertical-align: middle;">
                        <path d="M25.694,13.182c0.268-0.915,0.416-1.88,0.416-2.881C26.11,4.612,21.5,0,15.81,0c-5.688,0-10.3,4.611-10.3,10.301   c0,1.001,0.149,1.966,0.416,2.881c-1.297,1.042-6.331,5.557-4.26,11.412c0,0,1.752-0.15,3.191-2.811   c0.437,1.703,1.251,3.25,2.361,4.543c-1.626,0.479-2.729,1.408-2.729,2.474c0,1.556,2.348,2.817,5.243,2.817   c1.965,0,3.676-0.582,4.573-1.44c0.494,0.065,0.992,0.11,1.503,0.11c0.512,0,1.011-0.045,1.503-0.11   c0.899,0.858,2.609,1.44,4.574,1.44c2.896,0,5.245-1.262,5.245-2.817c0-1.065-1.104-1.995-2.73-2.474   c1.109-1.293,1.925-2.84,2.362-4.543c1.438,2.66,3.188,2.811,3.188,2.811C32.024,18.738,26.99,14.223,25.694,13.182z" fill="#FFFFFF"/>
                    </svg>
                    <span class="gt-btn-text" style="vertical-align: middle;">使用 QQ 登录</span>
                </button>
            {% endif %}
        </div>
    </div>
</div>
<div class="gt-comments">
    <div id="gt-comments" style="position: relative;"></div>
    <div class="gt-comments-controls">
        <button class="gt-btn gt-btn-loadmore" onclick="QQComment.onClickLoadMore()">
            <span class="gt-btn-text">加载更多</span>
            <span class="gt-btn-loading gt-spinner" style="display: none;" id="load-more-spinner"></span>
        </button>
    </div>
</div>
</div>
`;

const comment = `
{% for commentItem in comments %}
<div data-id="{{commentItem.id}}" class="gt-comment {% if commentItem.user.admin %}gt-comment-admin{% endif %}" style="transform-origin: center top 0px;">
    <div class="gt-avatar gt-comment-avatar"><img src="{{commentItem.user.avatar}}" alt="头像"/></div>
    <div class="gt-comment-content">
        <div class="gt-comment-header">
            <a class="gt-comment-username" href="javascript:void(0)">{{commentItem.user.name}}</a>
            <span class="gt-comment-text">发表于</span>
            <span class="gt-comment-date">{{commentItem.created_date}}</span>
            {%if commentItem.user.open_id!==openId %}
                <a class="gt-comment-reply" data-user="{{commentItem.user.name}}" data-content="{{commentItem.content}}" onclick="QQComment.onClickReply.call(this)">
                    <span class="gt-ico gt-ico-reply">
                        <span class="gt-svg">
                            <svg viewBox="0 0 1332 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M529.066665 273.066666 529.066665 0 51.2 477.866666 529.066665 955.733335 529.066665 675.84C870.4 675.84 1109.333335 785.066665 1280 1024 1211.733335 682.666665 1006.933335 341.333334 529.066665 273.066666"></path>
                            </svg>
                        </span>
                    </span>
                </a>
            {% else %}
                <a class="gt-comment-reply" data-id="{{commentItem.id}}" onclick="QQComment.onClickRemove.call(this)">
                    <span class="gt-ico gt-ico-reply">
                        <span class="gt-svg">
                            <svg t="1547616921125" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1567" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
                                <defs>
                                    <style type="text/css"></style>
                                </defs>
                                <path d="M402.286446 786.285714v-402.285714c0-10.276571-8.009143-18.285714-18.285715-18.285714h-36.571428c-10.276571 0-18.285714 8.009143-18.285714 18.285714v402.285714c0 10.276571 8.009143 18.285714 18.285714 18.285715h36.571428c10.276571 0 18.285714-8.009143 18.285715-18.285715z m146.285714 0v-402.285714c0-10.276571-8.009143-18.285714-18.285714-18.285714h-36.571429c-10.276571 0-18.285714 8.009143-18.285714 18.285714v402.285714c0 10.276571 8.009143 18.285714 18.285714 18.285715h36.571429c10.276571 0 18.285714-8.009143 18.285714-18.285715z m146.285714 0v-402.285714c0-10.276571-8.009143-18.285714-18.285714-18.285714h-36.571429c-10.276571 0-18.285714 8.009143-18.285714 18.285714v402.285714c0 10.276571 8.009143 18.285714 18.285714 18.285715h36.571429c10.276571 0 18.285714-8.009143 18.285714-18.285715zM384.000731 219.428571h256l-27.428571-66.852571A21.942857 21.942857 0 0 0 602.84416 146.285714H421.705874a19.236571 19.236571 0 0 0-9.728 6.290286z m530.285715 18.285715v36.571428c0 10.276571-8.009143 18.285714-18.285715 18.285715H841.143589v541.696c0 62.866286-41.142857 116.553143-91.428572 116.553142h-475.428571c-50.285714 0-91.428571-51.419429-91.428572-114.285714V292.534857H128.000731a18.066286 18.066286 0 0 1-18.285714-18.285714v-36.571429c0-10.276571 8.009143-18.285714 18.285714-18.285714h176.566858L344.576731 123.977143c11.446857-28.013714 45.714286-50.870857 75.995429-50.870857h182.857143c30.281143 0 64.585143 22.857143 75.995428 50.870857l40.009143 95.414857H896.000731c10.276571 0 18.285714 8.009143 18.285715 18.285714z" fill="#F56C6C" p-id="1568"></path>
                            </svg>
                        </span>
                    </span>
                </a>
            {% endif %}
        </div>
        <div class="gt-comment-body markdown-body">
            {{commentItem.bodyHtml | safe}}
        </div>
    </div>
</div>
{% endfor %}
`;

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
