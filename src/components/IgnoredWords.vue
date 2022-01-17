<script>
    export default {
        props: {
            ignoredWords: Array
        },
        methods: { 
            clearIgnoredWords() {
                this.$emit('clearIgnoredWords')
            },
            removeWord(index) {
                this.$emit('removeWord', index)
            }
        }
    }
</script>

<template>
    <div class="card border border-primary" id="top-words-card">
        <div class="card-header bg-transparent">
            <button type="button" class="btn btn-danger" @click="clearIgnoredWords">
                Clear all
                <font-awesome-icon :icon="['fas', 'trash-alt']" />
            </button>
        </div>
        <div class="card-body overflow-auto">
            <div class="words-list">
                <p class="word-box" v-for="(word, index) in ignoredWords" :key="index">
                    {{word}}
                    <font-awesome-icon :icon="['fas', 'times-circle']" @click="removeWord(index)" />
                </p>
            </div>
        </div>
        </div>
</template>

<style scoped>
    .card-body {
        max-height: 165px;
    }

    .words-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
    }
    
    .word-box {
        border: 2px solid rgb(120, 120, 235);
        background: rgb(200, 200, 245);
        border-radius: 10px;
        padding: 5px;
        margin-left: 5px;
        margin-right: 5px;
    }
</style>