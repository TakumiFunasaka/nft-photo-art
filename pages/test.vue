<template>
  <div id="photoletter">
    <div class="container">
      <section class="section has-text-centered">
        <h1 class="title">ようこそ！</h1>
        <p class="subtitle">お名前と今日のベストショットをお選びください</p>
        <nuxt-link class="button" to="/" v-scroll-to="'#guest-name'"
          >始める</nuxt-link
        >
      </section>
      <section class="section has-text-centered" id="guest-name">
        <h1 class="title">あなたのお名前をお選びください！</h1>
        <v-select :options="options" v-model="selected" />
        <div class="button" @click="selectName" :disabled="!selected">
          選択完了
        </div>
      </section>
      <section class="section has-text-centered" id="photo-upload">
        <h1 class="title">写真を選んでください</h1>
        <div class="contents">
          <div class="upload"><input type="file" name="file" id="file" /></div>
          <img id="canvasImage" src="../assets/images/placeholder.png" />
          <p class="subtitle" v-show="uploaded">画像を長押しして保存できます</p>
          <canvas id="canvas"></canvas>
        </div>
      </section>
    </div>
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
      uploaded: false
    };
  },
  methods: {
    selectName() {
      if (this.selected) {
        this.$scrollTo("#photo-upload");
      }
    }
  },
  components: {
    vSelect
  },
  mounted() {
    document.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();
      },
      { passive: false }
    );

    const self = this;

    var file = document.getElementById("file");
    function loadLocalImage(e) {
      var fileData = e.target.files[0];
      console.log(typeof fileData);
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

          message.src = require("~/assets/images/messages/test_message.png");
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
              .then(res => {
                console.log(res);
              });
          });
        };

        image.src = event.target.result;
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
  font-family: "UtsukuchiMincho";
}
#photoletter {
  color: $main3;

  section {
    height: 100vh;
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
