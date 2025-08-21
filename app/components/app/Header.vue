<script setup lang="ts">
const props = defineProps<{
  music: boolean,
}>()
</script>

<template>
  <header class="header" music>
    <div class="title">RhenaGUESSR</div>
    <UserProfile :music="music"/>
  </header>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: start;
  padding: 1.25rem 2rem;

  .title {
    text-align: center;
    margin: 0;
    font-family: "Mahoda", sans-serif;
    font-size: 2.5rem;
    color: $yellow-georhena;
  }

  .header__nav-list {
    display: flex;
    gap: 2.5rem;

    .header__nav-item {
      list-style: none;
    }

    a {
      text-decoration: none;
      color: $blue-shade-1;
      font-family: "Neo Regular", sans-serif;
      font-size: 1rem;
      &:hover {
        text-underline-offset: 1rem;
        text-decoration: underline solid $white-color;
        color: $white-color;
        transition: 0.25s;
      }
    }
  }
}
</style>
