<template>
    <div>
        <!-- Display new tags from form -->
        <el-tag class="button-new-tag" v-for="tag in newTags" :key="tag" effect="dark" :disable-transitions="false">
            {{ tag }}
            <el-popconfirm title="确认删除?" @confirm="removeTagFromList(tag)">
                <i slot="reference" class="el-icon-close close-icon"></i>
            </el-popconfirm>
        </el-tag>

        <!-- Add new tag dialog -->
        <el-button class="button-new-tag" style="margin: 10px;" @click="showInput">
            + 如果有新的{{ addButtonText }}请添加
        </el-button>

        <!-- New el-dialog for table input -->
        <el-dialog :title="addButtonText" :visible.sync="inputVisible" @close="handleDialogClose" width="60%">
            <!-- Filter input and search button -->
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <el-input v-model="filterText" placeholder="输入搜索关键词" style="width: 300px; margin-right: 10px;"></el-input>
                <el-button type="primary" @click="fetchTableData">搜索</el-button>
            </div>

            <!-- Table to display search results -->
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="NCBI GeneID" label="NCBI GeneID"></el-table-column>
                <el-table-column prop="Symbol" label="Symbol"></el-table-column>
                <el-table-column prop="Description" label="Description"></el-table-column>
                <el-table-column prop="Taxonomic Name" label="Taxonomic Name"></el-table-column>
                <el-table-column prop="Gene Type" label="Gene Type"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="text" @click="addTag(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- Pagination controls -->
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalItems"
                :page-size="pageSize"
                @current-change="handlePageChange"
                :current-page="currentPage"
            >
            </el-pagination>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDialogClose">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'TagsManager',
    props: {
        uniqueExistingTags: {
            type: Array,
            required: false,
        },
        newTag: {
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
            filterText: '', // Text for filtering table data
            tableData: [], // Data displayed in the table
            totalItems: 0, // Total items for pagination
            pageSize: 10, // Number of items per page
            currentPage: 1, // Current page for pagination
            uniqueTags: [...this.uniqueExistingTags],
            newTags: [...this.newTag],
        };
    },
    watch: {
        uniqueExistingTags(newVal) {
            this.uniqueTags = [...newVal];
        },
        newTag(newVal) {
            this.newTags = [...newVal];
        }
    },
    methods: {
        removeTagFromList(tag) {
            const index = this.newTags.indexOf(tag);
            if (index !== -1) {
                this.newTags.splice(index, 1);
            }
        },
        showInput() {
            this.inputVisible = true;
            this.fetchTableData(); // Fetch initial data when dialog opens
        },
        async fetchTableData() {
            try {
                const response = await axios.post('/apps/drug_score/get_ncbi', {
                    filter: this.filterText,
                    page: this.currentPage,
                    pageSize: this.pageSize
                });
                this.tableData = response.data.content.matches;
                this.totalItems = response.data.content.total; // Set total items for pagination
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.fetchTableData(); // Fetch data for the new page
        },
        addTag(row) {
            const description = row.Description;
            if (description && !this.newTags.includes(description)) {
                this.newTags.push(description);
                this.$emit('update:newTags', this.newTags); // Emit update to parent component
            }
        },
        handleDialogClose() {
            this.inputVisible = false;
            this.filterText = ''; // Clear filter input
            this.tableData = []; // Clear table data when dialog closes
            this.currentPage = 1; // Reset to first page
        }
    }
};
</script>

<style scoped>
/* Custom styles */
.el-card {
    margin: 20px;
}

.el-tag+.el-tag {
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
