/**
 *
 * @returns retorna los datos almacenados en el localStorage
 */
export const getData = () => {
    const data = JSON.parse(localStorage.getItem("data"))
    if (data) {
        return data
    } else {
        return []
    }
}

/**
 *
 * @param {Objecto que va a ser guardado en localStorage} values
 */
export const saveData = (data) => {
    localStorage.setItem("data", JSON.stringify(data))
}

export const getUser = (data, token) => {
    let indexUser

    data.forEach((user, index) => {
        if (user._id == token) {
            indexUser = index
        }
    })

    let user = data[indexUser]

    return {user, indexUser}
}

export const saveUser = (user, data, indexUser) => {
    data[indexUser] = user
    saveData(data)
}
