const user = {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
   
    template: /*vue-html*/`
    <li class="user" @click="$emit('active', user)">
    <div class="info">
        <img :src="user.avatar">
        <div class="nameID">
            <h3>{{user.name}}</h3>
            <p>{{user.id}}</p>
        </div>
    </div>
    <div class="line" v-if="user.isActive"></div>
    <div class="messages" v-if="user.isActive">
        <a :href="'https://vk.com/im?sel=' + user.id" target="_blank">Сообщения</a>
        <div class="circle"></div>
    </div>
</li>
    `
}

export default(user)