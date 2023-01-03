const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    // guardo el próximo id en archivo/
    this.idFile = "./id2.txt";
    if (fs.existsSync(`${this.idFile}`)) {
      this.id = JSON.parse(fs.readFileSync(`${this.idFile}`));
    } else {
      this.id = 1;
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      let product = {
        id: this.id,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
      };
      this.id++;
      await fs.promises.writeFile(`${this.idFile}`, JSON.stringify(this.id));
      let products = [];
      if (fs.existsSync(`${this.path}`)) {
        products = await this.getProducts();
      } else {
        products = [];
      }
      products.push(product);
      await fs.promises.writeFile(`${this.path}`, JSON.stringify(products, null, 2)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async getProducts() {
    try {
      let data;
      if (fs.existsSync(`${this.path}`))  {
        data = await fs.promises.readFile(`${this.path}`, "utf-8");
      } else {
        return [];
      }  
      const object = JSON.parse(data);
      return object;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      return products.find(product => product.id === productId);
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updates) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.map((product) => {
        if (product.id === id) {
          return { ...product, ...updates };
        }
        return product;
      });
      await fs.promises.writeFile(`${this.path}`, JSON.stringify(updatedProducts, null, 2));
    } catch (error) {
      console.error(error);
    }
  }
  
  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter((product) => product.id !== productId);
      await fs.promises.writeFile(`${this.path}`, JSON.stringify(updatedProducts, null, 2));
    } catch (error) {
      console.error(error);
    }
  }  

}

async function main() {
  const manager = new ProductManager("./prroducts.txt");

  await manager.addProduct(
    "producto prueba 7",
    "Este es un producto prueba",
    500,
    "Sin imagen",
    "abcd1234",
    55
  );

  console.log(await manager.getProducts());

  console.log("Producto 1:")
  console.log(await manager.getProductById(1));

  await manager.updateProduct(1, { title: "Updated product", price: 999 });
  console.log("Producto 1 luego del update:")
  console.log(await manager.getProductById(1));

  await manager.deleteProduct(1);
}

main();

// module.exports = new ProductManager();
