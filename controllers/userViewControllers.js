// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// blood donation
// blood donation home
exports.login = (req, res) => {
    if (res.locals.user) {
        return res.redirect('/');
    }
    return res.render('shared/login');
};

// get view docs
exports.getViewDocs = (req,res,)=>res.status(200).render('');