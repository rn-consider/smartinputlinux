# 使用前提
  - linux下使用ibus,安装了vim插件，需要配置下中文输入法的名称
  - vim插件配置自动切换输入法，ibus参考在setting.json输入
  ```
  "vim.autoSwitchInputMethod.enable": true,
"vim.autoSwitchInputMethod.defaultIM": "xkb:us::eng",
"vim.autoSwitchInputMethod.obtainIMCmd": "/usr/bin/ibus engine",
"vim.autoSwitchInputMethod.switchIMCmd": "/usr/bin/ibus engine {im}"
```  
# 效果展示
![演示](https://img-blog.csdnimg.cn/img_convert/19cb8c13608cc13b4aeb26fcb63b94b0.gif)

# vsc插件坑
  - 一定要注意用tsc命令重新编译下，F5有时不会重新编译
# 目前已经实现的功能
  - 识别到注释场景时，自动切换为中文输入法。
  - 识别到vim normal状态自动切换为英文输入法(自动配置vim插件的auto switch input method)
  - 识别到vim insert且当前位于注释行中时切换为中文
  - 当回到编辑器时切换为英文输入法
  - 离开编辑器时切换为中文输入法
  - 开头为中文切换为中文输入法
