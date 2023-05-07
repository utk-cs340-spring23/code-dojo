
// use the jsPDF library to download the scores into a pdf file
var export_button = document.getElementById("download-pdf");

export_button.addEventListener("click", function () {
  const doc = new jsPDF();
  doc.autoTable({ html: "#player-table" });
  doc.save(`${room_id}_scores.pdf`);
});

var column = document.getElementById('col')
var container = document.getElementById('inputs')

function putGridBelow() {
  if ((window.innerWidth - 100) < window.innerHeight) {
    column.style.flexDirection = "column";
    container.style.width = "50vw";
    container.style.left = "0%";
    container.style.marginLeft = "0px";
  } else {
    column.style.flexDirection = "row";
    container.style.width = "40vw";
    container.style.left = "50%";
    container.style.marginLeft = "100px";
  }
}

window.addEventListener("resize", putGridBelow);

document.addEventListener("DOMContentLoaded", function () {
  putGridBelow();
});
