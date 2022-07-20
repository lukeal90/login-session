const pathPublic = process.cwd() + "/public/";
const User = require('../models/user');

class AuthController {

    static async home(req, res) {
        try {
          if (!req.session.user) {
            res.redirect("/login");
          } else {
            res.sendFile(pathPublic + "home.html");
          }
        } catch (error) {
            res.send(error.message);
        }
    }

    static async getLogin(req, res){
        try {
          if(!req.session.user){
            res.sendFile(pathPublic + "login.html");
          }else{
            res.sendFile(pathPublic + "home.html");
          }
        } catch (error) {
          res.send(error.message);
        }
      };
      
    static async postLogin(req, res){
        try {
            const {username} = req.body;
            if(username){
                req.session.user = username;
                res.redirect('/');
            }else{
                res.redirect('/login');
            }
        } catch (error) {
          res.send(error.message)
        }
      };
      
    static async logout(req, res ){
        try {
          if (req.session) {
            req.session.destroy((err) => {
              res.redirect("/");
            });
          }
        } catch (error) {
            res.send(error.message);
        }
    };    
      
    static async currentUser(req, res){
        try {
          res.json({username : req.session.user});
        } catch (error) {
            res.send(error.message);

        }
    };      
}    

module.exports = AuthController;