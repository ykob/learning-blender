<template lang="pug">
div
  ModelOutline(
    :title = 'title'
    :update = 'update'
    )
</template>

<script>
export default {
  asyncData({ error, params, store }) {
    const page = store.state.pages.find((o) => {
      return o.id === params.id
    })

    if (page === undefined) {
      error({
        statusCode: 404,
        message: 'Page is not found.',
      })
      return
    }

    return {
      title: page.title,
      update: page.update,
    }
  },
  data: () => ({
    title: '',
    update: '',
  }),
  computed: {
    webgl() {
      return this.$store.getters.webgl
    },
  },
  watch: {
    '$store.state.isLoadedWebGL'(v) {
      if (v === true) {
        this.loadWebGL()
      }
    },
  },
  mounted() {
    if (this.$store.state.isLoadedWebGL) {
      this.loadWebGL()
    }
  },
  destroyed() {
    this.webgl.destroy(this.$route.params.id)
  },
  methods: {
    loadWebGL() {
      this.webgl.load(this.$route.params.id)
      this.webgl.enableControl()
    },
  },
}
</script>

<style lang="scss" scoped></style>
