<template>
  <div class="ebook">
    <h1>电子书管理</h1>
  </div>
      <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
    <WiKiList :ebooks="ebooks"/>
    </a-layout-content>
</template>

<script>
export default {
    name:'AdminEBookView'
}
</script>

<style>

</style>