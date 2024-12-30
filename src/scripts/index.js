import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.8/dist/vue.esm.browser.js'
import user from './components/user.js'
import product from './components/product.js'

new Vue({
    el: '#app',
    components: {
        'user' : user,
        'product' : product
    },
    data() {
        return {
            searchMode: 'users',
            search: '',
            isLoading: false,

            users: [],
            originalUsers: [],

            products: [],
            originalProducts: [],
            productActive: [],
            isNotProducts: false
        }
    },
    methods: {
        active(user) {
            if(this.searchMode === 'users') {
                if(!user.isActive) {
                    for(let i = 0; i < this.users.length; i++) {
                        this.users[i].isActive = false
                    }
                    user.isActive = true
                    this.products = user.products

                    if(user.isActive && this.products.length == 0) {
                        this.isNotProducts = true
                    } else {
                        this.isNotProducts = false
                    }

                    console.log('user', user)
                } else {
                    this.isNotProducts = false
                    user.isActive = false
                    this.products = []
                }
            }
        },

        prod(product) {
            if(this.searchMode === 'products') {
                this.users = this.originalUsers
                this.users.forEach(user => user.isActive = true)
                this.users = this.users.filter(user => user.id === product.userID)

                console.log('product', product)
                if(!product.isActive) {
                    product.isActive = true
                } else {
                    product.isActive = false
                }
            } else {

            }
        },

        input() {
            search.setSelectionRange(0, search.value.length)
        },

        enterSearch(event) {
            this.search = event.target.value.toLowerCase();
            if (this.searchMode === 'users') {
                if (!this.search) {
                    this.users = [...this.originalUsers];
                } else {
                    this.users = this.originalUsers.filter(user => user.name.toLowerCase().match(this.search));
                }
            } else if (this.searchMode === 'products') {
                if (!this.search) {
                    this.products = [...this.originalProducts]
                } else {
                    this.products = this.originalProducts.filter(product => product.title.toLowerCase().match(this.search));
                }
            }
        },

        toggleSearchMode() {
            const modal = document.querySelector('.modal')
            this.searchMode = this.searchMode === 'users' ? 'products' : 'users';
            if(this.searchMode === 'products') {
                search.value = ''
                this.isNotProducts = false
                modal.style.display = 'flex'
                setTimeout(() => {
                    modal.style.display = 'none'
                }, 1500)
                this.products = []
                this.users.forEach(user => {
                    user.products.forEach(product => {
                        this.products.push({ ...product, isActive: false })
                    })
                })
                this.originalProducts = this.products

                this.users.forEach(user => {
                    user.isActive = false
                })

            }else{
                search.value = ''
                this.users = this.originalUsers
                this.users.forEach(user => user.isActive = false)
                modal.style.display = 'flex'
                setTimeout(() => {
                    modal.style.display = 'none'
                }, 1500)

                this.products = []
            }
        },

        async update() {
            let result = confirm('Обновить список?')
            if(result) {
                search.value = ''
                this.isLoading = true

                try {
                    const users = await window.electron.getUsers()
    
                    this.users = users.map(user => ({
                        ...user,
                        isActive: false
                    }))
                    this.users.sort((a, b) => {
                        if(a.name > b.name) {
                            return 1;
                        }
                        if(a.name < b.name) {
                            return -1;
                        }
                        return 0;
                    })
                    this.originalUsers = [...this.users]
    
                } catch(e) {
                    console.log(e)
                }
                this.isLoading = false
            }
        }, 
    },
    async mounted() {
        this.isLoading = true
            try {
                const users = await window.electron.getUsers()
                
                this.users = users.map(user => ({
                    ...user,
                    isActive: false
                }))
                this.users.sort((a, b) => {
                    if(a.name > b.name) {
                        return 1;
                    }
                    if(a.name < b.name) {
                        return -1;
                    }
                    return 0;
                })
                this.originalUsers = [...this.users].map(user => ({
                    ...user,
                    isActive: false
                }))

            } catch(e) {
                console.log(e)
            }

        this.isLoading = false
    console.log('mounted')
    },
})