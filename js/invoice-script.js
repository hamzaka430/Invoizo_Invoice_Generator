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
        const companyName = document.getElementById('company_name').value || 'DEZIGNWISE';
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

    // ENHANCED - Download PDF functionality with jsPDF and html2canvas
    if (downloadPDF) {
        downloadPDF.addEventListener('click', function() {
            const invoiceDocument = document.querySelector('.invoice-document');
            if (!invoiceDocument) {
                alert('Please generate the invoice preview first!');
                return;
            }

            downloadPDF.textContent = 'Generating PDF...';
            downloadPDF.disabled = true;

            // Function to ensure fonts are loaded before PDF generation
            function ensureFontsLoaded() {
                return new Promise((resolve) => {
                    // Check if RoxboroughCF font is available
                    function checkFontLoaded() {
                        const testElement = document.createElement('div');
                        testElement.style.fontFamily = 'RoxboroughCF, serif';
                        testElement.style.fontSize = '24px';
                        testElement.style.position = 'absolute';
                        testElement.style.left = '-9999px';
                        testElement.style.visibility = 'hidden';
                        testElement.textContent = 'FONT TEST';
                        document.body.appendChild(testElement);
                        
                        const width = testElement.offsetWidth;
                        document.body.removeChild(testElement);
                        
                        // Test with fallback font
                        const fallbackElement = document.createElement('div');
                        fallbackElement.style.fontFamily = 'serif';
                        fallbackElement.style.fontSize = '24px';
                        fallbackElement.style.position = 'absolute';
                        fallbackElement.style.left = '-9999px';
                        fallbackElement.style.visibility = 'hidden';
                        fallbackElement.textContent = 'FONT TEST';
                        document.body.appendChild(fallbackElement);
                        
                        const fallbackWidth = fallbackElement.offsetWidth;
                        document.body.removeChild(fallbackElement);
                        
                        return width !== fallbackWidth;
                    }
                    
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(() => {
                            // Additional check for custom font
                            if (checkFontLoaded()) {
                                setTimeout(resolve, 300);
                            } else {
                                // If font not loaded, wait a bit more
                                setTimeout(resolve, 800);
                            }
                        });
                    } else {
                        // Fallback for browsers without FontFaceSet API
                        setTimeout(() => {
                            if (checkFontLoaded()) {
                                resolve();
                            } else {
                                setTimeout(resolve, 500);
                            }
                        }, 1000);
                    }
                });
            }

            // Wait for fonts to be loaded before proceeding
            ensureFontsLoaded().then(() => {
                // Create a dedicated print container with full A4 dimensions
                const printContainer = document.createElement('div');
                printContainer.style.cssText = `
                    position: fixed;
                    top: -10000px;
                    left: -10000px;
                    width: 210mm;
                    height: 297mm;
                    background: #f5f5f5;
                    z-index: -1000;
                    font-family: Arial, sans-serif;
                    color: #000;
                    box-sizing: border-box;
                `;

                // Create a wrapper for the full page background
                const pageWrapper = document.createElement('div');
                pageWrapper.style.cssText = `
                    width: 210mm;
                    height: 297mm;
                    background: #f5f5f5;
                    position: relative;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                `;

                // Clone the invoice content
                const clonedInvoice = invoiceDocument.cloneNode(true);
            
            // Apply print-specific styles to the cloned content
            clonedInvoice.style.cssText = `
                width: 210mm !important;
                height: 297mm !important;
                background: #f5f5f5 !important;
                padding: 40px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
                font-family: Arial, sans-serif !important;
                color: #000 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-start !important;
                position: relative !important;
            `;

            // Remove any unwanted elements (like preview actions)
            const actionsToRemove = clonedInvoice.querySelectorAll('.preview-actions');
            actionsToRemove.forEach(action => action.remove());

            // Apply critical styles to ensure proper rendering
            const elementsToStyle = [
                { selector: '.invoice-header-doc', styles: 'display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 60px !important; margin-top: 45px !important; flex-shrink: 0 !important;' },
                { selector: '.logo, .invoice-title', styles: 'font-size: 2.5rem !important; font-weight: bold !important; color: #000 !important; letter-spacing: 3px !important; text-transform: uppercase !important; font-family: "RoxboroughCF", "Times New Roman", Georgia, serif !important;' },
                { selector: '.invoice-info-section', styles: 'display: flex !important; justify-content: space-between !important; margin-bottom: 50px !important; align-items: flex-start !important; flex-shrink: 0 !important;' },
                { selector: '.items-table', styles: 'width: 100% !important; border-collapse: collapse !important; margin-bottom: 30px !important; background: #F5F5F5 !important; flex-shrink: 0 !important;' },
                { selector: '.payment-info', styles: 'display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-top: 40px !important; flex-shrink: 0 !important;' },
                { selector: '.thank-you', styles: 'font-size: 1.5rem !important; margin: 40px 0 !important; color: #000 !important; text-align: center !important; flex-shrink: 0 !important;' }
            ];

            // Special handling for totals section to ensure exact match
            const totalsElements = clonedInvoice.querySelectorAll('.totals');
            totalsElements.forEach(totals => {
                // For PDF generation, always use fixed margin-left: 395px for consistent layout
                totals.style.cssText = 'margin: 30px 0 !important; width: 100% !important; max-width: 350px !important; margin-left: 395px !important; background: #F5F5F5 !important; border-radius: 0 !important; box-shadow: none !important; padding: 25px !important; border: 1px solid #F5F5F5 !important; flex-shrink: 0 !important; font-family: Arial, sans-serif !important;';
                
                const totalsTable = totals.querySelector('table');
                if (totalsTable) {
                    totalsTable.style.cssText = 'width: 100% !important; border-collapse: collapse !important; background: #F5F5F5 !important;';
                }
                
                // Style all table rows
                const totalsRows = totals.querySelectorAll('tr');
                totalsRows.forEach(tr => {
                    tr.style.cssText = 'background: #F5F5F5 !important;';
                });
                
                const totalsTds = totals.querySelectorAll('td');
                totalsTds.forEach(td => {
                    td.style.cssText = 'font-size: 1rem !important; padding: 8px 0 !important; color: #000 !important; border: none !important; background: #F5F5F5 !important; font-family: Arial, sans-serif !important; line-height: 1.4 !important;';
                    
                    // Check if this is the last child (right column)
                    if (td.parentNode.lastElementChild === td) {
                        td.style.cssText += 'text-align: right !important; font-weight: bold !important;';
                    } else {
                        td.style.cssText += 'text-align: left !important; font-weight: normal !important;';
                    }
                });
                
                const totalRows = totals.querySelectorAll('.total-row');
                totalRows.forEach(row => {
                    row.style.cssText = 'background: #F5F5F5 !important;';
                });
                
                const totalRowTds = totals.querySelectorAll('.total-row td');
                totalRowTds.forEach(td => {
                    td.style.cssText = 'font-weight: bold !important; font-size: 1.2rem !important; color: #000 !important; border-top: 2px solid #000 !important; padding-top: 15px !important; margin-top: 10px !important; background: #F5F5F5 !important; font-family: Arial, sans-serif !important; line-height: 1.4 !important;';
                    
                    if (td.parentNode.lastElementChild === td) {
                        td.style.cssText += 'text-align: right !important; font-weight: bold !important;';
                    } else {
                        td.style.cssText += 'text-align: left !important; font-weight: bold !important;';
                    }
                });
            });

            elementsToStyle.forEach(({ selector, styles }) => {
                const elements = clonedInvoice.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.cssText += styles;
                    // Ensure RoxboroughCF font is specifically applied to header elements
                    if (selector.includes('logo') || selector.includes('invoice-title')) {
                        el.style.fontFamily = '"RoxboroughCF", "Times New Roman", Georgia, serif';
                        el.style.fontWeight = 'bold';
                        el.style.textRendering = 'optimizeLegibility';
                        el.style.webkitFontSmoothing = 'antialiased';
                    }
                });
            });

            // Add a spacer element to fill remaining height
            const spacer = document.createElement('div');
            spacer.style.cssText = 'flex: 1; min-height: 20px; background: #f5f5f5;';
            clonedInvoice.appendChild(spacer);

            pageWrapper.appendChild(clonedInvoice);
            printContainer.appendChild(pageWrapper);
            document.body.appendChild(printContainer);

            // Wait for layout to settle, then capture
            setTimeout(() => {
                html2canvas(pageWrapper, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#f5f5f5',
                    width: Math.round(210 * 3.7795275591), // 210mm in pixels at 96dpi
                    height: Math.round(297 * 3.7795275591), // 297mm in pixels at 96dpi
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: Math.round(210 * 3.7795275591),
                    windowHeight: Math.round(297 * 3.7795275591)
                }).then(function(canvas) {
                    // Clean up
                    document.body.removeChild(printContainer);
                    
                    // Create PDF with exact A4 dimensions
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    
                    // Add the image to fill the entire A4 page
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
                    
                    // Generate filename and save
                    const invoiceNumber = document.getElementById('invoice_number')?.value || 'INV-' + Date.now();
                    const filename = `Invoice_${invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                    pdf.save(filename);
                    
                    // Reset button
                    downloadPDF.textContent = 'Download PDF';
                    downloadPDF.disabled = false;
                }).catch(function(error) {
                    console.error('Error generating PDF:', error);
                    
                    // Clean up on error
                    if (document.body.contains(printContainer)) {
                        document.body.removeChild(printContainer);
                    }
                    
                    // Fallback to print
                    alert('PDF generation failed. Opening print dialog instead.');
                    window.print();
                    
                    // Reset button
                    downloadPDF.textContent = 'Download PDF';
                    downloadPDF.disabled = false;
                });
            }, 500); // Increased timeout for better rendering
            }); // Close the ensureFontsLoaded promise
        });
    }

    // Initialize calculations
    calculateTotals();
});

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
        // Trigger the enhanced PDF download
        const event = new Event('click');
        const downloadBtn = document.getElementById('downloadPDF');
        if (downloadBtn) downloadBtn.dispatchEvent(event);
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