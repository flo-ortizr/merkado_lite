import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Cart } from "./cart.entity";
import { CartItem } from "src/cart_item/cart_item.entity";
import { AddToCartDto } from "./dto/add_to_cart.dto";
import { UpdateCartItemDto } from "./dto/update_cart_item.dto";
import { Product } from "src/product/product.entity";
import { Inventory } from "src/inventory/inventory.entity";
import { Customer } from "src/customer/customer.entity";

@Injectable()
export class CartService {

  // Obtener o crear carrito activo
  async getCart(customerId: number) {
    let cart = await AppDataSource.manager.findOne(Cart, {
      where: { customer: { id_customer: customerId }, status: 'active' },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const customer = await AppDataSource.manager.findOneBy(Customer, { id_customer: customerId });
      if (!customer) throw new Error('Cliente no encontrado');

      cart = AppDataSource.manager.create(Cart, {
        customer,
        status: 'active',
        items: []
      });

      await AppDataSource.manager.save(Cart, cart);
    }

    return cart;
  }

  // AGREGAR PRODUCTO AL CARRITO
  async addToCart(customerId: number, dto: AddToCartDto) {
    const cart = await this.getCart(customerId);

    // verificar producto
    const product = await AppDataSource.manager.findOneBy(Product, { id_product: dto.productId });
    if (!product) throw new Error('Producto no encontrado');

    // verificar inventario
    const inventory = await AppDataSource.manager.findOne(Inventory, {
      where: { product: { id_product: dto.productId } }
    });

    if (!inventory) throw new Error('Inventario no encontrado');

    // validar stock
    if (inventory.quantity < dto.quantity) {
      throw new Error('Stock insuficiente');
    }

    // reducir stock
    inventory.quantity -= dto.quantity;
    await AppDataSource.manager.save(Inventory, inventory);

    // agregar o actualizar item
    let item = cart.items.find(i => i.product.id_product === product.id_product);

    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = AppDataSource.manager.create(CartItem, {
        cart,
        product,
        quantity: dto.quantity
      });
      cart.items.push(item);
    }

    await AppDataSource.manager.save(CartItem, item);

    // retornar carrito actualizado
    return this.getCart(customerId);
  }

  // EDITAR CANTIDAD DE ITEM
  async updateCartItem(customerId: number, itemId: number, dto: UpdateCartItemDto) {
  const cart = await this.getCart(customerId);

  const item = cart.items.find(i => i.id_cart_item === itemId);
  if (!item) throw new Error('Item no encontrado');

  // Inventario del producto
  const inventory = await AppDataSource.manager.findOne(Inventory, {
    where: { product: { id_product: item.product.id_product } }
  });

  if (!inventory) throw new Error('Inventario no encontrado');

  const cantidadAnterior = item.quantity;
  const cantidadNueva = dto.quantity;
  const diferencia = cantidadNueva - cantidadAnterior;

  // Si necesita más cantidad
  if (diferencia > 0) {
    if (inventory.quantity < diferencia) {
      throw new Error('Stock insuficiente');
    }
    inventory.quantity -= diferencia;
  }

  // Si reduce cantidad → devolver al inventario
  if (diferencia < 0) {
    inventory.quantity += Math.abs(diferencia);
  }

  // Guardar inventario actualizado
  await AppDataSource.manager.save(Inventory, inventory);

  // actualizar item
  item.quantity = cantidadNueva;
  await AppDataSource.manager.save(CartItem, item);

  return this.getCart(customerId);
}

  // ELIMINAR ITEM DEL CARRITO
  async removeCartItem(customerId: number, itemId: number) {
  const cart = await this.getCart(customerId);

  const item = cart.items.find(i => i.id_cart_item === itemId);
  if (!item) throw new Error('Item no encontrado');

  const inventory = await AppDataSource.manager.findOne(Inventory, {
    where: { product: { id_product: item.product.id_product } }
  });

  if (!inventory) throw new Error('Inventario no encontrado');

  // Devolver toda la cantidad al inventario
  inventory.quantity += item.quantity;
  await AppDataSource.manager.save(Inventory, inventory);

  // eliminar item
  await AppDataSource.manager.remove(CartItem, item);

  return this.getCart(customerId);
}
}
