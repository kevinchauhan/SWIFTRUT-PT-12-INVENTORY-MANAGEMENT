import Product from '../models/Product.js'

class ProductController {
    // Fetch all products
    static async getAllProducts(req, res) {
        try {
            const products = await Product.find();
            return res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ message: 'Error fetching products' });
        }
    }

    // Add a new product
    static async addProduct(req, res) {
        const { name, price, description, imageUrl, stock } = req.body;

        try {
            const newProduct = new Product({
                name,
                price,
                description,
                imageUrl,
                stock,
            });

            await newProduct.save();
            return res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error adding product:', error);
            return res.status(500).json({ message: 'Error adding product' });
        }
    }

    // Edit an existing product
    static async editProduct(req, res) {
        const { id } = req.params;
        const { name, price, description, imageUrl, stock } = req.body;

        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { name, price, description, imageUrl, stock },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ message: 'Error updating product' });
        }
    }

    // Delete a product
    static async deleteProduct(req, res) {
        const { id } = req.params;

        try {
            const deletedProduct = await Product.findByIdAndDelete(id);

            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ message: 'Error deleting product' });
        }
    }
}

export default ProductController;
