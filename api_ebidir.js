app.get('/makeGetRequest', async (req, res) => {
    const notify_url = "https://api-kccm.purposeblacketh.com/individual/order/notify";
    const return_url_success = "https://api-kccm.purposeblacketh.com/individual/order/success";
    const return_url_failure = "https://api-kccm.purposeblacketh.com/individual/order/failure";
    const temp_cart = [
        {
            item_image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img2.webp",
            item_name: "Samsung galaxy Note 10",
            item_spec: "256GB, Navy Blue",
            item_price: 100,
            item_quantity: 2,
        },
        {
            item_image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img3.webp",
            item_name: "Onyx Black",
            item_spec: "Canon EOS M50",
            item_price: 100,
            item_quantity: 1,
        },
        {
            total_price: 1200,
            notify_url: notify_url,
            return_url_success: return_url_success,
            return_url_failure: return_url_failure,
            order_id: 80000
        }
    ];
    const orderItems = temp_cart.slice(0, -1).map(item => ({
        item_image: item.item_image,
        item_name: item.item_name,
        item_price: item.item_price,
        item_quantity: item.item_quantity,
        item_spec: item.item_spec,
    }));

    const orderInfo = {
        total_price: temp_cart[temp_cart.length - 1].total_price,
        notify_url: temp_cart[temp_cart.length - 1].notify_url,
        return_url_success: temp_cart[temp_cart.length - 1].return_url_success,
        return_url_failure: temp_cart[temp_cart.length - 1].return_url_failure,
        order_id: temp_cart[temp_cart.length - 1].order_id,
    };

    try {
        const iv = "e04e29b5bb035700";
        const secret_key = 'e-bidr@asbeza@kegbrew';
        let hashed_secret_key = crypto.createHash('sha256').update(secret_key).digest('hex');
        hashed_secret_key = hashed_secret_key.slice(0, 32);
        console.log(hashed_secret_key);

        const csrf_token = 'e04e29b5bb035700acf780409c979f77'
        let cipher = crypto.createCipheriv('aes-256-cbc', hashed_secret_key, iv);
        let encrypted = cipher.update(csrf_token, 'utf-8', 'base64');
        encrypted += cipher.final('base64');

        // Make GET request to the PHP endpoint
        const response = await axios.post('http://localhost/ebidir-asbeza-1/getdata.php', {
            temp_cart: {
                orderItems: orderItems,
                orderInfo: orderInfo,
            },
            csrf_token: csrf_token

        }, {
            headers: {
                'Content-Type': 'application/json',
                'API-Key': `purpose_black:${encrypted}`,
            },
        });

        console.log(response.data);

    } catch (error) {
        console.log(error.message);
    }

});
    