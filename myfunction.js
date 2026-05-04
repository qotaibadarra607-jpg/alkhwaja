// متغير لحفظ عدد العناصر في السلة
let c = parseInt(localStorage.c) || 0;

// دالة لتحميل الهيدر
function loadHeader(){
const headerHTML = `
<nav style="background:#3498db;color:white;padding:20px;text-align:center;margin-bottom:30px;">
<a href="home.html" style="color:white;margin:0 20px;text-decoration:none;padding:8px 15px;border-radius:6px;">الرئيسية</a>
<a href="Meals.html" style="color:white;margin:0 20px;text-decoration:none;padding:8px 15px;border-radius:6px;">الوجبات</a>
<a href="about.html" style="color:white;margin:0 20px;text-decoration:none;padding:8px 15px;border-radius:6px;">من نحن</a>
<span id="cart-count" onclick="openCartModal()" style="background:#e67e22;color:white;padding:5px 12px;border-radius:20px;float:left;margin-top:5px;font-weight:bold;cursor:pointer;" title="انقر لعرض السلة">0</span>
</nav>
`;
document.body.innerHTML = headerHTML + document.body.innerHTML;
}

// تحديث عداد السلة
function updateCartCount(){
const cartCountEl = document.getElementById('cart-count');
if(cartCountEl){
cartCountEl.innerHTML = c;
}
}

// متغيرات مؤقتة لحفظ الكمية المختارة
let tempQuantities = {};

// إظهار محدد الكمية
function showQuantitySelector(itemId){
tempQuantities[itemId] = 1;

const addBtn = document.getElementById('add-btn-' + itemId);
const quantityDiv = document.getElementById('quantity-' + itemId);

if(addBtn) addBtn.style.display = 'none';
if(quantityDiv) quantityDiv.style.display = 'block';

// إعادة تعيين العرض
const qtyDisplay = document.getElementById('qty-display-' + itemId);
if(qtyDisplay) qtyDisplay.innerText = '1';
}

// تغيير الكمية
function changeQuantity(itemId, change){
if(!tempQuantities[itemId]) tempQuantities[itemId] = 1;

tempQuantities[itemId] += change;

// منع الكمية السالبة أو الصفر
if(tempQuantities[itemId] < 1) tempQuantities[itemId] = 1;

const qtyDisplay = document.getElementById('qty-display-' + itemId);
if(qtyDisplay) qtyDisplay.innerText = tempQuantities[itemId];
}

// إلغاء الاختيار
function cancelQuantity(itemId){
const addBtn = document.getElementById('add-btn-' + itemId);
const quantityDiv = document.getElementById('quantity-' + itemId);

if(addBtn) addBtn.style.display = 'inline-block';
if(quantityDiv) quantityDiv.style.display = 'none';

delete tempQuantities[itemId];
}

// تأكيد الإضافة للسلة
function confirmAddToCart(itemId){
const quantity = tempQuantities[itemId] || 1;

let cart = JSON.parse(localStorage.cart || '[]');
let item = cart.find(function(x){ return x.i === itemId; });

if(item){
item.q += quantity;
} else {
cart.push({i: itemId, q: quantity});
}

localStorage.cart = JSON.stringify(cart);

// تحديث العداد
c += quantity;
localStorage.c = c;
updateCartCount();

// إخفاء محدد الكمية وإظهار زر الإضافة
const addBtn = document.getElementById('add-btn-' + itemId);
const quantityDiv = document.getElementById('quantity-' + itemId);

if(addBtn) addBtn.style.display = 'inline-block';
if(quantityDiv) quantityDiv.style.display = 'none';

// إظهار إشعار
const notificationDiv = document.getElementById('notification-' + itemId);
if(notificationDiv){
notificationDiv.style.display = 'block';
setTimeout(function(){
notificationDiv.style.display = 'none';
}, 2000);
}

delete tempQuantities[itemId];
}

// دالة addCart القديمة - محفوظة للتوافق
function addCart(i){
confirmAddToCart(i);
}

// إظهار التفاصيل
function showDetails(id){
const detailsDiv = document.getElementById('details-' + id);
if(detailsDiv){
if(detailsDiv.style.display === 'none' || detailsDiv.style.display === ''){
detailsDiv.style.display = 'block';
}else{
detailsDiv.style.display = 'none';
}
}
}

// الانتقال إلى نموذج الطلب
function continueToOrder(){
document.getElementById('order').style.display = 'block';
}

// التحقق من الاسم بالعربية
function validateArabicName(name){
// التحقق أن الاسم يحتوي على أحرف عربية فقط
// الأحرف العربية تبدأ من 1569 (0621) إلى 1610 (064A)
// المسافات والحركات مقبولة
for(let i = 0; i < name.length; i++){
let charCode = name.charCodeAt(i);
// السماح بالمسافات
if(charCode === 32) continue;
// السماح بالحركات العربية (1611-1630)
if(charCode >= 1611 && charCode <= 1630) continue;
// السماح بالأحرف العربية (1569-1610)
if(charCode < 1569 || charCode > 1610){
return false;
}
}
return true;
}

// التحقق من الرقم الوطني
function validateNationalId(id){
// التحقق أن الرقم الوطني 11 خانة
if(id.length !== 11) return false;
for(let i = 0; i < id.length; i++){
if(id[i] < '0' || id[i] > '9'){
return false;
}
}
return true;
}

// التحقق المباشر من الأحرف العربية فقط
function validateArabicInput(input){
let value = input.value;
let newValue = '';
for(let i = 0; i < value.length; i++){
let charCode = value.charCodeAt(i);
// السماح بالمسافات
if(charCode === 32){
newValue += value[i];
continue;
}
// السماح بالحركات العربية
if(charCode >= 1611 && charCode <= 1630){
newValue += value[i];
continue;
}
// السماح بالأحرف العربية
if(charCode >= 1569 && charCode <= 1610){
newValue += value[i];
}
}
input.value = newValue;
}

// التحقق المباشر من الأرقام فقط
function validateNumbersOnly(input){
let value = input.value;
input.value = value.replace(/[^0-9]/g, '');
}

// تنسيق تاريخ الميلاد تلقائياً أثناء الكتابة
function formatBirthDate(input){
let value = input.value;
// إزالة أي أحرف غير أرقام
value = value.replace(/[^0-9]/g, '');
// إضافة الشرطة بعد اليوم (خانتين)
if(value.length >= 2){
value = value.substring(0, 2) + '-' + value.substring(2);
}
// إضافة الشرطة بعد الشهر (خانتين أخرى)
if(value.length >= 5){
value = value.substring(0, 5) + '-' + value.substring(5, 9);
}
input.value = value;
}

// التحقق من تاريخ الميلاد
function validateBirthDate(date){
// التحقق من صيغة dd-mm-yyyy
if(date.length !== 10) return false;
if(date[2] !== '-' || date[5] !== '-') return false;
const parts = date.split('-');
const day = parseInt(parts[0]);
const month = parseInt(parts[1]);
const year = parseInt(parts[2]);
if(isNaN(day) || isNaN(month) || isNaN(year)) return false;
if(day < 1 || day > 31) return false;
if(month < 1 || month > 12) return false;
if(year < 1900 || year > 2026) return false;
// تحقق إضافي: عدد أيام الشهر
const daysInMonth = new Date(year, month, 0).getDate();
if(day > daysInMonth) return false;
return true;
}

// التحقق من رقم الموبايل
function validateMobileNumber(number){
// التحقق أن الرقم يبدأ بـ 09 وله 10 خانات
if(number.length !== 10) return false;
if(number[0] !== '0' || number[1] !== '9') return false;
return true;
}

// التحقق من الإيميل
function validateEmail(email){
// التحقق أن الإيميل يحتوي على @ و .
if(email.indexOf('@') === -1) return false;
if(email.indexOf('.') === -1) return false;
if(email.indexOf('@') > email.lastIndexOf('.')) return false;
return true;
}

// حساب المبلغ مع الضريبة
function calculateTotalWithTax(amount){
const tax = amount * 0.05;
return amount + tax;
}

// إغلاق النافذة المنبثقة
function closeModal(){
document.getElementById('summaryModal').style.display = 'none';
}

// فتح نافذة السلة
function openCartModal(){
const cartModal = document.getElementById('cartModal');
if(cartModal){
displayCartItems();
cartModal.style.display = 'flex';
}
}

// إغلاق نافذة السلة
function closeCartModal(){
const cartModal = document.getElementById('cartModal');
if(cartModal){
cartModal.style.display = 'none';
}
}

// عرض محتويات السلة
function displayCartItems(){
const cartItemsDiv = document.getElementById('cartItems');
if(!cartItemsDiv) return;

const cart = JSON.parse(localStorage.cart || '[]');
const mealNames = {
'SF-001': 'كباب مشوي',
'SF-006': 'برجر لحم',
'SF-007': 'كنتاكي مقرمش',
'SF-008': 'كبة محشية',
'SF-009': 'ريزوتو دجاج',
'SF-010': 'وجبة صحية'
};

const mealPrices = {
'SF-001': 110000,
'SF-006': 85000,
'SF-007': 95000,
'SF-008': 120000,
'SF-009': 75000,
'SF-010': 65000
};

if(cart.length === 0){
cartItemsDiv.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">السلة فارغة</p>';
return;
}

let html = '<ul style="list-style:none;padding:0;margin:0;">';
let total = 0;

cart.forEach(function(item){
const name = mealNames[item.i] || item.i;
const price = mealPrices[item.i] || 0;
const itemTotal = price * item.q;
total += itemTotal;

html += '<li style="border-bottom:1px solid #e1e8ed;padding:15px 0;">';
html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
html += '<div>';
html += '<strong style="font-size:1.1em;">' + name + '</strong><br>';
html += '<small style="color:#666;">ID: ' + item.i + '</small>';
html += '</div>';
html += '<span style="font-weight:bold;color:#3498db;font-size:1.1em;">' + itemTotal.toLocaleString() + ' س.ل</span>';
html += '</div>';
html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
html += '<small style="color:#666;">الكمية: ' + item.q + ' × ' + price.toLocaleString() + ' س.ل</small>';
// زر الإزالة بارز وواضح
html += '<button onclick="removeFromCart(\'' + item.i + '\')" style="background:#e74c3c;color:white;border:0;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:background 0.2s;" onmouseover="this.style.background=\'#c0392b\'" onmouseout="this.style.background=\'#e74c3c\'">إزالة من السلة</button>';
html += '</div>';
html += '</li>';
});

html += '</ul>';
html += '<div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-top:20px;text-align:center;">';
html += '<strong style="font-size:1.3em;color:#2c3e50;">المجموع: ' + total.toLocaleString() + ' س.ل</strong>';
html += '</div>';

cartItemsDiv.innerHTML = html;
}

// إزالة عنصر من السلة
function removeFromCart(itemId){
let cart = JSON.parse(localStorage.cart || '[]');
const itemIndex = cart.findIndex(function(x){ return x.i === itemId; });

if(itemIndex > -1){
const removedQuantity = cart[itemIndex].q;
cart.splice(itemIndex, 1);
localStorage.cart = JSON.stringify(cart);

// تحديث العداد
let currentCount = parseInt(localStorage.c) || 0;
currentCount -= removedQuantity;
if(currentCount < 0) currentCount = 0;
localStorage.c = currentCount;
c = currentCount;

updateCartCount();
displayCartItems();

// إخفاء الإشعار إذا كان موجوداً
const notificationDiv = document.getElementById('notification-' + itemId);
if(notificationDiv){
notificationDiv.style.display = 'none';
}
}
}

window.onload = function(){
loadHeader();
updateCartCount();

// تعريف event listeners بعد تحميل الصفحة
const customerOrderForm = document.getElementById('customerOrderForm');
if(customerOrderForm){
customerOrderForm.onsubmit=function(e){
e.preventDefault();
const fullName = document.getElementById('fullName').value;
const nationalId = document.getElementById('nationalId').value;
const birthDate = document.getElementById('birthDate').value;
const mobileNumber = document.getElementById('mobileNumber').value;
const phoneNetwork = document.getElementById('phoneNetwork').value;
const email = document.getElementById('email').value;

// التحقق من الاسم (أحرف عربية فقط)
if(!validateArabicName(fullName) || fullName.length < 3){
alert('الاسم يجب أن يحتوي على أحرف عربية فقط\n(3 أحرف على الأقل)');
return;
}

// التحقق من الرقم الوطني (11 خانة)
if(!validateNationalId(nationalId)){
alert('الرقم الوطني غير صالح\nيجب أن يكون 11 رقماً');
return;
}

// التحقق من تاريخ الميلاد (dd-mm-yyyy)
if(!validateBirthDate(birthDate)){
alert('تاريخ الميلاد غير صالح\nيجب أن يكون: dd-mm-yyyy\nمثال: 15-05-1995\nالسنة بين 1900-2026');
return;
}

// التحقق من رقم الموبايل (Syriatel أو MTN)
if(mobileNumber && !validateMobileNumber(mobileNumber)){
alert('رقم الموبايل غير صالح\nيجب أن يبدأ بـ 09 ويكون 10 أرقام');
return;
}

// التحقق من الإيميل
if(email && !validateEmail(email)){
alert('الإيميل غير صالح\nمثال: name@email.com');
return;
}

// حساب المبلغ النهائي
const cart = JSON.parse(localStorage.cart || '[]');
const mealPrices = {
'SF-001': 110000,
'SF-006': 85000,
'SF-007': 95000,
'SF-008': 120000,
'SF-009': 75000,
'SF-010': 65000
};

let subtotal = 0;
let orderDetails = '<h3>الوجبات المختارة:</h3><ul>';
cart.forEach(item => {
const price = mealPrices[item.i] || 0;
subtotal += price * item.q;
orderDetails += `<li>ID: ${item.i} - الكمية: ${item.q}</li>`;
});
orderDetails += '</ul>';

const totalWithTax = calculateTotalWithTax(subtotal);

orderDetails += `<h3>ملخص الطلب:</h3>`;
orderDetails += `<p><strong>الاسم:</strong> ${fullName}</p>`;
orderDetails += `<p><strong>الرقم الوطني:</strong> ${nationalId}</p>`;
orderDetails += `<p><strong>تاريخ الميلاد:</strong> ${birthDate}</p>`;
if(mobileNumber) orderDetails += `<p><strong>رقم الموبايل:</strong> ${phoneNetwork} ${mobileNumber}</p>`;
if(email) orderDetails += `<p><strong>الإيميل:</strong> ${email}</p>`;
orderDetails += `<p><strong>المبلغ قبل الضريبة:</strong> ${subtotal.toLocaleString()} س.ل</p>`;
orderDetails += `<p><strong>الضريبة (5%):</strong> ${(subtotal * 0.05).toLocaleString()} س.ل</p>`;
orderDetails += `<p><strong>المبلغ النهائي:</strong> ${totalWithTax.toLocaleString()} س.ل</p>`;

document.getElementById('orderSummary').innerHTML = orderDetails;
document.getElementById('summaryModal').style.display = 'flex';
};
}

const filter = document.getElementById('filter');
if(filter){
filter.onchange=function(){
let f=this.value;
document.querySelectorAll('.meal').forEach(m=>{
m.style.display=f=='all'||m.dataset.cat==f?'block':'none';
});
};
}
};
