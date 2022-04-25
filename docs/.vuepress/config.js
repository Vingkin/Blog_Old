module.exports = {
    title: 'Vingkin',
    description: 'Vingkin\'s Blog',
    // base: '/Blog/',
    theme: 'reco',
    markdown: {
        lineNumbers: true//代码显示行号
    },
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    themeConfig: {
        // lastUpdated: '上次更新',
        subSidebar: 'auto',
        nav: [
            { text: '首页', link: '/' },
            {
                text: 'Vingkin 的博客',
                items: [
                    { text: 'Github', link: 'https://github.com/Vingkin' }
                ]
            }
        ],
        sidebar: {
            '/guide': [
                {
                    title: '主页',
                    collapsable: false,
                    children: [
                        { title: '读前须知', path: '/guide/读前须知' }
                    ]
                },
                {
                    title: '面试',
                    collapsable: true,
                    children: [
                        {
                            title: 'Java',
                            children: [
                                { title: 'Java基础', path: '/guide/interview/Java' },
                                { title: 'Java并发', path: '/guide/interview/concurrent' },
                                { title: 'JVM', path: '/guide/interview/JVM' }
                            ]
                        },
                        {
                            title: '开发框架',
                            children: [
                                { title: 'Spring', path: '/guide/interview/Spring' },
                                { title: 'SpringMVC', path: '/guide/interview/SpringMVC' },
                                { title: 'MyBatis', path: '/guide/interview/MyBatis' },
                                { title: 'SpringBoot', path: '/guide/interview/SpringBoot' }
                            ]
                        },
                        {
                            title: '数据库',
                            children: [
                                { title: 'MySQL', path: '/guide/interview/Mysql' },
                                { title: 'Redis', path: '/guide/interview/Redis' }
                            ]
                        },
                        {
                            title: '计算机基础',
                            children: [
                                { title: '操作系统', path: '/guide/interview/OS' },
                                { title: '计算机网络'},
                                { title: '数据结构', path: '/guide/interview/DataStructure'},
                                { title: '设计模式', path: '/guide/interview/DesignMode' },
                                { title: '代码模板', path: '/guide/interview/CodeTemplate' }
                            ]
                        }
                    ]
                }
            ]
        },
        // sidebar: [
        //     {
        //         title: '主页',
        //         collapsable: false,
        //         children: [
        //             { title: "读前须知", path: "/guide/读前须知" }
        //         ]
        //     },
        //     {
        //         title: "面试",
        //         // path: '/interview/',
        //         collapsable: true,
        //         children: [
        //             {
        //               title: "Java基础",
        //               children: [
        //                   { title: "Java并发", path: "/interview/concurrent" },
        //                   { title: "JVM", path: "/interview/JVM" }
        //               ]
        //             }
        //         ]
        //     }
        // ],
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        searchMaxSuggestoins: 10,
        serviceWorker: {
            updatePopup: {
                message: '有新的内容.',
                buttonText: '更新'
            }
        },
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页 ！'
    }
}