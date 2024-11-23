import ProductDetails from "./ProductDetails"

async function getProduct(id: string) {
    const res = await fetch(`http://localhost:8080/public/products/${id}`)
    const data = await res.json()
    return data.data
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id)
    return <ProductDetails product={product} />
}