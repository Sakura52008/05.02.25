import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const PAGE_SIZE = 20;

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=10000')
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error('Ошибка при загрузке данных:', err));
  }, []);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return products.slice(startIndex, startIndex + PAGE_SIZE);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  return (
    <div className="app">
      <h1 className="title">Таблица товаров</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product.id} className="row">
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Назад
        </button>

        <span className="page-info">
          Страница {currentPage} из {totalPages}
        </span>

        <button
          className="button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Вперёд
        </button>
      </div>
    </div>
  );
};

export default App;
