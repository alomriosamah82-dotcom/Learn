// ===== المتغيرات العامة =====
let currentSection = 'dashboard';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentTheme = localStorage.getItem('theme') || 'dark';
let searchTimeout = null;
let platformData = {}; // سيتم تعبئته من الملفات الخارجية

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل تطبيق دليلك التعليمي والعملي...');
    initializeApp();
});

async function initializeApp() {
    try {
        // تهيئة الوضع اللوني
        setTheme(currentTheme);
        
        // تحميل البيانات من الملفات الخارجية
        await loadExternalData();
        
        // إعداد المستمعين للأحداث
        setupEventListeners();
        
        // تحميل لوحة التحكم كصفحة رئيسية
        switchSection('dashboard');
        
        // تحديث عداد المفضلة
        updateFavoritesCount();
        
        // إظهار شاشة الترحيب
        showWelcomeScreen();
        
        // تهيئة إحصائيات لوحة التحكم
        initializeDashboardStats();
        
        // تهيئة شريط الإجراءات السفلي
        initializeBottomActionBar();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'danger');
    }
}

function initializeBottomActionBar() {
    const bottomActionBar = document.createElement('div');
    bottomActionBar.className = 'bottom-action-bar';
    bottomActionBar.innerHTML = `
        <div class="bottom-action-content">
            <div class="bottom-search-container">
                <input type="text" class="bottom-search-input" id="bottom-search-input" placeholder="ابحث هنا...">
            </div>
            <div class="bottom-actions">
                <button class="bottom-action-btn" id="bottom-search-btn">
                    <i class="fas fa-search"></i>
                </button>
                <button class="bottom-action-btn" id="bottom-favorites-btn">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="bottom-action-btn" id="bottom-theme-toggle">
                    <i class="fas fa-moon"></i>
                </button>
                <button class="bottom-action-btn bottom-menu-btn" id="bottom-sidebar-toggle">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(bottomActionBar);
    
    // ربط الأحداث
    document.getElementById('bottom-search-input').addEventListener('input', function(e) {
        document.getElementById('search-input').value = this.value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });
    
    document.getElementById('bottom-search-btn').addEventListener('click', performSearch);
    document.getElementById('bottom-favorites-btn').addEventListener('click', showFavoritesModal);
    document.getElementById('bottom-theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('bottom-sidebar-toggle').addEventListener('click', toggleSidebar);
    
    // مزامنة الحقول
    document.getElementById('search-input').addEventListener('input', function(e) {
        document.getElementById('bottom-search-input').value = this.value;
    });
}

async function loadExternalData() {
    try {
        // هذه الدالة ستحمل البيانات من الملفات الخارجية
        // سنفترض أن الملفات موجودة ومحمولة بشكل صحيح
        
        // إذا كانت البيانات غير محملة بعد، نستخدم بيانات افتراضية مؤقتة
        if (Object.keys(platformData).length === 0) {
            console.warn('⚠️ البيانات الخارجية غير محملة، استخدام بيانات افتراضية مؤقتة');
            platformData = await getFallbackData();
        }
        
        console.log('✅ تم تحميل البيانات الخارجية بنجاح');
        console.log('📊 إحصائيات البيانات:');
        Object.keys(platformData).forEach(section => {
            console.log(`   - ${section}: ${platformData[section]?.length || 0} عنصر`);
        });
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات الخارجية:', error);
        platformData = await getFallbackData();
    }
}

async function getFallbackData() {
    // بيانات افتراضية مؤقتة في حال فشل تحميل الملفات الخارجية
    return {
        learning: [
            {
                id: 1,
                name: 'منصة تعليمية افتراضية',
                logo: 'fas fa-graduation-cap',
                description: 'منصة شاملة للتعلم الإلكتروني',
                features: ['دورات متعددة', 'شهادات معتمدة', 'دعم عربي'],
                category: 'تعليم',
                language: 'عربي/إنجليزي',
                level: 'مبتدئ - متقدم',
                conditions: 'مجاني بالكامل',
                usage: 'تعلم المهارات التقنية',
                link: '#'
            }
        ],
        youtube: [
            {
                id: 1,
                name: 'قناة يوتيوب تعليمية',
                logo: 'fab fa-youtube',
                description: 'قناة متخصصة في البرمجة',
                features: ['دروس مجانية', 'مشاريع عملية', 'شرح واضح'],
                category: 'تعليم',
                language: 'عربي',
                level: 'جميع المستويات',
                conditions: 'مجاني',
                usage: 'تعلم البرمجة',
                link: '#'
            }
        ],
        work: [
            {
                id: 1,
                name: 'منصة عمل حر',
                logo: 'fas fa-briefcase',
                description: 'منصة للعمل الحر والمشاريع',
                features: ['فرص عمل', 'مدفوعات آمنة', 'تقييمات'],
                category: 'عمل',
                language: 'متعدد',
                level: 'جميع المستويات',
                conditions: 'عمولة على المشاريع',
                usage: 'العمل الحر',
                link: '#'
            }
        ],
        tools: [
            {
                id: 1,
                name: 'أداة تطوير',
                logo: 'fas fa-tools',
                description: 'أداة مساعدة للمطورين',
                features: ['مجانية', 'سهلة الاستخدام', 'نتائج فورية'],
                category: 'أدوات',
                language: 'إنجليزي',
                level: 'متوسط',
                conditions: 'مجانية',
                usage: 'تطوير الويب',
                link: '#'
            }
        ],
        tests: []
    };
}

function setupEventListeners() {
    try {
        // زر البدء من شاشة الترحيب
        document.getElementById('start-btn').addEventListener('click', showDashboard);
        
        // زر القائمة الجانبية
        document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
        
        // زر إغلاق القائمة الجانبية
        document.getElementById('sidebar-close').addEventListener('click', toggleSidebar);
        
        // روابط القائمة الجانبية
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                if (section) {
                    switchSection(section);
                    toggleSidebar(); // إغلاق القائمة بعد النقر
                }
            });
        });
        
        // روابط سريعة في لوحة التحكم
        document.querySelectorAll('.quick-link-card').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                if (section) {
                    switchSection(section);
                }
            });
        });
        
        // زر تبديل الوضع الداكن/الفاتح
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        
        // زر المفضلة
        document.getElementById('favorites-btn').addEventListener('click', showFavoritesModal);
        
        // البحث
        document.getElementById('search-btn').addEventListener('click', performSearch);
        document.getElementById('search-input').addEventListener('input', function(e) {
            // بحث فوري مع تأخير
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch();
            }, 300);
        });
        
        // إغلاق النوافذ المنبثقة عند النقر خارجها
        setupModalCloseListeners();
        
        // إغلاق القائمة الجانبية عند النقر خارجها
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sidebar');
            const toggleBtn = document.getElementById('sidebar-toggle');
            
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                toggleSidebar();
            }
        });
        
        // التعامل مع أخطاء الشبكة
        window.addEventListener('online', function() {
            showToast('تم استعادة الاتصال بالإنترنت', 'success');
        });
        
        window.addEventListener('offline', function() {
            showToast('فقدان الاتصال بالإنترنت', 'warning');
        });
        
        console.log('✅ تم إعداد مستمعي الأحداث بنجاح');
    } catch (error) {
        console.error('❌ خطأ في إعداد مستمعي الأحداث:', error);
    }
}

function setupModalCloseListeners() {
    // إغلاق النوافذ المنبثقة عند النقر على الأزرار
    document.querySelectorAll('.btn-close, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            }
        });
    });
}

// ===== إدارة الأقسام =====
function switchSection(section) {
    try {
        console.log(`🔄 التبديل إلى قسم: ${section}`);
        
        // تحديث القائمة الجانبية
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // إخفاء جميع الأقسام
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        // إظهار القسم المحدد
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`✅ تم إظهار قسم: ${section}`);
            
            // تحميل محتوى القسم إذا لزم الأمر
            loadSectionContent(section);
        } else {
            console.error(`❌ لم يتم العثور على القسم: ${section}`);
        }
        
        // تحديث القسم الحالي
        currentSection = section;
        
        // إعادة تعيين البحث إذا كان القسم لا يدعمه
        if (section === 'dashboard' || section === 'about') {
            document.getElementById('search-input').value = '';
            document.getElementById('bottom-search-input').value = '';
        }
        
        // إغلاق القائمة الجانبية على الأجهزة المحمولة
        if (window.innerWidth < 992) {
            toggleSidebar(false);
        }
        
    } catch (error) {
        console.error('❌ خطأ في تبديل الأقسام:', error);
        showToast('حدث خطأ في تحميل القسم', 'danger');
    }
}

function loadSectionContent(section) {
    try {
        switch(section) {
            case 'learning':
            case 'youtube':
            case 'work':
            case 'tools':
            case 'tests':
                renderCards(section);
                break;
            case 'about':
                // قسم من نحن لا يحتاج تحميل إضافي
                break;
            case 'dashboard':
                // تحديث الإحصائيات
                updateDashboardStats();
                break;
        }
    } catch (error) {
        console.error(`❌ خطأ في تحميل محتوى القسم ${section}:`, error);
    }
}

// ===== إدارة القائمة الجانبية =====
function toggleSidebar(show) {
    try {
        const sidebar = document.getElementById('sidebar');
        if (typeof show === 'boolean') {
            sidebar.classList.toggle('active', show);
        } else {
            sidebar.classList.toggle('active');
        }
        
        // إضافة تأثير الرجوع عند الإغلاق
        if (!sidebar.classList.contains('active')) {
            sidebar.style.animation = 'slideInRight 0.3s reverse';
            setTimeout(() => {
                sidebar.style.animation = '';
            }, 300);
        }
    } catch (error) {
        console.error('❌ خطأ في تبديل القائمة الجانبية:', error);
    }
}

// ===== نظام البطاقات =====
function renderCards(section) {
    try {
        const container = document.getElementById(`${section}-cards`);
        
        if (!container) {
            console.error(`❌ لم يتم العثور على حاوية البطاقات للقسم: ${section}`);
            return;
        }
        
        // التحقق من توفر البيانات
        if (!platformData[section] || !Array.isArray(platformData[section])) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="text-warning">البيانات غير متاحة حالياً</h5>
                    <p class="text-muted">جاري تحميل البيانات...</p>
                </div>
            `;
            return;
        }
        
        const data = platformData[section];
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">لا توجد بيانات متاحة</h5>
                    <p class="text-muted">سيتم إضافة المحتوى قريباً</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        data.forEach(item => {
            const card = createCard(item, section);
            if (card) {
                container.appendChild(card);
            }
        });
        
        console.log(`✅ تم تحميل ${data.length} بطاقة في قسم: ${section}`);
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البطاقات:', error);
        const container = document.getElementById(`${section}-cards`);
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h5 class="text-danger">حدث خطأ في تحميل البيانات</h5>
                    <p class="text-muted">يرجى تحديث الصفحة والمحاولة مرة أخرى</p>
                </div>
            `;
        }
    }
}

function createCard(item, section) {
    try {
        const isFavorite = favorites.some(fav => fav.id === item.id);
        
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="card ${section}-card h-100">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="${item.logo} me-2"></i>
                        ${item.name}
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${item.description}</p>
                    <ul class="features-list">
                        ${item.features.map(feature => `<li><i class="fas fa-check-circle"></i> ${feature}</li>`).join('')}
                    </ul>
                    <div class="mb-3">
                        <span class="category-badge">${item.category}</span>
                        <span class="language-badge">${item.language}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-details" onclick="showDetailsModal(${item.id}, '${section}')">
                        <i class="fas fa-info-circle me-1"></i> التفاصيل
                    </button>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${item.id}, '${section}')">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    } catch (error) {
        console.error('❌ خطأ في إنشاء البطاقة:', error);
        return null;
    }
}

// ===== نافذة التفاصيل المنبثقة =====
function showDetailsModal(id, section) {
    try {
        const data = platformData[section];
        if (!data) {
            console.error(`❌ بيانات القسم غير متاحة: ${section}`);
            showToast('بيانات القسم غير متاحة', 'warning');
            return;
        }
        
        const item = data.find(item => item.id === id);
        if (!item) {
            console.error(`❌ العنصر غير موجود: ${id} في قسم ${section}`);
            showToast('لم يتم العثور على التفاصيل', 'warning');
            return;
        }
        
        const isFavorite = favorites.some(fav => fav.id === id);
        
        document.getElementById('modal-title').textContent = item.name;
        document.getElementById('platform-link').href = item.link;
        
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <div class="platform-details">
                <h6><i class="fas fa-info-circle me-2"></i>الوصف:</h6>
                <p>${item.description}</p>
                
                <h6><i class="fas fa-star me-2"></i>الميزات:</h6>
                <ul class="platform-features">
                    ${item.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                
                <h6><i class="fas fa-bullseye me-2"></i>الاستخدام العملي:</h6>
                <p>${item.usage}</p>
                
                <h6><i class="fas fa-file-alt me-2"></i>شروط المجانية واللغة:</h6>
                <p><strong>الشروط:</strong> ${item.conditions}</p>
                <p><strong>اللغة:</strong> ${item.language}</p>
                
                <h6><i class="fas fa-chart-line me-2"></i>المستوى:</h6>
                <p>${item.level}</p>
                
                <h6><i class="fas fa-tags me-2"></i>التصنيف:</h6>
                <p>${item.category}</p>
            </div>
        `;
        
        const favoriteBtn = document.getElementById('add-to-favorites');
        favoriteBtn.innerHTML = isFavorite ? 
            '<i class="fas fa-heart"></i> إزالة من المفضلة' : 
            '<i class="far fa-heart"></i> إضافة إلى المفضلة';
        
        favoriteBtn.onclick = function() {
            toggleFavorite(id, section);
            const modal = bootstrap.Modal.getInstance(document.getElementById('details-modal'));
            if (modal) modal.hide();
        };
        
        const modal = new bootstrap.Modal(document.getElementById('details-modal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ خطأ في عرض التفاصيل:', error);
        showToast('حدث خطأ في عرض التفاصيل', 'danger');
    }
}

// ===== نظام المفضلة =====
function toggleFavorite(id, section) {
    try {
        const data = platformData[section];
        if (!data) {
            console.error(`❌ بيانات القسم غير متاحة: ${section}`);
            return;
        }
        
        const item = data.find(item => item.id === id);
        if (!item) {
            console.error(`❌ العنصر غير موجود: ${id} في قسم ${section}`);
            return;
        }
        
        const existingIndex = favorites.findIndex(fav => fav.id === id);
        
        if (existingIndex > -1) {
            // إزالة من المفضلة
            favorites.splice(existingIndex, 1);
            showToast('تمت الإزالة من المفضلة', 'warning');
        } else {
            // إضافة إلى المفضلة
            favorites.push({...item, section});
            showToast('تمت الإضافة إلى المفضلة', 'success');
        }
        
        // حفظ في localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // تحديث العداد
        updateFavoritesCount();
        
        // إعادة تحميل البطاقات إذا كان القسم الحالي مرئي
        if (document.getElementById(`${section}-section`).classList.contains('active')) {
            renderCards(section);
        }
        
    } catch (error) {
        console.error('❌ خطأ في إدارة المفضلة:', error);
        showToast('حدث خطأ في إدارة المفضلة', 'danger');
    }
}

function updateFavoritesCount() {
    try {
        const countElement = document.querySelector('.favorites-count');
        if (countElement) {
            countElement.textContent = favorites.length;
        }
    } catch (error) {
        console.error('❌ خطأ في تحديث عداد المفضلة:', error);
    }
}

function showFavoritesModal() {
    try {
        const favoritesList = document.getElementById('favorites-list');
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-heart-broken fa-3x text-muted mb-3"></i>
                    <p class="text-muted">لا توجد عناصر في المفضلة بعد</p>
                </div>
            `;
        } else {
            favoritesList.innerHTML = favorites.map(fav => `
                <div class="favorite-item">
                    <div class="favorite-icon">
                        <i class="${fav.logo}"></i>
                    </div>
                    <div class="favorite-content">
                        <div class="favorite-name">${fav.name}</div>
                        <div class="favorite-category">${fav.category} - ${fav.section}</div>
                    </div>
                    <button class="remove-favorite" onclick="removeFavorite(${fav.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
        
        const modal = new bootstrap.Modal(document.getElementById('favorites-modal'));
        modal.show();
        
    } catch (error) {
        console.error('❌ خطأ في عرض المفضلة:', error);
        showToast('حدث خطأ في عرض المفضلة', 'danger');
    }
}

function removeFavorite(id) {
    try {
        favorites = favorites.filter(fav => fav.id !== id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesCount();
        showFavoritesModal(); // إعادة تحميل القائمة
        showToast('تمت الإزالة من المفضلة', 'warning');
        
        // إعادة تحميل البطاقات في القسم الحالي
        if (currentSection) {
            renderCards(currentSection);
        }
    } catch (error) {
        console.error('❌ خطأ في إزالة المفضلة:', error);
        showToast('حدث خطأ في إزالة العنصر', 'danger');
    }
}

// ===== نظام البحث =====
function performSearch() {
    try {
        const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
        
        if (!searchTerm) {
            // إذا كان البحث فارغاً، إعادة تحميل البطاقات العادية
            renderCards(currentSection);
            return;
        }
        
        const data = platformData[currentSection];
        if (!data || !Array.isArray(data)) {
            console.error('❌ بيانات القسم غير متاحة للبحث');
            return;
        }
        
        const filteredData = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            (item.features && item.features.some(feature => feature.toLowerCase().includes(searchTerm))) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.language.toLowerCase().includes(searchTerm) ||
            item.level.toLowerCase().includes(searchTerm)
        );
        
        const container = document.getElementById(`${currentSection}-cards`);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (filteredData.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">لا توجد نتائج مطابقة للبحث</h5>
                    <p class="text-muted">جرب استخدام كلمات بحث أخرى</p>
                </div>
            `;
        } else {
            filteredData.forEach(item => {
                const card = createCard(item, currentSection);
                container.appendChild(card);
            });
            
            showToast(`تم العثور على ${filteredData.length} نتيجة`, 'info');
        }
    } catch (error) {
        console.error('❌ خطأ في البحث:', error);
        showToast('حدث خطأ في البحث', 'danger');
    }
}

// ===== نظام الوضع الداكن/الفاتح =====
function toggleTheme() {
    try {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    } catch (error) {
        console.error('❌ خطأ في تبديل الوضع:', error);
    }
}

function setTheme(theme) {
    try {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#theme-toggle i');
        const bottomIcon = document.querySelector('#bottom-theme-toggle i');
        
        if (theme === 'dark') {
            if (icon) icon.className = 'fas fa-sun';
            if (bottomIcon) bottomIcon.className = 'fas fa-sun';
        } else {
            if (icon) icon.className = 'fas fa-moon';
            if (bottomIcon) bottomIcon.className = 'fas fa-moon';
        }
    } catch (error) {
        console.error('❌ خطأ في تعيين الوضع:', error);
    }
}

// ===== لوحة التحكم =====
function initializeDashboardStats() {
    // هذه الدالة ستهيئ الإحصائيات عند تحميل الصفحة
    updateDashboardStats();
}

function updateDashboardStats() {
    try {
        // تحديث إحصائيات لوحة التحكم
        const stats = {
            learning: platformData.learning?.length || 0,
            youtube: platformData.youtube?.length || 0,
            work: platformData.work?.length || 0,
            tools: platformData.tools?.length || 0
        };
        
        document.getElementById('learning-count').textContent = stats.learning;
        document.getElementById('youtube-count').textContent = stats.youtube;
        document.getElementById('work-count').textContent = stats.work;
        document.getElementById('tools-count').textContent = stats.tools;
        
        console.log('📊 تم تحديث إحصائيات لوحة التحكم:', stats);
        
    } catch (error) {
        console.error('❌ خطأ في تحديث إحصائيات لوحة التحكم:', error);
    }
}

// ===== نظام الإشعارات =====
function showToast(message, type = 'info') {
    try {
        const toastContainer = document.getElementById('toast-container');
        const toastId = 'toast-' + Date.now();
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.setAttribute('id', toastId);
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        
        bsToast.show();
        
        // إزالة التوست من DOM بعد الاختفاء
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    } catch (error) {
        console.error('❌ خطأ في عرض الإشعار:', error);
    }
}

// ===== إدارة الشاشات =====
function showWelcomeScreen() {
    try {
        document.getElementById('welcome-screen').classList.remove('d-none');
        document.getElementById('dashboard').classList.add('d-none');
    } catch (error) {
        console.error('❌ خطأ في عرض شاشة الترحيب:', error);
    }
}

function showDashboard() {
    try {
        document.getElementById('welcome-screen').classList.add('d-none');
        document.getElementById('dashboard').classList.remove('d-none');
    } catch (error) {
        console.error('❌ خطأ في عرض لوحة التحكم:', error);
    }
}

// ===== وظائف مساعدة =====
function formatNumber(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
        return num;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== تهيئة مكونات Bootstrap =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        // تهيئة جميع الأدوات المنبثقة
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    } catch (error) {
        console.error('❌ خطأ في تهيئة أدوات Bootstrap:', error);
    }
});

// ===== API لتحميل البيانات الخارجية =====
// هذه الدوال ستسمح لملفات البيانات الخارجية بتحديث البيانات
window.updatePlatformData = function(section, data) {
    try {
        if (!platformData[section]) {
            platformData[section] = [];
        }
        platformData[section] = data;
        console.log(`✅ تم تحديث بيانات قسم ${section}: ${data.length} عنصر`);
        
        // إذا كان القسم الحالي هو الذي تم تحديثه، إعادة تحميل البطاقات
        if (currentSection === section) {
            renderCards(section);
        }
        
        // تحديث إحصائيات لوحة التحكم
        if (section === 'dashboard') {
            updateDashboardStats();
        }
    } catch (error) {
        console.error(`❌ خطأ في تحديث بيانات القسم ${section}:`, error);
    }
};

window.getPlatformData = function(section) {
    return platformData[section] || [];
};

window.getCurrentSection = function() {
    return currentSection;
};

// ===== جعل الدوال متاحة عالمياً =====
window.switchSection = switchSection;
window.showDetailsModal = showDetailsModal;
window.toggleFavorite = toggleFavorite;
window.removeFavorite = removeFavorite;
window.performSearch = performSearch;
window.toggleTheme = toggleTheme;
window.toggleSidebar = toggleSidebar;

// ===== تسجيل معلومات التطبيق =====
console.log('✅ تم تحميل تطبيق دليلك التعليمي والعملي بنجاح');
console.log('💡 يمكن للملفات الخارجية استخدام:');
console.log('   - window.updatePlatformData(section, data) لتحديث البيانات');
console.log('   - window.getPlatformData(section) للحصول على البيانات');
console.log('   - window.getCurrentSection() لمعرفة القسم الحالي');
// ===== تحسين تهيئة الوضع الفاتح =====
function enhanceLightTheme() {
    if (currentTheme === 'light') {
        // إضافة كلاس إضافي للوضع الفاتح المحسن
        document.documentElement.classList.add('light-enhanced');
        
        // تحميل خطوط إضافية للوضع الفاتح إذا لزم الأمر
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
        
        console.log('✅ تم تحسين الوضع الفاتح بنجاح');
    }
}

// استدعاء الدالة في initializeApp
// أضف هذا السطر في دالة initializeApp بعد setTheme(currentTheme)
// enhanceLightTheme();