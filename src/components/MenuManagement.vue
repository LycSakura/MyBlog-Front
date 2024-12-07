<template>
    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input placeholder="请输入菜单名称" v-model="searchName" />
                </el-col>
                <el-col :span="6">
                    <el-select v-model="searchStatus" placeholder="请选择菜单状态">
                        <el-option label="启用" value="enabled" />
                        <el-option label="禁用" value="disabled" />
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="菜单名称" />
                <el-table-column prop="status" label="菜单状态">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'danger'">{{ scope.row.status
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchName: '',
            searchStatus: '',
            tableData: [
                { name: '系统管理', status: 'enabled' },
                { name: '用户管理', status: 'enabled' },
                { name: '角色管理', status: 'disabled' },
                // 更多数据
            ]
        }
    },
    methods: {
        search() {
            // 搜索逻辑
            console.log('搜索', this.searchName, this.searchStatus);
        },
        reset() {
            this.searchName = '';
            this.searchStatus = '';
        },
        handleEdit(row) {
            // 编辑逻辑
            console.log('编辑', row);
        },
        handleDelete(row) {
            // 删除逻辑
            console.log('删除', row);
        }
    }
}
</script>

<style scoped>
.menu-management {
    padding: 20px;
}
</style>