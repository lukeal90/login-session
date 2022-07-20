const { AuthController } = require('../../controllers');

module.exports = router => {
    router.get("/", AuthController.home);
    router.get("/login", AuthController.getLogin);
    router.post("/login", AuthController.postLogin);
    router.get("/logout", AuthController.logout);
    router.get("/currentUser", AuthController.currentUser);
    return router;
};