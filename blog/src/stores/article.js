// 创建文章列表数据存储
import { defineStore } from 'pinia';
import { getArticleList, getArticlesByTagName,getArticlesByCategoryName } from '@/api/article';

export const useArticleStore = defineStore('article', {
    state: () => ({
        searchResults: [],
        total: 0,
        currentPage: 1,
        pageSize: 6
    }),
    actions: {
        async fetchArticlesByTitle(title, currentPage, pageSize) {
            try {
                const response = await getArticleList({
                    keyword: title,
                    currentPage: currentPage,
                    pageSize: pageSize
                });
                if (response.code === 200 && response.message === '成功') {
                    const data = response.data;
                    this.searchResults = data.records || [];
                    this.total = data.total || 0;
                    this.currentPage = currentPage;
                    this.pageSize = pageSize;
                } else {
                    console.error('搜索失败:', response ? response.data : response);
                }
            } catch (error) {
                console.error('搜索失败:', error);
            }
        },
        async fetchArticlesByTagName(tagName) {
            try {
                console.log('Fetching articles by tag:', tagName);
                const response = await getArticlesByTagName(tagName);
                console.log('Response:', response);
                if (response.code === 200 && response.message === '成功') {
                    const data = response.data;
                    this.searchResults = data || [];
                    this.total = data.length;
                } else {
                    console.error('搜索失败:', response ? response.data : response)
                }
            } catch (error) {
                console.error('搜索失败:', error);
            }
        },
        async fetchArticlesByCategoryName(categoryName) {
            try{
                const response = await getArticlesByCategoryName(categoryName);
                if(response.code === 200 && response.message === '成功'){
                    const data = response.data;
                    this.searchResults = data || [];
                    this.total = data.length;
                }else{
                    console.error('搜索失败:', response ? response.data : response)
                }
            }catch(error){
                console.error('搜索失败:', error);
            }
        },
        setPageSize(size) {
            this.pageSize = size;
        },
        setCurrentPage(page) {
            this.currentPage = page;
        },
    },
    getters: {
        getSearchResults: (state) => state.searchResults,
        getTotal: (state) => state.total,
        getCurrentPage: (state) => state.currentPage,
        getPageSize: (state) => state.pageSize
    }
});