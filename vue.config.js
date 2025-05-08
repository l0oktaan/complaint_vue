// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: [
//     'vuetify'
//   ]
// })

module.exports = {
  // transpileDependencies: [
  //   "vuetify",
    
  // ],
  transpileDependencies: ["vuetify", "@peepi/vuetify-tiptap"],
  

  devServer: {
    proxy: {
 
        "^/api" :{
          
          target: 'http://10.10.10.164'
        },
        
    }
  },
  
};