<script setup>
import { onMounted, ref } from 'vue'
import TablePro from '../components/TablePro/index.vue'
import { getResourcesList, createResource, deleteResource, getRecourceInfo } from '../api/resource'

const props = defineProps({
    isSelect: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['select'])

const columns = ref([
    {
        label: '资源uuid',
        prop: 'uuid'
    },
    {
        label: '资源名称',
        prop: 'name'
    },
    {
        label: '资源类型',
        prop: 'type'
    },
    {
        label: '包含文件数量',
        prop: 'fileCount'
    },
    {
        label: '包含文件体积(byte)',
        prop: 'totalSize'
    },
    {
        label: '拍摄范围(scope)',
        slot: 'scope'
    },
    {
        label: '是否可以修改',
        prop: 'revisable'
    },
    {
        label: '用户扩展信息',
        prop: 'meta'
    },
    {
        label: '创建时间',
        prop: 'createdAt'
    },
    {
        label: '更新时间',
        prop: 'updatedAt'
    }
])
const tableData = ref([])
const loading = ref(false)
const searchParams = ref({
    rows: 10,
    page: 1,
    search: '',
    uuids: '',
    type: 'map'  // map | job_output
})

const total = ref(0)

const refreshTable = () => {
    searchParams.value.page = 1
    getList()
}

const getList = async () => {
    loading.value = true
    const res = await getResourcesList(searchParams.value).finally(() => {
        loading.value = false
    })
    tableData.value = res.list
    total.value = res.total
}

onMounted(() => {
    // getList()
})

const handleCurrentChange = (val) => {
    searchParams.value.page = val
    getList()
}

const handleReset = async () => {
    searchParams.value = {
        rows: 10,
        page: 1,
        search: '',
        uuids: '',
        type: 'map'
    }
    await getList()
}

const handleAdd = async () => {
    ElMessageBox.prompt('请输入资源名称', 'Tip', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^[^\s]+$/,
        inputErrorMessage: '请输入资源名称',
        inputPlaceholder: '请输入资源名称',
    })
        .then(async ({ value }) => {
            await createResource({
                name: value,
                type: "map"
            })
            await handleReset()
        })
}


const handleDelete = async (data) => {
    ElMessageBox.confirm(
        '确认删除该资源?',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await deleteResource({
                uuid: data.uuid,
                deleteMode: 1  // 这里自行查看api文档，来选择删除模式
            })
            // console.log(res);
            ElMessage.success('删除reource成功')
            await handleReset()
        })
}

const handleDetail = async (data) => {
    loading.value = true
    const res = await getRecourceInfo({
        uuid: data.uuid
    }).finally(() => {
        loading.value = false
    })
    ElMessage.success('获取资源详情成功, 已打印在浏览器控制台')
    console.log(`%cresource detail`, 'background:#fa764f;', res)
}


const handleSelect = (data) => {
    emits('select', data)
}
</script>

<template>
    <TablePro :columns="columns" :data="tableData" @refresh="refreshTable" :loading="loading" :total="total"
        ::current-page="searchParams.page" @current-change="handleCurrentChange" @reset="handleReset">
        <template #search>
            <div style="display: flex; gap: 10px;">
                <el-input class="el-input-custom" placeholder="请输入搜索选项" v-model="searchParams.search" clearable />
                <el-input class="el-input-custom" placeholder="请输入资源uuid, 多个uuid用逗号分隔" v-model="searchParams.uuids"
                    clearable />
                <el-select v-model="searchParams.type" placeholder="请选择资源类型" style="width: 400px;" clearable>
                    <el-option label="地图资源(map)" value="map" />
                    <!-- 任务输出资源(job_output) 暂不支持查询 -->
                    <!-- <el-option label="任务输出资源(job_output)" value="job_output" /> -->
                </el-select>

            </div>
        </template>
        <template #toolbar v-if="!isSelect">
            <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
        </template>
        <template #scope="scope">
            {{ JSON.stringify(scope.row.scope) }}
        </template>
        <template #action="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <template v-if="isSelect">
                <el-button type="warning" size="mini" @click="handleSelect(scope.row)">选择</el-button>
            </template>
            <template v-else>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </template>
    </TablePro>
</template>