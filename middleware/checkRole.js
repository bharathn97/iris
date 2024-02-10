const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && allowedRoles.includes(req.user.role)) {
      return next();
    } else {
      console.error('Unauthorized');
      res.status(401).send('Unauthorized');
    }
  };
};

const assignRole = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.role = req.user.role;
  }
  next();
};

const validateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    const role = req.user.role;
    if (role === 'admin') {
      return validateAdminUser(req, res, next);
    } else if (role === 'student') {
      return validateStudentUser(req, res, next);
    } else {
      console.error('Invalid role');
      res.status(401).send('Invalid role');
    }
  } else {
    console.error('User not authenticated');
    res.status(401).send('User not authenticated');
  }
};

module.exports = { checkRole, validateUser, assignRole };
