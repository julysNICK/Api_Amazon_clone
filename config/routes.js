module.exports = app => {

    app.route('/users/login')
            .post(app.api.auth.signin)
    app.route('/users')
        .post(app.api.users.save)
        .get(app.api.users.getUsers)
    app.route('/category')
            .post(app.api.category.save)
    app.route('/products')
        .get(app.api.product.getPagination)
        .post(app.api.product.save)
    app.route('/products/:id')
         .get(app.api.product.getById)
         .put(app.api.product.save)
         .delete(app.api.product.remove)


}