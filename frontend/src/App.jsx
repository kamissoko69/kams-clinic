import { useEffect, useState } from 'react'

function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🛒 KAMS Shop</h1>
      <h2>Produits en stock</h2>
      <div>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h3>{p.name} - {p.price} €</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App