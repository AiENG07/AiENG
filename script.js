 // 配置常量
 const PAGE_SIZE = 10;
 let currentPage = 1;
 let allArticles = [];
 const maxVisiblePages = 5;

 // 初始化数据
 function initData() {
     for (let i = 1; i <= 90; i++) {
         allArticles.push({
             title: `文章标题 ${i}`,
             content: `这是第${i}篇示例文章内容，主要演示分页功能...`,
             tags: ['标签' + (i % 5 + 1)],
             image: `https://picsum.photos/800/400?random=${i}`
         });
     }
 }

 // 渲染分页组件
 function renderPagination(total) {
     const totalPages = Math.ceil(total / PAGE_SIZE);
     const container = document.getElementById('pagination');
     let startPage, endPage;

     if (totalPages <= maxVisiblePages) {
         startPage = 1;
         endPage = totalPages;
     } else {
         const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
         const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

         if (currentPage <= maxPagesBeforeCurrent) {
             startPage = 1;
             endPage = maxVisiblePages;
         } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
             startPage = totalPages - maxVisiblePages + 1;
             endPage = totalPages;
         } else {
             startPage = currentPage - maxPagesBeforeCurrent;
             endPage = currentPage + maxPagesAfterCurrent;
         }
     }

     let html = `
         <button class="page-item ${currentPage === 1 ? 'disabled' : ''}" 
             onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
             <i class="fas fa-chevron-left"></i>
         </button>`;

     for (let i = startPage; i <= endPage; i++) {
         html += `
             <button class="page-item ${i === currentPage ? 'active' : ''}" 
                 onclick="changePage(${i})">${i}</button>`;
     }

     if (startPage > 1) {
         html = `<button class="page-item" onclick="changePage(1)">1</button>
                 <span class="page-item disabled">...</span>` + html;
     }
     if (endPage < totalPages) {
         html += `
             <span class="page-item disabled">...</span>
             <button class="page-item" onclick="changePage(${totalPages})">${totalPages}</button>`;
     }

     html += `
         <button class="page-item ${currentPage === totalPages ? 'disabled' : ''}" 
             onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
             <i class="fas fa-chevron-right"></i>
         </button>
         <div class="page-jump">
             <input type="number" class="page-input" id="pageInput" 
                 min="1" max="${totalPages}" placeholder="页码">
             <button onclick="jumpToPage()">跳转</button>
         </div>`;

     container.innerHTML = html;
 }

 // 渲染文章列表
 function renderArticles() {
     const start = (currentPage - 1) * PAGE_SIZE;
     const end = start + PAGE_SIZE;
     const container = document.getElementById('articleList');

     container.innerHTML = allArticles
         .slice(start, end)
         .map(article => `
             <article class="article-card">
                 <img src="${article.image}" alt="${article.title}" 
                      class="article-image" loading="lazy">
                 <h2>${article.title}</h2>
                 <p>${article.content}</p>
                 <div class="tags">
                     ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                 </div>
             </article>
         `).join('');
 }

 // 切换页面
 function changePage(newPage) {
     const totalPages = Math.ceil(allArticles.length / PAGE_SIZE);
     currentPage = Math.max(1, Math.min(newPage, totalPages));
     renderArticles();
     renderPagination(allArticles.length);
     window.scrollTo({ top: 0, behavior: 'smooth' });
 }

 // 跳转页面
 function jumpToPage() {
     const input = document.getElementById('pageInput');
     let page = parseInt(input.value);
     const totalPages = Math.ceil(allArticles.length / PAGE_SIZE);

     if (!isNaN(page) && page >= 1 && page <= totalPages) {
         changePage(page);
     } else {
         alert(`请输入 1 到 ${totalPages} 之间的有效页码`);
         input.focus();
     }
 }

 // 搜索功能
 document.getElementById('searchInput').addEventListener('input', function (e) {
     const keyword = e.target.value.toLowerCase();
     const filtered = allArticles.filter(article =>
         article.title.toLowerCase().includes(keyword) ||
         article.content.toLowerCase().includes(keyword)
     );
     currentPage = 1;
     allArticles = filtered;
     renderArticles();
     renderPagination(filtered.length);
 });

 // 布局切换
 function switchLayout(layout) {
     const list = document.getElementById('articleList');
     list.classList.remove('single-column', 'double-column');
     list.classList.add(`${layout}-column`);
     localStorage.setItem('articleLayout', layout);
 }

 // 初始化
 function init() {
     initData();
     renderArticles();
     renderPagination(allArticles.length);

     const savedLayout = localStorage.getItem('articleLayout') || 'double';
     document.getElementById('articleList').classList.add(`${savedLayout}-column`);
 }

 window.addEventListener('DOMContentLoaded', init);

 // 增强的交互功能
 document.querySelectorAll('.has-submenu').forEach(item => {
     let timeout;
     const submenu = item.querySelector('.navbar-item-child');

     item.addEventListener('mouseenter', () => {
         clearTimeout(timeout);
         submenu.style.transform = 'translateY(0)';
         submenu.style.opacity = '1';
         submenu.style.visibility = 'visible';
     });

     item.addEventListener('mouseleave', () => {
         timeout = setTimeout(() => {
             submenu.style.transform = 'translateY(10px)';
             submenu.style.opacity = '0';
             submenu.style.visibility = 'hidden';
         }, 300);
     });
 });

 // 卡片点击效果
 document.querySelectorAll('.article-card').forEach(card => {
     card.addEventListener('click', () => {
         card.style.transform = 'scale(0.98)';
         setTimeout(() => {
             card.style.transform = '';
         }, 200);
     });
 });

 // 增强搜索功能
 const searchInput = document.getElementById('searchInput');
 let searchTimeout;

 searchInput.addEventListener('input', (e) => {
     clearTimeout(searchTimeout);
     searchTimeout = setTimeout(() => {
         const keyword = e.target.value.toLowerCase();
         // 执行搜索逻辑...
     }, 300);
 });

 // 触摸设备适配
 let touchStartX = 0;
 document.addEventListener('touchstart', e => {
     touchStartX = e.touches[0].clientX;
 });

 document.addEventListener('touchend', e => {
     const touchEndX = e.changedTouches[0].clientX;
     const diffX = touchEndX - touchStartX;

     if (Math.abs(diffX) > 50) {
         if (diffX > 0) changePage(currentPage - 1);
         else changePage(currentPage + 1);
     }
 });

// 返回顶部功能
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 链接悬停动画
document.querySelectorAll('.footer-nav a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateX(5px)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateX(0)';
    });
});

// 移动端菜单切换
function handleMobileMenu() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.footer-section').forEach(section => {
            const title = section.querySelector('.footer-title');
            title.addEventListener('click', () => {
                section.classList.toggle('active');
            });
        });
    }
}

window.addEventListener('resize', handleMobileMenu);
handleMobileMenu();