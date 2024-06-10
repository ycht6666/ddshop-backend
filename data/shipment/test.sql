--查找客戶資訊
select member.id,member.name,member.phone,member.address,member.account 
From member 
WHERE member.id =2

--尋找7-11收件人
select storename,storeaddress,phone,name
From shipment_address 
WHERE member_id =1



--寫入7-11收件人資料庫語法
    INSERT INTO shipment_address (storeid, storename, storeaddress, outside, ship, phone, name, member_id,created_at,updated_at)
    VALUES (163512,"六工門市","基隆市七堵區工建路1之22號1之23號1樓",0,1111111,912345678,"謝承家",1,NOW(),NOW())

--寫入一般送貨到家地址
    INSERT INTO member_address (member_id, name, city, district, address, phone, is_default,created_at,updated_at)
    VALUES (2,"功課好多","基隆市","七堵區","工建路1段722號",0912345678,0,NOW(),NOW())

--查出7-11收件人資訊
select shipment_address.storename,shipment_address.storeaddress,shipment_address.phone,shipment_address.name,shipment_address.ship_method
From shipment_address 
WHERE shipment_address.id = '93cb0177-462a-4069-8799-e6ef6b37468e'

--查出一般地址收件人資訊
select member_address.id,member_address.member_id,member_address.name,member_address.city,member_address.district,member_address.address,member_address.is_default,member_address.phone
From member_address 
join `member`
on member_address.member_id = member.id
WHERE member_id =1 

--更新優惠券使用狀態
select coupon.id,coupon.name,coupon.money,coupon_send_management.user_id,coupon_send_management.usage_status
From coupon
join coupon_send_management
on coupon.id = coupon_send_management.coupon_id
WHERE coupon_send_management.user_id = 1 AND coupon_send_management.usage_status ='未使用'

--獲取訂單明細資料
select * 
from `order`
join order_details
on order.id = order_details.order_id
WHERE `order`.id = 412 AND member_id = 1


--訂單列表獲取訂單
 
SELECT 
    `order`.id,
    `order`.total_cost,
    `order`.order_status,
    `order`.payment_status,
    order_details.ph1,
    order_details.color,
    order_details.product_quantity,
    order_details.id
FROM 
    `order`
JOIN 
    order_details ON `order`.id = order_details.order_id
WHERE 
    `order`.member_id = 1 
GROUP BY 
    `order`.id;

--搜尋訂單編號或是商品名稱

SELECT 
    `order`.id as order_id,
    `order`.total_cost,
    `order`.order_status,
    `order`.payment_status,
    order_details.ph1,
    order_details.color,
    order_details.product_quantity,
    order_details.name,
    order_details.id as details_id
FROM 
    `order`
JOIN 
    order_details ON `order`.id = order_details.order_id
WHERE 
    `order`.member_id = 1
    AND (order_id LIKE '%""%' OR order_details.name LIKE '%""%')
GROUP BY 
    `order`.id;





