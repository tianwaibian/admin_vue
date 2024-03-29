import Mock, { Random } from 'mockjs'
interface IPubilc {
    [k: string]: any
}

let info: IPubilc[] = [
    {
        id: 2,
        name: '李思思',
        educational: 3,
        major: '物联网工程',
        unit: '北京一二三知识产权代理有限公司',
        remark: '毕业于重庆工商大学，从事知识产权申报多年，具有丰富的行业经验，熟悉知识产权行业管理体系以及发展前沿趋势，曾服务于美国客座教授、挪威兼职教授、大专院校科研教学工作者、医院专职专家、企业项目咨询申报等。擅长知识产权事务办理、高新技术企业、政府项目申报及同行相关业务咨询。欢迎您的来访，期待与您的合作！',
        address: '北京市海淀区',
        linkman: '李思思',
        phone: '15612366679',
        gender: 0,
        record: [
            {
                userid: 2,
                id: '2-1',
                time: ['2020-10-01', '2020-11-02'],
                company: '北京一二三知识产权代理有限公司',
                position: '市场调研'
            }
        ],
        train: [
            {
                userid: 2,
                id: '2-1',
                time: ['2020-10-01', '2020-11-02'],
                company: '中国版权保护中心',
                position: '版权经纪人业务培训班',
            }
        ],
        case: [
            {
                userid: 2,
                id: '2-1',
                name: '新能源汽车',
                year: '2020',
                type: 0,
                intro: '新能源汽车专利',
                error: '专利被申请',
                deal: '重置申请'
            },
            {
                userid: 2,
                id: '2-2',
                name: '镁离子电池',
                year: '2019',
                type: 2,
                intro: '电动汽车专利',
                error: '专利被申请',
                deal: '重置申请'
            }
        ]
    },
    {
        id: 1,
        name: '张三三',
        educational: 3,
        major: '物联网工程',
        unit: '上海科勒知识产权代理有限公司',
        remark: '毕业于上海财经大学，从事知识产权申报多年，具有丰富的行业经验，熟悉知识产权行业管理体系以及发展前沿趋势，曾服务于美国客座教授、挪威兼职教授、大专院校科研教学工作者、医院专职专家、企业项目咨询申报等。擅长知识产权事务办理、高新技术企业、政府项目申报及同行相关业务咨询。欢迎您的来访，期待与您的合作！',
        address: '上海市浦东区',
        linkman: '张三三',
        phone: '15612366679',
        gender: 1,
        record: [
            {
                userid: 1,
                id: '1-1',
                time: ['2020-01-01', '2020-11-02'],
                company: '上海科勒知识产权代理有限公司',
                position: '产权代理'
            },
            {
                userid: 1,
                id: '1-2',
                time: ['2020-10-01', '2020-11-02'],
                company: '湖北科兴知识产权代理有限公司',
                position: '产权代理'
            }
        ],
        train: [
            {
                userid: 1,
                id: '1-1',
                time: ['2020-10-01', '2020-11-02'],
                company: '中国知识产权培训中心',
                position: '专利检索',
            }
        ],
        case: [
            {
                userid: 1,
                id: '1-1',
                name: '光伏电池',
                year: '2022',
                type: 1,
                intro: '新能源专利',
                error: '专利被申请',
                deal: '重置申请'
            }
        ]
    }
]

const handlePage = (data: any[], page: any, pageSize: any) => {
    let proportion = pageSize;
    let num = 0;
    let _data = [];
    for (let i = 0; i < data.length; i++) {
        if (i % proportion == 0 && i != 0) {
            _data.push(data.slice(num, i));
            num = i;
        }
        if ((i + 1) == data.length) {
            _data.push(data.slice(num, (i + 1)));
        }
    }
    return _data[page - 1];
}

export default [
    //基本信息
    {
        url: '/getinfo.json',
        method: 'get',
        response(option: any) {
            const { page, pageSize } = option.query

            return {
                result: handlePage(info, page, pageSize),
                total: info.length,
                totalPage: Math.ceil(info.length / pageSize)
            }
        }
    },
    {
        url: '/addinfo.json',
        method: 'post',
        response(option: any) {
            info.unshift({
                id: info.length + 1,
                ...option.body,
                record: [],
                train: [],
                case: []
            })

            return {
                status: 200,
                message: '添加成功'
            }
        }
    },
    {
        url: '/editinfo.json',
        method: 'post',
        response(option: any) {
            const { id, name, educational, major, unit, address, linkman, phone, gender } = option.body
            let infoItem = info.find(item => item.id === id)

            if (infoItem) {
                infoItem.name = name
                infoItem.educational = educational
                infoItem.major = major
                infoItem.unit = unit
                infoItem.address = address
                infoItem.linkman = linkman
                infoItem.phone = phone
                infoItem.gender = gender
            }

            return {
                status: 200,
                message: '编辑成功'
            }
        }
    },
    {
        url: '/deleteinfo.json',
        method: 'get',
        response(option: any) {
            const { id } = option.query

            info = info.filter(item => !id.includes(item.id + ''))

            return {
                status: 200,
                message: '删除成功'
            }
        }
    },
    //工作履历
    {
        url: '/getrecord.json',
        method: 'get',
        response(option: any) {
            const { page, pageSize } = option.query

            let record = info.map(item => {
                return item.record
            })
                .reduce((pre, cur) => {
                    return pre.concat(cur)
                }, [])

            return {
                result: handlePage(record, page, pageSize),
                total: record.length,
                totalPage: Math.ceil(record.length / pageSize)
            }
        }
    },
    {
        url: '/addrecord.json',
        method: 'post',
        response(option: any) {
            const { userid } = option.body

            let infoItem = info.find(item => item.id === userid)

            if (infoItem) {
                infoItem.record.unshift({
                    id: `${userid}-${infoItem.record.length + 1}`,
                    ...option.body
                })
            }

            return {
                status: 200,
                message: '添加成功'
            }
        }
    },
    {
        url: '/editrecord.json',
        method: 'post',
        response(option: any) {
            const { userid, id, time, company, position } = option.body
            let infoItem = info.find(item => item.id === userid)
            let recordItem
            if (infoItem) {
                recordItem = infoItem.record.find((item: any) => item.id === id)
            }

            if (recordItem) {
                recordItem.time = time
                recordItem.company = company
                recordItem.position = position
            }

            return {
                status: 200,
                message: '编辑成功'
            }
        }
    },
    {
        url: '/deleterecord.json',
        method: 'get',
        response(option: any) {
            const { id, userid } = option.query

            let infoItem = info.find(item => item.id === JSON.parse(userid))
            if (infoItem) {
                infoItem.record = infoItem.record.filter((item: any) => !id.includes(item.id + ''))
            }


            return {
                status: 200,
                message: '删除成功'
            }
        }
    },
    //继续教育
    {
        url: '/gettrain.json',
        method: 'get',
        response(option: any) {
            const { page, pageSize } = option.query
            let train = info.map(item => {
                return item.train
            })
                .reduce((pre, cur) => {
                    return pre.concat(cur)
                }, [])

            return {
                result: handlePage(train, page, pageSize),
                total: train.length,
                totalPage: Math.ceil(train.length / pageSize)
            }
        }
    },
    {
        url: '/addtrain.json',
        method: 'post',
        response(option: any) {
            const { userid } = option.body

            let infoItem = info.find(item => item.id === userid)

            if (infoItem) {
                infoItem.train.unshift({
                    id: `${userid}-${infoItem.train.length + 1}`,
                    ...option.body
                })
            }

            return {
                status: 200,
                message: '添加成功'
            }
        }
    },
    {
        url: '/edittrain.json',
        method: 'post',
        response(option: any) {
            const { userid, id, time, company, position } = option.body
            let infoItem = info.find(item => item.id === userid)
            let trainItem

            if (infoItem) {
                trainItem = infoItem.train.find((item: any) => item.id === id)
            }

            if (trainItem) {
                trainItem.time = time
                trainItem.company = company
                trainItem.position = position
            }

            return {
                status: 200,
                message: '编辑成功'
            }
        }
    },
    {
        url: '/deletetrain.json',
        method: 'get',
        response(option: any) {
            const { id, userid } = option.query

            let infoItem = info.find(item => item.id === JSON.parse(userid))

            if (infoItem) {
                infoItem.train = infoItem.train.filter((item: any) => !id.includes(item.id + ''))
            }

            return {
                status: 200,
                message: '删除成功'
            }
        }
    },
    //经典案例
    {
        url: '/getcase.json',
        method: 'get',
        response(option: any) {
            const { page, pageSize } = option.query

            let ca = info.map(item => {
                return item.case
            })
                .reduce((pre, cur) => {
                    return pre.concat(cur)
                }, [])

            return {
                result: handlePage(ca, page, pageSize),
                total: ca.length,
                totalPage: Math.ceil(ca.length / pageSize)
            }
        }
    },
    {
        url: '/addcase.json',
        method: 'post',
        response(option: any) {
            const { userid } = option.body

            let infoItem = info.find(item => item.id === userid)

            if (infoItem) {
                infoItem.case.unshift({
                    id: `${userid}-${infoItem.case.length + 1}`,
                    ...option.body
                })
            }

            return {
                status: 200,
                message: '添加成功'
            }
        }
    },
    {
        url: '/editcase.json',
        method: 'post',
        response(option: any) {
            const { userid, id, name, year, type, intro, error, deal } = option.body
            let infoItem = info.find(item => item.id === JSON.parse(userid))
            let caseItem

            if (infoItem) {
                caseItem = infoItem.case.find((item: any) => item.id === id)
            }

            if (caseItem) {
                caseItem.name = name
                caseItem.year = year
                caseItem.type = type
                caseItem.intro = intro
                caseItem.error = error
                caseItem.deal = deal
            }


            return {
                status: 200,
                message: '编辑成功'
            }
        }
    },
    {
        url: '/deletecase.json',
        method: 'get',
        response(option: any) {
            const { id, userid } = option.query

            let infoItem = info.find(item => item.id === JSON.parse(userid))

            if (infoItem) {
                infoItem.case = infoItem.case.filter((item: any) => !id.includes(item.id + ''))
            }

            return {
                status: 200,
                message: '删除成功'
            }
        }
    }
]