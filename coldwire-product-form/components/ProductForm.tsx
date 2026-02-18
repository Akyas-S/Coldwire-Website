"use client";

import { useState } from "react";
import { BatchFormData, subcategories } from "@/types";
import SuccessDialog from "@/components/SuccessDialog";

// This is the initial empty state for all form fields
const emptyFormData: BatchFormData = {
  productCategory: "",
  productSubcategory: "",
  dateOfSlaughter: "",
  dateReceived: "",
  serialNumberRange: "",
  productIdRange: "",
  quantity: 0,
  unit: "",
  abattoirName: "",
  abattoirAddress: "",
  halalCertificateBase64: "",
  halalCertificateFileName: "",
  productImageBase64: "",
  productImageFileName: "",
};

export default function ProductForm() {
  // ---- STATE ----
  // formData holds all the values the user types in
  const [formData, setFormData] = useState<BatchFormData>(emptyFormData);

  // errors holds error messages for each field (empty string = no error)
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tracks if we're currently submitting to the server
  const [isSubmitting, setIsSubmitting] = useState(false);

  // after a successful submit, we store the batch ID to show the success dialog
  const [successBatchId, setSuccessBatchId] = useState<string | null>(null);

  // ---- HANDLERS ----

  // This function updates a single field in formData when the user types
  function handleChange(field: string, value: string | number) {
    setFormData({ ...formData, [field]: value });

    // Clear the error for this field when the user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  }

  // When the user picks a category, reset the subcategory since options change
  function handleCategoryChange(category: string) {
    setFormData({
      ...formData,
      productCategory: category,
      productSubcategory: "", // reset subcategory when category changes
    });
  }

  // When the user selects a file, convert it to base64 so we can send it as JSON
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "halalCertificate" | "productImage",
    allowedTypes: string[],
    allowedLabel: string,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, [fieldName]: "File must be under 5MB" });
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, [fieldName]: `Only ${allowedLabel} files are allowed` });
      return;
    }

    // Convert file to base64 string so we can send it in JSON
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        [`${fieldName}Base64`]: reader.result as string,
        [`${fieldName}FileName`]: file.name,
      });
      setErrors({ ...errors, [fieldName]: "" });
    };
    reader.readAsDataURL(file);
  }

  // ---- VALIDATION ----

  // Check all fields before submitting. Returns true if everything is valid.
  function validateForm(): boolean {
    // We start by assuming the form is valid.
    // If any field fails a check, we set this to false.
    let formIsValid = true;
    const newErrors: Record<string, string> = {};

    // Check required text fields
    if (!formData.productCategory) {
      newErrors.productCategory = "Please select a category";
      formIsValid = false;
    }
    if (!formData.productSubcategory) {
      newErrors.productSubcategory = "Please select a subcategory";
      formIsValid = false;
    }
    if (!formData.dateOfSlaughter) {
      newErrors.dateOfSlaughter = "Please enter date of slaughter";
      formIsValid = false;
    }
    if (!formData.dateReceived) {
      newErrors.dateReceived = "Please enter date received";
      formIsValid = false;
    }
    if (!formData.serialNumberRange) {
      newErrors.serialNumberRange = "Please enter serial number range";
      formIsValid = false;
    }
    if (!formData.productIdRange) {
      newErrors.productIdRange = "Please enter product ID range";
      formIsValid = false;
    }
    if (!formData.unit) {
      newErrors.unit = "Please select a unit";
      formIsValid = false;
    }
    if (!formData.abattoirName) {
      newErrors.abattoirName = "Please enter abattoir name";
      formIsValid = false;
    }
    if (!formData.abattoirAddress) {
      newErrors.abattoirAddress = "Please enter abattoir address";
      formIsValid = false;
    }

    // Check quantity is a positive number
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
      formIsValid = false;
    }

    // Check that slaughter date is before or equal to received date
    if (formData.dateOfSlaughter && formData.dateReceived) {
      if (new Date(formData.dateOfSlaughter) > new Date(formData.dateReceived)) {
        newErrors.dateReceived = "Received date must be after slaughter date";
        formIsValid = false;
      }
    }

    // Check file was uploaded
    if (!formData.halalCertificateBase64) {
      newErrors.halalCertificate = "Please upload a halal certificate";
      formIsValid = false;
    }

    setErrors(newErrors);

    // Return true only if every field passed its check
    return formIsValid;
  }

  // ---- SUBMIT ----

  async function handleSubmit() {
    // Don't submit if validation fails
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Send the form data to our API endpoint
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Show the success dialog with the generated batch ID
        setSuccessBatchId(result.batchId);
      } else {
        // Show error from server
        setErrors({ submit: result.message || "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ submit: "Could not connect to server. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset the form to create another batch
  function handleReset() {
    setFormData(emptyFormData);
    setErrors({});
    setSuccessBatchId(null);
  }

  // Get the subcategory options based on selected category
  const currentSubcategories = formData.productCategory
    ? subcategories[formData.productCategory] || []
    : [];

  // ---- RENDER ----

  return (
    <div>
      {/* ===== SUPPLIER SECTION ===== */}
      <div className="card">
        <h2 className="card-title">
          <span className="card-icon green">🏭</span>
          Supplier section
        </h2>
        <div className="form-group">
          <label htmlFor="abattoirName">Abattoir Name</label>
          <input
            id="abattoirName"
            placeholder="Enter abattoir name"
            value={formData.abattoirName}
            onChange={(e) => handleChange("abattoirName", e.target.value)}
          />
          {errors.abattoirName && <p className="error-text">{errors.abattoirName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="abattoirAddress">Abattoir Address</label>
          <textarea
            id="abattoirAddress"
            placeholder="Enter full address"
            value={formData.abattoirAddress}
            onChange={(e) => handleChange("abattoirAddress", e.target.value)}
          />
          {errors.abattoirAddress && <p className="error-text">{errors.abattoirAddress}</p>}
        </div>
      </div>

      {/* ===== PRODUCT DETAILS SECTION ===== */}
      <div className="card">
        <h2 className="card-title">
          <span className="card-icon blue">📦</span>
          Batch details section
        </h2>

        {/* Row 1: Category and Subcategory */}
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
            {errors.productCategory && <p className="error-text">{errors.productCategory}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="productSubcategory">Subcategory</label>
            <select
              id="productSubcategory"
              value={formData.productSubcategory}
              onChange={(e) => handleChange("productSubcategory", e.target.value)}
              disabled={!formData.productCategory}
            >
              <option value="">Select subcategory...</option>
              {currentSubcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.productSubcategory && <p className="error-text">{errors.productSubcategory}</p>}
          </div>
        </div>

        {/* Row 2: Quantity and Unit */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min={1}
              placeholder="Enter quantity"
              value={formData.quantity || ""}
              onChange={(e) => handleChange("quantity", Number(e.target.value))}
            />
            {errors.quantity && <p className="error-text">{errors.quantity}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
            >
              <option value="">Select unit...</option>
              <option value="kg">kg</option>
              <option value="pieces">pieces</option>
            </select>
            {errors.unit && <p className="error-text">{errors.unit}</p>}
          </div>
        </div>

        {/* Row 3: Attachments */}
        <div className="form-row">
          <div className="form-group">
            <label>Halal Certificate</label>
            <div className="file-upload-area">
              <label htmlFor="halalCertificate" className="file-upload-label">
                📎 Choose File
              </label>
              <input
                id="halalCertificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "halalCertificate", ["application/pdf", "image/jpeg", "image/png"], "PDF, JPG, or PNG")}
                className="hidden-input"
              />
              {formData.halalCertificateFileName && (
                <span className="file-name-badge">{formData.halalCertificateFileName}</span>
              )}
            </div>
            <p className="file-hint">PDF, JPG, or PNG. Max 5MB.</p>
            {errors.halalCertificate && <p className="error-text">{errors.halalCertificate}</p>}
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <div className="file-upload-area">
              <label htmlFor="productImage" className="file-upload-label">
                🖼️ Choose Image
              </label>
              <input
                id="productImage"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "productImage", ["image/jpeg", "image/png"], "JPG or PNG")}
                className="hidden-input"
              />
              {formData.productImageFileName && (
                <span className="file-name-badge">{formData.productImageFileName}</span>
              )}
            </div>
            <p className="file-hint">JPG or PNG. Max 5MB.</p>
            {errors.productImage && <p className="error-text">{errors.productImage}</p>}
          </div>
        </div>
      </div>

      {/* ===== DELIVERY DETAILS SECTION ===== */}
      <div className="card">
        <h2 className="card-title">
          <span className="card-icon orange">🚚</span>
          Delivery Details
        </h2>

        <div className="form-group">
          <label htmlFor="dateReceived">Date Received</label>
          <input
            id="dateReceived"
            type="date"
            value={formData.dateReceived}
            onChange={(e) => handleChange("dateReceived", e.target.value)}
          />
          {errors.dateReceived && <p className="error-text">{errors.dateReceived}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="serialNumberRange">Serial Number Range</label>
            <input
              id="serialNumberRange"
              placeholder="e.g. 001-100"
              value={formData.serialNumberRange}
              onChange={(e) => handleChange("serialNumberRange", e.target.value)}
            />
            {errors.serialNumberRange && <p className="error-text">{errors.serialNumberRange}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="productIdRange">Product ID Range</label>
            <input
              id="productIdRange"
              placeholder="e.g. PID-001 to PID-100"
              value={formData.productIdRange}
              onChange={(e) => handleChange("productIdRange", e.target.value)}
            />
            {errors.productIdRange && <p className="error-text">{errors.productIdRange}</p>}
          </div>
        </div>
      </div>

      {/* ===== PRODUCTION AND DISTRIBUTION SECTION ===== */}
      <div className="card">
        <h2 className="card-title">
          <span className="card-icon purple">🏷️</span>
          Production and distribution section
        </h2>

        <div className="form-group">
          <label htmlFor="dateOfSlaughter">Date of Slaughter</label>
          <input
            id="dateOfSlaughter"
            type="date"
            value={formData.dateOfSlaughter}
            onChange={(e) => handleChange("dateOfSlaughter", e.target.value)}
          />
          {errors.dateOfSlaughter && <p className="error-text">{errors.dateOfSlaughter}</p>}
        </div>

        <div className="rfid-section">
          <button className="btn btn-outline" disabled>
            📡 Register RFID Tag
            <span className="badge badge-gray">Coming Soon</span>
          </button>
        </div>
      </div>

      {/* ===== SUBMIT BUTTON ===== */}
      {errors.submit && (
        <div className="error-box">{errors.submit}</div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            Submitting...
          </>
        ) : (
          "Submit Batch"
        )}
      </button>

      {/* ===== SUCCESS DIALOG (shows after successful submit) ===== */}
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
