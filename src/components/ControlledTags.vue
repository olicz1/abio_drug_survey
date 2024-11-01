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

    <!-- Add new tag dialog -->
    <el-button class="button-new-tag" style="margin: 10px;" @click="showInput">
      + 如果有新的{{ addButtonText }}请添加
    </el-button>

    <!-- New el-dialog for input -->
    <el-dialog
      :title="addButtonText"
      :visible.sync="inputVisible"
      @close="handleDialogClose"
    >
      <el-input
        v-model="inputValue"
        placeholder="输入新标签"
        @keyup.enter.native="addTagToList"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="addTagToList">确认</el-button>
      </span>
    </el-dialog>
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
      uniquePage1DiseaseTags: [...this.page1ResultUniqueDrugDisease],
      diseaseTags: [...this.formDrugDisease],
    };
  },
  watch: {
    // Watch for changes in the page1ResultUniqueDrugDisease prop
    page1ResultUniqueDrugDisease(newVal) {
      this.uniquePage1DiseaseTags = [...newVal];
    },
    // Watch for changes in the formDrugDisease prop
    formDrugDisease(newVal) {
      this.diseaseTags = [...newVal];
    }
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
    },
    addTagToList() {
      if (this.inputValue.trim()) {
        this.diseaseTags.push(this.inputValue.trim());
        this.$emit('update:formDrugDisease', this.diseaseTags); // Emit change to parent
      }
      this.handleDialogClose();
    },
    handleDialogClose() {
      this.inputVisible = false;
      this.inputValue = ''; // Clear input value
    }
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