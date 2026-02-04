const API_URL = 'http://127.0.0.1:3000/api';

const testAdminFlow = async () => {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'athults457@gmail.com',
                password: 'Nopps4089h@'
            })
        });
        
        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token obtained.');
        
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };

        console.log('\n2. Creating a Test Product...');
        const productData = {
            name: "Test Delete Me",
            price: 100,
            description: "Temporary product",
            category: "Test",
            stock: 10,
            image: "http://example.com/img.jpg",
            vendorId: "vendor_test",
            isApproved: true
        };

        const createRes = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(productData)
        });

        if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
        const createdProduct = await createRes.json();
        const productId = createdProduct._id;
        console.log(`Product Created: ${productId}`);

        console.log('\n3. Updating the Product...');
        const updateData = { ...productData, price: 150, name: "Updated Name" };
        const updateRes = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updateData)
        });

        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.status}`);
        const updatedProduct = await updateRes.json();
        console.log(`Product Updated. New Price: ${updatedProduct.price}`);

        console.log('\n4. Deleting the Product...');
        const deleteRes = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers
        });

        if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteRes.status}`);
        const deleteData = await deleteRes.json();
        console.log(`Delete Result: ${deleteData.message}`);

        console.log('\nSUCCESS: All admin actions verified working.');

    } catch (error) {
        console.error('\nFAILURE:');
        console.error(error.message);
    }
};

testAdminFlow();
