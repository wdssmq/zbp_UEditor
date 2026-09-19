// 主要配置由 window.UEditorLoadConfig 流程提供，下边则可以覆盖具体某一项
const EditorOption = {
  initialFrameWidth: '100%',
}

const EditorIntroOption = {
  toolbars: [['Source', 'bold', 'italic', 'link', 'insertimage', 'Undo', 'Redo']],
  autoHeightEnabled: false,
  initialFrameHeight: 200
}

function getContent() {
  return editor_api.editor.content.get();
}

function getIntro() {
  return editor_api.editor.intro.get();
}

function setContent(s) {
  editor_api.editor.content.put(s);
}

function setIntro(s) {
  editor_api.editor.intro.put(s);
}

function editor_init() {
  if (!window.UEditorConfigLoaded) {
    window.UEditorLoadConfig(function(config) {
      window.UEDITOR_CONFIG = config;
      editor_init();
    });
    return;
  }
  function addButton(id) {
    const s = this;
    UE.registerUI(s.name, function(editor, uiName) {
      return new UE.ui.Button({
        name: uiName,
        title: uiName,
        cssRules: "background: rgba(0, 0, 0, 0) url(" + s.icon + ") no-repeat center / 16px 16px !important;",
        onclick: function() {
          s.callback.call(editor)
        }
      });
    }, void 0, id);
  }

  typeof contentBarBtn === 'undefined' || $.each(contentBarBtn, function(index, obj) {
    UEDITOR_CONFIG["toolbars"][0].push(obj.name);
    addButton.call(obj, 'editor_content');
  })

  typeof introBarBtn === 'undefined' || $.each(introBarBtn, function(index, obj) {
    EditorIntroOption.toolbars[0].push(obj.name);
    addButton.call(obj, 'editor_intro');
  })

  editor_api.editor.content.obj = UE.getEditor('editor_content', EditorOption);
  editor_api.editor.intro.obj = UE.getEditor('editor_intro', Object.assign({}, EditorIntroOption, EditorOption));
  editor_api.editor.content.get = function() { return this.obj.getContent() };
  editor_api.editor.content.put = function(str) { return this.obj.setContent(str) };
  editor_api.editor.content.focus = function() { return this.obj.focus() };
  editor_api.editor.content.insert = function(str) { return this.obj.execCommand("insertHtml", str) };
  editor_api.editor.intro.get = function() { return this.obj.getContent() };
  editor_api.editor.intro.put = function(str) { return this.obj.setContent(str) };
  editor_api.editor.intro.focus = function() { return this.obj.focus() };
  editor_api.editor.intro.insert = function(str) { return this.obj.execCommand("insertHtml", str) };

  editor_api.editor.content.obj.ready(function() { sContent = editor_api.editor.content.get(); });
  editor_api.editor.intro.obj.ready(function() { sIntro = editor_api.editor.intro.get(); });

  $(document).ready(function() {
    $('#edit').submit(function() {
      if (editor_api.editor.content.obj.queryCommandState('source') == 1) editor_api.editor.content.obj.execCommand('source');
      if (editor_api.editor.intro.obj.queryCommandState('source') == 1) editor_api.editor.intro.obj.execCommand('source');
    })
    /* 源码模式下保存时必须切换 */


    if (bloghost != "/" && (bloghost).indexOf(location.host.toLowerCase()) < 0) {
      const cookieKey = "zbp_bloghost_alert";
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const fnAlert = () => {
        alert("您设置了域名固化，请使用" + bloghost + "访问或进入后台修改域名，否则图片无法上传。");
      }

      if (typeof cookieStore !== "undefined") {
        cookieStore.get(cookieKey).then(function(cookie) {
          if (!cookie) {
            fnAlert();
            cookieStore.set({ name: cookieKey, value: "1", expires: expiresAt, path: "/" });
          }
        }).catch(fnAlert);
      } else {
        fnAlert();
      }
    }
  });

}
