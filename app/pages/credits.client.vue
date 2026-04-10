<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

</script>

<template>
  <div class="credit_container">
    <div class="homepage">
      <div class="home-title">{{ $t('credits.title') }}</div>

      <div class="credit_content">
        <div class="content">{{ $t('credits.thanks') }}</div>
        <div class="content">
          {{ $t('credits.panoramax') }}
          <a href="https://panoramax.fr" style="text-decoration: underline;" target="_blank">Panoramax</a>
        </div>
      </div>

      <div class="credit_content">
        <div class="subtitle">{{ $t('credits.sourceTitle') }}</div>
        <div class="content">
          {{ $t('credits.sourceText') }}
          <a href="https://gitlab.com/panoguessr/panoguessr.com" style="text-decoration: underline;" target="_blank">PanoGuessr</a>
        </div>
      </div>

      <div class="credit_content">
        <div class="subtitle">{{ $t('credits.licenseTitle') }}</div>
        <div class="content">
          {{ $t('credits.licenseText') }}
          <a href="https://gitlab.com/panoguessr/panoguessr.com/-/blob/develop/LICENSE" style="text-decoration: underline;" target="_blank">
            LICENSE
          </a>
        </div>
      </div>
    </div>

    <AppButton>
      <a href="/">{{ $t('credits.back') }}</a>
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.credit_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-inline: 50px;
  padding-top: 20px;
  gap: 2rem;

  @media screen and (max-width: 500px) {
    padding-inline: 20px;
  }

  .homepage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 95%;
    height: 100%;
    gap: 2rem;

    .home-title {
      font-family: "Neo Extra", sans-serif;
      font-size: 4rem;
      color: $white-color;

      @media screen and (max-width: 500px) {
        font-size: 3rem;
      }
    }

    .credit_content {
      display: flex;
      flex-direction: column;
      width: 100%;

      .subtitle {
        font-family: "Neo Extra", sans-serif;
        font-size: 1.5rem;
        text-align: justify;
        line-height: 2.5rem;
        max-width: 85%;
      }

      .content {
        font-family: "Neo Medium", sans-serif;
        font-size: 1rem;
        line-height: 1.5rem;
        color: $white-color;
        text-align: justify;
      }
    }
  }
}
</style>