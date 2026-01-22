import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { getRecourceInfo } from '../api/resource'
import { getFileInfo } from '../api/file'
import { ElMessage } from 'element-plus'

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

async function performRequests(idx, data) {
    if (fileIidx < fileUuids.length - 1) {
        try {
            const firstResponse = await getFileInfo({ uuid: fileUuids[idx] });
            const secondResponse = await getFile(firstResponse.url)
            blobList.push({
                ...firstResponse,
                data: secondResponse
            })
            loadingInstance.setText(`下载进度...${blobList.length}/${fileUuids.length}`)
        } catch (error) {
            throw error;
        }
        finally {
            fileIidx++
            await performRequests(fileIidx, data)
        }
    } else {
        await downLoad(data)
    }
}


const downLoad = async (data) => {
    const zip = new JSZip();
    blobList.forEach(item => zip.file(item.name, item.data, { binary: true }));
    zip.generateAsync({
        type: "blob",
        compression: 'STORE',  // STORE: 默认不压缩， DEFLATE：需要压缩
        compressionOptions: {
            level: 9,       // 压缩等级 1~9   1 压缩速度最快， 9 最优压缩方式
        }
    }).then(content => {
        FileSaver.saveAs(content, `${data.name}.zip`);
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

// 下载(data: jobData | resourceData)
export const handleDownload = async (resourceUuid, data = { name: 'dji-terra-cloud-demo' }) => {
    fileIidx = 0
    blobList = []
    fileUuids = []
    fileUuids = await handleGetOutRescourceInfo(resourceUuid)
    loadingInstance = ElLoading.service({
        lock: true,
        text: `开始下载...0/${fileUuids.length}`,
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await performRequests(fileIidx, data)
}
