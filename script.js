// Data Awal
let products = [
    {
        id: 1,
        name: "Kopi Hitam",
        price: 5000,
        image: "image/kopi.jpg"
    },
    {  
        id: 2, 
        name: "Teh Hangat", 
        price: 4000,
        image: "image/tehhangat.jpg"
    },
    { 
        id: 3, 
        name: "Roti Bakar", 
        price: 6000,
        image: "image/rotibakar.jpg"
    },
    { 
        id: 4, 
        name: "Nasi Goreng", 
        price: 15000,
        image: "image/nasi-goreng.jpg"
    },
    { 
        id: 5, 
        name: "Mie Goreng", 
        price: 12000,
        image: "image/mie-goreng-saus-tiram.jpg"
    },
    { 
        id: 6, 
        name: "Air Mineral", 
        price: 3000,
        image: "image/airmineral.jpg"
    },
    { 
        id: 7, 
        name: "Mie Ayam", 
        price: 10000,
        image: "image/mieayam.jpeg"
    },
    { 
        id: 8, 
        name: "Bakso Mercon", 
        price: 15000,
        image: "image/baksomercon.jpeg"
    },
    { 
        id: 9, 
        name: "Bakso Jumbo", 
        price: 17000,
        image: "image/baksojumbo.jpeg"
    },
    { 
        id: 10, 
        name: "Es Campur", 
        price: 6000,
        image: "image/es-campur.jpg"
    },
    { 
        id: 11, 
        name: "Es Teh", 
        price: 4000,
        image: "image/esteh.jpeg"
    },
    { 
        id: 12, 
        name: "Nasi Pecel", 
        price: 7000,
        image: "image/pecel.jpeg"
    },
    { 
        id: 13, 
        name: "Gado-Gado", 
        price: 10000,
        image: "image/gado.jpeg"
    },
    { 
        id: 14, 
        name: "Rujak Cingur", 
        price: 10000,
        image: "image/rujakcingur.jpg"
    },
    { 
        id: 15, 
        name: "Ayam Bakar", 
        price: 20000,
        image: "image/ayam-bakar.jpg"
    }
];

let cart = [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
// Variabel global untuk menyimpan gambar sementara
let currentProductImage = null;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const changeEl = document.getElementById('change');
const discountInput = document.getElementById('discount');
const paymentInput = document.getElementById('payment');
const checkoutBtn = document.getElementById('checkout');
const clearCartBtn = document.getElementById('clear-cart');
const customerNameInput = document.getElementById('customer-name');
const customerPhoneInput = document.getElementById('customer-phone');
const productSearch = document.getElementById('product-search');

// Modal Elements
const receiptModal = document.getElementById('receipt-modal');
const receiptContent = document.getElementById('receipt-content');
const printReceiptBtn = document.getElementById('print-receipt');
const closeReceiptBtn = document.getElementById('close-receipt');
const historyModal = document.getElementById('history-modal');
const viewHistoryBtn = document.getElementById('view-transactions');
const closeHistoryBtn = document.querySelector('#history-modal .close-modal');
const transactionHistory = document.querySelector('#transaction-history tbody');
const productModal = document.getElementById('product-modal');
const manageProductsBtn = document.getElementById('manage-products');
const closeProductModalBtn = document.querySelector('#product-modal .close-modal');
const productForm = document.getElementById('product-form');
const productTable = document.querySelector('#product-table tbody');

// Initialize App
function init() {
    renderProducts();
    renderCart();
    setupEventListeners();
}

// Render Products
function renderProducts(filter = '') {
    productGrid.innerHTML = '';

    products.filter(product =>
        product.name.toLowerCase().includes(filter.toLowerCase())
    ).forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image ?
                `<img src="${product.image}" alt="${product.name}">` :
                '<div class="no-image"><i class="fas fa-box-open"></i></div>'}
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
        `;
        productCard.addEventListener('click', () => addToCart(product.id));
        productGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    renderCart();
}

// Remove from Cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        renderCart();
    }
}

// Render Cart
function renderCart() {
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
            <div class="cart-item-controls">
                <button class="cart-item-decrease" data-id="${item.id}">-</button>
                <input type="number" class="cart-item-qty" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="cart-item-increase" data-id="${item.id}">+</button>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Add event listeners to cart controls
    document.querySelectorAll('.cart-item-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    
    document.querySelectorAll('.cart-item-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').getAttribute('data-id'));
            cart = cart.filter(item => item.id !== id);
            renderCart();
        });
    });
    
    document.querySelectorAll('.cart-item-qty').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const newQty = parseInt(e.target.value);
            const item = cart.find(item => item.id === id);
            if (item && newQty > 0) {
                item.quantity = newQty;
                renderCart();
            } else if (item && newQty <= 0) {
                cart = cart.filter(item => item.id !== id);
                renderCart();
            }
        });
    });
    
    updateTotals();
}

// Update Totals
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseInt(discountInput.value) || 0;
    const total = subtotal - discount;

    subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Calculate change
    const payment = parseInt(paymentInput.value) || 0;
    const change = payment - total;
    changeEl.textContent = `Rp ${change > 0 ? change.toLocaleString('id-ID') : 0}`;
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }

    const payment = parseInt(paymentInput.value) || 0;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseInt(discountInput.value) || 0;
    const total = subtotal - discount;

    if (payment < total) {
        alert('Pembayaran kurang!');
        return;
    }

    const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: customerNameInput.value || 'Pelanggan',
            phone: customerPhoneInput.value || '-'
        },
        items: [...cart],
        subtotal,
        discount,
        total,
        payment,
        change: payment - total
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    showReceipt(transaction);
    resetCart();
}

// Show Receipt
function showReceipt(transaction) {
    receiptContent.innerHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <h2>Warung Spesial Ibu</h2>
                <p>Jl. Contoh No. 123, Kota</p>
                <p>Telp: 08123456789</p>
            </div>
            
            <div class="receipt-info">
                <div>
                    <span>No. Transaksi:</span>
                    <span>${transaction.id}</span>
                </div>
                <div>
                    <span>Tanggal:</span>
                    <span>${new Date(transaction.date).toLocaleString('id-ID')}</span>
                </div>
                <div>
                    <span>Pelanggan:</span>
                    <span>${transaction.customer.name}</span>
                </div>
            </div>
            
            <table class="receipt-items">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th class="right">Harga</th>
                        <th class="right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${transaction.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td class="right">Rp ${item.price.toLocaleString('id-ID')}</td>
                            <td class="right">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="receipt-total">
                <div>
                    <span>Subtotal:</span>
                    <span>Rp ${transaction.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div>
                    <span>Diskon:</span>
                    <span>Rp ${transaction.discount.toLocaleString('id-ID')}</span>
                </div>
                <div>
                    <span>Total:</span>
                    <span>Rp ${transaction.total.toLocaleString('id-ID')}</span>
                </div>
                <div>
                    <span>Bayar:</span>
                    <span>Rp ${transaction.payment.toLocaleString('id-ID')}</span>
                </div>
                <div>
                    <span>Kembalian:</span>
                    <span>Rp ${transaction.change.toLocaleString('id-ID')}</span>
                </div>
            </div>
            
            <div class="receipt-footer">
                <p>Terima kasih telah berbelanja</p>
                <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
            </div>
        </div>
    `;

    receiptModal.classList.add('active');
}

// Reset Cart
function resetCart() {
    cart = [];
    customerNameInput.value = '';
    customerPhoneInput.value = '';
    discountInput.value = '0';
    paymentInput.value = '';
    renderCart();
}

// Show Transaction History
function showTransactionHistory() {
    transactionHistory.innerHTML = '';

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${new Date(transaction.date).toLocaleString('id-ID')}</td>
            <td>${transaction.customer.name}</td>
            <td>Rp ${transaction.total.toLocaleString('id-ID')}</td>
            <td class="action-buttons">
                <button class="view-receipt" data-id="${transaction.id}"><i class="fas fa-receipt"></i></button>
            </td>
        `;
        transactionHistory.appendChild(row);
    });

    // Add event listeners to view receipt buttons
    document.querySelectorAll('.view-receipt').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').getAttribute('data-id'));
            const transaction = transactions.find(t => t.id === id);
            if (transaction) {
                showReceipt(transaction);
                historyModal.classList.remove('active');
            }
        });
    });

    historyModal.classList.add('active');
}

// Product Management
function showProductModal() {
    renderProductTable();
    productModal.classList.add('active');
}

function renderProductTable() {
    productTable.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
            <td class="action-buttons">
                <button class="edit-product" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-product" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        productTable.appendChild(row);
    });

    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').getAttribute('data-id'));
            editProduct(id);
        });
    });

    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').getAttribute('data-id'));
            deleteProduct(id);
        });
    });
}

// Fungsi edit produk
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;

    const preview = document.getElementById('image-preview');
    if (product.image) {
        preview.innerHTML = `<img src="${product.image}" alt="Preview">`;
        currentProductImage = product.image;
    } else {
        preview.innerHTML = 'No Image';
        currentProductImage = null;
    }
}

function deleteProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderProductTable();
        renderProducts();
    }
}

function saveProduct(e) {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value);

    if (!name || isNaN(price) || price <= 0) {
        alert('Harap isi semua field dengan benar!');
        return;
    }

    const productData = {
        id: id ? parseInt(id) : currentProductId++,
        name,
        price,
        image: currentProductImage || null
    };

    if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        // Add new product
        products.push(productData);
    }

    localStorage.setItem('products', JSON.stringify(products));
    resetProductForm();
    renderProductTable();
    renderProducts();
}

// Kompres gambar sebelum disimpan
function compressImage(file, maxWidth = 100, maxHeight = 100, quality = 0.7) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        };
        reader.readAsDataURL(file);
    });
}
document.getElementById('product-image').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const compressedImage = await compressImage(file);
    const preview = document.getElementById('image-preview');
    preview.innerHTML = `<img src="${compressedImage}" alt="Preview">`;
    currentProductImage = compressedImage;
});

// Fungsi reset form
function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview').innerHTML = 'No Image';
    currentProductImage = null;
}

// Variabel dan DOM
const reportModal = document.getElementById('report-modal');
const viewReportsBtn = document.getElementById('view-reports');
const reportTypeSelect = document.getElementById('report-type');
const reportDateInput = document.getElementById('report-date');
const reportMonthInput = document.getElementById('report-month');
const generateReportBtn = document.getElementById('generate-report');
const reportResult = document.getElementById('report-result');

// Event Listeners
viewReportsBtn.addEventListener('click', () => {
    reportModal.classList.add('active');
    generateReport();
});

// Event listener untuk input gambar
document.getElementById('product-image').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        currentProductImage = event.target.result; // Simpan sebagai base64
    };
    reader.readAsDataURL(file);
});

reportTypeSelect.addEventListener('change', (e) => {
    if (e.target.value === 'daily') {
        reportDateInput.style.display = 'block';
        reportMonthInput.style.display = 'none';
    } else {
        reportDateInput.style.display = 'none';
        reportMonthInput.style.display = 'block';
    }
});

generateReportBtn.addEventListener('click', generateReport);

// Fungsi Generate Report
function generateReport() {
    const type = reportTypeSelect.value;
    let dateFilter, transactionsFiltered;

    if (type === 'daily') {
        dateFilter = new Date(reportDateInput.value);
        transactionsFiltered = transactions.filter(t => {
            const transDate = new Date(t.date);
            return transDate.toDateString() === dateFilter.toDateString();
        });
    } else {
        const [year, month] = reportMonthInput.value.split('-');
        transactionsFiltered = transactions.filter(t => {
            const transDate = new Date(t.date);
            return transDate.getFullYear() == year &&
                transDate.getMonth() + 1 == month;
        });
    }

    renderReport(transactionsFiltered, type);
}

// 4. Fungsi Render Report
function renderReport(data, type) {
    if (data.length === 0) {
        reportResult.innerHTML = `<p>Tidak ada transaksi pada periode ini</p>`;
        return;
    }

    let html = '';
    const totalIncome = data.reduce((sum, t) => sum + t.total, 0);

    if (type === 'daily') {
        html = `
            <h3>Laporan Harian</h3>
            <p>Tanggal: ${new Date(reportDateInput.value).toLocaleDateString('id-ID')}</p>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Waktu</th>
                        <th>Pelanggan</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((t, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${new Date(t.date).toLocaleTimeString('id-ID')}</td>
                            <td>${t.customer.name}</td>
                            <td>Rp ${t.total.toLocaleString('id-ID')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        // Group by date untuk laporan bulanan
        const dailyGroups = {};
        data.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('id-ID');
            if (!dailyGroups[date]) dailyGroups[date] = 0;
            dailyGroups[date] += t.total;
        });

        html = `
            <h3>Laporan Bulanan</h3>
            <p>Bulan: ${new Date(reportMonthInput.value + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Jumlah Transaksi</th>
                        <th>Total Penghasilan</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(dailyGroups).map(([date, total], i) => {
            const count = data.filter(t =>
                new Date(t.date).toLocaleDateString('id-ID') === date
            ).length;
            return `
                            <tr>
                                <td>${date}</td>
                                <td>${count}</td>
                                <td>Rp ${total.toLocaleString('id-ID')}</td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
    }

    // Tambahkan summary
    html += `
        <div class="report-summary">
            Total Penghasilan: Rp ${totalIncome.toLocaleString('id-ID')}
        </div>
        
        <div class="chart-container">
            <canvas id="income-chart"></canvas>
        </div>
    `;

    reportResult.innerHTML = html;

    // Render chart (membutuhkan library Chart.js)
    renderChart(data, type);
}

// Fungsi Render Chart (Opsional)
function renderChart(data, type) {
    if (typeof Chart === 'undefined') return;

    const ctx = document.getElementById('income-chart').getContext('2d');
    let labels, chartData;

    if (type === 'daily') {
        // Chart per jam untuk laporan harian
        const hourlyData = Array(24).fill(0);
        data.forEach(t => {
            const hour = new Date(t.date).getHours();
            hourlyData[hour] += t.total;
        });

        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        chartData = hourlyData;
    } else {
        // Chart per hari untuk laporan bulanan
        const dailyData = {};
        data.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('id-ID');
            if (!dailyData[date]) dailyData[date] = 0;
            dailyData[date] += t.total;
        });

        labels = Object.keys(dailyData);
        chartData = Object.values(dailyData);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Penghasilan',
                data: chartData,
                backgroundColor: '#4361ee',
                borderColor: '#3f37c9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return 'Rp ' + context.raw.toLocaleString('id-ID');
                        }
                    }
                }
            }
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart and checkout
    discountInput.addEventListener('input', updateTotals);
    paymentInput.addEventListener('input', updateTotals);
    checkoutBtn.addEventListener('click', checkout);
    clearCartBtn.addEventListener('click', resetCart);

    // Receipt modal
    printReceiptBtn.addEventListener('click', () => window.print());
    closeReceiptBtn.addEventListener('click', () => receiptModal.classList.remove('active'));

    // History modal
    viewHistoryBtn.addEventListener('click', showTransactionHistory);
    closeHistoryBtn.addEventListener('click', () => historyModal.classList.remove('active'));

    // Product modal
    manageProductsBtn.addEventListener('click', showProductModal);
    closeProductModalBtn.addEventListener('click', () => productModal.classList.remove('active'));
    document.getElementById('cancel-product').addEventListener('click', () => {
        productForm.reset();
        document.getElementById('product-id').value = '';
    });
    productForm.addEventListener('submit', saveProduct);

    // Product search
    productSearch.addEventListener('input', (e) => renderProducts(e.target.value));

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    // Tambahkan di fungsi setupEventListeners()
    document.querySelector('#report-modal .close-modal').addEventListener('click', () => {
        reportModal.classList.remove('active');
    });

    // Untuk close modal saat klik di luar area konten
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            reportModal.classList.remove('active');
        }
    });
}

// Inisialisasi Tanggal
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    reportDateInput.value = today;

    const currentMonth = new Date().toISOString().slice(0, 7);
    reportMonthInput.value = currentMonth;
});
// Initialize the app
document.addEventListener('DOMContentLoaded', init);
