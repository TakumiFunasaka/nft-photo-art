<template>
  <div id="tables">
    <section class="hero is-fullheight" v-if="locked">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-5-tablet is-4-desktop is-3-widescreen">
              <form action="" class="box">
                <div class="field">
                  <label for="" class="label">Password</label>
                  <div class="control has-icons-left">
                    <input
                      type="number"
                      placeholder="****"
                      class="input"
                      required
                      v-model="password"
                    />
                    <span class="icon is-small is-left">
                      <i class="fa fa-lock"></i>
                    </span>
                  </div>
                </div>
                <div class="field">
                  <button class="button is-success" @click="unLock">
                    席次表を見る
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="image-wrapper" v-if="!locked">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-5-tablet is-4-desktop is-3-widescreen">
              <form action="" class="box">
                <div class="field">
                  <button class="button is-success" @click="unLock">
                    check rice
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      locked: true
    };
  },
  methods: {
    unLock() {
      if (this.password == "0000") {
        this.locked = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#tables {
  position: relative;
}
</style>
