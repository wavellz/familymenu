// 家庭菜单初始化数据
// 参考国家膳食指南，设计符合荤素搭配、营养均衡的分类和菜品

// 清空现有数据并初始化新数据
document.addEventListener('DOMContentLoaded', () => {
    // 初始化应用
    const app = new MenuApp();
    
    // 清空现有数据
    app.dishes = [];
    app.categories = [];
    
    // 定义新分类
    const newCategories = [
        '主食类',
        '肉类',
        '鱼类',
        '蔬菜类',
        '豆制品类',
        '汤品类',
        '早餐类',
        '蛋类',
        '菌菇类',
        '甜品小吃类',
        '水果类'
    ];
    
    // 定义新菜品
    const newDishes = [
        // 主食类
        { id: '1', name: '白米饭', category: '主食类', createdAt: new Date().toISOString() },
        { id: '2', name: '小米粥', category: '主食类', createdAt: new Date().toISOString() },
        { id: '3', name: '馒头', category: '主食类', createdAt: new Date().toISOString() },
        { id: '4', name: '面条', category: '主食类', createdAt: new Date().toISOString() },
        { id: '5', name: '饺子', category: '主食类', createdAt: new Date().toISOString() },
        { id: '6', name: '包子', category: '主食类', createdAt: new Date().toISOString() },
        { id: '7', name: '炒饭', category: '主食类', createdAt: new Date().toISOString() },
        { id: '8', name: '杂粮饭', category: '主食类', createdAt: new Date().toISOString() },
        { id: '9', name: '烙饼', category: '主食类', createdAt: new Date().toISOString() },
        { id: '10', name: '花卷', category: '主食类', createdAt: new Date().toISOString() },
        
        // 肉类
        { id: '11', name: '红烧肉', category: '肉类', createdAt: new Date().toISOString() },
        { id: '12', name: '糖醋排骨', category: '肉类', createdAt: new Date().toISOString() },
        { id: '13', name: '鱼香肉丝', category: '肉类', createdAt: new Date().toISOString() },
        { id: '14', name: '宫保鸡丁', category: '肉类', createdAt: new Date().toISOString() },
        { id: '15', name: '回锅肉', category: '肉类', createdAt: new Date().toISOString() },
        { id: '16', name: '水煮肉片', category: '肉类', createdAt: new Date().toISOString() },
        { id: '17', name: '可乐鸡翅', category: '肉类', createdAt: new Date().toISOString() },
        { id: '18', name: '烤鸡翅', category: '肉类', createdAt: new Date().toISOString() },
        { id: '19', name: '炸鸡腿', category: '肉类', createdAt: new Date().toISOString() },
        { id: '20', name: '酱牛肉', category: '肉类', createdAt: new Date().toISOString() },
        { id: '21', name: '红烧肉丸', category: '肉类', createdAt: new Date().toISOString() },
        { id: '22', name: '青椒肉丝', category: '肉类', createdAt: new Date().toISOString() },
        { id: '23', name: '肉片炒木耳', category: '肉类', createdAt: new Date().toISOString() },
        { id: '24', name: '炖排骨', category: '肉类', createdAt: new Date().toISOString() },
        { id: '25', name: '狮子头', category: '肉类', createdAt: new Date().toISOString() },
        
        // 鱼类
        { id: '26', name: '清蒸鲈鱼', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '27', name: '红烧鲫鱼', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '28', name: '糖醋鱼', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '29', name: '酸菜鱼', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '30', name: '水煮鱼', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '31', name: '炸鱼块', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '32', name: '鱼头豆腐汤', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '33', name: '黄焖鱼', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '34', name: '烤秋刀鱼', category: '鱼类', createdAt: new Date().toISOString() },
        { id: '35', name: '三文鱼刺身', category: '鱼类', createdAt: new Date().toISOString() },
        
        // 蔬菜类
        { id: '36', name: '清炒时蔬', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '37', name: '蒜蓉西兰花', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '38', name: '凉拌黄瓜', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '39', name: '西红柿炒鸡蛋', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '40', name: '炒土豆丝', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '41', name: '麻辣豆腐', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '42', name: '红烧茄子', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '43', name: '醋溜白菜', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '44', name: '洋葱炒蛋', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '45', name: '清炒菠菜', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '46', name: '西兰花炒虾仁', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '47', name: '胡萝卜炒肉', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '48', name: '芦笋炒肉', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '49', name: '炒空心菜', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '50', name: '凉拌菠菜', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '51', name: '地三鲜', category: '蔬菜类', createdAt: new Date().toISOString() },
        { id: '52', name: '干煸豆角', category: '蔬菜类', createdAt: new Date().toISOString() },
        
        // 豆制品类
        { id: '53', name: '麻婆豆腐', category: '豆制品类', createdAt: new Date().toISOString() },
        { id: '54', name: '家常豆腐', category: '豆制品类', createdAt: new Date().toISOString() },
        { id: '55', name: '煎豆腐', category: '豆制品类', createdAt: new Date().toISOString() },
        { id: '56', name: '豆腐汤', category: '豆制品类', createdAt: new Date().toISOString() },
        { id: '57', name: '腐竹炒肉', category: '豆制品类', createdAt: new Date().toISOString() },
        { id: '58', name: '豆浆', category: '豆制品类', createdAt: new Date().toISOString() },
        { id: '59', name: '豆腐干炒肉', category: '豆制品类', createdAt: new Date().toISOString() },
        { id: '60', name: '炸豆腐', category: '豆制品类', createdAt: new Date().toISOString() },
        
        // 汤品类
        { id: '61', name: '番茄鸡蛋汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '62', name: '紫菜蛋花汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '63', name: '萝卜排骨汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '64', name: '玉米排骨汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '65', name: '鱼头汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '66', name: '鸡汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '67', name: '青菜豆腐汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '68', name: '冬瓜排骨汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '69', name: '海带汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '70', name: '银耳莲子汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '71', name: '酸辣汤', category: '汤品类', createdAt: new Date().toISOString() },
        { id: '72', name: '蘑菇汤', category: '汤品类', createdAt: new Date().toISOString() },
        
        // 早餐类
        { id: '73', name: '豆浆油条', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '74', name: '包子馒头', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '75', name: '鸡蛋灌饼', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '76', name: '煎饼果子', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '77', name: '粥品', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '78', name: '面包牛奶', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '79', name: '三明治', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '80', name: '鸡蛋饼', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '81', name: '馄饨', category: '早餐类', createdAt: new Date().toISOString() },
        { id: '82', name: '饺子', category: '早餐类', createdAt: new Date().toISOString() },
        
        // 蛋类
        { id: '83', name: '煮鸡蛋', category: '蛋类', createdAt: new Date().toISOString() },
        { id: '84', name: '煎鸡蛋', category: '蛋类', createdAt: new Date().toISOString() },
        { id: '85', name: '炒鸡蛋', category: '蛋类', createdAt: new Date().toISOString() },
        { id: '86', name: '鸡蛋羹', category: '蛋类', createdAt: new Date().toISOString() },
        { id: '87', name: '茶叶蛋', category: '蛋类', createdAt: new Date().toISOString() },
        { id: '88', name: '卤蛋', category: '蛋类', createdAt: new Date().toISOString() },
        { id: '89', name: '蛋炒饭', category: '蛋类', createdAt: new Date().toISOString() },
        
        // 菌菇类
        { id: '90', name: '香菇炒肉', category: '菌菇类', createdAt: new Date().toISOString() },
        { id: '91', name: '平菇炒鸡蛋', category: '菌菇类', createdAt: new Date().toISOString() },
        { id: '92', name: '金针菇汤', category: '菌菇类', createdAt: new Date().toISOString() },
        { id: '93', name: '杏鲍菇炒肉', category: '菌菇类', createdAt: new Date().toISOString() },
        { id: '94', name: '木耳炒肉', category: '菌菇类', createdAt: new Date().toISOString() },
        { id: '95', name: '香菇炖鸡', category: '菌菇类', createdAt: new Date().toISOString() },
        { id: '96', name: '凉拌木耳', category: '菌菇类', createdAt: new Date().toISOString() },
        { id: '97', name: '滑子菇汤', category: '菌菇类', createdAt: new Date().toISOString() },
        
        // 甜品小吃类
        { id: '98', name: '水果沙拉', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '99', name: '酸奶', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '100', name: '冰淇淋', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '101', name: '蛋糕', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '102', name: '饼干', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '103', name: '薯片', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '104', name: '爆米花', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '105', name: '布丁', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '106', name: '双皮奶', category: '甜品小吃类', createdAt: new Date().toISOString() },
        { id: '107', name: '龟苓膏', category: '甜品小吃类', createdAt: new Date().toISOString() },
        
        // 水果类
        { id: '108', name: '苹果', category: '水果类', createdAt: new Date().toISOString() },
        { id: '109', name: '香蕉', category: '水果类', createdAt: new Date().toISOString() },
        { id: '110', name: '橙子', category: '水果类', createdAt: new Date().toISOString() },
        { id: '111', name: '葡萄', category: '水果类', createdAt: new Date().toISOString() },
        { id: '112', name: '草莓', category: '水果类', createdAt: new Date().toISOString() },
        { id: '113', name: '西瓜', category: '水果类', createdAt: new Date().toISOString() },
        { id: '114', name: '哈密瓜', category: '水果类', createdAt: new Date().toISOString() },
        { id: '115', name: '猕猴桃', category: '水果类', createdAt: new Date().toISOString() },
        { id: '116', name: '芒果', category: '水果类', createdAt: new Date().toISOString() },
        { id: '117', name: '梨', category: '水果类', createdAt: new Date().toISOString() }
    ];
    
    // 设置新数据
    app.categories = newCategories;
    app.dishes = newDishes;
    
    // 保存到本地存储
    app.saveData('categories', app.categories);
    app.saveData('dishes', app.dishes);
    
    // 重新渲染
    app.renderDishLibrary();
    app.renderMenuCalendar();
    
    // 显示初始化完成提示
    alert('家庭菜单数据库初始化完成！已生成117道适合家庭制作的菜品，涵盖11个营养均衡的分类。');
});
