<template>
    <div class="createLayout">
        <div class="side">
            <Left :list="gridList"></Left>
        </div>
        <div class="content">
            <PageTab></PageTab>
            <Header></Header>
            <Main></Main>
        </div>
        <dargBox :initLength="380" dragPos="right">
            <Right></Right>
        </dargBox>
    </div>
</template>
<script setup lang='ts'>
import _ from 'lodash';
import { ref, onMounted, getCurrentInstance, nextTick, watch } from 'vue';
import Left from './components/Left/index.vue';
import Right from './components/Right/index.vue';
import Header from './components/Header/index.vue';
import PageTab from './components/PageTab/index.vue';
import Main from './components/Main/index.vue';
import dargBox from '@/views/dragDrawer/dargBox/index.vue';

let gridList = ref<any>([]);

onMounted(() => {
    gridList.value = [
        {
            name: '常用组件',
            comList: [
                {
                    id: '1-0',
                    key: 'Table',
                    name: '展示表格',
                    info: '基础数据表格，支持单多选、分页等功能',
                    w: 12,
                    h: 18,
                    config: {
                        code: `<Table
                    :data="Table*.data"
                    :columns="Table*.columns"
                    :hideConfig="Table*.hideConfig"
                    :pagination="Table*.page"
                    :choose-type="Table*.chooseType"
                    :rowKey="TableData*.rowKey"
                    @handlePageChange="getTableList"
                    @handleSizeChange="getTableList"
                  >
                  #slot
                  </Table>`,
                        funcList: [],
                        data: {
                            data: [],
                            columns: [],
                            chooseType: '',
                            hideConfig: [],
                            rowKey: 'id',
                            page: {
                                total: 0,
                                pageNum: 1,
                                pageSize: 10,
                            },
                        },
                        fieldList: [
                            {
                                label: '列配置',
                                prop: 'columns',
                                type: 'list',
                                list: 'columnsList',
                            },
                            {
                                label: '单多选',
                                prop: 'chooseType',
                                type: 'select',
                                list: 'chooseTypeList',
                            },
                            {
                                label: '隐藏项',
                                prop: 'hideConfig',
                                type: 'checkbox',
                                list: 'hideConfigList',
                            },
                            {
                                label: '唯一标识',
                                prop: 'rowKey',
                                type: 'input',
                            },
                        ],
                        listTypeInfo: {
                            columnsList: {
                                columns: [
                                    {
                                        label: '列名称',
                                        prop: 'label',
                                        colType: 'input',
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '列字段',
                                        prop: 'prop',
                                        colType: 'input',
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '列类型',
                                        prop: 'colType',
                                        colType: 'select',
                                        list: 'typeList',
                                        option: {
                                            label: 'label',
                                            value: 'value',
                                        },
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '操作',
                                        prop: 'operate',
                                        colType: 'slot',
                                        width: 60,
                                        fixed: 'right',
                                    },
                                ],
                                listTypeInfo: {
                                    typeList: [
                                        {
                                            label: '默认',
                                            value: '',
                                        },
                                        {
                                            label: '操作',
                                            value: 'operate',
                                        },
                                        {
                                            label: '可点击',
                                            value: 'clickCol',
                                        },
                                        {
                                            label: '插槽',
                                            value: 'slot',
                                        },
                                    ],
                                },
                                hideConfig: ['checkbox', 'serial'],
                            },
                            chooseTypeList: [
                                {
                                    label: '无',
                                    value: '',
                                },
                                {
                                    label: '单选',
                                    value: 'radio',
                                },
                                {
                                    label: '多选',
                                    value: 'selection',
                                },
                            ],
                            hideConfigList: [
                                {
                                    label: '分页',
                                    value: 'pagination',
                                },
                                {
                                    label: '序号',
                                    value: 'serial',
                                },
                                {
                                    label: '反选',
                                    value: 'invert',
                                },
                            ],
                        },
                    },
                },
                {
                    id: '1-1',
                    key: 'Form',
                    name: '表单',
                    info: '提交表单',
                    w: 12,
                    h: 20,
                    config: {
                        code: `<Form
                    :data="configInfo.data"
                    :columns="configInfo.columns"
                    :rules="configInfo.rules"
                    :labelPosition="configInfo.labelPosition"
                    :list-type-info="configInfo.listTypeInfo"
                    :labelWidth="configInfo.labelWidth"
                    :whetherDisabled="configInfo.whetherDisabled"
                    :count="configInfo.count"
                  >
                  #slot
                  </Form>`,
                        funcList: [],
                        data: {
                            data: {},
                            columns: [],
                            rules: {},
                            listTypeInfo: {},
                            labelPosition: 'top',
                            count: 2,
                            whetherDisabled: false,
                        },
                        fieldList: [
                            {
                                label: '表单配置',
                                prop: 'columns',
                                type: 'list',
                                list: 'columnsList',
                            },
                            {
                                label: '对齐方式',
                                prop: 'labelPosition',
                                type: 'select',
                                list: 'alginList',
                            },
                            {
                                label: '列个数',
                                prop: 'count',
                                type: 'inputNumber',
                            },
                            {
                                label: '可否编辑',
                                prop: 'whetherDisabled',
                                type: 'select',
                                list: 'disabledList',
                            },
                        ],
                        listTypeInfo: {
                            columnsList: {
                                columns: [
                                    {
                                        label: '列名称',
                                        prop: 'label',
                                        colType: 'input',
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '列字段',
                                        prop: 'prop',
                                        colType: 'input',
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '类型',
                                        prop: 'fieldType',
                                        colType: 'select',
                                        list: 'typeList',
                                        option: {
                                            label: 'label',
                                            value: 'value',
                                        },
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '是否必填',
                                        prop: 'required',
                                        colType: 'select',
                                        list: 'allLineList',
                                        option: {
                                            label: 'label',
                                            value: 'value',
                                        },
                                    },
                                    {
                                        label: '行宽度',
                                        prop: 'customWidth',
                                        colType: 'inputNumber',
                                        width: 130,
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '是否整行',
                                        prop: 'allLine',
                                        colType: 'select',
                                        list: 'allLineList',
                                        option: {
                                            label: 'label',
                                            value: 'value',
                                        },
                                    },
                                    {
                                        label: '操作',
                                        prop: 'operate',
                                        colType: 'slot',
                                        width: 60,
                                        fixed: 'right',
                                    },
                                ],
                                listTypeInfo: {
                                    typeList: [
                                        {
                                            label: 'input',
                                            value: 'input',
                                        },
                                        {
                                            label: 'select',
                                            value: 'select',
                                        },
                                        {
                                            label: 'inputNumber',
                                            value: 'inputNumber',
                                        },
                                        {
                                            label: '插槽',
                                            value: 'slot',
                                        },
                                        {
                                            label: 'checkbox',
                                            value: 'checkbox',
                                        },
                                        {
                                            label: 'radio',
                                            value: 'radio',
                                        },
                                        {
                                            label: 'date',
                                            value: 'date',
                                        },
                                        {
                                            label: 'password',
                                            value: 'password',
                                        },
                                        {
                                            label: 'textarea',
                                            value: 'textarea',
                                        },
                                        {
                                            label: 'switch',
                                            value: 'switch',
                                        },
                                    ],
                                    allLineList: [
                                        {
                                            label: '是',
                                            value: true,
                                        },
                                        {
                                            label: '否',
                                            value: false,
                                        },
                                    ],
                                },
                                hideConfig: ['checkbox', 'serial'],
                            },
                            alginList: [
                                {
                                    label: '上对齐',
                                    value: 'top',
                                },
                                {
                                    label: '左对齐',
                                    value: 'left',
                                },
                                {
                                    label: '右对齐',
                                    value: 'right',
                                },
                            ],
                            disabledList: [
                                {
                                    label: '可编辑',
                                    value: false,
                                },
                                {
                                    label: '不可编辑',
                                    value: true,
                                },
                            ],
                        },
                    },
                },
                {
                    id: '1-2',
                    key: 'BtnBox',
                    name: '按钮盒子',
                    info: '操作按钮',
                    w: 12,
                    h: 6,
                    config: {
                        code: `<BtnBox
                    :list="BtnBox*.columns"
                    :algin="BtnBox*.algin"
                    @handleClick="handleClick"
                  ></BtnBox>`,
                        funcList: [],
                        data: {
                            columns: [],
                            algin: 'left',
                        },
                        fieldList: [
                            {
                                label: '按钮配置',
                                prop: 'columns',
                                type: 'list',
                                list: 'columnsList',
                            },
                            {
                                label: '对齐方式',
                                prop: 'algin',
                                type: 'select',
                                list: 'alginList',
                            },
                        ],
                        listTypeInfo: {
                            columnsList: {
                                columns: [
                                    {
                                        label: '按钮名称',
                                        prop: 'name',
                                        colType: 'input',
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '按钮code',
                                        prop: 'code',
                                        colType: 'input',
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '类型',
                                        prop: 'type',
                                        colType: 'select',
                                        list: 'typeList',
                                        option: {
                                            label: 'label',
                                            value: 'value',
                                        },
                                        col: {
                                            clearable: true,
                                        },
                                    },
                                    {
                                        label: '操作',
                                        prop: 'operate',
                                        colType: 'slot',
                                        width: 60,
                                        fixed: 'right',
                                    },
                                ],
                                listTypeInfo: {
                                    typeList: [
                                        {
                                            label: 'primary',
                                            value: 'primary',
                                        },
                                        {
                                            label: 'success',
                                            value: 'success',
                                        },
                                        {
                                            label: 'info',
                                            value: 'info',
                                        },
                                        {
                                            label: 'warning',
                                            value: 'warning',
                                        },
                                        {
                                            label: 'danger',
                                            value: 'danger',
                                        },
                                        {
                                            label: '无',
                                            value: '',
                                        },
                                    ],
                                },
                                hideConfig: ['checkbox', 'serial'],
                            },
                            alginList: [
                                {
                                    label: '左对齐',
                                    value: 'left',
                                },
                                {
                                    label: '右对齐',
                                    value: 'right',
                                },
                            ],
                        },
                    },
                },
            ],
        },
        {
            name: '基础组件',
            comList: [
                {
                    id: '0-0',
                    key: 'BaseGrid',
                    name: '空盒子',
                    info: '基础容器',
                    w: 6,
                    h: 10,
                    config: {
                        code: `<div></div>`,
                    },
                },
                {
                    id: '0-1',
                    key: 'Placeholder',
                    name: '占位符',
                    info: '用于填充布局，辅助作用，不计入布局',
                    w: 6,
                    h: 10,
                    config: {},
                },
            ],
        },
    ];
});
</script>

<style lang="scss" scoped>
.createLayout {
    width: 100%;
    height: 100%;
    display: flex;
    .side {
        width: 240px;
        flex-shrink: 0;
    }
    .content {
        flex: 1;
    }
}
</style>