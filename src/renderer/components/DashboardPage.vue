<template>
  <div class="wrapper animated fadeIn">
    <div class="dashboard">
      <img class="logo" src="~@/assets/logo.png" alt="logo">
      <div class="horizonal-buttons">
        <router-link to="/selling" class="router-button">
          <svg viewBox="0 0 24 24">
            <path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M16,11L18.78,6H6.14L8.5,11H16Z"
            />
          </svg>
          <span>Satış Yap</span>
        </router-link>
        <router-link to="/product-management" class="router-button">
          <svg viewBox="0 0 24 24">
            <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z" />
          </svg>
          <span>Ürün Yönetimi</span>
        </router-link>
        <router-link to="/history" class="router-button">
          <svg viewBox="0 0 24 24">
            <path d="M20,18H4V6H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4M11,17H13V16H14A1,1 0 0,0 15,15V12A1,1 0 0,0 14,11H11V10H15V8H13V7H11V8H10A1,1 0 0,0 9,9V12A1,1 0 0,0 10,13H13V14H9V16H11V17Z"
            />
          </svg>
          <span>Yapılmış Satışlar</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dashboard-page',
    computed: {},
    components: {},
    methods: {}
  }
</script>