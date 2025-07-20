const orderController = require('../controllers/orderController')

test('order should return success ', () => {
    expect(orderController.createOrder())
})