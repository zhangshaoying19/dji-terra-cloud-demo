<template>
  <div class="table-pro">
    <!-- 搜索区域 -->
    <div v-if="$slots.search" class="table-pro-search">
      <slot name="search" />
       <el-button
        v-if="showRefresh"
        @click="handleRefresh"
        type="primary"
      >
        查询
      </el-button>
        <el-button
        v-if="showReset"
        @click="handleReset"
        type="warning"
      >
        重置
      </el-button>
    </div>

    <!-- 工具栏 -->
    <div v-if="$slots.toolbar" class="table-pro-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 表格区域 -->
    <div class="table-pro-table">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        :border="border"
        :stripe="stripe"
        :size="size"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="showSelection"
          type="selection"
          width="55"
        />
        <el-table-column
          v-if="showIndex"
          type="index"
          label="序号"
          width="60"
        />
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :formatter="column.formatter"
        >
          <template v-if="column.slot" #default="scope">
            <slot :name="column.slot" :row="scope.row" :index="scope.$index" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="$slots.action"
          label="操作"
          fixed="right"
          width="400"
          :align="actionColumnAlign"
        >
          <template #default="scope">
            <slot name="action" :row="scope.row" :index="scope.$index" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div v-if="showPagination" class="table-pro-pagination">
      <el-pagination
        :current-page="currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :layout="pagination.layout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'

// Props
const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    required: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  // 分页配置
  pagination: {
    type: Object,
    default: () => ({
    })
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: true
  },
  // 是否显示搜索
  showSearch: {
    type: Boolean,
    default: true
  },
  // 是否显示工具栏
  showToolbar: {
    type: Boolean,
    default: true
  },
  // 是否显示导出按钮
  showExport: {
    type: Boolean,
    default: true
  },
  // 是否显示刷新按钮
  showRefresh: {
    type: Boolean,
    default: true
  },
  // 是否显示选择列
  showSelection: {
    type: Boolean,
    default: false
  },
  // 是否显示序号列
  showIndex: {
    type: Boolean,
    default: false
  },
  // 是否显示边框
  border: {
    type: Boolean,
    default: true
  },
  // 是否显示斑马纹
  stripe: {
    type: Boolean,
    default: true
  },
  showReset: {
    type: Boolean,
    default: true
  },
  // 表格尺寸
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  // 操作列对齐方式
  actionColumnAlign: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  }
})

// Emits
const emit = defineEmits([
  'row-click',
  'selection-change',
  'size-change',
  'current-change',
  'search',
  'reset',
  'refresh',
  'export'
])

// Refs
const tableRef = ref()

// 响应式数据
const searchForm = reactive({})
const tableData = ref([])

// 监听数据变化
watch(() => props.data, (newVal) => {
  tableData.value = newVal
}, { deep: true })

// 监听搜索配置变化，初始化搜索表单
watch(() => props.searchConfig, (newVal) => {
  if (newVal && newVal.length > 0) {
    newVal.forEach(item => {
      searchForm[item.prop] = ''
    })
  }
}, { immediate: true, deep: true })

// 生命周期
onMounted(() => {
  // 初始化搜索表单
  if (props.searchConfig && props.searchConfig.length > 0) {
    props.searchConfig.forEach(item => {
      searchForm[item.prop] = ''
    })
  }
})

// 方法
// 行点击事件
const handleRowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}

// 选择变化事件
const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

// 分页大小变化
const handleSizeChange = (size) => {
  emit('size-change', size)
}

// 页码变化
const handleCurrentChange = (current) => {
  emit('current-change', current)
}

// 刷新
const handleRefresh = () => {
  emit('refresh')
}

const handleReset = () => {
  emit('reset')
}
</script>

<style scoped>
.table-pro {
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-pro-search {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  gap:10px;
}

.table-pro-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.table-pro-table {
  max-height: 700px;
  overflow-y: auto;
}

.table-pro-pagination {
  padding: 16px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>