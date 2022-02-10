# picgo-plugin-easypic

## 简介

[My-Easy-Pic-Bed](https://github.com/fslongjin/My-Easy-Pic-Bed) 为国内开发者 [fslongjin](https://github.com/fslongjin) 创建的开源、便捷、高效的图床服务，您可以将该服务部署在`云服务器`、`个人主机`、`NAS`等设备上，之后您便可以将图片上传至相应的服务器并获取图片链接。

<br>

## 环境搭建

下面我将演示如何在`本地主机`上搭建环境，若您要在`云服务器`和`其它环境`上搭建，这些操作也同样适用。

1. 前往 [My-Easy-Pic-Bed](https://github.com/fslongjin/My-Easy-Pic-Bed) 下载图床服务

   ![image-20220210182257858](https://gitee.com/msylj/images/raw/master/202202101822995.png)

   <br>

   

2. 将压缩包解压后放在你的服务器中，解压后文件如图

   ![image-20220210193522923](https://camo.githubusercontent.com/e8b3eeb1fddd023a208e0456cf6fa88707663340c97b9d5440dd62e027bd5a98/68747470733a2f2f692e706f7374696d672e63632f743473373170636a2f3230323230323130313933353035372e706e67)

   <br>

3. 可在`config.ini`中设置端口号和图片最大尺寸限制

   ```ini
   [strings]
   running_domain = 0.0.0.0	
   
   
   [ints]
   max_length = 10		// 最大尺寸为10M
   port = 9999			// 端口号为9999
   ```

   <br>

4. 双击`startProgram.exe`启动图床服务

   ![image-20220210182759058](https://gitee.com/msylj/images/raw/master/202202101827212.png)

   ![image-20220210194816559](https://i.postimg.cc/Z5zph9RQ/202202101948652.png)

   

5. `GUI`搜索下载`easypic`

   ![image-20220210194913624](https://i.postimg.cc/NjtDkC1L/202202101949679.png)

   

6. 根据实际修改相关设置

   ![image-20220210195011555](https://i.postimg.cc/T3QVqddH/202202101950610.png)

   - `服务器IP`：部署图床服务的服务器IP，若部署在本机则为127.0.0.1
   - `端口号`：config.ini中设置的端口号，默认80

   

7. 点击确定，设置完成！

