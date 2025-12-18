import { DataSource } from "typeorm"
import { User } from "./user/user.entity"
import { Role } from "./role/role.entity"
import { Product } from "./product/product.entity"
import { Category } from "./category/category.entity"
import { Order } from "./order/order.entity"
import { OrderDetail } from "./order_detail/order_detail.entity"
import { Supplier } from "./supplier/supplier.entity"
import { Inventory } from "./inventory/inventory.entity"
import { InStoreSale } from "./instore_sale/instore_sale.entity"
import { InStoreSaleDetail } from "./instore_sale_detail/instore_sale_detail.entity"
import { PurchaseOrder } from "./purchase_order/purchase_order.entity"
import { Customer } from "./customer/customer.entity"
import { AuditLog } from "./audit_log/audit_log.entity"
import { Promotion } from "./promotion/promotion.entity"
import { PriceHistory } from "./price_history/price_history.entity"
import { Delivery } from "./delivery/delivery.entity"
import {Notification} from "./notification/notification.entity"
import { Cart } from "./cart/cart.entity"
import { CartItem } from "./cart_item/cart_item.entity"
import { PurchaseOrderItem } from "./purchase_order_item/purchase_order_item.entity"

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: true,
  logging: true,

  entities: [
    Role, User, Product, Category, Order, OrderDetail,
    Supplier, Inventory, InStoreSale, InStoreSaleDetail,
    PurchaseOrder, PurchaseOrderItem, Customer, AuditLog,
    Notification, Promotion, PriceHistory, Delivery,
    Cart, CartItem
  ],
});
export class AppModule {}