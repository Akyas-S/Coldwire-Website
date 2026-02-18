import ProductForm from "@/components/ProductForm";

export default function Home() {
  return (
    <main>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon">C</div>
        <div>
          <h1>Coldwire</h1>
          <p>New Product Batch</p>
        </div>
      </div>

      {/* Form */}
      <div className="page-content">
        <ProductForm />
      </div>
    </main>
  );
}
