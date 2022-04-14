import { getData, saveData, getUser, saveUser } from '../utils/data.js'
import { generateId } from '../utils/generateId.js'

const querystring = window.location.search
const params = Object.fromEntries(new URLSearchParams(querystring))

const addTag = document.getElementById('add-tag')
const tagList = document.getElementById('tag-list')
const popup = document.getElementsByClassName('popup-wrapper')[0]

if (params.type !== 'tag') {

    console.log('tag')
    addTag.remove()
    tagList.remove()
    
} else {

     addTag.style.display = 'none'

    const data = getData()
    const token = localStorage.getItem('token')
    let { user, indexUser } = getUser(data, token)
    const ItemListData = user.itemList

    let editing = false

    const buttonCloseAddTag = document.getElementById('button-close-add-tag')

    buttonCloseAddTag.addEventListener('click', () => {
        addTag.style.display = 'none'
    })

    const buttonAddTag = document.getElementById('button-add-tag')

    buttonAddTag.addEventListener('click', () => {
        addTag.style.display = 'block'
    })

    const formAddTag = document.getElementById('form-add-tag')

    formAddTag.addEventListener('submit', (e) => {
        e.preventDefault()

        const params = Object.fromEntries(new FormData(e.target).entries())
        console.log(params)

        if (!user.tags) {
            user.tags = []
        }

        user.tags.push(params.tag)

        saveUser(user, data, indexUser)
        document.location.reload()
    })

    const ulTagList = document.getElementById('ul-tag-list')

    user.tags.reverse().forEach((tag) => {

        const li = document.createElement('li')
        let text = document.createElement('span')
        const rowIcon = document.createElement('img')
        const tagTitle = document.createElement('li')
        rowIcon.src = './img/icons/arrow.svg'
        rowIcon.classList.add('icon-row')
        rowIcon.alt = 'no se encuentra'
        text.innerText = tag
        text.appendChild(rowIcon)
        text.style.fontWeight = '700'
        tagTitle.setAttribute('active', false)
        tagTitle.classList.add('tag-down')
        tagTitle.appendChild(rowIcon)
        tagTitle.appendChild(text)
        ulTagList.appendChild(tagTitle)
        ulTagList.appendChild(li)
        
            
        tagTitle.addEventListener('click', (e) => {
            if (tagTitle.getAttribute('active') === 'false') {
                tagTitle.classList.remove('tag-down')
                tagTitle.classList.add('tag-up')
                tagTitle.setAttribute('active', true)
    
                const itemListTag = ItemListData.filter((item) =>
                    Boolean(item.tagList.find((tag) => tag.toUpperCase() === e.target.innerText))
                )
                const ul = document.createElement('ul')
    
                itemListTag.forEach((tagItem) => {
                    const liItem = document.createElement('li')
                    liItem.innerText = `Id: ${tagItem._id}\nTitle: ${tagItem.title}\nUsername: ${tagItem.username}\nurl: ${tagItem.url}\n`
                    ul.appendChild(liItem)
                })
    
                li.append(ul)
    
                const editButton = document.createElement('button')
                const deleteButton = document.createElement('button')
                const wrapperButtons = document.createElement('li')
    
                deleteButton.innerText = 'Delete'
                editButton.innerText = 'Edit'
                wrapperButtons.classList.add('setting-item')
    
                wrapperButtons.appendChild(editButton)
                wrapperButtons.appendChild(deleteButton)
    
                li.appendChild(wrapperButtons)

                editButton.addEventListener('click', () => {

                    editing = true

                    li.childNodes[0].remove()
                    const [buttonsSetingUpdate] = li.childNodes
                    buttonsSetingUpdate.removeChild(buttonsSetingUpdate.childNodes[0])
                    buttonsSetingUpdate.removeChild(buttonsSetingUpdate.childNodes[0])

                    const updateButton = document.createElement('button')
                    const cancelUpdateButton = document.createElement('button')

                    updateButton.innerText = 'Update'
                    cancelUpdateButton.innerText = 'cancel'

                    buttonsSetingUpdate.appendChild(updateButton)
                    buttonsSetingUpdate.appendChild(cancelUpdateButton)

                    const inputEditTag = document.createElement('input')
                    inputEditTag.placeholder = tag
                    inputEditTag.value = tag
                    inputEditTag.classList.add('input-update-tag')
                    
                    tagTitle.append(inputEditTag)
                    text.remove()

                    updateButton.addEventListener('click', () => {
                        
                        user.tags = user.tags.map( tagInList => {
                            if (tagInList === tag) {
                                return inputEditTag.value
                            } else {
                                return tagInList
                            }
                        })
                        
                        user.itemList = ItemListData.map( item => {

                            item.tagList = item.tagList.map( tagInList => {
                                if (tagInList === tag) {
                                    return inputEditTag.value
                                } else {
                                    return tagInList
                                }
                            })

                            return item
                        })
                        
                        saveUser(user, data, indexUser)
                        document.location.reload()

                    })

                    cancelUpdateButton.addEventListener('click', () => {
                        document.location.reload()
                    })
                })
    
                deleteButton.addEventListener('click', () => {

                    popup.style.display = 'grid'

                    const tagToDelete = document.getElementById('tag-to-delete')
                    tagToDelete.style.fontWeight = '700'
                    tagToDelete.innerText = tag

                    const cancelDeleteTag = document.getElementById('cancel-delete-tag')
                    cancelDeleteTag.onclick = () => {
                        document.location.reload()
                    }

                    const inputDeleteTag = document.getElementById('input-delete-tag')
                    inputDeleteTag.placeholder = tag

                    inputDeleteTag.addEventListener('input', e => {
                        const deleteTag = document.getElementById('delete-tag')
                        if (tag === e.target.value) {
                            deleteTag.disabled = false
                        } else {
                            deleteTag.disabled = true
                        }
                    })                    

                    const form = document.getElementsByClassName('popup')[0]

                    form.addEventListener('submit', e => {

                        e.preventDefault()
                        user.tags = user.tags.filter( tagInList => tagInList !== tag)
                        user.itemList = ItemListData.map( item => {
                            item.tagList = item.tagList.filter( tagInList => tagInList !== tag)
                            return item
                        })
                        saveUser(user, data, indexUser)
                        document.location.reload()

                    })
    
    
                })
            } else {

                if (editing === false) {

                    tagTitle.classList.add('tag-down')
                    tagTitle.classList.remove('tag-up')
                    tagTitle.setAttribute('active', false)
                    li.childNodes[0].remove()
                    li.childNodes[0].remove()

                }
                
            }
        })

    })
}
