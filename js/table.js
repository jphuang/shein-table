let currentPage = 1;
let allData = [];

function displayTable() {
  if (!allData || allData.length === 0) {
    document.getElementById('tableContainer').innerHTML = '<p>没有找到数据</p>';
    return;
  }

  const table = `
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>商品ID</th>
          <th>名称</th>
          <th>分类</th>
          <th>库存</th>
          <th>价格</th>
          <th>图片</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${allData.map(product => `
          <tr>
            <td>${product.goods_id}</td>
            <td>${product.goods_name}</td>
            <td>${product.cate_name}</td>
            <td>${product.stock}</td>
            <td>${product.salePrice.amountWithSymbol}</td>
            <td>
              <img src="${product.goods_img}" alt="${product.goods_name}" class="product-img img-thumbnail" onclick="openImageModal('${product.goods_img}')">
            </td>
            <td>
              <button class="btn btn-sm btn-info" onclick="fetchProductDetails('${product.goods_id}')">查看详细</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('tableContainer').innerHTML = table;
}

function updatePagination() {
  document.getElementById('currentPage').textContent = `第 ${currentPage} 页`;
  document.getElementById('prevPage').disabled = currentPage === 1;
}

function openImageModal(imageSrc) {
  const modalImage = document.getElementById('modalImage');
  modalImage.src = imageSrc;
  const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
  imageModal.show();
}

// 添加点击模态框外部关闭的功能
document.getElementById('imageModal').addEventListener('click', function(event) {
  if (event.target === this) {
    bootstrap.Modal.getInstance(this).hide();
  }
});