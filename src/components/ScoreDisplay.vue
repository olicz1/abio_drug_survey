<template>
    <div class="score-container">
      <h2 v-if="false">评分结果</h2>
      <p v-if="false" class="final-score">总分: {{ scoreData.score }}</p>
      <div class="score-details">
        <h3>评分过程:</h3>
        <ul>
          <li v-for="(step, index) in scoreData.score_procedure" :key="index">
            {{ step }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ScoreDisplay',
    props: {
      scoreData: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .score-container {
    margin: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  .final-score {
    font-size: 24px;
    font-weight: bold;
    color: #4CAF50;
  }
  .score-details {
    margin-top: 10px;
  }
  .score-details h3 {
    margin-bottom: 5px;
    font-size: 18px;
  }
  .score-details ul {
    list-style-type: none;
    padding: 0;
  }
  .score-details li {
    margin: 5px 0;
    padding: 5px;
    background-color: #e7f3fe;
    border-radius: 3px;
  }
  </style>