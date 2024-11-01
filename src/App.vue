<template>
  <div>
    <!-- Title and Logo -->
    <el-row style="display: flex; align-items: center; padding: 20px;">
      <el-col :span="12" style="display: flex; align-items: center;">
        <h1 style="color: #19B394; margin: 0;">{{ surveyTitle }}</h1>
      </el-col>
      <el-col :span="12" style="display: flex; justify-content: flex-end; align-items: center;">
        <img src="./assets/abio_logo.png" alt="Survey Logo" :style="{ height: logoHeight }" />
      </el-col>
    </el-row>
    <div style="background-color: #F3F3F3; border-top: 3px solid #19B394; padding: 20px; height: 100vh">

      <!-- Page 1: Molecular Information -->
      <el-card v-show="page===1">
        <h3>分子式信息</h3>
        <!-- Row container for layout -->
        <el-row :gutter="10">
          <!-- Radio Group: 是否有SMILES -->
          <el-col :span="6" style="padding: 5px;">
              <span style="margin-right: 10px;">是否有SMILES <span style="color: red;"> * </span></span> 
              <el-radio-group v-model="form.isSMILES">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
          </el-col>

          <!-- Input SMILES (shown if '是') -->
          <el-col v-show="form.isSMILES === '是'" :span="18">
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 10px;">输入SMILES <span style="color: red;"> * </span></span>
              <el-input
                v-model="form.smilesInput"
                placeholder="输入SMILES"
                style="flex: 1;"
              ></el-input>
            </div>
          </el-col>

          <!-- Draw SMILES (shown if '否') -->
          <el-col v-show="form.isSMILES === '否'" :span="18">
            <span>画出分子结构式</span> <span style="color: red;"> * </span>
            {{ this.form.smilesInput }}
            <el-button v-show="this.smileEditor1Visible===false" icon="el-icon-edit" circle @click="editSmiles1"></el-button>
            <el-button v-show="this.smileEditor1Visible" type="success" icon="el-icon-check" circle @click="setSmiles1"></el-button>
            <iframe
              v-show="this.smileEditor1Visible"
              id="idKetcher"
              class="frame"
              src="/ketcher-standalone-v2.6.4/standalone/index.html"
              width="100%"
              height="600"
              style="margin: 0 auto; border: 0;"
            />
          </el-col>
          
        </el-row>
        <el-button v-if="this.form.smilesInput" style="margin-top: 20px;" type="primary" @click="submitPage1">提交分子式</el-button>
      </el-card>
      
      <!-- Page 2: Drug Scoring -->
      <el-card v-show="page===2">
        <h3>药物评分</h3>

        <!-- Text Input: 剂型 -->
        <el-card>
          <div style="display: flex; align-items: center;">
            <!-- Text Input: 剂型 -->
            <span style="margin-right: 10px; white-space: nowrap;">
              药物剂型<strong>（选择药物剂型，若没有合适选项，可输入并点击创建新药物剂型）</strong> <span style="color: red;"> * </span>
            </span>
            <el-select
              v-model="form.dosageForm"
              style="flex-grow: 1;" 
              placeholder="选择药物剂型，若没有合适选项，可输入并点击创建新剂型。"
              filterable
              allow-create
            >
              <el-option 
                v-for="(option, index) in page1_result.unique_deliveryMedium"
                :key="index"
                :label="option"
                :value="option"
              ></el-option>
            </el-select>
          </div>
        </el-card>

        <!-- Tagbox: 给药途径 -->
        <el-card>
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 10px; white-space: nowrap;">
              给药途径<strong>（选择给药途径，若没有合适选项，可输入并点击创建新给药途径）</strong> <span style="color: red;"> * </span>
            </span>
            <el-select
              v-model="form.drugRoute"
              style="flex-grow: 1;"
              placeholder="选择给药途径，若没有合适选项，可输入并点击创建新给药途径。"
              multiple
              filterable
              allow-create
            >
              <el-option 
                v-for="(option, index) in page1_result.unique_deliveryRoute"
                :key="index"
                :label="option"
                :value="option"
              ></el-option>
            </el-select>
          </div>
        </el-card>

        <!-- Radio Group and Conditional File Upload: 是否为新包装 -->
        <el-card>
          <el-row type="flex" align="middle">
            <!-- Radio Buttons and Label -->
            <el-col :span="6">
              <span style="margin-right: 10px;">是否为新包装 <span style="color: red;"> * </span></span>
              <el-radio-group v-model="form.isNewPackaging">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-col>

            <!-- Upload Button (only displayed if "是" is selected) -->
            <el-col :span="6">
              <el-upload
                class="upload-demo"
                v-if="form.isNewPackaging === '是'"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">上传新包装证据</el-button>
                <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
              </el-upload>
            </el-col>
          </el-row>
        </el-card>

        <!-- Dynamic Panel: 适应症 -->
        <el-card>
          <span style="margin-right: 10px;">1.5 适应症 <span style="color: red;"> * </span></span>
          <ControlledTags :page1ResultUniqueDrugDisease="page1_result.unique_drugDisease" :formDrugDisease="form.drugDisease" addButtonText="适应症" />          
        </el-card>
        <!-- Dynamic Panel: 治疗领域 -->
        <el-card>
          <span style="margin-right: 10px;">1.5 治疗领域 <span style="color: red;"> * </span></span>
          <ControlledTags :page1ResultUniqueDrugDisease="page1_result.unique_therapClass" :formDrugDisease="form.therapClass" addButtonText="治疗领域" />
        </el-card>
        
        <el-button v-if="isFormFilled" style="margin-top: 20px;" type="primary" @click="submitPage2">提交评分信息</el-button>
      </el-card>

      <!-- Page2: display table of similar drug -->
      <el-card v-show="page===2">
        <el-button type="text" @click="toggleTable">{{ page2_control.showTable ? '隐藏' : '展示' }}相同药物表格</el-button>
        <el-table v-if="this.page2_control.showTable" :data="this.page1_result.similarity_dataframe" style="width: 100%">
          
          <!-- Citeline Drug ID column -->
          <el-table-column prop="Citeline Drug ID" label="Citeline Drug ID" width="180"></el-table-column>

          <!-- Generic Drug Name column -->
          <el-table-column prop="Generic Drug Name" label="Generic Drug Name" width="180"></el-table-column>

          <!-- Drug Disease column (list displayed as tags) -->
          <el-table-column label="Drug Disease">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row['Drug Disease']"
                :key="index"
                type="primary"
                class="tag-space">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- Therapeutic Class column (list displayed as tags) -->
          <el-table-column label="Therapeutic Class">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row['Therapeutic Class']"
                :key="index"
                type="success"
                class="tag-space">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- Mechanism Of Action column (list displayed as tags) -->
          <el-table-column label="Mechanism Of Action">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row['Mechanism Of Action']"
                :key="index"
                type="warning"
                class="tag-space">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- Delivery Route column (list displayed as tags) -->
          <el-table-column label="Delivery Route">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row['Delivery Route']"
                :key="index"
                type="info"
                class="tag-space">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- Delivery Medium column (list displayed as tags) -->
          <el-table-column label="Delivery Medium">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row['Delivery Medium']"
                :key="index"
                type="danger"
                class="tag-space">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- Target column (list displayed as tags) -->
          <el-table-column label="Target">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row['Target']"
                :key="index"
                type="primary"
                class="tag-space">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>

        </el-table>
      </el-card>

      <!-- Page 3: Drug Scoring without similar molecule -->
      <el-card v-show="this.page===3">
        <h3>药物评分（没有相同药物）</h3>

        <!-- 靶点 -->
        <el-card>
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 10px; white-space: nowrap;">
              靶点<strong>（选择靶点，若没有合适选项，可输入并点击创建）</strong> 
            </span>
            <el-select
              v-model="form.drugTarget"
              style="flex-grow: 1;"
              placeholder="选择靶点，若没有合适选项，可输入并点击创建。"
              multiple
              filterable
              :filter-method="fetchOptions"
              @input="fetchOptions"
            >
              <el-option 
                v-for="(option, index) in page1_result.options_target"
                :key="index"
                :label="option"
                :value="option"
              ></el-option>
            </el-select>
          </div>
        </el-card>

        <!-- 机制 -->
        <el-card>
          <div style="display: flex; align-items: center;">
            <!-- Text Input: 剂型 -->
            <span style="margin-right: 10px; white-space: nowrap;">
              作用机制<strong>（选择作用机制，若没有合适选项，可输入并点击创建新作用机制）</strong>
            </span>
            <el-select
              v-model="form.drugMechanism"
              style="flex-grow: 1;" 
              placeholder="选择作用机制，若没有合适选项，可输入并点击创建新作用机制。"
              multiple
              filterable
              allow-create
            >
              <el-option 
                v-for="(option, index) in page1_result.options_mechanism"
                :key="index"
                :label="option"
                :value="option"
              ></el-option>
            </el-select>
          </div>
        </el-card>

        <!-- 母核 -->
        <el-card>
          <el-row :gutter="10">
            <!-- Radio Group: 是否有SMILES -->
            <el-col :span="6" style="padding: 5px;">
                <span style="margin-right: 10px;">请输入母核SMILES <span style="color: red;"> * </span></span> 
            </el-col>

            <!-- Draw SMILES (shown if '否') -->
            <el-col :span="18">
              <span>画出母核分子结构式</span> <span style="color: red;"> * </span>
              {{ this.form.coreCompound }}
              <el-button v-show="!this.smileEditor2Visible" icon="el-icon-edit" circle @click="editSmiles2"></el-button>
              <el-button v-show="this.smileEditor2Visible" type="success" icon="el-icon-check" circle @click="setSmiles2"></el-button>
              <iframe
                v-show="this.smileEditor2Visible"
                id="idKetcher2"
                class="frame"
                src="/ketcher-standalone-v2.6.4/standalone/index.html"
                width="100%"
                height="600"
                style="margin: 0 auto; border: 0;"
              />
            </el-col>
            
          </el-row>
        </el-card>
        <el-button style="margin-top: 20px;" type="primary" @click="submitPage3">提交评分信息</el-button>
      </el-card>

      <!-- Page 4: Final Score -->
      <el-card v-show="this.page===4">
        <h3>总评分：<span style="color: green;">{{ this.page4_control.scoreData.score }}</span></h3>
        <ScoreDisplay :scoreData="page4_control.scoreData" />
      </el-card>

      <!-- Progress Bar -->
      <el-progress v-if="false" :percentage="progressPercentage" status="active"></el-progress>

      <!-- Submit Button -->
      <el-button v-if="false" type="primary" @click="submitSurvey">提交</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ControlledTags from './components/ControlledTags.vue';
import ScoreDisplay from './components/ScoreDisplay.vue';
export default {
  components: {
    ControlledTags,
    ScoreDisplay,
  },
  data() {
    return {
      surveyTitle: "创新药评分系统",
      logoHeight: "100px",
      smileEditor1Visible: true,
      smileEditor2Visible: true,
      form: {
        isSMILES: "",
        smilesInput: "COC1=CC2=C(C=C1)N=C(N2)S(=O)CC1=NC=C(C)C(OC)=C1C",
        dosageForm: [],
        drugRoute: [],
        isNewPackaging: "",
        drugDisease: [],
        therapClass: [],
        drugMechanism: "",
        drugTarget: "",
        coreCompound: ""
      },
      page1_result: {
        has_same_smiles: false,
        similarity_dataframe: [],
        unique_drugDisease: [],
        unique_therapClass: [],
        unique_deliveryRoute: [],
        unique_deliveryMedium: [],
        options_target: [],
        options_mechanism: []
      },
      page2_control: {
        showTable: false,
      },
      page4_control: {
        activeNames: [],
        scoreData: {
          score: 0,
          score_procedure: [],
        },
      },
      
      page: 1,
      progressPercentage: 50
    };
  },
  computed: {
    isFormFilled() {
      // Check if all the required fields are filled out
      return (
        this.form.dosageForm.length > 0 &&
        this.form.drugRoute.length > 0 &&
        this.form.isNewPackaging !== "" &&
        this.form.drugDisease.length >= 0
      );
    },
  },
  methods: {
    // Page 1 control
    async editSmiles1() {
      this.smileEditor1Visible = true
    },
    async setSmiles1() {
      let ketcher_setup = document.getElementById('idKetcher').contentWindow.ketcher;
      await ketcher_setup.getSmiles().then(res => {
        this.$message.success("分子式设置成功");
        this.form.smilesInput = res
      }).catch(e => {
        console.log(e)
        this.$message.error('获取 SMILES1 失败')
      })
      this.smileEditor1Visible = false
    },
    async setKetcher2() {
      let ketcher_setup = document.getElementById('idKetcher2').contentWindow.ketcher;
      await ketcher_setup.setMolecule(this.form.coreCompound);
    },
    async submitPage1() {
      let data = this.form;
      let response = await axios.post('/apps/drug_score/check_page1', data);
      if (response.data.code === 500) {
        this.$message.error(response.data.error);
      } else {
        if (response.data.data.content.has_same_smiles === true) {
          this.page1_result.has_same_smiles = response.data.data.content.has_same_smiles
          this.page1_result.similarity_dataframe = response.data.data.content.dataframe
          
          this.page1_result.unique_drugDisease = response.data.data.content.unique_values['Drug Disease']
          this.page1_result.unique_therapClass = response.data.data.content.unique_values['Therapeutic Class']
          this.page1_result.unique_deliveryMedium = response.data.data.content.unique_values['Delivery Medium']
          this.page1_result.unique_deliveryRoute = response.data.data.content.unique_values['Delivery Route']
          this.page = 2
        } else {
          this.page1_result.options_target = response.data.data.content.unique_values['Target']
          this.page1_result.options_mechanism = response.data.data.content.unique_values['Mechanism Of Action']
          this.form.coreCompound = response.data.data.content.smiles_value
          this.page = 3
          let ketcher_setup = document.getElementById('idKetcher2').contentWindow.ketcher;
          await ketcher_setup.setMolecule(this.form.coreCompound);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },


    // Page 2 control
    toggleTable() {
      this.page2_control.showTable = !this.page2_control.showTable; // Toggle table visibility
    },
    async submitPage2() {
      let data = this.form;
      data.page1_result = this.page1_result;
      
      await axios.post('/apps/drug_score/check_page2', data)
        .then(response => {
          if (response.data.code === 500) {
            this.$message.error(response.data.error);
          } else {
            this.page = 4
            this.page4_control.scoreData.score = response.data.data.content.score
            this.page4_control.scoreData.score_procedure = response.data.data.content.score_procedure
          }
        })
        .catch(error => {
          console.error('Error:', error);  // Handle error response
        });
    },

    // Page 3 control
    async fetchOptions(query) {
      if (!query) {
        this.page1_result.options_target = []; // Clear options if the query is empty
        return;
      }

      try {
        let data = {keyword: query}
        let response = await axios.post('/apps/drug_score/get_ncbi', data)
        this.page1_result.options_target = response.data.data.content.search_list
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    },
    async editSmiles2() {
      this.smileEditor2Visible = !this.smileEditor2Visible
    },
    async setSmiles2() {
      let ketcher_setup = document.getElementById('idKetcher2').contentWindow.ketcher;
      await ketcher_setup.getSmiles().then(res => {
        this.$message.success("分子式设置成功");
        this.form.coreCompound = res
      }).catch(e => {
        console.log(e)
        this.$message.error('获取 SMILES2 失败')
      })
      this.smileEditor2Visible = !this.smileEditor2Visible
    },
    async submitPage3() {
      let data = this.form;
      
      await axios.post('/apps/drug_score/check_page3', data)
        .then(response => {
          if (response.data.code === 500) {
            this.$message.error(response.data.error);
          } else {
            this.page = 4
            this.page4_control.scoreData.score = response.data.data.content.score
            this.page4_control.scoreData.score_procedure = response.data.data.content.score_procedure
          }
        })
        .catch(error => {
          console.error('Error:', error);  // Handle error response
        });
    },
    


    // Handle form submission
    submitSurvey() {
      console.log("Form data:", this.form);
    },
  }
};
</script>

<style scoped>
/* Custom styles */
.el-card {
  margin: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
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