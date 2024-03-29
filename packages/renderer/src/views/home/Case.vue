<template>
    <div class="case">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item>经典案例</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="form-wrap">
            <div class="btn-group">
                <el-button @click="add" type="success" style="width: 100px;">添加案例</el-button>
                <el-button style="width: 100px;">导入</el-button>
                <el-button style="width: 100px;">导出</el-button>
            </div>

            <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column prop="id" label="编号" width="55px" />

                <el-table-column prop="userid" label="对应人员" width="80px">
                    <template #default="{ row, column, $index }">
                        <span v-if="userData.find((item: any) => item.id === row.userid)">
                            {{ (userData.find((item: any) => item.id === row.userid) as any).name }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="案例名称" />

                <el-table-column prop="year" label="案例年份">
                    <template #default="{ row, column, $index }">
                        <span>
                            {{ row.year }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column prop="type" label="业务类型">
                    <template #default="{ row, column, $index }">
                        <span>
                            {{ row.type === 0 ? '专利' : row.type === 1 ? '商标' : '版权' }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column prop="intro" label="基本情况" />

                <el-table-column label="操作" width="120px">
                    <template #default="{ row, column, $index }">
                        <el-button link type="primary" size="small" @click="edit(row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[7, 14, 21, 28]"
                background layout="total, sizes, prev, pager, next, jumper" :total="totalPage"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />

            <el-dialog v-model="dialogshow" width="580px">
                <el-form :model="form" ref="formRef" label-width="120px" :rules="rules">
                    <el-form-item :label="'对应人员'" prop="userid" :rules="{
                        required: true,
                        message: '请填写对应人员',
                        trigger: 'blur',
                    }">
                        <el-select v-model="form.userid" :disabled="isEdit" placeholder="请选择对应人员">
                            <el-option v-for="(item, index) in userData" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="案例名称" prop="name">
                        <el-input v-model="form.name" placeholder="请填写案例名称" />
                    </el-form-item>

                    <el-form-item class="date" label="案例年份" prop="year">
                        <el-date-picker v-model="form.year" type="year" format="YYYY" value-format="YYYY"
                            placeholder="请选择案例年份" />
                    </el-form-item>

                    <el-form-item label="所属业务类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择所属业务类型" style="width:100%">
                            <el-option v-for="(item, index) in type" :label="item.message" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="案例基本情况" prop="intro">
                        <el-input v-model="form.intro" type="textarea" placeholder="请填写案例基本情况简介" />
                    </el-form-item>

                    <div class="bottom">
                        <el-form-item label="问题争议点" prop="error">
                            <el-input v-model="form.error" type="textarea" />
                        </el-form-item>

                        <el-form-item label="方案解决" prop="deal">
                            <el-input v-model="form.deal" type="textarea" />
                        </el-form-item>
                    </div>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="onSubmit" style="width:100px">确认</el-button>
                        <el-button @click="onCancel" style="width:100px">取消</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>


<script lang="ts">
export default {
    name: ""
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, FormRules, ElMessageBox } from 'element-plus'
import axios from '../../http'
interface IPubilc {
    [k: string]: any
}

const userData = ref<IPubilc[]>([])
axios.get('/getinfo.json', { params: { page: 1, pageSize: 10000 } }).then(res => {
    userData.value = res.data.result
})

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(7)
const totalPage = ref(1)
const handleSizeChange = (evt: any) => {
    pageSize.value = evt
    getData()
}
const handleCurrentChange = (evt: any) => {
    currentPage.value = evt
    getData()
}
const getData = () => {
    axios.get('/getcase.json', { params: { page: currentPage.value, pageSize: pageSize.value } }).then(res => {
        tableData.value = res.data.result
        totalPage.value = res.data.total
    })
}
getData()

const isEdit = ref(false)
const dialogshow = ref(false)
const edit = (row: any) => {
    dialogshow.value = true;
    form.value = JSON.parse(JSON.stringify(row))
    isEdit.value = true
}

const del = (row: any) => {
    ElMessageBox.confirm(`确定删除【当前经历】吗？`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
    }).then(() => {
        axios.get('/deletecase.json', { params: { id: row.id, userid: row.userid } }).then((res: any) => {
            getData()

            ElMessage({
                type: 'success',
                message: res.data.message,
            })
        })
    })
}

const add = () => {
    dialogshow.value = true;
    form.value = JSON.parse(JSON.stringify(defaultForm))
    isEdit.value = false
}

const formRef = ref(null)

const onCancel = () => {
    dialogshow.value = false
    setTimeout(() => {
        form.value = JSON.parse(JSON.stringify(defaultForm))
    }, 100)
}

const onSubmit = () => {
    (formRef.value as any).validate((valid: any, fields: any) => {
        if (valid) {
            let url
            if (isEdit.value) {
                url = '/editcase.json'
            } else {
                url = '/addcase.json'
            }

            axios.post(url, {
                ...JSON.parse(JSON.stringify(form.value))
            }).then((res: any) => {
                getData()

                ElMessage({
                    type: 'success',
                    message: res.data.message
                })

                form.value = JSON.parse(JSON.stringify(defaultForm))
                dialogshow.value = false
                setTimeout(() => {
                    (formRef.value as any).resetFields()
                }, 100)
            })
        }
    })
}

const defaultForm = {
    userid: 1,
    name: '',
    year: '',
    type: '',
    intro: '',
    error: '',
    deal: ''
}

const form = ref({
    userid: 1,
    name: '',
    year: '',
    type: '',
    intro: '',
    error: '',
    deal: ''
})

const type = ref([
    { value: 0, message: '专利' },
    { value: 1, message: '商标' },
    { value: 2, message: '版权' },
])

const rules = reactive<FormRules>({
    name: [{ required: true, message: '请填写案例名称', trigger: 'blur' }],
    year: [{ required: true, message: '请选择案例年份', trigger: 'blur' }],
    type: [{ required: true, message: '请选择案例所属业务类型', trigger: 'change' }],
    intro: [{ required: true, message: '请填写案例基本情况简介', trigger: 'change' }],
})

const tableRowClassName = ({
    row,
    rowIndex,
}: {
    row: any
    rowIndex: any
}) => {
    if ((rowIndex + 1) % 2 === 0) {
        // return 'warning-row'
        return 'success-row'
    }
    // else if (rowIndex % 3 === 0) {
    //     return 'success-row'
    // }
    return ''
}
</script>


<style lang="less" scoped>
.case {
    width: 100%;
}

.form-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0 50px;


    .btn-group {
        margin-bottom: 20px;
    }

    .el-table {
        height: 360px;
        overflow-y: auto;
    }

    .el-pagination {
        align-self: flex-end;
        padding: 10px 0;
    }

}

:deep(.el-dialog .el-dialog__header .el-dialog__headerbtn) {
    top: -5px;
}

.el-form {
    width: 550px;

    .el-form-item {
        margin-top: 30px;
    }

    .bottom {
        display: flex;
    }

    .date :deep(.el-input) {
        width: 100%;

        .el-input__wrapper {
            width: 100%
        }
    }
}
</style>