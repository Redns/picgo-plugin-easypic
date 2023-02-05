# picgo-plugin-easypic

## 简介

[My-Easy-Pic-Bed](https://github.com/fslongjin/My-Easy-Pic-Bed) 为国内开发者 [fslongjin](https://github.com/fslongjin) 创建的开源、便捷、高效的图床服务，您可以将该服务部署在 `云服务器`、`个人主机`、`NAS` 等设备上，之后您便可以将图片上传至相应的服务器并获取图片链接。

## 环境搭建

下面我将演示如何在 `本地主机` 上搭建环境，若您要在 `云服务器` 和 `其它环境` 上搭建，这些操作也同样适用。

1. 前往 [My-Easy-Pic-Bed](https://github.com/fslongjin/My-Easy-Pic-Bed) 下载图床服务

   ![image-20220210201146087](https://i.postimg.cc/mDGVmb1x/202202102011195.png)

2. 将压缩包解压后放在你的服务器中，解压后文件如图

   ![image-20220210201042704](https://i.postimg.cc/Z54bz3k0/202202102010782.png)

3. 可在`config.ini`中设置端口号和图片最大尺寸限制

   ```ini
   [strings]
   running_domain = 0.0.0.0	
   
   
   [ints]
   max_length = 10		// 最大尺寸为10M
   port = 9999			// 端口号为9999
   ```

4. 为正常使用该插件请修改 `app.py` 代码，具体参见 [图片链接无法访问](#1)

   ```python
   import os
   from flask import Flask, flash, request, redirect, url_for, render_template, current_app
   from werkzeug.utils import secure_filename
   from flask import send_from_directory
   import random, time
   import db
   import getConfig as gcf
   
   from flask.cli import with_appcontext
   
   cf = gcf.get_config()
   
   allowed_extensions = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
   upload_folder = os.path.join(os.getcwd(), 'pics')
   print(upload_folder)
   app = Flask(__name__, instance_relative_config=True)
   
   
   def allowed_file(filename):
       return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
   
   
   @app.route('/', methods=['POST', 'GET'] )
   def upload_file():
       if request.method == 'POST':
           # 检查post请求中是否有文件
           if 'file' not in request.files:
               flash('你没有上传文件！')
               return redirect(request.url)
           file = request.files['file']
           print(file)
           if file.filename == '':
               flash('你没有选择文件！')
               return redirect(request.url)
           if file and allowed_file(file.filename):
               filename = file.filename
               try:
                   file.save(os.path.join(upload_folder, filename))
                   database = db.get_db()
                   database.execute(
                       'INSERT INTO pics (filename)'
                       ' VALUES (?)',
                       (filename,)
                   )
                   database.commit()
                   if app.config['running_port'] != 80:
                       flash(app.config['running_domain'] + ':' + str(app.config['running_port']) + url_for('uploaded_file', filename=filename))
                   else:
                       flash(app.config['running_domain'] + url_for('uploaded_file', filename=filename))
               except Exception as e:
                   flash('出现错误！')
                   print(e.args)
   
               return redirect(url_for('upload_file'))
           else:
               flash('不被服务器支持的文件！')
               return redirect(url_for('upload_file'))
       database = db.get_db()
       pcnum = database.execute("SELECT Count(*) FROM pics").fetchone()[0]
       print(pcnum)
   
       return render_template('bs_index.html', pic_num=pcnum)
   
   
   @app.route('/uploads/<filename>')
   def uploaded_file(filename):
       return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
   
   
   if __name__ == '__main__':
   
       app.config['UPLOAD_FOLDER'] = upload_folder
       app.config['running_domain'] = cf['running_domain']
       app.config['running_port'] = cf['port']
       app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * int(cf['max_length'])
       app.config.from_mapping(
           SECRET_KEY='dgvbv43@$ewedc',
           DATABASE=os.path.join(app.instance_path, 'my-easy-pic-bed.sqlite'),
       )
       # ensure the instance folder exists
       try:
           os.makedirs(app.instance_path)
       except OSError:
           pass
   
       try:
           os.mkdir(upload_folder)
       except Exception as e:
           pass
   
       app.run(debug=False, host=app.config['running_domain'], port=app.config['running_port'])
   ```

4. 双击 `startProgram.exe` 启动图床服务

   ![image-20220210182759058](https://gitee.com/msylj/images/raw/master/202202101827212.png)

   ![image-20220210194816559](https://i.postimg.cc/Z5zph9RQ/202202101948652.png)

5. `GUI` 搜索下载 `easypic`

   ![image-20220210194913624](https://i.postimg.cc/NjtDkC1L/202202101949679.png)

6. 根据实际修改相关设置

   ![image-20220210195011555](https://i.postimg.cc/T3QVqddH/202202101950610.png)

   - `服务器IP`：部署图床服务的服务器IP，若部署在本机则为127.0.0.1
   - `端口号`：config.ini中设置的端口号，默认80

7. 点击确定，设置完成！

## Q & A

### 1.如何查看本机IP？

1. 键盘按下`win + r`，输入`cmd`

   ![image-20220210195431387](https://i.postimg.cc/6Q5DYpd7/202202101954425.png)

2. 输入`ipconfig`，回车

   ![image-20220210195552474](https://i.postimg.cc/mg0HSPxj/202202101955551.png)

3. 该`Ipv4地址`即为服务器IP地址

### 2.图片的具体存储位置？

所有图片均存储于 `解压根目录/pics`

### 3.其它上传方式？

1. 浏览器输入`http://{ip}:{port}`

![image-20220210195952690](https://i.postimg.cc/2y2Hq4K2/202202101959436.png)

2. 选择要上传的文件后点击`开始上传`即可

### 4.如何在运行图床服务时不显示终端？

在压缩包根目录下有两个批处理命令 `start.bat` 和 `stop.bat`，双击 `start.bat` 即可运行图床服务而不弹出终端，双击 `stop.bat` 即可关闭图床服务。

