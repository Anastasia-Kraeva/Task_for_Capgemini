const form = document.querySelector("form");
const dialog_window = document.querySelector(".dialog_box");
const fixedBox = document.querySelector(".fixed_box");
const xhr = new XMLHttpRequest();

let data = null;
let validate = null;
let dataForm;

let pass = document.querySelectorAll("input[type=password]");
pass[1].addEventListener("input", function () {
  let pass1 = pass[0].value;
  let pass2 = pass[1].value;

  if (pass2 === pass1 && pass2 !== "") {
    validate = true;
    form.password2.setCustomValidity("");
  } else if (pass2 != pass1) {
    validate = false;
    form.password2.setCustomValidity("пароли не совпадают");
  }
});

form.addEventListener(
  "submit",
  function (event) {
    data = new FormData(form);
    let output = "";
    dataForm = {};

    event.preventDefault();

    if (validate) {
      for (const entry of data) {
        dataForm[entry[0]] = entry[1];
        output += entry[0] + ": " + entry[1] + "\r";
      }
      dataForm = JSON.stringify(dataForm);

      xhr.open("GET", "./data.json", true);
      xhr.responseType = "text";
      xhr.onload = function () {
        if (xhr.status == 200) {
          let response = JSON.parse(xhr.response);
          for (let entry of response) {
            output += "\r";
            entry = Object.entries(JSON.parse(entry));
            for (const el of entry) {
              output += el[0] + ": " + el[1] + "\r";
            }
          }
          let content = document.querySelector(".data");
          content.innerText = "";
          content.innerText = output;

          dialog_window.insertBefore(content, dialog_window.children[1]);

          toggleClass();
        } else {
          console.log(xhr.status + ":" + xhr.statusText);
        }
      };
      xhr.send();
    }
  },
  false
);

function toggleClass() {
  fixedBox.classList.toggle("display_none");
}

function submitForm() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "./", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(dataForm);
  form.reset();
  toggleClass();
}

function RegisterAgain() {
  submitForm(); // продублировала кнопку повторной регистрации и дала ей значение "ок" чтобы пользователь мог просто подтвердить свои действия, также решила добавить кнопку отмены
}
