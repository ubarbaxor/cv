const srcImg = document.createElement('img')
const outImg = document.createElement('img')
outImg.id = 'info-picture'

const canvas = document.createElement('canvas')
canvas.width = 200
canvas.height = 200
const ctx = canvas.getContext('2d')

const processImage = img => {
    ctx.drawImage(img,
        0,0,img.width,img.height,
        0,0,canvas.width,canvas.height,
    )

    const imageData = ctx.getImageData(
        0,0,
        canvas.width, canvas.height
    )

    for (let pxStart = 0; pxStart < imageData.data.length; pxStart += 4) {
        const red = imageData.data[pxStart]
        const grn = imageData.data[pxStart + 1]
        const blu = imageData.data[pxStart + 2]
        const avg = (red + grn + blu) / 3

        imageData.data[pxStart + 3] = Math.max(0xf0 - avg, 0)
    }
    ctx.putImageData(imageData, 0, 0)

    return canvas.toDataURL()
}

const renderPicture = src => {
    const url = new URL(src)
    srcImg.crossOrigin = url.origin
    srcImg.src = url
    srcImg.addEventListener('load', _ => {
        outImg.src = processImage(srcImg)
    })
    srcImg.addEventListener('error', _ => {
        outImg.src = './static/pp.nft.alpha.png'
    })

    return outImg
}

export default renderPicture
