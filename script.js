// 家庭菜单小应用 JavaScript 代码

// 数据管理类
class MenuApp {
    constructor() {
        this.dishes = this.loadData('dishes', []);
        this.menus = this.loadData('menus', {});
        this.categories = this.loadData('categories', ['肉类', '蔬菜类', '汤类', '早餐']);
        
        // 确保早餐分类存在（兼容旧数据）
        if (!this.categories.includes('早餐')) {
            this.categories.push('早餐');
            this.saveData('categories', this.categories);
        }
        
        // 确保所有菜品的分类都存在于categories数组中
        this.dishes.forEach(dish => {
            if (dish.category && !this.categories.includes(dish.category)) {
                this.categories.push(dish.category);
            }
        });
        this.saveData('categories', this.categories);
        
        this.currentTab = 'menu-calendar';
        this.currentDate = new Date();
        this.editingDishId = null;
        this.currentView = 'day'; // 月视图、周视图、日视图 - 默认日视图
        
        this.init();
    }

    // 从本地存储加载数据
    loadData(key, defaultValue) {
        try {
            // 检查localStorage是否可用
            if (typeof localStorage === 'undefined') {
                console.warn('localStorage不可用，使用默认值');
                return defaultValue;
            }
            
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('加载数据失败:', e);
            return defaultValue;
        }
    }

    // 保存数据到本地存储
    saveData(key, data) {
        try {
            // 检查localStorage是否可用
            if (typeof localStorage === 'undefined') {
                console.warn('localStorage不可用，无法保存数据');
                return;
            }
            
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('保存数据失败:', e);
        }
    }

    // 初始化应用
    init() {
        this.setupEventListeners();
        this.updateCategorySelect();
        this.renderDishLibrary();
        this.renderMenuCalendar();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 标签页切换
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 菜品库事件
        document.getElementById('add-dish-btn').addEventListener('click', () => {
            this.openDishModal();
        });

        document.getElementById('save-dish-btn').addEventListener('click', () => {
            this.saveDish(false);
        });

        document.getElementById('save-continue-dish-btn').addEventListener('click', () => {
            this.saveDish(true);
        });

        document.getElementById('cancel-dish-btn').addEventListener('click', () => {
            this.closeDishModal();
        });

        document.getElementById('close-dish-modal').addEventListener('click', () => {
            this.closeDishModal();
        });

        document.getElementById('dish-search').addEventListener('input', (e) => {
            this.filterDishes(e.target.value);
        });

        // 分类管理事件
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.openCategoryModal();
        });

        document.getElementById('save-category-btn').addEventListener('click', () => {
            this.saveCategory();
        });

        document.getElementById('cancel-category-btn').addEventListener('click', () => {
            this.closeCategoryModal();
        });

        document.getElementById('close-category-modal').addEventListener('click', () => {
            this.closeCategoryModal();
        });

        // 菜单日历事件
        document.getElementById('prev-month').addEventListener('click', () => {
            this.navigateDate(-1);
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.navigateDate(1);
        });

        // 视图切换事件 - 使用直接事件监听而非事件委托
        const viewBtns = document.querySelectorAll('.view-btn');
        if (viewBtns.length > 0) {
            viewBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const view = e.target.dataset.view;
                    this.switchView(view);
                });
            });
        } else {
            // 如果视图按钮还没有被渲染，等待DOM更新后再添加事件监听
            setTimeout(() => {
                const delayedBtns = document.querySelectorAll('.view-btn');
                delayedBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const view = e.target.dataset.view;
                        this.switchView(view);
                    });
                });
            }, 100);
        }
        
        // 月份显示区域点击事件 - 打开日期选择器
        const monthDisplay = document.getElementById('current-month');
        if (monthDisplay) {
            monthDisplay.addEventListener('click', (e) => {
                e.preventDefault();
                this.openDatePickerModal();
            });
        } else {
            // 如果月份显示区域还没有被渲染，等待DOM更新后再添加事件监听
            setTimeout(() => {
                const delayedMonthDisplay = document.getElementById('current-month');
                if (delayedMonthDisplay) {
                    delayedMonthDisplay.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.openDatePickerModal();
                    });
                }
            }, 100);
        }
        
        // 日期选择弹窗事件
        document.getElementById('close-date-picker-modal').addEventListener('click', () => {
            this.closeDatePickerModal();
        });
        
        document.getElementById('cancel-date-btn').addEventListener('click', () => {
            this.closeDatePickerModal();
        });
        
        document.getElementById('confirm-date-btn').addEventListener('click', () => {
            this.confirmDate();
        });
        
        // 点击模态框外部关闭
        document.getElementById('date-picker-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('date-picker-modal')) {
                this.closeDatePickerModal();
            }
        });

        // 设置事件
        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    // 切换标签页
    switchTab(tabName) {
        // 更新标签按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 更新内容显示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // 按需重新渲染
        if (tabName === 'menu-calendar') {
            this.renderMenuCalendar();
        }
    }

    // 渲染菜品库（支持排序和增强筛选）
    renderDishLibrary(category = 'all', searchTerm = '', sortBy = 'name') {
        const dishGrid = document.getElementById('dish-grid');
        const categoryTags = document.getElementById('category-tags');

        // 添加排序控件（如果不存在）
        let sortControls = document.getElementById('sort-controls');
        if (!sortControls) {
            sortControls = document.createElement('div');
            sortControls.id = 'sort-controls';
            sortControls.className = 'sort-controls';
            sortControls.innerHTML = `
                <label for="sort-select">排序方式：</label>
                <select id="sort-select" class="sort-select">
                    <option value="name">按名称</option>
                    <option value="category">按分类</option>
                    <option value="createdAt">按添加时间</option>
                </select>
            `;
            // 插入到分类标签之后
            categoryTags.parentNode.insertBefore(sortControls, categoryTags.nextSibling);
            
            // 绑定排序事件
            document.getElementById('sort-select').addEventListener('change', (e) => {
                // 获取当前激活的分类和搜索值
                const activeCategory = document.querySelector('.category-tag.active').dataset.category;
                const currentSearchTerm = document.getElementById('dish-search').value;
                this.renderDishLibrary(activeCategory, currentSearchTerm, e.target.value);
            });
        }

        // 渲染分类标签
        let categoryHtml = `<button class="category-tag ${category === 'all' ? 'active' : ''}" data-category="all">全部</button>`;
        this.categories.forEach(cat => {
            categoryHtml += `
                <div class="category-item">
                    <button class="category-tag ${category === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
                    <div class="category-actions">
                        <button class="category-action-btn edit-category" data-category="${cat}">✏️</button>
                        <button class="category-action-btn delete-category" data-category="${cat}">🗑️</button>
                    </div>
                </div>
            `;
        });
        categoryHtml += `<button id="add-category-btn" class="category-tag add-category">+ 自定义</button>`;
        categoryTags.innerHTML = categoryHtml;

        // 重新绑定分类标签事件
        document.querySelectorAll('.category-tag').forEach(tag => {
            if (tag.id === 'add-category-btn') {
                // 重新绑定添加分类事件
                tag.addEventListener('click', () => {
                    this.openCategoryModal();
                });
            } else {
                tag.addEventListener('click', (e) => {
                    this.filterDishesByCategory(e.target.dataset.category);
                });
            }
        });

        // 绑定分类编辑事件
        document.querySelectorAll('.edit-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止冒泡到分类标签
                this.openEditCategoryModal(e.target.dataset.category);
            });
        });

        // 绑定分类删除事件
        document.querySelectorAll('.delete-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止冒泡到分类标签
                this.deleteCategory(e.target.dataset.category);
            });
        });

        // 过滤菜品
        let filteredDishes = this.dishes;
        if (category !== 'all') {
            filteredDishes = filteredDishes.filter(dish => dish.category === category);
        }
        if (searchTerm) {
            filteredDishes = filteredDishes.filter(dish => 
                dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dish.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 排序菜品
        filteredDishes.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name, 'zh-CN');
                case 'category':
                    return a.category.localeCompare(b.category, 'zh-CN');
                case 'createdAt':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

        // 渲染菜品卡片
        if (filteredDishes.length === 0) {
            dishGrid.innerHTML = '<p style="text-align: center; color: #999; font-size: 18px; padding: 50px;">暂无菜品，点击"+ 新增菜品"添加</p>';
            return;
        }

        dishGrid.innerHTML = '';
        filteredDishes.forEach(dish => {
            const dishCard = document.createElement('div');
            dishCard.className = 'dish-card';
            dishCard.dataset.dishId = dish.id;
            dishCard.innerHTML = `
                <h3>${dish.name}</h3>
                <span class="dish-category">${dish.category}</span>
                <div class="dish-actions">
                    <button class="dish-action-btn edit-btn">编辑</button>
                    <button class="dish-action-btn delete-btn">删除</button>
                </div>
            `;
            
            // 绑定编辑事件
            dishCard.querySelector('.edit-btn').addEventListener('click', () => {
                this.editDish(dish.id);
            });
            
            // 绑定删除事件
            dishCard.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteDish(dish.id);
            });
            
            dishGrid.appendChild(dishCard);
        });
    }

    // 按分类过滤菜品
    filterDishesByCategory(category) {
        const searchTerm = document.getElementById('dish-search').value;
        const sortBy = document.getElementById('sort-select')?.value || 'name';
        this.renderDishLibrary(category, searchTerm, sortBy);
    }

    // 按关键词搜索菜品
    filterDishes(searchTerm) {
        const activeCategory = document.querySelector('.category-tag.active').dataset.category;
        const sortBy = document.getElementById('sort-select')?.value || 'name';
        this.renderDishLibrary(activeCategory, searchTerm, sortBy);
    }

    // 打开菜品模态框
    openDishModal(dish = null) {
        const modal = document.getElementById('dish-modal');
        const title = document.getElementById('modal-title');
        const nameInput = document.getElementById('dish-name');
        const categorySelect = document.getElementById('dish-category');

        if (dish) {
            title.textContent = '编辑菜品';
            nameInput.value = dish.name;
            categorySelect.value = dish.category;
            this.editingDishId = dish.id;
        } else {
            title.textContent = '新增菜品';
            nameInput.value = '';
            categorySelect.value = '肉类';
            this.editingDishId = null;
        }

        modal.classList.add('active');
    }

    // 关闭菜品模态框
    closeDishModal() {
        document.getElementById('dish-modal').classList.remove('active');
        this.editingDishId = null;
    }

    // 保存菜品
    saveDish(continueAdding = false) {
        const name = document.getElementById('dish-name').value.trim();
        const category = document.getElementById('dish-category').value;

        if (!name) {
            alert('请输入菜品名称');
            return;
        }

        if (this.editingDishId) {
            // 编辑现有菜品
            const dishIndex = this.dishes.findIndex(d => d.id === this.editingDishId);
            if (dishIndex !== -1) {
                this.dishes[dishIndex] = {
                    ...this.dishes[dishIndex],
                    name,
                    category
                };
            }
            // 编辑模式下，无论是否继续添加，都关闭模态框
            this.closeDishModal();
        } else {
            // 新增菜品
            const newDish = {
                id: Date.now().toString(),
                name,
                category,
                createdAt: new Date().toISOString()
            };
            this.dishes.push(newDish);

            if (!continueAdding) {
                // 不继续添加，关闭模态框
                this.closeDishModal();
            } else {
                // 继续添加，清空表单，保持模态框打开
                document.getElementById('dish-name').value = '';
                // 保持当前分类选中状态
            }
        }

        this.saveData('dishes', this.dishes);
        // 保留当前分类和筛选状态
        const activeCategory = document.querySelector('.category-tag.active').dataset.category;
        const currentSearchTerm = document.getElementById('dish-search').value;
        const currentSortBy = document.getElementById('sort-select')?.value || 'name';
        this.renderDishLibrary(activeCategory, currentSearchTerm, currentSortBy);
    }

    // 编辑菜品
    editDish(dishId) {
        const dish = this.dishes.find(d => d.id === dishId);
        if (dish) {
            this.openDishModal(dish);
        }
    }

    // 删除菜品
    deleteDish(dishId) {
        if (confirm('确定要删除这个菜品吗？')) {
            this.dishes = this.dishes.filter(d => d.id !== dishId);
            this.saveData('dishes', this.dishes);
            // 保留当前分类和筛选状态
            const activeCategory = document.querySelector('.category-tag.active').dataset.category;
            const currentSearchTerm = document.getElementById('dish-search').value;
            const currentSortBy = document.getElementById('sort-select')?.value || 'name';
            this.renderDishLibrary(activeCategory, currentSearchTerm, currentSortBy);
        }
    }

    // 打开分类模态框（支持新增和编辑）
    openCategoryModal(category = null) {
        const modal = document.getElementById('category-modal');
        const title = modal.querySelector('.modal-header h3');
        const nameInput = document.getElementById('category-name');
        
        if (category) {
            title.textContent = '编辑分类';
            nameInput.value = category;
            // 存储当前编辑的分类名称
            modal.dataset.editingCategory = category;
        } else {
            title.textContent = '新增分类';
            nameInput.value = '';
            delete modal.dataset.editingCategory;
        }
        
        modal.classList.add('active');
    }

    // 打开编辑分类模态框
    openEditCategoryModal(category) {
        this.openCategoryModal(category);
    }

    // 关闭分类模态框
    closeCategoryModal() {
        const modal = document.getElementById('category-modal');
        modal.classList.remove('active');
        delete modal.dataset.editingCategory;
    }

    // 保存分类（支持新增和编辑）
    saveCategory() {
        const modal = document.getElementById('category-modal');
        const isEditing = modal.dataset.editingCategory;
        const categoryName = document.getElementById('category-name').value.trim();
        
        if (!categoryName) {
            alert('请输入分类名称');
            return;
        }

        if (isEditing) {
            // 编辑现有分类
            if (isEditing === categoryName) {
                this.closeCategoryModal();
                return; // 名称未变化，直接关闭
            }
            
            if (this.categories.includes(categoryName)) {
                alert('分类名称已存在');
                return;
            }
            
            // 更新分类名称
            const index = this.categories.indexOf(isEditing);
            if (index !== -1) {
                this.categories[index] = categoryName;
                
                // 更新使用该分类的菜品
                this.dishes.forEach(dish => {
                    if (dish.category === isEditing) {
                        dish.category = categoryName;
                    }
                });
                
                this.saveData('categories', this.categories);
                this.saveData('dishes', this.dishes);
                this.updateCategorySelect();
            }
        } else {
            // 新增分类
            if (this.categories.includes(categoryName)) {
                alert('分类名称已存在');
                return;
            }
            
            this.categories.push(categoryName);
            this.saveData('categories', this.categories);
            this.updateCategorySelect();
        }
        
        // 保留当前分类和筛选状态
        const activeCategory = document.querySelector('.category-tag.active').dataset.category;
        const currentSearchTerm = document.getElementById('dish-search').value;
        const currentSortBy = document.getElementById('sort-select')?.value || 'name';
        
        // 如果当前激活的分类是被编辑的分类，需要更新为新名称
        const newActiveCategory = activeCategory === isEditing ? categoryName : activeCategory;
        
        this.renderDishLibrary(newActiveCategory, currentSearchTerm, currentSortBy);
        this.closeCategoryModal();
    }
    
    // 删除分类
    deleteCategory(category) {
        // 检查是否有菜品使用该分类
        const dishesUsingCategory = this.dishes.filter(dish => dish.category === category);
        if (dishesUsingCategory.length > 0) {
            alert(`该分类下有 ${dishesUsingCategory.length} 个菜品正在使用，无法删除`);
            return;
        }
        
        if (confirm(`确定要删除分类 "${category}" 吗？`)) {
            this.categories = this.categories.filter(cat => cat !== category);
            this.saveData('categories', this.categories);
            this.updateCategorySelect();
            
            // 保留当前分类和筛选状态
            const activeCategory = document.querySelector('.category-tag.active').dataset.category;
            const currentSearchTerm = document.getElementById('dish-search').value;
            const currentSortBy = document.getElementById('sort-select')?.value || 'name';
            
            // 如果当前激活的分类是被删除的分类，切换到"全部"
            const newActiveCategory = activeCategory === category ? 'all' : activeCategory;
            
            this.renderDishLibrary(newActiveCategory, currentSearchTerm, currentSortBy);
        }
    }

    // 更新分类选择器
    updateCategorySelect() {
        const select = document.getElementById('dish-category');
        select.innerHTML = '';
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    // 日期导航
    navigateDate(direction) {
        const currentDate = new Date(this.currentDate);
        
        switch (this.currentView) {
            case 'day':
                currentDate.setDate(currentDate.getDate() + direction);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + (direction * 7));
                break;
            case 'month':
            default:
                currentDate.setMonth(currentDate.getMonth() + direction);
                break;
        }
        
        this.currentDate = currentDate;
        this.renderMenuCalendar();
    }

    // 切换视图
    switchView(view) {
        this.currentView = view;
        
        // 如果切换到日视图，默认显示当前时间日期
        if (view === 'day') {
            this.currentDate = new Date();
        }
        
        // 更新视图按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // 重新渲染日历
        this.renderMenuCalendar();
    }

    // 渲染菜单日历 - 支持月/周/日视图
    renderMenuCalendar() {
        const container = document.getElementById('calendar-container');
        const monthDisplay = document.getElementById('current-month');
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const day = this.currentDate.getDate();
        
        // 更新标题显示
        if (monthDisplay) {
            if (this.currentView === 'day') {
                monthDisplay.textContent = `${year}年${month + 1}月${day}日`;
            } else if (this.currentView === 'week') {
                // 计算本周第一天和最后一天
                const firstDayOfWeek = new Date(year, month, day);
                const dayOfWeek = firstDayOfWeek.getDay();
                firstDayOfWeek.setDate(day - dayOfWeek);
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
                monthDisplay.textContent = `${year}年${month + 1}月${firstDayOfWeek.getDate()}-${lastDayOfWeek.getDate()}日`;
            } else {
                monthDisplay.textContent = `${year}年${month + 1}月`;
            }
        }

        // 根据当前视图渲染不同的日历
        if (container) {
            if (this.currentView === 'day') {
                this.renderDayView(container, year, month, day);
            } else if (this.currentView === 'week') {
                this.renderWeekView(container, year, month, day);
            } else {
                this.renderMonthView(container, year, month);
            }
        }
    }

    // 渲染月视图
    renderMonthView(container, year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        let calendarHtml = '<div class="calendar-header">';
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            calendarHtml += `<div class="calendar-day-header">${day}</div>`;
        });
        calendarHtml += '</div><div class="calendar-grid">';

        // 上个月的日期
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            calendarHtml += `<div class="calendar-day other-month">
                <div class="day-number">${day}</div>
            </div>`;
        }

        // 当月的日期
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const menu = this.menus[dateStr] || { breakfast: [], lunch: [], dinner: [] };
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            
            // 格式化菜单显示 - 仅显示餐次标识，用角标标识是否有菜品
            const hasBreakfast = menu.breakfast.length > 0;
            const hasLunch = menu.lunch.length > 0;
            const hasDinner = menu.dinner.length > 0;
            
            calendarHtml += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                <div class="day-number">${day}</div>
                <div class="meal-indicators">
                    <div class="meal-indicator breakfast ${hasBreakfast ? 'has-dishes' : ''}" data-meal="breakfast">
                        <span class="meal-icon">🍞</span>
                        <span class="meal-text">早餐</span>
                        <span class="meal-badge">${hasBreakfast ? '●' : ''}</span>
                    </div>
                    <div class="meal-indicator lunch ${hasLunch ? 'has-dishes' : ''}" data-meal="lunch">
                        <span class="meal-icon">🍚</span>
                        <span class="meal-text">午餐</span>
                        <span class="meal-badge">${hasLunch ? '●' : ''}</span>
                    </div>
                    <div class="meal-indicator dinner ${hasDinner ? 'has-dishes' : ''}" data-meal="dinner">
                        <span class="meal-icon">🌙</span>
                        <span class="meal-text">晚餐</span>
                        <span class="meal-badge">${hasDinner ? '●' : ''}</span>
                    </div>
                </div>
            </div>`;
        }

        calendarHtml += '</div>';
        container.innerHTML = calendarHtml;

        // 添加餐次点击事件
        this.addMealClickEvents();
    }

    // 渲染周视图 - 竖向排列
    renderWeekView(container, year, month, day) {
        // 计算本周第一天
        const firstDayOfWeek = new Date(year, month, day);
        const dayOfWeek = firstDayOfWeek.getDay();
        firstDayOfWeek.setDate(day - dayOfWeek);
        
        let calendarHtml = '<div class="week-view-container">';
        
        // 渲染本周的7天 - 竖向排列
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(firstDayOfWeek);
            currentDate.setDate(firstDayOfWeek.getDate() + i);
            
            const dateYear = currentDate.getFullYear();
            const dateMonth = currentDate.getMonth();
            const dateDay = currentDate.getDate();
            const dateStr = `${dateYear}-${String(dateMonth + 1).padStart(2, '0')}-${String(dateDay).padStart(2, '0')}`;
            
            const menu = this.menus[dateStr] || { breakfast: [], lunch: [], dinner: [] };
            const isToday = new Date().toDateString() === currentDate.toDateString();
            const isCurrentMonth = dateMonth === month;
            
            const hasBreakfast = menu.breakfast.length > 0;
            const hasLunch = menu.lunch.length > 0;
            const hasDinner = menu.dinner.length > 0;
            
            // 星期几
            const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
            const dayName = weekdays[i];
            
            calendarHtml += `<div class="week-day-item ${isToday ? 'today' : ''} ${isCurrentMonth ? '' : 'other-month'}" data-date="${dateStr}">
                <div class="week-day-header">
                    <span class="week-day-name">${dayName}</span>
                    <span class="week-day-number">${dateDay}</span>
                </div>
                <div class="meal-indicators">
                    <div class="meal-indicator breakfast ${hasBreakfast ? 'has-dishes' : ''}" data-meal="breakfast">
                        <span class="meal-icon">🍞</span>
                        <span class="meal-text">早餐</span>
                        <div class="dish-list">${hasBreakfast ? menu.breakfast.join('、') : ''}</div>
                    </div>
                    <div class="meal-indicator lunch ${hasLunch ? 'has-dishes' : ''}" data-meal="lunch">
                        <span class="meal-icon">🍚</span>
                        <span class="meal-text">午餐</span>
                        <div class="dish-list">${hasLunch ? menu.lunch.join('、') : ''}</div>
                    </div>
                    <div class="meal-indicator dinner ${hasDinner ? 'has-dishes' : ''}" data-meal="dinner">
                        <span class="meal-icon">🌙</span>
                        <span class="meal-text">晚餐</span>
                        <div class="dish-list">${hasDinner ? menu.dinner.join('、') : ''}</div>
                    </div>
                </div>
            </div>`;
        }
        
        calendarHtml += '</div>';
        container.innerHTML = calendarHtml;
        
        // 添加餐次点击事件
        this.addMealClickEvents();
        
        // 添加日期点击修改功能
        container.querySelectorAll('.week-day-item').forEach(dayItem => {
            dayItem.addEventListener('click', (e) => {
                // 避免与餐次点击事件冲突
                if (!e.target.closest('.meal-indicator')) {
                    const dateStr = dayItem.dataset.date;
                    // 设置当前日期并切换到日视图
                    this.currentDate = new Date(dateStr);
                    this.switchView('day');
                }
            });
        });
    }

    // 渲染日视图
    renderDayView(container, year, month, day) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const menu = this.menus[dateStr] || { breakfast: [], lunch: [], dinner: [] };
        
        let calendarHtml = '<div class="day-view-container">';
        
        const meals = [
            { key: 'breakfast', name: '早餐', icon: '🍞', dishes: menu.breakfast },
            { key: 'lunch', name: '午餐', icon: '🍚', dishes: menu.lunch },
            { key: 'dinner', name: '晚餐', icon: '🌙', dishes: menu.dinner }
        ];
        
        meals.forEach(meal => {
            calendarHtml += `<div class="day-meal-section">
                <div class="day-meal-header">
                    <h3>${meal.icon} ${meal.name}</h3>
                    <button class="primary-btn add-meal-btn" data-date="${dateStr}" data-meal="${meal.key}">+ 添加菜品</button>
                </div>
                <div class="day-meal-content">
                    ${meal.dishes.length > 0 ? 
                        `<div class="day-dish-list">
                            ${meal.dishes.map(dish => `<div class="day-dish-item">${dish}</div>`).join('')}
                        </div>` : 
                        `<div class="no-dishes">暂无菜品，点击添加</div>`
                    }
                </div>
            </div>`;
        });
        
        calendarHtml += '</div>';
        container.innerHTML = calendarHtml;
        
        // 添加添加菜品按钮事件
        container.querySelectorAll('.add-meal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const date = e.target.dataset.date;
                const meal = e.target.dataset.meal;
                this.openMenuModal(date, meal);
            });
        });
    }

    // 打开日期选择弹窗
    openDatePickerModal() {
        const modal = document.getElementById('date-picker-modal');
        const dateInput = document.getElementById('date-picker-input');
        
        // 设置默认日期为当前选择的日期
        const formattedDate = this.currentDate.toISOString().split('T')[0];
        dateInput.value = formattedDate;
        
        modal.classList.add('active');
    }
    
    // 关闭日期选择弹窗
    closeDatePickerModal() {
        const modal = document.getElementById('date-picker-modal');
        modal.classList.remove('active');
    }
    
    // 确认日期选择
    confirmDate() {
        const dateInput = document.getElementById('date-picker-input');
        const selectedDate = new Date(dateInput.value);
        
        if (selectedDate) {
            this.currentDate = selectedDate;
            this.renderMenuCalendar();
            this.closeDatePickerModal();
        }
    }
    
    // 添加餐次点击事件的通用方法
    addMealClickEvents() {
        document.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayEl => {
            // 为每个餐次指示器添加点击事件
            dayEl.querySelectorAll('.meal-indicator').forEach(mealIndicator => {
                mealIndicator.addEventListener('click', () => {
                    const date = dayEl.dataset.date;
                    const meal = mealIndicator.dataset.meal;
                    this.openMenuModal(date, meal);
                });
            });
            
            // 为日期添加点击修改功能
            dayEl.addEventListener('click', (e) => {
                // 避免与餐次点击事件冲突
                if (!e.target.closest('.meal-indicator')) {
                    const dateStr = dayEl.dataset.date;
                    // 设置当前日期并切换到日视图
                    this.currentDate = new Date(dateStr);
                    this.switchView('day');
                }
            });
        });
    }

    // 打开菜单模态框（支持早中晚三餐点选，可选择特定餐次）
    openMenuModal(date, meal = null) {
        // 初始化菜单结构（早中晚三餐）
        if (!this.menus[date]) {
            this.menus[date] = {
                breakfast: [],
                lunch: [],
                dinner: []
            };
        }
        const menu = this.menus[date];
        
        // 检查是否已存在菜单模态框，如果存在则移除
        const existingModal = document.getElementById('menu-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 创建菜单模态框
        const modal = document.createElement('div');
        modal.id = 'menu-modal';
        modal.className = 'modal active';
        
        // 根据meal参数决定显示哪些餐次
        let mealSections = '';
        if (meal) {
            // 只显示指定餐次
            const mealInfo = {
                breakfast: { icon: '🍞', name: '早餐' },
                lunch: { icon: '🍚', name: '午餐' },
                dinner: { icon: '🌙', name: '晚餐' }
            };
            
            // 根据餐次过滤菜品
            const baseDishes = meal === 'breakfast' 
                ? this.dishes.filter(dish => dish.category === '早餐')
                : this.dishes.filter(dish => dish.category !== '早餐');
            
            let dishSelectorHtml = '';
            
            if (meal === 'breakfast') {
                // 早餐直接显示所有早餐菜品
                dishSelectorHtml = `${baseDishes.map(dish => {
                    const isSelected = menu[meal].includes(dish.name);
                    return `<button class="dish-select-btn ${isSelected ? 'selected' : ''}" data-meal="${meal}" data-dish-id="${dish.id}">${dish.name}</button>`;
                }).join('')}`;
            } else {
                // 午餐和晚餐按分类组织菜品
                // 获取当前餐次可用的分类（排除早餐）
                const availableCategories = [...new Set(this.dishes.filter(d => d.category !== '早餐').map(d => d.category))];
                
                availableCategories.forEach(category => {
                    // 按分类过滤菜品
                    const categoryDishes = baseDishes.filter(dish => dish.category === category);
                    if (categoryDishes.length > 0) {
                        dishSelectorHtml += `
                            <div class="selector-category">
                                <div class="selector-category-title">${category}</div>
                                <div class="selector-category-items">
                                    ${categoryDishes.map(dish => {
                                        const isSelected = menu[meal].includes(dish.name);
                                        return `<button class="dish-select-btn ${isSelected ? 'selected' : ''}" data-meal="${meal}" data-dish-id="${dish.id}">${dish.name}</button>`;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }
                });
            }
            
            mealSections = `
                <div class="meal-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4>${mealInfo[meal].icon} ${mealInfo[meal].name}</h4>
                        <button class="secondary-btn random-dish-btn" data-meal="${meal}">🎲 随机添加</button>
                    </div>
                    <div class="selected-dishes" id="${meal}-dishes">
                        ${menu[meal].map(dish => `<span class="selected-dish-tag">${dish}<button class="remove-dish" data-meal="${meal}" data-dish="${dish}">×</button></span>`).join('')}
                    </div>
                    <div class="dish-selector" id="${meal}-selector">
                        ${dishSelectorHtml}
                    </div>
                </div>
            `;
        } else {
            // 早餐直接显示所有早餐菜品
            const breakfastDishes = this.dishes.filter(dish => dish.category === '早餐');
            
            // 获取可用分类（排除早餐）
            const availableCategories = [...new Set(this.dishes.filter(d => d.category !== '早餐').map(d => d.category))];
            
            // 生成午餐菜品选择器（按分类）
            let lunchSelectorHtml = '';
            availableCategories.forEach(category => {
                const categoryDishes = this.dishes.filter(dish => dish.category === category);
                if (categoryDishes.length > 0) {
                    lunchSelectorHtml += `
                        <div class="selector-category">
                            <div class="selector-category-title">${category}</div>
                            <div class="selector-category-items">
                                ${categoryDishes.map(dish => {
                                    const isSelected = menu.lunch.includes(dish.name);
                                    return `<button class="dish-select-btn ${isSelected ? 'selected' : ''}" data-meal="lunch" data-dish-id="${dish.id}">${dish.name}</button>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }
            });
            
            // 生成晚餐菜品选择器（按分类）
            let dinnerSelectorHtml = '';
            availableCategories.forEach(category => {
                const categoryDishes = this.dishes.filter(dish => dish.category === category);
                if (categoryDishes.length > 0) {
                    dinnerSelectorHtml += `
                        <div class="selector-category">
                            <div class="selector-category-title">${category}</div>
                            <div class="selector-category-items">
                                ${categoryDishes.map(dish => {
                                    const isSelected = menu.dinner.includes(dish.name);
                                    return `<button class="dish-select-btn ${isSelected ? 'selected' : ''}" data-meal="dinner" data-dish-id="${dish.id}">${dish.name}</button>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }
            });
            
            mealSections = `
                <!-- 早餐 -->
                <div class="meal-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4>🍞 早餐</h4>
                        <button class="secondary-btn random-dish-btn" data-meal="breakfast">🎲 随机添加</button>
                    </div>
                    <div class="selected-dishes" id="breakfast-dishes">
                        ${menu.breakfast.map(dish => `<span class="selected-dish-tag">${dish}<button class="remove-dish" data-meal="breakfast" data-dish="${dish}">×</button></span>`).join('')}
                    </div>
                    <div class="dish-selector" id="breakfast-selector">
                        ${breakfastDishes.map(dish => `<button class="dish-select-btn ${menu.breakfast.includes(dish.name) ? 'selected' : ''}" data-meal="breakfast" data-dish-id="${dish.id}">${dish.name}</button>`).join('')}
                    </div>
                </div>
                
                <!-- 午餐 -->
                <div class="meal-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4>🍚 午餐</h4>
                        <button class="secondary-btn random-dish-btn" data-meal="lunch">🎲 随机添加</button>
                    </div>
                    <div class="selected-dishes" id="lunch-dishes">
                        ${menu.lunch.map(dish => `<span class="selected-dish-tag">${dish}<button class="remove-dish" data-meal="lunch" data-dish="${dish}">×</button></span>`).join('')}
                    </div>
                    <div class="dish-selector" id="lunch-selector">
                        ${lunchSelectorHtml}
                    </div>
                </div>
                
                <!-- 晚餐 -->
                <div class="meal-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4>🌙 晚餐</h4>
                        <button class="secondary-btn random-dish-btn" data-meal="dinner">🎲 随机添加</button>
                    </div>
                    <div class="selected-dishes" id="dinner-dishes">
                        ${menu.dinner.map(dish => `<span class="selected-dish-tag">${dish}<button class="remove-dish" data-meal="dinner" data-dish="${dish}">×</button></span>`).join('')}
                    </div>
                    <div class="dish-selector" id="dinner-selector">
                        ${dinnerSelectorHtml}
                    </div>
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>设置菜单 - ${date}</h3>
                    <button class="close-btn" id="close-menu-modal">×</button>
                </div>
                <div class="modal-body">
                    ${mealSections}
                </div>
                <div class="modal-footer">
                    <button id="save-menu-btn" class="primary-btn">保存菜单</button>
                    <button id="cancel-menu-btn" class="secondary-btn">取消</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 保存菜单
        document.getElementById('save-menu-btn').addEventListener('click', () => {
            this.saveData('menus', this.menus);
            this.renderMenuCalendar();
            modal.remove();
        });
        
        // 取消
        document.getElementById('cancel-menu-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        // 关闭按钮
        document.getElementById('close-menu-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // 事件委托处理菜品选择
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('dish-select-btn')) {
                const targetMeal = e.target.dataset.meal;
                const dishId = e.target.dataset.dishId;
                const dish = this.dishes.find(d => d.id === dishId);
                if (dish && !menu[targetMeal].includes(dish.name)) {
                    menu[targetMeal].push(dish.name);
                    // 重新渲染模态框前先移除当前模态框
                    modal.remove();
                    this.openMenuModal(date, meal); // 重新渲染模态框，保持当前餐次选择
                }
            } else if (e.target.classList.contains('remove-dish')) {
                const targetMeal = e.target.dataset.meal;
                const dishName = e.target.dataset.dish;
                menu[targetMeal] = menu[targetMeal].filter(d => d !== dishName);
                // 重新渲染模态框前先移除当前模态框
                modal.remove();
                this.openMenuModal(date, meal); // 重新渲染模态框，保持当前餐次选择
            } else if (e.target.classList.contains('random-dish-btn')) {
                const targetMeal = e.target.dataset.meal;
                
                // 根据餐次过滤可用菜品
                let availableDishes;
                if (targetMeal === 'breakfast') {
                    // 早餐只能选择早餐分类的菜品
                    availableDishes = this.dishes.filter(dish => dish.category === '早餐');
                } else {
                    // 午餐和晚餐不能选择早餐分类的菜品
                    availableDishes = this.dishes.filter(dish => dish.category !== '早餐');
                }
                
                if (availableDishes.length === 0) {
                    alert('当前餐次没有可用菜品，请先在菜品库中添加对应分类的菜品');
                    return;
                }
                
                // 过滤掉已选择的菜品，避免重复添加
                const selectedDishNames = menu[targetMeal];
                const unselectedDishes = availableDishes.filter(dish => !selectedDishNames.includes(dish.name));
                
                if (unselectedDishes.length === 0) {
                    alert('当前餐次已选择所有可用菜品');
                    return;
                }
                
                // 随机选择一个未选择的菜品
                const randomIndex = Math.floor(Math.random() * unselectedDishes.length);
                const randomDish = unselectedDishes[randomIndex];
                
                // 添加到当前餐次
                menu[targetMeal].push(randomDish.name);
                
                // 重新渲染模态框
                modal.remove();
                this.openMenuModal(date, meal);
            } else if (e.target === modal) {
                // 点击模态框外部关闭
                modal.remove();
            }
        });
    }

    // 导出数据
    exportData() {
        const data = {
            dishes: this.dishes,
            menus: this.menus,
            categories: this.categories,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `家庭菜单数据_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 导入数据
    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('确定要导入数据吗？这将覆盖现有数据。')) {
                    if (data.dishes) {
                        this.dishes = data.dishes;
                        this.saveData('dishes', this.dishes);
                    }
                    if (data.menus) {
                        this.menus = data.menus;
                        this.saveData('menus', this.menus);
                    }
                    if (data.categories) {
                        this.categories = data.categories;
                        this.saveData('categories', this.categories);
                        this.updateCategorySelect();
                    }

                    // 重新渲染所有组件
                    this.renderDishLibrary();
                    this.renderMenuCalendar();
                    
                    alert('数据导入成功！');
                }
            } catch (e) {
                alert('数据导入失败，请检查文件格式是否正确。');
            }
        };
        reader.readAsText(file);
    }
}

// 确保DOM加载完成后再初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new MenuApp();
});