const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.post('/products', (req, res) => {
    try {
        const { id, userId, price } = req.body;
        if (!id || !userId || !price) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        }

        const productsArray = readJsonFile('products.json');
        const existingProduct = productsArray.find(product => product.id === id);
        if (existingProduct) {
            return res.status(400).send({ message: 'Product already exists' });
        } else if (isNaN(price)) {
            return res.status(400).send({ message: 'Price should be a number' });
        }
        const newProduct = { id, userId, price };
        productsArray.push(newProduct);
        writeJsonFile('products.json', productsArray);
        res.send(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/products', (req, res) => {
    try {
        const productsArray = readJsonFile('products.json');
        res.send(productsArray);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/products/:id', (req, res) => {
    try {
        const productID = parseInt(req.params.id);
        const productsArray = readJsonFile('products.json');
        const product = productsArray.find(product => product.id === productID);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/products/:id', (req, res) => {
    try {
        const productID = parseInt(req.params.id);
        const { userId, price } = req.body;
        if (!userId || !price) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        } else if (isNaN(price)) {
            return res.status(400).send({ message: 'Price should be a number' });
        }
        const productsArray = readJsonFile('products.json');
        const productIndex = productsArray.findIndex(product => product.id === productID);
        if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not found' });
        }
        const updatedProduct = { id: productID, userId, price };
        productsArray[productIndex] = updatedProduct;
        writeJsonFile('products.json', productsArray);
        res.send(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/products/:id', (req, res) => {
    try {
        const productID = parseInt(req.params.id);
        let productsArray = readJsonFile('products.json');
        const productIndex = productsArray.findIndex(product => product.id === productID);
        if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not found' });
        }

        productsArray = productsArray.filter(product => product.id !== productID);
        writeJsonFile('products.json', productsArray);
        res.send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/orders', (req, res) => {
    try {
        const { id, item, user } = req.body;
        if (!id || !item || !user) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        }
        const ordersArray = readJsonFile('orders.json');
        const existingOrder = ordersArray.find(order => order.id === id);
        if (existingOrder) {
            return res.status(400).send({ message: 'Order already exists' });
        }
        const newOrder = { id, item, user };
        ordersArray.push(newOrder);
        writeJsonFile('orders.json', ordersArray);
        res.send(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/orders', (req, res) => {
    try {
        const ordersArray = readJsonFile('orders.json');
        res.send(ordersArray);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/orders/:id', (req, res) => {
    try {
        const orderID = parseInt(req.params.id);
        const ordersArray = readJsonFile('orders.json');
        const order = ordersArray.find(order => order.id === orderID);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.send(order);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/orders/:id', (req, res) => {
    try {
        const orderID = parseInt(req.params.id);
        const { item } = req.body;
        if (!item) {
            return res.status(400).send({ message: 'Please fill all fields' });
        }

        const ordersArray = readJsonFile('orders.json');
        const orderIndex = ordersArray.findIndex(order => order.id === orderID);
        if (orderIndex === -1) {
            return res.status(404).send({ message: 'Order not found' });
        }

        const updatedOrder = { id: orderID, item };
        ordersArray[orderIndex] = updatedOrder;
        writeJsonFile('orders.json', ordersArray);
        res.send(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/orders/:id', (req, res) => {
    try {
        const orderID = parseInt(req.params.id);
        let ordersArray = readJsonFile('orders.json');
        const orderIndex = ordersArray.findIndex(order => order.id === orderID);
        if (orderIndex === -1) {
            return res.status(404).send({ message: 'Order not found' });
        }

        ordersArray = ordersArray.filter(order => order.id !== orderID);
        writeJsonFile('orders.json', ordersArray);
        res.send({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.post('/orders/:id/item', (req, res) => {
    try {
        const orderID = parseInt(req.params.id);
        const { item } = req.body;
        if (!item) {
            return res.status(400).send({ message: 'Please fill all fields' });
        } else if (typeof item !== "object") {
            return res.status(400).send({ message: 'Item should be an object' });
        }
        const ordersArray = readJsonFile('orders.json');
        const orderIndex = ordersArray.findIndex(order => order.id === orderID);
        if (orderIndex === -1) {
            return res.status(404).send({ message: 'Order not found' });
        }
        const order = ordersArray[orderIndex];
        order.item = order.item || [];
        order.item.push(item);
        writeJsonFile('orders.json', ordersArray);
        res.send(order);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})


app.post('/orders/:id/status', (req, res) => {
    try {
        const orderID = parseInt(req.params.id);
        const { status } = req.body;
        if (!status) {
            return res.status(400).send({ message: 'Please fill all fields' });
        } else if (status !== 'shipped' && status !== 'delivered' && status !== 'pending') {
            return res.status(400).send({ message: 'Invalid status' });
        }
        const ordersArray = readJsonFile('orders.json');
        const orderIndex = ordersArray.findIndex(order => order.id === orderID);
        if (orderIndex === -1) {
            return res.status(404).send({ message: 'Order not found' });
        }
        const order = ordersArray[orderIndex];
        order.status = status;
        writeJsonFile('orders.json', ordersArray);
        res.send(order);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})


app.get('/orders/:id/status', (req, res) => {
    try {
        const orderID = parseInt(req.params.id);
        const ordersArray = readJsonFile('orders.json');
        const orderIndex = ordersArray.findIndex(order => order.id === orderID);
        if (orderIndex === -1) {
            return res.status(404).send({ message: 'Order not found' });
        }
        const order = ordersArray[orderIndex];
        res.send(order.status);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})


app.get('/users/:userId/orders', (req, res) => {
    try {
        const userID = parseInt(req.params.userId);
        const ordersArray = readJsonFile('orders.json');
        const userOrders = ordersArray.filter(order => order.userID === userID);
        res.send(userOrders);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
