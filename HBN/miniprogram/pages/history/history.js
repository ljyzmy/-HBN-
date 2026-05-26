Page({
  data: {
    history: [],
    isEditMode: false, // 是否处于编辑模式
    selectedItems: [], // 选中的商品ID列表
    emptyIconPath: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/空状态.png', // 空状态图标
    groupedHistory: [],
    isLoading: true,
    page: 1,
    pageSize: 20,
    hasMore: true
  },
  
  onLoad: function(options) {
    // 加载云存储图片
    this.loadCloudImages();
    
    // 加载浏览历史数据
    this.loadHistoryData();
  },
  
  onPullDownRefresh: function() {
    // 下拉刷新重新加载数据
    this.setData({
      page: 1,
      hasMore: true,
      history: [],
      groupedHistory: []
    });
    this.loadHistoryData().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  
  onReachBottom: function() {
    // 触底加载更多
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadMoreHistory();
    }
  },
  
  // 加载云存储图片
  loadCloudImages: function() {
    // 加载空状态图标
    wx.cloud.getTempFileURL({
      fileList: [this.data.emptyIconPath],
      success: res => {
        if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
          this.setData({
            emptyIconPath: res.fileList[0].tempFileURL
          });
        }
      }
    });
  },
  
  // 加载浏览历史数据
  loadHistoryData: function() {
    this.setData({ isLoading: true });
    
    wx.showLoading({
      title: '加载中...',
    });
    
    return wx.cloud.callFunction({
      name: 'manageHistory',
      data: {
        action: 'list',
        data: {
          page: this.data.page,
          pageSize: this.data.pageSize,
          grouped: true
        }
      }
    }).then(res => {
      console.log('获取浏览历史成功', res);
      
      const result = res.result || {};
      if (result.code === 0 && result.data && result.data.list) {
        const historyGroups = result.data.list || [];
            
        // 提取原始历史记录数组
        let allHistoryItems = [];
        historyGroups.forEach(group => {
          if (group.items && group.items.length > 0) {
            allHistoryItems = allHistoryItems.concat(group.items);
                }
        });
        
        // 格式化分组数据
        const formattedGroups = historyGroups.map(group => {
          return {
            date: group._id.date,
            items: group.items,
            formattedDate: this.formatDate(group._id.date)
          };
            });
            
            this.setData({
          history: allHistoryItems,
          groupedHistory: formattedGroups,
          hasMore: historyGroups.length >= this.data.pageSize,
          page: this.data.page + 1
        });
        
        // 加载商品图片
        this.loadProductImages();
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
            });
          }
      
      this.setData({ isLoading: false });
      wx.hideLoading();
    }).catch(err => {
      console.error('获取浏览历史失败', err);
      this.setData({ isLoading: false });
      wx.hideLoading();
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    });
  },
  
  // 加载更多历史记录
  loadMoreHistory: function() {
    if (this.data.isLoading || !this.data.hasMore) return;
    
    this.setData({ isLoading: true });
    
    wx.showLoading({
      title: '加载更多...',
    });
    
    wx.cloud.callFunction({
      name: 'manageHistory',
      data: {
        action: 'list',
        data: {
          page: this.data.page,
          pageSize: this.data.pageSize,
          grouped: true
        }
      }
    }).then(res => {
      const result = res.result || {};
      if (result.code === 0 && result.data && result.data.list) {
        const historyGroups = result.data.list || [];
        
        // 提取新加载的历史记录数组
        let newHistoryItems = [];
        historyGroups.forEach(group => {
          if (group.items && group.items.length > 0) {
            newHistoryItems = newHistoryItems.concat(group.items);
          }
        });
        
        // 格式化分组数据
        const formattedGroups = historyGroups.map(group => {
          return {
            date: group._id.date,
            items: group.items,
            formattedDate: this.formatDate(group._id.date)
          };
        });
        
        // 合并数据
        const combinedHistory = this.data.history.concat(newHistoryItems);
        const combinedGroups = this.data.groupedHistory.concat(formattedGroups);
        
        this.setData({
          history: combinedHistory,
          groupedHistory: combinedGroups,
          hasMore: historyGroups.length >= this.data.pageSize,
          page: this.data.page + 1
        });
        
        // 加载新商品的图片
        this.loadProductImages(this.data.history.length - newHistoryItems.length);
      } else {
        this.setData({
          hasMore: false
        });
      }
      
      this.setData({ isLoading: false });
      wx.hideLoading();
    }).catch(err => {
      console.error('加载更多历史记录失败', err);
    this.setData({
        isLoading: false,
        hasMore: false
      });
      wx.hideLoading();
    });
  },
  
  // 加载商品图片
  loadProductImages: function(startIndex = 0) {
    // 获取需要加载的图片URL列表
    const imageUrls = this.data.history.slice(startIndex).map(item => item.image);
    
    if (imageUrls.length === 0) return;
    
    // 批量获取临时访问链接
    wx.cloud.getTempFileURL({
      fileList: imageUrls,
      success: res => {
        if (!res.fileList || res.fileList.length === 0) return;
        
        // 将获取到的临时URL更新到数据中
        const urlMap = {};
        res.fileList.forEach(file => {
          if (file.tempFileURL) {
            urlMap[file.fileID] = file.tempFileURL;
          }
        });
        
        // 更新原始历史记录中的图片URL
        const updatedHistory = this.data.history.map(item => {
          if (urlMap[item.image]) {
            return {...item, image: urlMap[item.image]};
      }
          return item;
    });
    
        // 更新分组后的历史记录中的图片URL
        const updatedGroupedHistory = this.data.groupedHistory.map(group => {
          const updatedItems = group.items.map(product => {
            if (urlMap[product.image]) {
              return {...product, image: urlMap[product.image]};
    }
            return product;
          });
          return {...group, items: updatedItems};
    });
    
    this.setData({
          history: updatedHistory,
          groupedHistory: updatedGroupedHistory
        });
      }
    });
  },
  
  // 格式化日期为"昨天"、"今天"或具体日期
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getTime() === today.getTime()) {
      return '今天';
    } else if (date.getTime() === yesterday.getTime()) {
      return '昨天';
    } else {
      // 格式化为"MM月DD日"
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },
  
  // 切换编辑模式
  toggleEditMode() {
    this.setData({
      isEditMode: !this.data.isEditMode,
      selectedItems: [] // 切换模式时清空选中列表
    });
  },
  
  // 选择/取消选择商品
  toggleSelectItem(e) {
    if (!this.data.isEditMode) return; // 非编辑模式不处理
    
    const itemId = e.currentTarget.dataset.id;
    const selectedItems = [...this.data.selectedItems];
    const index = selectedItems.indexOf(itemId);
    
    if (index > -1) {
      // 已选中，取消选择
      selectedItems.splice(index, 1);
    } else {
      // 未选中，添加到选中列表
      selectedItems.push(itemId);
    }
    
    this.setData({
      selectedItems: selectedItems
    });
  },
  
  // 全选/取消全选
  toggleSelectAll() {
    if (!this.data.isEditMode) return;
    
    if (this.data.selectedItems.length === this.data.history.length) {
      // 已全选，取消全选
      this.setData({
        selectedItems: []
      });
    } else {
      // 未全选，全选
      this.setData({
        selectedItems: this.data.history.map(item => item._id)
      });
    }
  },
  
  // 批量删除选中历史记录
  batchRemoveHistory() {
    if (this.data.selectedItems.length === 0) {
      wx.showToast({
        title: '请选择要删除的记录',
        icon: 'none'
      });
      return;
    }
    
    const that = this;
    wx.showModal({
      title: '提示',
      content: `确定要删除选中的${that.data.selectedItems.length}条浏览记录吗？`,
      success(res) {
        if (res.confirm) {
          // 调用云函数删除记录
          wx.showLoading({
            title: '删除中...',
          });
          
          wx.cloud.callFunction({
            name: 'manageHistory',
            data: {
              action: 'remove',
              data: {
                ids: that.data.selectedItems
              }
            }
          }).then(res => {
            console.log('删除历史记录成功', res);
            const result = res.result || {};
            
            if (result.code === 0) {
              // 从本地数据中移除已删除的记录
              const newHistory = that.data.history.filter(item => !that.data.selectedItems.includes(item._id));
              
              // 更新分组数据
              let newGroupedHistory = [];
              that.data.groupedHistory.forEach(group => {
                const filteredItems = group.items.filter(item => !that.data.selectedItems.includes(item._id));
                if (filteredItems.length > 0) {
                  newGroupedHistory.push({
                    ...group,
                    items: filteredItems
                  });
                }
              });
              
          that.setData({
            history: newHistory,
                groupedHistory: newGroupedHistory,
            selectedItems: [],
            isEditMode: false
          });
          
              wx.hideLoading();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
              });
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }).catch(err => {
            console.error('删除历史记录失败', err);
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          });
        }
      }
    });
  },
  
  // 删除单个历史记录
  removeHistoryItem(e) {
    const itemId = e.currentTarget.dataset.id;
    const that = this;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除该浏览记录吗？',
      success(res) {
        if (res.confirm) {
          // 调用云函数删除记录
          wx.showLoading({
            title: '删除中...',
          });
          
          wx.cloud.callFunction({
            name: 'manageHistory',
            data: {
              action: 'remove',
              data: {
                ids: [itemId]
              }
            }
          }).then(res => {
            console.log('删除单条历史记录成功', res);
            const result = res.result || {};
            
            if (result.code === 0) {
              // 从本地数据中移除已删除的记录
              const newHistory = that.data.history.filter(item => item._id !== itemId);
              
              // 更新分组数据
              let newGroupedHistory = [];
              that.data.groupedHistory.forEach(group => {
                const filteredItems = group.items.filter(item => item._id !== itemId);
                if (filteredItems.length > 0) {
                  newGroupedHistory.push({
                    ...group,
                    items: filteredItems
                  });
                }
              });
              
              that.setData({
                history: newHistory,
                groupedHistory: newGroupedHistory
              });
              
              wx.hideLoading();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
              });
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }).catch(err => {
            console.error('删除单条历史记录失败', err);
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          });
        }
      }
    });
  },
  
  // 清空所有历史记录
  clearAllHistory() {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要清空所有浏览记录吗？',
      success(res) {
        if (res.confirm) {
          // 调用云函数清空记录
          wx.showLoading({
            title: '清空中...',
          });
          
          wx.cloud.callFunction({
            name: 'manageHistory',
            data: {
              action: 'clear'
            }
          }).then(res => {
            console.log('清空历史记录成功', res);
            const result = res.result || {};
            
            if (result.code === 0) {
          that.setData({
            history: [],
            groupedHistory: [],
            isEditMode: false,
            selectedItems: []
          });
          
              wx.hideLoading();
          wx.showToast({
            title: '清空成功',
            icon: 'success'
              });
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '清空失败',
                icon: 'none'
              });
            }
          }).catch(err => {
            console.error('清空历史记录失败', err);
            wx.hideLoading();
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            });
          });
        }
      }
    });
  },
  
  // 查看商品详情
  viewProductDetail(e) {
    if (this.data.isEditMode) {
      // 编辑模式下，点击商品切换选中状态
      this.toggleSelectItem(e);
      return;
    }
    
    const itemId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${itemId}`
    });
  },
  
  // 去逛逛
  goShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}) 