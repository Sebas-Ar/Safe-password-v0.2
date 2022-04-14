import { getData, saveData, getUser, saveUser } from '../utils/data.js'
import { generateId } from '../utils/generateId.js'
import { decrypt, encrypt } from "./crypto.js";

const querystring = window.location.search
const params = Object.fromEntries(new URLSearchParams(querystring))

const addItem = document.getElementById('add-item')
const itemList = document.getElementById('item-list')

if (params.type !== 'item') {

    console.log('no es item')
    addItem.remove()
    itemList.remove()

} else {
    
    /* addItem.style.display = 'none' */

    const data = getData()
    const token = localStorage.getItem('token')
    let { user, indexUser } = getUser(data, token)
    const ItemListData = user.itemList

    const buttonCloseAddItem = document.getElementById('button-close-add-item')

    buttonCloseAddItem.addEventListener('click', () => {
        addItem.style.display = 'none'
    })

    const buttonAdditem = document.getElementById('button-add-item')

    buttonAdditem.addEventListener('click', () => {
        addItem.style.display = 'block'
    })

    const taglistItem = document.getElementById('taglist-item')

    user.tags.forEach((tag) => {
        const li = document.createElement('li')
        const input = document.createElement('input')
        const span = document.createElement('span')

        span.innerText = tag

        input.name = 'tag'
        input.value = tag
        input.type = 'checkbox'

        li.appendChild(input)
        li.appendChild(span)

        taglistItem.appendChild(li)
    })

    const formNewItem = document.getElementById('form-add-item')

    formNewItem.addEventListener('submit', (e) => {
        e.preventDefault()
        let tagListToSelect = document.querySelectorAll('input[name="tag"]')
        tagListToSelect = Array.from(tagListToSelect).filter(
            (chceck) => chceck.checked == true
        )

        const params = Object.fromEntries(new FormData(e.target).entries())
        const {
            title,
            username,
            password,
            repeatPassword,
            url,
            comment,
        } = params
        const tagListSelected = tagListToSelect.map((tag) => tag.value)

        /* const data = getData()
        const token = localStorage.getItem('token')
        let { user, indexUser } = getUser(data, token) */
        if (password === repeatPassword) {
            if (!user.itemList) {
                user.itemList = []
            }

            user.itemList.push({
                _id: generateId(user.itemList),
                title,
                url,
                comment,
                username,
                password: encrypt(password),
                tagList: tagListSelected,
            })

            saveUser(user, data, indexUser)

            document.location.reload()
        } else {
            alert('las contraseñas no coinciden')
        }
    })

    ItemListData.reverse().forEach((item) => {
        const newItem = document.createElement('li')
        newItem.id = item._id
        const ul = document.createElement('ul')

        for (const key in item) {

            const li = document.createElement('li')

            if (key === 'tagList') {
                const listTaginItem = document.createElement('ul')
                const p = document.createElement('p')
                listTaginItem.classList.add('tag-list-in-item')
                p.innerText = 'Tag list:'
                listTaginItem.appendChild(p)
                item[key].forEach( tag => {
                    console.log(tag)
                    const prop = document.createElement('li')
                    const span = document.createElement('span')
                    span.innerText = tag
                    prop.appendChild(span)

                    
                    listTaginItem.appendChild(prop)
                })
                li.setAttribute('name', `${item._id}`)
                li.classList.add('hiden-prop')
                li.appendChild(listTaginItem)

            } else {

                const span = document.createElement('span')
                const p = document.createElement('p')
                const label = document.createElement('label')
    
                span.innerText = `${key}:`
                if (key === 'password') {
                    p.innerText = decrypt(item[key])
                } else {
                    p.innerText = item[key]
                }

                label.appendChild(span)
                label.appendChild(p)
                li.appendChild(label)

                if (key === 'username' || key === 'password') {

                    li.setAttribute('name', `${item._id}`)
                    li.classList.add('hiden-prop')

                }

            }

            ul.append(li)
        }


        const li = document.createElement('li')
        li.classList.add('setting-item')
        const button = document.createElement('button')
        button.innerText = 'See Item'
        button.value = item._id
        button.classList.add('see-item-button')
        button.setAttribute('active', false)

        li.appendChild(button)
        ul.append(li)

        const itemList = document.getElementById('ul-item-list')

        newItem.appendChild(ul)
        itemList.appendChild(newItem)
    })

    let buttonListSeeItem = document.getElementsByClassName('see-item-button')

    buttonListSeeItem = Array.from(buttonListSeeItem)

    buttonListSeeItem.forEach((button) => {
        button.addEventListener('click', () => {
            let attrs = document.getElementsByName(button.value)
            attrs = Array.from(attrs)

            const li = button.parentNode

            if (button.getAttribute('active') === 'false') {
                attrs.forEach((attr) => {
                    attr.classList.remove('hiden-prop')
                })

                const editButton = document.createElement('button')
                editButton.innerText = 'Edit Item'
                editButton.value = button.value
                editButton.classList.add('edit-item-button')
                const deletButton = document.createElement('button')
                deletButton.innerText = 'Delete Item'
                deletButton.value = button.value
                deletButton.classList.add('delete-item-button')

                li.appendChild(editButton)
                li.appendChild(deletButton)

                button.innerText = 'Hide item'
                button.setAttribute('active', true)

                let buttonListEditItem = document.getElementsByClassName(
                    'edit-item-button'
                )

                buttonListEditItem = Array.from(buttonListEditItem)

                buttonListEditItem.forEach((button) => {

                    button.addEventListener('click', () => {

                        const item = document.getElementById(button.value)
                        const itemList = item.childNodes[0]

                        let propItemList = itemList.childNodes
                        propItemList = Array.from(propItemList)

                        const form = document.createElement('form')

                        propItemList.forEach((prop, index) => {

                            if (index === propItemList.length - 2) {

                                let tagAssigned = Array.from(prop.childNodes[0].childNodes)
                                tagAssigned.shift()
                                tagAssigned = tagAssigned.map( tag => tag.childNodes[0].innerText )

                                const listTagToAdd = document.createElement('ul')
                                const tagTitleList = document.createElement('li')
                                tagTitleList.innerText = 'Tag List:'
                                listTagToAdd.classList.add('list-tags-to-select')
                                listTagToAdd.appendChild(tagTitleList)
                                
                                user.tags.forEach((tag) => {
                                    const li = document.createElement('li')
                                    const input = document.createElement('input')
                                    const span = document.createElement('span')

                                    span.innerText = tag

                                    input.name = 'tagtoAdd'
                                    input.value = tag
                                    input.type = 'checkbox'

                                    tagAssigned.forEach(tagAssign => {
                                        tagAssign === tag 
                                            ?
                                                input.checked = true
                                            : 
                                                null
                                    })

                                    li.appendChild(input)
                                    li.appendChild(span)

                                    listTagToAdd.appendChild(li)
                                })
                                form.appendChild(listTagToAdd)
                            } else if (index === propItemList.length - 1) {
                                const confirm = document.createElement('button')
                                const cancel = document.createElement('button')
                                const div = document.createElement('div')

                                confirm.innerText = 'Confirm'
                                confirm.type = 'submit'
                                cancel.innerText = 'Cancel'
                                cancel.type = 'button'

                                cancel.addEventListener('click', () => {
                                    document.location.reload()
                                })

                                div.classList.add('setting-item')
                                div.appendChild(confirm)
                                div.appendChild(cancel)
                                form.appendChild(div)
                            } else if (index === 0) {
                                const label = prop.childNodes[0]
                                form.appendChild(label)
                            } else {
                                const span = document.createElement('span')
                                let properti =
                                    prop.childNodes[0].childNodes[0].innerText
                                span.innerText = properti

                                const input = document.createElement('input')
                                const value =
                                    prop.childNodes[0].childNodes[1].innerText
                                input.value = value
                                properti = properti.replace(':', '')
                                input.name = properti

                                if (
                                    input.name === 'password' ||
                                    input.name === 'repeatPassword'
                                ) {
                                    input.type = 'password'
                                }

                                const label = document.createElement('label')

                                label.appendChild(span)
                                label.appendChild(input)
                                form.appendChild(label)
                            }
                        })

                        itemList.remove()
                        item.appendChild(form)
                        form.addEventListener('submit', (e) => {
                            e.preventDefault()
                            let tagListToSelect = document.querySelectorAll('input[name="tagtoAdd"]')
                            tagListToSelect = Array.from(tagListToSelect).filter(
                                (chceck) => chceck.checked == true
                            )
                            const tagListSelected = tagListToSelect.map((tag) => tag.value)
                            console.log(tagListSelected)
                            const formData = Object.fromEntries(
                                new FormData(e.target).entries()
                            )
                            const {
                                title,
                                username,
                                password,
                                url,
                                comment,
                            } = formData

                            user.itemList = user.itemList.map((item) => {
                                if (item._id == button.value) {
                                    return {
                                        _id: Number(button.value),
                                        title,
                                        url,
                                        comment,
                                        username,
                                        password: encrypt(password),
                                        tagList: tagListSelected
                                    }
                                } else {
                                    return item
                                }
                            })
                            console.log(user)
                            saveUser(user, data, indexUser)
                            document.location.reload()
                        })
                    })
                })

                let buttonListDelete = document.getElementsByClassName(
                    'delete-item-button'
                )

                buttonListDelete = Array.from(buttonListDelete)

                buttonListDelete.forEach((button) => {






                    button.addEventListener('click', () => {

                        const wrapperPopup = document.getElementsByClassName('popup-wrapper')[0]
                        wrapperPopup.style.display = 'grid'

                        const tagToDelete = document.getElementById('tag-to-delete')
                        tagToDelete.style.fontWeight = '700'
                        tagToDelete.innerText = `${button.value}`

                        const cancelDeleteTag = document.getElementById('cancel-delete-tag')
                        cancelDeleteTag.onclick = () => {
                            document.location.reload()
                        }

                        const inputDeleteTag = document.getElementById('input-delete-tag')
                        inputDeleteTag.placeholder = button.value

                        inputDeleteTag.addEventListener('input', e => {
                            const deleteTag = document.getElementById('delete-tag')
                            if (button.value === e.target.value) {
                                deleteTag.disabled = false
                            } else {
                                deleteTag.disabled = true
                            }
                        })                    

                        const form = document.getElementsByClassName('popup')[0]

                        form.addEventListener('submit', e => {

                            e.preventDefault()
                            user.itemList = user.itemList.filter((item) => {
                                if (item._id !== Number(button.value)) {
                                    return item
                                }
                            })
                            saveUser(user, data, indexUser)
                            document.location.reload()
                            

                        })




                    })






                })
            } else {
                attrs.forEach((attr) => {
                    attr.classList.add('hiden-prop')
                })

                button.nextSibling.remove()
                button.nextSibling.remove()
                button.innerText = 'See Item'
                button.setAttribute('active', false)
            }
        })
    })
}
