let src
const img = document.createElement('img')
img.id = 'info-picture'
img.width = 200
img.height = 200

const themeQuery = window.matchMedia("(prefers-color-scheme)")
console.log({ themeQuery })

const renderPicture = url => {
    img.src = url

    return img
}

export default renderPicture
