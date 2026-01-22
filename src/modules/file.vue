<script setup>
import { onMounted, ref } from 'vue'
import OSS from 'ali-oss'
import TablePro from '../components/TablePro/index.vue'
import { getFileList, deleteFile, getFileInfo } from '../api/file'
import Resource from './resource.vue'
import { getToken, getUploadCallBack } from '../api/token.js'

const columns = ref([
    {
        label: '文件uuid',
        prop: 'uuid'
    },
    {
        label: '文件名称',
        prop: 'name'
    },
    {
        label: 'oss上传标识(checksum)',
        prop: 'checksum'
    },
    {
        label: '文件体积(byte)',
        prop: 'size'
    },
    {
        label: '坐标(经纬度)',
        slot: 'position'
    },
    {
        label: '扩展信息',
        prop: 'meta'
    },
    {
        label: '创建时间',
        prop: 'createdAt'
    },
    {
        label: '更新时间',
        prop: 'updatedAt'
    },
    {
        label: '下载连接',
        slot: 'url'
    },
])
const tableData = ref([])
const loading = ref(false)
const drawer2 = ref(false)
const searchParams = ref({
    rows: 10,
    page: 1,
    search: '',
    uuids: '',
    name: '',
    resourceUuid: '',
    orderAsc: undefined,
    needURL: false
})

const total = ref(0)
const bindResourceUUID = ref('')
const isUpload = ref(false)
const dialogVisible = ref(false)


const refreshTable = () => {
    searchParams.value.page = 1
    getList()
}

const getList = async () => {
    loading.value = true
    const res = await getFileList(searchParams.value).finally(() => {
        loading.value = false
    })
    tableData.value = res.list
    total.value = res.total
}

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
        name: '',
        resourceUuid: '',
        needURL: false
    }
    getList()
}

onMounted(() => {
    // getList()
})


const handleSelect = (data) => {
    if (isUpload.value) {
        bindResourceUUID.value = data.uuid
        dialogVisible.value = true
        drawer2.value = false
        isUpload.value = false
    } else {
        searchParams.value.resourceUuid = data.uuid
        drawer2.value = false
    }
}

const handleDetail = async (data) => {
    loading.value = true
    const res = await getFileInfo({
        uuid: data.uuid
    }).finally(() => {
        loading.value = false
    })
    ElMessage.success('获取作业详情成功, 已打印在浏览器控制台')
    console.log(`%cjob detail`, 'background:#acf6ff;', res)
}


const handleDelete = async (data) => {
    ElMessageBox.confirm(
        '确认删除该文件?',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await deleteFile({
                uuid: data.uuid,
            })
            // console.log(res);
            ElMessage.success('删除文件成功')
            await handleReset()
        })
}

const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    ElMessage.success('复制成功')
}

const handleUpload = () => {
    if (uploading.value) {
        dialogVisible.value = true
    } else {
        ElMessage.info('请先选择文件绑定的资源')
        isUpload.value = true
        drawer2.value = true
    }
}

const handleExceed = () => {
    ElMessage.warning('最多只能上传500张图片,请重新选择')
}

const tokenBody = ref(null)
const ossClient = ref(null)
const storeRootPath = ref('')
const callbackParam = ref('')
const isRefreshSTS = ref(false)
const uploadProgressText = ref('')

const handleGetToken = async () => {
    uploadProgressText.value = '获取token中...'
    const res = await getToken()
    tokenBody.value = res
    callbackParam.value = res.callbackParam
    storeRootPath.value = res.storePath.slice(0, res.storePath.lastIndexOf('/{fileName}'));  // 文件上传路径
    uploadProgressText.value = 'token获取成功'
    // console.log('Token', res);
    setTimeout(() => {
        isRefreshSTS.value = false
    }, 300000)
}

const creatOssClient = async () => {
    uploadProgressText.value = '创建ossClient中...'
    ossClient.value = new OSS({
        region: tokenBody.value.region, // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
        accessKeyId: tokenBody.value.accessKeyID, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
        accessKeySecret: tokenBody.value.secretAccessKey, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
        bucket: tokenBody.value.cloudBucketName, // 示例：'my-bucket-name'，填写存储空间名称。
        stsToken: tokenBody.value.sessionToken,
        storePath: tokenBody.value.storePath
    });
    // ElMessage.success('ossClient创建成功')
    // console.log('OssClient', ossClient.value);
    isRefreshSTS.value = true
    uploadProgressText.value = 'ossClient创建成功'

}

const uploading = ref(false)
const allUpload = ref([])
const uploadSuccess = ref([])
const uploadFail = ref([])
const MAX_UPLOAD_NUM = 10  // 一次性上传、关联很多文件都会报错，所以对图片文件分批上传、合并

const uploadFile = (e) => {
    return new Promise((resolve, reject) => {
        ossClient.value.put(`${storeRootPath.value}/${e.name}`, e.raw).then(res => {
            // console.log(res);
            // 存储下上传成功后的信息，后面关联resource需要用到
            temporaryEtags.value.push({
                name: e.name,
                meta: 'jpg',
                etag: res.res.headers.etag,
                checksum: res.res.headers.etag,
            })
            uploadSuccess.value.push(e)
            resolve(res)
        }).catch((err) => {
            uploadFail.value.push(e)
            reject(err)
            throw new Error(err);
        })
    })
}

let uploadIdx = 0
const temporaryEtags = ref([])

const handleStartUp = async () => {
    if (!bindResourceUUID.value && allUpload.value.length > 0) {
        allUpload.value = []
        uploadFail.value = []
        uploadSuccess.value = []
    } else {
        uploading.value = true
        if (!isRefreshSTS.value) {
            await handleGetToken()
            await creatOssClient()
        }
        uploadProgressText.value = '开始上传文件...'
        await recursiveUpload(uploadIdx)
    }
}

const relevanceFile = () => {
    return new Promise((resolve, reject) => {
        getUploadCallBack({
            callbackParam: callbackParam.value,
            resourceUUID: bindResourceUUID.value,
            files: temporaryEtags.value
        }).then(res => {
            temporaryEtags.value = []
            resolve(res)
        }).catch(err => {
            reject(err)
            throw new Error(err);
        })
    })
}


const uploadFailGuaranteed = async () => {
    if (!isRefreshSTS.value) {
        await handleGetToken()
        await creatOssClient()
        return Promise.resolve(true)
    } else {
        return Promise.resolve(false)
    }
}

const bindFile = async () => {
    relevanceFile().then(() => {
        if (uploadIdx !== allUpload.value.length - 1) {
            uploadIdx++
            recursiveUpload()
        } else {
            handleUploadComplete()
        }
    }).catch((_err) => {
        uploadFailGuaranteed().then(isSuccess => {
            if (isSuccess) {
                relevanceFile()
            } else {
                ElMessage.error('文件关联失败,未知错误,请到控制台查看')
                uploadProgressText.value = '文件关联失败,未知错误,请到控制台查看'
            }
        })
    })
}

const recursiveUpload = async () => {
    uploadFile(allUpload.value[uploadIdx]).then(_res => {
        if (uploadIdx !== allUpload.value.length - 1) {
            if (temporaryEtags.value.length == MAX_UPLOAD_NUM) {
                bindFile()
            } else {
                uploadIdx++
                recursiveUpload()
            }
        } else {
            bindFile()
        }
    }).catch(_err => {
        uploadFailGuaranteed().then(isSuccess => {
            if (isSuccess) {
                recursiveUpload()
            } else {
                ElMessage.error('上传中断,未知错误,请到控制台查看')
                uploadProgressText.value = '上传中断,未知错误,请到控制台查看'
            }
        })
    })
}

const handleUploadComplete = () => {
    uploadProgressText.value = '上传完成'
    bindResourceUUID.value = ''
    uploading.value = false
    uploadIdx = 0
}
</script>

<template>
    <TablePro :columns="columns" :data="tableData" @refresh="refreshTable" :loading="loading" :total="total"
        :current-page="searchParams.page" @current-change="handleCurrentChange" @reset="handleReset">
        <template #search>
            <div style="display: flex; gap: 10px;">
                <el-input class="el-input-custom" v-model="searchParams.resourceUuid" placeholder="请输入文件绑定的资源uuid">
                    <template #append>
                        <el-button @click="drawer2 = true">去选择</el-button>
                    </template>
                </el-input>
                <el-input class="el-input-custom" placeholder="请输入Job uuid, 多个uuid用逗号分隔" v-model="searchParams.uuids" />
                <el-input class="el-input-custom" placeholder="请输入文件名称" v-model="searchParams.name" clearable />
                <el-select v-model="searchParams.needURL" placeholder="是否需要展示下载连接" style="width: 300px;">
                    <el-option label="不返回下载连接" :value="undefined" />
                    <el-option label="返回下载连接" :value="false" />
                </el-select>
                <el-select v-model="searchParams.orderAsc" placeholder="是否按升序排序" style="width: 300px;">
                    <el-option label="降序返回" :value="undefined" />
                    <el-option label="升序返回" :value="true" />
                </el-select>
            </div>
        </template>
        <template #toolbar>
            <span v-show="uploading">文件上传中: 总数{{ allUpload.length }}张, 成功{{ uploadSuccess.length }}张, 失败{{
                uploadFail.length }}张</span>
            <el-button type="primary" size="mini" @click="handleUpload">上传文件</el-button>
        </template>
        <template #url="scope">
            <template v-if="searchParams.needURL">
                <el-button type="primary" text size="mini" @click="handleCopy(scope.row.url)">复制</el-button>
                <el-link :href="scope.row.url" target="_blank">下载</el-link>
            </template>
        </template>
        <template #position="scope">
            {{ JSON.stringify(scope.row.position) }}
        </template>
        <template #action="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
    </TablePro>

    <el-dialog v-model="dialogVisible" title="上传面板" :before-close="handleClose" :close-on-press-escape="false"
        :close-on-click-modal="false">
        <div>
            <p>已选择文件数(单次选中最多500张,防止浏览器崩溃): {{ allUpload.length }}</p>
            <p v-show="uploading" style="width: 100%;text-align: center;">当前操作: {{ uploadProgressText }}</p>
            <el-upload v-show="!uploading" style="display: inline-block;margin-left: 10px;" multiple
                v-model:file-list="allUpload" action="" :show-file-list="false" :auto-upload="false" :limit="500"
                accept="image/*" :on-exceed="handleExceed">
                <el-button type="primary">选择上传文件</el-button>
            </el-upload>
            <div style="display: flex;width: 100%;height: 500px;gap:20px;margin-top: 20px;">
                <div style="width: 50%;height: 100%;border:2px solid #009688;">
                    <p style="width: 100%;text-align: center;color: #009688;">已上传文件数: {{ uploadSuccess.length }}</p>
                    <div style="width: 100%;overflow-y: auto; height: calc(100% - 50px);padding-left: 10px;">
                        <div v-for="item in uploadSuccess" :key="item.uid" style="width: 100%;line-height: 30px;">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <div style="width: 50%;height: 100%;border:2px solid #FF5722;">
                    <p style="width: 100%;text-align: center;color: #FF5722;">上传失败文件数: {{ uploadFail.length }}</p>
                    <div style="width: 100%;overflow-y: auto; height: calc(100% - 50px);padding-left: 10px;">
                        <div v-for="item in uploadFail" :key="item.uid" style="width: 100%;line-height: 30px;">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" v-if="!uploading" @click="handleStartUp" :disabled="allUpload.length === 0">
                    {{ (!bindResourceUUID && allUpload.length > 0) ? '清理上传结果' : '开始上传' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-drawer v-model="drawer2" title="选择资源(面板宽度可拖拽)" :before-close="handleClose" resizable size="50%" append-to-body
        :close-on-click-modal="false" :close-on-press-escape="false">
        <Resource :isSelect="true" @select="handleSelect" />
    </el-drawer>
</template>