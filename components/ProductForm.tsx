"use client";

import { useState } from "react";
import { BatchFormData, subcategories } from "@/types";
import SuccessDialog from "@/components/SuccessDialog";

// A blank form "snapshot" used for the initial state
const emptyFormData: BatchFormData = {
  productCategory: "",
  productSubcategory: "",
  dateOfSlaughter: "",
  dateReceived: "",
  quantity: 0,
};

export default function ProductForm() {
  const [formData, setFormData] = useState<BatchFormData>(emptyFormData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // null = form not yet submitted; a string value = submission succeeded, holds the new batchId.
  const [successBatchId, setSuccessBatchId] = useState<string | null>(null);

  function handleChange(field: string, value: string | number) {
    setFormData({ ...formData, [field]: value });
  }

  // Separate handler for category changes: whenever the category changes we must also
  // reset productSubcategory to "" so the subcategory dropdown doesn't show a value
  // that belongs to the old category.
  function handleCategoryChange(category: string) {
    setFormData({
      ...formData,
      productCategory: category,
      productSubcategory: "",
    });
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Store the returned batchId to trigger SuccessDialog rendering.
        setSuccessBatchId(result.batchId);
      } else {
        setSubmitError(
          result.message || "Something went wrong. Please try again.",
        );
      }
    } catch {
      // Network-level failure (e.g. server unreachable).
      setSubmitError("Could not connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Resets the entire form back to blank state so the user can register another batch.
  // Also clears successBatchId which unmounts the SuccessDialog.
  function handleReset() {
    setFormData(emptyFormData);
    setSubmitError(null);
    setSuccessBatchId(null);
  }

  // Derive subcategory options from the selected category on every render.
  // Falls back to [] when no category is selected so the disabled dropdown shows nothing.
  const currentSubcategories = formData.productCategory
    ? subcategories[formData.productCategory] || []
    : [];

  //-----HTML-----

  return (
    <div>

      {/* Supplier section — disabled for now, fields will be enabled in a future update */}
      <div className="card">
        <h2 className="card-title">
          <span className="card-icon green">🏭</span>
          Supplier section
        </h2>
        <div className="form-group">
          <label htmlFor="supplierName">Supplier Name</label>
          <input
            id="supplierName"
            placeholder="Enter supplier name"
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="supplierAddress">Supplier Address</label>
          <textarea
            id="supplierAddress"
            placeholder="Enter full address"
            disabled
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="supplierEmail">Supplier Email</label>
            <input
              id="supplierEmail"
              type="email"
              placeholder="Enter supplier email"
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="supplierPhone">Supplier Phone Number</label>
            <input
              id="supplierPhone"
              type="tel"
              placeholder="Enter supplier phone number"
              disabled
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          <span className="card-icon blue">📦</span>
          Batch details section
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="productCategory">Product Category</label>
            <select
              id="productCategory"
              value={formData.productCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select category...</option>
              <option value="Chicken">Chicken</option>
              <option value="Beef">Beef</option>
              <option value="Lamb">Lamb</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="productSubcategory">Subcategory</label>
            {/* Disabled until a category is chosen — prevents selecting a subcategory
                that doesn't belong to any category yet. */}
            <select
              id="productSubcategory"
              value={formData.productSubcategory}
              onChange={(e) =>
                handleChange("productSubcategory", e.target.value)
              }
              disabled={!formData.productCategory}
            >
              <option value="">Select subcategory...</option>
              {currentSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          {/* Controlled number input: `|| ""` prevents React displaying "0"
              when the field is empty — shows a blank placeholder instead. */}
          <input
            id="quantity"
            type="number"
            min={1}
            placeholder="Enter quantity"
            value={formData.quantity || ""}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfSlaughter">Date of Slaughter</label>
            <input
              id="dateOfSlaughter"
              type="date"
              value={formData.dateOfSlaughter}
              onChange={(e) => handleChange("dateOfSlaughter", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateReceived">Date Received</label>
            <input
              id="dateReceived"
              type="date"
              value={formData.dateReceived}
              onChange={(e) => handleChange("dateReceived", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Halal Certificate</label>
            <button className="btn btn-outline" disabled>
              📎 Upload Halal Certificate
              <span className="badge badge-gray">Coming Soon</span>
            </button>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <button className="btn btn-outline" disabled>
              🖼️ Upload Product Image
              <span className="badge badge-gray">Coming Soon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Details — serial number and product ID disabled for now */}
      <div className="card">
        <h2 className="card-title">
          <span className="card-icon orange">🚚</span>
          Delivery Details
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="serialNumber">Serial Number</label>
            <input
              id="serialNumber"
              type="number"
              placeholder="Enter serial number"
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="productId">Product ID</label>
            <input
              id="productId"
              type="number"
              placeholder="Enter product ID"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Top-level submit error (e.g. network failure or server rejection) displayed
          outside any card so it is visible regardless of scroll position. */}
      {submitError && <div className="error-box">{submitError}</div>}

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {/* Show a spinner + label while the POST is in-flight to prevent double-submission
            and give the user immediate visual feedback. */}
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            Submitting...
          </>
        ) : (
          "Submit Batch"
        )}
      </button>

      {/* SuccessDialog is conditionally mounted only after a successful API response.
          It receives the batchId for display and QR generation, and onClose to reset the form. */}
      {successBatchId && (
        <SuccessDialog
          batchId={successBatchId}
          formData={formData}
          onClose={handleReset}
        />
      )}
    </div>
  );
}
