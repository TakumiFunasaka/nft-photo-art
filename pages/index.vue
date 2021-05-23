<template>
  <div id="photoletter">
    <div class="container" v-if="!isGenerated">
      <section class="hero has-text-centered is-fullheight">
        <div class="hero-body">
          <div class="container has-text-centered">
            <figure class="image p-5">
              <img src="../assets/images/photoletter_logo.svg" />
            </figure>
          </div>
        </div>
        <div class="hero-foot">
          <div class="container has-text-centered mb-4 pb-5">
            <nuxt-link class="scroll" to="/" v-scroll-to="'#how-to-use'"
              >SCROLL</nuxt-link
            >
            <nuxt-link class="arrow-down" to="/" v-scroll-to="'#how-to-use'"
              ><figure class="mx-a image is-48x48">
                <img src="../assets/images/arrow-down.png" /></figure
            ></nuxt-link>
          </div>
        </div>
      </section>
      <section class="section" id="how-to-use">
        <div class="container p-4">
          <h2 class="has-text-centered">使い方</h2>
          <div class="one my-5">
            <figure class="image mt-6">
              <img src="../assets/images/htu1.jpg" />
            </figure>
            <p class="num mt-4">1.</p>
            <p class="description mt-2">
              お名前と、本日の式で撮影頂いたお写真の中で、ご自身と新郎新婦が写っているベストショットをお選びください。
            </p>
          </div>

          <div class="two my-5">
            <figure class="image mt-6">
              <img src="../assets/images/htu2.jpg" />
            </figure>
            <p class="num mt-4">2.</p>
            <p class="description mt-2">
              新郎新婦からのお手紙を添えてお返しします。
            </p>
          </div>
        </div>
      </section>
      <section class="section has-background-main1 px-6" id="form">
        <h2 class="has-text-centered mb-5">写真のアップロード</h2>
        <h2>お名前 - 検索が可能です</h2>
        <v-select class="v-select" :options="options" v-model="selected" />

        <h2 class="mt-6 mb-3">お写真 - タップして選択</h2>
        <div class="upload">
          <input type="file" name="file" id="file" />
        </div>
        <img
          id="uploadImage"
          src="../assets/images/placeholder.png"
          @click="upload"
        />

        <div
          class="button is-fullwidth is-main2"
          :disabled="!uploaded || !selected"
          @click="generate"
        >
          作成
        </div>

        <canvas id="canvas"></canvas>
      </section>
    </div>

    <div id="shutter" v-if="isGenerationStarted"></div>

    <section class="hero is-fullheight" id="complete" v-show="isGenerated">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column has-text-centered">
              <img
                src="../assets/images/thx.png"
                alt="thankyou for comming"
                class="thx px-6 mb-2 mt-6"
              />
              <img id="canvasImage" src="../assets/images/placeholder.png" />
              <p v-show="uploaded" class="pt-3 pb-6 mb-6">
                画像を長押しして保存できます
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
      selected: null,
      options: guests.guests,
      uploaded: false,
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
      if (this.uploaded && this.selected) {
        this.isGenerationStarted = true;
        this.isGenerated = true;
        setTimeout(() => {
          this.isGenerationStarted = false;
        }, 4000);
      }
    }
  },
  components: {
    vSelect
  },
  mounted() {
    const self = this;

    var file = document.getElementById("file");
    function loadLocalImage(e) {
      var fileData = e.target.files[0];
      if (!fileData.type.match("image.*")) {
        alert("画像を選択してください");
        return;
      }

      var image = new Image();
      var message = new Image();
      var reader = new FileReader();

      reader.onload = function(event) {
        image.onload = function() {
          var canvas = document.getElementById("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);

          message.src = require("~/assets/images/messages/message" +
            guests.guestsIdMap[self.selected] +
            ".PNG");

          message.addEventListener("load", e => {
            var messageWidth = image.naturalHeight * 1.333;
            var messageHeight = image.naturalHeight;
            var messageDx = image.naturalWidth - image.naturalHeight * 1.333;
            ctx.drawImage(
              message,
              0,
              0,
              message.naturalWidth,
              message.naturalHeight,
              messageDx,
              0,
              image.naturalHeight * 1.333,
              image.naturalHeight
            );

            self.uploaded = true;
            document.getElementById("canvasImage").src = canvas.toDataURL();
            var base64 = canvas.toDataURL("image/png");
            var bin = atob(base64.replace(/^.*,/, ""));
            var buffer = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) {
              buffer[i] = bin.charCodeAt(i);
            }
            // Blobを作成
            var blob = new Blob([buffer.buffer], {
              type: "image/png"
            });

            const storageRef = storage.ref();

            var now = new Date();
            storageRef
              .child(
                "images/" +
                  self.selected +
                  "_" +
                  now.getDate() +
                  "日_" +
                  now.getHours() +
                  ":" +
                  now.getMinutes() +
                  ".png"
              )
              .put(blob)
              .then(res => {});
          });
        };

        image.src = event.target.result;

        // 反映するだけ
        document.getElementById("uploadImage").src = event.target.result;
      };

      reader.readAsDataURL(fileData);
    }
    file.addEventListener("change", loadLocalImage, false);
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables.scss";

* {
  font-family: "UtsukuchiMincho", "Helvetica Neue", Arial,
    "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
}
#photoletter {
  color: $main3;
  position: relative;

  .hero {
    .hero-body {
      position: relative;

      .icon {
        position: absolute;
        bottom: 0;
      }
    }

    .hero-foot {
      .scroll {
        color: $main3;
        line-height: 3.5;
      }
      .image {
        animation: vertical 1s ease-in-out infinite alternate;
      }
      @keyframes vertical {
        0% {
          transform: translateY(0px);
        }
        100% {
          transform: translateY(10px);
        }
      }
    }
  }

  #form {
    .upload {
      input {
        display: none;
      }
    }

    .v-select /deep/ .vs__dropdown-toggle {
      border-radius: 0px !important;
      border: 0;
      border-bottom: 1px solid $main2;
    }

    .button {
      border-radius: 0px;
    }
  }

  #shutter {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $main3;
    z-index: 9999;
    animation: byeShutter 4s forwards;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      margin: auto;
      background-color: $main1;
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
    background-color: $main1;
    height: 100vh;
    z-index: -10;
  }

  #canvasImage {
    max-width: 100%;
    width: 100%;
  }
  #canvas {
    display: none;
  }
}
</style>
