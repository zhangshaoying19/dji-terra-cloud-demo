<script setup>
import { onMounted, ref, reactive } from 'vue'
import TablePro from '../components/TablePro/index.vue'
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { getJobList, createJob, jobStop, deleteJob, getJobInfo, jobStart } from '../api/job'
import { ElMessageBox,ElMessage,ElLoading } from 'element-plus'
import Resource from './resource.vue'
import { getRecourceInfo } from '../api/resource'
import { getFileInfo } from '../api/file'


const columns = ref([
    {
        label: '作业uuid',
        prop: 'uuid'
    },
    {
        label: '作业名称',
        prop: 'name'
    },
    {
        label: '作业类型',
        slot: 'type'
    },
    {
        label: '作业状态',
        slot: 'status'
    },
    {
        label: '用户扩展信息',
        prop: 'meta'
    },
    {
        label: '原始资源uuid',
        prop: 'originResourceUuid'
    }, {
        label: '输出资源uuid',
        prop: 'outputResourceUuid'
    },
    {
        label: '创建时间',
        prop: 'createdAt'
    },
    {
        label: '结束时间',
        prop: 'completedAt'
    },
    {
        label: '更新时间',
        prop: 'updatedAt'
    },
])

const TaskStatusMap = {
    0: '待开始',
    1: '等待中',
    2: '准备中',
    3: '执行中',
    4: '处理结果中',
    5: '已停止',
    6: '执行完成',
    7: '执行失败'
};

const TaskTypeMap = {
    13: 'LiDAR 重建',
    14: '2D 重建',
    15: '3D 重建'
}


const tableData = ref([])
const loading = ref(false)
const searchParams = ref({
    rows: 10,
    page: 1,
    search: '',
    uuids: '',
    type: '',
    status: '',
    originResourceUuid: '',
    outputResourceUuid: ''
})

const total = ref(0)

const refreshTable = () => {
    searchParams.value.page = 1
    getList()
}

const getList = async () => {
    loading.value = true
    const res = await getJobList(searchParams.value).finally(() => {
        loading.value = false
    })
    tableData.value = res.list
    total.value = res.total
}

const handleCurrentChange = (val) => {
    searchParams.value.page = val
    getList()
}

onMounted(() => {
    // getList()
})

const handleReset = async () => {
    searchParams.value = {
        rows: 10,
        page: 1,
        search: '',
        uuids: '',
        type: '',
        status: '',
        originResourceUuid: '',
        outputResourceUuid: ''
    }
    await getList()
}


const handleAdd = () => {
    ElMessageBox.prompt('请输入job名称', 'Tip', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^[^\s]+$/,
        inputErrorMessage: '请输入job名称',
        inputPlaceholder: '请输入job名称',
    })
        .then(async ({ value }) => {
            await createJob({
                name: value,
                meta: ''
            })
            ElMessage.success('创建job成功')
            await handleReset()
        })
}

const handleDelete = async (data) => {
    ElMessageBox.confirm(
        '确认删除该作业?',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await deleteJob({
                uuid: data.uuid,
            })
            // console.log(res);
            ElMessage.success('删除job成功')
            await handleReset()
        })
}

const handleDetail = async (data) => {
    loading.value = true
    const res = await getJobInfo({
        uuid: data.uuid
    }).finally(() => {
        loading.value = false
    })
    ElMessage.success('获取作业详情成功, 已打印在浏览器控制台')
    console.log(`%cjob detail`, 'background:#fa76ff;', res)
}

const drawer = ref(false)
const drawer2 = ref(false)
const formRef = ref()
const form = ref({
    uuid: '',
    "outputResourceUuid": "",
    "parameters": "{\"parameter\":{\"output_geo_desc\":{\"cs_type\":\"GEO_CS\",\"geo_cs\":\"EPSG:4326\",\"geo_cs_wkt\":\"\",\"override_vertical_cs\":\"\"},\"map_mode\":1}}",
    "resourceUuid": "",
    "type": 14
})

const handleStart = (data) => {
    form.value.uuid = data.uuid
    drawer.value = true
}


const handleStop = async (data) => {
    ElMessageBox.confirm(
        '确认停止该作业?',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await jobStop({
                uuid: data.uuid,
            })
            // console.log(res);
            ElMessage.success('停止job成功')
            await getList()
        })

}

const handleSelect = (data) => {
    form.value.resourceUuid = data.uuid
    drawer2.value = false
}

const rules = reactive({
    resourceUuid: [
        { required: true, message: '请选择或输入原始资源UUID', trigger: 'blur' },

    ],
    parameters: [
        { required: true, message: '请输入作业参数', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择作业类型', trigger: 'blur' }
    ],
})

const handleSubmit = async () => {
    await formRef.value.validate()
    await jobStart({
        uuid: form.value.uuid,
        data: {
            outputResourceUuid: form.value.outputResourceUuid,
            parameters: form.value.parameters,
            resourceUuid: form.value.resourceUuid,
            type: form.value.type,
        }
    })
    ElMessage.success('作业提交成功')
    drawer.value = false
    handleCancel()
    await getList()
}

const handleCancel = () => {
    drawer.value = false
    form.value = {
        uuid: '',
        "outputResourceUuid": "",
        "parameters": "{\"parameter\":{\"output_geo_desc\":{\"cs_type\":\"GEO_CS\",\"geo_cs\":\"EPSG:4326\",\"geo_cs_wkt\":\"\",\"override_vertical_cs\":\"\"},\"map_mode\":1}}",
        "resourceUuid": "",
        "type": 14
    }
}

const handleTypeChange = (val) => {
    if (val == 13) {
        form.value.parameters = ''
    } else if (val == 14) {
        form.value.parameters = '{\"parameter\":{\"output_geo_desc\":{\"cs_type\":\"GEO_CS\",\"geo_cs\":\"EPSG:4326\",\"geo_cs_wkt\":\"\",\"override_vertical_cs\":\"\"},\"map_mode\":1}}'
    } else if (val == 15) {
        form.value.parameters = '{\"parameter\":{\"output_geo_desc\":{\"cs_type\":\"GEO_CS\",\"geo_cs\":\"EPSG:4326\",\"geo_cs_wkt\":\"\",\"override_vertical_cs\":\"\"},\"model_simplify\":0.2}}'
    }
}

const getFile = (url) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url,
            responseType: "blob",
            timeout: 900000
        }).then(data => {
            resolve(data.data);
        }).catch(error => {
            reject(error.toString());
        });
    });
}

let blobList = []
let fileIidx = 0
let fileUuids = []
let loadingInstance = null

async function performRequests(idx, jobData) {
    if (fileIidx < fileUuids.length - 1) {
        try {
            const firstResponse = await getFileInfo({ uuid: fileUuids[idx] });
            const secondResponse = await getFile(firstResponse.url)
            blobList.push({
                ...firstResponse,
                data: secondResponse
            })
        } catch (error) {
            throw error;
        }
        finally {
            fileIidx++
            await performRequests(fileIidx, jobData)
        }
    } else {
        await downLoad(jobData)
    }
}


const downLoad = async (jobData) => {
    const zip = new JSZip();
    blobList.forEach(item => zip.file(item.name, item.data, { binary: true }));
    zip.generateAsync({
        type: "blob",
        compression: 'STORE',  // STORE: 默认不压缩， DEFLATE：需要压缩
        compressionOptions: {
            level: 9,       // 压缩等级 1~9   1 压缩速度最快， 9 最优压缩方式
        }
    }).then(content => {
        FileSaver.saveAs(content, `${jobData.name}.zip`);
        ElMessage.success('下载完成')
    }).finally(() => {
        loadingInstance.close()
        loadingInstance = null
    })
}

const handleGetOutRescourceInfo = async (outputResourceUuid) => {
    const res = await getRecourceInfo({
        uuid: outputResourceUuid
    })
    // console.log(res);
    return res.fileUuids
}

const handleDownload = async (data) => {
    ElMessage.success('开始下载作业输出资源')
    loadingInstance = ElLoading.service({
        lock: true,
        text: '下载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    fileIidx = 0
    blobList = []
    fileUuids = []
    fileUuids = await handleGetOutRescourceInfo(data.outputResourceUuid)
    await performRequests(fileIidx, data)
}

</script>

<template>
    <TablePro :columns="columns" :data="tableData" @refresh="refreshTable" :loading="loading" :total="total"
        :current-page="searchParams.page" @current-change="handleCurrentChange" @reset="handleReset">
        <template #search>
            <div style="display: flex; gap: 10px;">
                <el-input class="el-input-custom" placeholder="请输入Job uuid, 多个uuid用逗号分隔" v-model="searchParams.uuids" />
                <el-input class="el-input-custom" placeholder="请输入原始资源资源uuid"
                    v-model="searchParams.originResourceUuid" />
                <el-input class="el-input-custom" placeholder="请输入重建结果资源uuid"
                    v-model="searchParams.outputResourceUuid" />
                <el-select v-model="searchParams.type" placeholder="请选择作业类型" style="width: 300px;" clearable>
                    <el-option label="2D 重建" :value="14" />
                    <el-option label="3D 重建" :value="15" />
                    <el-option label="LiDAR 重建" :value="13" />
                </el-select>
                <el-select v-model="searchParams.status" placeholder="请选择作业状态" style="width: 300px;" clearable>
                    <el-option :label="TaskStatusMap[0]" :value="0" />
                    <el-option :label="TaskStatusMap[1]" :value="1" />
                    <el-option :label="TaskStatusMap[2]" :value="2" />
                    <el-option :label="TaskStatusMap[3]" :value="3" />
                    <el-option :label="TaskStatusMap[4]" :value="4" />
                    <el-option :label="TaskStatusMap[5]" :value="5" />
                    <el-option :label="TaskStatusMap[6]" :value="6" />
                    <el-option :label="TaskStatusMap[7]" :value="7" />
                </el-select>
            </div>
        </template>
        <template #status="scope">
            <span> {{ TaskStatusMap[scope.row.status] }}</span>
        </template>
        <template #type="scope">
            <span>{{ TaskTypeMap[scope.row.type] }}</span>
        </template>
        <template #toolbar>
            <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
        </template>
        <template #action="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="success" v-if="scope.row.status == 6" size="mini"
                @click="handleDownload(scope.row)" >下载</el-button>
            <el-button type="warning" size="mini" @click="handleStart(scope.row)"
                v-if="scope.row.status == 0">启动</el-button>
            <el-button v-if="scope.row.status < 4 && scope.row.status > 0" type="warning" size="mini"
                @click="handleStop(scope.row)">停止</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
    </TablePro>

    <el-drawer v-model="drawer" title="设置job启动参数(面板宽度可拖拽)" size="70%" :close-on-click-modal="false"
        :close-on-press-escape="false" resizable :append-to-body="true">

        <el-form :model="form" label-width="300px" :rules="rules" ref="formRef">
            <el-form-item label="原始资源资源UUID" required prop="resourceUuid">
                <el-input class="el-input-custom" v-model="form.resourceUuid">
                    <template #append>
                        <el-button @click="drawer2 = true">去选择</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="作业类型" required prop="type">
                <el-select class="el-input-custom" v-model="form.type" placeholder="请选择作业类型" @change="handleTypeChange">
                    <el-option label="2D 重建" :value="14" />
                    <el-option label="3D 重建" :value="15" />
                    <el-option label="LiDAR 重建" :value="13" />
                </el-select>
            </el-form-item>
            <el-form-item label="作业参数(json转义后的字符串)" required prop="parameters">
                <el-input type="textarea" class="el-input-custom" v-model="form.parameters" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button type="danger" @click="handleCancel">取消</el-button>
        </template>

        <el-drawer v-model="drawer2" title="选择资源(面板宽度可拖拽)" :before-close="handleClose" resizable size="50%"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <Resource :isSelect="true" @select="handleSelect" />
        </el-drawer>
    </el-drawer>

</template>