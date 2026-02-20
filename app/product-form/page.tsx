import TopBar from "@/components/TopBar";
import ProductForm from "@/components/ProductForm";

export default function ProductFormPage() {
  return (
    <main>
      <TopBar title="Product Form" />
      
      <div className="page-content">
        <ProductForm />
      </div>
    </main>
  );
}
