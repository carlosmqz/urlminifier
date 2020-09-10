<template>
  <div>
    <h1>URL minifier, making your sharing easier, one URL at a time</h1>
    <form @submit.prevent="getURL">
      <label for="longURL">Source URL</label>
      <input type="text" id="longURL" name="longURL" v-model="longUrl"/>
      <br>
      <label for="shortid">short ID (optional)</label>
      <input type="text" id="shortid" name="shortid" v-model="shortId"/>
      <br>
      <button type="submit">Get short URL</button>
    </form>
    <p>
      Short URL generated: {{shortURL}}
    </p>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: 'UrlMinifier',
  methods:{
        async getURL(){
          let body = {
              "shortUrlId":this.shortId,
              "longUrl":this.longUrl
          }
          try{
            let response = await axios.post("http://localhost:3000/api/url",body,{
              'Content-Type': 'application/json;charset=UTF-8',
              'Access-Control-Allow-Origin': '*'
            })
            this.shortURL = response.data.url
          }catch(err){
            console.error(err);
          }
          
        }
  },
  data: function(){
    return {
      shortURL:"",
      longUrl:"",
      shortId:""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
