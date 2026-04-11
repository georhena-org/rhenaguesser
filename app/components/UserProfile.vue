<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import type { DropdownMenuItem } from '@nuxt/ui'

const userStore = useUserStore();
const musicStore = useMusiqueStore();
const { locale, locales, setLocale } = useI18n()

const normalizedLocales = computed(() =>
  locales.value.map((loc) => ({ code: loc.code, name: loc.name })).filter((loc) => loc.code !== locale.value)
)


function updateMusic() {
  musicStore.toggleMusic();
}

async function changeLocale(code: 'fr' | 'de' | 'en') {
  await setLocale(code);
}

</script>

<template>
  <div class="header_container">
    <!--<div class="user-profile">
      <div class="user-info">
        <div class="username">{{ userStore.username }}</div>
        <div class="level">LVL {{ userStore.level }}</div>
      </div>
      <div class="level-info">
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: userStore.progress + '%' }"></div>
        </div>
      </div>
    </div>-->

    <div class="lang-switch">
      <span class="current-lang">
        {{ locale.toUpperCase() }}
      </span>

      <a v-for="loc in normalizedLocales" :key="loc.code" @click="changeLocale(loc.code)" class="lang-link"
        role="button">
        {{ loc.name || loc.code.toUpperCase() }}
      </a>
    </div>
  </div>

</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.header_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .lang-switch {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.4rem 0.8rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid $blue-shade-2;
    border-radius: 999px;
    backdrop-filter: blur(6px);
  }

  .lang-link {
    font-size: 0.8rem;
    font-weight: 600;
    color: $white-color;
    opacity: 0.6;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      opacity: 1;
      color: white;
    }
  }

  .current-lang {
    font-weight: 700;
    color: $blue-shade-1;
  }

  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    text-align: center;
    min-width: 125px;

    .user-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      gap: 1rem;

      .username {
        font-family: 'Mahoda', sans-serif;
        color: $white-color;
      }

      .level {
        font-size: 0.75rem;
        font-family: 'Neo Bold', sans-serif;
        color: $white-color;
      }
    }

    .level-info {
      display: flex;
      flex-direction: row;
      width: 100%;

      .progress-bar-container {
        width: 100%;
        height: 8px;
        background-color: $white-color;
        border-radius: 5px;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(to right, $yellow-shade-1, $yellow-shade-4);
        transition: width 0.3s ease;
      }
    }

    @media screen and (max-width: 500px) {
      display: none;
    }
  }

}
</style>
