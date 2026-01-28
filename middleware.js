module.exports.isLoggedIn = (req, res, next) => { 
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/user/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        // Save the original URL to redirect back after login
        
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.valiDate = async (req, res, next) => {
     let reserveData = await req.body;
     checkin= new Date(reserveData.checkin);
     checkout=new Date(reserveData.checkout);
     const utcCheckin = Date.UTC(checkin.getFullYear(), checkin.getMonth(), checkin.getDate());
     const utcCheckout = Date.UTC(checkout.getFullYear(), checkout.getMonth(), checkout.getDate());

     const timeDiff = utcCheckout - utcCheckin;
     const nights = timeDiff / (1000 * 60 * 60 * 24);
     
     if (nights < 1) {
         req.flash("error", "Checkin and Checkout date is not valid");
         return res.redirect("/listing/"+req.params.id);
     }
     next();
}