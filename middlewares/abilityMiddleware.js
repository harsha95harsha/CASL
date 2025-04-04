const { ForbiddenError } = require('@casl/ability');
const { defineAbilitiesFor } = require('../abilities/defineAbilities');

function checkAbility(action, subject) {
  return async (req, res, next) => {
    try {
      const abilities = await defineAbilitiesFor(req.user);
      console.log('Checking permission:', action, subject);
      console.log('User abilities:', abilities.rules);  
      ForbiddenError.from(abilities).throwUnlessCan(action, subject);
      next();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        console.log(`Access denied for action ${action} on ${subject}`);
        return res.status(403).json({ message: "Access Denied..You do not have permission to perform this action" });
      }
      next(error);
    }
  };
}

// function checkAbility(action) {
//   return async (req, res, next) => {
//     try {
//       console.log('User:', req.user)
//       // Dynamically infer the subject based on the route or request context
//       const pathParts = req.path.split('/').filter(Boolean); // ["articles", "getall"] or ["posts", "1"]
//       const subject = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1); // e.g., "articles" to "Article"

//       // Define abilities based on the user role
//       const ability = defineAbilitiesFor(req.user);

//       // Check ability using CASL
//       ForbiddenError.from(ability).throwUnlessCan(action, subject);

//       next(); // User is authorized, proceed to controller
//     } catch (error) {
//       console.log(error)
//       res.status(403).json({ message: 'Access denied', error: error.message });
//     }
//   };
// }

module.exports = { checkAbility };
