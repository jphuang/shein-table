function exportToExcel() {
  if (!allData || allData.length === 0) {
    alert('没有数据可以导出');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(allData.map(product => ({
    '商品ID': product.goods_id,
    '名称': product.goods_name,
    '分类': product.cate_name,
    '库存': product.stock,
    '价格': product.salePrice.amountWithSymbol,
    '图片URL': product.goods_img
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SHEIN商品数据");
  XLSX.writeFile(wb, "shein_products.xlsx");
}