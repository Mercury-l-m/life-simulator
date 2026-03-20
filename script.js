class LifeSimulator {
    constructor() {
        this.stats = {
            intelligence: 50,
            health: 80,
            wealth: 10,
            happiness: 50,
            morality: 50,
            charm: 50,
            luck: 50,
            reputation: 0,
            art: 0,
            programming: 0,
            sports: 0
        };
        this.age = 0;
        this.stage = '婴儿期';
        this.events = [];
        this.history = [];
        this.currentEvent = null;
        this.eventIndex = 0;
        this.triggeredEvents = new Set();
        this.branchFlags = {
            educationPath: null,
            careerPath: null,
            relationshipPath: null,
            healthPath: null,
            wealthPath: null,
            moralityPath: null,
            talentPath: null
        };
        this.rebirthCount = 0;
        this.timeProgress = 0;
        this.specialMarks = new Set();
        
        this.initGame();
    }

    initGame() {
        this.loadEvents();
        this.updateStatsDisplay();
        console.log('Initial events loaded:', this.events.length);
        console.log('Initial age:', this.age);
        console.log('Initial stage:', this.stage);
        this.showNextEvent();
    }

    loadEvents() {
        this.events = [
            {
                id: 'e101',
                title: '出生家庭',
                description: '你的人生即将开始，选择你的出生家庭。',
                weight: 10,
                stage: '婴儿期',
                options: [
                    {
                        text: '富裕豪门',
                        effects: { wealth: 50, health: 10, intelligence: 10, charm: 5 },
                        description: '你出生在顶级富豪家庭，从小接受最好的教育和资源。'
                    },
                    {
                        text: '中产家庭',
                        effects: { intelligence: 5, health: 5, wealth: 20, happiness: 10, charm: 3 },
                        description: '你出生在中产家庭，生活舒适，父母重视教育。'
                    },
                    {
                        text: '普通工薪',
                        effects: { intelligence: 3, health: 3, happiness: 5 },
                        description: '你出生在普通家庭，平凡但充满温暖。'
                    },
                    {
                        text: '贫困家庭',
                        effects: { wealth: -20, health: -5, morality: 5 },
                        description: '你出生在贫困家庭，但艰难的环境培养了你的坚韧品格。'
                    },
                    {
                        text: '单亲家庭',
                        effects: { happiness: -5, morality: 5, charm: 2 },
                        description: '你在单亲家庭长大，学会了独立和坚强。'
                    }
                ]
            },
            {
                id: 'e102',
                title: '第一次发烧',
                description: '半夜你突然发高烧，小脸通红，父母焦急万分。他们手忙脚乱地商量对策。',
                weight: 8,
                stage: '婴儿期',
                options: [
                    {
                        text: '立刻去医院急诊',
                        effects: { health: 10, wealth: -10 },
                        description: '父母连夜送你去医院，经过治疗你很快康复了。'
                    },
                    {
                        text: '先吃退烧药观察',
                        effects: { health: -5, intelligence: 2 },
                        description: '父母给你吃了退烧药，虽然有点风险但你挺过来了。'
                    },
                    {
                        text: '用土办法（酒精擦身、捂汗）',
                        effects: { health: -15, morality: 3 },
                        description: '长辈用传统方法帮你降温，虽然不科学但体现了家人的关爱。'
                    }
                ]
            },
            {
                id: 'e103',
                title: '早教启蒙',
                description: '父母开始考虑你的早期教育问题。',
                weight: 7,
                stage: '婴儿期',
                options: [
                    {
                        text: '国际早教中心',
                        effects: { intelligence: 15, wealth: -30, charm: 5 },
                        description: '你在国际化的环境中成长，智力得到全面发展。'
                    },
                    {
                        text: '父母亲自教导',
                        effects: { intelligence: 10, happiness: 15, charm: 3 },
                        description: '父母每天陪你学习，亲子关系非常亲密。'
                    },
                    {
                        text: '传统幼儿园',
                        effects: { intelligence: 5, happiness: 10, sports: 5 },
                        description: '你在普通幼儿园度过了快乐的时光。'
                    },
                    {
                        text: '放养自由成长',
                        effects: { health: 15, happiness: 10, sports: 10 },
                        description: '你有充分的自由玩耍时间，身体健康，性格开朗。'
                    }
                ]
            },
            {
                id: 'e104',
                title: '幼儿园才艺表演',
                description: '幼儿园要举办才艺表演，你准备表演什么？',
                weight: 6,
                stage: '婴儿期',
                options: [
                    {
                        text: '唱歌跳舞',
                        effects: { happiness: 15, charm: 8, art: 5 },
                        description: '你的表演赢得了全场掌声，自信心大增。'
                    },
                    {
                        text: '讲故事',
                        effects: { intelligence: 10, charm: 5 },
                        description: '你讲的故事生动有趣，老师对你赞不绝口。'
                    },
                    {
                        text: '魔术表演',
                        effects: Math.random() > 0.6 ? { happiness: 20, charm: 10 } : { happiness: -5, charm: -5 },
                        description: Math.random() > 0.6 ? '魔术表演非常成功，同学们都很佩服你。' : '魔术失败了，你感到很尴尬。'
                    },
                    {
                        text: '拒绝参加',
                        effects: { happiness: -5 },
                        description: '你选择了低调，但错过了展示自己的机会。'
                    }
                ]
            },
            {
                id: 'e105',
                title: '第一次走路',
                description: '你第一次尝试走路，摇摇晃晃的样子让父母既紧张又开心。',
                weight: 7,
                stage: '婴儿期',
                options: [
                    {
                        text: '勇敢尝试',
                        effects: { health: 10, happiness: 15, charm: 5 },
                        description: '你勇敢地迈出了第一步，虽然摔倒了几次，但最终学会了走路。'
                    },
                    {
                        text: '依赖父母',
                        effects: { happiness: 5, health: -5 },
                        description: '你总是让父母抱着，不愿意自己走路。'
                    },
                    {
                        text: '爬行探索',
                        effects: { intelligence: 10, health: 5 },
                        description: '你更喜欢爬行，这样可以更快地探索周围的世界。'
                    }
                ]
            },
            {
                id: 'e106',
                title: '语言启蒙',
                description: '父母开始教你说话，你会先学会哪个词？',
                weight: 6,
                stage: '婴儿期',
                options: [
                    {
                        text: '爸爸',
                        effects: { intelligence: 8, happiness: 10 },
                        description: '你第一次叫出"爸爸"，爸爸激动得热泪盈眶。'
                    },
                    {
                        text: '妈妈',
                        effects: { intelligence: 8, happiness: 10 },
                        description: '你第一次叫出"妈妈"，妈妈紧紧地抱住了你。'
                    },
                    {
                        text: '不要',
                        effects: { intelligence: 5, charm: -5 },
                        description: '你先学会了拒绝，这让父母有些无奈但觉得很可爱。'
                    },
                    {
                        text: '咿咿呀呀',
                        effects: { intelligence: 3, happiness: 5 },
                        description: '你还在牙牙学语，发出各种可爱的声音。'
                    }
                ]
            },
            {
                id: 'e201',
                title: '小学入学',
                description: '你即将进入小学，父母为你选择学校。',
                weight: 7,
                options: [
                    {
                        text: '重点小学',
                        effects: { intelligence: 15, wealth: -20 },
                        description: '你进入了重点小学，学习氛围很好。'
                    },
                    {
                        text: '普通小学',
                        effects: { happiness: 10, health: 10, sports: 5 },
                        description: '你在普通小学度过了轻松快乐的童年。'
                    },
                    {
                        text: '双语学校',
                        effects: { intelligence: 20, wealth: -30, charm: 5 },
                        description: '你在双语环境中学习，外语能力得到很好的培养。'
                    },
                    {
                        text: '寄宿学校',
                        effects: { intelligence: 10, happiness: -5, charm: 3 },
                        description: '寄宿生活培养了你的独立能力，但思念家人。'
                    }
                ]
            },
            {
                id: 'e202',
                title: '小学竞选班长',
                description: '班级要选举班长，你是否参与竞选？',
                weight: 6,
                options: [
                    {
                        text: '精心准备演讲',
                        effects: { intelligence: 10, happiness: 15, charm: 10, reputation: 5 },
                        description: '你的演讲非常出色，成功当选班长。'
                    },
                    {
                        text: '拉票送礼',
                        effects: { morality: -10, wealth: -15, reputation: -5 },
                        description: '你通过送礼拉票当选，但这种方式让你内心不安。'
                    },
                    {
                        text: '找人代写演讲稿',
                        effects: { intelligence: -5, morality: -5, reputation: -3 },
                        description: '你找人代写了演讲稿，虽然当选但心里不踏实。'
                    },
                    {
                        text: '放弃竞选',
                        effects: {},
                        description: '你选择了低调生活，专注于学习。'
                    }
                ]
            },
            {
                id: 'e203',
                title: '周末兴趣班',
                description: '父母想让你周末参加兴趣班，你选择什么？',
                weight: 8,
                options: [
                    {
                        text: '钢琴班',
                        effects: { intelligence: 15, art: 20, wealth: -20 },
                        description: '音乐的熏陶让你变得更加优雅有气质。'
                    },
                    {
                        text: '绘画班',
                        effects: { intelligence: 10, art: 25, happiness: 15 },
                        description: '你在绘画中找到了乐趣，艺术细胞得到培养。'
                    },
                    {
                        text: '编程班',
                        effects: { intelligence: 20, programming: 25 },
                        description: '编程让你的逻辑思维能力得到极大提升。'
                    },
                    {
                        text: '足球训练',
                        effects: { health: 20, sports: 25, happiness: 15 },
                        description: '运动让你身体健康，结交了很多朋友。'
                    },
                    {
                        text: '围棋班',
                        effects: { intelligence: 15, programming: 10 },
                        description: '围棋培养了你的战略思维能力。'
                    },
                    {
                        text: '拒绝参加',
                        effects: { happiness: 10, health: 10 },
                        description: '你选择了自由玩耍，度过了快乐的周末。'
                    }
                ]
            },
            {
                id: 'e204',
                title: '第一次考试',
                description: '第一次期末考试来临，你会怎么准备？',
                weight: 8,
                options: [
                    {
                        text: '认真复习',
                        effects: { intelligence: 15, happiness: 15, reputation: 5 },
                        description: '努力学习让你取得了优异的成绩。'
                    },
                    {
                        text: '临时抱佛脚',
                        effects: { intelligence: 5, happiness: -5, health: -5 },
                        description: '熬夜复习让你勉强通过了考试。'
                    },
                    {
                        text: '作弊',
                        effects: { morality: -15, reputation: -10 },
                        description: '你作弊通过了考试，但内心充满愧疚。'
                    },
                    {
                        text: '请教老师',
                        effects: { intelligence: 10, happiness: 10, reputation: 3 },
                        description: '老师的指导让你受益匪浅，成绩进步很大。'
                    }
                ]
            },
            {
                id: 'e205',
                title: '结交朋友',
                description: '你在学校遇到了几个同学，想和谁成为朋友？',
                weight: 7,
                options: [
                    {
                        text: '学霸同学',
                        effects: { intelligence: 10, happiness: 10 },
                        description: '和学霸交朋友，你的学习成绩也提高了。'
                    },
                    {
                        text: '体育健将',
                        effects: { health: 15, sports: 10, happiness: 15 },
                        description: '和运动健将一起玩，你的身体变得更棒了。'
                    },
                    {
                        text: '文艺青年',
                        effects: { art: 15, happiness: 15, charm: 5 },
                        description: '和文艺青年在一起，你的审美水平提高了。'
                    },
                    {
                        text: '调皮捣蛋鬼',
                        effects: { happiness: 10, morality: -5, reputation: -5 },
                        description: '和调皮鬼一起玩很开心，但也学会了一些坏习惯。'
                    },
                    {
                        text: '独来独往',
                        effects: { intelligence: 5, happiness: -5 },
                        description: '你喜欢一个人独处，专注于自己的事情。'
                    }
                ]
            },
            {
                id: 'e206',
                title: '零花钱管理',
                description: '父母给了你零花钱，你会怎么使用？',
                weight: 6,
                options: [
                    {
                        text: '全部存起来',
                        effects: { wealth: 10, intelligence: 5 },
                        description: '你养成了储蓄的好习惯。'
                    },
                    {
                        text: '买学习用品',
                        effects: { intelligence: 10, wealth: -5 },
                        description: '你用零花钱买了很多有益的书籍和文具。'
                    },
                    {
                        text: '买零食玩具',
                        effects: { happiness: 15, health: -5, wealth: -10 },
                        description: '你买了很多零食和玩具，吃得开心玩得也开心。'
                    },
                    {
                        text: '帮助同学',
                        effects: { morality: 15, happiness: 10, reputation: 5 },
                        description: '你用零花钱帮助了困难的同学，感到很有意义。'
                    },
                    {
                        text: '抽奖试试运气',
                        effects: this.lotteryEffects(),
                        description: this.lotteryDescription()
                    }
                ]
            },
            {
                id: 'e207',
                title: '参加运动会',
                description: '学校举办运动会，你想参加什么项目？',
                weight: 7,
                options: [
                    {
                        text: '100米短跑',
                        effects: { health: 15, sports: 15, happiness: 10 },
                        description: '你参加了短跑比赛，虽然没有拿奖，但锻炼了身体。'
                    },
                    {
                        text: '跳远',
                        effects: { health: 10, sports: 10, happiness: 5 },
                        description: '你参加了跳远比赛，跳出了不错的成绩。'
                    },
                    {
                        text: '接力赛',
                        effects: { happiness: 15, sports: 5, charm: 5 },
                        description: '你和队友一起参加接力赛，培养了团队精神。'
                    },
                    {
                        text: '当啦啦队',
                        effects: { happiness: 10, charm: 10 },
                        description: '你当啦啦队为同学加油，气氛非常热烈。'
                    },
                    {
                        text: '不参加',
                        effects: { happiness: -5 },
                        description: '你选择不参加运动会，错过了锻炼身体的机会。'
                    }
                ]
            },
            {
                id: 'e208',
                title: '第一次独自在家',
                description: '父母第一次让你独自在家，你会怎么做？',
                weight: 6,
                options: [
                    {
                        text: '认真做作业',
                        effects: { intelligence: 10, happiness: 5 },
                        description: '你利用这段时间完成了作业，父母回来后很满意。'
                    },
                    {
                        text: '打扫房间',
                        effects: { morality: 10, happiness: 5 },
                        description: '你把家里打扫得干干净净，父母回来后非常惊喜。'
                    },
                    {
                        text: '看电视玩游戏',
                        effects: { happiness: 10, intelligence: -5, health: -5 },
                        description: '你一整天都在看电视玩游戏，父母回来后有些失望。'
                    },
                    {
                        text: '邀请朋友来玩',
                        effects: { happiness: 15, charm: 5 },
                        description: '你邀请朋友来家里玩，度过了愉快的一天。'
                    }
                ]
            },
            {
                id: 'e209',
                title: '学习乐器',
                description: '父母想让你学习一种乐器，你选择什么？',
                weight: 7,
                options: [
                    {
                        text: '钢琴',
                        effects: { intelligence: 15, art: 20, happiness: 10 },
                        description: '你开始学习钢琴，音乐让你变得更加优雅。'
                    },
                    {
                        text: '小提琴',
                        effects: { intelligence: 10, art: 15, happiness: 5 },
                        description: '你学习小提琴，虽然一开始很难，但渐渐找到了乐趣。'
                    },
                    {
                        text: '吉他',
                        effects: { art: 15, happiness: 15, charm: 10 },
                        description: '你学习吉他，梦想成为摇滚明星。'
                    },
                    {
                        text: '不学乐器',
                        effects: { happiness: -5 },
                        description: '你对音乐不感兴趣，父母尊重了你的选择。'
                    }
                ]
            },
            {
                id: 'e301',
                title: '初中生活',
                description: '进入初中，你面临新的挑战。',
                weight: 8,
                options: [
                    {
                        text: '努力学习',
                        effects: { intelligence: 20, health: -10, reputation: 10 },
                        description: '你把精力都放在学习上，成绩名列前茅。'
                    },
                    {
                        text: '发展兴趣',
                        effects: { happiness: 20, art: 15, sports: 15 },
                        description: '你在保持学习的同时，发展了自己的兴趣爱好。'
                    },
                    {
                        text: '参加社团',
                        effects: { happiness: 15, charm: 15, reputation: 5 },
                        description: '你参加了多个社团，结交了很多朋友。'
                    },
                    {
                        text: '沉迷游戏',
                        effects: { happiness: 10, intelligence: -10, health: -15 },
                        description: '你沉迷于网络游戏，影响了学习和健康。'
                    },
                    {
                        text: '早恋',
                        effects: { happiness: 20, intelligence: -5, charm: 10 },
                        description: '你开始了初恋，体验了青涩的爱情。'
                    }
                ]
            },
            {
                id: 'e302',
                title: '青春期困惑',
                description: '青春期的你遇到了一些困惑。',
                weight: 7,
                options: [
                    {
                        text: '向父母倾诉',
                        effects: { happiness: 15, morality: 5, charm: 5 },
                        description: '父母的理解和支持让你度过了困惑期。'
                    },
                    {
                        text: '向老师请教',
                        effects: { intelligence: 10, happiness: 10 },
                        description: '老师的指导让你受益匪浅。'
                    },
                    {
                        text: '和朋友聊天',
                        effects: { happiness: 15, charm: 10 },
                        description: '朋友的安慰让你感到温暖。'
                    },
                    {
                        text: '写日记',
                        effects: { intelligence: 5, happiness: 5, art: 5 },
                        description: '写日记帮助你理清了思绪。'
                    },
                    {
                        text: '独自承受',
                        effects: { happiness: -10, health: -5 },
                        description: '你选择了独自面对，感到有些孤独。'
                    }
                ]
            },
            {
                id: 'e303',
                title: '中考冲刺',
                description: '中考前的最后冲刺阶段。',
                weight: 8,
                options: [
                    {
                        text: '全力冲刺',
                        effects: { intelligence: 25, health: -15, reputation: 15 },
                        description: '你废寝忘食地学习，最终考上了重点高中。'
                    },
                    {
                        text: '劳逸结合',
                        effects: { intelligence: 15, health: 5, happiness: 10 },
                        description: '合理安排学习和休息，取得了不错的成绩。'
                    },
                    {
                        text: '压力过大',
                        effects: { intelligence: 5, health: -15, happiness: -15 },
                        description: '巨大的压力让你发挥失常。'
                    },
                    {
                        text: '作弊',
                        effects: Math.random() > 0.3 ? { intelligence: 10 } : { morality: -20, reputation: -20 },
                        description: Math.random() > 0.3 ? '侥幸成功，但内心不安。' : '作弊被发现，受到了处分。'
                    }
                ]
            },
            {
                id: 'e304',
                title: '高中选择',
                description: '中考结束，你选择哪所高中？',
                weight: 7,
                options: [
                    {
                        text: '重点高中',
                        effects: { intelligence: 15, reputation: 10 },
                        description: '你进入了重点高中，学习氛围很好。'
                    },
                    {
                        text: '普通高中',
                        effects: { happiness: 15, health: 10 },
                        description: '你在普通高中度过了轻松的高中生活。'
                    },
                    {
                        text: '职业高中',
                        effects: { programming: 20, sports: 20, wealth: 10 },
                        description: '你选择了职业高中，学习了实用技能。'
                    },
                    {
                        text: '国际高中',
                        effects: { intelligence: 20, wealth: -30, charm: 15 },
                        description: '你进入了国际高中，为出国留学做准备。'
                    }
                ]
            },
            {
                id: 'e305',
                title: '文理分科',
                description: '高中需要选择文科还是理科。',
                weight: 8,
                options: [
                    {
                        text: '文科',
                        effects: { intelligence: 15, art: 10 },
                        description: '文科让你的语言和表达能力得到提升。'
                    },
                    {
                        text: '理科',
                        effects: { intelligence: 15, programming: 10 },
                        description: '理科让你的逻辑思维能力得到锻炼。'
                    },
                    {
                        text: '艺术生',
                        effects: { art: 25, intelligence: -5, happiness: 20 },
                        description: '你选择了艺术道路，找到了自己的兴趣所在。'
                    },
                    {
                        text: '体育生',
                        effects: { sports: 25, health: 15, intelligence: -5 },
                        description: '你成为了体育特长生，身体非常强壮。'
                    },
                    {
                        text: '综合科',
                        effects: { intelligence: 10, health: 5 },
                        description: '你选择了综合发展，各方面都有所涉猎。'
                    }
                ]
            },
            {
                id: 'e306',
                title: '高中恋爱',
                description: '高中阶段，你遇到了心仪的对象。',
                weight: 7,
                options: [
                    {
                        text: '勇敢表白',
                        effects: Math.random() > 0.5 ? { happiness: 25, charm: 15 } : { happiness: -10 },
                        description: Math.random() > 0.5 ? '表白成功，你们开始了甜蜜的恋爱。' : '表白失败，但你学会了勇敢。'
                    },
                    {
                        text: '暗恋',
                        effects: { happiness: 15, art: 10 },
                        description: '默默的暗恋也是一种美好的体验。'
                    },
                    {
                        text: '专注学习',
                        effects: { intelligence: 20, reputation: 15 },
                        description: '你选择专注于学业，为高考做准备。'
                    },
                    {
                        text: '暧昧关系',
                        effects: { happiness: 10, intelligence: -5, charm: 5 },
                        description: '你们保持着暧昧关系，既甜蜜又困扰。'
                    }
                ]
            },
            {
                id: 'e307',
                title: '高考冲刺',
                description: '高考前的最后阶段，你会怎么做？',
                weight: 8,
                options: [
                    {
                        text: '拼命刷题',
                        effects: { intelligence: 25, health: -20, reputation: 20 },
                        description: '你没日没夜地学习，最终在高考中取得了优异成绩。'
                    },
                    {
                        text: '科学备考',
                        effects: { intelligence: 20, health: 5, happiness: 10 },
                        description: '你制定了科学的学习计划，效率很高。'
                    },
                    {
                        text: '心态放松',
                        effects: { happiness: 15, intelligence: 10 },
                        description: '你保持良好的心态，发挥出了正常水平。'
                    },
                    {
                        text: '谈恋爱分心',
                        effects: { intelligence: -10, happiness: 20, charm: 10 },
                        description: '恋爱让你感到幸福，但影响了学习。'
                    },
                    {
                        text: '作弊',
                        effects: Math.random() > 0.2 ? { intelligence: 15 } : { morality: -25, reputation: -25 },
                        description: Math.random() > 0.2 ? '侥幸成功，但内心充满不安。' : '作弊被发现，前途尽毁。'
                    }
                ]
            },
            {
                id: 'e308',
                title: '高考成绩公布',
                description: '高考成绩公布了，根据你的努力和天赋，命运做出了安排...',
                weight: 10,
                options: [
                    {
                        text: '查看结果',
                        effects: {},
                        description: '让我们看看你考上了哪所大学。'
                    }
                ]
            },
            {
                id: 'e309',
                title: '第一次心动',
                description: '班上转来一个新同学，TA坐在你旁边，阳光洒在TA的脸上，你的心跳突然漏了一拍。',
                weight: 7,
                options: [
                    {
                        text: '主动搭讪，交个朋友',
                        effects: { charm: 10, happiness: 15 },
                        description: '你主动和TA打招呼，很快成为了好朋友。'
                    },
                    {
                        text: '默默关注，写进日记',
                        effects: { happiness: 10, art: 10 },
                        description: '你默默地关注着TA，把这份感觉写进了日记。'
                    },
                    {
                        text: '告诉最好的朋友，让TA帮忙',
                        effects: { charm: 5, happiness: 5, reputation: -5 },
                        description: '你告诉了最好的朋友，希望TA能帮你牵线搭桥。'
                    },
                    {
                        text: '专心学习，无视这种感觉',
                        effects: { intelligence: 15, happiness: -5 },
                        description: '你选择专注于学习，把这份感情埋在了心底。'
                    }
                ]
            },
            {
                id: 'e310',
                title: '同学聚会',
                description: '小学同学组织了一次聚会，你会参加吗？',
                weight: 6,
                options: [
                    {
                        text: '积极参加',
                        effects: { happiness: 20, charm: 10, reputation: 5 },
                        description: '你参加了聚会，和同学们聊得很开心，重温了童年时光。'
                    },
                    {
                        text: '礼貌拒绝',
                        effects: { happiness: -5 },
                        description: '你因为学习忙而拒绝了聚会邀请。'
                    },
                    {
                        text: '迟到早退',
                        effects: { happiness: 5, reputation: -5 },
                        description: '你参加了聚会但很早就离开了。'
                    }
                ]
            },
            {
                id: 'e311',
                title: '网络社交',
                description: '你开始使用社交媒体，如何管理你的网络形象？',
                weight: 6,
                options: [
                    {
                        text: '分享学习心得',
                        effects: { intelligence: 5, reputation: 10 },
                        description: '你经常分享学习心得，成为了同学们眼中的学霸。'
                    },
                    {
                        text: '分享生活趣事',
                        effects: { happiness: 10, charm: 10 },
                        description: '你分享生活中的趣事，拥有了很多粉丝。'
                    },
                    {
                        text: '沉迷网络',
                        effects: { intelligence: -10, health: -10, happiness: 5 },
                        description: '你沉迷于网络，影响了学习和健康。'
                    },
                    {
                        text: '不使用社交媒体',
                        effects: { intelligence: 5 },
                        description: '你选择不使用社交媒体，专注于现实生活。'
                    }
                ]
            },
            {
                id: 'e312',
                title: '大学录取',
                description: '根据你的高考成绩和平时表现，你收到了大学录取通知书。',
                weight: 9,
                options: [
                    {
                        text: '接受录取',
                        effects: this.getUniversityEffects(),
                        description: this.getUniversityDescription()
                    }
                ]
            },
            {
                id: 'e401',
                title: '大学生活',
                description: '大学生活丰富多彩，你会怎么度过？',
                weight: 8,
                options: [
                    {
                        text: '刻苦学习',
                        effects: { intelligence: 25, reputation: 15, happiness: 5 },
                        description: '你保持了高中的学习状态，成绩优异。'
                    },
                    {
                        text: '参加社团',
                        effects: { happiness: 25, charm: 20, reputation: 10 },
                        description: '你参加了很多社团活动，结交了很多朋友。'
                    },
                    {
                        text: '打工兼职',
                        effects: { wealth: 20, happiness: 10, reputation: 5 },
                        description: '你通过兼职赚取生活费，减轻了家庭负担。'
                    },
                    {
                        text: '谈恋爱',
                        effects: { happiness: 30, charm: 15, intelligence: -5 },
                        description: '你在大学找到了真爱。'
                    },
                    {
                        text: '沉迷游戏',
                        effects: { happiness: 15, intelligence: -15, health: -10 },
                        description: '你沉迷于游戏，荒废了学业。'
                    },
                    {
                        text: '创业尝试',
                        effects: Math.random() > 0.4 ? { wealth: 30, intelligence: 15 } : { wealth: -10, happiness: -10 },
                        description: Math.random() > 0.4 ? '你的创业项目取得了成功。' : '创业失败，但积累了经验。'
                    }
                ]
            },
            {
                id: 'e402',
                title: '大学毕业',
                description: '大学毕业，你面临人生的重要选择。',
                weight: 9,
                options: [
                    {
                        text: '考研深造',
                        effects: { intelligence: 25, wealth: -20 },
                        description: '你选择了继续深造，学术水平得到提升。'
                    },
                    {
                        text: '出国留学',
                        effects: { intelligence: 25, wealth: -40, charm: 20 },
                        description: '你选择了出国留学，开拓了国际视野。'
                    },
                    {
                        text: '直接工作',
                        effects: { wealth: 25, happiness: 15 },
                        description: '你开始了职业生涯。'
                    },
                    {
                        text: '考公务员',
                        effects: { wealth: 20, happiness: 20, reputation: 15 },
                        description: '你考上了公务员，工作稳定。'
                    },
                    {
                        text: '创业',
                        effects: Math.random() > 0.3 ? { wealth: 50, intelligence: 20 } : { wealth: -30, happiness: -20 },
                        description: Math.random() > 0.3 ? '你的创业公司发展很好。' : '创业失败，需要重新开始。'
                    },
                    {
                        text: 'gap year',
                        effects: { happiness: 25, intelligence: 10, charm: 15 },
                        description: '你选择了间隔年，去旅行和体验生活。'
                    }
                ]
            },
            {
                id: 'e403',
                title: '意外收获',
                description: '大学毕业后，你遇到了一个意外的机会！',
                weight: 7,
                options: [
                    {
                        text: '买彩票试试运气',
                        effects: this.lotteryEffects(),
                        description: this.lotteryDescription()
                    },
                    {
                        text: '参加创业比赛',
                        effects: Math.random() > 0.4 ? { wealth: 40, intelligence: 20 } : { happiness: -10 },
                        description: Math.random() > 0.4 ? '你的创业项目获得了一等奖，赢得了巨额奖金！' : '很遗憾，你的项目没有获奖。'
                    },
                    {
                        text: '投资数字货币',
                        effects: Math.random() > 0.3 ? { wealth: 60 } : { wealth: -30 },
                        description: Math.random() > 0.3 ? '你的投资获得了巨大回报！' : '投资失败，损失了不少钱。'
                    },
                    {
                        text: '保持谨慎',
                        effects: {},
                        description: '你选择了谨慎行事，没有冒险。'
                    }
                ]
            },
            {
                id: 'e404',
                title: '第一份工作',
                description: '你找到了第一份工作。',
                weight: 8,
                options: [
                    {
                        text: '互联网大厂',
                        effects: { wealth: 40, health: -15, intelligence: 15 },
                        description: '高薪但高强度的工作。'
                    },
                    {
                        text: '金融机构',
                        effects: { wealth: 50, intelligence: 10, reputation: 15 },
                        description: '收入很高，但压力也很大。'
                    },
                    {
                        text: '体制内',
                        effects: { wealth: 25, happiness: 20, reputation: 10 },
                        description: '工作稳定，生活安逸。'
                    },
                    {
                        text: '国企',
                        effects: { wealth: 30, happiness: 15 },
                        description: '福利好，工作稳定。'
                    },
                    {
                        text: '外企',
                        effects: { wealth: 35, intelligence: 15, charm: 15 },
                        description: '国际化的工作环境，提升了你的能力。'
                    },
                    {
                        text: '自由职业',
                        effects: { happiness: 25, wealth: 10, charm: 10 },
                        description: '工作时间自由，但收入不稳定。'
                    }
                ]
            },
            {
                id: 'e405',
                title: '大学社团活动',
                description: '大学有很多社团活动，你想参加哪个？',
                weight: 7,
                options: [
                    {
                        text: '学术社团',
                        effects: { intelligence: 20, reputation: 10 },
                        description: '你参加了学术社团，认识了很多优秀的同学。'
                    },
                    {
                        text: '文艺社团',
                        effects: { art: 20, happiness: 15, charm: 10 },
                        description: '你参加了文艺社团，展示了自己的才艺。'
                    },
                    {
                        text: '体育社团',
                        effects: { health: 20, sports: 20, happiness: 15 },
                        description: '你参加了体育社团，身体变得更加强壮。'
                    },
                    {
                        text: '创业社团',
                        effects: { intelligence: 15, wealth: 10, reputation: 5 },
                        description: '你参加了创业社团，学习了很多商业知识。'
                    },
                    {
                        text: '不参加社团',
                        effects: { intelligence: 5 },
                        description: '你专注于学习，没有参加任何社团。'
                    }
                ]
            },
            {
                id: 'e406',
                title: '出国留学机会',
                description: '学校提供了出国留学的机会，你会申请吗？',
                weight: 6,
                options: [
                    {
                        text: '积极申请',
                        effects: { intelligence: 20, wealth: -30, charm: 20, reputation: 15 },
                        description: '你成功申请到了出国留学的机会，开拓了国际视野。'
                    },
                    {
                        text: '放弃机会',
                        effects: { wealth: 10 },
                        description: '你选择留在国内发展。'
                    }
                ]
            },
            {
                id: 'e407',
                title: '大学实习',
                description: '你获得了实习机会，选择哪家公司？',
                weight: 7,
                options: [
                    {
                        text: '知名企业',
                        effects: { intelligence: 15, reputation: 20, wealth: 10 },
                        description: '你在知名企业实习，积累了宝贵的工作经验。'
                    },
                    {
                        text: '创业公司',
                        effects: { intelligence: 10, wealth: 5, happiness: 10 },
                        description: '你在创业公司实习，学到了很多实用技能。'
                    },
                    {
                        text: '政府机构',
                        effects: { reputation: 15, wealth: 8, happiness: 5 },
                        description: '你在政府机构实习，了解了公共服务的运作。'
                    },
                    {
                        text: '不实习',
                        effects: { intelligence: 5 },
                        description: '你专注于学业，没有参加实习。'
                    }
                ]
            },
            {
                id: 'e501',
                title: '职场人际关系',
                description: '工作中，你如何处理人际关系？',
                weight: 7,
                options: [
                    {
                        text: '积极社交',
                        effects: { happiness: 20, charm: 15, reputation: 10 },
                        description: '你和同事们相处得很好。'
                    },
                    {
                        text: '保持距离',
                        effects: { intelligence: 10, happiness: -5 },
                        description: '你专注于工作，和同事保持适当距离。'
                    },
                    {
                        text: '巴结领导',
                        effects: { wealth: 15, morality: -15, reputation: -5 },
                        description: '你通过巴结领导获得了晋升机会。'
                    },
                    {
                        text: '拉帮结派',
                        effects: { happiness: 10, morality: -10, reputation: -5 },
                        description: '你加入了小团体，在公司中有了靠山。'
                    },
                    {
                        text: '埋头苦干',
                        effects: { intelligence: 15, happiness: -5, reputation: 10 },
                        description: '你专注于工作，靠实力赢得尊重。'
                    }
                ]
            },
            {
                id: 'e502',
                title: '恋爱婚姻',
                description: '工作后，你遇到了人生伴侣。',
                weight: 8,
                options: [
                    {
                        text: '相亲结婚',
                        effects: { happiness: 20, wealth: 15, charm: 10 },
                        description: '通过相亲找到了合适的伴侣。'
                    },
                    {
                        text: '自由恋爱',
                        effects: { happiness: 30, charm: 15 },
                        description: '你和心爱的人走进了婚姻殿堂。'
                    },
                    {
                        text: '闪婚',
                        effects: Math.random() > 0.4 ? { happiness: 25 } : { happiness: -20 },
                        description: Math.random() > 0.4 ? '闪婚让你们的生活充满激情。' : '仓促的婚姻带来了很多矛盾。'
                    },
                    {
                        text: '晚婚',
                        effects: { intelligence: 15, happiness: -5, wealth: 20 },
                        description: '你专注于事业，晚婚但找到了合适的伴侣。'
                    },
                    {
                        text: '不婚主义',
                        effects: { happiness: -10, wealth: 25, charm: 5 },
                        description: '你选择了单身生活，专注于自己的事业。'
                    },
                    {
                        text: '丁克家庭',
                        effects: { happiness: 20, wealth: 20 },
                        description: '你和伴侣选择了不要孩子，享受二人世界。'
                    }
                ]
            },
            {
                id: 'e503',
                title: '购房决策',
                description: '你考虑购买房产。',
                weight: 7,
                options: [
                    {
                        text: '全款买房',
                        effects: { wealth: -50, happiness: 25 },
                        description: '你全款购买了房子，没有房贷压力。'
                    },
                    {
                        text: '贷款买房',
                        effects: { wealth: -20, happiness: 20 },
                        description: '你贷款购买了房子，有一定的还款压力。'
                    },
                    {
                        text: '租房生活',
                        effects: { wealth: 10, happiness: -5 },
                        description: '你选择租房，生活更加自由。'
                    },
                    {
                        text: '投资房产',
                        effects: Math.random() > 0.5 ? { wealth: 40 } : { wealth: -30 },
                        description: Math.random() > 0.5 ? '你的房产投资升值了。' : '房产投资失败，损失了钱。'
                    }
                ]
            },
            {
                id: 'e504',
                title: '投资选择',
                description: '你有了一些积蓄，考虑投资。',
                weight: 7,
                options: [
                    {
                        text: '股票投资',
                        effects: Math.random() > 0.5 ? { wealth: 50 } : { wealth: -40 },
                        description: Math.random() > 0.5 ? '你的股票投资赚了很多钱。' : '股票投资亏损严重。'
                    },
                    {
                        text: '基金理财',
                        effects: Math.random() > 0.6 ? { wealth: 30 } : { wealth: -10 },
                        description: Math.random() > 0.6 ? '基金理财收益不错。' : '基金收益不如预期。'
                    },
                    {
                        text: '创业投资',
                        effects: Math.random() > 0.4 ? { wealth: 60, intelligence: 20 } : { wealth: -40 },
                        description: Math.random() > 0.4 ? '你的创业投资很成功。' : '创业投资失败了。'
                    },
                    {
                        text: '保守储蓄',
                        effects: { wealth: 10 },
                        description: '你选择了保守储蓄，虽然收益不高但很安全。'
                    },
                    {
                        text: '投资自己',
                        effects: { intelligence: 25, wealth: -20 },
                        description: '你用积蓄学习新技能，提升了自己。'
                    },
                    {
                        text: '买张彩票',
                        effects: this.lotteryEffects(),
                        description: this.lotteryDescription()
                    }
                ]
            },
            {
                id: 'e505',
                title: '职场晋升',
                description: '公司有晋升机会，你会怎么做？',
                weight: 8,
                options: [
                    {
                        text: '努力工作争取',
                        effects: { intelligence: 15, wealth: 30, happiness: 20, reputation: 15 },
                        description: '通过努力工作，你成功晋升了。'
                    },
                    {
                        text: '拉关系走后门',
                        effects: { wealth: 20, morality: -20, reputation: -10 },
                        description: '你通过不正当手段获得了晋升。'
                    },
                    {
                        text: '主动争取',
                        effects: { intelligence: 10, wealth: 20, happiness: 15 },
                        description: '你主动申请并获得了晋升机会。'
                    },
                    {
                        text: '顺其自然',
                        effects: {},
                        description: '你选择了顺其自然，没有得到晋升。'
                    },
                    {
                        text: '跳槽',
                        effects: Math.random() > 0.6 ? { wealth: 40 } : { wealth: -10, happiness: -10 },
                        description: Math.random() > 0.6 ? '你跳槽到更好的公司，待遇提高了。' : '跳槽后发现新公司并不理想。'
                    }
                ]
            },
            {
                id: 'e506',
                title: '子女教育',
                description: '你有了孩子，如何教育？',
                weight: 7,
                options: [
                    {
                        text: '精英教育',
                        effects: { intelligence: 20, wealth: -30, happiness: -5 },
                        description: '你对孩子要求严格，希望他能出人头地。'
                    },
                    {
                        text: '快乐教育',
                        effects: { happiness: 25, intelligence: 10 },
                        description: '你注重孩子的快乐成长，培养他的兴趣爱好。'
                    },
                    {
                        text: '放养教育',
                        effects: { happiness: 20, intelligence: -5, health: 10 },
                        description: '你给孩子充分的自由，让他自由发展。'
                    },
                    {
                        text: '虎妈狼爸',
                        effects: { intelligence: 15, happiness: -15 },
                        description: '你对孩子非常严格，家庭压力很大。'
                    },
                    {
                        text: '国际教育',
                        effects: { intelligence: 25, wealth: -40, charm: 15 },
                        description: '你送孩子出国留学，培养国际视野。'
                    }
                ]
            },
            {
                title: '零花钱管理',
                description: '父母给了你零花钱，你会怎么使用？',
                options: [
                    {
                        text: '全部存起来',
                        effects: { wealth: 2, intelligence: 1 },
                        description: '你养成了储蓄的好习惯。'
                    },
                    {
                        text: '买学习用品',
                        effects: { intelligence: 2, wealth: -1 },
                        description: '你用零花钱买了很多有益的书籍和文具。'
                    },
                    {
                        text: '买零食玩具',
                        effects: { happiness: 2, health: -1 },
                        description: '你买了很多零食和玩具，吃得开心玩得也开心。'
                    },
                    {
                        text: '帮助同学',
                        effects: { morality: 3, happiness: 1 },
                        description: '你用零花钱帮助了困难的同学，感到很有意义。'
                    },
                    {
                        text: '抽奖试试运气',
                        effects: this.lotteryEffects(),
                        description: this.lotteryDescription()
                    }
                ]
            },
            {
                id: 'e601',
                title: '退休规划',
                description: '你开始考虑退休后的生活。',
                weight: 8,
                options: [
                    {
                        text: '提前退休',
                        effects: { happiness: 25, wealth: -20 },
                        description: '你提前退休，享受悠闲的生活。'
                    },
                    {
                        text: '正常退休',
                        effects: { happiness: 20, wealth: 15 },
                        description: '你按正常年龄退休，开始了退休生活。'
                    },
                    {
                        text: '延迟退休',
                        effects: { wealth: 30, health: -10 },
                        description: '你选择延迟退休，继续发挥余热。'
                    },
                    {
                        text: '退休后创业',
                        effects: Math.random() > 0.5 ? { wealth: 40, happiness: 20 } : { wealth: -20, happiness: -10 },
                        description: Math.random() > 0.5 ? '退休后创业很成功。' : '退休后创业失败了。'
                    }
                ]
            },
            {
                id: 'e602',
                title: '退休生活',
                description: '终于到了退休的年纪。',
                weight: 8,
                options: [
                    {
                        text: '环游世界',
                        effects: { happiness: 30, wealth: -40, charm: 15 },
                        description: '你环游世界，见识了不同的文化和风景。'
                    },
                    {
                        text: '含饴弄孙',
                        effects: { happiness: 25, health: -5 },
                        description: '你享受着天伦之乐，陪伴孙子孙女成长。'
                    },
                    {
                        text: '老年大学',
                        effects: { intelligence: 15, happiness: 20, charm: 10 },
                        description: '你在上老年大学，学习新知识，结交新朋友。'
                    },
                    {
                        text: '社区服务',
                        effects: { morality: 25, happiness: 20, reputation: 15 },
                        description: '你参与社区服务，帮助他人，感到很有意义。'
                    },
                    {
                        text: '养生修炼',
                        effects: { health: 20, happiness: 15 },
                        description: '你注重养生，身体健康，心态平和。'
                    },
                    {
                        text: '宅家休养',
                        effects: { happiness: 15, health: 10 },
                        description: '你选择在家休养，过着平静的生活。'
                    }
                ]
            },
            {
                id: 'e603',
                title: '健康危机',
                description: '你遇到了严重的健康危机。',
                weight: 7,
                options: [
                    {
                        text: '积极治疗',
                        effects: { health: 20, wealth: -40 },
                        description: '你积极接受治疗，健康状况得到改善。'
                    },
                    {
                        text: '保守治疗',
                        effects: { health: 10, happiness: 10 },
                        description: '你选择了保守治疗，注重生活质量。'
                    },
                    {
                        text: '放弃治疗',
                        effects: { health: -50, happiness: -10 },
                        description: '你选择了平静地面对生命的终点。'
                    },
                    {
                        text: '寻求偏方',
                        effects: Math.random() > 0.3 ? { health: 15 } : { health: -20 },
                        description: Math.random() > 0.3 ? '偏方居然有效，你康复了。' : '偏方加重了病情。'
                    }
                ]
            },
            {
                id: 'e507',
                title: '中年危机',
                description: '人到中年，你感到有些迷茫和焦虑。',
                weight: 7,
                options: [
                    {
                        text: '寻求心理咨询',
                        effects: { happiness: 20, intelligence: 5 },
                        description: '你寻求了专业心理咨询，找到了内心的平静。'
                    },
                    {
                        text: '培养新爱好',
                        effects: { happiness: 15, art: 10 },
                        description: '你培养了新的爱好，生活变得更加充实。'
                    },
                    {
                        text: '努力工作',
                        effects: { intelligence: 10, wealth: 15, health: -10 },
                        description: '你把精力投入到工作中，取得了不错的成绩。'
                    },
                    {
                        text: '逃避现实',
                        effects: { happiness: -10, health: -15 },
                        description: '你选择逃避现实，沉迷于酒精和游戏。'
                    }
                ]
            },
            {
                id: 'e508',
                title: '子女叛逆',
                description: '你的孩子进入了叛逆期，经常和你顶嘴。',
                weight: 6,
                options: [
                    {
                        text: '耐心沟通',
                        effects: { happiness: 10, morality: 10 },
                        description: '你耐心地和孩子沟通，逐渐化解了矛盾。'
                    },
                    {
                        text: '严厉管教',
                        effects: { happiness: -15, morality: -5 },
                        description: '你采取了严厉的管教方式，导致亲子关系紧张。'
                    },
                    {
                        text: '寻求帮助',
                        effects: { happiness: 5, intelligence: 5 },
                        description: '你寻求了专业人士的帮助，学习了更好的教育方法。'
                    },
                    {
                        text: '放任不管',
                        effects: { happiness: -10, morality: -10 },
                        description: '你选择放任不管，孩子的行为变得更加叛逆。'
                    }
                ]
            },
            {
                id: 'e509',
                title: '职业转型',
                description: '你考虑换一份工作，尝试新的职业方向。',
                weight: 7,
                options: [
                    {
                        text: '转行到新领域',
                        effects: { intelligence: 15, wealth: -10, happiness: 10 },
                        description: '你成功转型到了新的领域，开启了职业生涯的新篇章。'
                    },
                    {
                        text: '继续当前工作',
                        effects: { wealth: 10 },
                        description: '你选择继续在当前岗位工作。'
                    },
                    {
                        text: '创业',
                        effects: Math.random() > 0.4 ? { wealth: 40, intelligence: 15 } : { wealth: -20, happiness: -15 },
                        description: Math.random() > 0.4 ? '你的创业项目取得了成功。' : '创业失败，但积累了宝贵经验。'
                    }
                ]
            },
            {
                id: 'e604',
                title: '养老金规划',
                description: '你开始规划自己的养老金。',
                weight: 6,
                options: [
                    {
                        text: '购买商业保险',
                        effects: { wealth: -20, happiness: 10 },
                        description: '你购买了商业养老保险，为退休生活做好了准备。'
                    },
                    {
                        text: '投资股票基金',
                        effects: Math.random() > 0.5 ? { wealth: 30 } : { wealth: -15 },
                        description: Math.random() > 0.5 ? '你的投资获得了不错的回报。' : '投资亏损，影响了退休计划。'
                    },
                    {
                        text: '依靠子女',
                        effects: { happiness: -5, morality: -5 },
                        description: '你打算依靠子女养老。'
                    },
                    {
                        text: '顺其自然',
                        effects: { happiness: -10 },
                        description: '你没有做任何规划，走一步算一步。'
                    }
                ]
            },
            {
                id: 'e605',
                title: '老年社交',
                description: '退休后，你如何丰富自己的社交生活？',
                weight: 7,
                options: [
                    {
                        text: '参加老年活动中心',
                        effects: { happiness: 20, charm: 10, reputation: 5 },
                        description: '你参加了老年活动中心，结交了很多朋友。'
                    },
                    {
                        text: '旅游',
                        effects: { happiness: 15, wealth: -20, charm: 5 },
                        description: '你经常出去旅游，见识了很多美丽的风景。'
                    },
                    {
                        text: '宅在家里',
                        effects: { health: -10, happiness: -10 },
                        description: '你选择宅在家里，很少与人交流。'
                    },
                    {
                        text: '做志愿者',
                        effects: { happiness: 15, morality: 20, reputation: 15 },
                        description: '你成为了志愿者，帮助了很多需要帮助的人。'
                    }
                ]
            },
            {
                id: 'e701',
                title: '生命回顾',
                description: '躺在病床上，你回顾自己的一生。',
                weight: 8,
                options: [
                    {
                        text: '无怨无悔',
                        effects: { happiness: 20, morality: 10 },
                        description: '你觉得自己的一生过得很充实，没有什么遗憾。'
                    },
                    {
                        text: '充满遗憾',
                        effects: { happiness: -20 },
                        description: '你觉得自己的一生有很多遗憾，没有好好珍惜。'
                    },
                    {
                        text: '感恩生活',
                        effects: { happiness: 15, morality: 15 },
                        description: '你感恩生活给予的一切，心态平和。'
                    }
                ]
            },
            {
                id: 'e702',
                title: '遗产分配',
                description: '你需要考虑如何分配自己的遗产。',
                weight: 7,
                options: [
                    {
                        text: '平均分配',
                        effects: { morality: 15, happiness: 10 },
                        description: '你将遗产平均分配给子女，家庭和睦。'
                    },
                    {
                        text: '捐赠慈善',
                        effects: { morality: 25, reputation: 20 },
                        description: '你将大部分遗产捐赠给慈善事业，帮助了很多人。'
                    },
                    {
                        text: '留给最孝顺的子女',
                        effects: { morality: -10, happiness: -5 },
                        description: '你将遗产留给了最孝顺的子女，引起了其他子女的不满。'
                    },
                    {
                        text: '设立教育基金',
                        effects: { intelligence: 10, morality: 20, reputation: 15 },
                        description: '你设立了教育基金，帮助贫困学生完成学业。'
                    }
                ]
            },
            {
                id: 'e703',
                title: '最后的愿望',
                description: '你有什么最后的愿望？',
                weight: 6,
                options: [
                    {
                        text: '陪伴家人',
                        effects: { happiness: 15, morality: 10 },
                        description: '你选择陪伴家人度过最后的时光。'
                    },
                    {
                        text: '完成未竟事业',
                        effects: { intelligence: 10, happiness: 5 },
                        description: '你努力完成了自己的未竟事业。'
                    },
                    {
                        text: '环游世界',
                        effects: { happiness: 20, wealth: -30 },
                        description: '你用最后的时间环游世界，实现了自己的梦想。'
                    },
                    {
                        text: '平静离世',
                        effects: { happiness: 10 },
                        description: '你选择平静地面对死亡，没有太多的遗憾。'
                    }
                ]
            },
            {
                id: 'e704',
                title: '孙辈教育',
                description: '你的孙辈来探望你，你想对他们说些什么？',
                weight: 7,
                options: [
                    {
                        text: '传授人生经验',
                        effects: { intelligence: 10, happiness: 15 },
                        description: '你向孙辈传授了自己的人生经验和智慧。'
                    },
                    {
                        text: '鼓励追求梦想',
                        effects: { happiness: 15, charm: 10 },
                        description: '你鼓励孙辈勇敢追求自己的梦想。'
                    },
                    {
                        text: '讲述家族历史',
                        effects: { intelligence: 5, morality: 10 },
                        description: '你向孙辈讲述了家族的历史和传统。'
                    },
                    {
                        text: '给予物质支持',
                        effects: { wealth: -15, happiness: 10 },
                        description: '你给孙辈一些物质上的支持。'
                    }
                ]
            },
            {
                id: 'e408',
                title: '校园恋爱',
                description: '在大学期间，你遇到了心仪的对象。',
                weight: 7,
                options: [
                    {
                        text: '勇敢表白',
                        effects: Math.random() > 0.5 ? { happiness: 25, charm: 15 } : { happiness: -10 },
                        description: Math.random() > 0.5 ? '表白成功，你们开始了甜蜜的校园恋情。' : '表白失败，但你学会了勇敢。'
                    },
                    {
                        text: '慢慢发展',
                        effects: { happiness: 15, charm: 10 },
                        description: '你们从朋友开始，慢慢发展成恋人。'
                    },
                    {
                        text: '专注学业',
                        effects: { intelligence: 20 },
                        description: '你选择专注于学业，暂时不考虑恋爱。'
                    },
                    {
                        text: '保持暧昧',
                        effects: { happiness: 10, charm: 5 },
                        description: '你们保持着暧昧关系，既甜蜜又有些困扰。'
                    }
                ]
            },
            {
                id: 'e409',
                title: '学术研究',
                description: '你有机会参与重要的学术研究项目。',
                weight: 6,
                options: [
                    {
                        text: '积极参与',
                        effects: { intelligence: 25, reputation: 20 },
                        description: '你参与了重要的学术研究，发表了高水平论文。'
                    },
                    {
                        text: '协助导师',
                        effects: { intelligence: 15, reputation: 10 },
                        description: '你协助导师完成研究，学到了很多知识。'
                    },
                    {
                        text: '专注课程',
                        effects: { intelligence: 10 },
                        description: '你选择专注于课程学习。'
                    }
                ]
            },
            {
                id: 'e510',
                title: '公司裁员',
                description: '公司面临经济危机，开始裁员。',
                weight: 6,
                options: [
                    {
                        text: '主动加班表现',
                        effects: { intelligence: 10, health: -15, wealth: 15 },
                        description: '你通过加班表现保住了工作，但影响了健康。'
                    },
                    {
                        text: '寻找新工作',
                        effects: { intelligence: 5, wealth: -5, happiness: -10 },
                        description: '你开始寻找新的工作机会。'
                    },
                    {
                        text: '接受裁员',
                        effects: { wealth: 25, happiness: -15 },
                        description: '你接受了裁员，获得了一笔赔偿金。'
                    },
                    {
                        text: '创业',
                        effects: Math.random() > 0.4 ? { wealth: 50, intelligence: 20 } : { wealth: -20, happiness: -20 },
                        description: Math.random() > 0.4 ? '你抓住机会创业成功。' : '创业失败，需要重新开始。'
                    }
                ]
            },
            {
                id: 'e511',
                title: '健康体检',
                description: '公司组织了年度体检，你发现了一些健康问题。',
                weight: 7,
                options: [
                    {
                        text: '积极治疗',
                        effects: { health: 15, wealth: -20 },
                        description: '你积极接受治疗，健康状况得到改善。'
                    },
                    {
                        text: '调整生活习惯',
                        effects: { health: 10, happiness: 5 },
                        description: '你调整了生活习惯，注重健康。'
                    },
                    {
                        text: '忽视问题',
                        effects: { health: -20, happiness: -10 },
                        description: '你忽视了健康问题，情况变得更糟。'
                    }
                ]
            },
            {
                id: 'e606',
                title: '老年疾病',
                description: '随着年龄增长，你患上了一些老年疾病。',
                weight: 6,
                options: [
                    {
                        text: '积极治疗',
                        effects: { health: 15, wealth: -30 },
                        description: '你积极接受治疗，控制了病情。'
                    },
                    {
                        text: '家庭护理',
                        effects: { happiness: 15, wealth: -15 },
                        description: '家人精心照顾你，生活质量得到保障。'
                    },
                    {
                        text: '养老院',
                        effects: { happiness: -10, wealth: -25 },
                        description: '你住进了养老院，得到了专业的护理。'
                    }
                ]
            },
            {
                id: 'e705',
                title: '最后的告别',
                description: '生命即将走到尽头，你想对家人说些什么？',
                weight: 8,
                options: [
                    {
                        text: '表达爱意',
                        effects: { happiness: 20, morality: 15 },
                        description: '你向家人表达了深深的爱意和感激。'
                    },
                    {
                        text: '叮嘱后代',
                        effects: { intelligence: 10, happiness: 10 },
                        description: '你叮嘱后代要好好生活，传承家族精神。'
                    },
                    {
                        text: '平静离开',
                        effects: { happiness: 15 },
                        description: '你平静地离开了这个世界，没有太多遗憾。'
                    }
                ]
            },
            {
                id: 'e706',
                title: '人生回忆录',
                description: '你决定写一本回忆录，记录自己的一生。',
                weight: 7,
                options: [
                    {
                        text: '详细记录',
                        effects: { intelligence: 15, art: 20, reputation: 15 },
                        description: '你详细记录了自己的人生经历，成为了畅销书。'
                    },
                    {
                        text: '简单记录',
                        effects: { intelligence: 5, happiness: 10 },
                        description: '你简单记录了一些重要的人生瞬间。'
                    },
                    {
                        text: '不写回忆录',
                        effects: { happiness: -5 },
                        description: '你觉得没有必要写回忆录。'
                    }
                ]
            },
            {
                id: 'e313',
                title: '天才少年',
                description: '你展现出了惊人的天赋，被称为天才少年。',
                weight: 5,
                conditions: { intelligence: 80 },
                requiredEvents: ['e204'],
                options: [
                    {
                        text: '参加天才班',
                        effects: { intelligence: 20, reputation: 25 },
                        description: '你进入了天才班，接受特殊教育。'
                    },
                    {
                        text: '保持低调',
                        effects: { intelligence: 10, happiness: 5 },
                        description: '你选择保持低调，和普通同学一样学习。'
                    }
                ]
            },
            {
                id: 'e410',
                title: '创业机会',
                description: '你发现了一个绝佳的创业机会。',
                weight: 6,
                conditions: { intelligence: 70, wealth: 30 },
                requiredEvents: ['e407'],
                options: [
                    {
                        text: '全力创业',
                        effects: Math.random() > 0.5 ? { wealth: 100, intelligence: 15, reputation: 30 } : { wealth: -50, happiness: -20 },
                        description: Math.random() > 0.5 ? '你的创业项目取得了巨大成功！' : '创业失败，损失惨重。'
                    },
                    {
                        text: '兼职创业',
                        effects: { wealth: 30, intelligence: 10, happiness: 5 },
                        description: '你一边工作一边创业，风险较小。'
                    },
                    {
                        text: '放弃机会',
                        effects: { happiness: -10 },
                        description: '你放弃了这个创业机会，继续原来的生活。'
                    }
                ]
            },
            {
                id: 'e512',
                title: '成为CEO',
                description: '你有机会成为公司的CEO。',
                weight: 5,
                conditions: { intelligence: 85, reputation: 70, wealth: 50 },
                requiredEvents: ['e505'],
                options: [
                    {
                        text: '接受任命',
                        effects: { wealth: 50, intelligence: 15, reputation: 25, health: -20 },
                        description: '你成为了公司CEO，肩负起重大责任。'
                    },
                    {
                        text: '推荐他人',
                        effects: { reputation: 15, happiness: 10 },
                        description: '你推荐了更合适的人选。'
                    }
                ]
            },
            {
                id: 'e607',
                title: '慈善家',
                description: '你有机会成为著名的慈善家。',
                weight: 5,
                conditions: { wealth: 100, morality: 80 },
                options: [
                    {
                        text: '成立基金会',
                        effects: { wealth: -50, morality: 30, reputation: 40 },
                        description: '你成立了慈善基金会，帮助了无数人。'
                    },
                    {
                        text: '匿名捐赠',
                        effects: { wealth: -30, morality: 20 },
                        description: '你匿名捐赠了一大笔钱。'
                    }
                ]
            },
            {
                id: 'e314',
                title: '体育明星',
                description: '你在体育方面展现出了非凡的天赋。',
                weight: 4,
                conditions: { sports: 80, health: 85 },
                requiredEvents: ['e207'],
                options: [
                    {
                        text: '专业训练',
                        effects: { sports: 20, health: 10, reputation: 25 },
                        description: '你开始专业训练，成为了体育明星。'
                    },
                    {
                        text: '业余爱好',
                        effects: { sports: 10, happiness: 15 },
                        description: '你将体育作为业余爱好。'
                    }
                ]
            },
            {
                id: 'e411',
                title: '艺术大师',
                description: '你的艺术作品受到了广泛认可。',
                weight: 4,
                conditions: { art: 85, intelligence: 70 },
                requiredEvents: ['e203'],
                options: [
                    {
                        text: '举办画展',
                        effects: { art: 15, reputation: 30, wealth: 40 },
                        description: '你举办了个人画展，获得了巨大成功。'
                    },
                    {
                        text: '继续创作',
                        effects: { art: 10, happiness: 20 },
                        description: '你继续专注于创作。'
                    }
                ]
            },
            {
                id: 'e513',
                title: '医学突破',
                description: '你在医学研究方面取得了重大突破。',
                weight: 3,
                conditions: { intelligence: 90, morality: 85 },
                requiredEvents: ['e409'],
                options: [
                    {
                        text: '发表论文',
                        effects: { intelligence: 20, reputation: 40, morality: 15 },
                        description: '你发表了重要论文，为医学事业做出了巨大贡献。'
                    },
                    {
                        text: '申请专利',
                        effects: { wealth: 60, intelligence: 10, reputation: 25 },
                        description: '你申请了专利，获得了丰厚的回报。'
                    }
                ]
            },
            {
                id: 'e210',
                title: '绘画比赛',
                description: '学校举办绘画比赛，你决定参加。',
                weight: 6,
                options: [
                    {
                        text: '认真准备',
                        effects: { art: 25, intelligence: 10, happiness: 15 },
                        description: '你认真准备了作品，获得了一等奖！'
                    },
                    {
                        text: '随意发挥',
                        effects: { art: 10, happiness: 5 },
                        description: '你随意画了一幅，获得了参与奖。'
                    },
                    {
                        text: '放弃参加',
                        effects: { happiness: -5 },
                        description: '你放弃了参加比赛的机会。'
                    }
                ]
            },
            {
                id: 'e315',
                title: '编程竞赛',
                description: '学校举办编程竞赛，你有机会展示自己的编程技能。',
                weight: 6,
                options: [
                    {
                        text: '参加竞赛',
                        effects: { programming: 25, intelligence: 15, reputation: 20 },
                        description: '你在编程竞赛中获得了优异成绩。'
                    },
                    {
                        text: '学习编程',
                        effects: { programming: 15, intelligence: 10 },
                        description: '你开始学习编程，为未来做准备。'
                    },
                    {
                        text: '不感兴趣',
                        effects: {},
                        description: '你对编程不感兴趣。'
                    }
                ]
            },
            {
                id: 'e412',
                title: '音乐创作',
                description: '你开始尝试音乐创作。',
                weight: 5,
                options: [
                    {
                        text: '创作歌曲',
                        effects: { art: 20, happiness: 20, charm: 15 },
                        description: '你创作的歌曲受到了大家的喜爱。'
                    },
                    {
                        text: '学习乐器',
                        effects: { art: 15, intelligence: 5 },
                        description: '你开始学习乐器，培养音乐素养。'
                    },
                    {
                        text: '只是爱好',
                        effects: { art: 5, happiness: 10 },
                        description: '你将音乐作为业余爱好。'
                    }
                ]
            },
            {
                id: 'e514',
                title: '体育训练',
                description: '你开始进行专业的体育训练。',
                weight: 5,
                options: [
                    {
                        text: '专业训练',
                        effects: { sports: 25, health: 15, reputation: 20 },
                        description: '你通过专业训练，体育水平得到了极大提升。'
                    },
                    {
                        text: '业余锻炼',
                        effects: { sports: 10, health: 10, happiness: 10 },
                        description: '你坚持业余锻炼，保持身体健康。'
                    },
                    {
                        text: '放弃锻炼',
                        effects: { health: -10 },
                        description: '你放弃了体育锻炼。'
                    }
                ]
            },
            {
                id: 'e413',
                title: '写作比赛',
                description: '全国写作比赛开始了，你想参加吗？',
                weight: 6,
                options: [
                    {
                        text: '参加比赛',
                        effects: { art: 20, intelligence: 15, reputation: 15 },
                        description: '你的作品获得了奖项，得到了认可。'
                    },
                    {
                        text: '练习写作',
                        effects: { art: 10, intelligence: 5 },
                        description: '你开始练习写作，提升自己的写作能力。'
                    },
                    {
                        text: '不参加',
                        effects: {},
                        description: '你选择不参加比赛。'
                    }
                ]
            },
            {
                id: 'e608',
                title: '手工艺制作',
                description: '你开始学习手工艺制作。',
                weight: 5,
                options: [
                    {
                        text: '学习陶艺',
                        effects: { art: 15, happiness: 15 },
                        description: '你学习陶艺，制作出了精美的作品。'
                    },
                    {
                        text: '学习绘画',
                        effects: { art: 20, intelligence: 5 },
                        description: '你重新学习绘画，丰富了退休生活。'
                    },
                    {
                        text: '学习书法',
                        effects: { art: 15, intelligence: 10 },
                        description: '你学习书法，修身养性。'
                    }
                ]
            },
            {
                id: 'e414',
                title: '摄影爱好',
                description: '你开始学习摄影。',
                weight: 5,
                options: [
                    {
                        text: '专业学习',
                        effects: { art: 20, happiness: 15, charm: 10 },
                        description: '你成为了专业摄影师，作品获得了奖项。'
                    },
                    {
                        text: '业余爱好',
                        effects: { art: 10, happiness: 10 },
                        description: '你将摄影作为业余爱好，记录生活点滴。'
                    },
                    {
                        text: '偶尔拍照',
                        effects: { art: 5, happiness: 5 },
                        description: '你只是偶尔拍照留念。'
                    }
                ]
            }
        ];
    }

    getRandomEffects() {
        const effects = {};
        const stats = ['intelligence', 'health', 'wealth', 'happiness', 'morality'];
        stats.forEach(stat => {
            effects[stat] = Math.floor(Math.random() * 5) - 2;
        });
        return effects;
    }

    showNextEvent() {
        this.advanceTime();
        
        if (this.age > 90) {
            this.showEnding();
            return;
        }

        this.updateStage();
        console.log('Current age:', this.age);
        console.log('Current stage:', this.stage);
        
        this.currentEvent = this.getNextEvent();
        console.log('Current event:', this.currentEvent);
        
        if (!this.currentEvent) {
            console.log('No event found, showing ending');
            this.showEnding();
            return;
        }

        document.getElementById('age').textContent = `${this.age}岁`;
        document.getElementById('stage').textContent = this.stage;
        document.getElementById('event-title').textContent = this.currentEvent.title;
        document.getElementById('event-description').textContent = this.currentEvent.description;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        console.log('Options:', this.currentEvent.options);
        this.currentEvent.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'btn';
            button.textContent = option.text;
            button.onclick = () => this.chooseOption(index);
            optionsContainer.appendChild(button);
            console.log('Added button:', option.text);
        });
    }

    chooseOption(optionIndex) {
        const option = this.currentEvent.options[optionIndex];
        
        Object.keys(option.effects).forEach(stat => {
            this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat] + option.effects[stat]));
        });

        this.history.push({
            age: this.age,
            event: this.currentEvent.title,
            choice: option.text,
            description: option.description
        });

        this.updateBranchFlags(this.currentEvent.title, option.text);
        this.updateStatsDisplay();
        this.updateHistory();
        this.eventIndex++;
        this.showNextEvent();
    }

    advanceTime() {
        const timeIncrement = Math.floor(Math.random() * 3) + 1;
        this.timeProgress += timeIncrement;
        
        if (this.timeProgress >= 12) {
            this.age += 1;
            this.timeProgress = 0;
            
            if (this.age % 10 === 0) {
                this.stats.health -= 2;
                this.stats.happiness -= 1;
            }
        }
    }

    updateStage() {
        if (this.age< 6) this.stage = '婴儿期';
        else if (this.age < 13) this.stage = '童年期';
        else if (this.age < 19) this.stage = '青春期';
        else if (this.age < 31) this.stage = '青年期';
        else if (this.age < 51) this.stage = '中年期';
        else if (this.age < 71) this.stage = '老年期';
        else if (this.age < 91) this.stage = '暮年期';
        else this.stage = '结局阶段';
    }

    getNextEvent() {
        // 简化逻辑，直接返回第一个事件
        if (this.eventIndex === 0) {
            const firstEvent = this.events.find(event => event.id === 'e101');
            if (firstEvent) {
                this.triggeredEvents.add(firstEvent.id);
                return firstEvent;
            }
        }
        
        const availableEvents = this.events.filter(event => {
            if (this.triggeredEvents.has(event.id)) return false;
            
            const eventStage = event.id.charAt(1);
            let stageMatch = false;
            
            switch(this.stage) {
                case '婴儿期':
                    stageMatch = eventStage === '1';
                    break;
                case '童年期':
                    stageMatch = eventStage === '2';
                    break;
                case '青春期':
                    stageMatch = eventStage === '3';
                    break;
                case '青年期':
                    stageMatch = eventStage === '4';
                    break;
                case '中年期':
                    stageMatch = eventStage === '5';
                    break;
                case '老年期':
                    stageMatch = eventStage === '6';
                    break;
                case '暮年期':
                    stageMatch = eventStage === '7';
                    break;
                default:
                    stageMatch = false;
            }
            
            if (!stageMatch) return false;
            
            if (event.conditions) {
                for (const [stat, value] of Object.entries(event.conditions)) {
                    if (this.stats[stat]< value) return false;
                }
            }
            
            if (event.requiredEvents) {
                for (const requiredEvent of event.requiredEvents) {
                    if (!this.triggeredEvents.has(requiredEvent)) return false;
                }
            }
            
            return true;
        });

        if (availableEvents.length === 0) return null;
        
        const weights = availableEvents.map(event => event.weight || 1);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i< availableEvents.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                this.triggeredEvents.add(availableEvents[i].id);
                return availableEvents[i];
            }
        }
        
        return availableEvents[Math.floor(Math.random() * availableEvents.length)];
    }

    updateBranchFlags(eventTitle, choice) {
        switch(eventTitle) {
            case '文理分科':
                if (choice.includes('文科')) this.branchFlags.educationPath = 'humanities';
                else if (choice.includes('理科')) this.branchFlags.educationPath = 'science';
                else if (choice.includes('艺术')) this.branchFlags.educationPath = 'art';
                else if (choice.includes('体育')) this.branchFlags.educationPath = 'sports';
                break;
            case '大学录取':
                if (choice.includes('清华') || choice.includes('北大') || choice.includes('计算机') || choice.includes('理工')) this.branchFlags.careerPath = 'tech';
                else if (choice.includes('金融') || choice.includes('经济')) this.branchFlags.careerPath = 'finance';
                else if (choice.includes('医学') || choice.includes('医科')) this.branchFlags.careerPath = 'medical';
                else if (choice.includes('文学') || choice.includes('艺术')) this.branchFlags.careerPath = 'creative';
                break;
            case '第一份工作':
                if (choice.includes('大厂')) this.branchFlags.careerPath = 'tech';
                else if (choice.includes('金融')) this.branchFlags.careerPath = 'finance';
                else if (choice.includes('体制') || choice.includes('国企')) this.branchFlags.careerPath = 'stable';
                else if (choice.includes('自由')) this.branchFlags.careerPath = 'freelance';
                break;
            case '恋爱婚姻':
                if (choice.includes('闪婚')) this.branchFlags.relationshipPath = 'quick_marriage';
                else if (choice.includes('自由恋爱')) this.branchFlags.relationshipPath = 'love_marriage';
                else if (choice.includes('不婚')) this.branchFlags.relationshipPath = 'single';
                else if (choice.includes('丁克')) this.branchFlags.relationshipPath = 'dink';
                break;
            case '投资选择':
                if (choice.includes('股票')) this.branchFlags.wealthPath = 'high_risk';
                else if (choice.includes('基金')) this.branchFlags.wealthPath = 'medium_risk';
                else if (choice.includes('保守')) this.branchFlags.wealthPath = 'low_risk';
                else if (choice.includes('投资自己')) this.branchFlags.wealthPath = 'self_investment';
                break;
            case '子女教育':
                if (choice.includes('精英') || choice.includes('虎妈')) this.branchFlags.educationPath = 'strict_education';
                else if (choice.includes('快乐')) this.branchFlags.educationPath = 'happy_education';
                else if (choice.includes('放养')) this.branchFlags.educationPath = 'free_education';
                break;
            case '健康问题':
                if (choice.includes('积极锻炼') || choice.includes('健康饮食')) this.branchFlags.healthPath = 'healthy_lifestyle';
                else if (choice.includes('忽视')) this.branchFlags.healthPath = 'unhealthy_lifestyle';
                break;
            case '父母养老':
                if (choice.includes('接来同住') || choice.includes('请保姆')) this.branchFlags.moralityPath = 'filial_piety';
                else if (choice.includes('很少关心')) this.branchFlags.moralityPath = 'unfilial';
                break;
        }
    }

    getUniversityEffects() {
        const score = this.calculateUniversityScore();
        
        if (score >= 90) {
            return { intelligence: 4, happiness: 4, wealth: -3 };
        } else if (score >= 75) {
            return { intelligence: 3, happiness: 3, wealth: -2 };
        } else if (score >= 60) {
            return { intelligence: 2, happiness: 2, wealth: -1 };
        } else if (score >= 45) {
            return { intelligence: 1, happiness: 1 };
        } else {
            return { happiness: -2 };
        }
    }

    getUniversityDescription() {
        const score = this.calculateUniversityScore();
        const educationPath = this.branchFlags.educationPath;
        
        if (score >= 90) {
            if (educationPath === 'science') {
                return '恭喜！你考上了清华大学计算机科学专业！这是国内顶尖的学府，你的未来一片光明。';
            } else if (educationPath === 'humanities') {
                return '恭喜！你考上了北京大学中文系！这是中国最高的人文殿堂。';
            } else if (educationPath === 'art') {
                return '恭喜！你考上了中央美术学院！你在艺术领域将有非凡的成就。';
            } else {
                return '恭喜！你考上了名牌大学！你的努力得到了回报。';
            }
        } else if (score >= 75) {
            if (educationPath === 'science') {
                return '你考上了985大学的理工科专业！这是很好的学校。';
            } else if (educationPath === 'humanities') {
                return '你考上了985大学的文科专业！未来可期。';
            } else {
                return '你考上了重点本科大学！继续努力！';
            }
        } else if (score >= 60) {
            return '你考上了普通本科大学！也是不错的选择。';
        } else if (score >= 45) {
            return '你考上了专科院校！决定继续努力深造。';
        } else {
            return '很遗憾，你没有考上大学。但人生的道路不止一条，你决定开始工作或复读。';
        }
    }

    calculateUniversityScore() {
        let baseScore = 50;
        
        baseScore += Math.floor(this.stats.intelligence * 0.5);
        baseScore += Math.floor(Math.random() * 20);
        
        if (this.branchFlags.educationPath === 'science') baseScore += 10;
        else if (this.branchFlags.educationPath === 'humanities') baseScore += 5;
        
        if (this.stats.health >= 70) baseScore += 5;
        
        return Math.max(0, Math.min(100, baseScore));
    }

    lotteryEffects() {
        const chance = Math.random();
        
        if (chance< 0.01) {
            return { wealth: 10, happiness: 3 };
        } else if (chance < 0.05) {
            return { wealth: 5, happiness: 2 };
        } else if (chance< 0.2) {
            return { wealth: 2, happiness: 1 };
        } else if (chance < 0.5) {
            return { wealth: 1, happiness: 1 };
        } else {
            return { wealth: -1, happiness: -1 };
        }
    }

    lotteryDescription() {
        const chance = Math.random();
        
        if (chance< 0.01) {
            return '恭喜！你中了特等奖！获得了巨额奖金！';
        } else if (chance < 0.05) {
            return '恭喜！你中了一等奖！获得了丰厚的奖金！';
        } else if (chance< 0.2) {
            return '不错！你中了二等奖！获得了一些奖金。';
        } else if (chance < 0.5) {
            return '运气不错！你中了纪念奖！获得了小奖励。';
        } else {
            return '很遗憾，你没有中奖，但重在参与！';
        }
    }

    updateStatsDisplay() {
        Object.keys(this.stats).forEach(stat => {
            const value = this.stats[stat];
            const percentage = (value / 100) * 100;
            document.getElementById(`${stat}-value`).textContent = value;
            document.getElementById(`${stat}-bar`).style.width = `${percentage}%`;
        });
    }

    updateHistory() {
        const historyList = document.getElementById('history-list');
        const latestItem = this.history[this.history.length - 1];
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = `${latestItem.age}岁 - ${latestItem.event}: ${latestItem.choice}`;
        historyList.appendChild(item);
        historyList.scrollTop = historyList.scrollHeight;
    }

    showEnding() {
        const gameOver = document.getElementById('game-over');
        const endingTitle = document.getElementById('ending-title');
        const endingDescription = document.getElementById('ending-description');
        const rebirthButton = document.getElementById('rebirth-button');
        const restartButton = document.getElementById('restart-button');

        let ending = '';
        let description = '';

        if (this.stats.health<= 0) {
            ending = '英年早逝';
            description = '健康状况恶化，你的人生过早地结束了。珍惜健康，珍惜生命。';
        } else if (this.stats.morality <= -80) {
            ending = '锒铛入狱';
            description = '道德败坏，最终走向了犯罪的道路。人生需要坚守底线。';
        } else if (this.branchFlags.careerPath === 'tech' && this.stats.intelligence >= 80 && this.stats.wealth >= 80) {
            ending = '科技巨头';
            description = '你在科技领域取得了巨大成功，创立了自己的科技帝国，改变了世界。';
        } else if (this.branchFlags.careerPath === 'finance' && this.stats.wealth >= 90) {
            ending = '金融大亨';
            description = '你成为了华尔街的传奇人物，掌控着巨额财富和金融市场。';
        } else if (this.branchFlags.careerPath === 'medical' && this.stats.intelligence >= 80 && this.stats.morality >= 80) {
            ending = '医学圣手';
            description = '你攻克了医学难题，拯救了无数生命，成为了医学界的传奇。';
        } else if (this.branchFlags.careerPath === 'creative' && this.stats.intelligence >= 70 && this.stats.happiness >= 80) {
            ending = '艺术大师';
            description = '你在艺术领域达到了巅峰，你的作品被世人传颂，永载史册。';
        } else if (this.branchFlags.relationshipPath === 'love_marriage' && this.stats.happiness >= 90 && this.stats.morality >= 80) {
            ending = '幸福家庭';
            description = '你拥有一个充满爱和温暖的家庭，夫妻恩爱，子女孝顺，家庭美满。';
        } else if (this.branchFlags.relationshipPath === 'single' && this.stats.happiness >= 70 && this.stats.intelligence >= 70) {
            ending = '单身贵族';
            description = '你选择了单身生活，专注于事业和自我提升，过着自由自在的生活。';
        } else if (this.branchFlags.healthPath === 'healthy_lifestyle' && this.stats.health >= 90) {
            ending = '健康达人';
            description = '你一生注重健康，坚持锻炼和健康饮食，活到了120岁，成为了健康长寿的典范。';
        } else if (this.branchFlags.moralityPath === 'filial_piety' && this.stats.morality >= 90) {
            ending = '孝子典范';
            description = '你一生孝顺父母，关爱家人，成为了社会传颂的孝子典范。';
        } else if (this.branchFlags.educationPath === 'strict_education' && this.stats.intelligence >= 90) {
            ending = '教育成功';
            description = '你通过严格的教育培养出了优秀的子女，他们成为了社会的栋梁之才。';
        } else if (this.branchFlags.wealthPath === 'high_risk' && this.stats.wealth >= 100) {
            ending = '投资传奇';
            description = '你在高风险投资中取得了巨大成功，成为了投资界的传奇人物。';
        } else if (this.branchFlags.wealthPath === 'self_investment' && this.stats.intelligence >= 90 && this.stats.wealth >= 70) {
            ending = '自我实现';
            description = '你通过不断投资自己，实现了自我价值，成为了行业的领军人物。';
        } else if (this.stats.intelligence >= 90 && this.stats.wealth >= 90 && this.stats.happiness >= 90 && this.stats.morality >= 90) {
            ending = '传奇人生';
            description = '你实现了完美人生，成为了世人敬仰的传奇人物！';
        } else if (this.stats.intelligence >= 80 && this.stats.wealth >= 80 && this.stats.happiness >= 80 && this.stats.morality >= 80) {
            ending = '人生赢家';
            description = '你拥有高智力、高财富、高幸福和高道德，实现了圆满的人生！';
        } else if (this.stats.wealth >= 100) {
            ending = '世界首富';
            description = '你成为了世界首富，拥有无尽的财富，但内心感到孤独。';
        } else if (this.stats.intelligence >= 100) {
            ending = '科学巨匠';
            description = '你在科学领域取得了划时代的成就，改变了人类的命运。';
        } else if (this.stats.happiness >= 90 && this.stats.morality >= 80) {
            ending = '人间天使';
            description = '你用爱和善良温暖了身边的每一个人，成为了大家心中的天使。';
        } else if (this.stats.health >= 90) {
            ending = '长寿达人';
            description = '你健康长寿，活到了100岁以上，见证了时代的变迁。';
        } else if (this.stats.morality >= 90) {
            ending = '道德楷模';
            description = '你一生坚守道德底线，成为了社会的道德楷模。';
        } else if (this.stats.happiness >= 70 && this.stats.morality >= 70) {
            ending = '平凡幸福';
            description = '你过着平凡而幸福的生活，家庭美满，这就是普通人最好的归宿。';
        } else if (this.stats.art >= 90) {
            ending = '艺术传奇';
            description = '你的艺术作品成为了传世经典，被博物馆永久收藏。';
        } else if (this.stats.sports >= 90) {
            ending = '体育传奇';
            description = '你在体育领域取得了辉煌成就，成为了国家英雄。';
        } else if (this.stats.programming >= 90) {
            ending = '编程大师';
            description = '你开发的软件改变了世界，成为了编程界的传奇。';
        } else if (this.stats.reputation >= 90) {
            ending = '社会名流';
            description = '你成为了社会名流，受到了所有人的尊敬和爱戴。';
        } else if (this.stats.charm >= 90) {
            ending = '魅力四射';
            description = '你魅力四射，身边总是围绕着许多朋友和仰慕者。';
        } else if (this.stats.luck >= 90) {
            ending = '幸运儿';
            description = '你一生运气极好，总是能在关键时刻逢凶化吉。';
        } else if (this.triggeredEvents.has('e512')) {
            ending = '商业领袖';
            description = '你成为了杰出的商业领袖，带领公司走向了辉煌。';
        } else if (this.triggeredEvents.has('e607')) {
            ending = '慈善家';
            description = '你通过慈善事业帮助了无数人，成为了社会的榜样。';
        } else if (this.triggeredEvents.has('e313')) {
            ending = '天才科学家';
            description = '你从小展现出非凡的天赋，成为了伟大的科学家。';
        } else if (this.triggeredEvents.has('e314')) {
            ending = '体育明星';
            description = '你在体育领域取得了巨大成功，成为了家喻户晓的明星。';
        } else if (this.triggeredEvents.has('e411')) {
            ending = '艺术大师';
            description = '你的艺术作品获得了国际认可，成为了艺术界的巨匠。';
        } else if (this.triggeredEvents.has('e513')) {
            ending = '医学泰斗';
            description = '你在医学领域取得了重大突破，拯救了无数生命。';
        } else if (this.stats.wealth< 0 && this.stats.happiness >= 80) {
            ending = '精神富翁';
            description = '你虽然没有太多财富，但精神世界非常丰富，生活得很幸福。';
        } else if (this.stats.intelligence < 30 && this.stats.happiness >= 70) {
            ending = '快乐傻子';
            description = '你虽然智商不高，但每天都过得很开心，这也是一种幸福。';
        } else if (this.rebirthCount >0 && Math.random() > 0.8) {
            ending = '轮回者';
            description = `这是你第${this.rebirthCount + 1}次人生，你已经经历了多次轮回，对人生有了更深的理解。`;
        } else if (Math.random() > 0.97) {
            ending = '隐藏结局：外星接触';
            description = '在生命的最后时刻，你遇到了外星文明，开启了星际旅程。';
        } else if (Math.random() > 0.95) {
            ending = '隐藏结局：重生者';
            description = '你带着前世的记忆重生了，这一次你会如何选择？';
        } else if (Math.random() > 0.93) {
            ending = '隐藏结局：火星移民';
            description = '你成为了第一批火星移民，在红色星球上建立了新家园。';
        } else if (Math.random() > 0.9) {
            ending = '隐藏结局：时空旅行者';
            description = '你发现了时间旅行的秘密，开始了跨越时空的冒险。';
        } else {
            ending = '普通人生';
            description = '你的一生平淡但充实，每个人都有自己的精彩。';
        }

        endingTitle.textContent = ending;
        endingDescription.textContent = description;
        
        if (this.rebirthCount< 3) {
            rebirthButton.classList.remove('hidden');
            rebirthButton.textContent = `重生（第${this.rebirthCount + 1}次机会）`;
        } else {
            rebirthButton.classList.add('hidden');
        }
        
        gameOver.classList.remove('hidden');
    }
}

function restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    new LifeSimulator();
}

function rebirth() {
    const game = new LifeSimulator();
    game.rebirthCount = window.currentGame ? window.currentGame.rebirthCount + 1 : 1;
    
    if (window.currentGame) {
        game.stats.intelligence = Math.max(0, Math.min(100, window.currentGame.stats.intelligence - 10));
        game.stats.health = Math.max(0, Math.min(100, window.currentGame.stats.health - 10));
        game.stats.wealth = Math.max(0, Math.min(100, window.currentGame.stats.wealth - 10));
        game.stats.happiness = Math.max(0, Math.min(100, window.currentGame.stats.happiness - 10));
        game.stats.morality = Math.max(0, Math.min(100, window.currentGame.stats.morality - 10));
    }
    
    document.getElementById('game-over').classList.add('hidden');
    window.currentGame = game;
}

window.addEventListener('load', () => {
    window.currentGame = new LifeSimulator();
});
