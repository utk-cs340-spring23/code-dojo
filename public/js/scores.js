var table = document.getElementById("scoreTable");
function addUser(user_id, name, num_correct, num_incorrect) {
    // Create an empty new row for this user
    var row = table.insertRow(-1);
    row.id = user_id;
    row.className = "user";
    // Insert the new cells
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    // Add this user's info:
    cell1.innerHTML = name;
    cell2.innerHTML = num_correct;
    cell3.innerHTML = num_incorrect;
}

// testing
//   window.onload = addUser("yyyddd", "Jacob", 4, 3);
//   window.onload = addUser("yyyddd", "Jeff", 4, 3);
//   window.onload = addUser("fdssxc", "Diet Coke", 10, 0);
//   window.onload = addUser("yyyddd", "Jacob", 4, 3);
//   window.onload = addUser("yyyddd", "Jeff", 4, 3);
//   window.onload = addUser("fdssxc", "Diet Coke", 10, 0);
//   window.onload = addUser("yyyddd", "Jacob", 4, 3);
//   window.onload = addUser("yyyddd", "Jeff", 4, 3);
//   window.onload = addUser("fdssxc", "Diet Coke", 10, 0);
