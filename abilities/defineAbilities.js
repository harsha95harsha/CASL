const { AbilityBuilder , Ability} = require('@casl/ability');

const db = require('../config/db');
// const user = require('../models/userModel');
async function defineAbilitiesFor(user) {
  // const { can, cannot, build } = new AbilityBuilder(Ability);

  // if (user.role === 'admin') {
  //   // Admins can manage everything
  //   can('manage', 'all');
  // } else {
  //   // For non-admin users, define specific subject-based permissions
  //   const subjects = ['Article', 'User']; // Add any other subjects here
    
  //   subjects.forEach(subject => {
  //     can('read', subject); // Can read all subjects
  //     can('create', subject); // Cannot create
  //     can('update', subject, { author_id: user.user_sno }); // Can update their own subject based on author_id
  //     can('delete', subject, {author_id:user.user_sno});

  //   });
  // }
  // return build();
  // const { can, cannot, build } = new AbilityBuilder(Ability);
  // const rolePermissions = permissions[user.role] || permissions.default;

  // if (rolePermissions.manage && rolePermissions.manage.includes('all')) {
  //   can('manage', 'all');
  // } else {
  //   // General permissions for each action
  //   for (const action in rolePermissions) {
  //     if (action === 'manage') continue;

  //     const subjects = rolePermissions[action];
  //     for (const [subject, conditions] of Object.entries(subjects)) {
  //       if (typeof conditions === 'object') {
  //         // If conditions exist, apply them based on the user’s own properties
  //         can(action, subject, { [conditions.author_id]: user.user_sno });
  //         console.log(`Permission granted: ${action} on ${subject} with condition ${JSON.stringify(conditions)}`)
  //       } else {
  //         can(action, subject); // Simple permission without conditions
  //         console.log(`Permission granted: ${action} on ${subject}`);
  //       }
  //     }
  //   }
  // }

  //  // Define restricted actions
  //  if (rolePermissions.restrictedActions) {
   
  //   for (const [action, subjects] of Object.entries(rolePermissions.restrictedActions)) {
  //     const subjectsArray = Array.isArray(subjects) ? subjects : [subjects];
  //     subjectsArray.forEach(subject => {
  //       cannot(action, subject);
  //       console.log(`Restricted: Cannot ${action} on ${subject}`);
  //     });
  //   }
  // }
  // return build();



  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    can('manage', 'all'); // Admin can manage everything
  }
  else {
    // // Define permissions for non-admin users
    // can('create', 'Article');
   
    // can('read', ['Article', 'User']);

    // can(['update', 'delete'], 'Article', { author_id: user.user_sno }); // Users can only update or delete their own articles
    // can('update', 'User', {user_sno:user.user_sno}); //Users can only update their own user details
    // cannot('update', 'User', { user_sno: { $ne: user.user_sno } }); // Users cannot update other users
    
    // // Non-admins can update their own articles and details
    // can('update', 'Article', { author_id: user.user_sno });
    // can('update', 'User', { user_sno: user.user_sno });
    
    // // Non-admins can delete their own articles
    // can('delete', 'Article', { author_id: user.user_sno });

    // // Restrict creating or deleting users
    // cannot('create', 'User');
    // cannot('delete', 'User');

    const permissions = await db.Permissions.findAll({ where: { user_sno: user.user_sno } });
    permissions.forEach(permission => {
      can(permission.action, permission.subject);
    });

    can('update', 'User', { user_sno: user.user_sno });
 can('update', 'Article', { author_id: user.user_sno });
 can('delete', 'Article', { author_id: user.user_sno });
    // Prevent regular users from updating permissions
    cannot('update', 'Permission');

    // Prevent regular users from updating other users
      cannot('update', 'User', { user_sno: { $ne: user.user_sno } });
      cannot('update', 'Article',{author_id:{$ne:user.user_sno}} );
      cannot('delete', 'Article', {author_id:{$ne:user.user_sno}});
  }
  

  
  return build();
}





// const ability = defineAbilitiesFor();
// const isAllowed = ability.can('read', 'Article');
// console.log(isAllowed);
module.exports = { defineAbilitiesFor };
