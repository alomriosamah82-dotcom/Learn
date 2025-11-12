// ===== لوحة التحكم - Dashboard Module =====
const Dashboard = (function() {
    // المتغيرات الخاصة
    let dashboardInitialized = false;
    let statsData = {
        learning: 0,
        youtube: 0,
        work: 0,
        tools: 0,
        tests: 0,
        favorites: 0
    };

    // ===== الوظائف العامة =====
    return {
        // تهيئة لوحة التحكم
        init: function() {
            try {
                if (dashboardInitialized) {
                    console.log('🔄 لوحة التحكم مُهيأة مسبقاً');
                    return;
                }

                console.log('🚀 تهيئة لوحة التحكم...');
                
                // إعداد مستمعي الأحداث الخاصة باللوحة
                this.setupDashboardEvents();
                
                // تحديث الإحصائيات
                this.updateStats();
                
                // تحميل البيانات الأولية
                this.loadInitialData();
                
                dashboardInitialized = true;
                console.log('✅ تم تهيئة لوحة التحكم بنجاح');
                
            } catch (error) {
                console.error('❌ خطأ في تهيئة لوحة التحكم:', error);
            }
        },

        // إعداد مستمعي الأحداث الخاصة باللوحة
        setupDashboardEvents: function() {
            try {
                // تحديث الإحصائيات عند فتح لوحة التحكم
                document.addEventListener('sectionChanged', (event) => {
                    if (event.detail.section === 'dashboard') {
                        this.updateStats();
                    }
                });

                // تحديث الإحصائيات عند تغيير المفضلة
                document.addEventListener('favoritesUpdated', () => {
                    this.updateFavoritesCount();
                });

                // زر تحديث الإحصائيات
                const refreshBtn = document.getElementById('refresh-stats');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', () => {
                        this.updateStats(true);
                    });
                }

                // أحداث للروابط السريعة
                this.setupQuickLinksEvents();

                console.log('✅ تم إعداد أحداث لوحة التحكم');
            } catch (error) {
                console.error('❌ خطأ في إعداد أحداث لوحة التحكم:', error);
            }
        },

        // إعداد أحداث الروابط السريعة
        setupQuickLinksEvents: function() {
            try {
                const quickLinks = document.querySelectorAll('.quick-link-card');
                quickLinks.forEach(link => {
                    link.addEventListener('mouseenter', function() {
                        this.style.transform = 'translateY(-5px) scale(1.02)';
                    });
                    
                    link.addEventListener('mouseleave', function() {
                        this.style.transform = 'translateY(0) scale(1)';
                    });
                });
            } catch (error) {
                console.error('❌ خطأ في إعداد أحداث الروابط السريعة:', error);
            }
        },

        // تحديث الإحصائيات
        updateStats: function(forceRefresh = false) {
            try {
                console.log('📊 تحديث إحصائيات لوحة التحكم...');
                
                // جمع البيانات من الأقسام المختلفة
                this.collectStatsData();
                
                // تحديث واجهة المستخدم
                this.updateStatsUI();
                
                // تحديث الرسوم البيانية إذا كانت موجودة
                this.updateCharts();
                
                // إظهار رسالة نجاح إذا كان التحديث قسرياً
                if (forceRefresh) {
                    this.showNotification('تم تحديث الإحصائيات بنجاح', 'success');
                }
                
            } catch (error) {
                console.error('❌ خطأ في تحديث الإحصائيات:', error);
                this.showNotification('حدث خطأ في تحديث الإحصائيات', 'error');
            }
        },

        // جمع بيانات الإحصائيات
        collectStatsData: function() {
            try {
                // الحصول على البيانات من platformData العالمي
                const platformData = window.getPlatformData?.() || {};
                
                statsData.learning = platformData.learning?.length || 0;
                statsData.youtube = platformData.youtube?.length || 0;
                statsData.work = platformData.work?.length || 0;
                statsData.tools = platformData.tools?.length || 0;
                statsData.tests = platformData.tests?.length || 0;
                
                // الحصول على عدد المفضلة من localStorage
                this.updateFavoritesCount();
                
                console.log('📈 بيانات الإحصائيات المجمعة:', statsData);
                
            } catch (error) {
                console.error('❌ خطأ في جمع بيانات الإحصائيات:', error);
            }
        },

        // تحديث واجهة الإحصائيات
        updateStatsUI: function() {
            try {
                // تحديث أرقام الإحصائيات
                document.getElementById('learning-count').textContent = this.formatNumber(statsData.learning);
                document.getElementById('youtube-count').textContent = this.formatNumber(statsData.youtube);
                document.getElementById('work-count').textContent = this.formatNumber(statsData.work);
                document.getElementById('tools-count').textContent = this.formatNumber(statsData.tools);
                
                // إضافة تأثيرات على البطاقات الإحصائية
                this.animateStatsCards();
                
                // تحديث النص البديل للإحصائيات
                this.updateStatsAltText();
                
            } catch (error) {
                console.error('❌ خطأ في تحديث واجهة الإحصائيات:', error);
            }
        },

        // تحديث عدد المفضلة
        updateFavoritesCount: function() {
            try {
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                statsData.favorites = favorites.length;
                
                // تحديث العداد في لوحة التحكم إذا كان موجوداً
                const favoritesCountElement = document.getElementById('dashboard-favorites-count');
                if (favoritesCountElement) {
                    favoritesCountElement.textContent = this.formatNumber(statsData.favorites);
                }
                
            } catch (error) {
                console.error('❌ خطأ في تحديث عدد المفضلة:', error);
            }
        },

        // تحميل البيانات الأولية
        loadInitialData: function() {
            try {
                // يمكن إضافة تحميل بيانات إضافية هنا
                console.log('📥 تحميل البيانات الأولية للوحة التحكم...');
                
                // محاكاة تحميل بيانات إضافية
                setTimeout(() => {
                    this.loadAdditionalData();
                }, 1000);
                
            } catch (error) {
                console.error('❌ خطأ في تحميل البيانات الأولية:', error);
            }
        },

        // تحميل بيانات إضافية
        loadAdditionalData: function() {
            try {
                // يمكن إضافة تحميل بيانات إضافية مثل:
                // - الإحصائيات الشهرية
                // - بيانات الاستخدام
                // - التحديثات الأخيرة
                
                console.log('✅ تم تحميل البيانات الإضافية للوحة التحكم');
                
            } catch (error) {
                console.error('❌ خطأ في تحميل البيانات الإضافية:', error);
            }
        },

        // تحديث الرسوم البيانية
        updateCharts: function() {
            try {
                // إذا كانت هناك رسوم بيانية في لوحة التحكم، سيتم تحديثها هنا
                // يمكن إضافة مكتبات مثل Chart.js هنا
                
                this.updateStatsChart();
                this.updateCategoryChart();
                
            } catch (error) {
                console.error('❌ خطأ في تحديث الرسوم البيانية:', error);
            }
        },

        // تحديث مخطط الإحصائيات
        updateStatsChart: function() {
            try {
                // تنفيذ مخطط الإحصائيات سيتم هنا
                // هذا مكان لوضع كود Chart.js أو أي مكتبة رسوم بيانية
                
                console.log('📈 تحديث مخطط الإحصائيات');
                
            } catch (error) {
                console.error('❌ خطأ في تحديث مخطط الإحصائيات:', error);
            }
        },

        // تحديث مخطط التصنيفات
        updateCategoryChart: function() {
            try {
                // تنفيذ مخطط التصنيفات سيتم هنا
                
                console.log('📊 تحديث مخطط التصنيفات');
                
            } catch (error) {
                console.error('❌ خطأ في تحديث مخطط التصنيفات:', error);
            }
        },

        // إضافة تأثيرات على بطاقات الإحصائيات
        animateStatsCards: function() {
            try {
                const statCards = document.querySelectorAll('.stat-card');
                statCards.forEach((card, index) => {
                    // تأخير متدرج للحركات
                    setTimeout(() => {
                        card.style.transform = 'translateY(0)';
                        card.style.opacity = '1';
                    }, index * 100);
                });
            } catch (error) {
                console.error('❌ خطأ في تأثيرات بطاقات الإحصائيات:', error);
            }
        },

        // تحديث النص البديل للإحصائيات
        updateStatsAltText: function() {
            try {
                const totalItems = statsData.learning + statsData.youtube + statsData.work + statsData.tools + statsData.tests;
                const altTextElement = document.getElementById('stats-alt-text');
                
                if (altTextElement) {
                    if (totalItems === 0) {
                        altTextElement.textContent = 'لا توجد بيانات متاحة حالياً';
                        altTextElement.className = 'text-muted';
                    } else {
                        altTextElement.textContent = `إجمالي العناصر المتاحة: ${this.formatNumber(totalItems)}`;
                        altTextElement.className = 'text-success';
                    }
                }
            } catch (error) {
                console.error('❌ خطأ في تحديث النص البديل:', error);
            }
        },

        // عرض إشعار
        showNotification: function(message, type = 'info') {
            try {
                // استخدام نظام الإشعارات الموجود في main.js
                if (window.showToast) {
                    window.showToast(message, type);
                } else {
                    // بديل إذا لم يكن نظام الإشعارات متاحاً
                    console.log(`🔔 ${type.toUpperCase()}: ${message}`);
                }
            } catch (error) {
                console.error('❌ خطأ في عرض الإشعار:', error);
            }
        },

        // تنسيق الأرقام
        formatNumber: function(num) {
            try {
                return new Intl.NumberFormat('ar-EG').format(num);
            } catch (error) {
                return num.toString();
            }
        },

        // الحصول على بيانات الإحصائيات
        getStats: function() {
            return { ...statsData };
        },

        // إعادة تعيين لوحة التحكم
        reset: function() {
            try {
                dashboardInitialized = false;
                statsData = {
                    learning: 0,
                    youtube: 0,
                    work: 0,
                    tools: 0,
                    tests: 0,
                    favorites: 0
                };
                console.log('🔄 تم إعادة تعيين لوحة التحكم');
            } catch (error) {
                console.error('❌ خطأ في إعادة تعيين لوحة التحكم:', error);
            }
        },

        // تصدير بيانات لوحة التحكم
        exportData: function() {
            try {
                const data = {
                    stats: this.getStats(),
                    timestamp: new Date().toISOString(),
                    version: '1.0.0'
                };
                
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                
                // إنشاء رابط تحميل
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                this.showNotification('تم تصدير بيانات لوحة التحكم بنجاح', 'success');
                
            } catch (error) {
                console.error('❌ خطأ في تصدير البيانات:', error);
                this.showNotification('حدث خطأ في تصدير البيانات', 'error');
            }
        },

        // استيراد بيانات لوحة التحكم
        importData: function(file) {
            try {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // التحقق من صحة البيانات
                        if (this.validateImportedData(importedData)) {
                            // تطبيق البيانات المستوردة
                            this.applyImportedData(importedData);
                            this.showNotification('تم استيراد البيانات بنجاح', 'success');
                        } else {
                            this.showNotification('بيانات غير صالحة', 'error');
                        }
                    } catch (parseError) {
                        console.error('❌ خطأ في تحليل البيانات:', parseError);
                        this.showNotification('خطأ في تحليل البيانات', 'error');
                    }
                };
                
                reader.readAsText(file);
                
            } catch (error) {
                console.error('❌ خطأ في استيراد البيانات:', error);
                this.showNotification('حدث خطأ في استيراد البيانات', 'error');
            }
        },

        // التحقق من صحة البيانات المستوردة
        validateImportedData: function(data) {
            try {
                return data &&
                       data.stats &&
                       typeof data.stats.learning === 'number' &&
                       typeof data.stats.youtube === 'number' &&
                       typeof data.stats.work === 'number' &&
                       typeof data.stats.tools === 'number' &&
                       typeof data.stats.tests === 'number' &&
                       typeof data.stats.favorites === 'number';
            } catch (error) {
                return false;
            }
        },

        // تطبيق البيانات المستوردة
        applyImportedData: function(data) {
            try {
                statsData = { ...data.stats };
                this.updateStatsUI();
                console.log('✅ تم تطبيق البيانات المستوردة:', data);
            } catch (error) {
                console.error('❌ خطأ في تطبيق البيانات المستوردة:', error);
                throw error;
            }
        }
    };
})();

// ===== تهيئة لوحة التحكم عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 تحميل لوحة التحكم...');
    
    // تأخير بسيط لضمان تحميل جميع المكونات
    setTimeout(() => {
        Dashboard.init();
    }, 100);
});

// ===== التعامل مع أحداث التبويب =====
document.addEventListener('sectionChanged', function(event) {
    if (event.detail.section === 'dashboard') {
        console.log('🎯 تفعيل لوحة التحكم...');
        Dashboard.updateStats();
    }
});

// ===== جعل Dashboard متاحاً globally =====
window.Dashboard = Dashboard;

// ===== تسجيل معلومات لوحة التحكم =====
console.log('✅ تم تحميل لوحة التحكم بنجاح');
console.log('💡 الوظائف المتاحة:');
console.log('   - Dashboard.init() - تهيئة اللوحة');
console.log('   - Dashboard.updateStats() - تحديث الإحصائيات');
console.log('   - Dashboard.getStats() - الحصول على الإحصائيات');
console.log('   - Dashboard.exportData() - تصدير البيانات');
console.log('   - Dashboard.importData(file) - استيراد البيانات');