<script>
import axios from "axios";

export default {
  name: "App",
  components: {},
  data() {
    return {
      words: [
        {
          word: "",
          count: 0,
        },
      ],
      formData: {
        url: "",
        top: 0,
      },
    };
  },
  methods: {
    async onSubmit() {
      const data = {
        url: this.formData.url,
        top: this.formData.top,
      };
      console.log(data);
      try {
        const res = await axios.post(
          "https://udfbdmisuc.execute-api.us-east-1.amazonaws.com/dev/frequent_word",
          data
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<template>
  <div class="container h-100">
    <div class="col-6 col-lg-6 mx-auto">
      <div class="card border border-primary" id="main-card">
        <div class="card-body">
          <div class="card-title fw-bold m-0 p-0">Website URL</div>
        </div>
        <form v-on:submit.prevent="onSubmit">
          <div class="col-auto m-3 mt-0">
            <input
              type="url"
              class="form-control"
              id="web-url"
              v-model="formData.url"
              required
            />
          </div>
          <div class="row justify-content-center mb-3">
            <label for="top" class="col-sm-2 col-form-label">Top</label>
            <div class="col-3">
              <input
                type="number"
                min="0"
                max="50"
                class="form-control"
                id="top"
                v-model="formData.top"
                required
              />
            </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-primary mb-2">Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background: url(./assets/images/cool-background.svg);
  background-size: cover;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#main-card {
  border-radius: 20px;
}
</style>
