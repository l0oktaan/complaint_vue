<template>
    <v-app>
      <router-view/>    
  </v-app>
</template>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: 'Prompt', sans-serif!important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* body {
  font-family: 'Prompt', sans-serif!important;
} */


nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
  .page{
    height: 100%;
    background-color: #167dc2;
  }
  .center{
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .style-input-login .v-input__slot{
        background: #e6e6e6!important;
        box-shadow: none!important;
    }
    .v-icon{
        font-size: 16px!important;
    }
    .w-100{
        width: 100%;
    }

    /* .main{
      z-index: 6;
    } */
    .overflow{
      min-width: auto;
      max-width: 372px;
      word-wrap: break-word;
      /* text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 250px; */
    }
    .overflow-160{
      min-width: auto;
      max-width: 160px;
      word-wrap: break-word;
     
    }
    .overflow-630{
      min-width: auto;
      max-width: 630px;
      word-wrap: break-word;
     
    }
</style>
