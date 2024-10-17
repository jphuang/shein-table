async function fetchProductDetails(goodsId) {
  const currency = document.getElementById('currency').value;
  const country = document.getElementById('country').value;
  const language = document.getElementById('language').value;

  const cacheKey = `product_${goodsId}_${currency}_${country}_${language}`;

  // 尝试从缓存获取数据
  const cachedData = utools.db.get(cacheKey);
  if (cachedData && cachedData.expiry > Date.now()) {
    displayProductDetails(cachedData.data);
    return;
  }

  const url = `https://shein-scraper-api.p.rapidapi.com/shein/product/details?goods_id=${goodsId}&currency=${currency}&country=${country}&language=${language}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'a029e975aamsh26f0d0421656732p1e431fjsn94e4ef0dfc77',
      'x-rapidapi-host': 'shein-scraper-api.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    // 将数据存入缓存，有效期3天
    utools.db.put({
      _id: cacheKey,
      data: result,
      expiry: Date.now() + 3 * 24 * 60 * 60 * 1000
    });

    displayProductDetails(result);
  } catch (error) {
    console.error('Error:', error);
    alert('获取商品详情时发生错误: ' + error.message);
  }
}

function displayProductDetails(details) {
  console.log('Product details:', details);

  if (!details || !details.data || !Array.isArray(details.data) || details.data.length === 0) {
    alert('未能获取商品详情或数据格式不正确');
    return;
  }

  const product = details.data[0];
  
  const createNestedTable = (data) => {
    if (!data || typeof data !== 'object') return data;
    let nestedTable = '<table class="table table-bordered table-sm">';
    for (const [key, value] of Object.entries(data)) {
      nestedTable += `<tr><th>${key}</th><td>${createNestedTable(value)}</td></tr>`;
    }
    nestedTable += '</table>';
    return nestedTable;
  };

  const detailContent = `
    <h4 class="mb-4">${product.goods_name || '未知商品名称'}</h4>
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex flex-wrap justify-content-center">
          ${product.nowater_gallery?.detail_image && Array.isArray(product.nowater_gallery.detail_image) ? 
            product.nowater_gallery.detail_image.map(img => `
              <img src="${img.origin_image || ''}" alt="商品图片" class="img-thumbnail m-1" style="width: 150px; height: 150px; object-fit: cover;">
            `).join('') : '无图片'}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <table class="table table-bordered">
          <tbody>
            <tr>
              <th scope="row" width="30%">商品ID</th>
              <td>${product.goods_id || '未知'}</td>
            </tr>
            <tr>
              <th scope="row">价格</th>
              <td>${product.salePrice?.amountWithSymbol || '未知'} (原价: ${product.retailPrice?.amountWithSymbol || '未知'})</td>
            </tr>
            <tr>
              <th scope="row">折扣</th>
              <td>${product.unit_discount || '未知'}% off</td>
            </tr>
            <tr>
              <th scope="row">分类</th>
              <td>${product.cate_name || '未知'}</td>
            </tr>
            ${Array.isArray(product.productDetails) ? product.productDetails.map(detail => `
              <tr>
                <th scope="row">${detail.attr_name || ''}</th>
                <td>${createNestedTable(detail.attr_value) || ''}</td>
              </tr>
            `).join('') : ''}
            <tr>
              <th scope="row">可用尺寸</th>
              <td>
                ${product.multiLevelSaleAttribute?.sku_list && Array.isArray(product.multiLevelSaleAttribute.sku_list) ? 
                  createNestedTable(product.multiLevelSaleAttribute.sku_list.reduce((acc, sku) => {
                    if (sku.sku_sale_attr && sku.sku_sale_attr[0]) {
                      acc[sku.sku_sale_attr[0].attr_value_name] = `库存: ${sku.stock || '未知'}`;
                    }
                    return acc;
                  }, {})) : '无尺寸信息'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('productDetailContent').innerHTML = detailContent;
  const productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
  productDetailModal.show();
}
