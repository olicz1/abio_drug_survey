<template>
    <div>
      <!-- Display unique drugDisease tags from page1_result -->
      <el-tag
        class="button-new-tag"
        v-for="tag in uniquePage1DiseaseTags"
        :key="tag"
        effect="dark"
        type="warning"
        :disable-transitions="false"
      >
        {{ tag }}
      </el-tag>
  
      <!-- Display drugDisease tags from form -->
      <el-tag
        class="button-new-tag"
        v-for="tag in diseaseTags"
        :key="tag"
        effect="dark"
        :disable-transitions="false"
      >
        {{ tag }}
        <el-popconfirm title="确认删除?" @confirm="removeTagFromList(tag)">
            <i slot="reference" class="el-icon-close close-icon"></i>
        </el-popconfirm>
      </el-tag>
  
      <!-- Add new tag input -->
      <el-input
        v-if="inputVisible"
        class="input-new-tag"
        v-model="inputValue"
        @keyup.enter.native="addTagToList"
        @blur="addTagToList"
        ref="saveTagInput"
        style="width: 100%; margin: 20px;"
      >
      </el-input>
      <!-- Button to trigger input -->
      <el-button class="button-new-tag" style="margin: 10px;" @click="showInput">+ 如果有新的{{ this.addButtonText }}请添加</el-button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DrugDiseaseTags',
    props: {
      page1ResultUniqueDrugDisease: {
        type: Array,
        required: true,
      },
      formDrugDisease: {
        type: Array,
        required: true,
      },
      addButtonText: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        inputVisible: false,
        inputValue: '',
        uniquePage1DiseaseTags: this.page1ResultUniqueDrugDisease,
        diseaseTags: this.formDrugDisease,
      };
    },
    methods: {
      removeTagFromList(tag) {
        const index = this.diseaseTags.indexOf(tag);
        if (index !== -1) {
          this.diseaseTags.splice(index, 1);
        }
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      addTagToList() {
        if (this.inputValue) {
          this.diseaseTags.push(this.inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Custom styles */
  .el-card {
    margin: 20px;
  }
  
  .el-tag + .el-tag {
    margin-top: 10px;
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  /* Style the close icon */
  .close-icon {
    cursor: pointer;
    margin-left: 8px;
    font-size: 16px;
    transition: color 0.3s;
  }
  
  /* Change color on hover */
  .close-icon:hover {
    border-radius: 50px;
    background-color: bisque;
    color: #ff4949;
  }
  
  .tag-space {
    margin: 5px;
  }
  
  </style>