<script>
import axios from "axios";
import TopWords from './components/TopWords.vue'
import IgnoredWords from './components/IgnoredWords.vue'
// import wordcloud from './components/WordCloud.vue'
import WordCloud from 'wordcloud'
import { Modal } from 'bootstrap'
import {jsonTo2DArray } from './helpers/helpers'

export default {
  name: "App",
  components: {
    TopWords, IgnoredWords, /* wordcloud */
  },
  data() {
    return {
      words: [],
      wordsCloud: [],
      windowWidth: window.innerWidth,
      ignoredWords: [],
      loading: false,
      formData: {
        url: "",
        top: 0,
        ignored: ""
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
        window.addEventListener('resize', e => {
          this.windowWidth = window.innerWidth
        });
    })
  },
  methods: {
    async onSubmit() {
      this.words = [];
      this.wordsCloud = [];
      this.loading = true;
      const data = {
        url: this.formData.url,
        top: this.formData.top,
        ignored: [...this.ignoredWords]
      };
      console.log(data);
      try {
        const res = await axios.post(
          "https://l5w1i9vvqb.execute-api.us-east-1.amazonaws.com/dev/frequent_word",
          data
        );
        console.log(res);
        this.words = [...res.data.data];
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    addWord({code, keyCode, type}) {
      if (code === 'Space' || keyCode === 32 || type === 'click'){     
        console.log('space')   
        this.formData.ignored.trim() != "" && this.ignoredWords.push(this.formData.ignored.toLowerCase().trim());
        this.formData.ignored = "";
      }
    },

    clearIgnoredWords() {
      this.ignoredWords = [];
    },

    removeWord(position) {
      this.ignoredWords = this.ignoredWords.filter((_, index) => index != position )
    },

    showWordCloud(loadingCloud) {
      // this.wordsCloud = [];
      // setTimeout(() => {
      //   this.wordsCloud = [...this.words];
      // }, 2000);
      // // loadingCloud = true;
      
      const myModal = new Modal(this.$refs.wordCloudModal);
      const list = jsonTo2DArray([...this.words]);
      const options = {
        list: list,
        gridSize: window.innerWidth <= 650  ? 6: 12,
        weightFactor: window.innerWidth <= 650 ? 1.5 : 2.3,
        fontFamily: 'Hiragino Mincho Pro, serif',
        color: 'random-dark',
      }

      // Calculate canvas size 
      this.$refs.myCanvas.width = window.innerWidth <= 650 ? 300 : 600;
      this.$refs.myCanvas.height =  window.innerWidth <= 650 ? 300 : 400;
      
      WordCloud(this.$refs.myCanvas,options);
      myModal.show()      
    },

    downloadWordCloud() {
      const link = document.createElement('a');
      link.download = 'wordcloud.png';
      link.href = this.$refs.myCanvas.toDataURL();
      link.click();
      link.delete;
    }
  },
};
</script>

<template>
  <div class="container h-100">
    <div class="row mt-4">
      <div class="col-10 col-lg-6 mx-auto">
        <div class="card border border-primary" id="main-card">
          <div class="card-header bg-transparent fw-bold">
              Website URL
          </div>
          <div class="card-body">
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
                <div class="col-9 col-sm-10 col-md-6">
                  <input
                    type="text"
                    class="form-control text-center"
                    id="ignore-words"
                    v-model="formData.ignored"
                    @keyup="addWord"
                    placeholder="Ignore words or symbols"
                  />
                </div>
                <div class="col-2 col-sm-1 d-flex align-items-center justify-content-center">
                  <Popper v-if="windowWidth > 576" content="Press space key to add word" :hover="true" placement="left" :interactive="false">
                    <font-awesome-icon class="question-icon" :icon="['fas', 'question-circle']"/>
                  </Popper>
                  <button v-else type="button" class="btn btn-primary" @click="addWord">
                    <font-awesome-icon class="plus-square" :icon="['fas', 'plus-square']"/>
                  </button>
                </div>
              </div>
              <div class="row justify-content-center">
                <label for="top" class="col-3 col-sm-2 col-form-label">Top</label>
                <div class="col-7 col-sm-7 col-md-3">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    class="form-control"
                    id="top"
                    v-model="formData.top"
                    required
                  />
                </div>
                <div class="col-auto send-button-container">
                  <button type="submit" class="btn btn-primary" @click="setWordsCloud">
                    <span v-if="loading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    <font-awesome-icon v-else class="me-2" :icon="['fas', 'paper-plane']"/>
                    {{loading ? "Loading..." : "Send"}}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
      <div v-if="ignoredWords.length" class="col-10 col-lg-6 mx-auto mt-5 mt-lg-0">
        <IgnoredWords :ignoredWords="ignoredWords" @clearIgnoredWords="clearIgnoredWords" @removeWord="removeWord"/>
      </div>
    </div>
    <div class="row" style="margin-bottom: -1.5rem !important">
      <div v-if="words.length" class="col-10 col-lg-6 mx-auto top-words mt-5 order-2 order-sm-1">
        <TopWords  :words="words" @showWordCloud="showWordCloud"/>
      </div>
      <!-- <div v-if="wordsCloud.length" class="col-10 col-lg-6 mx-auto top-words mt-5 order-1 order-sm-2">
        <wordcloud       
          :data="wordsCloud"
          nameKey="word"
          valueKey="count"
          :showTooltip="false"
        />
      </div> -->
    </div>
  </div>
  
  <!-- Modal -->
  <div class="modal fade" ref="wordCloudModal" id="wordCloudModal" tabindex="-1" aria-labelledby="wordcloudModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mx-auto">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold" id="wordcloudModalLabel">Wordcloud</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <canvas id="myCanvas" ref="myCanvas"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="downloadWordCloud">
            <font-awesome-icon class="me-1" :icon="['fas', 'save']"/>
            Save as Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  :root {
    --popper-theme-background-color: #333333;
    --popper-theme-background-color-hover: #333333;
    --popper-theme-text-color: #ffffff;
    --popper-theme-border-width: 0px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: 6px;
    --popper-theme-padding: 10px;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
  }

  html {
      min-height: 100%;
      max-height: 100%;
  }

  body {
    background: url(./assets/images/background-image.svg);
    background-color: #e6ecf2 !important;
    background-size: cover;
    background-repeat: space;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #main-card, #top-words-card {
    border-radius: 20px;
  }

  .question-icon {
    font-size: 30px;
    color: #dc3545;
  }

  .modal-dialog {
    max-width: fit-content !important;
  }

  .modal-header, .modal-footer {
    background-color: #d2e0edd2
  }

  /********** scrollbar ************/
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 3px grey;
    margin: 10px 10px 10px 10px;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(78, 79, 180);
    border-radius: 10px;
  }
  /********** scrollbar ************/

  @media screen and (max-width: 768px) {
    html {
      font-size: 0.8rem;
    }

    .send-button-container {
      margin-top: 15px !important;
    }
  }
</style>
