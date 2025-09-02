// FIXED Invoice Generator JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    const invoiceForm = document.getElementById('invoiceForm');
    const previewBtn = document.getElementById('previewBtn');
    const editInvoice = document.getElementById('editInvoice');
    const downloadPDF = document.getElementById('downloadPDF');
    const invoicePreview = document.getElementById('invoicePreview');
    const formWrapper = document.querySelector('.invoice-form-wrapper');
    const addItemBtn = document.getElementById('addItem');
    const itemsList = document.getElementById('itemsList');

    if (!invoiceForm) return; // Exit if invoice form doesn't exist

    // Set current date as default
    const today = new Date().toISOString().split('T')[0];
    const invoiceDateInput = document.getElementById('invoice_date');
    if (invoiceDateInput) {
        invoiceDateInput.value = today;
    }
    
    // Set due date to 30 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    const dueDateInput = document.getElementById('due_date');
    if (dueDateInput) {
        dueDateInput.value = dueDate.toISOString().split('T')[0];
    }

    // Add new item row
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            const newRow = document.createElement('div');
            newRow.className = 'item-row';
            newRow.innerHTML = `
                <div class="form-group item-input">
                    <input type="text" name="item_name[]" placeholder=" " required>
                    <label>Item Name</label>
                </div>
                <div class="form-group item-input">
                    <input type="number" name="item_qty[]" placeholder=" " min="1" required>
                    <label>Quantity</label>
                </div>
                <div class="form-group item-input">
                    <input type="number" name="item_price[]" placeholder=" " step="0.01" min="0" required>
                    <label>Unit Price</label>
                </div>
                <div class="form-group item-total">
                    <input type="text" name="item_total[]" placeholder=" " readonly>
                </div>
                <button type="button" class="remove-item">X</button>
            `;
            itemsList.appendChild(newRow);
            attachItemEventListeners(newRow);
        });
    }

    // Remove item row
    if (itemsList) {
        itemsList.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-item')) {
                if (itemsList.children.length > 1) {
                    e.target.parentElement.remove();
                    calculateTotals();
                }
            }
        });
    }

    // Attach event listeners to item inputs
    function attachItemEventListeners(row) {
        const qtyInput = row.querySelector('input[name="item_qty[]"]');
        const priceInput = row.querySelector('input[name="item_price[]"]');
        const totalInput = row.querySelector('input[name="item_total[]"]');

        function calculateItemTotal() {
            const qty = parseFloat(qtyInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const total = qty * price;
            totalInput.value = '$' + total.toFixed(2);
            calculateTotals();
        }

        qtyInput.addEventListener('input', calculateItemTotal);
        priceInput.addEventListener('input', calculateItemTotal);
    }

    // Initialize event listeners for existing items
    document.querySelectorAll('.item-row').forEach(attachItemEventListeners);

    // Calculate totals
    function calculateTotals() {
        const itemTotals = document.querySelectorAll('input[name="item_total[]"]');
        let subtotal = 0;

        itemTotals.forEach(input => {
            const value = input.value.replace('$', '');
            subtotal += parseFloat(value) || 0;
        });

        const subtotalInput = document.getElementById('subtotal');
        if (subtotalInput) {
            subtotalInput.value = '$' + subtotal.toFixed(2);
        }

        const taxRate = parseFloat(document.getElementById('tax').value) || 0;
        const taxAmount = (subtotal * taxRate) / 100;
        const totalAmount = subtotal + taxAmount;

        const totalInput = document.getElementById('total_amount');
        if (totalInput) {
            totalInput.value = '$' + totalAmount.toFixed(2);
        }
    }

    // Tax calculation
    const taxInput = document.getElementById('tax');
    if (taxInput) {
        taxInput.addEventListener('input', calculateTotals);
    }

    // Preview functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            updatePreview();
            if (formWrapper) formWrapper.style.display = 'none';
            if (invoicePreview) invoicePreview.style.display = 'block';
        });
    }

    // Edit functionality
    if (editInvoice) {
        editInvoice.addEventListener('click', function() {
            if (formWrapper) formWrapper.style.display = 'block';
            if (invoicePreview) invoicePreview.style.display = 'none';
        });
    }

    // FIXED - Update preview with form data to match your template design
    function updatePreview() {
        // Company and invoice details
        const companyName = document.getElementById('company_name').value || 'COMAPNY';
        const invoiceNo = document.getElementById('invoice_no').value || '01';
        
        document.getElementById('preview_company_name').textContent = companyName;
        document.getElementById('preview_invoice_no').textContent = invoiceNo;
        document.getElementById('preview_company_signature').textContent = companyName;
        
        // Company address
        document.getElementById('preview_company_address').textContent = 
            document.getElementById('company_address').value || '123 Anywhere St., Any City, ST 12345';
        
        // FIXED - Date formatting to match your template
        const invoiceDate = document.getElementById('invoice_date').value;
        if (invoiceDate) {
            const date = new Date(invoiceDate);
            document.getElementById('preview_invoice_date').textContent = 
                date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        // Client details
        document.getElementById('preview_client_name').textContent = 
            document.getElementById('client_name').value || 'John Doe';
        document.getElementById('preview_client_phone').textContent = 
            document.getElementById('client_phone').value || '+123-456-7890';
        document.getElementById('preview_client_address').textContent = 
            document.getElementById('client_address').value || '63 Ivy Road, Hawkville, GA, USA 31036';

        // FIXED - Items rendering
        const itemsContainer = document.getElementById('preview_items');
        itemsContainer.innerHTML = '';
        
        const itemRows = document.querySelectorAll('.item-row');
        itemRows.forEach(row => {
            const name = row.querySelector('input[name="item_name[]"]').value;
            const qty = row.querySelector('input[name="item_qty[]"]').value;
            const price = row.querySelector('input[name="item_price[]"]').value;
            const total = row.querySelector('input[name="item_total[]"]').value;

            if (name && qty && price) {
                const itemRow = document.createElement('tr');
                itemRow.innerHTML = `
                    <td>${name}</td>
                    <td>${qty}</td>
                    <td>$${parseFloat(price).toFixed(2)}</td>
                    <td>${total}</td>
                `;
                itemsContainer.appendChild(itemRow);
            }
        });

        // FIXED - Totals calculation and display
        const subtotal = document.getElementById('subtotal').value;
        const tax = document.getElementById('tax').value || 0;
        const totalAmount = document.getElementById('total_amount').value;
        const subtotalValue = parseFloat(subtotal.replace('$', '')) || 0;
        const taxAmount = (subtotalValue * parseFloat(tax)) / 100;

        document.getElementById('preview_subtotal').textContent = subtotal;
        document.getElementById('preview_tax_rate').textContent = tax;
        document.getElementById('preview_tax_amount').textContent = '$' + taxAmount.toFixed(2);
        document.getElementById('preview_total_amount').textContent = totalAmount;

        // Payment info
        document.getElementById('preview_bank_name').textContent = 
            document.getElementById('bank_name').value || 'Briard Bank';
        document.getElementById('preview_account_name').textContent = 
            document.getElementById('account_name').value || 'John Doe';
        document.getElementById('preview_account_no').textContent = 
            document.getElementById('account_no').value || '123-456-7890';
        
        // FIXED - Due date formatting
        const dueDate = document.getElementById('due_date').value;
        if (dueDate) {
            const date = new Date(dueDate);
            document.getElementById('preview_due_date').textContent = 
                date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    }

    // Form submission
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updatePreview();
            if (formWrapper) formWrapper.style.display = 'none';
            if (invoicePreview) invoicePreview.style.display = 'block';
        });
    }

    // FIXED - Download PDF functionality for single page printing
    if (downloadPDF) {
        downloadPDF.addEventListener('click', function() {
            // Ensure only invoice document is visible
            const invoiceDocument = document.querySelector('.invoice-document');
            if (!invoiceDocument) {
                alert('Please generate the invoice preview first!');
                return;
            }

            // Hide all other elements
            const bodyChildren = document.body.children;
            const originalDisplay = [];
            
            // Store original display values and hide everything
            for (let i = 0; i < bodyChildren.length; i++) {
                originalDisplay.push(bodyChildren[i].style.display);
                bodyChildren[i].style.display = 'none';
            }
            
            // Show only the invoice preview
            const invoicePreviewElement = document.getElementById('invoicePreview');
            if (invoicePreviewElement) {
                invoicePreviewElement.style.display = 'block';
            }

            // Force layout recalculation
            document.body.offsetHeight;
            
            // Print with a slight delay to ensure proper rendering
            setTimeout(() => {
                window.print();
                
                // Restore original display values after printing
                setTimeout(() => {
                    for (let i = 0; i < bodyChildren.length; i++) {
                        bodyChildren[i].style.display = originalDisplay[i];
                    }
                }, 500);
            }, 200);
        });
    }

    // Initialize calculations
    calculateTotals();
});

// FIXED - Enhanced PDF Generation Function for single page
function generateOptimizedPDF() {
    const invoiceElement = document.querySelector('.invoice-document');
    if (!invoiceElement) {
        alert('Invoice not found! Please generate preview first.');
        return;
    }
    
    // Create a clean copy of the invoice
    const clonedInvoice = invoiceElement.cloneNode(true);
    
    // Apply specific styles for print optimization
    const printStyles = `
        <style>
            @page {
                size: A4;
                margin: 0.5in;
            }
            * {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.3;
                background: #f5f5f5;
            }
            .invoice-document {
                width: 100%;
                max-width: none;
                margin: 0;
                padding: 20px;
                background: #f5f5f5;
                page-break-inside: avoid;
            }
            .invoice-header-doc {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            .logo, .invoice-title {
                font-size: 2rem;
                font-weight: bold;
                letter-spacing: 2px;
            }
            .invoice-info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            .items-table th,
            .items-table td {
                padding: 8px 5px;
                font-size: 0.9rem;
                border-bottom: 1px solid #ddd;
            }
            .items-table th {
                border-bottom: 2px solid #000;
                font-weight: bold;
            }
            .totals {
                width: 250px;
                margin: 15px auto;
                padding: 15px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                page-break-inside: avoid;
            }
            .totals td {
                padding: 4px 0;
                font-size: 0.9rem;
            }
            .totals .total-row td {
                font-weight: bold;
                font-size: 1rem;
                border-top: 2px solid #000;
                padding-top: 8px;
            }
            .thank-you {
                text-align: center;
                font-size: 1.2rem;
                margin: 15px 0;
            }
            .payment-info {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                page-break-inside: avoid;
            }
            .payment-details h4,
            .bill-to h4 {
                font-size: 0.9rem;
                margin-bottom: 8px;
            }
            .payment-details p,
            .bill-to p,
            .invoice-details p {
                font-size: 0.85rem;
                margin: 2px 0;
                line-height: 1.2;
            }
            .company-name {
                font-size: 1.4rem;
                font-weight: bold;
            }
            .company-address {
                font-size: 0.85rem;
            }
        </style>
    `;
    
    // Create new window with optimized content
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${document.getElementById('invoice_no')?.value || 'Invoice'}</title>
            <meta charset="UTF-8">
            ${printStyles}
        </head>
        <body>
            ${clonedInvoice.outerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
            printWindow.close();
        }, 1000);
    }, 500);
}

// Export functions for external use
window.InvoiceGenerator = {
    updatePreview: function() {
        const event = new Event('click');
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) previewBtn.dispatchEvent(event);
    },
    
    downloadPDF: function() {
        const event = new Event('click');
        const downloadBtn = document.getElementById('downloadPDF');
        if (downloadBtn) downloadBtn.dispatchEvent(event);
    },
    
    downloadOptimizedPDF: function() {
        generateOptimizedPDF();
    },
    
    resetForm: function() {
        const form = document.getElementById('invoiceForm');
        if (form) {
            form.reset();
            // Reset totals
            const subtotal = document.getElementById('subtotal');
            const total = document.getElementById('total_amount');
            if (subtotal) subtotal.value = '$0.00';
            if (total) total.value = '$0.00';
        }
    },
    
    addItem: function() {
        const event = new Event('click');
        const addBtn = document.getElementById('addItem');
        if (addBtn) addBtn.dispatchEvent(event);
    }
};