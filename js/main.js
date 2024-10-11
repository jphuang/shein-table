async function fetchData() {
  const keywords = document.getElementById('keywords').value.trim();
  if (!keywords) {
    document.getElementById('keywords').classList.add('is-invalid');
    return;
  }
  document.getElementById('keywords').classList.remove('is-invalid');

  const sort = document.getElementById('sort').value;
  const size = document.getElementById('size').value;
  const country = document.getElementById('country').value;
  const language = document.getElementById('language').value;
  const currency = document.getElementById('currency').value;

  const url = `https://shein-scraper-api.p.rapidapi.com/shein/search/products?keywords=${encodeURIComponent(keywords)}&sort=${sort}&size=${size}&page=${currentPage}&country=${country}&language=${language}&currency=${currency}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'a029e975aamsh26f0d0421656732p1e431fjsn94e4ef0dfc77',
      'x-rapidapi-host': 'shein-scraper-api.p.rapidapi.com'
    }
  };

  try {
    document.getElementById('tableContainer').innerHTML = '<p>加载中...</p>';
    const response = await fetch(url, options);
    const result = await response.json();
    allData = result.data;
    displayTable();
    updatePagination();
  } catch (error) {
    console.error(error);
    document.getElementById('tableContainer').innerHTML = '发生错误: ' + error.message;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('fetchData').addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 1;
    fetchData();
  });

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchData();
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    fetchData();
  });

  document.getElementById('keywords').addEventListener('input', function() {
    this.classList.remove('is-invalid');
  });

  document.getElementById('exportExcel').addEventListener('click', exportToExcel);
});