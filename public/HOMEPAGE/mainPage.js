const hamburger = document.getElementById('hamburger')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')

let menuOpen = false // menu starts closed

function openMenu() {
    menuOpen = true
    overlay.style.display = 'block'
    sidebar.style.width = '250px'
}

function closeMenu() {
    menuOpen = false
    overlay.style.display = 'none'
    sidebar.style.width = '0px'
}

hamburger.addEventListener('click', function () {
    if (!menuOpen) {
        openMenu()
    }
})

overlay.addEventListener('click', function () {
    if (menuOpen) {
        closeMenu()
    }
})