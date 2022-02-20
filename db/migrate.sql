-- Fruit
CREATE TABLE fruit
(
    id    SERIAL CONSTRAINT fruit_pk PRIMARY KEY,
    name  TEXT              NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX fruit_name_uindex ON fruit (name);
ALTER TABLE fruit OWNER TO fruity;

-- Customer
CREATE TABLE customer
(
    id   SERIAL CONSTRAINT customer_pk PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL
);
ALTER TABLE customer OWNER TO fruity;

CREATE UNIQUE INDEX customer_name_uindex ON customer (name);

-- OrderItem
CREATE TABLE order_item
(
    id          SERIAL CONSTRAINT order_item_pk PRIMARY KEY,
    customer_id INTEGER NOT NULL CONSTRAINT order_item_customer_id_fk REFERENCES customer,
    fruit_id    INTEGER NOT NULL CONSTRAINT order_item_fruit_id_fk REFERENCES fruit,
    quantity    INTEGER DEFAULT 0 NOT NULL
);
ALTER TABLE order_item OWNER TO fruity;