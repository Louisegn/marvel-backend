const test = {
  fav: ["first", "secondo", "tierco"],
  chara: ["yo", "yess"],
};

const nb = "quatro";
const verif = test.fav.indexOf(nb);

if (verif !== -1) {
  test.fav.splice(verif, 1);
  console.log("YOOOO");
} else {
  test.fav.push(nb);
  console.log("heyyy");
}

console.log("verif", verif);
console.log("test", test);

// "5fce13f978edeb0017c92dd4"

//5fce19b478edeb0017c944a3
