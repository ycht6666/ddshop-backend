SELECT
    *
FROM
    (
    SELECT
        order_details.id,
        order_details.name,
        order_details.size,
        order_details.color,
        order_details.ph1,
        product_color.product_id
    FROM
        product_color
    JOIN order_details ON order_details.product_color_id = product_color.id
)AS total
WHERE
    id = 272