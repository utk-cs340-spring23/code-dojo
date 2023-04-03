// find the variables by using getElementById
const hamburger = document.getElementById('hamburger')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')
const feedback = document.getElementById('question-feedback')

let menuOpen = false // menu starts closed
let questionCorrect = true;

function openMenu() {
    // change width to 'open' sidebar
    menuOpen = true
    overlay.style.display = 'block'
    sidebar.style.width = '250px'
}

function closeMenu() {
    // change width to 'close' sidebar
    menuOpen = false
    overlay.style.display = 'none'
    sidebar.style.width = '0px'
}

hamburger.addEventListener('click', function () {
    // open the sidebar when hamburger is clicked
    if (!menuOpen) {
        openMenu()
    }
})

overlay.addEventListener('click', function () {
    // close the sidebar when overlay is clicked
    if (menuOpen) {
        closeMenu()
    }
})

function showCheckMark(){
    feedback.style.color = 'green'
}
