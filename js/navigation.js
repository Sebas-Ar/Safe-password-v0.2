let navButtonList = document.getElementsByClassName('button-nav')
navButtonList = Array.from(navButtonList)

const querystring = window.location.search
const params = Object.fromEntries(new URLSearchParams(querystring))

const NavItemButton = document.getElementById('nav-item')
const NavTagButton = document.getElementById('nav-tag')

if (params.type === 'item') {
    NavItemButton.classList.add('bottom-border')
} else if (params.type === 'tag') {
    NavTagButton.classList.add('bottom-border')
} else {
    window.location.href = 'index.html?type=item'
}

NavItemButton.addEventListener('click', () => {
    window.location.href = 'index.html?type=item'
})

NavTagButton.addEventListener('click', () => {
    window.location.href = 'index.html?type=tag'
})

const goHome = () => {
    window.location.href = "./"
}