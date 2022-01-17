.<script>
  export default {
    props: {
      words: Array
    },
    data() {
      return {
        loadingCloud: false
      }
    },
    methods: {
      generateWordCloud() {
        // this.loadingCloud = true;
        this.$emit('showWordCloud', this.loadingCloud)
      },
    }
  }
</script>

<template>
  <div class="card border border-primary" id="top-words-card">
    <div class="card-body words-table overflow-auto">
      <table class="table">
        <thead class="sticky-top">
          <th scope="col">#</th>
          <th scope="col">Word</th>
          <th scope="col">Count</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in words" :key="index">
            <th scope="row" class="fw-normal">
              {{index+1}}
            </th>
            <td class="text-start">
              {{item.word}}
            </td>
            <td class="fw-bolder text-primary">
              {{item.count}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <button type="button" class="btn btn-primary" @click="generateWordCloud">
          <span v-if="loadingCloud" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          {{loadingCloud ? "Loading..." : "Generate wordcloud"}}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .words-table {
    max-height: 50vh;
  }
</style>