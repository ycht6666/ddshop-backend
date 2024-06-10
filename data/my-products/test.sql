SELECT
products.id AS product_id,
  product_color.id AS product_color_id,
  products.name AS product_name,
  products.price,
  products.tag_id,
  tag_name,
  products.mt_id,
  mt_name,
  products.st_id,
  st_name,
  products.ma_id,
  ma_name,
  color.id AS color_id,
  color.color_name AS color_name,
  color,
  size_id,
  size_name,
  stock,
  ph1,
  ph2,
  ph3,
  ph4,
  ph5
FROM products 
JOIN tag ON products.tag_id = tag.id 
JOIN main_type ON products.mt_id = main_type.id
JOIN style ON products.st_id = style.id
JOIN material ON products.ma_id = material.id
JOIN product_color ON product_color.product_id = products.id
JOIN color ON color.id = product_color.color_id
JOIN product_color_size ON product_color_size.product_color_id = product_color.id
JOIN size ON  size.id = product_color_size.size_id
WHERE product_id = (SELECT product_id FROM product_color WHERE product_color.id = 110611)


SELECT products.id AS product_id,
  product_color.id AS product_color_id,
  products.name AS product_name,
  products.price,
  products.tag_id,
  tag_name,
  products.mt_id,
  mt_name,
  products.st_id,
  st_name,
  products.ma_id,
  ma_name,
  color.id AS color_id,
  color.color_name AS color_name,
  color,
  ph1,
  ph2
FROM products
JOIN tag ON products.tag_id = tag.id 
JOIN main_type ON products.mt_id = main_type.id
JOIN style ON products.st_id = style.id
JOIN material ON products.ma_id = material.id
JOIN product_color ON product_color.product_id = products.id
JOIN color ON color.id = product_color.color_id
WHERE price <= 1500 and products.mt_id = 2
ORDER BY products.id asc
-- LIMIT 12 OFFSET 0 

SELECT
*
FROM products
JOIN main_type ON products.mt_id = main_type.id
JOIN product_size_chart ON product_size_chart.mt_id = main_type.id
WHERE products.id = 11061

WITH RankedProducts AS (
        SELECT product_color_id
        FROM order_details
        GROUP BY product_color_id
        ORDER BY COUNT(product_color_id) DESC
      )
SELECT
products.id AS product_id,
  product_color.id AS product_color_id,
  products.name AS product_name,
  products.price,
  products.tag_id,
  tag_name,
  products.mt_id,
  mt_name,
  products.st_id,
  st_name,
  products.ma_id,
  ma_name,
  color.id AS color_id,
  color.color_name AS color_name,
  color,
  ph1,
  ph2
FROM products 
JOIN tag ON products.tag_id = tag.id 
JOIN main_type ON products.mt_id = main_type.id
JOIN style ON products.st_id = style.id
JOIN material ON products.ma_id = material.id
JOIN product_color ON product_color.product_id = products.id
JOIN RankedProducts rp ON product_color.id = rp.product_color_id
JOIN color ON color.id = product_color.color_id
LEFT JOIN favorite as fa ON fa.pid = product_color.id 
AND fa.uid = 1
-- WHERE favorite.uid = 1

SELECT pid from favorite WHERE uid = 1
-- size.`size_name`,
-- product_color_size.stock

-- JOIN product_color_size ON product_color_size.product_color_id = product_color.id
-- JOIN size ON  size.id = product_color_size.size_id
-- JOIN product_size_chart ON product_size_chart.mt_id = main_type.id
-- WHERE products.id = 1

-- 與標籤表連接(男生,女生)
-- 與主分類表連接(,)
-- 與風格表連接(,)
-- 與材質表連接(,)
-- 與商品顏色關聯表連接(,)
-- 與商品顏色表連接(,)
-- 與商品尺寸關聯表連接(,)
-- 與商品尺寸表連接(,)
-- 與商品尺寸圖關聯表連接(,)

-- --單選 品牌
-- "products": [
--             {
--                 "product_id": 23031,
--                 "product_color_id": 230313,
--                 "product_name": "合身棉質短褲",
--                 "price": 999,
--                 "tag_id": 2,
--                 "tag_name": "男裝",
--                 "mt_id": 3,
--                 "mt_name": "短褲",
--                 "st_id": 3,
--                 "st_name": "休閒",
--                 "ma_id": 2,
--                 "ma_name": "純棉",
--                 "color_id": 4,
--                 "color_name": "淺藍",
--                 "color": "#ADD8E6",
--                 "ph1": "/main-card/男-H&M-合身棉質短褲-淺藍色-休閒風-內1.webp",
--                 "ph2": "/main-card/男-H&M-合身棉質短褲-淺藍色-休閒風-內2.webp",
--                 "ph3": "/main-card/男-H&M-合身棉質短褲-淺藍色-休閒風-內4.webp",
--                 "ph4": "/main-card/男-H&M-合身棉質短褲-淺藍色-休閒風-內5.webp",
--                 "ph5": ""
--             }

SELECT fa.pid
FROM favorite AS fa
 WHERE fa.uid = 1
 ORDER BY fa.pid ASC;

INSERT INTO favorite (uid, pid)
VALUES (1,210111);

DELETE FROM favorite 
WHERE uid = 2 AND pid = 110712 

SELECT product_color_id
FROM order_details  GROUP BY product_color_id ORDER BY COUNT(product_color_id) DESC

SELECT products.id
FROM products 
JOIN product_color pc on pc.product_id = products.id 
WHERE pc.id =  210111     

SELECT products.st_id 
FROM products
WHERE products.id = (SELECT products.id
FROM products 
JOIN product_color pc on pc.product_id = products.id 
WHERE pc.id =  210111 )

SELECT products.id
FROM products
WHERE st_id = (SELECT products.st_id 
FROM products
WHERE products.id = (SELECT products.id
FROM products 
JOIN product_color pc on pc.product_id = products.id 
WHERE pc.id =  210111 ))

WITH recommend AS(
SELECT products.id
FROM products
WHERE st_id = (SELECT products.st_id 
FROM products
WHERE products.id = (SELECT products.id
FROM products 
JOIN product_color pc on pc.product_id = products.id 
WHERE pc.id =  210111 ))
LIMIT 3
)
SELECT products.id AS product_id,
  product_color.id AS product_color_id,
  products.name AS product_name,
  products.price,
  products.tag_id,
  tag_name,
  products.mt_id,
  mt_name,
  products.st_id,
  st_name,
  products.ma_id,
  ma_name,
  color.id AS color_id,
  color.color_name AS color_name,
  color,
  ph1,
  ph2 
FROM products 
JOIN recommend rc ON products.id = rc.id
JOIN tag ON products.tag_id = tag.id 
JOIN main_type ON products.mt_id = main_type.id
JOIN style ON products.st_id = style.id
JOIN material ON products.ma_id = material.id
JOIN product_color ON product_color.product_id = products.id
JOIN color ON color.id = product_color.color_id



SELECT products.mt_id 
FROM products
WHERE products.id = (SELECT products.id
FROM products 
JOIN product_color pc on pc.product_id = products.id 
WHERE pc.id =  210111 )

SELECT size_chart
FROM product_size_chart as psc
WHERE psc.mt_id =(SELECT products.mt_id 
FROM products
WHERE products.id = (SELECT products.id
FROM products 
JOIN product_color pc on pc.product_id = products.id 
WHERE pc.id =  210111 ))