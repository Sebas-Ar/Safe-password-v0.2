import { getData } from "../utils/data.js"

const buttonLogout = document.getElementById('logout')

/* window.onload = () => { */
    const data = getData()
    const token = localStorage.getItem("token")
    if (!token) {
        window.location.href = "view/login.html?login=false"
    }

    let name = ""

    data.forEach((user) => {
        if (user._id == token) {
            name = user.name
        }
    })

    const title = document.getElementById("title")
    title.innerHTML = name
/* } */

const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "view/login.html"
}

buttonLogout.addEventListener("click", logout)

