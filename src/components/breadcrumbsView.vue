<template>
  <v-breadcrumbs :items="items" class="breadcrumbs"></v-breadcrumbs>
</template>
<script>
  export default {
    props: ['items']
  }
</script>
<style>
.breadcrumbs{
  padding: 0 0 12px 12px;
}
</style>