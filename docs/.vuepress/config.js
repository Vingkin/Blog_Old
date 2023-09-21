module.exports = {
    head: [
        // 网页标签栏图标
        ['link', { rel: 'icon', href: '/vuepress/favicon.ico' }],
        // 移动栏优化
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        // 引入jquery
        ["script", {
            "language": "javascript",
            "type": "text/javascript",
            "src": "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"
        }],
        // 引入鼠标点击脚本
        ["script", {
            "language": "javascript",
            "type": "text/javascript",
            "src": "/js/MouseClickEffect.js"
        }]
    ],
    title: 'Vingkin的学习文档',
    description: '~~~',
    base: '/Blog/',
    theme: 'reco',
    icon: 'logo.gif',
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
        lastUpdated: '上次更新',
        subSidebar: 'auto',
        author: 'Vingkin',
        logo: '/logo.gif',
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Java相关', link: '/guide/interview/Java'},
            {text: '操作系统', link: '/OS/OS1'},
            {text: 'Netty', link: '/netty/nio/three_component'},
            {text: '设计模式', link: '/designmode/SoftwareDesignPrinciples'},
            {text: '机器学习', link: '/ml/YOLOv3'},
            {
                text: '微服务',
                items: [
                    {text: '响应式编程', link: '/microservice/reactive/reactivestream'},
                    {text: '中间件', link: '/microservice/middleware/elasticsearch/ElasticSearchBase'}
                ]
            }
        ],
        sidebar: {
            '/microservice': [
                {
                    title: '响应式编程',
                    // collapsable: true,
                    children: [
                        {title: 'Reactive Stream', path: '/microservice/reactive/ReactiveStream'},
                        {title: 'WebFlux', path: '/microservice/reactive/webflux'}
                    ]
                }, {
                    title: '中间件',
                    // collapsable: true,
                    children: [
                        {
                            title: 'ElasticSearch',
                            collapsable: true,
                            children: [
                                {title: 'ElasticSearch 基础', path: '/microservice/middleware/elasticsearch/ElasticSearchBase'},
                                {title: 'ElasticSearch 实战', path: '/microservice/middleware/elasticsearch/ElasticSearchApp'}
                            ]
                        }, {
                            title: 'Redis',
                            children: [
                                {title: 'Redis 基础', path: '/microservice/middleware/redis/RedisBase'},
                                {title: 'Redis 实战', path: '/microservice/middleware/redis/RedisApp'}
                            ]
                        }
                    ]
                }
            ],
            '/guide': [
                {
                    title: 'Java',
                    collapsable: true,
                    children: [
                        {title: 'Java基础', path: '/guide/interview/Java'},
                        {title: 'JDK8新特性', path: '/guide/interview/JDK8'},
                        {title: 'Java并发', path: '/guide/interview/concurrent'},
                        {title: 'JVM', path: '/guide/interview/JVM'}
                    ]
                },
                {
                    title: '系统设计',
                    children: [
                        {
                            title: '基础',
                            children: [
                                {title: '幂等', path: '/guide/interview/Idempotency'}
                            ]
                        },
                        {
                            title: '开发框架',
                            children: [
                                {title: 'Spring', path: '/guide/interview/Spring'},
                                {title: 'Spring高级', path: '/guide/interview/spriiiiing'},
                                {title: 'SpringMVC', path: '/guide/interview/SpringMVC'},
                                {title: 'MyBatis', path: '/guide/interview/MyBatis'},
                                {title: 'SpringBoot', path: '/guide/interview/SpringBoot'}
                            ]
                        }
                    ]
                },
                {
                    title: '数据库',
                    children: [
                        {title: 'MySQL', path: '/guide/interview/Mysql'},
                        {title: 'Redis', path: '/guide/interview/Redis'},
                        {title: '数据库开发规范', path: '/guide/interview/DatabaseGuidelines'}
                    ]
                },
                {
                    title: '计算机基础',
                    children: [
                        {title: '操作系统', path: '/guide/interview/OS'},
                        {title: '计算机网络', path: '/guide/interview/ComputerNetwork'},
                        {title: '数据结构', path: '/guide/interview/DataStructure'},
                        {title: '代码模板', path: '/guide/interview/CodeTemplate'}
                    ]
                },
                // {
                //     title: '面经',
                //     children: [
                //         { title: '携程', path: 'guide/interview/xiecheng' }
                //         // { title: '华为', path: 'guide/interview/huawei' }
                //     ]
                // },
                {
                    title: '海量数据',
                    children: [
                        {title: '如何从海量数据中找出高频词？', path: '/guide/interview/high_frequency_words'}
                    ]
                },
                {
                    title: '分布式',
                    children: [
                        {
                            title: 'ID生成器',
                            children: [
                                {title: '雪花算法', path: '/guide/interview/SnowFlake'}
                            ]
                        }
                    ]
                }
            ],
            '/OS': [
                {title: '操作系统上', path: '/OS/OS1'},
                {title: '操作系统中', path: '/OS/OS2'},
                {title: '操作系统下', path: '/OS/OS3'}
            ],
            '/designmode': [
                {title: '软件设计原则', path: '/designmode/SoftwareDesignPrinciples'},
                {
                    title: '创建者模式',
                    collapsable: true,
                    children: [
                        {title: '单例模式', path: '/designmode/Singleton'},
                        {title: '工厂模式', path: '/designmode/Factory'},
                        {title: '原型模式', path: '/designmode/Prototype'},
                        {title: '建造者模式', path: '/designmode/Builder'}
                    ]
                },
                {
                    title: '结构型模式',
                    collapsable: true,
                    children: [
                        {title: '适配器模式', path: '/designmode/Adapter'},
                        {title: '代理模式', path: '/designmode/Proxy'}
                    ]
                },
                {
                    title: '行为型模式',
                    collapsable: true,
                    children: [
                        {title: '模板方法模式', path: '/designmode/Template'},
                        {title: '观察者模式', path: '/designmode/Observer'},
                        {title: '策略模式', path: '/designmode/Strategy'}
                    ]
                }
            ],
            '/netty': [
                {
                    title: 'NIO基础',
                    collapsable: true,
                    children: [
                        {title: '三大组件', path: '/netty/nio/three_component'},
                        {title: 'ByteBuffer', path: '/netty/nio/bytebuffer'},
                        {title: '文件编程', path: '/netty/nio/file_programming'},
                        {title: '网络编程', path: '/netty/nio/network_programming'},
                        {title: 'NIO vs. BIO', path: '/netty/nio/NIOvsBIO'}
                    ]
                },
                {
                    title: 'Netty入门',
                    collapsable: true,
                    children: [
                        {title: '概述', path: '/netty/basics/summary'},
                        {title: 'Hello World', path: '/netty/basics/helloworld'},
                        {title: '组件', path: '/netty/basics/component'},
                        {title: '双向通信', path: '/netty/basics/two_way_communication'}
                    ]
                },
                {
                    title: 'Netty进阶',
                    collapsable: true,
                    children: [
                        {title: '粘包与半包', path: '/netty/advance/bag'},
                        {title: '协议的设计与解析', path: '/netty/advance/protocol'},
                        {title: '聊天室案例', path: '/netty/advance/chatroom'}
                    ]
                },
                {
                    title: 'Netty优化与源码',
                    collapsable: true,
                    children: [
                        {title: '优化', path: '/netty/optimization/optimization'},
                        {title: '源码', path: '/netty/optimization/source_code'}
                    ]
                }
            ],
            '/ml': [
                {
                    title: '论文解读',
                    collapsable: true,
                    children: [
                        {title: 'YOLOv3', path: '/ml/YOLOv3'},
                        {title: 'GAN', path: '/ml/GAN'},
                        {title: 'CycleGAN', path: '/ml/CycleGAN'},
                        {title: 'pix2pix', path: '/ml/pix2pix'}
                    ]
                }
            ]
        },
        sidebarDepth: 2,
        searchMaxSuggestions: 10,
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
