var entrar = document.getElementById("entrar");

entrar.addEventListener("click", async function () {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;

    if (email == "" || senha == "") {
        alert("Preencha todos os campos!");
    }
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: email, password: senha }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data);

        if (data.msg) {
            alert(data.msg);
        }

        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = "http://localhost:3000/home";
        }


    } catch (error) {
        console.log(error);
    }
});
