/**
 * UEditor 静态配置文件
 * 动态配置将通过 AJAX 加载
 */
(function() {
  'use strict';

  // 默认配置
  const defaultConfig = {
    'maximumWords': 1000000000,
    'wordCountMsg': '当前已输入 {#count} 个字符',
    'initialFrameHeight': 300,
  };

  // 当前配置
  const currentConfig = JSON.parse(JSON.stringify(defaultConfig));

  // 设置配置值
  window.UEditorConfig = {
    set: function(key, value) {
      currentConfig[key] = value;
    },
    get: function(key) {
      return currentConfig[key];
    },
    getAll: function() {
      return JSON.parse(JSON.stringify(currentConfig));
    },
    setAll: function(config) {
      Object.assign(currentConfig, config);
    }
  };

  // 加载动态配置
  window.UEditorLoadConfig = function(callback) {
    return new Promise(function(resolve, reject) {
      // 如果已经加载过，直接回调
      if (window.UEditorConfigLoaded) {
        if (callback) callback(currentConfig);
        resolve(currentConfig);
        return;
      }

      const xhr = new XMLHttpRequest();
      const url = window.UEDITOR_CONFIG_URL || 'zb_system/cmd.php?act=ajax&src=UEditor';

      const failFunc = function(error) {
        console.error('Failed to load UEditor configuration:', error);
        alert('编辑器配置加载失败，请刷新页面或稍后重试');
        window.UEditorConfigLoaded = true;
      };

      xhr.open('GET', url, true);
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const serverConfig = JSON.parse(xhr.responseText);
              // console.log('Loaded server config:', serverConfig);
              Object.assign(currentConfig, serverConfig.data);
              window.UEditorConfigLoaded = true;
              if (callback) callback(currentConfig);
              resolve(currentConfig);
            } catch (e) {
              failFunc(e);
            }
          } else {
            failFunc(new Error('Failed to load UEditor configuration: HTTP status ' + xhr.status));
          }
        }
      };

      xhr.onerror = function() {
        failFunc(new Error('Failed to load UEditor configuration: Network error'));
      };

      xhr.send();
    });
  };
})();
