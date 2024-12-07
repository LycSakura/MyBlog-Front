<template>
    <div class="article-card" @click="handleClick">
        <h2>{{ article.title }}</h2>
        <p>{{ article.content }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
});

const handleClick = () => {
    emit('click', props.article);
};

const emit = defineEmits(['click']);


</script>


<style scoped>
.article-card {
    background-color: white;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 350px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: box-shadow 0.3s, transform 0.3s;
}

.article-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
}

.article-card h2 {
    margin: 0;
    font-size: 1.5em;
    color: #333;
}

.article-card p {
    margin: 10px 0 0;
    font-size: 1em;
    color: #666;
}
</style>