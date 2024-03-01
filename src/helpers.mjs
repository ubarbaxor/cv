export const h2 = (content, ...classList) => {
    const el = document.createElement('h2')
    el.classList.add(...classList)
    el.innerText = content

    return el
}

export const h3 = (content, ...classList) => {
    const el = document.createElement('h3')
    el.classList.add(...classList)
    el.innerText = content

    return el
}
