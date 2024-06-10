SELECT
    od.order_id,od.size,od.color,pr.product_id, pr.id AS reviews_id, pr.ph_1, pr.ph_2, pr.ph_3, pr.content, pr.stars,pr.review_time
FROM
    order_details od
    JOIN
    product_reviews pr ON od.product_reviews_id = pr.id
WHERE pr.product_id=11081;
