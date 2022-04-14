import { getData, saveData } from "../utils/data.js"
import { generateId } from "../utils/generateId.js"
import { encrypt } from "./crypto.js";



const token = localStorage.getItem("token")
if (token) {
    window.location.href = "index.html"
}

const inputs = document.getElementsByTagName("input")
const form = document.getElementsByTagName("form")

form[0].addEventListener("submit", (event) => {
    event.preventDefault()

    let inputList = Array.from(inputs)

    let values = {}

    inputList.forEach((input) => (values[input.name] = input.value))

    const { firstName, lastName, username, password, repeatPassword } = values

    if (firstName && lastName && username && password && repeatPassword) {
        if (password === repeatPassword) {
            let data = getData()
            const newId = generateId(data)

            data.push({
                _id: newId,
                name: `${firstName} ${lastName}`,
                username,
                password: encrypt(password),
                itemList: [],
                tags: []
            })

            saveData(data)
            window.location.href = "login.html"
        } else {
            alert("Passwords don't match")
        }
    } else {
        alert("Empty fields")
    }
})

document.getElementById("logo").addEventListener('click', () => {
    window.location.href = "../"
})
