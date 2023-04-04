cols = document.getElementById('col')
container = document.getElementById('inputs')

function putGridBelow(){
    if ((window.innerWidth - 100) < window.innerHeight) {
        cols.style.flexDirection = "column";
        container.style.width = "100vh";
        container.style.left = "0%";
        container.style.marginLeft = "0px";
    }else{
        cols.style.flexDirection = "row";
        container.style.width = "50vh";
        container.style.left = "50%";
        container.style.marginLeft = "100px";
    }
}

window.addEventListener("resize", putGridBelow);