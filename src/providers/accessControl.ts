import { newModel, StringAdapter } from 'casbin';

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new StringAdapter(`
p, customer, report, (list)
p, customer, dashboard, (list)

p, customer, order-management, (list)
p, customer, orders, (list)|(create)
p, customer, orders/*, (show)|(delete)
p, customer, orders/*, field

p, customer, upload-orders, (list)|(create)
p, customer, upload-orders/*, (show)|(delete)
p, customer, upload-orders/*, field

p, customer, reconciliations, (list)
p, customer, reconciliations/*, (show)

p, customer, trackings, (list)
p, customer, trackings/*, (show)
p, customer, trackings/*, field

p, customer, settings, (list)
p, customer, me, (list)|(edit)
p, customer, me/*, (show)|(edit)
p, customer, me/*, field

p, customer, addresses, (list)|(edit)|(show)|(create)|(delete)
p, customer, addresses/*, (show)|(edit)|(create)
p, customer, addresses/*, field

p, admin, report, (list)
p, admin, dashboard, (list)
p, admin, report-reconciliations, (list)
p, admin, report-reconciliations/partner, field
p, admin, report-reconciliations/revenue, field

p, admin, order-management, (list)
p, admin, orders, (list)|(create)|(edit)|(show)|(delete)
p, admin, orders/*, (list)|(create)|(edit)|(show)
p, admin, orders/*, field

p, admin, trackings, (list)
p, admin, trackings/*, (show)
p, admin, trackings/*, field

p, admin, reconciliations, (edit)|(show)|(list)|(create)|(delete)
p, admin, reconciliations/*, (edit)|(show)|(list)|(create)|(delete)
p, admin, reconciliations/revenue, field

p, admin, reconciliation-order, (edit)|(show)|(list)|(create)|(delete)
p, admin,  reconciliation-order/*, (edit)|(show)|(list)|(create)|(delete)
p, admin,  reconciliation-order/revenue, field

p, admin, user-management, (list)
p, admin, users, (list)|(create)
p, admin, users/*, (edit)|(show)

p, admin, client, (list)|(create)
p, admin, client/*, (edit)|(show)
p, admin, client/export, field

p, admin, finances, (list)
p, admin, bank-accounts, (edit)|(show)|(list)|(create)|(delete)|(clone)
p, admin, bank-accounts/*, (edit)|(list)|(create)|(delete)|(clone)

p, admin, settings, (list)
p, admin, price-sheets, (edit)|(show)|(list)|(create)|(delete)|(clone)
p, admin, price-sheets/*, (edit)|(list)|(create)|(delete)|(clone)

p, admin, customer-prices, (edit)|(show)|(list)|(create)|(delete)
p, admin, customer-prices/*, (edit)|(show)|(list)|(create)|(delete)

p, admin, me, (list)
p, admin, me/*, (show)|(edit)
p, admin, me/*, field

p, sale, report, (list)
p, sale, dashboard, (list)
p, sale, report-reconciliations, (list)

p, sale, order-management, (list)
p, sale, orders, (list)|(create)|(edit)|(show)|(delete)
p, sale, orders/*, (show)|(delete)
p, sale, orders/*, field

p, sale, reconciliations, (list)
p, sale, reconciliations/*, (show)

p, sale, trackings, (list)
p, sale, trackings/*, (show)
p, sale, trackings/*, field

p, sale, user-management, (list)
p, sale, client, (list)|(create)
p, sale, client/*, (show)

p, sale, settings, (list)

p, sale, me, (list)
p, sale, me/*, (show)|(edit)
p, sale, me/*, field


p, account, report, (list)
p, account, dashboard, (list)
p, account, report-reconciliations, (list)
p, account, report-reconciliations/partner, field

p, account, order-management, (list)
p, account, orders, (list)|(create)|(edit)|(show)|(delete)
p, account, orders/*, (show)|(delete)
p, account, orders/*, field

p, account, reconciliations, (edit)|(show)|(list)|(create)|(delete)
p, account, reconciliations/*, (edit)|(show)|(list)|(create)|(delete)
p, account, reconciliations/revenue, field

p, account, reconciliation-order, (edit)|(show)|(list)|(create)|(delete)
p, account,  reconciliation-order/*, (edit)|(show)|(list)|(create)|(delete)
p, account,  reconciliation-order/revenue, field

p, account, finances, (list)
p, account, bank-accounts, (show)|(list)
p, account, bank-accounts/*, (list)

p, account, settings, (list)
p, account, price-sheets, (edit)|(show)|(list)|(create)|(delete)|(clone)
p, account, price-sheets/*, (edit)|(list)|(create)|(delete)|(clone)

p, account, customer-prices, (edit)|(show)|(list)|(create)|(delete)
p, account, customer-prices/*, (edit)|(show)|(list)|(create)|(delete)

p, account, me, (list)
p, account, me/*, (show)|(edit)
p, account, me/*, field

p, customer_care, order-management, (list)
p, customer_care, orders, (list)|(create)|(edit)|(show)|(delete)
p, customer_care, orders/*, (show)|(delete)|(edit)
p, customer_care, orders/*, field


p, customer_care, user-management, (list)
p, customer_care, client, (list)|(create)
p, customer_care, client/*, (show)

p, customer_care, settings, (list)

p, customer_care, me, (list)
p, customer_care, me/*, (show)|(edit)
p, customer_care, me/*, field

`);
