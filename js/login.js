import { getData } from '../utils/data.js'
import { decrypt } from './crypto.js'

const token = localStorage.getItem('token')
if (token) {
    window.location.href = 'index.html'
}
const inputs = document.getElementsByTagName('input')
const form = document.getElementsByTagName('form')

form[0].addEventListener('submit', (event) => {
    event.preventDefault()

    let inputList = Array.from(inputs)

    let values = {}

    inputList.forEach((input) => (values[input.name] = input.value))

    const { username, password } = values

    const data = getData()

    let login = false

    data.forEach((user) => {
        if (username === user.username && password === decrypt(user.password)) {
            login = true
            localStorage.setItem('token', user._id)
            window.location.href = '../index.html'
        }
    })

    if (!login) {
        alert('username or password incorrect')
    }
})

document.getElementById('logo').addEventListener('click', () => {
    window.location.href = '../'
})

const querystring = window.location.search
const params = Object.fromEntries(new URLSearchParams(querystring))

if (params.login === 'false') {
    alert('debes logearte')
}
