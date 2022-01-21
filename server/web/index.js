const socket = io()

function initateStream() {
    const main = document.getElementById("main")
    socket.on("frame", (data)=>{
        let image = document.createElement('img')
        image.setAttribute('src', data)
        main.appendChild(image)
    })
}

initateStream()
