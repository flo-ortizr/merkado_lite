import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PurchaseOrder } from './purchase_order/purchase_order.entity';
import { PromotionModule } from './promotion/promotion.module';
import { ProductModule } from './product/product.module';
import { PriceHistoryModule } from './price_history/price_history.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order_detail/order_detail.module';
import { NotificationModule } from './notification/notification.module';
import { InventoryModule } from './inventory/inventory.module';
import { InstoreSaleModule } from './instore_sale/instore_sale.module';
import { InstoreSaleDetailModule } from './instore_sale_detail/instore_sale_detail.module';
import { DeliveryModule } from './delivery/delivery.module';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { AuditLogModule } from './audit_log/audit_log.module';
import { ReturnModule } from './return/return.module';

@Module({
  imports: [UserModule, RoleModule, ReturnModule, PurchaseOrder, PromotionModule, ProductModule, PriceHistoryModule, OrderModule, OrderDetailModule, NotificationModule,
    InventoryModule, InstoreSaleModule, InstoreSaleDetailModule, DeliveryModule, CustomerModule, CategoryModule, AuditLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
