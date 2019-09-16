<template>
  <span>hello {{ text }}</span>
</template>

<script>
export default {
  name: 'HelloText',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  color: #336699;
  font-size: 20px;
}
</style>
