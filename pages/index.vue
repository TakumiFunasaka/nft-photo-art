<template>
  <div id="rice-time">
    <div class="container" v-if="!isGenerated">
      <section class="hero has-text-centered is-fullheight">
        <div class="hero-body">
          <div class="container has-text-centered">
            <figure class="image p-5">
              <img src="../assets/images/ricetime.png" />
            </figure>
            <div class="button is-black has-text-weight-bold" @click="generate">
              check rice.
            </div>
          </div>
        </div>
      </section>
    </div>

    <div id="shutter" v-if="isGenerationStarted"></div>

    <section class="hero is-fullheight" id="complete" v-show="isGenerated">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column has-text-centered is-half">
              <div class="image-wrapper mb-0">
                <img
                  class=""
                  id="canvasImage"
                  src="../assets/images/rice.jpeg"
                />
                <img
                  class=""
                  id="canvasFrame"
                  src="../assets/images/frame.png"
                />
              </div>

              <p class="pt-3 pb-6 mb-6 has-text-weight-bold	">
                {{ displayedTime }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import guests from "./guests";
import { storage } from "@/plugins/firebase";

export default {
  data() {
    return {
      displayedTime: "",
      isGenerationStarted: false,
      isGenerated: false
    };
  },
  methods: {
    upload() {
      var file = document.getElementById("file");
      file.click();
    },
    generate() {
      this.isGenerationStarted = true;
      this.isGenerated = true;
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      this.displayedTime =
        year + "/" + month + "/" + day + " " + hour + ":" + minute;
      setTimeout(() => {
        this.isGenerationStarted = false;
      }, 4000);
    }
  },
  components: {
    vSelect
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables.scss";

* {
  font-family: "Avenir Next", Arial, "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", Meiryo, sans-serif;
}
#rice-time {
  color: $main3;
  position: relative;

  .hero {
    .hero-body {
      position: relative;
    }
  }

  #shutter {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #535353;
    z-index: 9999;
    animation: byeShutter 4s forwards;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      margin: auto;
      background-color: white;
      width: 0;
      height: 1px;
      animation: shutterOpen 4s forwards;
    }
  }

  @keyframes byeShutter {
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      display: none;
      z-index: -1;
    }
  }

  @keyframes shutterOpen {
    0% {
      width: 0;
      height: 1px;
    }
    30% {
      width: 0;
      height: 1px;
    }
    60% {
      width: 100%;
      height: 1px;
    }
    90% {
      width: 100%;
      height: 100%;
    }
    100% {
      width: 100%;
      height: 100%;
    }
  }

  #complete {
    background-color: white;
    height: 100vh;
    z-index: -10;

    .image-wrapper {
      position: relative;
      height: 0;
      padding-bottom: 100%;

      #canvasImage {
        position: absolute;
        padding: 10%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      #canvasFrame {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }
}
</style>
