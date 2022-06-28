module.exports = {
    title: 'Vingkin',
    description: '~~~',
    // base: '/Blog/',
    theme: 'reco',
    icon: 'logo.jpg',
    timeline: true,
    markdown: {
        lineNumbers: true//代码显示行号
    },
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    themeConfig: {
        lastUpdated: true,
        // lastUpdatedText: ,
        subSidebar: 'auto',
        author: 'Vingkin',
        logo: '/logo.jpg',
        nav: [
            { text: 'Home', icon: 'reco-home', link: '/' },
            { text: '面试', icon: 'reco-blog', link: '/guide/interview/Java' },
            { text: '操作系统', icon: 'reco-blog', link: '/OS/OS1' },
            { text: '设计模式', icon: 'reco-email', link: '/designmode/SoftwareDesignPrinciples' },
            { text: '机器学习', icon: 'reco-document', link: '/ml/读前须知' }
        ],
        sidebar: {
            '/guide': [
                {
                    title: 'Java',
                    collapsable: true,
                    children: [
                        { title: 'Java基础', path: '/guide/interview/Java' },
                        { title: 'Java并发', path: '/guide/interview/concurrent' },
                        { title: 'JVM', path: '/guide/interview/JVM' }
                    ]
                },
                {
                    title: '系统设计',
                    children: [
                        {
                            title: '基础',
                            children: [
                                { title: '幂等', path: '/guide/interview/Idempotency' }
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
                        }
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
                        { title: '计算机网络', path: '/guide/interview/ComputerNetwork' },
                        { title: '数据结构', path: '/guide/interview/DataStructure' },
                        { title: '代码模板', path: '/guide/interview/CodeTemplate' }
                    ]
                },
                {
                    title: '面经',
                    children: [
                        { title: '携程', path: 'guide/interview/xiecheng' }
                        // { title: '华为', path: 'guide/interview/huawei' }
                    ]
                },
                {
                    title: '海量数据',
                    children: [
                        { title: '如何从海量数据中找出高频词？', path: '/guide/interview/high_frequency_words' }
                    ]
                },
                {
                    title: '分布式',
                    children: [
                        {
                            title: 'ID生成器',
                            children: [
                                { title: '雪花算法', path: '/guide/interview/SnowFlake' }
                            ]
                        }
                    ]
                }
            ],
            '/OS': [
                { title: '操作系统上', path: '/OS/OS1' },
                { title: '操作系统中', path: '/OS/OS2' },
                { title: '操作系统下', path: '/OS/OS3' }
            ],
            '/designmode': [
                { title: '软件设计原则', path: '/designmode/SoftwareDesignPrinciples' },
                {
                    title: '创建者模式',
                    collapsable: true,
                    children: [
                        { title: '单例模式', path: '/designmode/Singleton' },
                        { title: '工厂模式', path: '/designmode/Factory' },
                        { title: '原型模式', path: '/designmode/Prototype' },
                        { title: '建造者模式', path: '/designmode/Builder' }
                    ]
                },
                {
                    title: '结构型模式',
                    collapsable: true,
                    children: [
                        { title: '适配器模式', path: '/designmode/Adapter' },
                        { title: '代理模式', path: '/designmode/Proxy' }
                    ]
                },
                {
                    title: '行为型模式',
                    collapsable: true,
                    children: [
                        { title: '模板方法模式', path: '/designmode/Template' }
                    ]
                }
            ],
            '/ml': [
                {
                    title: '机器学习',
                    collapsable: false,
                    children: [
                        { title: '读前须知', path: '/ml/读前须知' }
                    ]
                },
                {
                    title: '论文解读',
                    collapsable: true,
                    children: [
                        { title: 'YOLOv3', path: '/ml/YOLOv3' },
                        { title: 'GAN', path: '/ml/GAN' },
                        { title: 'CycleGAN', path: '/ml/CycleGAN' },
                        { title: 'pix2pix', path: '/ml/pix2pix' }
                    ]
                }
            ]
        },
        sidebarDepth: 2,
        searchMaxSuggestoins: 10,
        serviceWorker: {
            updatePopup: {
                message: '有新的内容.',
                buttonText: '更新'
            }
        },
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'vingkin/Blog',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        // repoLabel: '查看源码',

        // 以下为可选的编辑链接选项

        // 假如你的文档仓库和项目本身不在一个仓库：
        // docsRepo: 'vuejs/vuepress',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs/',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'docs',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '编辑此页'
    },
    plugins: [
        [
            'vuepress-plugin-mathjax',
            {
                target: 'svg',
                macros: {
                    '*': '\\times',
                },
            },
        ],
        [
            'vuepress-plugin-code-copy', true
        ]
    ]
}
