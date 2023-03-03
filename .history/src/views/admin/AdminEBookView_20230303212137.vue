<template>

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