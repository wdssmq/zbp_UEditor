<?php

//ZBP的第一个插件，ueditor插件

//注册插件
RegisterPlugin('UEditor', 'ActivePlugin_UEditor');

function ActivePlugin_UEditor()
{
    Add_Filter_Plugin('Filter_Plugin_Edit_Begin', 'ueditor_addscript_begin');
    Add_Filter_Plugin('Filter_Plugin_Edit_End', 'ueditor_addscript_end');
    Add_Filter_Plugin('Filter_Plugin_Html_Js_Add', 'ueditor_SyntaxHighlighter_print');
    Add_Filter_Plugin('Filter_Plugin_Cmd_Ajax', 'UEditor_CmdAjax');
}

function ueditor_SyntaxHighlighter_print()
{
    global $zbp;
    if (!$zbp->option['ZC_SYNTAXHIGHLIGHTER_ENABLE']) {
        return;
    }
    $tpl = <<<html
<script src="{$zbp->host}zb_users/plugin/UEditor/third-party/prism/prism.js"><\\/script><link href="{$zbp->host}zb_users/plugin/UEditor/third-party/prism/prism.css"/>
html;

    echo "\r\n";
    echo "document.writeln('{$tpl}');";
    echo "\r\n";

    echo '$(function(){var compatibility={as3:"actionscript","c#":"csharp",delphi:"pascal",html:"markup",xml:"markup",vb:"basic",js:"javascript",plain:"markdown",pl:"perl",ps:"powershell"};var runFunction=function(doms,callback){doms.each(function(index,unwrappedDom){var dom=$(unwrappedDom);var codeDom=$("<code>");if(callback)callback(dom);var languageClass="prism-language-"+function(classObject){if(classObject===null)return"markdown";var className=classObject[1];return compatibility[className]?compatibility[className]:className}(dom.attr("class").match(/prism-language-([0-9a-zA-Z]+)/));codeDom.html(dom.html()).addClass("prism-line-numbers").addClass(languageClass);dom.html("").addClass(languageClass).append(codeDom)})};runFunction($("pre.prism-highlight"));runFunction($(\'pre[class*="brush:"]\'),function(preDom){var original;if((original=preDom.attr("class").match(/brush:([a-zA-Z0-9\#]+);/))!==null){preDom.get(0).className="prism-highlight prism-language-"+original[1]}});Prism.highlightAll()});';
    echo "\r\n";
}

function InstallPlugin_UEditor()
{
}

function UninstallPlugin_UEditor()
{
}

function ueditor_addscript_begin()
{
    global $zbp;
    $config_url = $zbp->host . 'zb_system/cmd.php?act=ajax&src=UEditor';
    echo '<script src="' . UEditor_Path('ueditor.config.js', 'host') . '"></script>';
    echo '<script>
        (function(){
            window.UEDITOR_CONFIG_URL = "' . $config_url . '";
        })();
    </script>';
    echo '<script src="' . UEditor_Path('ueditor.all.min.js', 'host') . '"></script>';
    // echo '<style type="text/css">#editor_content{height:auto}</style>';
}

function UEditor_CmdAjax($src)
{
    global $zbp;
    if ('UEditor' !== $src) {
        return;
    }

    $URL = $zbp->host . 'zb_users/plugin/UEditor/';
    $lang = strtolower($zbp->lang['lang']);
    if (!is_dir(__DIR__ . '/lang/' . $lang)) {
        $lang = 'zh-cn';
    }

    $has_insertcode = !empty($zbp->option['ZC_SYNTAXHIGHLIGHTER_ENABLE']);

    $config = [
        'UEDITOR_HOME_URL' => $URL,
        'serverUrl'        => $URL . 'php/controller.php',
        'toolbars'         => [
            ['source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'forecolor', 'backcolor', '|', 'insertorderedlist', 'insertunorderedlist', 'indent', 'justifyleft', 'justifycenter', 'justifyright', '|', 'removeformat', 'formatmatch', 'autotypeset', 'pasteplain'],
            array_merge(
                ['paragraph', 'fontfamily', 'fontsize', '|', 'emotion', 'link', 'insertimage', 'scrawl', 'insertvideo', 'attachment', 'spechars', 'map', '|'],
                $has_insertcode ? ['insertcode'] : [],
                ['blockquote', 'wordimage', 'inserttable', 'horizontal', 'fullscreen'],
            ),
        ],
        'sourceEditor'           => !empty($zbp->option['ZC_CODEMIRROR_ENABLE']) ? 'codemirror' : 'textarea',
        'initialStyle'           => 'body{font-size:14px;font-family:微软雅黑，宋体，Arial,Helvetica,sans-serif;}',
        'imageMaxSize'           => $zbp->option['ZC_UPLOAD_FILESIZE'] * 1024 * 1024,
        'fileMaxSize'            => $zbp->option['ZC_UPLOAD_FILESIZE'] * 1024 * 1024,
        'lang'                   => $lang,
        'langPath'               => $URL . 'lang/',
    ];

    JsonReturn($config);
}

function ueditor_addscript_end()
{
    echo '<script src="' . UEditor_Path('script', 'host') . '"></script>';
}

function UEditor_Path($file, $t = 'path')
{
    global $zbp;
    $result = $zbp->{$t} . 'zb_users/plugin/UEditor/';

    switch ($file) {
        case 'script':
            return $result . 'script/script.js';

            break;

        default:
            return $result . $file;
    }
}
