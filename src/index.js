const config = (ctx) => {
    let userConfig = ctx.getConfig('picBed.easypic-uploader')
    if (!userConfig) {
        userConfig = {}
    }
    const config = [
        {
            name: 'ip',
            type: 'input',
            alias: '服务器IP',
            default: userConfig.ip || '',
            message: '局域网IP不能为空',
            required: true
        },
        {
            name: 'port',
            type: 'input',
            alias: '应用端口',
            default: userConfig.port || '',
            message: '端口号不能为空',
            required: true
        }
    ]
    return config
}


const requestConstruct = (userConfig, fileName, extname, img) => {
    const ip = userConfig.ip
    const port = userConfig.port

    return {
        'method': 'POST',
        'url': `http://${ip}:${port}`,
        'headers': {
            'Cookie': 'PHPSESSID=a31fgejevj14eneood0ldc8131; device=desktop; lang=zh-cn; theme=default; token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDQwNDg1NDEsIm5iZiI6MTY0NDA0ODU0MSwiZXhwIjoxNjU5NjAwNTQxLCJUb2tlbklkIjoxLCJVc2VySWQiOjEsIkNsaWVudElkIjoiIiwiVXBkYXRlZFRpbWUiOjE2NTk1OTY5NDF9.rcw3XNvpjUsDPLEwInPqP70NsgU8G6_qzY3mPPrTIh6YY2yuXbxqU6Ll3xCdqRWRZqjaEghebB8wlS3Z1v0cqmizCSFQJW5qjXfQzN1-j3S0sdzl-0uG0jZ39rHPAiDb05juepTHfCTik2qlUzqHynC242Hu2xuuI7GRx8-jhC4; yid=48lhku9k3hi3nvufj2ckikpk7o'
        },
        formData: {
            'file': {
                'value': img,
                'options': {
                    'filename': fileName,
                    'contentType': null
                }
            }
        }
    }
}


const handle = async (ctx) => {
    // 获取用户配置信息
    const userConfig = ctx.getConfig('picBed.easypic-uploader')
    if(!userConfig){
        throw new Error('请配置IP地址和端口号！')
    }       

    const imgList = ctx.output
    for(var i in imgList) {
        try{
            let img = imgList[i].buffer
            if(!img && imgList[i].base64Image){
                img = Buffer.from(imgList[i].base64Image, 'base64')
            }

            const request = requestConstruct(userConfig, imgList[i].fileName, imgList[i].extname, img)
            await ctx.Request.request(request)

            delete imgList[i].base64Image
            delete imgList[i].buffer
            imgList[i]['imgUrl'] = `${userConfig.ip}:${userConfig.port}/uploads/${imgList[i].fileName}`
        }
        catch(err){
            delete imgList[i].base64Image
            delete imgList[i].buffer
            imgList[i]['imgUrl'] = `http://${userConfig.ip}:${userConfig.port}/uploads/${imgList[i].fileName}`
        } 
    }
    return ctx
}


module.exports = (ctx) => {
    const register = () => {
        ctx.log.success('postimage加载成功！')
        ctx.helper.uploader.register('easypic-uploader', {
            handle: handle,
            config: config,
            name: 'easypic'
        })
    }
    return {
        register,
        uploader: 'easypic-uploader'
    }
}