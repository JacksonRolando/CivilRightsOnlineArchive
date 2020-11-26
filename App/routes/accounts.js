module.exports = {
    adminLoginPage : (req, res) => {
        res.render('adminLogin')
    },
    adminLoginSubmit : (req, res) => {
        
        res.redirect('/')
    }

}