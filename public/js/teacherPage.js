
// use the jsPDF library to download the scores into a pdf file
var button = document.getElementById("download-pdf");
button.addEventListener("click", function() {
  var doc = new jsPDF();

  // Load the scores.html page using an XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'scores.html', true);
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      // When the scores.html page is loaded, use doc.fromHTML to add it to the PDF
      var scoresHtml = xhr.responseText;
      doc.fromHTML(scoresHtml);
      doc.save("scores.pdf");
    }
  };
  xhr.send();
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

