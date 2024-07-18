const signInBtnLink = document.querySelector(".signInBtn-link");
const signUpBtnLink = document.querySelector(".signUpBtn-link");
const btn1 = document.querySelector(".btn1");

const Wrapper = document.querySelector(".Wrapper");

signInBtnLink.addEventListener("click", () => {
  Wrapper.classList.toggle("active");
});

signUpBtnLink.addEventListener("click", () => {
  Wrapper.classList.toggle("active");
});

function handleSignUp() {
  const password = document.getElementById("password-signup").value;
  const confirmPassword = document.getElementById(
    "confirm-password-signup"
  ).value;
  if (password === confirmPassword) {
    document.querySelector(".Wrapper").classList.remove("active");
  } else {
    alert("Passwords do not match.");
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const icon = passwordInput.nextElementSibling;
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("bxs-lock-alt");
    icon.classList.add("bxs-lock-open-alt");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("bxs-lock-open-alt");
    icon.classList.add("bxs-lock-alt");
  }
}
