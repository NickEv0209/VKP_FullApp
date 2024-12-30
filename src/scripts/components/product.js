const product = {
    props: {
        product: {
            type: Object,
            required: true
        }
    },
   
    template: /*vue-html*/`
        <li class="product" @click="$emit('prod', product)">
            <img v-if="product.image !== 'Нет изображения'" :src="product.image" alt="Картинка товара не найдена" class="product_image">
            <p v-if="product.image === 'Нет изображения'">Картинка не найдена. Перейдите к товару, чтобы посмотреть 😣</p>
            <a :href="product.link" target="_blank" class="productName">{{product.title}}</a>
        </li>
    `
}

export default(product)