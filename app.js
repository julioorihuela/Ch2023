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
      let products;
      if (fs.existsSync(`${this.path}`)) {
        console.log ("punto 1");
        products = await this.getProducts();
      } else {
        products = [];
      }
      products.push(product);
      await fs.promises.writeFile(
        `${this.path}`,
        JSON.stringify(products, null, 2)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async getProducts() {
    try {
      let data;
      if (fs.existsSync(`${this.path}`))  {
        return await fs.promises.readFile(`${this.path}`, "utf-8");
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
}

main();
